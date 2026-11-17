# ASC3ND Editorial Docs — client feedback flipbook

Mobile-first, static mockup for the **November 12, 2026 website review**. It does **not** alter the ASC3ND production website, client data or existing progress-book repo.

## Preview

Open `index.html` in a browser, or deploy the same static file through an approved host. The source is intentionally dependency-free.

**Design references:** `executiveusa/asc3ndflipbook` for large leather-and-paper pages, page-turn motion, visible controls, typography, gold accents and opt-in reading behavior. This is an isolated reimplementation, not a replacement of that product.

## Content and evidence

- **Exact source:** client document `Asc3nd Website Updates 11.12.26.docx`, 13 pages.
- **Updated implementation:** `executiveusa/asc3nd-brand-site`, as published at https://asc3nd-org.netlify.app.
- All quoted passages are copied from the client's document; panel content is abbreviated for short attention spans.
- Historical BEFORE panels without verified original screenshots are **textual descriptions, not fabricated screenshots**.
- Slides with client dependencies are visibly labeled **CLIENT INPUT PENDING**.
- Original client email requested `main@asc3ndcollective.com`, but the site owner later explicitly confirmed `main@asc3nd.org`. The latter remains canonical. Do not silently change it.

## Interaction and accessibility

- 12 short slides, one clear change per page; 2-column desktop comparisons, stacked panels on mobile.
- Large click targets, swipe left/right, arrow keys, previous/next, a contents chooser and progress.
- Paper-turn transition can be toggled off. Respects `prefers-reduced-motion`; no autoplay audio.
- Feedback can be marked Looks good / Needs a change / Question and commented upon.
- **Feedback is a local prototype only.** It stays in the current browser's `localStorage`, can be exported as JSON, and does **not** sync between devices or submit to a server.
- All live links open verified site routes. No passwords, personal access tokens, or public write endpoints.

## Required before sending to client

1. Verify screenshots and visual presentation at 320px/390px/768px/1440px, including Chrome and Safari if possible.
2. Verify content against the source file, recent merged site and client constraints.
3. Add a real owner-controlled feedback backend with an unguessable reviewer invitation, authentication or signed access, server-side input validation, and append-only decision history. Reuse current ASC3ND server capabilities before creating new tables.
4. Require save acknowledgement, replay-safe submissions, delete/export controls, and permission-tested reviewer/admin boundaries. Do **not** present browser-local saves as submitted feedback.
5. Independent review, owner approval, deploy preview and rollback. Do not change the `asc3nd.org` apex DNS.
6. Replace external logo hotlink with an owner-controlled approved asset when publishing (the mocked page includes a CSS text identity fallback).

## Scope

This PR is a **mockup**, not a production feedback portal. No extra agent framework, no new database, no new AI copy, no secrets. Reuse before adding.

## November 17 database inspection and connected review protocol

The canonical participation API in `executiveusa/asc3nd-brand-site` uses Supabase project `cyxdevcjycmffhmwxojh` (currently labeled `botanic-creations` in the connected account). **Do not create another CRM or import volunteer contacts to the editorial review.**

### Live ASC3ND data inventory (read-only inspection on 2026-11-17)
- `asc3nd.people`: **2** canonical people.
- `asc3nd.person_routes`: **3** routes: donor (1), updates (2). Volunteer (0), mentor (0).
- `asc3nd.participation_intakes`: **1** donor intake.
- `asc3nd.event_rsvps`: **0**.
- `asc3nd.import_contacts_staging`: **44** records, **all pending**. Not automatically approved volunteers or subscribers.
- `asc3nd.followup_tasks`: **3**.
- `asc3nd.events`: **1** stored event, legacy name `Community Cuts for Kids` and venue `Tangles & Locs`. Public brand website now calls the initiative `Fresh Fade, Fresh Grade`. Do not rewrite historical identifiers without a reviewed migration.

### Secure autosave design (code on feature branch)
- The already existing `public.asc3nd_client_guides` and `public.asc3nd_client_guide_progress` tables are reused.
- Created unpublished guide row `website-review-2026-11` in the canonical database, preserving the existing Instagram guide. No participant records were copied.
- `api/review.js` handles GET (read both reviewers' decisions) and PUT (save only the authenticated reviewer's slide). Comments are capped at 3000 chars; slide IDs and decisions validated.
- A private reviewer code is exchanged for server-side access. One code for the client, one for ASC3ND staff; codes are **never committed to Git**. API compares hashes with a constant-time check.
- The API uses Supabase service-role credentials **only server-side**. The static reader does not receive the service key.
- Review notes still save locally when the API is unavailable. Failed server writes are marked as unsynced, not as completed.
- **Server persistence is not live until the required environment variables are provisioned and an authorized client/staff workflow is tested.**

### Vercel configuration before enabling shared feedback
Provision these in Vercel project `asc3nd-editoral-docs`, in the **preview** environment first, from the owner's password manager or approved integration. Do not paste secrets into a PR, issue, document, or chat log.

- `SUPABASE_URL`: the verified ASC3ND canonical Supabase API URL.
- `SUPABASE_SERVICE_ROLE_KEY`: service-only credential held by the server, never exposed in HTML.
- `ASC3ND_REVIEW_CLIENT_TOKEN`: an independently generated, random access token of at least 24 characters.
- `ASC3ND_REVIEW_STAFF_TOKEN`: a separate independently generated token of the same minimum strength.

Send the client access code only over an appropriate private channel. Server routes must respond 401 for missing/wrong tokens. Verify GET and PUT from two authenticated browsers, autosave after reload, PDF/Google Docs export, cross-role display, and that a client token cannot impersonate staff. Consider rate limiting and expiring reviewer codes before broader production launch.

### Data download boundary

The slide-deck `Download full review · PDF` and `Download document · Google Docs` options export the **entire before/after presentation and the reviewer's visible draft**, *not* sensitive CRM contact records. The latter belong to the existing staff-only `/admin` panel of the canonical website, which already includes protected CSV export. Keep raw email, phone, child/guardian data, consent proof, and unverified import records out of client-facing reports. A separate admin-only combined export should include provenance, timestamps, interest routes, consent, event attendance, opt-in states, and review status, with role checks and audit logging. Do not count pending import rows as verified volunteers.

### Cover image

The exact founders' raster image is reused from `executiveusa/asc3nd-brand-site/public/brand/asc3nd-collective-logo.webp` and stored locally at `assets/asc3nd-collective-logo.webp`. The cover includes the actual asset rather than an approximation or a fragile cross-repository URL.

### Rollback

- Revert this PR or deploy the prior Vercel preview commit to remove reader changes.
- To disable server persistence without changing the database, remove the preview's review tokens or disable the `/api/review` function.
- The new unpublished guide row can be archived after checking there is no client feedback; never cascade-delete feedback automatically.
