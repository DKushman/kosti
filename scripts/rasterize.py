#!/usr/bin/env python3
"""Rasterize the generated SVG artwork to JPEG.

The dot-field SVGs contain thousands of circles; animating transforms
over live vectors forces expensive re-rasterization every frame.
Baking them to JPEG makes hero/parallax animations GPU-composited
and buttery. Run after gen_images.py:

    python3 scripts/gen_images.py
    python3 scripts/rasterize.py
"""
import os
from playwright.sync_api import sync_playwright

IMG = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "img"))

IMAGES = {
    "hero": (1600, 1000),
    "sector-retail": (1100, 1300),
    "sector-hospitality": (1100, 1300),
    "sector-workplace": (1100, 1300),
    "sector-exhibition": (1100, 1300),
    "project-1": (1400, 1000),
    "project-2": (1400, 1000),
    "project-3": (1400, 1000),
    "project-4": (1400, 1000),
    "reel": (480, 320),
}

with sync_playwright() as p:
    browser = p.chromium.launch()
    for name, (w, h) in IMAGES.items():
        src = os.path.join(IMG, f"{name}.svg")
        if not os.path.exists(src):
            print(f"skip {name} (no svg)")
            continue
        page = browser.new_page(viewport={"width": w, "height": h})
        page.goto(f"file://{src}")
        page.wait_for_timeout(250)
        out = os.path.join(IMG, f"{name}.jpg")
        page.screenshot(path=out, type="jpeg", quality=90)
        page.close()
        print(f"{name}.jpg: {os.path.getsize(out) // 1024} KB")
    browser.close()

print("rasterized")
