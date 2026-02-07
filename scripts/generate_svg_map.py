#!/usr/bin/env python3
"""
Generate USA SVG map from TopoJSON data.
Groups states by USG region for interactive functionality.
"""

import json
from pathlib import Path

# State FIPS codes to state abbreviations
FIPS_TO_STATE = {
    "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", "08": "CO",
    "09": "CT", "10": "DE", "11": "DC", "12": "FL", "13": "GA", "15": "HI",
    "16": "ID", "17": "IL", "18": "IN", "19": "IA", "20": "KS", "21": "KY",
    "22": "LA", "23": "ME", "24": "MD", "25": "MA", "26": "MI", "27": "MN",
    "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH",
    "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND", "39": "OH",
    "40": "OK", "41": "OR", "42": "PA", "44": "RI", "45": "SC", "46": "SD",
    "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA",
    "54": "WV", "55": "WI", "56": "WY", "72": "PR",
}

# USG Regions mapping
REGIONS = {
    "Northeast Region": ["PA", "NY", "NJ", "CT", "RI", "MA", "VT", "NH", "ME", "DE", "MD"],
    "Southeast Region": ["FL", "GA", "LA", "AL", "SC"],
    "South Region": ["TX", "OK"],
    "Southern California": ["CA"],
    "West Region": ["ID", "WA", "OR", "MT", "WY", "NV", "UT", "CO", "AZ", "NM"],
    "Midwest Region": ["MN", "MI", "IL", "WI", "IA", "MO", "KS", "NE", "SD", "ND", "IN", "OH"],
}

# Build reverse lookup
STATE_TO_REGION = {}
for region, states in REGIONS.items():
    for state in states:
        STATE_TO_REGION[state] = region


def arc_to_points(arc, transform):
    """Convert a TopoJSON arc to points with transform applied."""
    scale = transform.get("scale", [1, 1])
    translate = transform.get("translate", [0, 0])
    
    points = []
    x, y = 0, 0
    for dx, dy in arc:
        x += dx
        y += dy
        px = x * scale[0] + translate[0]
        py = y * scale[1] + translate[1]
        points.append((px, py))
    return points


def geometry_to_path(geometry, arcs, transform):
    """Convert TopoJSON geometry to SVG path string."""
    geo_type = geometry["type"]
    geo_arcs = geometry.get("arcs", [])
    
    def arc_ring_to_path(ring):
        all_points = []
        for arc_idx in ring:
            if arc_idx < 0:
                pts = list(reversed(arc_to_points(arcs[~arc_idx], transform)))
            else:
                pts = arc_to_points(arcs[arc_idx], transform)
            all_points.extend(pts)
        
        if not all_points:
            return ""
        
        # Build path
        path_parts = [f"M{all_points[0][0]:.1f},{all_points[0][1]:.1f}"]
        for px, py in all_points[1:]:
            path_parts.append(f"L{px:.1f},{py:.1f}")
        path_parts.append("Z")
        return "".join(path_parts)
    
    if geo_type == "Polygon":
        return " ".join(arc_ring_to_path(ring) for ring in geo_arcs)
    elif geo_type == "MultiPolygon":
        paths = []
        for polygon in geo_arcs:
            for ring in polygon:
                paths.append(arc_ring_to_path(ring))
        return " ".join(paths)
    
    return ""


def generate_svg(topo_path: Path, output_path: Path):
    """Generate SVG from TopoJSON."""
    
    with open(topo_path, "r", encoding="utf-8") as f:
        topo = json.load(f)
    
    arcs = topo.get("arcs", [])
    transform = topo.get("transform", {"scale": [1, 1], "translate": [0, 0]})
    
    # Get states object
    states_obj = topo["objects"].get("states")
    if not states_obj:
        print("No 'states' object found in TopoJSON")
        return
    
    geometries = states_obj.get("geometries", [])
    
    # Group states by region
    region_states = {region: [] for region in REGIONS}
    inactive_states = []
    
    for geo in geometries:
        fips = geo.get("id", "")
        if isinstance(fips, int):
            fips = f"{fips:02d}"
        state_abbr = FIPS_TO_STATE.get(fips, "")
        
        if not state_abbr:
            continue
        
        path_d = geometry_to_path(geo, arcs, transform)
        if not path_d:
            continue
        
        region = STATE_TO_REGION.get(state_abbr)
        if region:
            region_states[region].append((state_abbr, path_d))
        else:
            inactive_states.append((state_abbr, path_d))
    
    # Build SVG
    svg_parts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 975 610" role="img" aria-label="USG Insurance Locations Map">',
        '  <title>USG Insurance Regions</title>',
        '  <defs>',
        '    <style>',
        '      .state { fill: #d3d3d3; stroke: #fff; stroke-width: 0.5; cursor: pointer; transition: fill 0.2s; }',
        '      .state:hover { fill: #b0b0b0; }',
        '      [data-region="Northeast Region"] .state { fill: #1a5276; }',
        '      [data-region="Northeast Region"]:hover .state { fill: #2980b9; }',
        '      [data-region="Southeast Region"] .state { fill: #196f3d; }',
        '      [data-region="Southeast Region"]:hover .state { fill: #27ae60; }',
        '      [data-region="South Region"] .state { fill: #b9770e; }',
        '      [data-region="South Region"]:hover .state { fill: #f39c12; }',
        '      [data-region="Southern California"] .state { fill: #7d3c98; }',
        '      [data-region="Southern California"]:hover .state { fill: #9b59b6; }',
        '      [data-region="West Region"] .state { fill: #2874a6; }',
        '      [data-region="West Region"]:hover .state { fill: #3498db; }',
        '      [data-region="Midwest Region"] .state { fill: #a04000; }',
        '      [data-region="Midwest Region"]:hover .state { fill: #e67e22; }',
        '      .inactive .state { fill: #e8e8e8; cursor: default; }',
        '      .inactive .state:hover { fill: #ddd; }',
        '      .marker { fill: #fff; stroke: #003366; stroke-width: 2; cursor: pointer; }',
        '      .marker:hover { fill: #ffd700; }',
        '    </style>',
        '  </defs>',
        '',
    ]
    
    # Add region groups
    for region, states in region_states.items():
        if not states:
            continue
        region_id = region.lower().replace(" ", "-")
        svg_parts.append(f'  <g id="region-{region_id}" data-region="{region}" role="button" tabindex="0" aria-label="{region} - Click to view offices">')
        for state_abbr, path_d in states:
            svg_parts.append(f'    <path id="{state_abbr}" class="state" d="{path_d}"/>')
        svg_parts.append('  </g>')
        svg_parts.append('')
    
    # Add inactive states
    if inactive_states:
        svg_parts.append('  <g id="inactive-states" class="inactive">')
        for state_abbr, path_d in inactive_states:
            svg_parts.append(f'    <path id="{state_abbr}" class="state" d="{path_d}"/>')
        svg_parts.append('  </g>')
        svg_parts.append('')
    
    # Add markers placeholder
    svg_parts.append('  <g id="markers" class="markers"></g>')
    svg_parts.append('</svg>')
    
    # Write output
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(svg_parts))
    
    print(f"Generated SVG: {output_path}")
    print(f"Regions: {sum(1 for r in region_states.values() if r)}")
    print(f"States in regions: {sum(len(s) for s in region_states.values())}")
    print(f"Inactive states: {len(inactive_states)}")


if __name__ == "__main__":
    topo_path = Path("data/us-states-topo.json")
    output_path = Path("src/assets/usa-regions.svg")
    
    if not topo_path.exists():
        print(f"TopoJSON not found: {topo_path}")
        print("Run: curl -L -o data/us-states-topo.json 'https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-10m.json'")
        exit(1)
    
    generate_svg(topo_path, output_path)
