# Dr. Ramakant Patil — website

Professional profile website for **Dr. Ramakant Patil, pediatrician, Nashik**: one long homepage and a separate Privacy Policy page. It is static HTML and CSS with a small script for progressive enhancements. There is no backend, form, database, tracking or third-party embed. Appointments are booked through a WhatsApp chatbot.

## Quick look

After `npm run build`, double-click **`preview/index.html`**. The pages in `preview/` have their fonts and photos embedded, so they display correctly straight from disk.

Browsers block web fonts on pages opened directly from a folder (`file://`). That is why `dist/index.html` shows fallback fonts when double-clicked, even though it displays correctly once hosted. **Use `preview/` for review and `dist/` for publishing.**

## Folder map

```text
├── dist/                 ← PUBLISH THIS FOLDER (production build, committed)
│   ├── index.html, privacy-policy.html
│   ├── assets/           site.css, site.js
│   ├── fonts/            self-hosted WOFF2 fonts and their licence files
│   ├── images/           optimised WebP photographs and og-image.jpg
│   ├── favicon.svg, favicon-32.png, favicon.ico, apple-touch-icon.png
│   └── robots.txt        (+ sitemap.xml once SITE_ORIGIN is set)
├── src/
│   ├── content.mjs       ALL homepage text, WhatsApp number, contacts, roles, links, captions, alt text
│   ├── privacy.mjs       Privacy Policy text and "last updated" date
│   ├── brand-icons.mjs   Facebook / Instagram / YouTube / WhatsApp glyphs (Simple Icons, CC0)
│   └── templates/        page layout only (layout.mjs, home.mjs, privacy.mjs)
├── public/               static files copied into dist/ (CSS, JS, fonts, images, icons)
├── tools/                one-off image scripts (photo crops, portrait cut-out, social image)
├── source-assets/        original 4000 × 4000 portrait (not published)
├── build.mjs             build script, no dependencies
├── serve.mjs             local preview server for dist/
├── site.config.json      optional production origin (empty; Vercel sets it automatically)
├── vercel.json           Vercel build settings (build command, output folder, headers)
└── package.json
```

`preview/` (generated) and `internal/` (research notes) are kept out of Git on purpose; see `.gitignore`.

## Commands

Requires **Node.js 18 or newer**. There is nothing to install because the build has no dependencies.

```bash
npm run build      # regenerate dist/ and preview/ from src/ and public/
npm run preview    # serve dist/ at http://localhost:4173
```

Every build also checks for empty `href="#"` links, missing anchors, missing local files, extra `<h1>` elements, placeholder text and external resources. A failure is printed and returns a non-zero exit code.

## Editing

- **Text, dates, roles, phone numbers, emails, links, captions and alt text:** `src/content.mjs`. Each fact has a `source` note, and these notes are never shown on the site.
- **WhatsApp booking number and pre-typed message:** `WHATSAPP_NUMBER` and `WHATSAPP_MESSAGE` at the top of `src/content.mjs`. Every "Book Appointment" button uses them.
- **Developer credit in the footer:** `footer.credit` in `src/content.mjs`. It is currently text only. To add the Turiya logo, place an SVG in `public/images/` and add an `<img>` before the name in `siteFooter()` (`src/templates/layout.mjs`).
- **Privacy Policy:** `src/privacy.mjs`. Update `lastUpdated` whenever the policy changes.
- **Design:** `public/assets/site.css`. Colour and font tokens are at the top.
- **Photographs:** add WebP files to `public/images/` named `name-WIDTH.webp`, then reference them in `images` inside `content.mjs`.

Run `npm run build` after any edit.

## Deployment on Vercel

The site is live at **https://drramakantpatil.vercel.app/**. `vercel.json` tells Vercel to run `npm run build` and publish `dist/`.

Without that file, Vercel finds no framework and serves the `public/` folder instead. That folder has no `index.html`, so every page returns 404. Do not remove `vercel.json`.

On Vercel, the build reads the project's production domain from `VERCEL_PROJECT_PRODUCTION_URL` (Vercel sets it automatically). The canonical URLs, `og:image` and sitemap are written with that domain. If a custom domain is added in Vercel later, the next deployment switches to it on its own.

`vercel.json` also sets these headers:

- long-term caching for `/fonts/`
- `nosniff`
- the referrer policy
- `SAMEORIGIN` framing
- a Permissions-Policy that turns off camera, microphone and location

## Production origin (other hosts)

On hosts other than Vercel, nothing is detected automatically. Once the real address is known, set it in **one** of these places:

- `site.config.json` → `"siteOrigin": "https://www.real-domain.in"`
- or the environment: `SITE_ORIGIN=https://www.real-domain.in npm run build` (PowerShell: `$env:SITE_ORIGIN="https://www.real-domain.in"; npm run build`)

With an origin set, the build adds:

- `<link rel="canonical">`
- `og:url`
- absolute `og:image` and JSON-LD URLs
- `sitemap.xml`
- a `Sitemap:` line in `robots.txt`

Without an origin, those are omitted rather than written with a wrong address. The value must be just the origin; paths and localhost are rejected.

The pages use relative paths only, so `dist/` works at a domain root or in a sub-folder. Both pages are real files, so `/privacy-policy.html` works on direct visits and refresh without server rewrites. Any static host works, including the nginx/Docker pattern used for the Dr. Darwade site, with `dist/` as the web root (or run `npm run build` in the image first).

Still to do after deployment:

- submit the sitemap in Search Console
- optionally, link the site from the Google Business Profile

## Privacy behaviour (actual, as built)

- **Requests on page load:** only this site's own files (HTML, CSS, JS, fonts, images). There is no CDN, font service, analytics, pixel, map, video or social embed.
- **Storage:** no cookies, `localStorage`, `sessionStorage` or IndexedDB.
- **Forms and uploads:** none.
- **Booking:** "Book Appointment" opens `wa.me/918855095514` in WhatsApp with a pre-typed message. Nothing is sent until the visitor presses send in WhatsApp.
- **Other contact:** `tel:` and `mailto:` links to the hospital's published numbers and emails.
- **Outbound links:** maps, hospital website and social channels, press, IAP and PDFs open only when clicked, in a new tab.
- `<meta name="referrer" content="strict-origin-when-cross-origin">` is set.

If any of this changes, for example by adding analytics, a map embed or a form, update `src/privacy.mjs` before publishing.

## Quality checks run on this build

- **axe-core (WCAG 2.0, 2.1 and 2.2 at levels A and AA, plus best practice):** 0 violations on both pages at 1440 px and 390 px.
- **Keyboard:**
  - skip link and visible focus
  - menu disclosure: `aria-expanded`, Escape closes it and returns focus, and it closes after a link is chosen
  - lightbox on native `<dialog>`, with focus returned afterwards
- **Reduced motion:** entrance animation, road animation and smooth scrolling are switched off.
- **Layout:** checked at 360, 390, 768, 1024, 1440 and 1920 px with no horizontal overflow.
- **Without JavaScript:** content and links still work, and the mobile links fall back to a visible row.

## Licences

- Fonts: Cormorant Garamond, DM Sans and Newsreader, all under the SIL Open Font License 1.1 (licence files in `public/fonts/`).
- Brand glyphs: Simple Icons, CC0.
- Hospital photographs: publication rights should be confirmed with the hospital or the doctor before launch.
