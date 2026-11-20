// Renders public/og.png (1200x630) and the PNG favicons with the page's own fonts.
// Run: npm run og   (needs Playwright with Chromium available)
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Uses a project or global Playwright install (NODE_PATH=$(npm root -g) for a global one).
const { chromium } = await import('playwright').catch(() => createRequire(import.meta.url)('playwright'));

const root = fileURLToPath(new URL('..', import.meta.url));
const font = (p) => readFileSync(root + 'node_modules/@fontsource/' + p).toString('base64');
const css = `
@font-face{font-family:'Instrument Serif';font-style:normal;src:url(data:font/woff2;base64,${font('instrument-serif/files/instrument-serif-latin-400-normal.woff2')}) format('woff2')}
@font-face{font-family:'Instrument Serif';font-style:italic;src:url(data:font/woff2;base64,${font('instrument-serif/files/instrument-serif-latin-400-italic.woff2')}) format('woff2')}
@font-face{font-family:'Instrument Sans';font-weight:600;src:url(data:font/woff2;base64,${font('instrument-sans/files/instrument-sans-latin-600-normal.woff2')}) format('woff2')}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#15181B;color:#F4F2EE;font-family:'Instrument Sans';position:relative;overflow:hidden}
.grid{position:absolute;inset:0;opacity:.9}
.copy{position:absolute;left:72px;top:64px;right:72px;bottom:64px;display:flex;flex-direction:column}
.mark{font-family:'Instrument Serif';font-size:40px}
.badge{display:inline-flex;align-items:center;gap:10px;border:1.5px solid #5E676C;padding:9px 14px;font-size:17px;letter-spacing:.12em;text-transform:uppercase;width:max-content;margin-top:auto;margin-bottom:28px}
.badge i{width:11px;height:11px;border-radius:50%;background:#C6F432}
h1{font-family:'Instrument Serif';font-weight:400;font-size:104px;line-height:.94;letter-spacing:-.015em}
h1 em{color:#C6F432}
.foot{margin-top:26px;font-size:20px;color:#9AA3A8;letter-spacing:.02em}
`;
// a quiet skeleton pattern in the background, right side
let dots = '';
for (let r = 0; r < 7; r++) for (let i = 0; i < 9; i++) {
  const x = 700 + i * 58 + r * 14, y = 40 + r * 84;
  dots += i % 4 === 0 ? `<rect x="${x - 6}" y="${y - 6}" width="12" height="12" fill="#C6F432" opacity=".55"/>` : `<circle cx="${x}" cy="${y}" r="4.5" fill="#9AA3A8" opacity=".35"/>`;
}
const svg = `<svg class="grid" viewBox="0 0 1200 630"><defs><linearGradient id="f" x1="0" x2="1"><stop offset=".45" stop-color="#15181B"/><stop offset="1" stop-color="#15181B" stop-opacity="0"/></linearGradient></defs>${dots}<rect width="1200" height="630" fill="url(#f)"/></svg>`;
const html = `<!doctype html><html><head><style>${css}</style></head><body>${svg}<div class="copy"><span class="mark">VinePT-Map</span><span class="badge"><i></i>IROS 2026 · Pittsburgh</span><h1>Map the Structure.<br><em>Outlast the Seasons.</em></h1><p class="foot">Pole-trunk semantic mapping · PIC4SeR · Politecnico di Torino</p></div></body></html>`;

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
