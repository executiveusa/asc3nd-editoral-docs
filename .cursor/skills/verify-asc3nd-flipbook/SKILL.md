---
name: verify-asc3nd-flipbook
description: Verify the ASC3ND client feedback flipbook cover, page turns, closeable slide drawer, mobile navigation and review exports in a real browser.
---
# ASC3ND Flipbook verification
Adapted from Lauren Tan's pstack `create-verification-skill`: validate the real user journey, not only compilation.

## Launch
From repository root, install browser test dependencies without committing a dependency change:
```bash
npm install --no-save @playwright/test
npx playwright install chromium
python3 -m http.server 4173 --bind 127.0.0.1
```
The local static server serves `index.html` and the original `assets/asc3nd-collective-logo.webp`. A response from `http://127.0.0.1:4173/` and a loaded logo means the public UI is ready. Server-only autosave requires its separately provisioned credentials; it is not exercised by the navigation tests.

## Doctor
```bash
curl --fail --silent http://127.0.0.1:4173/ | grep -q 'id="tocDialog"'
test -f assets/asc3nd-collective-logo.webp
```

## Drive
```bash
npx playwright test qa/flipbook.spec.cjs --reporter=line --workers=1
```
Tests use stable accessible controls and IDs. They check cover → page 1 → next/previous → drawer open/close → Escape close → page 49 → cover, plus a 390px mobile viewport and sticky close. They also inspect the CSS class used for the animated turn. Keep reduced-motion behavior independent.

## Evidence
Retain browser screenshots and Playwright trace / failures in `test-results/`. Observe actual text counters and visible state. CI uploads the report even on failure. Do not treat the CSS class assertion as proof of rendered movement; perform a live desktop/mobile visual check before claiming full visual approval.

## Cleanup
Stop only the local server process started for this run, using its recorded PID. Remove only temporary test artifacts if requested, after evidence is preserved. Never stop the user's existing web server.
