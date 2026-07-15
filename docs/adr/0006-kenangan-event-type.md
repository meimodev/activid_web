# KenanganKita Event Type is set once at creation and baked into the frozen slug

Every Event gets an **Event Type** (Pernikahan / Ulang Tahun / Syukuran / Acara, default Acara) chosen at creation. Its `id` doubles as the leading token of the auto-derived **Event Link** (`pernikahan-budi-dan-ani-x7k2q`) and its label leads the display title ("Pernikahan Budi & Ani"). Unlike every other Event field, the type is **not editable after creation** and does not appear on the edit form.

Why creation-only: the slug is immutable for the Event's life (printed on the QR — see ADR-0004), and the type is embedded in it. Allowing the type to change later would let the display title ("Syukuran …") drift from a slug still reading `pernikahan-…`, manufacturing a mismatch for no user benefit. Freezing the type alongside the slug it feeds keeps the two consistent by construction.

Legacy Events created before this change have no `eventType` and render their raw stored name (no prefix) — the display helper only prepends a label when the field is present, so no backfill is needed.
