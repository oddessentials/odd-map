#!/usr/bin/env python3
"""
USG Locations Data Artifact Generator

Transforms geocoded location data into JavaScript ES module and CSV audit artifact.

Usage:
    python scripts/generate_data_artifact.py

Input:
    data/locations_geocoded.json

Output:
    src/data/locations.js (ES module for browser)
    data/locations.csv (audit artifact)
"""

import csv
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

INPUT_PATH = Path("data/locations_geocoded.json")
JS_OUTPUT_PATH = Path("src/data/locations.js")
CSV_OUTPUT_PATH = Path("data/locations.csv")


def generate_js_module(data: dict) -> str:
    """Generate ES module JavaScript from location data."""
    
    metadata = data.get("metadata", {})
    scraped_at = metadata.get("scraped_at", "unknown")
    geocoded_at = metadata.get("geocoded_at", "unknown")
    source = data.get("source", "unknown")
    
    lines = [
        "/**",
        " * USG Insurance Locations Data",
        " * Auto-generated - do not edit manually",
        f" * ",
        f" * Scraped: {scraped_at}",
        f" * Geocoded: {geocoded_at}",
        f" * Source: {source}",
        " */",
        "",
        "export const metadata = {",
        f'  scrapedAt: "{scraped_at}",',
        f'  geocodedAt: "{geocoded_at}",',
        f'  source: "{source}",',
        f'  generatedAt: "{datetime.now(timezone.utc).isoformat()}",',
        "};",
        "",
    ]
    
    # Export regions
    lines.append("export const regions = " + json.dumps(data.get("regions", []), indent=2) + ";")
    lines.append("")
    
    # Export specialty divisions
    lines.append("export const specialtyDivisions = " + json.dumps(data.get("specialty_divisions", []), indent=2) + ";")
    lines.append("")
    
    # Export global contacts
    lines.append("export const globalContacts = " + json.dumps(data.get("global_contacts", {}), indent=2) + ";")
    lines.append("")
    
    # Helper to get all offices flat
    lines.extend([
        "/** Get all offices as a flat array */",
        "export function getAllOffices() {",
        "  return regions.flatMap(r => r.offices.map(o => ({ ...o, regionName: r.name })));",
        "}",
        "",
        "/** Get offices by region name */",
        "export function getOfficesByRegion(regionName) {",
        "  const region = regions.find(r => r.name === regionName);",
        "  return region ? region.offices : [];",
        "}",
        "",
        "/** Get region by name */",
        "export function getRegion(regionName) {",
        "  return regions.find(r => r.name === regionName);",
        "}",
        "",
    ])
    
    return "\n".join(lines)


def generate_csv(data: dict) -> list[list[str]]:
    """Generate CSV rows from location data."""
    
    headers = [
        "region",
        "office_code",
        "state",
        "city",
        "office_type",
        "address",
        "lat",
        "lon",
        "coord_source",
        "coord_confidence",
        "directions_url",
        "manager_name",
        "manager_phone",
        "manager_email",
    ]
    
    rows = [headers]
    
    for region in data.get("regions", []):
        region_name = region.get("name", "")
        personnel = region.get("personnel", [])
        manager = personnel[0] if personnel else {}
        
        for office in region.get("offices", []):
            coords = office.get("coordinates") or {}
            
            row = [
                region_name,
                office.get("office_code", ""),
                office.get("state", ""),
                office.get("city", ""),
                office.get("office_type", ""),
                office.get("address", ""),
                str(coords.get("lat", "")),
                str(coords.get("lon", "")),
                coords.get("source", ""),
                coords.get("confidence", ""),
                office.get("directions_url", ""),
                manager.get("name", ""),
                manager.get("phone", ""),
                manager.get("email", ""),
            ]
            rows.append(row)
    
    return rows


def validate_data(data: dict) -> list[str]:
    """Validate data completeness, return list of warnings."""
    warnings = []
    
    regions = data.get("regions", [])
    if len(regions) < 6:
        warnings.append(f"Expected 6 regions, found {len(regions)}")
    
    total_offices = sum(len(r.get("offices", [])) for r in regions)
    if total_offices < 10:
        warnings.append(f"Expected ~11 offices, found {total_offices}")
    
    # Check for offices without coordinates
    null_coords = 0
    for region in regions:
        for office in region.get("offices", []):
            if not office.get("coordinates"):
                null_coords += 1
    
    if null_coords > 0:
        warnings.append(f"{null_coords} offices have null coordinates")
    
    # Check global contacts
    gc = data.get("global_contacts", {})
    if not gc.get("main_phone"):
        warnings.append("Missing main phone in global contacts")
    
    return warnings


def main():
    """Main entry point."""
    print("=" * 60)
    print("USG Locations Data Artifact Generator")
    print("=" * 60)
    
    # Check input exists
    if not INPUT_PATH.exists():
        print(f"ERROR: Input file not found: {INPUT_PATH}")
        print("Run geocode_locations.py first")
        sys.exit(1)
    
    # Load geocoded data
    with open(INPUT_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Validate
    print("\nValidating data...")
    warnings = validate_data(data)
    for w in warnings:
        print(f"  WARNING: {w}")
    if not warnings:
        print("  All checks passed!")
    
    # Generate JavaScript module
    print(f"\nGenerating {JS_OUTPUT_PATH}...")
    JS_OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    js_content = generate_js_module(data)
    with open(JS_OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"  Written {len(js_content)} bytes")
    
    # Generate CSV
    print(f"\nGenerating {CSV_OUTPUT_PATH}...")
    csv_rows = generate_csv(data)
    with open(CSV_OUTPUT_PATH, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(csv_rows)
    print(f"  Written {len(csv_rows) - 1} office rows")
    
    # Summary
    print("\n" + "=" * 60)
    print("Summary:")
    print(f"  Regions: {len(data.get('regions', []))}")
    print(f"  Offices: {sum(len(r.get('offices', [])) for r in data.get('regions', []))}")
    print(f"  Specialty Divisions: {len(data.get('specialty_divisions', []))}")
    print(f"  Warnings: {len(warnings)}")
    print("\nDone!")


if __name__ == "__main__":
    main()
