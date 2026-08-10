#!/usr/bin/env python3
"""Generate abstract placeholder SVG artwork for the Halle. site.

Halftone dot-wave walls, gradient rooms, panel seams — all generative,
no external assets needed.
"""
import math
import os
import random

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "img")
os.makedirs(OUT, exist_ok=True)


def dot_field(w, h, cols, rows, palette_fn, radius_fn, seed=1):
    """Grid of dots whose radius is modulated by wave fields."""
    rng = random.Random(seed)
    dots = []
    for j in range(rows):
        for i in range(cols):
            x = (i + 0.5) * w / cols
            y = (j + 0.5) * h / rows
            u, v = i / cols, j / rows
            r = radius_fn(u, v, rng)
            if r <= 0.12:
                continue
            fill, op = palette_fn(u, v)
            dots.append(
                f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.2f}" fill="{fill}" opacity="{op:.2f}"/>'
            )
    return "".join(dots)


def wave_radius(base, amp, fx, fy, phase=0.0, swirl=2.2):
    def fn(u, v, rng):
        w1 = math.sin(u * fx + v * fy * 0.6 + phase)
        w2 = math.sin(u * fx * 0.35 + v * fy + phase * 1.7 + math.sin(u * swirl) * 2.0)
        w3 = math.sin((u + v) * (fx * 0.5) - phase)
        m = (w1 * 0.5 + w2 * 0.35 + w3 * 0.15)
        return base + amp * m + rng.uniform(-0.08, 0.08)
    return fn


def svg(name, w, h, body):
    doc = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        f'preserveAspectRatio="xMidYMid slice">{body}</svg>'
    )
    path = os.path.join(OUT, name)
    with open(path, "w") as f:
        f.write(doc)
    print(f"{name}: {os.path.getsize(path)//1024} KB")


# ---------------------------------------------------------------- hero wall
W, H = 1600, 1000

def hero_palette(u, v):
    # left: violet/blue glow, right: magenta/pink
    if u < 0.55:
        t = u / 0.55
        return ("#b9a6ff" if v < 0.35 else "#c9b6ff", 0.32 + 0.5 * (1 - v) * (1 - t * 0.4))
    t = (u - 0.55) / 0.45
    return ("#ff5fb0" if v > 0.25 else "#ff8ac4", 0.25 + 0.55 * t)

hero_dots = dot_field(
    W, H, 110, 70, hero_palette,
    wave_radius(3.4, 3.0, 26.0, 19.0, phase=1.2), seed=7,
)

hero_body = f"""
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0.55">
    <stop offset="0" stop-color="#3a22c8"/>
    <stop offset="0.38" stop-color="#4d1fae"/>
    <stop offset="0.62" stop-color="#3c1258"/>
    <stop offset="0.82" stop-color="#8f1160"/>
    <stop offset="1" stop-color="#d4287f"/>
  </linearGradient>
  <linearGradient id="glowL" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#7d5cff" stop-opacity="0.85"/>
    <stop offset="0.5" stop-color="#5b2bd8" stop-opacity="0.25"/>
    <stop offset="1" stop-color="#12041f" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="glowR" cx="0.86" cy="0.72" r="0.7">
    <stop offset="0" stop-color="#ff4fa8" stop-opacity="0.9"/>
    <stop offset="0.55" stop-color="#cf2377" stop-opacity="0.35"/>
    <stop offset="1" stop-color="#12041f" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#12041f" stop-opacity="0"/>
    <stop offset="1" stop-color="#0a0312" stop-opacity="0.9"/>
  </linearGradient>
</defs>
<rect width="{W}" height="{H}" fill="#160829"/>
<rect width="{W}" height="{H}" fill="url(#bg)" opacity="0.9"/>
<rect width="{W}" height="{H}" fill="url(#glowL)"/>
<rect width="{W}" height="{H}" fill="url(#glowR)"/>
<g>{hero_dots}</g>
<rect x="880" y="0" width="6" height="{H}" fill="#0a0312" opacity="0.55"/>
<rect x="1420" y="0" width="5" height="{H}" fill="#0a0312" opacity="0.5"/>
<polygon points="0,0 {W},0 {W},90 0,190" fill="#1b0b33" opacity="0.55"/>
<rect y="{H-260}" width="{W}" height="260" fill="url(#floor)"/>
"""
svg("hero.svg", W, H, hero_body)


# ------------------------------------------------------------- sector rooms
def room(name, seed, bg0, bg1, accent, dot, motif):
    w, h = 1100, 1300
    rng = random.Random(seed)
    parts = [
        f'<defs><linearGradient id="g" x1="0" y1="0" x2="0.7" y2="1">'
        f'<stop offset="0" stop-color="{bg0}"/><stop offset="1" stop-color="{bg1}"/>'
        f'</linearGradient></defs>',
        f'<rect width="{w}" height="{h}" fill="url(#g)"/>',
    ]
    if motif == "bars":  # retail — vertical rails / shelving rhythm
        for i in range(14):
            x = 60 + i * 74
            hh = rng.randint(420, 980)
            parts.append(
                f'<rect x="{x}" y="{h-hh-140}" width="26" height="{hh}" rx="13" '
                f'fill="{accent}" opacity="{rng.uniform(0.25, 0.85):.2f}"/>'
            )
        parts.append(f'<rect y="{h-140}" width="{w}" height="8" fill="{accent}" opacity="0.6"/>')
    elif motif == "arches":  # hospitality — arched niches
        for i in range(4):
            x = 90 + i * 240
            parts.append(
                f'<path d="M {x} {h-220} L {x} 560 A 105 105 0 0 1 {x+210} 560 L {x+210} {h-220} Z" '
                f'fill="none" stroke="{accent}" stroke-width="10" opacity="{0.9-i*0.16:.2f}"/>'
            )
        parts.append(
            f'<circle cx="{w*0.72:.0f}" cy="380" r="150" fill="{accent}" opacity="0.35"/>'
        )
    elif motif == "mesh":  # workplace — hanging mesh curtains
        for c in range(3):
            x0 = 120 + c * 300
            for i in range(26):
                x = x0 + i * 9
                parts.append(
                    f'<line x1="{x}" y1="180" x2="{x + rng.randint(-14, 14)}" y2="{rng.randint(760, 1080)}" '
                    f'stroke="{accent}" stroke-width="2.4" opacity="{rng.uniform(0.3, 0.75):.2f}"/>'
                )
        parts.append(f'<rect x="80" y="150" width="880" height="14" rx="7" fill="{accent}" opacity="0.8"/>')
    elif motif == "orbs":  # exhibition — floating spheres / plinths
        for i in range(6):
            cx, cy = rng.randint(140, w - 140), rng.randint(240, 820)
            r = rng.randint(56, 168)
            parts.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{accent}" opacity="{rng.uniform(0.25,0.7):.2f}"/>')
        for i in range(4):
            x = 110 + i * 240
            parts.append(f'<rect x="{x}" y="{h-420}" width="150" height="300" fill="{accent}" opacity="0.22"/>')
    # halftone floor sweep
    def pal(u, v):
        return (dot, 0.5 * v + 0.12)
    parts.append('<g>' + dot_field(
        w, h, 64, 76, pal, wave_radius(2.2, 1.9, 17.0, 13.0, phase=seed), seed=seed
    ) + '</g>')
    parts.append(f'<rect y="{h-200}" width="{w}" height="200" fill="{bg1}" opacity="0.55"/>')
    svg(name, w, h, "".join(parts))


room("sector-retail.svg", 11, "#1a1a1e", "#3c3540", "#ff7a4d", "#ffd9c7", "bars")
room("sector-hospitality.svg", 22, "#20140c", "#5c3a1e", "#f0b35e", "#ffe6bd", "arches")
room("sector-workplace.svg", 33, "#e8e4dc", "#b9b4a9", "#e8d838", "#6b675e", "mesh")
room("sector-exhibition.svg", 44, "#0c1420", "#1f3a5c", "#7fc8f8", "#cfe9ff", "orbs")


# --------------------------------------------------------------- projects
def project(name, seed, bg0, bg1, accent, dot):
    w, h = 1400, 1000
    rng = random.Random(seed)
    def pal(u, v):
        return (dot, 0.15 + 0.6 * abs(math.sin(u * 6 + seed)))
    body = (
        f'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">'
        f'<stop offset="0" stop-color="{bg0}"/><stop offset="1" stop-color="{bg1}"/>'
        f'</linearGradient></defs>'
        f'<rect width="{w}" height="{h}" fill="url(#g)"/>'
    )
    shapes = []
    for i in range(3):
        cx, cy = rng.randint(200, w - 200), rng.randint(180, h - 180)
        r = rng.randint(120, 300)
        shapes.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{accent}" opacity="{rng.uniform(0.18,0.5):.2f}"/>')
    body += "".join(shapes)
    body += '<g>' + dot_field(w, h, 84, 60, pal, wave_radius(2.6, 2.2, 21.0, 15.0, phase=seed * 0.7), seed=seed) + '</g>'
    body += f'<rect width="{w}" height="{h}" fill="#000" opacity="0.08"/>'
    svg(name, w, h, body)


project("project-1.svg", 5, "#2a1a66", "#7a2bd6", "#b9a6ff", "#e6dcff")
project("project-2.svg", 6, "#12303a", "#2a7f68", "#8ff0c8", "#dcfff0")
project("project-3.svg", 7, "#701a3a", "#d64a7a", "#ff9ec0", "#ffdce9")
project("project-4.svg", 8, "#3a3208", "#a08c1a", "#f0e05e", "#fff8c0")


# -------------------------------------------------------------- reel thumb
w, h = 480, 320
def reel_pal(u, v):
    g = int(140 + 90 * math.sin(u * 9))
    return (f"rgb({g},{g},{g})", 0.5)
reel = (
    f'<rect width="{w}" height="{h}" fill="#141414"/>'
    '<g>' + dot_field(w, h, 40, 26, reel_pal, wave_radius(2.4, 1.8, 15.0, 11.0, phase=0.4), seed=9) + '</g>'
    f'<rect width="{w}" height="{h}" fill="#000" opacity="0.25"/>'
    f'<circle cx="{w/2}" cy="{h/2}" r="46" fill="none" stroke="#fff" stroke-width="3" opacity="0.9"/>'
    f'<polygon points="{w/2-12},{h/2-18} {w/2+22},{h/2} {w/2-12},{h/2+18}" fill="#fff"/>'
)
svg("reel.svg", w, h, reel)

print("all images generated")
