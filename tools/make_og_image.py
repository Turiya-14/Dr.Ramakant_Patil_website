"""
Build the 1200 x 630 social-preview image (public/images/og-image.jpg).

Usage (Python 3.10+, Pillow and fontTools with brotli installed), from the
project folder:

    python tools/make_og_image.py

Uses the portrait cut-out and the self-hosted fonts already in public/, so it
needs no other inputs. The tagline is read from the TAGLINE constant below;
keep it in step with `hero.tagline` in src/content.mjs.
"""

import tempfile
from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
TAGLINE = "Caring for children, guiding families."

NAVY = (11, 31, 58)
GOLD = (201, 168, 76)
BRONZE = (125, 95, 26)
INK = (29, 36, 49)
SOFT = (60, 68, 84)
PAPER = (246, 241, 231)


def ttf(woff2_name: str, tmp: Path) -> str:
    """Pillow cannot read WOFF2, so decompress to a temporary TTF."""
    font = TTFont(PUBLIC / "fonts" / woff2_name)
    font.flavor = None
    out = tmp / (Path(woff2_name).stem + ".ttf")
    font.save(out)
    return str(out)


def main() -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
        tmp = Path(tmpdir)
        display = ttf("cormorant-garamond-latin-wght-normal.woff2", tmp)
        display_italic = ttf("cormorant-garamond-latin-500-italic.woff2", tmp)
        sans = ttf("dm-sans-latin-wght-normal.woff2", tmp)

        W, H = 1200, 630
        im = Image.new("RGB", (W, H), PAPER)
        d = ImageDraw.Draw(im)
        d.rectangle([0, 0, W, 10], fill=NAVY)  # echoes the site header

        # Portrait on its ochre panel inside a closed gold keyline (as on the site).
        cut = Image.open(PUBLIC / "images" / "portrait-cutout-1440.webp")
        pw = 560
        ph = round(cut.height * pw / cut.width)
        cut = cut.resize((pw, ph), Image.LANCZOS)
        px0, py0 = W - pw - 40, H - ph - 40
        panel = [px0 + int(pw * 0.09), py0 + int(ph * 0.15), px0 + pw - int(pw * 0.03), py0 + ph]
        d.rectangle(panel, fill=GOLD)
        o = 12
        d.rectangle([panel[0] - o, panel[1] - o, panel[2] + o, panel[3] + o], outline=GOLD, width=1)
        im.paste(cut, (px0, py0), cut)

        def font(path, size, weight=None):
            f = ImageFont.truetype(path, size)
            if weight is not None:
                try:
                    f.set_variation_by_axes([weight])
                except OSError:
                    pass  # static fallback
            return f

        def tracked(xy, text, f, fill, tracking):
            x, y = xy
            for ch in text:
                d.text((x, y), ch, font=f, fill=fill)
                x += d.textlength(ch, font=f) + tracking

        x = 64
        tracked((x, 118), "PEDIATRICIAN  ·  NASHIK", font(sans, 19, 600), BRONZE, 2.4)
        d.text((x, 158), "Dr. Ramakant", font=font(display, 92, 500), fill=NAVY)
        d.text((x, 250), "Patil", font=font(display_italic, 92), fill=NAVY)
        d.line([x, 380, x + 56, 380], fill=GOLD, width=2)
        tracked((x, 402), "MBBS, MD (PAEDIATRICS), FIAP", font(sans, 21, 500), INK, 1.6)
        d.text((x, 452), TAGLINE, font=font(display_italic, 36), fill=SOFT)

        out = PUBLIC / "images" / "og-image.jpg"
        im.save(out, quality=86, optimize=True, progressive=True)
        print(f"Wrote {out.relative_to(ROOT)} ({out.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
