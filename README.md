# Sajad — Portfolio

Personal portfolio at <https://sajadxdp0.github.io/>. Built with Astro and deployed to GitHub Pages.

## Site

- `src/pages/index.astro` — short introduction
- `src/pages/projects.astro` — project list at `/projects.html`
- `src/pages/contact.astro` — email, GitHub, and X
- `src/pages/freightpilot-ai.astro` — FreightPilot AI project notes
- `src/pages/404.astro` — not-found page

Project descriptions and links live in `src/components/ProjectRows.astro`. The home page is introduction-only.

## Contact

- Email: <mailto:abdullasajad01@gmail.com>
- GitHub: <https://github.com/sajadxdp0>
- X: <https://x.com/sajadxdp>

## Cloud Drift backdrop

The site uses the Cloud Drift scene from [Handsher/ascii-wallpapers](https://github.com/Handsher/ascii-wallpapers), vendored under `public/wallpapers/` with its MIT license. The animated SVG is the default; a static WebP frame is served when reduced motion is requested. There is no client-side wallpaper picker.

The Claude Code plugin is installed at project scope through `.claude/settings.json`. Install it again with:

```bash
npx claudepluginhub handsher/ascii-wallpapers --plugin ascii-wallpapers
```

## Claude Code backdrop plugin

`claude-mods/night-sky/` is a Claude Code mod that sets a named `night-sky` backdrop at session start and draws it at the `Backdrop` render site.

The mod requires Claude Code 2.1.323 or later and renders in Claude Code Desktop or mobile. The terminal does not render backdrops. This mod does not control the public website; the website's background is the `.site-backdrop` CSS layer.

To install it for this repository:

```bash
claude plugin marketplace add ./
claude plugin install night-sky@sajad-portfolio --scope local
```

Validate the plugin with:

```bash
claude plugin validate ./claude-mods/night-sky
```

## Fonts

The site self-hosts Nerd Fonts-patched JetBrains Mono. Upstream attribution and the required OFL/MIT license notices are deployed from `public/assets/fonts/`.

## Run and build the site

Requires Node.js 22.23.4 or newer.

```bash
npm ci
npm run dev
npm run build
npm run check
npm run preview
```

`npm run check` validates built metadata, internal links, sitemap coverage, CSS assets, and copied public files. GitHub Actions runs it before deploying `dist/` to GitHub Pages when changes reach `main`.
