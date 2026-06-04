# Context — Glossary

Canonical language for this codebase. Definitions only; no implementation detail.

## Terms

**Activid** — The portfolio website and web-based creative-agency product. The umbrella brand under which the mobile apps ship.

**Palakat** — A mobile application (iOS + Android) published under Activid.

**LOIT** — Full product name **LOIT — Shareable Finance Tracker**. A mobile application (iOS + Android) published under Activid. Always written uppercase. Collects: account identity (name/username) + contact (email/phone), camera + photos (uploaded and stored), and location. Backed by Supabase (auth, database, photo storage), Firebase (analytics + crash reporting), Firebase Cloud Messaging (push; device token collected), and Google Play Services / Maps (location).

**Privacy Policy** — Site-wide legal page (`/privacy`) covering Activid, Palakat, and LOIT jointly.

**LOIT Privacy Policy** — App-specific privacy policy (`/privacy-loit`) scoped to LOIT alone, authored for Google Play Data Safety compliance. Standalone URL pasted into Play Console; not linked from the site footer. Distinct from the joint **Privacy Policy**.

**Account Deletion** — The user-facing data/account deletion flow (`/account-deletion`), via WhatsApp + email to the Activid admin. The deletion path that **LOIT Privacy Policy** points to.
