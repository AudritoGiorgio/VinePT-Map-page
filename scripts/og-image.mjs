// Renders public/og.png (1200x630) and the PNG favicons with the page's own fonts.
// Run: npm run og   (needs Playwright with Chromium available)
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Uses a project or global Playwright install (NODE_PATH=$(npm root -g) for a global one).
const { chromium } = await import('playwright').catch(() => createRequire(import.meta.url)('playwright'));

const root = fileURLToPath(new URL('..', import.meta.url));
const font = (p) => readFileSync(root + 'node_modules/@fontsource/' + p).toString('base64');
const img = (p) => 'data:image/webp;base64,' + readFileSync(root + 'public/' + p).toString('base64');
// Field Notes layout, like the hero: copy on chalk paper, the trellis pole photo on the right.
const css = `
@font-face{font-family:'Plex';font-weight:400;src:url(data:font/woff2;base64,${font('ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2')}) format('woff2')}
@font-face{font-family:'Plex';font-weight:600;src:url(data:font/woff2;base64,${font('ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2')}) format('woff2')}
@font-face{font-family:'Plex Mono';font-weight:500;src:url(data:font/woff2;base64,${font('ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2')}) format('woff2')}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#F4F2EE;color:#15181B;font-family:'Plex';position:relative;overflow:hidden;display:grid;grid-template-columns:640px 1fr}
.copy{padding:56px 0 56px 64px;display:flex;flex-direction:column}
.mark{font-size:28px;font-weight:600;letter-spacing:-.01em;display:flex;align-items:center;gap:12px}
.badge{font-family:'Plex Mono';display:inline-flex;align-items:center;gap:10px;border:1.5px solid #9AA3A8;border-radius:999px;padding:8px 16px;font-size:16px;letter-spacing:.06em;text-transform:uppercase;width:max-content;margin-top:auto;margin-bottom:26px}
.badge i{width:9px;height:9px;border-radius:50%;background:#C6F432;box-shadow:0 0 0 4px rgba(198,244,50,.35)}
h1{font-weight:600;font-size:76px;line-height:1;letter-spacing:-.035em}
h1 span{color:#5E676C}
.foot{font-family:'Plex Mono';margin-top:24px;font-size:15px;color:#5E676C;letter-spacing:.04em;text-transform:uppercase}
.photo{margin:24px 24px 24px 0;border-radius:4px;background:url(${img('media/field/pole-1200.webp')}) 18% 50%/cover}
`;
const svg = '';
const html = `<!doctype html><html><head><style>${css}</style></head><body><div class="copy"><span class="mark"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#15181B" stroke-width="2" stroke-linecap="round"><path d="M4 21V6M12 21V4M20 21V6"/><path d="M4 10l8-2 8 2" stroke="#8DB21A"/></svg>VinePT-Map</span><span class="badge"><i></i>IROS 2026 · Pittsburgh</span><h1>Map the Structure.<br><span>Outlast the Seasons.</span></h1><p class="foot">PIC4SeR · Politecnico di Torino</p></div><div class="photo"></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html); await page.evaluate(() => document.fonts.ready);
writeFileSync(root + 'public/og.png', await page.screenshot({ type: 'png' }));
const fav = readFileSync(root + 'public/favicon.svg', 'utf8');
for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<style>*{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${fav}`);
  writeFileSync(root + 'public/' + name, await page.screenshot({ type: 'png', omitBackground: true }));
}
await browser.close();
console.log('wrote public/og.png, favicon-32.png, apple-touch-icon.png');
