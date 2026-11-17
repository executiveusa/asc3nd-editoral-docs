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
