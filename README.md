# VinePT-Map project page

Source of https://audritogiorgio.github.io/VinePT-Map-page/. The IROS 2026 poster QR code points to https://pic4ser.github.io/VinePT-Map-page/; to serve there, set `SITE_URL` in `astro.config.mjs` or the workflow.

Astro 5 (static) · Tailwind 3 · GSAP. Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

```bash
npm install
npm run dev       # http://localhost:4321/VinePT-Map-page/
npm run build     # static site in dist/
npm run og        # re-render public/og.png and PNG favicons (needs Playwright)
```

## Where things live

| What | File |
| --- | --- |
| Links, contacts, authors, "enables" tiles, months, release flag | `src/data/site.ts` |
| Field photos, silent loops, footer credits | `src/data/media.ts`, files in `public/media/field/` |
| Season-switcher map (layout + per-month canopy) | `src/lib/skeleton.ts` |
| Real campaign frames shown beside the map | `public/media/seasons/` |
| Palette and fonts (Trellis Steel, IBM Plex Sans/Mono) | `tailwind.config.mjs`, `src/styles/global.css` |

## Rules for this page

- High-resolution or vector media only. Credit every third-party asset in `src/data/media.ts`.
- Motion: subtle reveals, the season switcher and silent field loops that play only on screen; under reduced motion the loops stay on their poster.
- Fonts: IBM Plex Sans for text and headings, Plex Mono for labels. No italic or script faces.
- No numeric results for now. Technical detail goes in expanders that start closed.
- No cookies, no analytics. Fonts are self-hosted.

Before repository settings: **Settings → Pages → Source: GitHub Actions**.
