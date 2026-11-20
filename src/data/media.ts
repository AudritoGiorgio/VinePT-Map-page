// Media for the page. Every entry in `credits` is listed in the footer automatically.
// Rule for this page: high resolution or vector only. Never ship low-res footage.
// Field photos and loops live in public/media/field/ (stills at 1200 / 2400 px, loops at 1080p, silent).

export type Credit = { what: string; author: string; authorUrl?: string; source: string; sourceUrl?: string; licence: string; licenceUrl?: string };

export type Still = { name: string; widths: [number, number]; alt: string };
export type Loop = { name: string; alt: string };

const dir = 'media/field/';
/** `src` and `srcset` for a still, given the site base URL. */
export const still = (base: string, s: Still) => ({
  src: `${base}${dir}${s.name}-${s.widths[1]}.webp`,
  srcset: s.widths.map((w) => `${base}${dir}${s.name}-${w}.webp ${w}w`).join(', '),
  alt: s.alt,
});
/** `src` and `poster` for a silent loop, given the site base URL. */
export const loop = (base: string, l: Loop) => ({ src: `${base}${dir}${l.name}.mp4`, poster: `${base}${dir}${l.name}-poster.webp`, alt: l.alt });

export const photos = {
  pole: { name: 'pole', widths: [1200, 2400], alt: 'Close-up of a wooden trellis pole at the head of a vineyard row' },
  mast: { name: 'mast', widths: [800, 1600], alt: "RTK-GPS antennas and sensors on the rover's mast, inside the row" },
  row: { name: 'row', widths: [1200, 2400], alt: 'The rover far down a vineyard row, between two identical walls of vines' },
  gnss: { name: 'gnss', widths: [800, 1200], alt: 'GNSS antenna and sensor box on the rover mast' },
  rover: { name: 'rover', widths: [800, 1600], alt: 'The rover between two rows of vines' },
  skeleton: { name: 'skeleton', widths: [1200, 2400], alt: 'Looking straight down a vineyard row, toned grey' },
} satisfies Record<string, Still>;

export const loops = {
  drive: { name: 'row-drive', alt: 'The rover drives away down a vineyard row' },
  low: { name: 'row-low', alt: 'Low tracking shot of the rover in tall grass between the vines' },
  trellis: { name: 'trellis-pan', alt: 'Slow pan along a line of wooden trellis posts' },
} satisfies Record<string, Loop>;

export const credits: Credit[] = [
  {
    what: 'Field photos and video',
    author: 'VinePT-Map authors',
    source: 'Field campaigns',
    licence: 'CC BY 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  {
    what: 'Field campaign frames',
    author: 'VinePT-Map authors',
    source: 'Field campaigns, Feb to Sep',
    licence: 'CC BY 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  {
    what: 'Diagrams and maps',
    author: 'VinePT-Map authors',
    source: 'Vector, this site',
    licence: 'CC BY 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
];
