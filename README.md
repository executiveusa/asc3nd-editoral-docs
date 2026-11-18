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

- 53 slides: 43 original requests, six client-input items and four later release updates, with verbatim founder text, 2-column desktop comparisons and stacked mobile panels.
- Large click targets, swipe left/right, arrow keys, previous/next, a contents chooser and progress.
- Paper-turn transition can be toggled off. Respects `prefers-reduced-motion`; no autoplay audio.
- Feedback can be marked Looks good / Needs a change / Question and commented upon.
- **Code-free cloud feedback:** Comments and decisions save automatically through the deployed `asc3nd-editbook-review` Supabase Edge Function. Each browser has its own randomly generated session; localStorage is an offline backup, not the owner inbox.
- Reviewers do not need to enter a code or password. Browser submissions use a public, origin-restricted endpoint with no service credentials in the HTML. The owner receives queued email notifications at `executiveusa@gmail.com` via the existing ASC3ND notification system; the existing system reports successful provider delivery for a controlled QA message.

## Release gate and verification

- The public no-code API at `https://cyxdevcjycmffhmwxojh.supabase.co/functions/v1/asc3nd-editbook-review` is deployed with reviewer-session isolation and request validation. No staff or service token is sent to clients.
- The live integration test persists and reads back a synthetic empty review; other sessions cannot read it. Invalid slides, oversized notes and disallowed origins are rejected.
- A separate controlled QA comment was queued for owner notification, marked `sent` by ASC3ND's existing scheduled Resend worker, and independently found in `executiveusa@gmail.com`; its synthetic progress row was then deleted.
- Every meaningful comment or decision is persisted centrally. First update per slide queues owner email; subsequent updates during the two-minute notification cooldown remain in the same database record. The background email dispatcher runs every minute.
- Browser UI must show `Saved to ASC3ND review inbox` only after the cloud server acknowledges persistence. When storage fails, notes remain local and the UI states delivery has not occurred.
- Confirm a Vercel preview and the stable production alias before presenting this as a deployed frontend. The team's free-tier Vercel API deployment quota has previously blocked production deployments; no production status should be inferred from passing CI.
- Anonymous public review links can be spammed by determined attackers even with origin checks and input bounds; monitor submission rates, control the distribution of the review link, and add bot protection if needed.
- Existing `/api/review.js` (client/staff bearer-token API) is legacy and remains protected, but is no longer called by the code-free page. Do not provision its service key unnecessarily.

Rollback: revert the frontend PR. Disable or redeploy `asc3nd-editbook-review` to stop incoming anonymous reviews; drop only `trg_asc3nd_review_owner_notification` and `asc3nd_private.queue_editbook_review_update()` to stop email alerts. Do **not** delete stored client feedback as part of rollback.

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

### Current shared feedback architecture

- **Storage:** existing `public.asc3nd_client_guide_progress` rows with `guide_slug='website-review-2026-11'`, client keys `public:<browser-session>:<slide-id>`, and per-slide comment history.
- **Edge Function:** source `supabase/functions/asc3nd-editbook-review/index.ts`. Public PUT validates slide IDs, comment length, decision, session and origin; public GET returns only that session's own notes. The Supabase service key remains inside the managed Edge Function.
- **Notifications:** `supabase/migrations/20261118055000_asc3nd_review_owner_notification_queue.sql` records the independently tested trigger that enqueues review messages into the pre-existing `asc3nd.site_notification_outbox`. The existing minute cron and `asc3nd-site-notifications` Resend worker forward these to `executiveusa@gmail.com`.
- **Client:** `index.html` saves locally instantly, automatically syncs on debounce and retries failed cloud saves. An optional reviewer name is attached to the note, without requiring sign-in.
- **Safety:** do not collect youth identifying information; public comments are untrusted text and are escaped by the existing email worker. No review endpoint exposes staff or volunteer CRM records.

### Data download boundary

The slide-deck `Download full review · PDF` and `Download document · Google Docs` options export the **entire before/after presentation and the reviewer's visible draft**, *not* sensitive CRM contact records. The latter belong to the existing staff-only `/admin` panel of the canonical website, which already includes protected CSV export. Keep raw email, phone, child/guardian data, consent proof, and unverified import records out of client-facing reports. A separate admin-only combined export should include provenance, timestamps, interest routes, consent, event attendance, opt-in states, and review status, with role checks and audit logging. Do not count pending import rows as verified volunteers.

### Cover image

The exact founders' raster image is reused from `executiveusa/asc3nd-brand-site/public/brand/asc3nd-collective-logo.webp` and stored locally at `assets/asc3nd-collective-logo.webp`. The cover includes the actual asset rather than an approximation or a fragile cross-repository URL.

### Rollback

- Revert this PR or deploy the prior Vercel preview commit to remove reader changes.
- To disable server persistence without changing the database, remove the preview's review tokens or disable the `/api/review` function.
- The new unpublished guide row can be archived after checking there is no client feedback; never cascade-delete feedback automatically.
