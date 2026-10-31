# SatSet screenshot selection

Source: the supplied `Satset-tablet.mp4` recording on Google Drive,
file ID `15Sx56lul_4D0SDEzBjoCn4nnybQvo5a-`. Duration: 9:48.89;
source resolution: 1152 x 720. The video stays outside the repository.

74 frames were sampled at eight-second intervals. The strongest scenes were
checked at full resolution and compared with adjacent frames to avoid transitions.

| Asset | Exact timestamp | Why this frame |
| --- | --- | --- |
| `floor.webp` | 05:27 | Complete table overview with available tables, two ready tables, and a settled bill. Best lead image because the room state is clear at a glance. |
| `orders.webp` | 00:32 | Photo menu and populated order cart visible together, without a modifier dialog or keyboard. |
| `kitchen.webp` | 05:19 | Three preparation tickets, modifiers, timers, and partially completed items are visible together. |
| `cashier.webp` | 01:44 | A complete itemized bill alongside cash received and payment confirmation. No transaction dialog obscures the screen. |

Each frame is cropped to `(x=0, y=28, width=1136, height=672)`, removing only
Android's system bars and the recording control at the extreme right. App text,
figures, colors, and layout are unchanged. The assets are encoded as WebP at
quality 90. The website identifies them as demo app screens and allows opening
the complete image for a closer look. Responsive 480 px and 800 px derivatives
let the browser select a smaller download when appropriate. Collapsed walkthrough
screens lazy-load.

The FAQ and revised pairing instructions were checked against the adjacent
SatSet repository's `lib/ui/features/onboarding/views/mode_select_screen.dart`,
`lib/ui/features/auth/view_models/pin_view_model.dart`,
`lib/data/services/firebase_admin_service.dart`, and
`docs/marketing/FEATURES.md`. The current pairing flow selects a discovered LAN
server; it does not require the QR scan described by the older landing copy.
Account verification is required for the first admin sign-in; offline cold starts
have a seven-day verification window. Existing prices and offer terms are retained.
