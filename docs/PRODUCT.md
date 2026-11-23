# Portfolio

Static portfolio at <https://sajadxdp0.github.io/>.

Built with Astro, HTML, and CSS. Astro renders each page at build time. The site has no client-side JavaScript.

## Pages

- `src/pages/index.astro` — short introduction.
- `src/pages/projects.astro` — complete project list.
- `src/pages/contact.astro` — email, GitHub, and X.
- `src/pages/404.astro` — no-index not-found page.

`src/components/ProjectRows.astro` is the source for project descriptions and links on the Projects page. `src/layouts/BaseLayout.astro` defines shared metadata, navigation, and the footer.

## Run locally

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
npm run preview
```

Astro writes the static site to `dist/`. GitHub Actions deploys that directory to GitHub Pages when changes reach `main`.
