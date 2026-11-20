import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// GitHub Pages: https://pic4ser.github.io/VinePT-Map-page/
// Keep this URL stable: the IROS poster QR code points to it.
const SITE = process.env.SITE_URL ?? 'https://pic4ser.github.io';
const BASE = process.env.BASE_PATH ?? '/VinePT-Map-page';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  integrations: [tailwind({ applyBaseStyles: false })],
});
