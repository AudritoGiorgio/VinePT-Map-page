// Third-party media. Every entry is credited in the footer automatically.
// Rule for this page: high resolution or vector only. Never ship low-res footage.

export type Credit = { what: string; author: string; authorUrl?: string; source: string; sourceUrl?: string; licence: string; licenceUrl?: string };

const unsplash = (id: string, w: number) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
const srcset = (id: string, widths: number[]) => widths.map((w) => `${unsplash(id, w)} ${w}w`).join(', ');

export const hero = {
  // Aerial still, shown on every screen size.
  image: {
    src: unsplash('photo-1635358085189-e5a6c83fe585', 2400),
    srcset: srcset('photo-1635358085189-e5a6c83fe585', [960, 1600, 2400, 3200]),
    alt: 'Aerial view of vineyard rows',
  },
  // Optional aerial video loop for desktop (muted, looped, paused under reduced motion).
  // Leave null until a clip is chosen; only use ≥ 1920 px wide, landscape footage, ideally self-hosted in public/media/.
  video: null as null | { src: string; type: string },
};

export const rowPhoto = {
  src: unsplash('photo-1725889276324-52de79090da0', 1600),
  srcset: srcset('photo-1725889276324-52de79090da0', [800, 1200, 1600, 2400]),
  alt: 'A row of vines stretching into the distance',
};

export const credits: Credit[] = [
  {
    what: 'Hero aerial photo',
    author: 'Linda Pomerantz Zhang',
    authorUrl: 'https://unsplash.com/@lindapz',
    source: 'Unsplash',
    sourceUrl: 'https://unsplash.com/photos/an-aerial-view-of-a-field-with-many-rows-of-trees-wp7wWobCWzI',
    licence: 'Unsplash License',
    licenceUrl: 'https://unsplash.com/license',
  },
  {
    what: 'Vine row photo',
    author: 'Jan Zinnbauer',
    authorUrl: 'https://unsplash.com/@jan_zinnbauer',
    source: 'Unsplash',
    sourceUrl: 'https://unsplash.com/photos/a-row-of-vines-in-the-middle-of-a-field-ljDw2iWg-8c',
    licence: 'Unsplash License',
    licenceUrl: 'https://unsplash.com/license',
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
