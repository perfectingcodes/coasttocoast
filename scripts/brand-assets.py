#!/usr/bin/env python3
"""
Brand asset pipeline.

Reads the master logo art from `brand/` (opaque-white PNGs straight from the
designer) and writes every web asset the site needs into `public/`:

    public/brand/logo-mascot.{png,webp}   full lockup, mascot + badge
    public/brand/logo-badge.{png,webp}    badge only
    public/brand/mascot.{png,webp}        mascot figure only
    public/favicon.ico, favicon-512.png, apple-touch-icon.png
    public/og.jpg                         1200x630 social card

The white background is removed with a border flood-fill rather than a colour
key, so whites *enclosed* by the logo outline (the wordmark, the husky's fur)
survive untouched.

    python3 scripts/brand-assets.py
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "brand"
OUT = ROOT / "public"
BRAND_OUT = OUT / "brand"

NAVY = (11, 37, 69)
DEEP = (6, 21, 40)
CYAN = (34, 199, 242)
ORANGE = (242, 101, 34)

FONT_BLACK = "/System/Library/Fonts/Supplemental/Arial Black.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"

PHONE = "(239) 518-5928"


def knockout(path, thresh=36):
    """Flood-fill the outer white background to transparent, then trim."""
    rgb = Image.open(path).convert("RGB")
    w, h = rgb.size
    work = rgb.copy()
    sentinel = (255, 0, 255)
    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
             (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]
    for seed in seeds:
        if work.getpixel(seed) != sentinel:
            ImageDraw.floodfill(work, seed, sentinel, thresh=thresh)

    arr = np.array(work)
    bg = (arr[:, :, 0] == 255) & (arr[:, :, 1] == 0) & (arr[:, :, 2] == 255)
    mask = Image.fromarray(np.where(bg, 255, 0).astype("uint8"))
    mask = mask.filter(ImageFilter.MaxFilter(3))       # eat the 1px white fringe
    mask = mask.filter(ImageFilter.GaussianBlur(0.6))  # feather the cut

    alpha = Image.fromarray(255 - np.array(mask))
    out = rgb.convert("RGBA")
    out.putalpha(alpha)
    return out.crop(alpha.getbbox())


def fit_ring(img, samples=256):
    """Locate the cyan ring of a circular badge: returns (cx, cy, r) in pixels.

    The four step badges were drawn separately, so their discs differ by a few
    percent in size and sit at slightly different heights. Scoring candidate
    circles against the cyan outline finds the disc itself, which is the thing
    that has to line up across the row — the ears, wrench and action strokes
    deliberately break out of it and must not be used for alignment.
    """
    import math
    # Uniform scale, so a circle in the source stays a circle here.
    k = samples / max(img.width, img.height)
    sw, sh = max(1, round(img.width * k)), max(1, round(img.height * k))
    a = np.array(img.convert("RGB").resize((sw, sh), Image.LANCZOS)).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    ring = (r < 120) & (g > 120) & (b > 150)

    th = np.linspace(0, 2 * math.pi, 720, endpoint=False)
    ct, st = np.cos(th), np.sin(th)
    best = (-1.0, sw // 2, sh // 2, sw // 2)
    for cx in range(int(sw * 0.38), int(sw * 0.63)):
        for cy in range(int(sh * 0.36), int(sh * 0.64)):
            for rad in range(int(sw * 0.34), int(sw * 0.52)):
                px = np.clip((cx + rad * ct).astype(int), 0, sw - 1)
                py = np.clip((cy + rad * st).astype(int), 0, sh - 1)
                score = ring[py, px].mean()
                if score > best[0]:
                    best = (score, cx, cy, rad)
    score, cx, cy, rad = best
    if score < 0.40:
        raise SystemExit(f"  ! could not find the badge ring (best {score:.2f})")
    return (cx / k, cy / k, rad / k)


def circle_align(path, canvas=1024, disc=0.74):
    """Knock out a circular badge and re-frame it so the disc is identical.

    Every badge comes back on the same square canvas with its disc centred and
    occupying `disc` of the width, so the row lines up perfectly and a number
    chip can be positioned against the ring in CSS with one set of offsets.
    """
    img = knockout(path)
    cx, cy, r = fit_ring(img)
    scale = (canvas * disc / 2) / r
    w, h = round(img.width * scale), round(img.height * scale)
    img = img.resize((w, h), Image.LANCZOS)
    out = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    out.paste(img, (round(canvas / 2 - cx * scale), round(canvas / 2 - cy * scale)))
    return out


def emit(img, stem, width, png=False):
    """Write a WebP at the given width, plus an optional palette PNG.

    Pages reference the WebP; the PNGs exist only as a raster fallback and for
    the schema.org `logo` field, so they are quantised — this is flat
    illustration art, so 200 colours is visually lossless and roughly a tenth
    of the size of the truecolour original.
    """
    height = round(img.height * width / img.width)
    resized = img.resize((width, height), Image.LANCZOS)
    resized.save(BRAND_OUT / f"{stem}.webp", quality=90, method=6)
    note = ""
    if png:
        pal = resized.quantize(colors=200, method=Image.FASTOCTREE)
        pal.save(BRAND_OUT / f"{stem}.png", optimize=True)
        note = f"  + png {(BRAND_OUT / f'{stem}.png').stat().st_size // 1024}KB"
    size = (BRAND_OUT / f"{stem}.webp").stat().st_size // 1024
    print(f"  {stem:<18} {width}x{height}  webp {size}KB{note}")
    return resized


def emit_photo(name, widths, quality=82):
    """Resize a photographic asset to WebP at each width (largest first)."""
    src = Image.open(SRC / name).convert("RGB")
    stem = pathlib.Path(name).stem
    for w in widths:
        h = round(src.height * w / src.width)
        out = BRAND_OUT / (f"{stem}.webp" if w == widths[0] else f"{stem}-{w}.webp")
        src.resize((w, h), Image.LANCZOS).save(out, quality=quality, method=6)
        print(f"  {out.name:<24} {w}x{h}  {out.stat().st_size // 1024}KB")


def vertical_gradient(size, top, bottom):
    img = Image.new("RGB", size)
    draw = ImageDraw.Draw(img)
    w, h = size
    for y in range(h):
        t = y / max(h - 1, 1)
        draw.line([(0, y), (w, y)],
                  fill=tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return img


def build_favicon(badge):
    """Crop the circular sunset emblem out of the badge and set it on navy."""
    w, h = badge.size
    emblem = badge.crop((int(w * 0.17), int(h * 0.02), int(w * 0.66), int(h * 0.50)))

    size, pad = 512, 30
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=112, fill=255)

    tile = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    tile.paste(vertical_gradient((size, size), NAVY, DEEP), (0, 0), mask)

    art = emblem.copy()
    art.thumbnail((size - pad * 2, size - pad * 2), Image.LANCZOS)
    tile.alpha_composite(art, ((size - art.width) // 2, (size - art.height) // 2))

    tile.save(OUT / "favicon-512.png", optimize=True)
    tile.resize((180, 180), Image.LANCZOS).save(OUT / "apple-touch-icon.png", optimize=True)
    tile.resize((64, 64), Image.LANCZOS).save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print("  favicon.ico / favicon-512.png / apple-touch-icon.png")


def build_og(lockup):
    w, h = 1200, 630
    card = vertical_gradient((w, h), (13, 42, 78), DEEP)

    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse([540, -200, 1320, 560], fill=(20, 130, 215, 105))
    card = Image.alpha_composite(card.convert("RGBA"),
                                 glow.filter(ImageFilter.GaussianBlur(110))).convert("RGB")

    art = lockup.copy()
    art.thumbnail((520, 470), Image.LANCZOS)
    card.paste(art, (w - art.width - 46, (h - art.height) // 2), art)

    draw = ImageDraw.Draw(card)
    x = 64
    maxw = w - art.width - 46 - x - 34

    def fit(text, path, start):
        for size in range(start, 13, -2):
            font = ImageFont.truetype(path, size)
            if draw.textlength(text, font=font) <= maxw:
                return font
        return ImageFont.truetype(path, 14)

    draw.text((x, 138), "SOUTHWEST FLORIDA HVAC",
              font=fit("SOUTHWEST FLORIDA HVAC", FONT_BOLD, 24), fill=CYAN)

    head = fit("MECHANICAL.", FONT_BLACK, 58)
    for i, line in enumerate(["HEATING.", "COOLING.", "MECHANICAL."]):
        draw.text((x, 182 + i * (head.size + 12)), line,
                  font=head, fill="white" if i < 2 else CYAN)

    y = 182 + 3 * (head.size + 12) + 16
    sub = "Licensed & insured · 24/7 emergency"
    draw.text((x, y), sub, font=fit(sub, FONT_REG, 25), fill=(200, 220, 238))

    draw.rounded_rectangle([x, y + 52, x + 296, y + 112], radius=30, fill=ORANGE)
    draw.text((x + 32, y + 70), PHONE, font=ImageFont.truetype(FONT_BOLD, 26), fill="white")

    card.save(OUT / "og.jpg", quality=88, optimize=True)
    print("  og.jpg             1200x630")


def main():
    required = (
        "logo-mascot.png", "logo-badge.png", "mascot.png",
        "badge-locally-owned.png", "hero-coast.jpg",
        "mascot-bust.png", "mascot-service.png",
        "avatar-husky.png", "map-florida.png", "hero-map-mascot.png",
        "step-1-call.png", "step-2-quote.png", "step-3-work.png",
        "step-4-followup.png",
        "photo-hvac-unit.jpg", "footer-scene.png",
        "photo-home.jpg", "photo-ac-detail.jpg",
        "photo-condenser.png", "photo-van.png",
    )
    missing = [n for n in required if not (SRC / n).exists()]
    if missing:
        sys.exit(f"missing brand sources in {SRC}: {', '.join(missing)}")

    BRAND_OUT.mkdir(parents=True, exist_ok=True)

    print("knocking out backgrounds...")
    lockup = knockout(SRC / "logo-mascot.png")
    badge = knockout(SRC / "logo-badge.png")
    mascot = knockout(SRC / "mascot.png")

    print("writing logos...")
    emit(lockup, "logo-mascot", 1200, png=True)
    emit(lockup, "logo-mascot-sm", 480)
    emit(badge, "logo-badge", 1000, png=True)
    emit(badge, "logo-badge-sm", 400)
    emit(mascot, "mascot", 900, png=True)
    emit(mascot, "mascot-sm", 360)

    print("writing badges...")
    emit(knockout(SRC / "badge-locally-owned.png"), "badge-locally-owned", 640, png=True)

    print("writing mascot poses...")
    emit(knockout(SRC / "mascot-bust.png"), "mascot-bust", 800, png=True)
    emit(knockout(SRC / "mascot-bust.png"), "mascot-bust-sm", 400)
    emit(knockout(SRC / "mascot-service.png"), "mascot-service", 900, png=True)
    emit(knockout(SRC / "mascot-service.png"), "mascot-service-sm", 450)
    emit(knockout(SRC / "avatar-husky.png"), "avatar-husky", 256, png=True)
    for n in ("step-1-call", "step-2-quote", "step-3-work", "step-4-followup"):
        emit(circle_align(SRC / f"{n}.png"), n, 480)
    emit(knockout(SRC / "map-florida.png"), "map-florida", 1100, png=True)
    emit(knockout(SRC / "map-florida.png"), "map-florida-sm", 550)
    emit(knockout(SRC / "hero-map-mascot.png"), "hero-map-mascot", 1200, png=True)
    emit(knockout(SRC / "hero-map-mascot.png"), "hero-map-mascot-sm", 600)

    print("writing photography...")
    # Hero runs full-bleed, so it needs a large source; the rest sit in panels.
    emit_photo("hero-coast.jpg", [1920, 1200, 760])
    emit_photo("photo-condenser.png", [1024, 640])
    emit_photo("photo-hvac-unit.jpg", [1280, 760])
    emit_photo("photo-home.jpg", [900, 560])
    emit_photo("photo-ac-detail.jpg", [900, 560])
    emit_photo("footer-scene.png", [1600, 1000], quality=78)
    emit_photo("photo-van.png", [1024, 640])

    print("writing icons...")
    build_favicon(badge)
    build_og(lockup)
    print("\ndone.")


if __name__ == "__main__":
    main()
