#!/usr/bin/env python3
"""Screenshot the static preview at several scroll positions for design QA."""
import os
import sys
from playwright.sync_api import sync_playwright

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = "file://" + os.path.join(BASE, "static-preview", "index.html")
OUT = os.path.join(BASE, "scripts", "shots")
os.makedirs(OUT, exist_ok=True)

STOPS = [
    ("01-hero", 0),
    ("02-sectors-intro", "document.getElementById('sectors').offsetTop"),
    ("03-sectors-list", "document.getElementById('sector-list').offsetTop - 120"),
    ("04-work", "document.getElementById('work').offsetTop - 40"),
    ("05-work-deep", "document.getElementById('work').offsetTop + 700"),
    ("06-studio", "document.getElementById('studio').offsetTop - 60"),
    ("07-footer", "document.body.scrollHeight"),
]

def shoot(page, suffix=""):
    page.goto(URL)
    page.wait_for_timeout(1400)  # preloader finishes
    for name, pos in STOPS:
        if isinstance(pos, str):
            pos = page.evaluate(pos)
        page.evaluate(f"window.scrollTo({{top: {pos}, behavior: 'instant'}})")
        page.wait_for_timeout(350)
        page.screenshot(path=os.path.join(OUT, f"{name}{suffix}.png"))
        print(f"shot {name}{suffix}")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    shoot(page)
    if "--mobile" in sys.argv:
        mob = browser.new_page(viewport={"width": 390, "height": 844})
        page = mob
        shoot(mob, "-m")
    browser.close()
print("done")
