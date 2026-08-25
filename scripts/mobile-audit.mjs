import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const sizes = [
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'iphone-14', width: 390, height: 844 },
  { name: 'android', width: 412, height: 915 },
];
let failed = false;

for (const size of sizes) {
  const page = await browser.newPage({ viewport: size, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
  page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
  page.on('requestfailed', req => errors.push(`request: ${req.url()} ${req.failure()?.errorText}`));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  const metrics = await page.evaluate(() => {
    const hero = document.querySelector('.hero-copy')?.getBoundingClientRect();
    const sticky = document.querySelector('.mobile-sticky')?.getBoundingClientRect();
    const firstInput = document.querySelector('.enquiry-form-wrap input');
    return {
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      desktopNav: getComputedStyle(document.querySelector('.desktop-nav')).display,
      menuButton: getComputedStyle(document.querySelector('.menu-btn')).display,
      stickyDisplay: getComputedStyle(document.querySelector('.mobile-sticky')).display,
      stickyHeight: sticky?.height ?? 0,
      heroBottom: hero?.bottom ?? 0,
      stickyTop: sticky?.top ?? innerHeight,
      productColumns: getComputedStyle(document.querySelector('.product-grid')).gridTemplateColumns.split(' ').length,
      inputFontSize: parseFloat(getComputedStyle(firstInput).fontSize),
      brokenImages: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src),
    };
  });

  if (metrics.scrollWidth > metrics.width || metrics.bodyWidth > metrics.width) errors.push(`horizontal overflow ${metrics.scrollWidth}/${metrics.bodyWidth} > ${metrics.width}`);
  if (metrics.desktopNav !== 'none') errors.push(`desktop nav visible: ${metrics.desktopNav}`);
  if (metrics.menuButton === 'none') errors.push('menu button hidden');
  if (metrics.stickyDisplay === 'none' || metrics.stickyHeight < 44) errors.push('mobile sticky CTA missing or too small');
  if (metrics.heroBottom > metrics.stickyTop) errors.push(`hero content overlaps sticky CTA: ${metrics.heroBottom} > ${metrics.stickyTop}`);
  if (metrics.productColumns !== 1) errors.push(`catalogue is not single-column: ${metrics.productColumns}`);
  if (metrics.inputFontSize < 16) errors.push(`form font triggers iOS zoom: ${metrics.inputFontSize}px`);
  if (metrics.brokenImages.length) errors.push(`broken images: ${metrics.brokenImages.join(', ')}`);

  await page.locator('.menu-btn').click();
  await page.waitForTimeout(650);
  if (!(await page.locator('.menu-panel').isVisible())) errors.push('mobile menu did not open');
  await page.locator('.menu-head button').click();
  await page.waitForTimeout(650);

  await page.locator('#catalogue').scrollIntoViewIfNeeded();
  await page.locator('.product-image').first().click();
  await page.waitForTimeout(650);
  if (!(await page.locator('.quick-modal').isVisible())) errors.push('product quick view did not open');
  await page.locator('.modal-close').click();
  await page.waitForTimeout(650);

  await page.evaluate(() => { location.hash = '#fabrics'; });
  await page.waitForTimeout(1800);
  const fabricTop = await page.locator('#fabrics').evaluate(el => el.getBoundingClientRect().top);
  if (fabricTop < 60) errors.push(`anchor hidden under navbar: ${fabricTop}px`);

  const after = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth }));
  if (after.scrollWidth > after.width || after.bodyWidth > after.width) errors.push(`overflow after interactions ${after.scrollWidth}/${after.bodyWidth} > ${after.width}`);

  console.log(`${size.name}: ${errors.length ? `FAIL\n  ${errors.join('\n  ')}` : 'PASS'}`);
  if (errors.length) failed = true;
  await page.close();
}

await browser.close();
if (failed) process.exit(1);
