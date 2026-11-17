# ASC3ND founder website feedback — 43-point requirements traceability
**Source:** Otha Minnifield, email `Website Asc3nd Updates and Comments` received **2026-11-13**, attached 13-page `Asc3nd Website Updates 11.12.26.docx` dated **2026-11-12**.
**Audit date:** 2026-11-17. **Revision:** 1.0.
**Method:** Repeated Events (pp. 6–10) and Get Involved (pp. 10–13) requests are counted once, with tightly related clauses grouped into one independently testable request. Website implementation is checked against the merged `executiveusa/asc3nd-brand-site` code, not a fresh production-browser acceptance test. Editorial flipbook in `executiveusa/asc3nd-editoral-docs` includes **12** slides, not 43.
**Owner override:** Document requests `main@asc3ndcollective.com` on p.10; owner later explicitly confirmed `main@asc3nd.org`. The newer owner directive wins and is shown as *Superseded*, not forgotten.
**Statuses:** Complete = implemented in merged website code; Partial = implemented only provisionally, or awaiting externally approved content; Missing = requested material not rendered; Superseded = owner changed requirement.
**Counts:** Complete 34 · Missing 1 · Partial 7 · Superseded 1 = 43.

| # | Section | Original request (condensed; see source page) | Implemented website behavior / evidence | Status | Existing flipbook slide | Source p. |
|---|---|---|---|---|---|---|
| 1 | Story | Replace Story opening headline | It Started with a Vision. It's Growing into a Movement. <small>`app/story/page.tsx`</small> | **Complete** | — | 1 |
| 2 | Story | Replace opening narrative with founder-provided origin and mission copy | Four-paragraph mission narrative in Story intro <small>`app/story/page.tsx`</small> | **Complete** | — | 1 |
| 3 | Story | Reduce excessive Story whitespace by showcasing the work | Mission section and editorial photo carousel added <small>`app/story/page.tsx`</small> | **Complete** | 1 | 2 |
| 4 | Story | Feature real event photography, children, activities, volunteers and supplies | Four consent-confirmed Fresh Fade documentary images selected <small>`lib/editorial-proof.ts`</small> | **Complete** | 1 | 2 |
| 5 | Story | Use founders imagery consistent with later remove-her-photo instruction | Otha portrait displayed; Elisha portrait excluded from Story <small>`app/story/page.tsx`</small> | **Complete** | 2 | 2 |
| 6 | Story | Shrink Otha portrait and enlarge his quotation | Founder grid .42fr/1fr; quote typography clamp(2rem,4.3vw,5.25rem) <small>`app/interior.css`</small> | **Complete** | 2 | 2 |
| 7 | Story | Remove Elisha portrait for now | Only Otha founder block renders <small>`app/story/page.tsx`</small> | **Complete** | 2 | 2 |
| 8 | Story | Address missing Elisha quoted commentary on desktop | Elisha quote is stored in data but not rendered in Story JSX <small>`lib/site-content.ts; app/story/page.tsx`</small> | **Missing** | — | 2 |
| 9 | Story | Rename three-pillar headline to preferred language | Three Pillars. One Purpose. Endless Possibilities. <small>`app/story/page.tsx`</small> | **Complete** | 3 | 3 |
| 10 | Story | Use requested Trusted Guidance description | Client-provided copy in canonical pathways <small>`lib/site-content.ts`</small> | **Complete** | 3 (title only) | 3 |
| 11 | Story | Use requested Life Skills & Personal Growth description | Client-provided copy in canonical pathways <small>`lib/site-content.ts`</small> | **Complete** | 3 (title only) | 3 |
| 12 | Story | Use requested Community Connections & Opportunity description | Client-provided copy in canonical pathways <small>`lib/site-content.ts`</small> | **Complete** | 3 (title only) | 4 |
| 13 | Story | Remove repeated In development labels; replace with one growth statement | Story renders title/copy without status and uses one founder-proposed line; old unused status remains in data <small>`app/story/page.tsx; lib/site-content.ts`</small> | **Complete** | 3 | 4 |
| 14 | Story | Add Our Mission in Action featuring Fresh Fade and current Project Joy with photography | Both named projects appear; Fresh Fade carousel is real; Project Joy photography and story remain pending <small>`app/story/page.tsx; lib/editorial-proof.ts`</small> | **Partial** | 1,11 | 4 |
| 15 | Footer | Keep Empower youth. Elevate futures. Build community. | Footer promise preserved <small>`lib/i18n.ts; components/SiteFooter.tsx`</small> | **Complete** | — | 5 |
| 16 | Footer | Make COLLECTIVE more prominent alongside ASC3ND | Founders' complete original branded image is used in footer <small>`components/ClientBrandLockup.tsx; components/SiteFooter.tsx`</small> | **Complete** | — | 5 |
| 17 | Footer | Align crown/gold branding with the official ASC3ND logo | Footer defaults to founders' full logo asset with original crown <small>`components/ClientBrandLockup.tsx`</small> | **Complete** | — | 6 |
| 18 | Footer | Change Take part to Get Involved | English navigation/footer wording updated; /take-part URLs retained <small>`lib/i18n.ts; components/SiteFooter.tsx`</small> | **Complete** | 4 | 6 |
| 19 | Footer | Make volunteer, partner and donation information easy to find | Footer has dedicated Volunteer, Partner, Support and direct Zeffy links <small>`components/SiteFooter.tsx`</small> | **Complete** | 4 (partial) | 6 |
| 20 | Footer | Add a visible donation button in footer | Visible Zeffy CTA links to platform home pending client's campaign URL <small>`components/SiteFooter.tsx; lib/donation-config.ts`</small> | **Partial** | 5 | 6 |
| 21 | Footer | Verify organization name, Washington registration and nonprofit statements | Transparency page is cautious; authoritative IRS and registration confirmation outstanding <small>`app/transparency/page.tsx; lib/i18n.ts`</small> | **Partial** | 12 | 6 |
| 22 | Events | Replace administrative hero with Where Purpose Meets Action. | Preferred headline rendered on Events page <small>`app/events/page.tsx`</small> | **Complete** | 6 | 6 |
| 23 | Events | Replace Event archive with Our Impact in Action | Requested eyebrow rendered; no Event archive header <small>`app/events/page.tsx`</small> | **Complete** | 6 | 7 |
| 24 | Events | Use founder-proposed Events introductory paragraph | From community outreach and youth-focused initiatives... exact section text <small>`app/events/page.tsx`</small> | **Complete** | — | 7 |
| 25 | Events | Use Fresh Fade, Fresh Grade official event name | Official name displayed on Events and project pages; historical slug preserved <small>`lib/projects.ts; app/events/page.tsx`</small> | **Complete** | 7 | 7 |
| 26 | Events | Replace administrative recap with supplied Fresh Cuts... story | Founder-provided full narrative is in project summary <small>`lib/projects.ts`</small> | **Complete** | — | 8 |
| 27 | Events | Split current/upcoming from past impact | Current & Upcoming Initiatives and Past Events & Community Impact sections <small>`app/events/page.tsx`</small> | **Complete** | 8 | 8 |
| 28 | Events | Feature active Project Joy with real campaign description and participation/donation details | Current-initiative card and detail route exist; copy/media/action details pending founder approval <small>`app/events/page.tsx; lib/initiative-content.ts`</small> | **Partial** | 8,11 | 8 |
| 29 | Events | Feature Fresh Fade past recaps, photos, video and partners | Recap, gallery and film exist; partner/sponsor names remain Pending <small>`app/projects/community-cuts/page.tsx; lib/credits.ts`</small> | **Partial** | 9 | 8 |
| 30 | Events | Make the event photo gallery prominent | Full project gallery with 86 approved photos <small>`app/projects/community-cuts/page.tsx; lib/projects.ts`</small> | **Complete** | 9 | 10 |
| 31 | Events | Include available event highlights/video | Fresh Fade event film and Watch Highlights section <small>`app/projects/community-cuts/page.tsx`</small> | **Complete** | 9 | 10 |
| 32 | Events | Use Watch Highlights, View Gallery, Community Partners CTAs | All three visitor-friendly links are present <small>`app/events/page.tsx`</small> | **Complete** | 9 | 10 |
| 33 | Get Involved | Change public email to main@asc3ndcollective.com | Owner subsequently explicitly chose main@asc3nd.org; no change made <small>`components/SiteFooter.tsx`</small> | **Superseded** | — | 10 |
| 34 | Get Involved | Change headline to Be Part of Something Bigger. | Exact headline implemented <small>`app/take-part/page.tsx`</small> | **Complete** | 10 | 11 |
| 35 | Get Involved | Add preferred Every act of kindness... supporting statement | Requested supporting sentence implemented <small>`app/take-part/page.tsx`</small> | **Complete** | — | 11 |
| 36 | Get Involved | Replace still building permanent programs intro with founder-proposed copy | Full welcoming replacement paragraph implemented <small>`app/take-part/page.tsx`</small> | **Complete** | — | 11 |
| 37 | Get Involved | Explain Families & Youth opportunities, programs and resources | Family route copy and dedicated intake form <small>`lib/site-content.ts; app/take-part/family/page.tsx`</small> | **Complete** | 10 (label) | 12 |
| 38 | Get Involved | Explain Volunteers & Mentors time, talents and experience | Volunteer/mentor copy and routed intake options <small>`lib/site-content.ts; components/ParticipationForm.tsx`</small> | **Complete** | 10 (label) | 12 |
| 39 | Get Involved | Expand Community Partners & Sponsors to businesses, organizations and individuals | Sponsor/partner route and services exist, but audience types are not all explicit in card copy <small>`lib/site-content.ts; components/ParticipationForm.tsx`</small> | **Partial** | 10 (label) | 12 |
| 40 | Get Involved | Give families a way to receive email updates | Family form has explicit optional updates_opt_in checkbox <small>`components/ParticipationForm.tsx`</small> | **Complete** | — | 13 |
| 41 | Get Involved | Give volunteers an interest form rather than generic email only | Dedicated mentor-volunteer form submits to intake API <small>`app/take-part/mentor-volunteer/page.tsx; components/ParticipationForm.tsx`</small> | **Complete** | — | 13 |
| 42 | Get Involved | Give partners a partnership inquiry form | Dedicated partner form submits to intake API <small>`app/take-part/partner/page.tsx; components/ParticipationForm.tsx`</small> | **Complete** | — | 13 |
| 43 | Get Involved | Add fourth Support Our Mission category with Zeffy donation path | Fourth card opens focused Support page; temporary Zeffy homepage, verified campaign still missing <small>`lib/site-content.ts; components/SupportView.tsx`</small> | **Partial** | 5,10 | 13 |

## What is missing from the 12-slide client flipbook
- The presentation **does not include one-to-one proof for all 43 requests**. Several slides aggregate 3–6 requirements into one before/after; some only give a title instead of the approved source copy.
- **No dedicated proof slides:** Story headline/origin narrative (#1–2); Elisha desktop quotation (#8); full footer tagline/COLLECTIVE/official crown (#15–17); original Events intro and full Fresh Fade recap (#24, #26); founder-approved Get Involved supporting/intro paragraphs (#35–36); the three individual intake form destinations and opt-in consent (#40–42); email owner override (#33).
- **Need clearer full-paragraph comparisons:** pillars descriptions (#10–12); family, volunteer, partners wording (#37–39).
- **Gaps in website itself:** Elisha founder quote not rendered on the Story desktop (#8), pending Project Joy approved content/photos/donation details (#14, #28), pending named community credits (#29), unverified nonprofit/registration statements (#21), final ASC3ND Zeffy campaign destination (#20, #43), broader partner-audience copy (#39).
- The existing flipbook slide quoting Project Joy previously omitted the opening **“For example,”** from the source. Quotes should be exact, or the UI should explicitly label them **excerpts**; never advertise them as verbatim if shortened.
- For visitor review, show a simple 12-slide presentation and offer a **full 43-item appendix** accessible from the table of contents or downloadable as a report. Do not force 43 page turns.
- Require approved screenshots (or clearly labeled textual before summaries), project media consent, and real browser visual verification before labeling this a final client acceptance record.

## Open client dependencies (not missing code by themselves)
1. Founder-approved Project Joy story, dates, location, participation instructions, beneficiary/goal information.
2. Project Joy photographs/video and permissions, plus photographer credits.
3. Actual official ASC3ND Zeffy campaign link. Founder-approved temporary destination is Zeffy's homepage, clearly labeled.
4. Approved Fresh Fade / Project Joy sponsor, partner, and contributor names plus release permissions.
5. Official Washington legal record and IRS status/deductibility evidence, if stronger claims are desired.
6. Client approval of the revised website, and explicit authorization for the public `asc3nd.org` domain cutover.

## Implementation boundary
- This audit is evidence/documentation and a planned review improvement, not authorization to edit the website or change public DNS.
- All fixes stay on the existing `feat/client-feedback-flipbook-v1` branch until independently reviewed.
- Project history, database import staging, legacy event slugs and provenance remain intact.
