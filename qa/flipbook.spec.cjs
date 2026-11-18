const { test, expect, devices } = require('@playwright/test');
const root = process.env.ASC3ND_BASE_URL || 'http://127.0.0.1:4173';
test('desktop: cover, next, previous, contents, close, escape and return to cover', async ({ page }) => {
  await page.goto(root);
  await expect(page.locator('#cover')).toBeVisible();
  await expect(page.locator('.cover-emblem .crown')).toBeVisible();
  await expect(page.locator('#begin')).toBeVisible();
  await page.screenshot({ path: 'test-results/cover-desktop.png', fullPage: true });
  await page.locator('#begin').click();
  await expect(page.locator('#cover')).toBeHidden();
  await expect(page.locator('#count')).toHaveText('1 of 53');
  await page.locator('#next').click();
  await expect(page.locator('#count')).toHaveText('2 of 53');
  await expect(page.locator('#paper')).toHaveClass(/turn-next/);
  await page.locator('#prev').click();
  await expect(page.locator('#count')).toHaveText('1 of 53');
  await expect(page.locator('#paper')).toHaveClass(/turn-prev/);
  await page.locator('#contents').click();
  await expect(page.locator('#tocDialog')).toBeVisible();
  await page.locator('#tocClose').click();
  await expect(page.locator('#tocDialog')).toBeHidden();
  await page.locator('#contents').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#tocDialog')).toBeHidden();
  await page.locator('#contents').click();
  await page.locator('#tocList button').last().click();
  await expect(page.locator('#count')).toHaveText('53 of 53');
  await expect(page.locator('#area')).toContainText('RELEASE UPDATE');
  await expect(page.locator('#title')).toHaveText('Approved Youth Safety page copy');
  await expect(page.locator('#after')).toContainText('1-866-ENDHARM');
  await page.locator('#contents').click();
  await page.locator('#tocList button').nth(48).click();
  await expect(page.locator('#area')).toContainText('NEEDED FROM ASC3ND');
  await expect(page.locator('#count')).toHaveText('49 of 53');
  await page.locator('#contents').click();
  await page.locator('#tocList button').last().click();
  await expect(page.locator('#next')).toBeDisabled();
  await page.screenshot({ path: 'test-results/final-request-desktop.png', fullPage: true });
  await page.locator('#coverNav').click();
  await expect(page.locator('#cover')).toBeVisible();
  await expect(page.locator('a.home-site')).toHaveAttribute('href','https://asc3nd.org/');
});
test('mobile: open, navigate, close long drawer, return to cover', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(root);
  await expect(page.locator('#cover')).toBeVisible();
  await page.locator('#begin').click();
  await page.locator('#next').click();
  await expect(page.locator('#count')).toHaveText('2 of 53');
  await page.locator('#contents').click();
  await expect(page.locator('#tocClose')).toBeInViewport();
  await page.locator('#tocList').evaluate(el=>el.scrollTop=el.scrollHeight);
  await expect(page.locator('#tocClose')).toBeInViewport();
  await page.locator('#tocClose').click();
  await expect(page.locator('#tocDialog')).toBeHidden();
  await page.screenshot({ path: 'test-results/reader-mobile.png', fullPage: true });
  await page.locator('#coverNav').click();
  await expect(page.locator('#cover')).toBeVisible();
});

test('mobile polish: safe area, touch responsiveness, reduced motion and content preservation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(root);
  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
  expect(viewport).toContain('viewport-fit=cover');
  expect(viewport).not.toContain('maximum-scale=1');
  await page.locator('#begin').click();
  const duration = await page.locator('#paper').evaluate(el => {
    el.classList.add('turn-next');
    return getComputedStyle(el).animationDuration;
  });
  expect(parseFloat(duration)).toBeLessThanOrEqual(0.5);
  await expect(page.locator('#count')).toHaveText('1 of 53');
  const scroll = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  expect(scroll.page).toBeLessThanOrEqual(scroll.viewport + 1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const reduced = await page.locator('#paper').evaluate(el => getComputedStyle(el).animationName);
  expect(reduced).toBe('none');
});
test('mobile polish: coarse pointer tap targets and scroll protection', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto(root);
  await page.locator('#begin').click();
  const touches = await page.locator('#next').evaluate(el => {
    const c = getComputedStyle(el);
    return { action: c.touchAction, select: c.userSelect };
  });
  expect(touches.action).toBe('manipulation');
  expect(touches.select).toBe('none');
  await page.locator('#next').tap();
  await expect(page.locator('#count')).toHaveText('2 of 53');
  await context.close();
});

test('reviewer: no access code, autosave confirmation and reload restore', async ({page}) => {
  const cloud = new Map();
  await page.route('https://cyxdevcjycmffhmwxojh.supabase.co/functions/v1/asc3nd-editbook-review**', async route => {
    const request = route.request();
    let result = {ok:true};
    if(request.method()==='GET'){
      result = {ok:true,responses:Object.fromEntries(cloud)};
    }else if(request.method()==='PUT'){
      const data = request.postDataJSON();
      cloud.set(data.slideId,{comment:data.comment,decision:data.decision,updatedAt:new Date().toISOString(),reviewerName:data.reviewerName});
      result = {ok:true,updatedAt:new Date().toISOString(),ownerNotificationQueued:true};
    }
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(result)});
  });
  await page.goto(root);
  await page.locator('#begin').click();
  await expect(page.locator('#reviewAccess')).toHaveCount(0);
  await page.locator('#reviewerName').fill('ASC3ND QA');
  await page.locator('#comment').fill('Please adjust the footer spacing.');
  await expect(page.locator('#save-status')).toContainText('Saved to ASC3ND review inbox',{timeout:15000});
  expect(cloud.get('request-01')?.comment).toBe('Please adjust the footer spacing.');
  await page.reload();
  await page.locator('#begin').click();
  await expect(page.locator('#comment')).toHaveValue('Please adjust the footer spacing.');
  await expect(page.locator('#reviewAccess')).toHaveCount(0);
});
test('reviewer: failed cloud save must not be shown as submitted', async ({page}) => {
  await page.route('https://cyxdevcjycmffhmwxojh.supabase.co/functions/v1/asc3nd-editbook-review**',async route => {
    await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({ok:false,error:'test_unavailable'})});
  });
  await page.goto(root);
  await page.locator('#begin').click();
  await page.locator('#comment').fill('Offline QA note');
  await expect(page.locator('#save-status')).toContainText('Cloud save failed',{timeout:15000});
  await expect(page.locator('#save-status')).not.toContainText('Saved to ASC3ND review inbox');
});
