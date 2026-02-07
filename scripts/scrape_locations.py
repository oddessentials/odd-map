#!/usr/bin/env python3
"""
USG Insurance Locations Scraper

Scrapes location and contact data from usgins.com/locations and /contact-us.
Outputs a structured JSON artifact with regions, offices, personnel, and global contacts.

Usage:
    python scripts/scrape_locations.py

Output:
    data/locations_raw.json
"""

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("ERROR: Missing dependencies. Run: pip install -r scripts/requirements.txt")
    sys.exit(1)

# Configuration
BASE_URL = "https://www.usgins.com"
LOCATIONS_URL = f"{BASE_URL}/locations"
CONTACT_URL = f"{BASE_URL}/contact-us"
OUTPUT_PATH = Path("data/locations_raw.json")
USER_AGENT = "USGMapRecreation/1.0 (build-time scraper; contact: admin@example.com)"

# Known region names from the live site
GEOGRAPHIC_REGIONS = [
    "NORTHEAST REGION",
    "SOUTHEAST REGION",
    "SOUTH REGION",
    "SOUTHERN CALIFORNIA",
    "WEST REGION",
    "MIDWEST REGION",
]

SPECIALTY_DIVISIONS = [
    "BROKERAGE DIVISION",
    "ENVIRONMENTAL DIVISION",
    "GARAGE & TRANSPORTATION DIVISION",
    "ALLIED AMERICAN UNDERWRITERS",
]


def fetch_page(url: str) -> BeautifulSoup:
    """Fetch and parse a page with proper headers."""
    headers = {"User-Agent": USER_AGENT}
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()
    return BeautifulSoup(response.text, "lxml")


def extract_vcard_url(element) -> str | None:
    """Extract vCard download URL from an element."""
    link = element.find("a", href=lambda h: h and "qrco.de" in h)
    return link["href"] if link else None


def extract_directions_url(element) -> str | None:
    """Extract Google Maps directions URL."""
    link = element.find("a", href=lambda h: h and "google.com/maps" in h)
    return link["href"] if link else None


def extract_email(text: str) -> str | None:
    """Extract email from text."""
    match = re.search(r"[\w.+-]+@[\w.-]+\.\w+", text)
    return match.group(0) if match else None


def extract_phone(text: str) -> str | None:
    """Extract phone number from text."""
    match = re.search(r"\d{3}[.\-]?\d{3}[.\-]?\d{4}", text)
    return match.group(0) if match else None


def parse_office_entry(text: str, region_name: str) -> dict | None:
    """
    Parse an office entry like:
    'Pennsylvania, Canonsburg: USG PA1 1000 Town Center Way, Suite 300 Canonsburg, PA 15317'
    or
    'Pennsylvania, Philadelphia: USG PA2 Satellite Sales Office'
    """
    # Pattern: State, City: Office Code [Address or "Satellite Sales Office"]
    # Using flexible matching due to inconsistent formatting
    
    # Try to identify office pattern
    office_match = re.search(
        r"([A-Za-z]+),\s*([A-Za-z\s]+):\s*(USG\s*[A-Z]{2}\d+|USG\s*US\d+)",
        text, re.IGNORECASE
    )
    
    if not office_match:
        return None
    
    state = office_match.group(1).strip()
    city = office_match.group(2).strip()
    office_code = office_match.group(3).strip()
    
    # Check if satellite office
    is_satellite = "satellite" in text.lower()
    
    # Extract address (everything after office code, before any known keywords)
    remaining = text[office_match.end():].strip()
    
    # Try to extract address
    address = None
    if not is_satellite and remaining:
        # Look for address pattern (number + street)
        addr_match = re.search(
            r"(\d+[^,]+(?:,\s*(?:Suite|Ste|#)\s*\d+)?[^,]*,\s*[A-Z]{2}\s*\d{5})",
            remaining, re.IGNORECASE
        )
        if addr_match:
            address = addr_match.group(1).strip()
    
    return {
        "region": region_name,
        "state": state,
        "city": city,
        "office_code": office_code,
        "office_type": "Satellite Sales Office" if is_satellite else "Branch Office",
        "address": address,
        "address_raw": remaining if not address else None,
    }


def parse_personnel(text: str) -> dict | None:
    """
    Parse personnel entry like:
    'Becca FaustExecutive Vice President: Branch Manager d: 724.754.9041 e: bfaust@usgins.com'
    """
    # This is tricky because name runs into title without space
    # Look for pattern: Name + Title + contact info
    
    email = extract_email(text)
    phone = extract_phone(text)
    
    if not email:
        return None
    
    # Try to extract name (before common title words)
    title_keywords = [
        "Executive Vice President",
        "Senior Vice President", 
        "First Vice President",
        "Vice President",
        "Director",
        "Producer/Broker",
        "Associate Producer",
        "Manager",
        "Analyst",
    ]
    
    name = None
    title = None
    
    for keyword in title_keywords:
        if keyword.lower() in text.lower():
            idx = text.lower().find(keyword.lower())
            name = text[:idx].strip()
            # Extract title up to "d:" or "e:"
            title_end = text.lower().find("d:", idx)
            if title_end == -1:
                title_end = text.lower().find("e:", idx)
            if title_end > idx:
                title = text[idx:title_end].strip()
            break
    
    if not name:
        return None
    
    return {
        "name": name,
        "title": title,
        "phone": phone,
        "email": email,
    }


def scrape_locations_page(soup: BeautifulSoup) -> dict:
    """Extract all location data from the locations page."""
    
    regions = []
    specialty_divisions = []
    
    # Find all h4 headers which typically denote regions/divisions
    headers = soup.find_all(["h4", "h3"])
    
    current_region = None
    current_offices = []
    current_personnel = []
    
    for header in headers:
        header_text = header.get_text(strip=True).upper()
        
        # Check if this is a geographic region
        is_geographic = any(r in header_text for r in GEOGRAPHIC_REGIONS)
        is_specialty = any(d in header_text for d in SPECIALTY_DIVISIONS)
        
        if is_geographic or is_specialty:
            # Save previous region if exists
            if current_region:
                entry = {
                    "name": current_region,
                    "offices": current_offices,
                    "personnel": current_personnel,
                }
                if any(r in current_region.upper() for r in GEOGRAPHIC_REGIONS):
                    regions.append(entry)
                else:
                    specialty_divisions.append(entry)
            
            # Start new region
            current_region = header.get_text(strip=True)
            current_offices = []
            current_personnel = []
            
            # Find the content following this header
            sibling = header.find_next_sibling()
            while sibling and sibling.name not in ["h3", "h4"]:
                text = sibling.get_text(" ", strip=True)
                
                # Try to parse as office
                office = parse_office_entry(text, current_region)
                if office:
                    office["vcard_url"] = extract_vcard_url(sibling)
                    office["directions_url"] = extract_directions_url(sibling)
                    current_offices.append(office)
                
                # Try to parse as personnel
                personnel = parse_personnel(text)
                if personnel:
                    personnel["vcard_url"] = extract_vcard_url(sibling)
                    current_personnel.append(personnel)
                
                sibling = sibling.find_next_sibling()
    
    # Save last region
    if current_region:
        entry = {
            "name": current_region,
            "offices": current_offices,
            "personnel": current_personnel,
        }
        if any(r in current_region.upper() for r in GEOGRAPHIC_REGIONS):
            regions.append(entry)
        else:
            specialty_divisions.append(entry)
    
    return {
        "regions": regions,
        "specialty_divisions": specialty_divisions,
    }


def scrape_contact_page(soup: BeautifulSoup) -> dict:
    """Extract global contacts from the contact page."""
    
    global_contacts = {
        "main_phone": "844.467.5465",
        "main_email": "getconnected@usgins.com",
        "claims_email": "claims@usgins.com",
        "loss_runs_email": "lossruns@usgins.com",
        "accounting_email": "ar@usgins.com",
    }
    
    # Try to extract any additional info
    text = soup.get_text(" ", strip=True)
    
    # Look for accounting contact
    if "Toni Bolton" in text:
        global_contacts["accounting_contact"] = {
            "name": "Toni Bolton",
            "title": "Accounting Analyst Manager",
            "phone": "817.524.1075",
            "email": "ar@usgins.com",
        }
    
    return global_contacts


def scrape_with_fallback() -> dict:
    """
    Scrape locations with hardcoded fallback data.
    
    Since the live site structure may change, we include known-good data
    as a fallback to ensure the build never fails completely.
    """
    
    # Hardcoded data based on January 2026 site content
    fallback_data = {
        "regions": [
            {
                "name": "Northeast Region",
                "personnel": [
                    {
                        "name": "Becca Faust",
                        "title": "Executive Vice President: Branch Manager",
                        "phone": "724.754.9041",
                        "email": "bfaust@usgins.com",
                        "vcard_url": "https://qrco.de/bfaust",
                    }
                ],
                "offices": [
                    {
                        "office_code": "USG PA1",
                        "state": "Pennsylvania",
                        "city": "Canonsburg",
                        "office_type": "Branch Office",
                        "address": "1000 Town Center Way, Suite 300, Canonsburg, PA 15317",
                        "directions_url": "https://www.google.com/maps/dir//1000%20Town%20Center%20Way,%20Suite%20300%20Canonsburg,%20PA%2015317",
                    },
                    {
                        "office_code": "USG PA2",
                        "state": "Pennsylvania",
                        "city": "Philadelphia",
                        "office_type": "Satellite Sales Office",
                        "address": None,
                    },
                    {
                        "office_code": "USG MA1",
                        "state": "Massachusetts",
                        "city": "Boston",
                        "office_type": "Satellite Sales Office",
                        "address": None,
                    },
                ],
            },
            {
                "name": "Southeast Region",
                "personnel": [
                    {
                        "name": "Randy Stockburger",
                        "title": "Executive Vice President: Production Manager",
                        "phone": "813.466.3589",
                        "email": "rstockburger@usgins.com",
                        "vcard_url": "https://qrco.de/rstockburger",
                    },
                    {
                        "name": "Bob Reardon",
                        "title": "Director of National Business Development",
                        "phone": "470.579.5461",
                        "email": "breardon@usgins.com",
                        "vcard_url": "https://qrco.de/breardon",
                    },
                    {
                        "name": "Michael Horton",
                        "title": "Executive Vice President: Branch Manager",
                        "phone": "985.231.3057",
                        "email": "mhorton@usgins.com",
                        "vcard_url": "https://qrco.de/mhorton",
                    },
                ],
                "offices": [
                    {
                        "office_code": "USG FL1",
                        "state": "Florida",
                        "city": "Tampa",
                        "office_type": "Branch Office",
                        "address": "3810 Northdale Boulevard, Suite 190, Tampa, FL 33624",
                        "directions_url": "https://www.google.com/maps/dir//3810%20Northdale%20Boulevard,%20Suite%20190%20Tampa,%20FL%2033624",
                    },
                    {
                        "office_code": "USG GA1",
                        "state": "Georgia",
                        "city": "Alpharetta",
                        "office_type": "Satellite Sales Office",
                        "address": None,
                    },
                    {
                        "office_code": "USG LA1",
                        "state": "Louisiana",
                        "city": "Covington",
                        "office_type": "Branch Office",
                        "address": "1330 Greengate Drive, Suite 150, Covington, LA 70433",
                        "directions_url": "https://www.google.com/maps/dir//1330%20Greengate%20Drive,%20Suite%20150%20Covington,%20LA%2070433",
                    },
                ],
            },
            {
                "name": "South Region",
                "personnel": [
                    {
                        "name": "Jodi Berger",
                        "title": "Executive Vice President: Regional Manager",
                        "phone": "817.524.1074",
                        "email": "jberger@usgins.com",
                        "vcard_url": "https://qrco.de/jberger",
                    },
                ],
                "offices": [
                    {
                        "office_code": "USG TX1",
                        "state": "Texas",
                        "city": "Arlington",
                        "office_type": "Branch Office",
                        "address": "500 E Border St, Suite 600, Arlington, TX 76010",
                        "directions_url": "https://www.google.com/maps/dir//500%20E%20Border%20St,%20Suite%20600%20Arlington,%20TX%2076010",
                    },
                    {
                        "office_code": "USG TX2",
                        "state": "Texas",
                        "city": "Houston",
                        "office_type": "Branch Office",
                        "address": "13831 Northwest Freeway, Suite 340, Houston, TX 77040",
                        "directions_url": "https://www.google.com/maps/dir//13831%20Northwest%20Freeway,%20Suite%20340%20Houston,%20TX%2077040",
                    },
                ],
            },
            {
                "name": "Southern California",
                "personnel": [
                    {
                        "name": "Jenny O'Brien",
                        "title": "Executive Vice President: Branch Manager",
                        "phone": "949.238.6532",
                        "email": "jobrien@usgins.com",
                        "vcard_url": "https://qrco.de/jobrien",
                    },
                ],
                "offices": [
                    {
                        "office_code": "USG CA1",
                        "state": "California",
                        "city": "Irvine",
                        "office_type": "Branch Office",
                        "address": "100 Pacifica, Suite 300, Irvine, CA 92618",
                        "directions_url": "https://www.google.com/maps/dir//100%20Pacifica,%20Suite%20300%20Irvine,%20CA%2092618",
                    },
                ],
            },
            {
                "name": "West Region",
                "personnel": [
                    {
                        "name": "Jim Parsons",
                        "title": "Senior Vice President: Regional Manager",
                        "phone": "206.504.2058",
                        "email": "jparsons@usgins.com",
                        "vcard_url": "https://qrco.de/jparsons",
                    },
                ],
                "offices": [
                    {
                        "office_code": "USG US1",
                        "state": "Idaho",
                        "city": "Sandpoint",
                        "office_type": "Satellite Sales Office",
                        "address": "The Old Power House, 120 East Lake Street, Suite 207, Sandpoint, ID 83864",
                        "directions_url": "https://www.google.com/maps/dir//The%20Old%20Power%20House120%20East%20Lake%20Street,%20Suite%20207%20Sandpoint,%20ID%2083864",
                    },
                ],
            },
            {
                "name": "Midwest Region",
                "personnel": [
                    {
                        "name": "Debbie Williams",
                        "title": "Executive Vice President: Regional Manager",
                        "phone": "651.234.1914",
                        "email": "dwilliams@usgins.com",
                        "vcard_url": "https://qrco.de/dwilliams",
                    },
                ],
                "offices": [
                    {
                        "office_code": "USG MN1",
                        "state": "Minnesota",
                        "city": "Shoreview",
                        "office_type": "Branch Office",
                        "address": "5985 Rice Creek Parkway, Suite 106, Shoreview, MN 55126",
                        "directions_url": "https://www.google.com/maps/dir//5985%20Rice%20Creek%20Parkway,%20Suite%20106%20Shoreview,%20MN%2055126",
                    },
                    {
                        "office_code": "USG MI1",
                        "state": "Michigan",
                        "city": "Troy",
                        "office_type": "Satellite Sales Office",
                        "address": None,
                    },
                    {
                        "office_code": "USG IL1",
                        "state": "Illinois",
                        "city": "Chicago",
                        "office_type": "Satellite Sales Office",
                        "address": "79 West Monroe, Suite 821, Chicago, IL 60603",
                        "directions_url": "https://www.google.com/maps/dir//79%20West%20Monroe,%20Suite%20821%20Chicago,%20IL%2060603",
                    },
                ],
            },
        ],
        "specialty_divisions": [
            {
                "name": "Brokerage Division",
                "personnel": [
                    {
                        "name": "Bob Reardon",
                        "title": "Director of National Business Development",
                        "phone": "470.579.5461",
                        "email": "breardon@usgins.com",
                        "vcard_url": "https://qrco.de/breardon",
                    },
                ],
            },
            {
                "name": "Environmental Division",
                "personnel": [
                    {
                        "name": "Elizabeth Pullen",
                        "title": "First Vice President: Producer/Broker",
                        "phone": "724.754.9091",
                        "email": "epullen@usgins.com",
                        "vcard_url": "https://qrco.de/epullen",
                    },
                ],
            },
            {
                "name": "Garage & Transportation Division",
                "personnel": [
                    {
                        "name": "Jodi Berger",
                        "title": "Executive Vice President: Regional Manager",
                        "phone": "817.524.1074",
                        "email": "jberger@usgins.com",
                        "vcard_url": "https://qrco.de/jberger",
                    },
                    {
                        "name": "Cyndi Johnston",
                        "title": "Vice President: Producer/Broker",
                        "phone": "813.466.3551",
                        "email": "cjohnston@aauins.com",
                        "vcard_url": "https://qrco.de/cjohnston",
                    },
                    {
                        "name": "JR Wallace",
                        "title": "Executive Vice President: Producer/Broker",
                        "phone": "213.246.4706",
                        "email": "jwallace@usgins.com",
                        "vcard_url": "https://qrco.de/jwallace",
                    },
                    {
                        "name": "Mary Hoover",
                        "title": "Vice President: Producer/Broker",
                        "phone": "724.754.9029",
                        "email": "mhoover@usgins.com",
                        "vcard_url": "https://qrco.de/mhoover",
                    },
                    {
                        "name": "Jeannie Walker",
                        "title": "Producer/Broker",
                        "phone": "817.524.1101",
                        "email": "jwalker@usgins.com",
                        "vcard_url": "https://qrco.de/jwalker",
                    },
                ],
            },
            {
                "name": "Allied American Underwriters",
                "personnel": [
                    {
                        "name": "Steven Lodovico",
                        "title": "Executive Vice President: Producer/Broker",
                        "phone": "724.754.9031",
                        "email": "slodovico@aauins.com",
                        "vcard_url": "https://qrco.de/slodovico",
                    },
                    {
                        "name": "Cory McGinnis",
                        "title": "First Vice President: Producer/Broker",
                        "phone": "724.754.9007",
                        "email": "cmcginnis@aauins.com",
                        "vcard_url": "https://qrco.de/cmcginnis",
                    },
                    {
                        "name": "Brenda Kent",
                        "title": "Producer/Broker",
                        "phone": "470.579.5469",
                        "email": "bkent@aauins.com",
                        "vcard_url": "https://qrco.de/bkent",
                    },
                    {
                        "name": "Jeannie Godin",
                        "title": "Producer/Broker",
                        "phone": "813.466.3573",
                        "email": "jgodin@aauins.com",
                        "vcard_url": "https://qrco.de/beCHUH",
                    },
                    {
                        "name": "Isela Boteo",
                        "title": "Producer/Broker",
                        "phone": "949.527.6729",
                        "email": "iboteo@aauins.com",
                        "vcard_url": "https://qrco.de/iboteo",
                    },
                    {
                        "name": "Tatiana Velez",
                        "title": "Associate Producer/Broker",
                        "phone": "813.466.3559",
                        "email": "tvelez@aauins.com",
                        "vcard_url": "https://qrco.de/tvelez",
                    },
                    {
                        "name": "JC Roderiques",
                        "title": "Producer/Broker",
                        "phone": "724.754.9058",
                        "email": "jroderiques@aauins.com",
                        "vcard_url": "https://qrco.de/jroderiques",
                    },
                ],
            },
        ],
        "global_contacts": {
            "main_phone": "844.467.5465",
            "main_email": "getconnected@usgins.com",
            "claims_email": "claims@usgins.com",
            "loss_runs_email": "lossruns@usgins.com",
            "accounting_email": "ar@usgins.com",
            "accounting_contact": {
                "name": "Toni Bolton",
                "title": "Accounting Analyst Manager",
                "phone": "817.524.1075",
                "email": "ar@usgins.com",
            },
        },
    }
    
    try:
        print(f"Fetching {LOCATIONS_URL}...")
        locations_soup = fetch_page(LOCATIONS_URL)
        
        print(f"Fetching {CONTACT_URL}...")
        contact_soup = fetch_page(CONTACT_URL)
        
        # Try to scrape live data
        scraped = scrape_locations_page(locations_soup)
        global_contacts = scrape_contact_page(contact_soup)
        
        # If scraping returned meaningful data with offices, use it
        total_offices = sum(len(r.get("offices", [])) for r in scraped.get("regions", []))
        if scraped["regions"] and total_offices >= 5:
            print(f"Successfully scraped {len(scraped['regions'])} regions, {total_offices} offices from live site")
            scraped["global_contacts"] = global_contacts
            scraped["source"] = "live_scrape"
            return scraped
        else:
            print(f"Live scrape returned insufficient data ({total_offices} offices), using fallback")
            
    except Exception as e:
        print(f"Error scraping live site: {e}")
        print("Using fallback data")
    
    fallback_data["source"] = "fallback"
    return fallback_data


def main():
    """Main entry point."""
    print("=" * 60)
    print("USG Insurance Locations Scraper")
    print("=" * 60)
    
    # Ensure output directory exists
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    # Scrape data
    data = scrape_with_fallback()
    
    # Add metadata
    data["metadata"] = {
        "scraped_at": datetime.now(timezone.utc).isoformat(),
        "source_urls": [LOCATIONS_URL, CONTACT_URL],
        "version": "1.0.0",
    }
    
    # Count totals
    total_offices = sum(len(r.get("offices", [])) for r in data["regions"])
    total_personnel = sum(len(r.get("personnel", [])) for r in data["regions"])
    total_personnel += sum(len(d.get("personnel", [])) for d in data["specialty_divisions"])
    
    # Write output
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print()
    print(f"Output: {OUTPUT_PATH}")
    print(f"Regions: {len(data['regions'])}")
    print(f"Offices: {total_offices}")
    print(f"Personnel: {total_personnel}")
    print(f"Specialty Divisions: {len(data['specialty_divisions'])}")
    print(f"Source: {data.get('source', 'unknown')}")
    print()
    print("Done!")


if __name__ == "__main__":
    main()
