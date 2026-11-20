// Top-down vector map for the season switcher.
// The skeleton (poles + trunks) is drawn once and never moves; each month only adds its own canopy layer.
// Layout: 3 rows, a pole every 6 trunks, mild along-row drift like a real georeferenced survey.
// To plot real campaign data, replace `layout()` with points projected from your UTM CSV.

import { months } from '../data/site';

type Pt = { a: number; c: number; kind: 'pole' | 'trunk' };

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const ROWS = 3;
const POLE_SPANS = 5;
const TRUNKS_PER_SPAN = 5;

function layout(): Pt[][] {
  const r = rng(11);
  const rows: Pt[][] = [];
  for (let ri = 0; ri < ROWS; ri++) {
    const row: Pt[] = [];
    const n = POLE_SPANS * (TRUNKS_PER_SPAN + 1);
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const jitterA = (r() - 0.5) * 0.006;
      const jitterC = (r() - 0.5) * 0.05 + Math.sin(t * 2.4 + ri) * 0.04;
      row.push({ a: t + jitterA, c: ri + jitterC, kind: i % (TRUNKS_PER_SPAN + 1) === 0 ? 'pole' : 'trunk' });
    }
    rows.push(row);
  }
  return rows;
}

const ROW_DATA = layout();

type Frame = { W: number; H: number; a0: number; a1: number; c: number[]; vertical: boolean; s: number };

const H_FRAME: Frame = { W: 880, H: 330, a0: 50, a1: 830, c: [80, 165, 250], vertical: false, s: 1 };
const V_FRAME: Frame = { W: 300, H: 520, a0: 34, a1: 486, c: [70, 150, 230], vertical: true, s: 0.62 };

function P(f: Frame, a: number, c: number) {
  return f.vertical ? { x: c, y: a } : { x: a, y: c };
}
function proj(f: Frame, p: { a: number; c: number }) {
  const a = f.a0 + (f.a1 - f.a0) * p.a;
  const row = Math.floor(p.c + 0.5);
  const c = f.c[row] + (p.c - row) * 60 * f.s;
  return P(f, a, c);
}
const n = (v: number) => Math.round(v * 10) / 10;

function canopyLayer(f: Frame, key: string, m: { canopy: number; buds: number; grapes: number }) {
  const r = rng(key.charCodeAt(0) * 31 + key.charCodeAt(2));
  const out: string[] = [];
  ROW_DATA.forEach((row, ri) => {
    const c = f.c[ri];
    const span = f.a1 - f.a0;
    if (!m.canopy) {
      for (let t = 0; t < 60; t++) {
        const a = f.a0 + span * r();
        const off = (r() - 0.5) * 22 * f.s;
        const p1 = P(f, a, c);
        const p2 = P(f, a + (r() - 0.5) * 30 * f.s, c + off);
        out.push(`<line x1="${n(p1.x)}" y1="${n(p1.y)}" x2="${n(p2.x)}" y2="${n(p2.y)}" stroke="#7A6650" stroke-width="1.2" opacity=".75"/>`);
      }
    }
    if (m.buds) {
      for (let b = 0; b < 70; b++) {
        const p = P(f, f.a0 + span * r(), c + (r() - 0.5) * 22 * f.s);
        out.push(`<circle cx="${n(p.x)}" cy="${n(p.y)}" r="${n(2 * f.s + 0.4)}" fill="#9DB86A"/>`);
      }
    }
    if (m.canopy) {
      const k = f.vertical ? 34 : 80;
      for (let i = 0; i < k; i++) {
        const p = P(f, f.a0 + (span * i) / (k - 1) + (r() - 0.5) * 8, c + (r() - 0.5) * 16 * f.s);
        const rad = (16 + r() * 9) * f.s;
        out.push(`<circle cx="${n(p.x)}" cy="${n(p.y)}" r="${n(rad)}" fill="${i % 2 ? '#5E7543' : '#4A5E36'}" opacity=".85"/>`);
      }
    }
    if (m.grapes) {
      const k = f.vertical ? 20 : 46;
      for (let g = 0; g < k; g++) {
        const p = P(f, f.a0 + span * r(), c + (r() > 0.5 ? 1 : -1) * 14 * f.s);
        out.push(`<circle cx="${n(p.x)}" cy="${n(p.y)}" r="${n(4 * f.s + 0.6)}" fill="#6E4E7C"/>`);
      }
    }
  });
  return out.join('');
}

export function seasonMapSvg(vertical: boolean, label: string) {
  const f = vertical ? V_FRAME : H_FRAME;
  const parts: string[] = [];
  // ground grid
  for (let i = 0; i <= 6; i++) {
    const a = f.a0 + ((f.a1 - f.a0) * i) / 6;
    const p1 = P(f, a, 8);
    const p2 = P(f, a, (vertical ? f.W : f.H) - 8);
    parts.push(`<line x1="${n(p1.x)}" y1="${n(p1.y)}" x2="${n(p2.x)}" y2="${n(p2.y)}" stroke="#2A2F34" stroke-width="1"/>`);
  }
  // trellis wires
  ROW_DATA.forEach((row) => {
    const d = row.map((p, i) => { const q = proj(f, p); return `${i ? 'L' : 'M'}${n(q.x)} ${n(q.y)}`; }).join(' ');
    parts.push(`<path d="${d}" fill="none" stroke="#3A4045" stroke-width="1"/>`);
  });
  // seasonal layers: one per month, toggled by opacity
  months.forEach((m, i) => {
    parts.push(`<g class="season-layer" data-month="${m.key}" style="opacity:${i === 0 ? 1 : 0}">${canopyLayer(f, m.key, m)}</g>`);
  });
  // the skeleton: identical every month
  const sk: string[] = [];
  ROW_DATA.forEach((row) => row.forEach((p) => {
    const q = proj(f, p);
    if (p.kind === 'pole') {
      const s = 10 * f.s + 1;
      sk.push(`<rect x="${n(q.x - s / 2)}" y="${n(q.y - s / 2)}" width="${n(s)}" height="${n(s)}" fill="#C6F432"/>`);
    } else {
      sk.push(`<circle cx="${n(q.x)}" cy="${n(q.y)}" r="${n(3.8 * f.s + 0.6)}" fill="#F4F2EE" stroke="#15181B" stroke-width="1"/>`);
    }
  }));
  parts.push(`<g class="skeleton">${sk.join('')}</g>`);
  return `<svg viewBox="0 0 ${f.W} ${f.H}" role="img" aria-label="${label}" class="block h-auto w-full">${parts.join('')}</svg>`;
}
