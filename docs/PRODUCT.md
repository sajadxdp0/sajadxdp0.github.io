# Portfolio

Static portfolio at <https://sajadxdp0.github.io/>.

Built with Astro, HTML, and CSS. Astro renders each page at build time. The site has no client-side JavaScript.

## Pages

- `src/pages/index.astro` — short introduction.
- `src/pages/projects.astro` — complete project list.
- `src/pages/contact.astro` — email, GitHub, and X.
- `src/pages/freightpilot-ai.astro` — FreightPilot AI project notes.
- `src/pages/404.astro` — no-index not-found page.

`src/components/ProjectRows.astro` is the source for project descriptions and links on the Projects page. `src/layouts/BaseLayout.astro` defines shared metadata, navigation, the Cloud Drift backdrop, and the footer.

## Wallpaper

The fixed Cloud Drift scene in `public/wallpapers/` comes from [Handsher/ascii-wallpapers](https://github.com/Handsher/ascii-wallpapers) under the MIT license. The animated SVG is the default; a static WebP frame is served when reduced motion is requested. There is no client-side picker or persisted selection.

## Run locally

Requires Node.js 22.23.4 or newer.

```bash
npm ci
npm run dev
```

## Update content

Edit project data in `src/components/ProjectRows.astro`. Update page metadata in `src/pages/`. Update `public/sitemap.xml` when a published URL changes.

Keep project summaries short and specific. List only technologies that distinguish each project.

## Build and deploy

```bash
npm run build
npm run check
npm run preview
```

Astro writes the static site to `dist/`. `npm run check` validates metadata, internal links, sitemap coverage, CSS assets, and copied public files. GitHub Actions runs the check before deploying that directory to GitHub Pages when changes reach `main`.
