# Context — Glossary

Canonical language for this codebase. Definitions only; no implementation detail.

## Terms

**Activid** — The portfolio website and web-based creative-agency product. The umbrella brand under which the mobile apps ship.

**Palakat** — A mobile application (iOS + Android) published under Activid.

**Bol-bol Studio** — A self-photo-studio booking page (`/bol-bol-studio`), its own standalone brand world: independent theme, fonts, and layout, not part of the marketing site or invitation platform. Mobile-first; the booking flow is a multi-step (Tanggal → Jam → Paket → Latar → Konfirmasi → Selesai) single-page carousel that submits via WhatsApp.

**Latar (Background)** — The studio backdrop the customer poses against, chosen as a required step between Paket and Konfirmasi. A fixed set of named backdrop options (e.g. white, peach, green, corner), each shown as a labelled photo thumbnail; selecting one advances the flow. The chosen Latar appears in the Konfirmasi order summary and in the WhatsApp message. Distinct from a Paket (a priced session) and an Add-on.

**LOIT** — Full product name **LOIT — Shareable Finance Tracker**. A mobile application (iOS + Android) published under Activid. Always written uppercase. Collects: account identity (name/username) + contact (email/phone), camera + photos (uploaded and stored), and location. Backed by Supabase (auth, database, photo storage), Firebase (analytics + crash reporting), Firebase Cloud Messaging (push; device token collected), and Google Play Services / Maps (location).

**Privacy Policy** — Site-wide legal page (`/privacy`) covering Activid, Palakat, and LOIT jointly.

**LOIT Privacy Policy** — App-specific privacy policy (`/privacy-loit`) scoped to LOIT alone, authored for Google Play Data Safety compliance. Standalone URL pasted into Play Console; not linked from the site footer. Distinct from the joint **Privacy Policy**.

**Account Deletion** — The user-facing data/account deletion flow (`/account-deletion`), via WhatsApp + email to the Activid admin. The deletion path that **LOIT Privacy Policy** points to.

**Invitation Catalog** — The invitation landing page (`/invitation`): a grid of template cards, each showing a small live preview of the rendered template, with filtering by purpose, a preview dialog, testimonials, and FAQ. The shopper-facing entry to the invitation platform. Distinct from a rendered **Invitation** (a single `/invitation/{slug}` page) and from the **Demo Playground** (the theme/purpose switcher shown on `*-demo` slugs).

**Preview Mode** — A lightweight render of an invitation template intended for embedding inside a Catalog card: the bare template only, without the Demo Playground sidebar, music, or auto-scroll. Optimized for being one of several simultaneous on-page previews rather than a standalone, interactive invitation.
