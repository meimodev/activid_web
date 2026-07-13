# Context — Glossary

Canonical language for this codebase. Definitions only; no implementation detail.

## Terms

**KenanganKita** — Event photo platform (`/kenangan`). Guests join an **Event** via a link/QR (no app, no account), snap photos into a shared live feed; after the event the **Host** can buy an AI-enhanced, colour-graded final gallery. Guest-facing and host-facing copy is Bahasa Indonesia.

**Event Link (Tautan Acara)** — The guest-facing address that identifies an Event and forms the URL a Guest scans or opens to reach its **Guest Landing**. Auto-derived from the Event's name with an appended uniqueness marker, not chosen or typed by the **Host** — the Host sees it as a read-only preview while creating the Event. Stable for the Event's life; printed on the Event QR.

**Live Feed** — The shared, real-time gallery of Guest photos shown while an Event is Live. Guest-facing label "Galeri Langsung". The screen a scanning Guest is taken to during the Event; Guests both view it and shoot into it. Distinct from the **Memory Gallery**.

**Memory Gallery** — The curated final gallery the Host publishes after the Event has ended. Guest-facing label "Galeri Kenangan". A hand-picked, AI-enhanced subset — not the raw Live Feed. The screen a Guest reaches once the Event is Published.

**Guest Landing** — The token-gated entry point a Guest reaches by scanning the Event QR. Not a destination in itself: it authorizes the Guest and forwards them to the right screen for the Event's current state — the **Live Feed** while the Event runs, the **Memory Gallery** once it is Published. An invalid or missing token stops here with a re-scan prompt.

**Host** — The person who owns and runs one or more Events. Identified by a **Host Account** (Google login via Firebase Auth). The sole host-login mechanism; the old per-event access-code and global admin-code logins are retired. Distinct from a **Guest** (anonymous, link-only, never authenticated) and from the **Admin**.

**Host Account** — A Google identity (Firebase Auth) that owns Events. One account may own many Events; each Event has exactly one owner. Self-serve: any Google account can sign in and create Events.

**KenanganKita Landing** — The public marketing entry page at `/kenangan`: a warm, celebratory pitch aimed at prospective **Hosts**, ending in a single sign-in call-to-action that links to `/kenangan/host`. The only KenanganKita surface a **Guest** never reaches by design (Guests arrive only via event links). Distinct from the host login page (`/kenangan/host`) and the **Host Console** (`/kenangan/host/events`).

**Host Console** — The signed-in **Host**'s home at `/kenangan/host/events`: a mobile-app-style shell with a bottom navbar. Two tab views — **Dashboard** (the list of every Event the Host Account owns; admins see all) and **Create** (the new-Event form) — plus a **Logout** action (confirm, then end session). An individual Event opens as a pushed detail screen outside the Console (its own route, back button, no navbar). Distinct from the host login page, which is pre-auth and has no navbar.

**Admin** — Privileged ops role, not a normal Host. Identified by an email allowlist (not a code). Can see all Events and confirm manual payments that unlock the paid enhanced gallery. Powers a Host lacks.

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
