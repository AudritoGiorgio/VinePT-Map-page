// All page copy that changes over time lives here. Edit a value and rebuild.

export const links = {
  repo: 'https://github.com/PIC4SeR/VinePT-Map',
  // Code and dataset share the repository until the release. Change `dataset` if it gets its own host.
  code: 'https://github.com/PIC4SeR/VinePT-Map',
  dataset: 'https://github.com/PIC4SeR/VinePT-Map',
  ieee: 'https://ieeexplore.ieee.org/document/11776151',
  arxiv: 'https://arxiv.org/abs/2603.05070',
  pdf: 'https://arxiv.org/pdf/2603.05070',
  pic4ser: 'https://pic4ser.polito.it/',
  polito: 'https://www.polito.it/',
};

// Set to false once code and dataset are public: the "Release coming" pills disappear.
export const releaseComing = true;

export const contacts = [
  {
    who: 'Project reference',
    name: 'Giorgio Audrito',
    email: 'giorgio_audrito@polito.it',
    subject: 'VinePT-Map',
  },
  {
    who: 'Research centre',
    name: 'PIC4SeR · PoliTO',
    email: 'pic4ser@polito.it',
    subject: 'VinePT-Map',
  },
];

export const conference = {
  short: 'IROS 2026',
  city: 'Pittsburgh',
  full: 'IEEE/RSJ International Conference on Intelligent Robots and Systems',
};

export const paper = {
  title: 'VinePT-Map: Pole-Trunk Semantic Mapping for Resilient Autonomous Robotics in Vineyards',
  key: 'audrito2026vineptmap',
  booktitle: '2026 IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)',
  year: 2026,
  publisher: 'IEEE',
  location: 'Pittsburgh, PA, USA',
  url: 'https://ieeexplore.ieee.org/document/11776151',
  // Fill in from IEEE Xplore's "Cite This" panel; every citation format picks them up.
  pages: '' as string,
  doi: '' as string,
};

// Authors in paper order. Portraits: drop a square image in public/team/<id>.jpg and set `photo`.
export const authors = [
  { id: 'ga', given: 'Giorgio', family: 'Audrito', note: 'First author · project reference', affil: 'DET · PoliTO' },
  { id: 'mm', given: 'Mauro', family: 'Martini', affil: 'DET · PIC4SeR · PoliTO' },
  { id: 'an', given: 'Alessandro', family: 'Navone', affil: 'DET · PIC4SeR · PoliTO' },
  { id: 'gg', given: 'Giorgia', family: 'Galluzzo', affil: 'DET · PoliTO' },
  { id: 'mc', given: 'Marcello', family: 'Chiaberge', affil: 'DET · PIC4SeR · PoliTO' },
] as { id: string; given: string; family: string; note?: string; affil: string; photo?: string }[];

export const enables = [
  { scope: 'Row scale', title: 'Navigation', text: 'Enables robots to localize against known poles and drive the rows in any season.' },
  { scope: 'Row scale', title: 'Precision spraying', text: 'Enables sprayers to dose by position along the row instead of by time.' },
  { scope: 'Plant scale', title: 'Per-plant monitoring', text: 'Enables a stable ID for every trunk, so health records follow the plant year after year.' },
  { scope: 'Plant scale', title: 'Pruning robots', text: 'Enables pruning arms to approach each vine knowing where its trunk stands.' },
  { scope: 'Plant scale', title: 'Harvest robots', text: 'Enables harvesters to plan around the trellis under a full, grape-heavy canopy.' },
  { scope: 'Vineyard scale', title: 'Infrastructure inventory', text: 'Enables a count and location of every pole and plant, ready for maintenance and replanting.' },
];

export const months = [
  { key: 'feb', label: 'Feb', name: 'February', cap: 'bare wood, cloudy', canopy: 0, buds: 0, grapes: 0 },
  { key: 'mar', label: 'Mar', name: 'March', cap: 'bare wood, first buds, sunny', canopy: 0, buds: 1, grapes: 0 },
  { key: 'aug', label: 'Aug', name: 'August', cap: 'full canopy, sunny', canopy: 1, buds: 0, grapes: 0 },
  { key: 'sep', label: 'Sep', name: 'September', cap: 'canopy and grapes, cloudy', canopy: 1, buds: 0, grapes: 1 },
] as const;
export type MonthKey = (typeof months)[number]['key'];

export const nav = [
  ['Idea', '#idea'],
  ['How it works', '#how-it-works'],
  ['Proof', '#proof'],
  ['Open source', '#open-source'],
  ['Paper', '#paper'],
] as const;
