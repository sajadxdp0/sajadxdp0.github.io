import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import config from "../astro.config.mjs";

const root = resolve("dist");
const publicRoot = resolve("public");
const expectedOrigin = new URL(config.site).origin;
const failures = [];

function walk(directory) {
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function localPathFromUrl(value) {
  const url = new URL(value, `${expectedOrigin}/`);
  if (url.origin !== expectedOrigin) return null;
  if (url.pathname === "/") return join(root, "index.html");
  if (url.pathname.endsWith("/")) return null;
  return join(root, decodeURIComponent(url.pathname));
}

function idsIn(html) {
  return [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
}

const files = walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const htmlByPath = new Map(htmlFiles.map((file) => [file, readFileSync(file, "utf8")]));
const indexablePaths = new Set();

for (const [file, html] of htmlByPath) {
  const relative = file.slice(root.length + 1);
  const ids = idsIn(html);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  const h1Count = (html.match(/<h1\b/g) || []).length;
  const mainCount = (html.match(/<main\b/g) || []).length;
  const title = html.match(/<title>(.*?)<\/title>/)?.[1]?.trim();
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim();
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const ogUrl = html.match(/<meta property="og:url" content="([^"]*)"/)?.[1];
  const twitterCard = html.match(/<meta name="twitter:card" content="([^"]*)"/)?.[1];
  const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);
  let canonicalUrl;
  try {
    canonicalUrl = canonical ? new URL(canonical) : null;
  } catch {
    canonicalUrl = null;
  }

  if (h1Count !== 1) failures.push(`${relative}: expected one h1, found ${h1Count}`);
  if (mainCount !== 1) failures.push(`${relative}: expected one main, found ${mainCount}`);
  if (!title) failures.push(`${relative}: missing title`);
  if (!description) failures.push(`${relative}: missing meta description`);
  if (!canonicalUrl || canonicalUrl.origin !== expectedOrigin) failures.push(`${relative}: invalid canonical URL`);
  if (ogUrl !== canonical) failures.push(`${relative}: og:url must match canonical`);
  if (twitterCard !== "summary_large_image") failures.push(`${relative}: missing Twitter card metadata`);
  if (duplicateIds.length) failures.push(`${relative}: duplicate IDs: ${duplicateIds.join(", ")}`);
  if (/<script\b/i.test(html)) failures.push(`${relative}: unexpected client-side script`);
  if (!/<html lang="en">/.test(html)) failures.push(`${relative}: missing document language`);

  const expectedPath = relative === "index.html" ? "/" : `/${relative}`;
  if (canonicalUrl && canonicalUrl.pathname !== expectedPath) {
    failures.push(`${relative}: canonical path does not match the built file`);
  }
  if (!noindex && canonicalUrl) indexablePaths.add(canonicalUrl.pathname);

  const refs = [
    ...[...html.matchAll(/(?:href|src|srcset)="([^"]+)"/g)].map((match) => match[1]),
  ].flatMap((value) => value.split(",").map((part) => part.trim().split(/\s+/)[0]));

  for (const ref of new Set(refs)) {
    if (!ref || ref.startsWith("mailto:") || ref.startsWith("tel:")) continue;

    const targetPath = ref.startsWith("#") ? file : localPathFromUrl(ref);
    if (!targetPath) continue;
    if (!existsSync(targetPath)) {
      failures.push(`${relative}: missing local target ${ref}`);
      continue;
    }

    const hash = new URL(ref, `${expectedOrigin}/`).hash.slice(1);
    if (hash && targetPath.endsWith(".html")) {
      const targetHtml = readFileSync(targetPath, "utf8");
      if (!idsIn(targetHtml).includes(hash)) failures.push(`${relative}: missing fragment #${hash} in ${ref}`);
    }
  }
}

const missingCssAssets = [];
for (const file of files.filter((path) => path.endsWith(".css"))) {
  const css = readFileSync(file, "utf8");
  for (const match of css.matchAll(/url\(["']?(\/[^"')]+)["']?\)/g)) {
    const targetPath = localPathFromUrl(match[1]);
    if (targetPath && !existsSync(targetPath)) {
      missingCssAssets.push(`${file.slice(root.length + 1)}: ${match[1]}`);
    }
  }
}
failures.push(...missingCssAssets.map((message) => `missing CSS asset ${message}`));

const sitemapPath = join(root, "sitemap.xml");
if (!existsSync(sitemapPath)) {
  failures.push("sitemap.xml is missing");
} else {
  const sitemap = readFileSync(sitemapPath, "utf8");
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  const paths = new Set();

  for (const value of urls) {
    const url = new URL(value);
    if (url.origin !== expectedOrigin) failures.push(`sitemap: unexpected origin ${value}`);
    paths.add(url.pathname);
    const targetPath = localPathFromUrl(value);
    if (!targetPath || !existsSync(targetPath)) failures.push(`sitemap: missing built page ${value}`);
  }

  for (const path of indexablePaths) {
    if (!paths.has(path)) failures.push(`sitemap: missing indexable page ${path}`);
  }
  for (const path of paths) {
    if (!indexablePaths.has(path)) failures.push(`sitemap: unexpected or no-index page ${path}`);
  }
}

const robots = readFileSync(join(root, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${expectedOrigin}/sitemap.xml`)) {
  failures.push("robots.txt does not reference the expected sitemap");
}

for (const publicFile of walk(publicRoot)) {
  const relative = publicFile.slice(publicRoot.length + 1);
  if (!existsSync(join(root, relative))) failures.push(`public asset was not copied to dist: ${relative}`);
}

if (failures.length) {
  console.error(`Site validation failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Site validation passed: ${htmlFiles.length} pages, local links, metadata, sitemap, CSS assets, and public files are consistent.`);
