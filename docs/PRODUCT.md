# Portfolio Site

> Maintainer guide for the static portfolio at sajadxdp0.github.io.
> Stack: Astro, HTML, CSS, and JavaScript. No client framework.

## Site structure

- `src/pages/index.astro` — About page and selected projects.
- `src/pages/projects.astro` — project list, published at `/projects.html`.
- `src/pages/contact.astro` — email, GitHub, and LinkedIn, published at `/contact.html`.
- `src/pages/404.astro` — no-index not-found page.
- `src/layouts/BaseLayout.astro` — shared metadata, navigation, and footer.
- `src/components/ProjectRows.astro` — the single source for project descriptions and links.
- `src/styles/portfolio.css` and `script.js` — global styles and browser
  enhancements; `public/` — the favicon, social image, font files,
  sitemap, and robots.txt.

The site uses a pure-black background, grayscale text, fine separators, and
quiet static light fields. JetBrains Mono Nerd Font is self-hosted. Project
rows use a flat two-column layout on wide screens and stack on small screens.
Reduced-motion, forced-colors, and print styles are included.

## Run locally

```bash
npm ci
npm run dev
```

## Update content

Edit project descriptions, tags, and links in
`src/components/ProjectRows.astro`. The home page shows four selected
projects; the Projects page shows the full list. Update page metadata in
`src/pages/` and `public/sitemap.xml` when published content changes.

Keep summaries concise and specific. Use tags for distinctive technologies,
not generic stack lists.

## Build and deploy

```bash
npm run build
npm run preview
```

Astro writes the static site to `dist/`. The GitHub Actions workflow builds
and deploys that directory when changes reach `main`. Set the repository's
Pages source to GitHub Actions.
