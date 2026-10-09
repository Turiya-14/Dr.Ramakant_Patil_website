/*
 * Shared markup: escaping/typesetting helpers, <head>, header, footer, icons.
 */
import { site, nav, contact, footer, images, structuredData, booking } from '../content.mjs';
import { brandPaths } from '../brand-icons.mjs';

/* ---------------------------------------------------------------- helpers */
export const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Escape, then keep short pairs together: no-break spaces after titles and
 * between numbers and units, and no line break inside "over-50" or inside
 * en-dash compounds such as "IYCFCON–POSHAN". For text content only.
 */
export const t = (value) =>
  esc(value)
    .replace(/\bDr\. /g, 'Dr.&nbsp;')
    .replace(/\bNo\. /g, 'No.&nbsp;')
    .replace(/\bD\. Y\. /g, 'D.&nbsp;Y.&nbsp;')
    .replace(/\bB\. J\. /g, 'B.&nbsp;J.&nbsp;')
    .replace(/\bMAHA (?=[A-Z])/g, 'MAHA&nbsp;')
    .replace(/(\d) (km|hours|minutes|August|January|June|July|May|November|October)\b/g, '$1&nbsp;$2')
    .replace(/\b(over-\d+|[A-Za-z]+–[A-Za-z]+)\b/g, '<span class="nowrap">$1</span>');

const attrs = (obj) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`))
    .join(' ');

/** Responsive <img>. `img` is an entry from content.images. */
export function picture(img, { sizes, loading = 'lazy', fetchpriority } = {}) {
  const srcset = img.widths.map((w) => `images/${img.file}-${w}.webp ${w}w`).join(', ');
  const fallback = img.widths.length > 1 ? img.widths[img.widths.length - 2] : img.widths[0];
  return `<img ${attrs({
    src: `images/${img.file}-${fallback}.webp`,
    srcset,
    sizes,
    width: img.width,
    height: img.height,
    alt: img.alt,
    loading,
    decoding: loading === 'eager' ? 'sync' : 'async',
    fetchpriority,
  })}>`;
}

export const largestSrc = (img) => `images/${img.file}-${img.widths[img.widths.length - 1]}.webp`;

const NEW_TAB = '<span class="sr-only"> (opens in a new tab)</span>';

export function extLink(href, label, { lang } = {}) {
  return `<a class="link" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${t(label)}${
    lang ? ` <span class="lang">(${esc(lang)})</span>` : ''
  }${icons.ext}${NEW_TAB}</a>`;
}

/**
 * WhatsApp booking link. `body` is trusted markup; `className` adds classes.
 * Screen readers hear where the link goes unless the visible text says it.
 */
export const bookingLink = (body, className, { saysWhatsApp = false } = {}) =>
  `<a${className ? ` class="${className}"` : ''} href="${esc(booking.url)}" target="_blank" rel="noopener noreferrer">${body}<span class="sr-only">${
    saysWhatsApp ? '' : ' on WhatsApp'
  } (opens in a new tab)</span></a>`;

/** Two-line display headings: [line1, line2] → line 2 set in italic. */
export const headingLines = ([a, b]) => `<span class="line">${t(a)}</span> <em class="line">${t(b)}</em>`;

/* ------------------------------------------------------------------ icons */
const classAttr = (name) => (name ? ` class="${name}"` : '');
const svg = (body, name) =>
  `<svg${classAttr(name)} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
const brand = (name) =>
  `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="${brandPaths[name]}"/></svg>`;

export const icons = {
  ext: svg('<path d="M8 16 16 8M9.5 8H16v6.5"/>', 'ext'),
  arrowLeft: svg('<path d="M19.5 12h-14M11 6.5 5.5 12l5.5 5.5"/>'),
  arrowUp: svg('<path d="M7 17 17 7M8.5 7H17v8.5"/>', 'press__arrow'),
  phone: svg('<path d="M6.6 3.8h2.6l1.4 4-1.9 1.3a11.6 11.6 0 0 0 6.2 6.2l1.3-1.9 4 1.4v2.6a1.9 1.9 0 0 1-2 1.9A16.2 16.2 0 0 1 4.7 5.8a1.9 1.9 0 0 1 1.9-2Z"/>'),
  pin: svg('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>'),
  chev: svg('<path d="m6 9.5 6 6 6-6"/>', 'chev'),
  menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>', 'icon-menu'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>', 'icon-close'),
  whatsapp: brand('whatsapp'),
  facebook: brand('facebook'),
  instagram: brand('instagram'),
  youtube: brand('youtube'),
};

/* The hero portrait's `sizes`, shared by the <img> and its preload. */
export const HERO_SIZES = '(min-width: 1280px) 580px, (min-width: 960px) 46vw, (min-width: 600px) 520px, 100vw';

/* -------------------------------------------------------------------- head */
export function head({ page, title, description, origin, path, assetVersion }) {
  const canonical = origin ? `${origin}/${path}` : null;
  const ogImage = origin ? `${origin}/${site.ogImage.src}` : site.ogImage.src;

  const preloads = [
    'fonts/cormorant-garamond-latin-wght-normal.woff2',
    'fonts/dm-sans-latin-wght-normal.woff2',
    'fonts/newsreader-latin-400-normal.woff2',
  ]
    .map((f) => `<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>`)
    .join('\n  ');

  const p = images.portrait;
  const heroPreload =
    page === 'home'
      ? `\n  <link rel="preload" as="image" href="images/${p.file}-${p.widths[1]}.webp" imagesrcset="${p.widths
          .map((w) => `images/${p.file}-${w}.webp ${w}w`)
          .join(', ')}" imagesizes="${HERO_SIZES}" fetchpriority="high">`
      : '';

  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">${canonical ? `\n  <link rel="canonical" href="${esc(canonical)}">` : ''}
  <meta name="theme-color" content="#0B1F3A">
  <meta name="color-scheme" content="light">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="format-detection" content="telephone=no">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="apple-touch-icon.png">
  ${preloads}${heroPreload}
  <link rel="stylesheet" href="assets/site.css?v=${assetVersion}">
  <script>document.documentElement.classList.add('js')</script>
  <script src="assets/site.js?v=${assetVersion}" defer></script>

  <meta property="og:type" content="${page === 'home' ? 'profile' : 'website'}">
  <meta property="og:site_name" content="${esc(site.name)}">
  <meta property="og:locale" content="${site.locale}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">${canonical ? `\n  <meta property="og:url" content="${esc(canonical)}">` : ''}
  <meta property="og:image" content="${esc(ogImage)}">
  <meta property="og:image:width" content="${site.ogImage.width}">
  <meta property="og:image:height" content="${site.ogImage.height}">
  <meta property="og:image:alt" content="${esc(site.ogImage.alt)}">${page === 'home' ? `\n  <meta property="profile:first_name" content="Ramakant">\n  <meta property="profile:last_name" content="Patil">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(ogImage)}">${page === 'home' ? `\n  ${jsonLd(origin)}` : ''}
</head>`;
}

/* --------------------------------------------------------- structured data */
function jsonLd(origin) {
  const p = structuredData.person;
  const hospitalId = origin ? `${origin}/#antara-hospital` : '#antara-hospital';
  const personId = origin ? `${origin}/#dr-ramakant-patil` : '#dr-ramakant-patil';
  const portrait = `images/${images.portrait.file}-${images.portrait.widths[1]}.webp`;
  const primary = contact.phones.find((ph) => ph.primary);
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: p.name,
        alternateName: p.alternateName,
        honorificPrefix: p.honorificPrefix,
        honorificSuffix: p.honorificSuffix,
        jobTitle: p.jobTitle,
        image: origin ? `${origin}/${portrait}` : portrait,
        ...(origin ? { url: `${origin}/` } : {}),
        knowsAbout: p.knowsAbout,
        alumniOf: { '@type': 'CollegeOrUniversity', name: p.alumniOf },
        hasCredential: [
          { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'MBBS', recognizedBy: { '@type': 'CollegeOrUniversity', name: 'Poona University' }, dateCreated: '1986' },
          { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'MD (Paediatrics)', recognizedBy: { '@type': 'CollegeOrUniversity', name: 'Poona University' }, dateCreated: '1989' },
          { '@type': 'EducationalOccupationalCredential', credentialCategory: 'fellowship', name: 'Fellowship of the Indian Academy of Pediatrics (FIAP)', recognizedBy: { '@type': 'Organization', name: 'Indian Academy of Pediatrics' }, dateCreated: '2023' },
        ],
        memberOf: { '@type': 'Organization', name: 'Indian Academy of Pediatrics' },
        affiliation: { '@id': hospitalId },
        workLocation: { '@id': hospitalId },
      },
      {
        '@type': 'Hospital',
        '@id': hospitalId,
        name: contact.hospital,
        url: contact.website.href,
        telephone: primary.tel,
        email: contact.emails[0],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Antara Hospital Building, opposite Soni Paithani, Kulkarni Colony, Sharanpur Road',
          addressLocality: 'Nashik',
          addressRegion: 'Maharashtra',
          postalCode: '422002',
          addressCountry: 'IN',
        },
        sameAs: contact.social.map((s) => s.href),
      },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

/* ------------------------------------------------------------------ header */
export function siteHeader({ base = '' } = {}) {
  // base = '' on the homepage (in-page anchors), 'index.html' on other pages.
  const href = (h) => (base ? `${base}${h}` : h);
  const longPart = nav.cta.label.replace(nav.cta.short, '').trim();
  return `<header class="site-header">
  <a class="nav-logo" href="${base || '#top'}">${esc(nav.logo)} <span>${esc(nav.logoSub)}</span></a>
  <nav class="site-nav" id="site-menu" aria-label="Main navigation">
    <ul class="nav-links">
      ${nav.links.map((l) => `<li><a href="${href(l.href)}">${esc(l.label)}</a></li>`).join('\n      ')}
    </ul>
  </nav>
  <div class="nav-actions">
    ${bookingLink(`${esc(nav.cta.short)}<span class="cta-long"> ${esc(longPart)}</span>`, 'nav-cta')}
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-menu"><span class="sr-only">Menu</span>${icons.menu}${icons.close}</button>
  </div>
</header>`;
}

/* ------------------------------------------------------------------ footer */
export function siteFooter({ base = '', year }) {
  const href = (h) => (base ? `${base}${h}` : h);
  const c = footer.credit;
  return `<footer class="site-footer">
  <div class="wrap footer__grid">
    <div class="footer__id">
      <p class="footer__name">${esc(site.name)}</p>
      <p>${esc(site.qualifications)}</p>
      <p>${esc(site.role)} · ${esc(site.city)}</p>
    </div>
    <nav class="footer__nav" aria-label="Footer">
      <ul>
        ${footer.links.map((l) => `<li><a href="${href(l.href)}">${esc(l.label)}</a></li>`).join('\n        ')}
        <li><a href="privacy-policy.html">Privacy Policy</a></li>
      </ul>
    </nav>
    <div class="footer__call">
      <p>Appointments on WhatsApp</p>
      ${bookingLink(esc(booking.display))}
    </div>
  </div>
  <div class="wrap">
    <div class="footer__base">
      <p>© ${year} ${esc(site.name)}. ${esc(footer.note)}</p>
      <a class="credit" href="${esc(c.href)}" target="_blank" rel="noopener">${esc(c.prefix)} <span class="credit__name">${esc(c.name)}</span>${NEW_TAB}</a>
    </div>
  </div>
</footer>`;
}
