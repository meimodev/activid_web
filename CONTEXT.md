# Context — Glossary

Canonical language for this codebase. Definitions only; no implementation detail.

## Terms

**KenanganKita** — Event photo platform (`/kenangan`). Guests join an **Event** via a link/QR (no app, no account), snap photos into a shared live feed; after the event the **Host** can buy an AI-enhanced, colour-graded final gallery. Guest-facing and host-facing copy is Bahasa Indonesia.

**Event Link (Tautan Acara)** — The guest-facing address that identifies an Event and forms the URL a Guest scans or opens to reach its **Guest Landing**. Auto-derived from the Event's **Event Type** token, then the Event's name, then an appended uniqueness marker (e.g. `pernikahan-budi-dan-ani-x7k2q`), not chosen or typed by the **Host** — the Host sees it as a read-only preview while creating the Event. Stable for the Event's life; printed on the Event QR.

**Event Type (Jenis Acara)** — A fixed category the **Host** picks when creating an **Event**: one of Pernikahan / Ulang Tahun / Syukuran / Acara, where **Acara is the default and the generic catch-all**. Chosen once at creation and never changed afterward (not shown on the edit surface). Its word leads the Event's **display title** — the Host and Guest see the Event as "{Type} {name}" (e.g. "Pernikahan Budi & Ani"), though the name is stored without it — and forms the leading token of the **Event Link**. Purely a naming/categorization choice: not a feature bundle, not tied to a theme or **Paket**.

**Event Cover (Foto Sampul)** — Optional hero image the **Host** sets for an **Event**, shown on the **Guest Landing** above the Event name (4:3). Chosen in the **Host Console** event settings by uploading an image or picking one of three built-in **Default Covers**. Absent by default — an Event with no cover simply shows no hero image.

**Default Cover** — One of three ready-made **Event Cover** images offered in the picker, each named after a LUT theme band (Hangat / Klasik / Ceria) yet selectable independently of the Event's chosen theme — the name signals a visual mood, not a binding to `themeId`. Shared across all Events (not per-Event), so never deleted by a Host's cover change.

**Paket (KenanganKita)** — A guest-capacity plan the **Host** selects for an **Event**: a named size band (Intimate / Standard / Grand) that advertises how many Guests the Event is sized for; a price attaches to that band, it is not a bundle of features. The **guest cap is an advertised number, not an enforced limit** — nothing blocks a Guest beyond it; the band exists to price the Event, not to gate runtime. Stored on the Event as its `tier`. Chosen by the Host at Event creation and paid **upfront**: creating an Event raises a pending Paket order, and the Event cannot go Live until the **Admin** confirms that payment. Once confirmed the Paket is locked. A separate money from the post-event enhanced-gallery purchase — paying for the Paket unlocks running the Event, not the **Memory Gallery**. Guest-facing label "Paket". Distinct from the Bol-bol Studio **Paket** (a priced studio session).

**Live Feed** — The shared, real-time gallery of Guest photos shown while an Event is Live. Guest-facing label "Galeri Langsung". The screen a scanning Guest is taken to during the Event; Guests both view it and shoot into it. Distinct from the **Memory Gallery**.

**Photo Moderation (Moderasi Foto)** — The Host task, available while an Event is **Live**, of hiding unwanted Guest photos so they vanish from the **Live Feed**. Only two outcomes: a photo is shown or hidden. Distinct from **Photo Curation**, which happens later and picks winners rather than removing offenders. Host-facing only.

**Photo Curation (Kurasi Foto)** — The Host task, available once an Event is **Closed**, of marking the best Guest photos as **Keepers** for the **Memory Gallery**. A photo can also still be hidden here. The step that feeds Publishing and the optional AI enhancement. Distinct from **Photo Moderation**.

**Keeper (Terpilih)** — A Guest photo the Host has marked, during **Photo Curation**, to include in the published **Memory Gallery**. Only Keepers reach the Memory Gallery (and are AI-enhanced if enhancement is purchased); non-Keepers stay in the raw **Live Feed** history but never publish. A photo is either a Keeper or not; hiding a photo clears its eligibility.

**Memory Gallery** — The curated final gallery the Host publishes after the Event has ended. Guest-facing label "Galeri Kenangan". A hand-picked, AI-enhanced subset — not the raw Live Feed. The screen a Guest reaches once the Event is Published.

**Guest Landing** — The token-gated entry point a Guest reaches by scanning the Event QR. Not a destination in itself: it authorizes the Guest and forwards them to the right screen for the Event's current state — the **Live Feed** while the Event runs, the **Memory Gallery** once it is Published. An invalid or missing token stops here with a re-scan prompt.

**Host** — The person who owns and runs one or more Events. Identified by a **Host Account** (Google login via Firebase Auth). The sole host-login mechanism; the old per-event access-code and global admin-code logins are retired. Distinct from a **Guest** (anonymous, link-only, never authenticated) and from the **Admin**.

**Host Account** — A Google identity (Firebase Auth) that owns Events. One account may own many Events; each Event has exactly one owner. Self-serve: any Google account can sign in and create Events.

**KenanganKita Landing** — The public marketing entry page at `/kenangan`: a warm, celebratory pitch aimed at prospective **Hosts**, ending in a single sign-in call-to-action that links to `/kenangan/host`. The only KenanganKita surface a **Guest** never reaches by design (Guests arrive only via event links). Distinct from the host login page (`/kenangan/host`) and the **Host Console** (`/kenangan/host/events`).

**Host Console** — The signed-in **Host**'s home at `/kenangan/host/events`: a mobile-app-style shell with a bottom navbar. Two tab views — **Dashboard** (the list of every Event the Host Account owns; admins see all) and **Create** (the new-Event form) — plus a **Logout** action (confirm, then end session). An individual Event opens as a pushed detail screen outside the Console (its own route, back button, no navbar). Distinct from the host login page, which is pre-auth and has no navbar.

**Admin** — Privileged ops role, not a normal Host. Identified by an email allowlist (not a code). Can see all Events and confirm manual payments that unlock the paid enhanced gallery. Reaches the **Payment** surface to work payments in one place. Powers a Host lacks.

**Payment (Pembayaran)** — The Admin-only surface (`/kenangan/host/payments`) listing manual-payment **Orders** across every Event and Host in one place, so the Admin need not open each Event to confirm. Pending Orders sit on top as the work queue; a short tail of recently-confirmed Orders sits below for "did I already do this?" — older confirmed Orders fall off the tail and live only on their Event. Each row carries enough context (Event name, Host email, kind, amount, date) to decide without opening the Event, plus a mailto link to reach the Host. The Admin confirms an Order here; confirming a Paket ungates the Event going Live, confirming an enhancement unlocks the **Memory Gallery**. A Host never reaches it. Distinct from the **Host Console** (Host-scoped) — Payment is an Admin ops station.

**Order** — A single manual-payment record for an Event: either a **Paket** charge (upfront, gates going Live) or an enhancement charge (post-event, unlocks the **Memory Gallery**). Raised as pending when incurred; moved to confirmed by the **Admin** on the **Payment** surface once the money is verified. One-directional — confirming is not undone in the UI.

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
