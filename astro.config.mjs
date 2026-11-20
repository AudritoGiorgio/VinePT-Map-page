import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// GitHub Pages: https://audritogiorgio.github.io/VinePT-Map-page/
// Note: the IROS poster QR code points to https://pic4ser.github.io/VinePT-Map-page/.
// To serve from there instead, set SITE_URL=https://pic4ser.github.io (base stays the same).
const SITE = process.env.SITE_URL ?? 'https://audritogiorgio.github.io';
const BASE = process.env.BASE_PATH ?? '/VinePT-Map-page';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  integrations: [tailwind({ applyBaseStyles: false })],
});
