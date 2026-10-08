/*
 * Privacy Policy page (privacy-policy.html). Shares the header and footer;
 * header links point back to the homepage's sections.
 */
import { site, contact } from '../content.mjs';
import { privacy } from '../privacy.mjs';
import { esc, t, head, siteHeader, siteFooter, icons } from './layout.mjs';

export function renderPrivacy({ origin, year, assetVersion }) {
  const sections = privacy.sections
    .map((s, i) => {
      const id = `policy-${i + 1}`;
      const extra = s.contact
        ? `
          <address>
            Email: <a href="mailto:${contact.emails[0]}">${esc(contact.emails[0])}</a><br>
            Address: ${esc(contact.addressOneLine)}.
          </address>`
        : '';
      return `<section aria-labelledby="${id}">
        <div>
          <h2 id="${id}">${t(s.heading)}</h2>
          ${s.paragraphs.map((p) => `<p>${t(p)}</p>`).join('\n          ')}${extra}
        </div>
      </section>`;
    })
    .join('\n      ');

  return `<!doctype html>
<html lang="${site.lang}">
${head({ page: 'privacy', title: site.privacy.title, description: site.privacy.description, origin, path: 'privacy-policy.html', assetVersion })}
<body>
<a class="skip-link" href="#main">Skip to content</a>
${siteHeader({ base: 'index.html' })}
<main id="main" tabindex="-1">
  <article class="policy" id="top">
    <div class="wrap section__grid">
      <p class="section__label">Website policy</p>
      <div>
        <header class="policy__head">
          <h1 class="policy__title">${esc(privacy.title)}</h1>
          <p class="policy__meta">
            <span>Last updated: <time datetime="${privacy.lastUpdatedISO}">${esc(privacy.lastUpdated)}</time></span>
            <a class="link back-link" href="index.html">${icons.arrowLeft}Back to the homepage</a>
          </p>
        </header>
        <div class="policy__body">
      ${sections}
        </div>
        <p class="policy__back"><a class="btn btn--line" href="index.html">${icons.arrowLeft}Return to the homepage</a></p>
      </div>
    </div>
  </article>
</main>
${siteFooter({ base: 'index.html', year })}
</body>
</html>
`;
}
