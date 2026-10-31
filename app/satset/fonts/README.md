# SatSet fonts

Latin subsets of the existing Bricolage Grotesque and Hanken Grotesk fonts in
`app/fonts/google/`. Their SIL Open Font License files remain beside the sources.
Optical-size variations are retained. Bricolage uses only the 700 weight on this
page, so its weight axis is fixed at 700 and its width at the default (100). Hanken
retains its weight variations for body text and controls.

Regenerate from the repository root with Python and `fonttools[woff]` installed:

```sh
python app/satset/fonts/subset.py
```

The character set includes Latin letters, Latin extensions, punctuation, currency
symbols, and arrows. Keep it broad enough for both Indonesian and English.
