"""Regenerate SatSet's WOFF2 subsets; requires fonttools[woff]."""

from io import BytesIO
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont


FONT_DIR = Path(__file__).resolve().parent
SOURCE_DIR = FONT_DIR.parents[1] / "fonts" / "google"
UNICODES = "U+0000-024F,U+2000-206F,U+20A0-20CF,U+2122,U+2190-2199,U+2212,U+FEFF,U+FFFD"

for family, output in [
    ("bricolagegrotesque", "bricolage-latin.woff2"),
    ("hankengrotesk", "hanken-latin.woff2"),
]:
    font = TTFont(SOURCE_DIR / family / "normal.woff2")
    if family == "bricolagegrotesque":
        instantiateVariableFont(font, {"wdth": 100, "wght": 700}, inplace=True)
        # Reload so lazy variation tables see the instantiated glyph set.
        buffer = BytesIO()
        font.save(buffer)
        buffer.seek(0)
        font = TTFont(buffer)
    options = subset.Options()
    options.layout_features = ["*"]
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=subset.parse_unicodes(UNICODES))
    subsetter.subset(font)
    font.flavor = "woff2"
    font.save(FONT_DIR / output)
