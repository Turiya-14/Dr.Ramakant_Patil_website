#!/usr/bin/env node
/*
 * Build: renders the two pages from src/ and copies public/ into dist/.
 * Zero dependencies — needs Node.js 18 or newer.
 *
 *   npm run build                       → dist/ without production URLs
 *   SITE_ORIGIN=https://example.org npm run build
 *                                       → adds canonical, og:url, absolute
 *                                         og:image and sitemap.xml
 *
 * The origin can also be set in site.config.json ("siteOrigin"). The
 * environment variable wins. Leave both empty until the real domain is known.
 */
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderHome } from './src/templates/home.mjs';
import { renderPrivacy } from './src/templates/privacy.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(ROOT, 'public');
const DIST = join(ROOT, 'dist');

/* ------------------------------------------------------------ origin */
async function readOrigin() {
  let configured = '';
  try {
    const config = JSON.parse(await readFile(join(ROOT, 'site.config.json'), 'utf8'));
    configured = (config.siteOrigin || '').trim();
  } catch {
    /* no config file — fine */
  }
  const raw = (process.env.SITE_ORIGIN ?? configured).trim();
  if (!raw) return '';
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`SITE_ORIGIN is not a valid URL: "${raw}"`);
  }
  if (!/^https?:$/.test(url.protocol) || (url.pathname !== '/' && url.pathname !== '') || url.search || url.hash) {
    throw new Error(`SITE_ORIGIN must be just the origin, e.g. https://www.example.in — got "${raw}"`);
  }
  if (/^(localhost|127\.|0\.0\.0\.0)/.test(url.hostname)) {
    throw new Error('SITE_ORIGIN must be the public production origin, not localhost.');
  }
  return url.origin;
}

/* ----------------------------------------------------------- helpers */
async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const shortHash = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 10);

/* -------------------------------------------------------------- build */
async function build() {
  const origin = await readOrigin();
  const year = new Date().getFullYear();

  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });
  await cp(PUBLIC, DIST, { recursive: true });

  const css = await readFile(join(PUBLIC, 'assets/site.css'));
  const js = await readFile(join(PUBLIC, 'assets/site.js'));
  const assetVersion = shortHash(Buffer.concat([css, js]));

  const pages = {
    'index.html': renderHome({ origin, year, assetVersion }),
    'privacy-policy.html': renderPrivacy({ origin, year, assetVersion }),
  };
  for (const [file, html] of Object.entries(pages)) {
    await writeFile(join(DIST, file), html, 'utf8');
  }

  // robots.txt — always allows crawling. Sitemap line only with a real origin.
  const robots = ['User-agent: *', 'Allow: /', ''];
  if (origin) robots.push(`Sitemap: ${origin}/sitemap.xml`, '');
  await writeFile(join(DIST, 'robots.txt'), robots.join('\n'), 'utf8');

  if (origin) {
    const today = new Date().toISOString().slice(0, 10);
    const urls = [`${origin}/`, `${origin}/privacy-policy.html`];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
    await writeFile(join(DIST, 'sitemap.xml'), xml, 'utf8');
  }

  const problems = await check(pages);
  await buildPreview(pages);
  const files = await walk(DIST);
  let bytes = 0;
  for (const f of files) bytes += (await stat(f)).size;

  console.log(`\nBuilt ${files.length} files (${(bytes / 1024 / 1024).toFixed(2)} MB) in dist/`);
  console.log(origin ? `Origin: ${origin} — canonical, og:url and sitemap.xml written.` : 'Origin: not set — canonical, og:url and sitemap.xml omitted (see README).');
  if (problems.length) {
    console.error(`\n${problems.length} problem(s):\n - ${problems.join('\n - ')}`);
    process.exitCode = 1;
  } else {
    console.log('Checks passed: links, anchors, local files, headings and placeholder text.');
  }
}

/* ------------------------------------------------------ offline preview */
/*
 * Browsers refuse to load web fonts from pages opened straight from disk
 * (file://). preview/ holds self-contained copies of both pages — fonts,
 * photographs, CSS and JS embedded — so they can be double-clicked and
 * reviewed without a server. Publish dist/, never preview/.
 */
async function buildPreview(pages) {
  const PREVIEW = join(ROOT, 'preview');
  await rm(PREVIEW, { recursive: true, force: true });
  await mkdir(PREVIEW, { recursive: true });

  const dataUri = async (rel, type) =>
    `data:${type};base64,${(await readFile(join(DIST, rel))).toString('base64')}`;

  let css = await readFile(join(DIST, 'assets/site.css'), 'utf8');
  for (const [match, rel] of [...css.matchAll(/url\("\.\.\/(fonts\/[^"]+\.woff2)"\)/g)]) {
    css = css.replace(match, `url("${await dataUri(rel, 'font/woff2')}")`);
  }
  const js = await readFile(join(DIST, 'assets/site.js'), 'utf8');
  const favicon = await dataUri('favicon.svg', 'image/svg+xml');

  for (const [file, html] of Object.entries(pages)) {
    let out = html
      .replace(/\s*<link rel="preload"[^>]*>/g, '')
      .replace(/<link rel="stylesheet" href="assets\/site\.css[^"]*">/, () => `<style>${css}</style>`)
      .replace(/\s*<script src="assets\/site\.js[^"]*" defer><\/script>/, '')
      .replace('</body>', () => `<script>${js}</script>\n</body>`)
      .replace(/<link rel="icon" href="favicon\.svg"[^>]*>/, `<link rel="icon" href="${favicon}" type="image/svg+xml">`)
      .replace(/\s*<link rel="(?:icon|apple-touch-icon)" href="(?:favicon-32\.png|apple-touch-icon\.png)"[^>]*>/g, '');

    // Each <img>: keep only its largest file, embedded.
    const imgs = [...out.matchAll(/<img [^>]*>/g)].map((m) => m[0]);
    for (const tag of imgs) {
      const set = tag.match(/srcset="([^"]+)"/);
      const src = tag.match(/ src="([^"]+)"/);
      if (!src || src[1].startsWith('data:')) continue;
      const files = set ? set[1].split(',').map((p) => p.trim().split(/\s+/)[0]) : [src[1]];
      const largest = files[files.length - 1];
      const uri = await dataUri(largest, 'image/webp');
      const replaced = tag
        .replace(/ srcset="[^"]*"/, '')
        .replace(/ sizes="[^"]*"/, '')
        .replace(/ src="[^"]*"/, ` src="${uri}"`);
      out = out.replace(tag, () => replaced);
    }
    // Lightbox links reuse the embedded image instead of a second copy.
    out = out.replace(/<a class="zoom" href="images\/[^"]+"/g, '<a class="zoom" href="#gallery" data-inline="1"');

    const leftovers = out.match(/(?:src|href)="(?:images|fonts|assets)\/[^"]+"/g);
    if (leftovers) throw new Error(`preview/${file} still references files: ${leftovers.join(', ')}`);
    await writeFile(join(PREVIEW, file), out, 'utf8');
  }
  console.log('Offline preview written to preview/ (open preview/index.html directly).');
}

/* -------------------------------------------------------------- checks */
async function check(pages) {
  const problems = [];
  const ids = {};
  for (const [file, html] of Object.entries(pages)) {
    ids[file] = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  }

  for (const [file, html] of Object.entries(pages)) {
    if (/href="#"/.test(html)) problems.push(`${file}: empty href="#"`);
    if (/\b(lorem|placeholder|TODO|FIXME|Replace with)\b/i.test(html.replace(/<script[\s\S]*?<\/script>/g, '')))
      problems.push(`${file}: placeholder text found`);
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) problems.push(`${file}: expected exactly one <h1>, found ${h1}`);

    // In-page and cross-page anchors
    for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
      if (/^(https?:|mailto:|tel:)/.test(href)) continue;
      const [path, hash] = href.split('#');
      const target = path === '' ? file : path.split('?')[0];
      if (target && !pages[target]) {
        try {
          await stat(join(DIST, target));
        } catch {
          problems.push(`${file}: missing file for href="${href}"`);
          continue;
        }
      }
      if (hash && pages[target] && !ids[target].has(hash)) problems.push(`${file}: anchor #${hash} not found in ${target}`);
    }

    // src / srcset / image preload references
    const refs = new Set();
    for (const [, src] of html.matchAll(/\ssrc="([^"]+)"/g)) refs.add(src);
    for (const [, set] of html.matchAll(/(?:srcset|imagesrcset)="([^"]+)"/g))
      set.split(',').forEach((part) => refs.add(part.trim().split(/\s+/)[0]));
    for (const ref of refs) {
      if (/^(https?:|data:)/.test(ref)) {
        if (/^https?:/.test(ref)) problems.push(`${file}: external resource ${ref} (privacy policy says none)`);
        continue;
      }
      try {
        await stat(join(DIST, ref.split('?')[0]));
      } catch {
        problems.push(`${file}: missing local file ${ref}`);
      }
    }
  }

  // Fonts referenced by CSS must exist
  const css = await readFile(join(DIST, 'assets/site.css'), 'utf8');
  for (const [, url] of css.matchAll(/url\("\.\.\/([^"]+)"\)/g)) {
    try {
      await stat(join(DIST, url));
    } catch {
      problems.push(`site.css: missing ${url}`);
    }
  }
  return problems;
}

build().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
