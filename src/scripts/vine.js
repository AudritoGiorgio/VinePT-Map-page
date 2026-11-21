// @ts-nocheck
// VineScene v3: a vector view down the inter-row that morphs from February to November.
// Shoots grow from the cordon and carry the leaves; grapes hang in the fruit zone among them.
// Four drawing styles share the same geometry: flat, ink, cut, botanical. Poles and trunks never move.
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const lerp = (a, b, t) => a + (b - a) * t, clamp = (v) => Math.max(0, Math.min(1, v)), f1 = (n) => n.toFixed(1);
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * clamp(t)).toString(16).padStart(2, '0')).join(''); };
  const ease = (t) => t * t * (3 - 2 * t);
  const INK = '#23282C';

  // The year. Each value morphs into the next month.
  const base = { mud: 0, grass: .9, gh: .4, flowers: 0, seeds: 0, shoot: 1, lig: 0, canes: 0, leaves: 1, lsz: 1, turn: 0, fallen: 0, gsz: 0, flower: 0, ripe: 0, harvest: 0, shrivel: 0, rachis: 0, sun: .6, clouds: .4, grey: 0, wind: .3, birds: 0, drift: 0 };
  const K = [
    { key: 'feb', sun: .12, clouds: .95, grey: .75, wind: .5, name: 'February', short: 'Feb', note: 'Mud, wheel ruts, bare canes', tint: '#5E676C', sky0: '#E9ECEC', sky1: '#D5DAD9', hill: '#BCC3C6', soil0: '#8F7A5E', soil1: '#76604A', path: '#9A8468', mud: 1, grass: .05, gh: .12, gcol: '#9A9668', shoot: 0, lig: 1, canes: 1, leaves: 0, lsz: .3, pal: ['#B7D274', '#A4C45E'], fallen: .12 },
    { key: 'mar', sun: .7, clouds: .5, grey: .15, wind: .7, birds: .3, name: 'March', short: 'Mar', note: 'Pruned, first grass, buds break', tint: '#6E8F2A', sky0: '#F4F7F7', sky1: '#D6E5EE', hill: '#C2CFD8', soil0: '#97835F', soil1: '#836D4D', path: '#A69170', mud: .55, grass: .45, gh: .32, gcol: '#8DB04E', shoot: .1, canes: .22, leaves: 1, lsz: .34, pal: ['#C4E07A', '#AACC5C'], fallen: .04 },
    { key: 'may', sun: 1, clouds: .3, wind: .4, birds: 1, name: 'May', short: 'May', note: 'Tall grass in flower, shoots, flower clusters', tint: '#4E8A2C', sky0: '#FFFFFF', sky1: '#DCEBF2', hill: '#C3D2DC', soil0: '#A9BE7A', soil1: '#8EA85C', path: '#C3BC97', grass: 1, gh: 1, gcol: '#6C9A36', flowers: 1, seeds: 1, shoot: .55, lsz: .7, pal: ['#8CBB4A', '#7AAE3E', '#9CC85A', '#6EA03A', '#5F9233'], gsz: .4, flower: 1 },
    { key: 'jul', sun: 1, clouds: .12, wind: .2, birds: .6, name: 'July', short: 'Jul', note: 'Full canopy, small green grapes', tint: '#3C7A2B', sky0: '#FFFFFF', sky1: '#E6EDE0', hill: '#C6D2DA', soil0: '#C8D6A6', soil1: '#ADC283', path: '#D8D3B5', grass: .95, gh: .62, gcol: '#6E9A3E', flowers: .3, seeds: .7, shoot: 1, lsz: .94, pal: ['#5E8A38', '#6F9A42', '#517E30', '#82A452', '#46702A'], gsz: .66 },
    { key: 'aug', sun: .95, clouds: .2, wind: .25, birds: .4, name: 'August', short: 'Aug', note: 'Mown grass, grapes swell and start to colour', tint: '#2F6B2A', sky0: '#FFFFFF', sky1: '#EEE5CF', hill: '#C9D2DB', soil0: '#D5DCBE', soil1: '#BFCB9E', path: '#E4DEC9', grass: .95, gh: .4, gcol: '#7FA14A', lig: .25, pal: ['#557A35', '#6A8C40', '#4A6E2E', '#7E9C4E', '#3E5F27'], gsz: .92, ripe: .3 },
    { key: 'sep', sun: .7, clouds: .45, grey: .1, wind: .4, birds: .2, name: 'September', short: 'Sep', note: 'Dry grass, ripe grapes', tint: '#6B4A7E', sky0: '#FBF7EF', sky1: '#EADFC8', hill: '#CFCFC9', soil0: '#D6D3B3', soil1: '#C0BB8F', path: '#E3DAC1', grass: .85, gh: .36, gcol: '#A4A25C', lig: .55, leaves: .96, pal: ['#62813A', '#76964A', '#5A7630', '#86984A', '#4F6F30'], turn: .14, fallen: .04, gsz: 1, ripe: 1 },
    { key: 'oct', sun: .45, clouds: .6, grey: .3, wind: .95, drift: 1, birds: .6, name: 'October', short: 'Oct', note: 'Harvest done, bare stalks, leaves turn', tint: '#C0612B', sky0: '#FBF5EA', sky1: '#EBD7B8', hill: '#D2C6B0', soil0: '#C9C7A0', soil1: '#B1AE80', path: '#DED2B6', grass: .9, gh: .3, gcol: '#8EA44E', lig: .8, leaves: .78, pal: ['#7E8E3C', '#8A9440', '#6F8434', '#93963F', '#667A30'], turn: .85, fallen: .5, gsz: 1, ripe: 1, harvest: 1, rachis: 1 },
    { key: 'nov', sun: .1, clouds: 1, grey: .9, wind: .75, drift: .35, name: 'November', short: 'Nov', note: 'Leaf litter, a few raisins, bare canes', tint: '#8A4A2A', sky0: '#EEEFEE', sky1: '#D8D6CE', hill: '#C3C4C0', soil0: '#A3967A', soil1: '#8B7D60', path: '#ADA084', mud: .35, grass: .6, gh: .2, gcol: '#87985A', lig: 1, leaves: .12, lsz: .95, pal: ['#8A7A3C', '#80703A'], turn: 1, fallen: 1, gsz: .8, ripe: 1, harvest: 1, shrivel: 1, rachis: .35 },
  ].map((m) => Object.assign({}, base, m));
  const AUT = ['#E2B53B', '#D98A2B', '#C9572D', '#A9392B', '#B98C33', '#8F3A2A'];

  // Drawing styles: same geometry, different hand.
  const STYLES = {
    flat: { name: 'Flat colour', leaf: 'vine', leafStroke: null, veins: 'dark', fold: false, wash: 0, trunk: 'flat', pole: 'wood', grass: 'blades', berryStroke: 'rgba(0,0,0,.18)', hl: true },
    ink: { name: 'Ink and wash', leaf: 'vine', leafStroke: INK, veins: 'ink', fold: false, wash: .42, trunk: 'ink', pole: 'ink', grass: 'strokes', berryStroke: INK, hl: false },
    cut: { name: 'Paper cut', leaf: 'round', leafStroke: null, veins: 'none', fold: true, wash: 0, trunk: 'solid', pole: 'solid', grass: 'tufts', berryStroke: null, hl: false },
    botanical: { name: 'Botanical', leaf: 'vine', leafStroke: null, veins: 'light', fold: true, wash: 0, trunk: 'bark', pole: 'grain', grass: 'mixed', berryStroke: 'rgba(0,0,0,.22)', hl: true },
  };

  // Leaf outline: five lobes; 'vine' has a toothed edge and deeper sinuses, 'round' is smooth and simple.
  function leafPts(kind) {
    const N = 150, pts = [], lobe = (a, c, w, h) => h * Math.exp(-(((a - c) / w) ** 2));
    for (let i = 0; i <= N; i++) {
      const a = -Math.PI + (2 * Math.PI * i) / N;
      let r = kind === 'round'
        ? .66 + lobe(a, 0, .55, .3) + lobe(a, 1.15, .5, .2) + lobe(a, -1.15, .5, .2) + lobe(a, 2.2, .45, .08) + lobe(a, -2.2, .45, .08)
        : .6 + lobe(a, 0, .42, .34) + lobe(a, 1.1, .4, .28) + lobe(a, -1.1, .4, .28) + lobe(a, 2.15, .36, .16) + lobe(a, -2.15, .36, .16);
      const d = Math.PI - Math.abs(a); r *= Math.min(1, .2 + (d / .5) * .8);
      if (kind !== 'round') { const s = (i * 56 / N) % 1; r *= 1 + .06 * (s < .72 ? s / .72 : (1 - s) / .28) - .03; }
      pts.push([r * Math.sin(a), -r * Math.cos(a) + .12, a]);
    }
    return pts;
  }
  const ptsD = (pts) => 'M' + pts.map(([x, y]) => x.toFixed(3) + ',' + y.toFixed(3)).join(' L') + 'Z';

  function makeLeaf(el, defs, id, S) {
    const g = el('g', { id }, defs), pts = leafPts(S.leaf);
    const blade = el('path', { d: ptsD(pts) }, g);
    if (S.leafStroke) { blade.setAttribute('stroke', S.leafStroke); blade.setAttribute('stroke-width', .9); blade.setAttribute('vector-effect', 'non-scaling-stroke'); blade.setAttribute('stroke-linejoin', 'round'); }
    if (S.fold) el('path', { d: ptsD(pts.filter((p) => p[2] >= 0).concat([[0, .12]])), fill: '#000', 'fill-opacity': S.leaf === 'round' ? .16 : .12 }, g);
    if (S.veins !== 'none') {
      const v = S.veins, vein = el('g', { fill: 'none', 'stroke-linecap': 'round', stroke: v === 'light' ? '#EEF5D2' : v === 'ink' ? INK : '#1E2A12', 'stroke-opacity': v === 'light' ? .5 : v === 'ink' ? .75 : .32, 'stroke-width': v === 'ink' ? .6 : .045 }, g);
      if (v === 'ink') vein.setAttribute('vector-effect', 'non-scaling-stroke');
      [0, 1.08, -1.08, 2.1, -2.1].forEach((a, i) => { const L = [.86, .7, .7, .45, .45][i]; const p = el('path', { d: `M0,.12 Q${(L * .5 * Math.sin(a)).toFixed(3)} ${(.12 - L * .5 * Math.cos(a)).toFixed(3)} ${(L * Math.sin(a)).toFixed(3)},${(.12 - L * Math.cos(a)).toFixed(3)}` }, vein); if (v === 'ink') p.setAttribute('vector-effect', 'non-scaling-stroke'); });
    }
    el('path', { d: 'M0,.12 q.04,.28 .14,.46', stroke: S.leafStroke || '#5B6A2E', 'stroke-width': .07, fill: 'none', 'stroke-linecap': 'round' }, g);
  }

  // Trunk: a gnarled, tapering stem with a head at the cordon and two short arms along the wire.
  function drawTrunk(el, g, rnd, S, { x, gy, cy, h, span, bandC }) {
    const tw = Math.max(1.2, h * .022), wob = h * .02, steps = 8, L = [], R = [], ph = rnd() * 6;
    for (let s = 0; s <= steps; s++) {
      const u = s / steps, y = lerp(gy, cy, u), cx = x + Math.sin(ph + u * 4.2) * wob * (1 - u * .3);
      const w = tw * (1.3 - .45 * u + .25 * Math.sin(ph * 2 + u * 9) * (1 - u));
      L.push([cx - w / 2, y]); R.push([cx + w / 2, y]);
    }
    const d = 'M' + L.map((p) => f1(p[0]) + ',' + f1(p[1])).join(' L') + ' L' + R.slice().reverse().map((p) => f1(p[0]) + ',' + f1(p[1])).join(' L') + 'Z';
    const T = S.trunk, fill = { flat: '#5A4535', ink: '#DCCBB2', solid: '#3A2D24', bark: '#5E4837' }[T];
    const stroke = T === 'ink' ? { stroke: INK, 'stroke-width': f1(Math.max(.7, tw * .1)), 'stroke-linejoin': 'round' } : {};
    const hx = R[steps][0] - tw * .4;
    [-1, 1].forEach((dd) => { const ax = x + dd * Math.abs(span) * .4, ay = bandC(ax); el('path', { d: `M${f1(hx)},${f1(cy)} Q${f1(lerp(hx, ax, .5))},${f1(cy - tw * .9)} ${f1(ax)},${f1(ay)}`, stroke: T === 'ink' ? INK : T === 'solid' ? fill : '#54402F', 'stroke-width': f1(T === 'ink' ? Math.max(.7, tw * .2) : tw * .55), fill: 'none', 'stroke-linecap': 'round' }, g); });
    el('path', Object.assign({ d, fill }, stroke), g);
    if (h > 60 && T !== 'solid') {
      if (T === 'flat' || T === 'bark') el('path', { d: 'M' + R.map((p) => f1(p[0] - tw * .28) + ',' + f1(p[1])).join(' L'), stroke: '#3A2C21', 'stroke-width': f1(tw * .4), fill: 'none', 'stroke-linecap': 'round' }, g);
      if (T === 'bark') el('path', { d: 'M' + L.map((p) => f1(p[0] + tw * .18) + ',' + f1(p[1])).join(' L'), stroke: '#8E745A', 'stroke-width': f1(tw * .16), fill: 'none', 'stroke-linecap': 'round' }, g);
      const n = T === 'bark' ? 9 : T === 'ink' ? 7 : 3;
      for (let s = 0; s < n; s++) {
        const u = .08 + (s / n) * .82 + rnd() * .05, y0 = lerp(gy, cy, u), xm = lerp(L[Math.round(u * steps)][0], R[Math.round(u * steps)][0], .5);
        if (T === 'ink') el('path', { d: `M${f1(xm + tw * .05)},${f1(y0)} l${f1(tw * .35)},${f1(-tw * .45)}`, stroke: INK, 'stroke-width': f1(Math.max(.5, tw * .07)), fill: 'none', 'stroke-linecap': 'round' }, g);
        else el('path', { d: `M${f1(xm - tw * .15 + (rnd() - .5) * tw * .3)},${f1(y0)} q${f1(tw * .12)},${f1(-h * .04)} ${f1(tw * .04)},${f1(-h * (.06 + rnd() * .05))}`, stroke: T === 'bark' ? '#2F241B' : '#7B6450', 'stroke-width': f1(Math.max(.5, tw * (T === 'bark' ? .09 : .12))), fill: 'none', 'stroke-linecap': 'round' }, g);
      }
    }
    el('ellipse', Object.assign({ cx: f1(hx), cy: f1(cy), rx: f1(tw * .95), ry: f1(tw * .7), fill: T === 'ink' ? fill : T === 'solid' ? fill : '#4D3A2C' }, stroke), g);
    if (T === 'bark' && h > 120) [[.3, .3], [.62, -.2]].forEach(([u, o]) => el('ellipse', { cx: f1(x + o * tw), cy: f1(lerp(gy, cy, u)), rx: f1(tw * .16), ry: f1(tw * .22), fill: '#2F241B' }, g));
  }

  // Pole: wooden post with a cut top and wire clips.
  function drawPole(el, g, rnd, S, { px, top, bot, h, side, wires }) {
    const pw = Math.max(1.6, h * .03), P = S.pole, H = bot - top;
    if (P === 'ink') {
      el('rect', { x: f1(px - pw / 2), y: f1(top), width: f1(pw), height: f1(H), fill: '#F2EEE6', stroke: INK, 'stroke-width': f1(Math.max(.7, pw * .08)) }, g);
      if (h > 80) { el('line', { x1: f1(px + pw * .18), y1: f1(top + pw * .3), x2: f1(px + pw * .18), y2: f1(bot), stroke: INK, 'stroke-width': f1(Math.max(.5, pw * .05)) }, g); wires.forEach((y) => el('line', { x1: f1(px - pw * .7), y1: f1(y), x2: f1(px + pw * .7), y2: f1(y), stroke: INK, 'stroke-width': f1(Math.max(.6, pw * .1)) }, g)); }
      return;
    }
    if (P === 'solid') { el('rect', { x: f1(px - pw / 2), y: f1(top), width: f1(pw), height: f1(H), fill: '#2C2A28', rx: f1(pw * .1) }, g); return; }
    el('rect', { x: f1(px - pw / 2), y: f1(top), width: f1(pw), height: f1(H), fill: P === 'grain' ? '#83705A' : '#7A6852' }, g);
    el('rect', { x: f1(px + pw * (side < 0 ? .1 : -.5)), y: f1(top), width: f1(pw * .4), height: f1(H), fill: '#55473A' }, g);
    if (h > 80) {
      el('ellipse', { cx: f1(px), cy: f1(top), rx: f1(pw / 2), ry: f1(pw * .18), fill: '#B49E7E' }, g);
      const n = P === 'grain' ? 9 : 4;
      for (let s = 0; s < n; s++) { const y0 = lerp(top, bot, .06 + (s / n) * .86 + rnd() * .04), xo = (rnd() - .5) * pw * .5; el('line', { x1: f1(px + xo), y1: f1(y0), x2: f1(px + xo), y2: f1(y0 + h * (.05 + rnd() * .07)), stroke: P === 'grain' ? '#5E4E3E' : '#968368', 'stroke-width': f1(Math.max(.5, pw * .07)) }, g); }
      if (P === 'grain') el('ellipse', { cx: f1(px - pw * .1), cy: f1(lerp(top, bot, .42)), rx: f1(pw * .14), ry: f1(pw * .22), fill: '#4A3C2F' }, g);
      wires.forEach((y) => el('rect', { x: f1(px - pw * .6), y: f1(y - pw * .1), width: f1(pw * 1.2), height: f1(pw * .22), fill: '#9AA3A8' }, g));
    }
  }

  // Grass: clumps in four hands. Returns a path string for the current height.
  function grassD(S, tf, hh, sw = 0) {
    let d = '';
    const G = S.grass;
    tf.blades.forEach((b, i) => {
      if (G === 'tufts' && i > 2) return;
      const bx = tf.x + b.dx, h = hh * b.h * (G === 'tufts' ? .75 : 1), tip = bx + (b.lean + sw * (.7 + b.h * .5)) * h * .45, w = b.w * (G === 'tufts' ? 2.3 : 1);
      if (G === 'strokes') d += `M${f1(bx)},${f1(tf.y)} Q${f1(bx + (tip - bx) * .25)},${f1(tf.y - h * .6)} ${f1(tip)},${f1(tf.y - h)}`;
      else if (G === 'tufts') d += `M${f1(bx - w / 2)},${f1(tf.y)} C${f1(bx - w * .6)},${f1(tf.y - h * .7)} ${f1(tip - w * .3)},${f1(tf.y - h)} ${f1(tip)},${f1(tf.y - h)} C${f1(tip + w * .3)},${f1(tf.y - h)} ${f1(bx + w * .6)},${f1(tf.y - h * .7)} ${f1(bx + w / 2)},${f1(tf.y)}Z`;
      else d += `M${f1(bx - w / 2)},${f1(tf.y)} Q${f1(bx - w * .2 + (tip - bx) * .3)},${f1(tf.y - h * .55)} ${f1(tip)},${f1(tf.y - h)} Q${f1(bx + w * .2 + (tip - bx) * .3)},${f1(tf.y - h * .55)} ${f1(bx + w / 2)},${f1(tf.y)}Z`;
    });
    return d;
  }
  function seedD(tf, hh, sw = 0) {
    const b = tf.blades[0], bx = tf.x + b.dx * .5, h = hh * 1.35, tip = bx + (b.lean + sw * 1.3) * h * .3, w = Math.max(.6, b.w * .25), r = Math.max(1, b.w * .55);
    return `M${f1(bx - w)},${f1(tf.y)} Q${f1(bx)},${f1(tf.y - h * .6)} ${f1(tip)},${f1(tf.y - h)} Q${f1(bx + w)},${f1(tf.y - h * .6)} ${f1(bx + w)},${f1(tf.y)}Z M${f1(tip)},${f1(tf.y - h - r * 3.2)} q${f1(r)},${f1(r * 1.6)} 0,${f1(r * 3.2)} q${f1(-r)},${f1(-r * 1.6)} 0,${f1(-r * 3.2)}Z`;
  }

  // Grape cluster: tapering rows of berries, sometimes a shoulder; a stalk skeleton stays after harvest.
  function buildCluster(el, parent, rnd, S, detail) {
    const g = el('g', {}, parent), rach = el('g', { stroke: '#7A6A3A', 'stroke-width': 1.1, fill: 'none', 'stroke-linecap': 'round', opacity: 0 }, g);
    const groups = [0, 1, 2, 3].map(() => el('g', S.berryStroke ? { stroke: S.berryStroke, 'stroke-width': S.berryStroke === INK ? .9 : 1 } : {}, g));
    const R = detail ? 7 + Math.floor(rnd() * 4) : 4, W0 = detail ? 3.5 + rnd() * 2 : 2.5, berries = [];
    let rd = 'M0,-14 L0,' + f1((R - 1) * 9.5);
    for (let i = 0; i < R; i++) {
      const n = Math.max(1, Math.round(W0 * Math.pow(1 - i / R, .75) + rnd() * .8)), y = i * 9.5;
      rd += ` M0,${f1(y)} L${f1(-(n - 1) * 5.5)},${f1(y + 3)} M0,${f1(y)} L${f1((n - 1) * 5.5)},${f1(y + 3)}`;
      for (let j = 0; j < n; j++) berries.push([(j - (n - 1) / 2) * 11 + (rnd() - .5) * 3.5, y + (rnd() - .5) * 3]);
    }
    if (detail && rnd() < .45) { const sd = rnd() < .5 ? -1 : 1, ox = sd * (W0 * 6 + 8); rd += ` M0,2 L${f1(ox)},6`; for (let i = 0; i < 3; i++) for (let j = 0; j < 3 - i; j++) berries.push([ox + (j - (2 - i) / 2) * 10, 4 + i * 9]); }
    el('path', { d: rd }, rach);
    berries.forEach(([x, y]) => el('circle', { cx: f1(x), cy: f1(y), r: 6.4 }, groups[Math.floor(rnd() * 4)]));
    if (detail && S.hl) { const hl = el('g', { fill: '#FFFFFF', opacity: .32 }, g); berries.forEach(([x, y], i) => { if (i % 2 === 0) el('circle', { cx: f1(x - 2.2), cy: f1(y - 2.2), r: 1.8 }, hl); }); }
    el('path', { d: 'M0,-14 L0,-4', stroke: '#6B5A3A', 'stroke-width': 2.4 }, g);
    return { g, groups, rach };
  }
  function berryColours(st, S, keep) {
    const green = mix('#A2BC58', '#D5D88A', st.flower);
    return [0, 1, 2, 3].map((q) => {
      const r = clamp((st.ripe - q * .18) * 2.2);
      let c = r < .5 ? mix(green, '#8C5370', r * 2) : mix('#8C5370', '#3D3B5C', r * 2 - 1);
      if (keep) c = mix(c, '#3A2430', st.shrivel);
      return S.wash ? mix(c, '#F7F4EC', S.wash * .6) : c;
    });
  }
  function setCluster(c, st, S, sc, keep, k) {
    const gone = keep ? 0 : st.harvest, size = sc * st.gsz * k * (keep ? 1 - .22 * st.shrivel : 1);
    const cols = berryColours(st, S, keep);
    c.groups.forEach((g, q) => { g.setAttribute('fill', cols[q]); g.setAttribute('opacity', f1(1 - gone)); });
    c.rach.setAttribute('opacity', f1(keep ? 0 : st.rachis * gone * .6));
    c.g.setAttribute('transform', `scale(${Math.max(.001, keep ? size : sc * k * lerp(st.gsz, 1, gone)).toFixed(3)})`);
  }

  function VineScene(svg, opts = {}) {
    const S = STYLES[opts.style] || STYLES.flat;
    let seed = opts.seed || 21; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const el = (n, a, p = svg) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
    const tone = (c) => (S.wash ? mix(c, '#F7F4EC', S.wash) : c);
    const VX = 800, VY = 455, W = 1600, H = 900;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const uid = 'v' + Math.round(Math.random() * 1e6);
    const defs = el('defs', {});
    const lg = (id, y1, y2) => { const g = el('linearGradient', { id: uid + id, x1: 0, y1, x2: 0, y2, gradientUnits: 'userSpaceOnUse' }, defs); return [el('stop', { offset: 0 }, g), el('stop', { offset: 1 }, g)]; };
    const skyS = lg('sky', 0, VY), soilS = lg('soil', VY, H);
    makeLeaf(el, defs, uid + 'lf', S);
    const LF = '#' + uid + 'lf';
    // far leaves: no outline or veins, so the distance stays light
    makeLeaf(el, defs, uid + 'lff', Object.assign({}, S, { leafStroke: null, veins: 'none' }));
    const LFF = '#' + uid + 'lff';

    el('rect', { width: W, height: VY, fill: `url(#${uid}sky)` });
    // sun: warm disc, soft halo, slow-turning rays
    const sunG = el('g', { transform: 'translate(1060 150)' });
    el('circle', { r: 92, fill: '#FBE7A1', opacity: .35 }, sunG);
    const rays = el('g', { stroke: '#EBC24E', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: .7 }, sunG);
    for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, r0 = 58, r1 = i % 2 ? 74 : 84; el('line', { x1: f1(Math.cos(a) * r0), y1: f1(Math.sin(a) * r0), x2: f1(Math.cos(a) * r1), y2: f1(Math.sin(a) * r1) }, rays); }
    el('circle', { r: 46, fill: '#F6D35C' }, sunG);
    el('circle', { r: 46, fill: 'none', stroke: '#E2B73E', 'stroke-width': 2 }, sunG);
    el('path', { d: 'M-30,-14 A34,34 0 0 1 -6,-36', stroke: '#FFF4C8', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', opacity: .8 }, sunG);
    // clouds: lobed puffs with a shaded underside and a fine highlight, drifting with the wind
    const cloudsG = el('g', {}), clouds = [];
    for (let i = 0; i < 9; i++) {
      const g = el('g', {}, cloudsG), sc = .55 + rnd() * .75, lobes = [];
      const n = 4 + Math.floor(rnd() * 3);
      for (let j = 0; j < n; j++) lobes.push([(j - (n - 1) / 2) * 38 + (rnd() - .5) * 12, -(18 + rnd() * 26) * (1 - Math.abs(j - (n - 1) / 2) / n), 26 + rnd() * 18]);
      // the same puff twice: a darker copy just below gives the shaded underside
      const shade = el('g', { transform: 'translate(3 9)' }, g), body = el('g', {}, g);
      [shade, body].forEach((p) => { lobes.forEach(([x, y, r]) => el('circle', { cx: f1(x), cy: f1(y), r: f1(r) }, p)); el('rect', { x: f1(lobes[0][0] - 22), y: -8, width: f1(lobes[n - 1][0] - lobes[0][0] + 44), height: 22, rx: 11 }, p); });
      el('path', { d: lobes.map(([x, y, r]) => `M${f1(x - r * .7)},${f1(y - r * .45)} A${f1(r)},${f1(r)} 0 0 1 ${f1(x + r * .5)},${f1(y - r * .85)}`).join(' '), fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: .7 }, g);
      clouds.push({ g, body, shade, sc, x0: rnd() * (W + 500), y: 60 + rnd() * 260 * (i % 3 ? 1 : .6), sp: 6 + rnd() * 10, th: i / 9 });
    }
    const hill = el('path', { d: `M0,${VY} L0,428 C90,410 170,420 260,424 S420,404 520,426 S700,420 ${VX},${VY - 6} S960,416 1090,412 S1300,430 1380,410 S1540,424 1600,416 L1600,${VY}Z`, opacity: .85 });
    const hill2 = el('path', { d: `M0,${VY} L0,440 C160,432 300,444 460,438 S700,446 ${VX},${VY - 2} S1100,436 1260,442 S1500,434 1600,438 L1600,${VY}Z`, opacity: .55 });
    el('rect', { y: VY, width: W, height: H - VY, fill: `url(#${uid}soil)` });
    const path = el('polygon', { points: `330,${H} 1270,${H} ${VX + 10},${VY} ${VX - 10},${VY}`, opacity: .85 });
    if (S.trunk === 'ink') { hill.setAttribute('stroke', INK); hill.setAttribute('stroke-opacity', .35); hill.setAttribute('stroke-width', 1); }

    const mud = el('g', {});
    [-1, 1].forEach((d) => el('polygon', { points: `${VX + d * 3},${VY} ${VX + d * 310 - 30},${H} ${VX + d * 310 + 30},${H}`, fill: '#5E4A36', opacity: .38 }, mud));
    for (let i = 0; i < 18; i++) { const y = lerp(VY + 40, H - 8, Math.pow(rnd(), .7)), k = (y - VY) / (H - VY), x = VX + (rnd() - .5) * 980 * k; el('ellipse', { cx: f1(x), cy: f1(y), rx: f1(24 + 120 * k * rnd()), ry: f1(2 + 9 * k), fill: '#5A4634', opacity: .5 }, mud); el('ellipse', { cx: f1(x - 6 * k), cy: f1(y - 2 * k), rx: f1(10 + 40 * k * rnd()), ry: f1(1 + 3 * k), fill: '#C9CFCF', opacity: .35 }, mud); }

    const fallenG = el('g', {}), fallen = [];
    for (let i = 0; i < 260; i++) {
      const y = lerp(VY + 10, H + 10, Math.pow(rnd(), .8)), k = (y - VY) / (H - VY), side = rnd() < .5 ? -1 : 1;
      const x = VX + side * (rnd() < .7 ? 300 + rnd() * 700 : rnd() * 420) * k * 1.4, s = 6 + 26 * k * (.6 + rnd() * .6);
      const rot = Math.round(rnd() * 360), u = el('use', { href: LF, fill: tone(AUT[Math.floor(rnd() * AUT.length)]) }, fallenG);
      fallen.push({ u, th: rnd(), x, y, s, rot, last: -1 });
    }

    // grass tufts; the ones beyond the trunk line sit behind the vines
    const rowX = (y) => VX * (1 - (y - VY) / (760 - VY));
    const grassBack = el('g', {}), tufts = [];
    const mkTufts = () => {
      for (let i = 0; i < 420; i++) {
        const y = lerp(VY + 4, H + 30, Math.pow(rnd(), .9)), k = (y - VY) / (H - VY), side = rnd();
        const x = side < .48 ? VX - (200 + rnd() * 760) * k * 1.55 : side < .9 ? VX + (200 + rnd() * 760) * k * 1.55 : VX + (rnd() - .5) * 380 * k;
        const n = 3 + Math.floor(rnd() * 4), blades = [];
        for (let b = 0; b < n; b++) blades.push({ dx: (rnd() - .5) * 18 * (0.3 + k), h: .55 + rnd() * .6, lean: (rnd() - .5) * 1.1, w: (2.5 + 6 * k) * (.7 + rnd() * .6) });
        const xr = rowX(y), behind = x < xr || x > W - xr;
        tufts.push({ x, y, k, blades, H: (26 + 64 * rnd()) * (0.18 + 1.5 * k), u: rnd(), v: rnd(), verge: side < .9, behind, seed: rnd() < .3 && k > .15 });
      }
    };
    mkTufts();

    const rows = [{ side: -1, top: 40, cord: 600, gr: 760, q: .86, n: 30 }, { side: 1, top: 40, cord: 600, gr: 760, q: .86, n: 30 }];
    const edge = (r) => (r.side < 0 ? 0 : W);
    const band = (r, x) => { const f = r.side < 0 ? x / VX : (W - x) / (W - VX); return { t: lerp(r.top, VY, f), c: lerp(r.cord, VY, f), g: lerp(r.gr, VY, f) }; };
    const xs = (r, k) => (r.side < 0 ? VX * (1 - Math.pow(r.q, k)) : VX + (W - VX) * Math.pow(r.q, k));
    const wiresG = el('g', { stroke: S.trunk === 'ink' ? INK : '#3A3F44', 'stroke-opacity': S.trunk === 'ink' ? .55 : .35 });
    const canopyBack = el('g', {});
    const canesG = el('g', { fill: 'none', 'stroke-linecap': 'round', stroke: S.trunk === 'ink' ? '#6E6252' : '#7A5A40' });
    const shootG = el('g', { fill: 'none', 'stroke-linecap': 'round' });
    const trunkG = el('g', {}), leafBackG = el('g', {}), grapeG = el('g', {}), leafFrontG = el('g', {}), poleG = el('g', {});
    const grassFront = el('g', {}), flowerG = el('g', {}), ringG = el('g', {});
    const leaves = [], clusters = [], backs = [], shoots = [];
    tufts.forEach((tf) => {
      tf.p = el('path', S.grass === 'strokes' ? { fill: 'none', 'stroke-linecap': 'round', 'stroke-width': f1(.8 + 1.6 * tf.k) } : {}, tf.behind ? grassBack : grassFront);
      if (S.grass === 'mixed' && tf.seed) tf.sp = el('path', { fill: '#B7A66A' }, tf.behind ? grassBack : grassFront);
    });
    // put grass behind the vines before the trunks
    svg.insertBefore(grassBack, wiresG);
    const flowers = [];
    tufts.forEach((t, i) => { if (t.verge && t.k > .25 && i % 4 === 0) { const c = el('circle', { r: f1(2 + 5 * t.k), fill: i % 8 ? '#FFFFFF' : '#F2D34A', stroke: S.leafStroke ? INK : '#C9B54A', 'stroke-width': f1(.6 + t.k * .8) }, flowerG); flowers.push({ c, t }); } });

    const bez = (p0, p1, p2, u) => [(1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0], (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]];
    rows.forEach((r) => {
      const e = edge(r), b0 = band(r, e), wireP = [0.1, 0.38, 0.64];
      wireP.forEach((p) => el('line', { x1: e, y1: f1(lerp(b0.t, b0.c, p) + 40), x2: VX, y2: VY, 'stroke-width': 1.3 }, wiresG));
      el('line', { x1: e, y1: f1(b0.c), x2: VX, y2: VY, 'stroke-width': 2.2 }, wiresG);
      backs.push(el('polygon', { points: `${e},${f1(b0.t + 60)} ${VX},${VY} ${e},${f1(b0.c + 20)}` }, canopyBack));
      for (let k = r.n - 1; k >= 0; k--) {
        const x = xs(r, k), b = band(r, x), h = b.g - b.t, span = xs(r, k + 1) - x;
        drawTrunk(el, el('g', {}, trunkG), rnd, S, { x, gy: b.g, cy: b.c, h, span, bandC: (ax) => band(r, ax).c });
        if (k % 6 === 0) { const px = x + span * .02; drawPole(el, el('g', {}, poleG), rnd, S, { px, top: b.t - h * .05, bot: b.g + h * .012, h, side: r.side, wires: wireP.map((p) => lerp(b.t, b.c, p) + h * .05) }); }
        if (k < 7) { const ring = el('ellipse', { cx: f1(x), cy: f1(b.g), rx: f1(h * .075), ry: f1(h * .024), fill: 'none', stroke: '#C6F432', 'stroke-width': f1(Math.max(2, h * .009)), class: 'ring' }, ringG); el('ellipse', { cx: f1(x), cy: f1(b.g), rx: f1(h * .03), ry: f1(h * .01), fill: '#C6F432', stroke: '#15181B', 'stroke-width': f1(Math.max(1, h * .003)) }, ringG); ring.style.animationDelay = (k * .3 + (r.side > 0 ? .15 : 0)) + 's'; }
        // shoots rise from the arms; the same lines are next winter's canes
        const ns = 4, detail = h > 210;
        for (let c = 0; c < ns; c++) {
          const sx = x + span * (.1 + c * .25 + (rnd() - .5) * .08), sb = band(r, sx), ch = sb.g - sb.t;
          const top = (sb.c - sb.t) * (.85 + rnd() * .25), lean = (rnd() - .5) * ch * .16;
          const p0 = [sx, sb.c], p1 = [sx + lean * .25, sb.c - top * .55], p2 = [sx + lean, sb.c - top];
          const d = `M${f1(p0[0])},${f1(p0[1])} Q${f1(p1[0])},${f1(p1[1])} ${f1(p2[0])},${f1(p2[1])}`, sw = f1(Math.max(.6, ch * .007));
          el('path', { d, 'stroke-width': sw }, canesG);
          const sp = el('path', { d, 'stroke-width': sw, pathLength: 1, 'stroke-dasharray': '0 1' }, shootG);
          shoots.push(sp);
          // leaves along the shoot, alternating sides; lower ones open first
          const nl = Math.max(2, Math.round((22 * Math.min(1, h / 500) + 5) / ns * 1.15));
          for (let i = 0; i < nl; i++) {
            const u = .06 + (i / nl) * .94 + (rnd() - .5) * .06, [lx0, ly0] = bez(p0, p1, p2, clamp(u));
            const off = (i % 2 ? 1 : -1) * Math.abs(span) * (.05 + rnd() * .14), s = ch * (.05 + rnd() * .035);
            const front = u < .4 && rnd() < .5;
            const uEl = el('use', { href: s > 9 ? LF : LFF }, front ? leafFrontG : leafBackG);
            leaves.push({ u: uEl, x: lx0 + off, y: ly0 + (rnd() - .5) * ch * .04, s, at: clamp(u), rot: Math.round((i % 2 ? 1 : -1) * (20 + rnd() * 50) + (rnd() < .2 ? 180 : 0)), sx: rnd() < .5 ? -1 : 1, ci: Math.floor(rnd() * 5), ac: Math.floor(rnd() * AUT.length), th: rnd(), w: rnd(), dark: rnd() * .18 });
          }
          // flower clusters / grapes in the fruit zone just above the cordon on this shoot, hanging
          const ncl = rnd() < .42 ? 0 : rnd() < .85 ? 1 : 2;
          for (let q = 0; q < ncl; q++) {
            const u = .04 + rnd() * .14, [gx, gy] = bez(p0, p1, p2, u), sc = ch * (.00115 + rnd() * .0007);
            const wrap = el('g', { transform: `translate(${f1(gx + (rnd() - .5) * Math.abs(span) * .12)} ${f1(gy + ch * (.01 + rnd() * .06))}) rotate(${f1((rnd() - .5) * 26)})` }, grapeG);
            clusters.push({ c: buildCluster(el, wrap, rnd, S, detail), sc, keep: rnd() < .12, th: rnd() });
          }
        }
      }
    });
    svg.appendChild(grassFront); svg.appendChild(flowerG);
    // blowing leaves and birds in the air
    const airG = el('g', {}), drifters = [];
    for (let i = 0; i < 16; i++) drifters.push({ u: el('use', { href: LF, fill: tone(AUT[i % AUT.length]) }, airG), y0: 120 + rnd() * 520, s: 10 + rnd() * 16, sp: 120 + rnd() * 140, ph: rnd() * 10, th: rnd() });
    const birdG = el('g', { fill: 'none', stroke: '#3A3F44', 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }), birds = [];
    for (let i = 0; i < 5; i++) birds.push({ p: el('path', {}, birdG), x0: rnd() * W, y: 110 + rnd() * 150, s: 7 + rnd() * 6, sp: 40 + rnd() * 30, ph: rnd() * 6, th: i / 5 });
    // a calm sky: no sun, clouds or birds unless asked for
    if (!opts.sky) { sunG.remove(); cloudsG.remove(); birdG.remove(); clouds.length = 0; birds.length = 0; }
    svg.appendChild(ringG);

    const labG = el('g', { class: 'labs' });
    const lw = (text) => text.length * 11.5 + 22;
    const lab = (x, y, text) => { const g = el('g', {}, labG); el('rect', { x, y, width: lw(text), height: 34, rx: 4, fill: '#15181B' }, g); el('text', { x: x + 11, y: y + 23, fill: '#C6F432', 'font-family': 'IBM Plex Mono, monospace', 'font-size': 18, 'font-weight': 500, 'letter-spacing': 1 }, g).textContent = text; };
    if (opts.labels !== false) {
      const rl = rows[1], pX = xs(rl, 6), pB = band(rl, pX), tX = xs(rl, 2), tB = band(rl, tX), ty = lerp(tB.c, tB.g, .5);
      el('line', { x1: pX, y1: pB.t + 40, x2: pX - 40, y2: pB.t + 40, stroke: '#15181B', 'stroke-width': 2 }, labG); lab(pX - 40 - lw('POLE · FIXED'), pB.t + 23, 'POLE · FIXED');
      el('line', { x1: tX, y1: ty, x2: tX - 40, y2: ty, stroke: '#15181B', 'stroke-width': 2 }, labG); lab(tX - 40 - lw('TRUNK · FIXED'), ty - 17, 'TRUNK · FIXED');
    }

    const pal = (s, i) => s.pal[i % s.pal.length];
    let info = null, lastCk = '';
    function render(m, now = 0) {
      const n = K.length, i = Math.floor(m) % n, j = (i + 1) % n, f = m - Math.floor(m), t = ease(f);
      const time = now / 1000;
      const A = K[i], B = K[j], L = (k) => lerp(A[k], B[k], t), C = (k) => mix(A[k], B[k], t);
      skyS[0].setAttribute('stop-color', C('sky0')); skyS[1].setAttribute('stop-color', C('sky1'));
      soilS[0].setAttribute('stop-color', tone(C('soil0'))); soilS[1].setAttribute('stop-color', tone(C('soil1')));
      hill.setAttribute('fill', C('hill')); hill2.setAttribute('fill', mix(C('hill'), C('soil0'), .5)); path.setAttribute('fill', tone(C('path')));
      mud.setAttribute('opacity', f1(L('mud') * (S.wash ? .6 : 1)));
      const fl = L('fallen'); fallen.forEach((l) => { const k = Math.round(clamp((fl - l.th) * 8) * 50) / 50; if (k === l.last) return; l.last = k; if (k < .02) { l.u.setAttribute('display', 'none'); return; } l.u.removeAttribute('display'); l.u.setAttribute('transform', `translate(${f1(l.x)} ${f1(l.y)}) rotate(${l.rot}) scale(${f1(l.s * k)} ${f1(l.s * k * .5)})`); });
      // weather
      const wind = L('wind') * (.7 + .3 * Math.sin(time * .8)), sun = L('sun'), cl = L('clouds'), grey = L('grey');
      if (opts.sky) { sunG.setAttribute('opacity', f1(sun)); rays.setAttribute('transform', `rotate(${f1(time * 6)})`); }
      const cfill = mix('#FFFFFF', '#C9CDCF', grey), cshade = mix('#DCE3E8', '#A3A9AD', grey);
      clouds.forEach((c) => {
        const a = clamp((cl - c.th) * 4);
        if (a < .02) { c.g.setAttribute('display', 'none'); return; }
        c.g.removeAttribute('display');
        const x = ((c.x0 + time * c.sp * (.5 + wind)) % (W + 500)) - 250;
        c.g.setAttribute('transform', `translate(${f1(x)} ${f1(c.y)}) scale(${(c.sc * (.85 + .15 * a)).toFixed(3)})`);
        c.g.setAttribute('opacity', f1(a * .95));
        c.body.setAttribute('fill', cfill); c.shade.setAttribute('fill', cshade);
      });
      const dr = L('drift');
      drifters.forEach((d) => {
        const a = clamp((dr - d.th) * 4);
        if (a < .02) { d.u.setAttribute('display', 'none'); return; }
        d.u.removeAttribute('display');
        const x = W + 100 - ((time * d.sp * (.6 + wind) + d.ph * 160) % (W + 200)), y = d.y0 + Math.sin(time * 1.3 + d.ph) * 40 + (W - x) * .12;
        d.u.setAttribute('transform', `translate(${f1(x)} ${f1(y)}) rotate(${f1(time * 90 + d.ph * 40)}) scale(${f1(d.s * a)} ${f1(d.s * a * Math.cos(time * 3 + d.ph))})`);
      });
      const bd = L('birds');
      birds.forEach((b) => {
        const a = clamp((bd - b.th) * 4);
        if (a < .02) { b.p.setAttribute('d', ''); return; }
        const x = ((b.x0 + time * b.sp) % (W + 200)) - 100, y = b.y + Math.sin(time * .9 + b.ph) * 12, fl = Math.sin(time * 9 + b.ph) * b.s * .7, s = b.s * a;
        b.p.setAttribute('d', `M${f1(x - s * 1.6)},${f1(y - fl)} Q${f1(x - s * .7)},${f1(y - s * .6 - fl * .3)} ${f1(x)},${f1(y)} Q${f1(x + s * .7)},${f1(y - s * .6 - fl * .3)} ${f1(x + s * 1.6)},${f1(y - fl)}`);
      });
      const gust = (x, y, sp) => wind * (Math.sin(time * sp + x * .012 + y * .004) * .7 + Math.sin(time * sp * 2.3 + x * .03) * .3);
      const grass = L('grass'), gh = L('gh'), gcol = C('gcol'), seeds = L('seeds'), colKey = i * 1000 + Math.round(t * 300);
      tufts.forEach((tf) => {
        const k = clamp((grass - tf.u * .85) * 3), hh = tf.H * gh * k;
        if (hh < .8) { if (tf.lk !== 0) { tf.lk = 0; tf.p.setAttribute('d', ''); if (tf.sp) tf.sp.setAttribute('d', ''); } return; }
        // only near tufts sway; skip the update when nothing visible changed
        const sw = tf.k > .3 ? Math.round(gust(tf.x, tf.y, 2.2) * 40) / 50 : 0; tf.sw = sw;
        const key = Math.round(hh * 2) * 1000 + Math.round(sw * 50) + Math.round(seeds * 20) * 1e7;
        if (key !== tf.lk) { tf.lk = key; tf.p.setAttribute('d', grassD(S, tf, hh, sw)); if (tf.sp) tf.sp.setAttribute('d', seeds > .05 ? seedD(tf, hh * (.4 + .6 * seeds), sw) : ''); }
        if (colKey !== tf.ck) { tf.ck = colKey; const col = tone(mix(gcol, tf.v < .5 ? '#3F6A22' : '#C9D98A', Math.abs(tf.v - .5) * .5)); if (S.grass === 'strokes') tf.p.setAttribute('stroke', mix(col, INK, .35)); else tf.p.setAttribute('fill', col); }
      });
      const fw = L('flowers'); flowerG.setAttribute('opacity', f1(fw));
      if (fw > .01) flowers.forEach(({ c, t: tf }) => { const k = clamp((grass - tf.u * .85) * 3); c.setAttribute('cx', f1(tf.x + tf.blades[0].dx + (tf.sw || 0) * tf.H * gh * k * .5)); c.setAttribute('cy', f1(tf.y - tf.H * gh * k * 1.05)); });
      canesG.setAttribute('opacity', f1(L('canes')));
      const shoot = L('shoot'), lig = L('lig'), scol = S.trunk === 'ink' ? mix('#6F8A4A', '#6E6252', lig) : mix('#7FA040', '#7A5A40', lig);
      shootG.setAttribute('stroke', scol);
      shoots.forEach((p) => p.setAttribute('stroke-dasharray', `${shoot.toFixed(3)} 1`));
      const dens = L('leaves'), size = L('lsz'), turn = L('turn');
      backs.forEach((p) => { p.setAttribute('fill', tone(mix(mix(pal(A, 4), pal(B, 4), t), '#9B6A2E', turn * .7))); p.setAttribute('opacity', f1(clamp((dens * shoot - .7) * 3))); });
      let shown = 0;
      leaves.forEach((l) => {
        const k = clamp((shoot - l.at) * 5) * clamp((dens - l.th) * 6);
        if (k < .02) { if (l.vis !== 0) { l.vis = 0; l.u.setAttribute('display', 'none'); } return; }
        if (k > .2) shown++;
        if (l.vis !== 1) { l.vis = 1; l.u.removeAttribute('display'); }
        const s = l.s * k * size;
        // small, distant leaves stay still; near ones move in the wind
        const g = l.s > 14 ? Math.round(gust(l.x, l.y, 2.6) * 30) / 30 : 0, key = Math.round(s * 20) * 100 + Math.round(g * 30);
        if (key !== l.lk) { l.lk = key; l.u.setAttribute('transform', `translate(${f1(l.x + g * l.s * .25)} ${f1(l.y + (1 - k) * l.s * .5)}) rotate(${f1(l.rot + g * 14)}) scale(${(s * l.sx).toFixed(2)} ${s.toFixed(2)})`); }
        if (colKey === l.ck) return; l.ck = colKey;
        let col = mix(mix(pal(A, l.ci), pal(B, l.ci), t), '#1F3312', l.dark);
        if (turn > 0) col = mix(col, AUT[l.ac], clamp((turn - l.w * .5) * 2.2));
        l.u.setAttribute('fill', tone(col));
      });
      const st = { gsz: L('gsz'), flower: L('flower'), ripe: L('ripe'), harvest: L('harvest'), shrivel: L('shrivel'), rachis: L('rachis') };
      const ck = Object.values(st).map((v) => v.toFixed(3)).join();
      if (ck !== lastCk) { lastCk = ck; clusters.forEach((c) => setCluster(c.c, st, S, c.sc, c.keep, clamp((st.gsz - c.th * .3) * 3) || (st.harvest > .5 && !c.keep ? 1 : 0))); }
      const cur = t < .5 ? A : B, idx = t < .5 ? i : j;
      info = { i, j, t, f, idx, name: cur.name, month: cur, tint: mix(A.tint, B.tint, t), leaves: shown };
      return info;
    }
    return { render, K, svg };
  }

  // Specimen sheet: each asset drawn large in one style.
  function Specimens(svg, style) {
    const S = STYLES[style] || STYLES.flat;
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const el = (n, a, p = svg) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
    const tone = (c) => (S.wash ? mix(c, '#F7F4EC', S.wash) : c);
    svg.setAttribute('viewBox', '0 0 1200 300');
    const uid = 'sp' + Math.round(Math.random() * 1e6), defs = el('defs', {});
    makeLeaf(el, defs, uid + 'lf', S);
    el('line', { x1: 0, y1: 262, x2: 1200, y2: 262, stroke: '#D9D5CC', 'stroke-width': 2 });
    // grass: short, tall in flower
    [[60, .35], [140, 1]].forEach(([x, hgt], i) => {
      const tf = { x, y: 262, k: 1, blades: [-12, -5, 2, 8, 14, 20].map((dx, b) => ({ dx, h: .7 + ((b * 37) % 5) / 10, lean: ((b % 3) - 1) * .5, w: 9 })) };
      const p = el('path', S.grass === 'strokes' ? { fill: 'none', stroke: mix(tone('#6C9A36'), INK, .35), 'stroke-width': 2.4, 'stroke-linecap': 'round' } : { fill: tone(i ? '#6C9A36' : '#8DB04E') });
      p.setAttribute('d', grassD(S, tf, 200 * hgt));
      if (i && S.grass === 'mixed') el('path', { d: seedD(tf, 200 * hgt * .9), fill: '#B7A66A' });
      if (i) [[-20, -150], [16, -175]].forEach(([dx, dy]) => el('circle', { cx: x + dx, cy: 262 + dy, r: 7, fill: '#FFFFFF', stroke: S.leafStroke ? INK : '#C9B54A', 'stroke-width': 1.4 }));
    });
    // trunk and pole
    drawTrunk(el, el('g', {}), rnd, S, { x: 270, gy: 262, cy: 110, h: 560, span: 120, bandC: () => 110 });
    drawPole(el, el('g', {}), rnd, S, { px: 375, top: 24, bot: 262, h: 520, side: 1, wires: [70, 140] });
    // leaves: young, summer, autumn
    [[470, 120, 26, '#9CC85A', -12], [560, 120, 46, '#557A35', 8], [670, 120, 46, '#C9572D', -6]].forEach(([x, y, s, c, r]) => el('use', { href: '#' + uid + 'lf', fill: tone(c), transform: `translate(${x} ${y}) rotate(${r}) scale(${s})` }));
    // grapes: flowers, small green, veraison, ripe, harvested, raisins
    const st0 = { gsz: 1, flower: 0, ripe: 0, harvest: 0, shrivel: 0, rachis: 0 };
    [[775, { flower: 1, gsz: .5 }], [852, { gsz: .72 }], [935, { ripe: .35 }], [1020, { ripe: 1 }], [1095, { ripe: 1, harvest: 1, rachis: 1 }], [1160, { ripe: 1, harvest: 1, shrivel: 1 }]].forEach(([x, o], i) => {
      seed = 11 + i * 3; const w = el('g', { transform: `translate(${x} 80)` });
      const c = buildCluster(el, w, rnd, S, true);
      setCluster(c, Object.assign({}, st0, o), S, .82, i === 5, 1);
    });
    const lab = (x, t) => { const e = el('text', { x, y: 290, 'text-anchor': 'middle', 'font-family': 'IBM Plex Mono, monospace', 'font-size': 12, fill: '#5E676C', 'letter-spacing': 1 }); e.textContent = t; };
    [[100, 'GRASS'], [270, 'TRUNK'], [370, 'POLE'], [565, 'LEAVES'], [960, 'GRAPES · FLOWER → RIPE → HARVESTED']].forEach(([x, t]) => lab(x, t));
  }

  // Shared player: auto-advances while visible, holds most of each month, tap a month to jump.
  function play(scene, { onFrame, monthMs = 3000, root = scene.svg, still = 4.3 } = {}) {
    const n = scene.K.length, hm = /^#m=([\d.]+)/.exec(location.hash), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || location.hash === '#still' || !!hm;
    if (hm) still = +hm[1];
    let offset = 0, start = performance.now(), pos = 0, on = false, raf = 0;
    const draw = (m, now = performance.now()) => { pos = m; onFrame && onFrame(scene.render(m, now), m); };
    const loop = (now) => { draw((offset + Math.max(0, now - start) / monthMs) % n, now); if (on) raf = requestAnimationFrame(loop); };
    const api = { jump(k) { offset = k; start = performance.now(); if (reduce || !on) draw(k + .3); }, at: (m) => draw(m) };
    if (reduce) { draw(still); return api; }
    draw(0);
    new IntersectionObserver(([e]) => { if (e.isIntersecting && !on) { on = true; offset = pos; start = performance.now(); raf = requestAnimationFrame(loop); } else if (!e.isIntersecting) { on = false; cancelAnimationFrame(raf); } }).observe(root);
    return api;
  }

  // Wires the Almanac page: [data-scene] svg, [data-list] with [data-k] items, [data-month]; --season on root.
  function mount(root, opts = {}) {
    const q = (s) => root.querySelector(s);
    const scene = VineScene(q('[data-scene]'), opts);
    const list = q('[data-list]');
    if (list && !list.children.length) list.innerHTML = K.map((m, k) => `<li data-k="${k}" tabindex="0"><span class="m tag">${m.short}</span><span class="d">${m.note}</span><span class="prog"></span></li>`).join('');
    const items = list ? [...list.querySelectorAll('[data-k]')] : [];
    let api;
    items.forEach((it) => { it.addEventListener('click', () => api.jump(+it.dataset.k)); it.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); api.jump(+it.dataset.k); } }); });
    const mo = q('[data-month]'), sp = q('[data-specimens]');
    if (sp) Specimens(sp, opts.style);
    api = play(scene, { root, monthMs: opts.monthMs || 3000, onFrame(info) {
      items.forEach((it) => { const k = +it.dataset.k, on = k === info.idx; if (it.classList.contains('on') !== on) { it.classList.toggle('on', on); if (on && list && list.scrollWidth > list.clientWidth + 2) list.scrollTo({ left: Math.max(0, it.offsetLeft - list.offsetLeft - 24), behavior: 'smooth' }); } const p = it.querySelector('.prog'); if (p) p.style.width = (k === info.i ? info.f * 100 : k < info.i ? 100 : 0) + '%'; });
      root.style.setProperty('--season', info.tint);
      if (mo && mo.textContent !== info.name) mo.textContent = info.name;
    } });
    return api;
  }

  window.Vine = { Scene: VineScene, play, mount, Specimens, K, STYLES };
})();
