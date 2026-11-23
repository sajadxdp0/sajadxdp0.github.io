# Sajad — Portfolio

Personal portfolio at <https://sajadxdp0.github.io/>. Built with Astro and deployed to GitHub Pages as a static site.

## Pages

- `src/pages/index.astro` — introduction and selected work
- `src/pages/projects.astro` — project list at `/projects.html`
- `src/pages/contact.astro` — contact details at `/contact.html`
- `src/pages/404.astro` — not-found page

Project details are maintained once in `src/components/ProjectRows.astro` and shared by the home and projects pages.

## Run locally

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

Astro writes the static site to `dist/`. GitHub Actions builds and deploys `dist/` to GitHub Pages when changes reach `main`.
