# 9. Branding & Design is absorbed into Social Media Management

Date: 2026-08-06

## Status

Accepted.

## Context

The marketing site sold six services (`siteContent.services.items`), two of
which overlapped heavily:

- **Branding & Design** (`/services/branding`) — header + three case studies:
  `@baksodenny` (*re-branding*), `@bbold.mmxx` (*Brand Kickstart & Social Media
  Setup*), `@fourevergift_` (*Social Media Setup*).
- **Social Media Management** (`/services/social-media`) — header + four
  showcase cards (colour palette + Instagram-grid mockup, one per industry).

Two of the three "branding" case studies were already social-media engagements
by their own `service` label. In practice Activid does not sell a logo without
the feed it lives in — the split was on the site, not in the business.

The split also cost the social page its evidence: all four showcases carried
`description: ''`, so the page showed four pretty grids and zero results, while
the only hard numbers on the site ("engagement naik 60% dalam 2 bulan") sat on
the page nobody linked to from the pitch.

## Decision

**One service, named Social Media Management.** The `branding` card is removed
from `siteContent.services.items` (6 → 5) and `servicePages.branding` is
deleted. The surviving card keeps `id: 'social-media'` and `/services/social-media`.

- **Branding is absorbed, not retired.** Activid still sells logo, palette and
  typography work — it is now scoped as the front half of a social-media
  engagement rather than a standalone line. The merged description says so
  explicitly, and existing "branding" mentions in `aboutUs`, `ctaSection` and
  page metadata stay correct because of it.
- **The title does not name branding.** "Social Media Management" is what
  clients ask for; "Branding & Design" is what they get on the way there. The
  word survives in body copy, case-study labels and the `<h1>` sub-description,
  not in the card title.
- **The three case studies move** to `servicePages.socialMedia.projects` and now
  render on the merged page below the showcases (breadth first, then depth).
  `/work` reads them from the new path with `social-*` ids and a `'Social Media'`
  type fallback — the retired word is gone from the aggregate page too.
- **`/services/branding` 404s. No redirect.** Rejected a 301 to
  `/services/social-media`: `next.config.ts` has no `redirects()` today, and
  adding the first one to preserve a page with no inbound links or ranking is
  config for a value that never changes.

**The merged page is redesigned around the dark shell**, which was the stronger
of the two and the one the cream showcase cards were designed against:

- Header gains its missing right half (`our_service_cover_1.jpg`, the same image
  as the landing card, so the click lands on what was clicked). Previously a
  `lg:w-1/2` child sat alone in a `flex-row` with the other half empty.
- Two labelled sections — *Showcase* / "Ragam industri yang kami tangani" and
  *Case Study* / "Hasil nyata dari brand yang kami bangun". Headings live in
  `siteContent`, not the component, so copy edits never open a `.tsx`.
- `ShowcaseItem.description` (empty on all four) is deleted; `category` — which
  existed but rendered only into `alt` text — becomes the visible industry label.
- Case-study accent colours are re-tuned for the dark background:
  `#D9381E → #FF6B52`, `#8B4513 → #D9A066`, `#E91E63 → #FF6FA5`. The cream-era
  brown scored ~2.4:1 on `#0B0F19`. Rejected dropping `project.color` entirely —
  on the page that sells colour work, colour that works is the argument.
- The cream result card (`bg-white/40`) becomes glass (`bg-white/5` +
  `border-white/10`).

## Consequences

- **The landing grid holds 5 cards in `lg:grid-cols-3`** — last row carries two,
  left-aligned. Social Media Management is now card #1.
- **Any inbound link to `/services/branding` breaks.** Accepted: nothing on the
  site linked to it except the card being deleted.
- **`BrandingPageContent` is gone from `types/site-content.types.ts`**;
  `SocialMediaPageContent` gains `projects` (reusing the loose `ProjectItem`)
  plus four heading strings.
- **Branding is now unsearchable as a service name.** Someone scanning card
  titles for "branding" will not find it. Accepted deliberately — the merged
  offering is sold under one name, and the word still appears in the card
  description directly beneath the title.
