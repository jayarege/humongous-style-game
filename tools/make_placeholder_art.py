"""
Draws the placeholder art for the demo rooms, so the game runs before any Midjourney art exists.

Run:  python3 tools/make_placeholder_art.py      (needs Pillow: pip install pillow)

Every file it writes lives in public/art/. Replace any of them with your own PNG of the SAME NAME and roughly the
same size, and the game picks it up with no code change. Rules for real art:

- Backgrounds: 1280x720 PNG (16:9). Larger is fine if you keep 16:9; update GAME_WIDTH/GAME_HEIGHT in src/main.ts.
- Characters: transparent PNG, feet touching the bottom edge, centred horizontally. The engine anchors sprites at
  bottom-centre, so the bottom middle pixel is where the character "stands".
- Mouth frames (closed / half / open): three PNGs with IDENTICAL canvas size and the character in the IDENTICAL
  spot. Only the mouth may differ, otherwise the character jitters while talking.
- Items: transparent PNG around 64 to 96 px.
"""

from __future__ import annotations

import math
import os
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "art")
SS = 2  # supersample factor for smooth edges


def out(path: str) -> str:
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    return full


def canvas(w: int, h: int, color=(0, 0, 0, 0)):
    img = Image.new("RGBA", (w * SS, h * SS), color)
    return img, ImageDraw.Draw(img)


def save(img: Image.Image, w: int, h: int, path: str) -> None:
    img.resize((w, h), Image.LANCZOS).save(out(path), optimize=True)
    print("wrote", path)


def s(*v):
    """Scale coordinates by the supersample factor."""
    return tuple(int(round(x * SS)) for x in v)


def gradient(draw: ImageDraw.ImageDraw, w: int, h: int, top, bottom, y0=0, y1=None):
    y1 = h if y1 is None else y1
    for y in range(y0 * SS, y1 * SS):
        f = (y - y0 * SS) / max(1, (y1 - y0) * SS)
        c = tuple(int(top[i] + (bottom[i] - top[i]) * f) for i in range(3))
        draw.line([(0, y), (w * SS, y)], fill=c)


def cloud(draw, x, y, k=1.0):
    for dx, dy, r in [(0, 0, 38), (40, -18, 46), (88, 0, 40), (45, 12, 40)]:
        draw.ellipse(s(x + dx * k - r * k, y + dy * k - r * k, x + dx * k + r * k, y + dy * k + r * k), fill=(255, 255, 255))


def tree(draw, x, ground, h=260, crown=(76, 160, 84)):
    draw.rounded_rectangle(s(x - 18, ground - h * 0.55, x + 18, ground), radius=8 * SS, fill=(120, 82, 52))
    for dx, dy, r in [(0, -h * 0.75, 95), (-60, -h * 0.6, 70), (60, -h * 0.6, 72), (0, -h, 70)]:
        draw.ellipse(s(x + dx - r, ground + dy - r, x + dx + r, ground + dy + r), fill=crown)
    for dx, dy, r in [(-25, -h * 0.85, 26), (35, -h * 0.7, 20)]:
        draw.ellipse(s(x + dx - r, ground + dy - r, x + dx + r, ground + dy + r), fill=tuple(min(255, c + 30) for c in crown))


def flower(draw, x, y, color):
    for a in range(5):
        ang = a * 2 * math.pi / 5
        px, py = x + math.cos(ang) * 9, y + math.sin(ang) * 9
        draw.ellipse(s(px - 7, py - 7, px + 7, py + 7), fill=color)
    draw.ellipse(s(x - 6, y - 6, x + 6, y + 6), fill=(255, 214, 64))


# ─── Backgrounds ────────────────────────────────────────────────────────────

W, H = 1280, 720
HORIZON = 400


def pond():
    img, d = canvas(W, H)
    gradient(d, W, H, (126, 196, 255), (214, 238, 255), 0, HORIZON)
    cloud(d, 180, 110)
    cloud(d, 760, 80, 1.3)
    cloud(d, 1080, 150, 0.8)
    # hills
    d.ellipse(s(-200, 300, 700, 620), fill=(134, 196, 112))
    d.ellipse(s(450, 320, 1500, 640), fill=(118, 182, 100))
    # ground
    gradient(d, W, H, (126, 194, 92), (92, 160, 70), HORIZON, H)
    tree(d, 120, 470, 300)
    tree(d, 330, 440, 220, (66, 146, 80))
    # path leaving left
    d.polygon(s(0, 520, 260, 540, 420, 720, 0, 720), fill=(214, 182, 128))
    d.polygon(s(0, 540, 230, 556, 360, 720, 0, 720), fill=(228, 198, 146))
    # pond
    d.ellipse(s(760, 470, 1340, 700), fill=(62, 140, 200))
    d.ellipse(s(800, 490, 1320, 680), fill=(86, 164, 222))
    for x, y, r in [(900, 600, 40), (1150, 640, 34)]:
        d.ellipse(s(x - r, y - r * 0.45, x + r, y + r * 0.45), fill=(92, 176, 96))
        d.polygon(s(x, y, x + r, y - 8, x + r, y + 8), fill=(86, 164, 222))
    # reeds
    for x in range(770, 830, 12):
        d.line(s(x, 520, x + 6, 420 + (x % 30)), fill=(70, 130, 60), width=5 * SS)
        d.ellipse(s(x - 2, 410 + (x % 30), x + 12, 450 + (x % 30)), fill=(140, 92, 54))
    # the frog's rock
    d.ellipse(s(890, 470, 1110, 560), fill=(140, 136, 150))
    d.ellipse(s(910, 470, 1090, 530), fill=(166, 162, 176))
    # signpost
    d.rectangle(s(492, 380, 506, 520), fill=(130, 88, 54))
    d.rounded_rectangle(s(430, 360, 580, 420), radius=10 * SS, fill=(186, 136, 86), outline=(110, 72, 42), width=4 * SS)
    d.polygon(s(430, 360, 410, 390, 430, 420), fill=(186, 136, 86))
    # flowers
    for x, y, c in [(600, 640, (255, 120, 150)), (660, 600, (255, 255, 255)), (300, 640, (190, 140, 255)), (700, 680, (255, 160, 80))]:
        flower(d, x, y, c)
    save(img, W, H, "rooms/pond.png")


def meadow():
    img, d = canvas(W, H)
    gradient(d, W, H, (255, 196, 140), (255, 236, 200), 0, HORIZON)
    d.ellipse(s(940, 60, 1080, 200), fill=(255, 244, 170))
    cloud(d, 260, 120, 1.1)
    d.ellipse(s(-300, 290, 900, 640), fill=(170, 200, 110))
    d.ellipse(s(600, 300, 1600, 620), fill=(150, 190, 100))
    gradient(d, W, H, (150, 206, 104), (112, 172, 80), HORIZON, H)
    tree(d, 1150, 450, 320, (92, 156, 80))
    tree(d, 160, 430, 240, (102, 170, 86))
    # path leaving right
    d.polygon(s(1280, 520, 1000, 548, 860, 720, 1280, 720), fill=(214, 182, 128))
    d.polygon(s(1280, 540, 1030, 562, 920, 720, 1280, 720), fill=(228, 198, 146))
    # tree stump the marble sits on
    d.ellipse(s(520, 520, 700, 560), fill=(110, 74, 46))
    d.rectangle(s(520, 470, 700, 540), fill=(140, 96, 60))
    d.ellipse(s(520, 450, 700, 495), fill=(214, 172, 120))
    d.ellipse(s(560, 460, 660, 485), outline=(176, 132, 86), width=3 * SS)
    for i in range(18):
        x = 80 + (i * 137) % 1100
        y = 560 + (i * 53) % 150
        flower(d, x, y, [(255, 120, 150), (255, 255, 255), (190, 140, 255), (255, 170, 60)][i % 4])
    save(img, W, H, "rooms/meadow.png")


# ─── Characters (three mouth frames each) ───────────────────────────────────


def hero(mouth: str):
    w, h = 150, 230
    img, d = canvas(w, h)
    cx = w / 2
    d.ellipse(s(cx - 46, h - 16, cx + 46, h - 2), fill=(0, 0, 0, 50))
    # legs and shoes
    d.rounded_rectangle(s(cx - 30, 150, cx - 10, h - 10), radius=8 * SS, fill=(52, 78, 140))
    d.rounded_rectangle(s(cx + 10, 150, cx + 30, h - 10), radius=8 * SS, fill=(52, 78, 140))
    d.ellipse(s(cx - 40, h - 22, cx - 4, h - 4), fill=(200, 60, 60))
    d.ellipse(s(cx + 4, h - 22, cx + 40, h - 4), fill=(200, 60, 60))
    # body
    d.rounded_rectangle(s(cx - 44, 96, cx + 44, 170), radius=26 * SS, fill=(255, 196, 64))
    d.rectangle(s(cx - 44, 132, cx + 44, 140), fill=(255, 150, 60))
    # head
    d.ellipse(s(cx - 50, 8, cx + 50, 108), fill=(255, 222, 186))
    d.chord(s(cx - 52, 2, cx + 52, 90), 180, 360, fill=(120, 72, 40))
    d.ellipse(s(cx - 66, 46, cx - 40, 72), fill=(255, 222, 186))
    d.ellipse(s(cx + 40, 46, cx + 66, 72), fill=(255, 222, 186))
    # eyes
    for ex in (cx - 20, cx + 20):
        d.ellipse(s(ex - 11, 46, ex + 11, 70), fill=(255, 255, 255))
        d.ellipse(s(ex - 5, 54, ex + 5, 68), fill=(40, 30, 60))
    d.ellipse(s(cx - 36, 72, cx - 22, 82), fill=(255, 170, 160))
    d.ellipse(s(cx + 22, 72, cx + 36, 82), fill=(255, 170, 160))
    # mouth
    my = 86
    if mouth == "closed":
        d.arc(s(cx - 14, my - 10, cx + 14, my + 6), 20, 160, fill=(110, 40, 40), width=4 * SS)
    elif mouth == "half":
        d.ellipse(s(cx - 10, my - 4, cx + 10, my + 8), fill=(110, 40, 40))
    else:
        d.ellipse(s(cx - 13, my - 6, cx + 13, my + 16), fill=(110, 40, 40))
        d.ellipse(s(cx - 7, my + 6, cx + 7, my + 15), fill=(240, 110, 120))
    save(img, w, h, f"characters/hero/{mouth}.png")


def frog(mouth: str):
    w, h = 240, 230
    img, d = canvas(w, h)
    cx = w / 2
    green, dark = (96, 186, 96), (60, 140, 70)
    # legs
    d.ellipse(s(cx - 110, h - 60, cx - 30, h - 4), fill=dark)
    d.ellipse(s(cx + 30, h - 60, cx + 110, h - 4), fill=dark)
    # body
    d.ellipse(s(cx - 90, 70, cx + 90, h - 10), fill=green)
    d.ellipse(s(cx - 60, 120, cx + 60, h - 16), fill=(220, 240, 170))
    # eyes
    for ex in (cx - 46, cx + 46):
        d.ellipse(s(ex - 34, 40, ex + 34, 108), fill=green)
        d.ellipse(s(ex - 24, 50, ex + 24, 98), fill=(255, 255, 255))
        d.ellipse(s(ex - 10, 62, ex + 10, 92), fill=(30, 30, 40))
        d.ellipse(s(ex - 4, 66, ex + 3, 74), fill=(255, 255, 255))
    # top hat (he's the mayor)
    d.rectangle(s(cx - 34, 0, cx + 34, 44), fill=(50, 40, 60))
    d.rectangle(s(cx - 34, 30, cx + 34, 38), fill=(200, 60, 90))
    d.rounded_rectangle(s(cx - 54, 40, cx + 54, 52), radius=6 * SS, fill=(50, 40, 60))
    # mouth
    my = 132
    if mouth == "closed":
        d.arc(s(cx - 54, my - 30, cx + 54, my + 14), 20, 160, fill=(40, 90, 50), width=5 * SS)
    elif mouth == "half":
        d.chord(s(cx - 46, my - 16, cx + 46, my + 22), 0, 180, fill=(120, 40, 60))
    else:
        d.chord(s(cx - 52, my - 24, cx + 52, my + 46), 0, 180, fill=(120, 40, 60))
        d.ellipse(s(cx - 24, my + 4, cx + 24, my + 26), fill=(240, 110, 130))
    save(img, w, h, f"characters/frog/{mouth}.png")


# ─── Items and UI ───────────────────────────────────────────────────────────


def marble():
    w = h = 72
    img, d = canvas(w, h)
    d.ellipse(s(6, 6, 66, 66), fill=(60, 110, 230))
    d.ellipse(s(14, 14, 58, 58), fill=(90, 150, 255))
    d.ellipse(s(20, 16, 36, 30), fill=(255, 255, 255, 220))
    d.arc(s(16, 20, 56, 60), 200, 330, fill=(255, 210, 90), width=4 * SS)
    save(img, w, h, "items/marble.png")


def ui():
    img, d = canvas(W, 100)
    d.rounded_rectangle(s(10, 6, W - 10, 94), radius=24 * SS, fill=(59, 42, 92, 230), outline=(255, 210, 63), width=4 * SS)
    save(img, W, 100, "ui/inventory.png")
    img, d = canvas(320, 165)
    d.rounded_rectangle(s(5, 5, 315, 140), radius=34 * SS, fill=(255, 249, 233), outline=(59, 42, 92), width=3 * SS)
    d.polygon(s(90, 138, 60, 162, 66, 138), fill=(255, 249, 233))
    save(img, 320, 165, "ui/bubble.png")


if __name__ == "__main__":
    pond()
    meadow()
    for m in ("closed", "half", "open"):
        hero(m)
        frog(m)
    marble()
    ui()
