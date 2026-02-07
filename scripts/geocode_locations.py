#!/usr/bin/env python3
"""
USG Locations Geocoder

Geocodes addresses from the raw locations data using OpenStreetMap Nominatim.
Implements strict caching, backoff, and fallback handling.

Usage:
    python scripts/geocode_locations.py

Input:
    data/locations_raw.json

Output:
    data/locations_geocoded.json
    data/.geocode_cache.json (persistent cache)
"""

import json
import time
import sys
from pathlib import Path
from urllib.parse import quote_plus

try:
    import requests
except ImportError:
    print("ERROR: Missing requests. Run: pip install -r scripts/requirements.txt")
    sys.exit(1)

# Configuration
INPUT_PATH = Path("data/locations_raw.json")
OUTPUT_PATH = Path("data/locations_geocoded.json")
CACHE_PATH = Path("data/.geocode_cache.json")

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
USER_AGENT = "USGMapRecreation/1.0 (build-time geocoder; https://github.com/example/odd-map)"

# Rate limiting: Nominatim requires max 1 request per second
REQUEST_DELAY = 1.1  # seconds between requests
MAX_RETRIES = 3
BACKOFF_FACTOR = 2.0

# Verified address coordinates (manually geocoded via Google Maps for accuracy)
# These override Nominatim lookups to ensure correct placement
KNOWN_ADDRESSES = {
    # Canonsburg, PA - Town Center Way (actual address, NOT Pittsburgh)
    "1000 Town Center Way, Suite 300, Canonsburg, PA 15317": {
        "lat": 40.2628, "lon": -80.1631, "source": "verified", "confidence": "high", "approximate": False
    },
    # Tampa, FL - Northdale Boulevard (actual address, NOT in ocean)
    "3810 Northdale Boulevard, Suite 190, Tampa, FL 33624": {
        "lat": 28.0787, "lon": -82.5169, "source": "verified", "confidence": "high", "approximate": False
    },
    # Covington, LA - Greengate Drive (actual address, NOT Tampa)
    "1330 Greengate Drive, Suite 150, Covington, LA 70433": {
        "lat": 30.4754, "lon": -90.0829, "source": "verified", "confidence": "high", "approximate": False
    },
    # Arlington, TX - E Border St
    "500 E Border St, Suite 600, Arlington, TX 76010": {
        "lat": 32.7357, "lon": -97.1081, "source": "verified", "confidence": "high", "approximate": False
    },
    # Houston, TX - Northwest Freeway
    "13831 Northwest Freeway, Suite 340, Houston, TX 77040": {
        "lat": 29.8649, "lon": -95.4962, "source": "verified", "confidence": "high", "approximate": False
    },
    # Irvine, CA - Pacifica
    "100 Pacifica, Suite 300, Irvine, CA 92618": {
        "lat": 33.6407, "lon": -117.7448, "source": "verified", "confidence": "high", "approximate": False
    },
    # Sandpoint, ID - Old Power House
    "The Old Power House, 120 East Lake Street, Suite 207, Sandpoint, ID 83864": {
        "lat": 48.2766, "lon": -116.5535, "source": "verified", "confidence": "high", "approximate": False
    },
    # Shoreview, MN - Rice Creek Parkway
    "5985 Rice Creek Parkway, Suite 106, Shoreview, MN 55126": {
        "lat": 45.0567, "lon": -93.1414, "source": "verified", "confidence": "high", "approximate": False
    },
    # Chicago, IL - West Monroe (actual Chicago, NOT Minneapolis)
    "79 West Monroe, Suite 821, Chicago, IL 60603": {
        "lat": 41.8807, "lon": -87.6298, "source": "verified", "confidence": "high", "approximate": False
    },
}

# Known city centroids for satellite offices without specific addresses
# These use business district coordinates (not geographic city centers) for better accuracy
CITY_CENTROIDS = {
    # Philadelphia - Center City business district (slightly inland from waterfront)
    "Philadelphia, Pennsylvania": {"lat": 39.9512, "lon": -75.1645, "approximate": True},
    # Boston - Financial District (inland from harbor)
    "Boston, Massachusetts": {"lat": 42.3554, "lon": -71.0640, "approximate": True},
    # Alpharetta - Technology Corridor
    "Alpharetta, Georgia": {"lat": 34.0754, "lon": -84.2941, "approximate": True},
    # Troy - Big Beaver Road office district
    "Troy, Michigan": {"lat": 42.5803, "lon": -83.1431, "approximate": True},
}

# Region centroids - ONLY used as last resort when nothing else available
REGION_CENTROIDS = {
    "Northeast Region": {"lat": 40.4406, "lon": -79.9959},  # Pittsburgh area
    "Southeast Region": {"lat": 28.0394, "lon": -82.4637},  # Tampa area
    "South Region": {"lat": 32.7767, "lon": -96.7970},      # Dallas area
    "Southern California": {"lat": 33.6846, "lon": -117.8265},  # Irvine area
    "West Region": {"lat": 48.2766, "lon": -116.5535},      # Sandpoint area
    "Midwest Region": {"lat": 45.0408, "lon": -93.1256},    # Minneapolis area
}


def load_cache() -> dict:
    """Load geocoding cache from disk."""
    if CACHE_PATH.exists():
        try:
            with open(CACHE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            pass
    return {}


def save_cache(cache: dict) -> None:
    """Persist geocoding cache to disk."""
    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(cache, f, indent=2, ensure_ascii=False)


def normalize_address(address: str) -> str:
    """Normalize address string for consistent cache keys."""
    # Remove extra whitespace, normalize punctuation
    addr = " ".join(address.split())
    addr = addr.replace("  ", " ").strip()
    return addr


def geocode_address(address: str, cache: dict) -> dict | None:
    """
    Geocode an address using verified lookup or Nominatim.
    
    Returns:
        {"lat": float, "lon": float, "confidence": str, "approximate": bool}
        or None if geocoding fails
    """
    normalized = normalize_address(address)
    
    # Check verified addresses first (highest priority)
    if normalized in KNOWN_ADDRESSES:
        print(f"  [VERIFIED] {normalized[:50]}...")
        return KNOWN_ADDRESSES[normalized].copy()
    
    # Check cache
    if normalized in cache:
        print(f"  [CACHE HIT] {normalized[:50]}...")
        return cache[normalized]
    
    print(f"  [GEOCODING] {normalized[:50]}...")
    
    headers = {"User-Agent": USER_AGENT}
    params = {
        "q": normalized,
        "format": "json",
        "limit": 1,
        "countrycodes": "us",
    }
    
    for attempt in range(MAX_RETRIES):
        try:
            # Rate limiting
            time.sleep(REQUEST_DELAY * (BACKOFF_FACTOR ** attempt))
            
            response = requests.get(
                NOMINATIM_URL,
                params=params,
                headers=headers,
                timeout=10,
            )
            
            if response.status_code == 429:
                print(f"    Rate limited, backing off (attempt {attempt + 1})")
                continue
            
            response.raise_for_status()
            data = response.json()
            
            if data and len(data) > 0:
                result = {
                    "lat": float(data[0]["lat"]),
                    "lon": float(data[0]["lon"]),
                    "confidence": "high",
                    "approximate": False,
                    "source": "nominatim",
                }
                # Cache the result
                cache[normalized] = result
                save_cache(cache)
                return result
            else:
                print(f"    No results found")
                # Cache the miss to avoid repeated lookups
                cache[normalized] = None
                save_cache(cache)
                return None
                
        except requests.exceptions.Timeout:
            print(f"    Timeout (attempt {attempt + 1})")
        except requests.exceptions.RequestException as e:
            print(f"    Request error: {e} (attempt {attempt + 1})")
    
    print(f"    Failed after {MAX_RETRIES} attempts")
    return None


def get_fallback_coords(office: dict) -> dict | None:
    """Get fallback coordinates for an office without a geocodable address."""
    city = office.get("city", "")
    state = office.get("state", "")
    region = office.get("region", "")
    
    # Try city centroid first (now uses curated business district coords)
    city_key = f"{city}, {state}"
    if city_key in CITY_CENTROIDS:
        result = CITY_CENTROIDS[city_key].copy()
        result["source"] = "business_district"
        result["confidence"] = "medium"
        return result
    
    # Try region centroid
    if region in REGION_CENTROIDS:
        result = REGION_CENTROIDS[region].copy()
        result["source"] = "region_centroid"
        result["confidence"] = "very_low"
        result["approximate"] = True
        return result
    
    return None


def geocode_offices(data: dict) -> dict:
    """Geocode all offices in the data."""
    cache = load_cache()
    
    geocoded_count = 0
    fallback_count = 0
    null_count = 0
    
    for region in data.get("regions", []):
        region_name = region.get("name", "Unknown")
        print(f"\nRegion: {region_name}")
        
        for office in region.get("offices", []):
            office["region"] = region_name  # Ensure region is set
            address = office.get("address")
            
            if address:
                coords = geocode_address(address, cache)
                if coords:
                    office["coordinates"] = coords
                    geocoded_count += 1
                else:
                    # Try fallback
                    fallback = get_fallback_coords(office)
                    if fallback:
                        office["coordinates"] = fallback
                        fallback_count += 1
                    else:
                        office["coordinates"] = None
                        null_count += 1
            else:
                # No address, use fallback
                fallback = get_fallback_coords(office)
                if fallback:
                    office["coordinates"] = fallback
                    fallback_count += 1
                    print(f"  [FALLBACK] {office.get('city', 'Unknown')}")
                else:
                    office["coordinates"] = None
                    null_count += 1
                    print(f"  [NULL] {office.get('city', 'Unknown')} - no coords available")
    
    print(f"\n{'='*60}")
    print(f"Geocoding Summary:")
    print(f"  Geocoded:  {geocoded_count}")
    print(f"  Fallback:  {fallback_count}")
    print(f"  Null:      {null_count}")
    
    return data


def main():
    """Main entry point."""
    print("=" * 60)
    print("USG Locations Geocoder")
    print("=" * 60)
    
    # Check input exists
    if not INPUT_PATH.exists():
        print(f"ERROR: Input file not found: {INPUT_PATH}")
        print("Run 'python scripts/scrape_locations.py' first")
        sys.exit(1)
    
    # Load raw data
    with open(INPUT_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Geocode offices
    data = geocode_offices(data)
    
    # Update metadata
    if "metadata" not in data:
        data["metadata"] = {}
    data["metadata"]["geocoded_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    data["metadata"]["geocoder"] = "nominatim"
    
    # Write output
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\nOutput: {OUTPUT_PATH}")
    print("Done!")


if __name__ == "__main__":
    main()
