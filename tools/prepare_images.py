"""
Prepare the web images for the Dr. Ramakant Patil website.

This is a one-off, documented record of how every public image was derived.
It is NOT part of the website build (`npm run build` only copies the finished
files from public/). Re-run it only if you need to regenerate the images.

Usage (Python 3.10+, Pillow and NumPy installed):

    python tools/prepare_images.py <photo-pack-images-dir> <portrait-original.jpg> <output-dir>

    <photo-pack-images-dir>  the images/ folder from Dr_Ramakant_Patil_Research_and_Photos.zip
    <portrait-original.jpg>  source-assets/originals/dr-ramakant-patil-portrait-original.jpg
    <output-dir>             public/images

What it does (and does not do):
  * Crops and resizes only. No generative editing, no retouching of faces,
    certificates, plaques or signage.
  * The supplied portrait was delivered on a perfectly flat turquoise backdrop
    (RGB 32,176,202). The script separates the subject from that flat colour
    with a colour-difference matte, so the page can place the unaltered
    photograph of Dr. Patil on its own ochre panel. Face, suit, chair and
    posture are untouched; only the flat backdrop pixels become transparent.
  * Metadata (EXIF) is not copied into the web files.
  * A light, standard post-resize sharpen (Unsharp Mask, small radius) is
    applied to keep downscaled photographs crisp.
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SRC_DIR = Path(sys.argv[1])
PORTRAIT = Path(sys.argv[2])
OUT = Path(sys.argv[3])
OUT.mkdir(parents=True, exist_ok=True)


def find(prefix: str) -> Path:
    matches = sorted(SRC_DIR.glob(prefix + "_*"))
    if not matches:
        raise SystemExit(f"Missing source image {prefix}_* in {SRC_DIR}")
    return matches[0]


def sharpen(im: Image.Image) -> Image.Image:
    return im.filter(ImageFilter.UnsharpMask(radius=0.6, percent=35, threshold=2))


def save_webp(im: Image.Image, name: str, widths, quality=80):
    written = []
    for w in widths:
        w = min(w, im.width)
        h = round(im.height * w / im.width)
        resized = im.resize((w, h), Image.LANCZOS) if w != im.width else im.copy()
        if resized.mode == "RGB":
            resized = sharpen(resized)
        path = OUT / f"{name}-{w}.webp"
        resized.save(path, "WEBP", quality=quality, method=6)
        written.append((path.name, w, h, path.stat().st_size))
    return written


report = []

# ---------------------------------------------------------------- portrait
# Colour-difference matte against the flat turquoise backdrop.
src = Image.open(PORTRAIT).convert("RGB")
a = np.asarray(src).astype(np.float32) / 255.0
R, G, B = a[..., 0], a[..., 1], a[..., 2]
bg = np.array([32, 176, 202], np.float32) / 255.0
diff = np.minimum(G, B) - R            # backdrop ~0.565, subject <= ~0.24
subject = diff < 0.40
mask_img = Image.fromarray((subject * 255).astype(np.uint8))
dil = np.asarray(mask_img.filter(ImageFilter.MaxFilter(17))) > 127
ero = np.asarray(mask_img.filter(ImageFilter.MinFilter(17))) > 127
band = dil & ~ero                      # only the outline is soft-matted
alpha = subject.astype(np.float32)
alpha[band] = np.clip(1.0 - diff / 0.565, 0, 1)[band]
A = alpha[..., None]
fg = np.where(A > 0.02, (a - (1 - A) * bg) / np.maximum(A, 1e-3), 0)
fg = np.clip(fg, 0, 1)
excess = np.clip(np.minimum(fg[..., 1], fg[..., 2]) - fg[..., 0] - 0.06, 0, None)
spill = band & (excess > 0)            # remove turquoise spill on the outline only
fg[..., 1][spill] -= excess[spill]
fg[..., 2][spill] -= excess[spill]
cut = Image.fromarray((np.dstack([fg, alpha]) * 255 + 0.5).astype(np.uint8), "RGBA")
cut = cut.crop((0, 560, 4000, 4000))   # trim empty headroom; 4000 x 3440
report += save_webp(cut, "portrait-cutout", [720, 1080, 1440], quality=84)

# ---------------------------------------------------------- photographs
jobs = [
    # (prefix, output name, crop box or None, widths, quality)
    # P02 is the only photo of Dr. Patil at work. It is cropped to him alone,
    # clear of the monitor on the left and his colleague's chair on the right.
    # Never use P06 (DSC04910): the man at that desk is a staff member at the
    # insurance desk, not Dr. Patil.
    ("02", "dr-patil-consulting-desk", (262, 205, 770, 586), [508], 86),
    ("14", "fellowship-portrait", (220, 300, 1420, 1900), [600, 1200], 80),
    ("19", "fellowship-joint", None, [800, 1600], 80),
    ("15", "conference-ceremony", None, [600, 1100], 80),
    ("16", "conference-plaque", (352, 380, 1652, 2330), [600, 1200], 80),
    # P01 is a 360° panorama of the consulting room (not the reception).
    ("01", "antara-consulting-room", (0, 70, 1008, 430), [1008], 80),
    ("07", "antara-treatment-room", None, [800, 1400], 80),
]
for prefix, name, box, widths, quality in jobs:
    im = Image.open(find(prefix)).convert("RGB")
    if box:
        im = im.crop(box)
    report += save_webp(im, name, widths, quality=quality)

for row in report:
    print("{:<36} {:>5} x {:<5} {:>8,} bytes".format(*row))
