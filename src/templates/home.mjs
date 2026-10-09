/*
 * Homepage markup. Section order follows the brief:
 * header → hero (#top) → milestones → #about → #services → #approach →
 * #leadership → #recognition → #community → #gallery / #coverage →
 * #hospital → #contact → footer.
 */
import {
  site, hero, milestones, about, services, approach, leadership, recognition,
  community, gallery, coverage, hospital, contact, contactSection, images, booking,
} from '../content.mjs';
import {
  esc, t, picture, largestSrc, extLink, bookingLink, headingLines, icons, head, siteHeader, siteFooter, HERO_SIZES,
} from './layout.mjs';

const label = (text) => `<p class="section__label">${esc(text)}</p>`;

/* ------------------------------------------------------------------- hero */
function heroSection() {
  return `<section class="hero" id="top" aria-labelledby="hero-name">
  <div class="wrap hero__grid">
    <div class="hero__intro">
      <p class="overline">${esc(hero.overline)}</p>
      <h1 class="hero__name" id="hero-name"><span>${t(hero.nameLines[0])}</span> <em>${t(hero.nameLines[1])}</em></h1>
      <p class="hero__quals">${esc(site.qualifications)}</p>
    </div>
    <div class="hero__figure portrait">
      <span class="portrait__panel" aria-hidden="true"></span>
      ${picture(images.portrait, { sizes: HERO_SIZES, loading: 'eager', fetchpriority: 'high' })}
    </div>
    <div class="hero__body">
      <p class="hero__tagline">${t(hero.tagline)}</p>
      <p class="hero__text">${t(hero.intro)}</p>
      <div class="hero__actions">
        ${bookingLink(`${icons.whatsapp}${esc(hero.primary.label)}`, 'btn btn--gold')}
        <a class="btn btn--line" href="${hero.secondary.href}">${t(hero.secondary.label)}</a>
      </div>
      <p class="hero__practice">${icons.pin}<span>${esc(hero.practiceLine)}</span></p>
    </div>
  </div>
  <div class="wrap">
    <h2 class="sr-only">At a glance</h2>
    <ul class="milestones">
      ${milestones
        .map(
          (m) => `<li><span class="ms__year">${m.year}</span><span class="ms__title">${t(m.title)}</span><span class="ms__sub">${t(m.sub)}</span></li>`,
        )
        .join('\n      ')}
    </ul>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ about */
// A drop cap would split an opening abbreviation ("D" + "r. Ramakant…"),
// so it is only used when the first paragraph starts with an ordinary word.
const startsWithAbbreviation = (text) => /^(Dr|Mr|Mrs|Ms|Prof|St)\.\s/.test(text);

// "Antara Hospital, Nashik · Nelson Hospital, Nashik": each part stays on one line.
const keepParts = (text) =>
  text
    .split(' · ')
    .map((part) => `<span class="nowrap">${t(part)}</span>`)
    .join(' · ');

function aboutSection() {
  const prose = startsWithAbbreviation(about.paragraphs[0]) ? 'prose' : 'prose dropcap';
  return `<section class="section" id="about" aria-labelledby="about-title">
  <div class="wrap section__grid">
    ${label(about.label)}
    <div class="about">
      <div class="about__aside">
        <h2 class="h2 h2--compact" id="about-title">${headingLines(about.title)}</h2>
        <figure class="photo about__figure">
          ${picture(images.about, { sizes: '(min-width: 1280px) 440px, (min-width: 960px) 36vw, (min-width: 520px) 460px, 100vw' })}
          <figcaption>${t(images.about.caption)}</figcaption>
        </figure>
      </div>
      <div class="about__text">
        <div class="${prose}">
          ${about.paragraphs.map((p) => `<p>${t(p)}</p>`).join('\n          ')}
        </div>
        <div class="record">
          <h3 class="label record__title">${esc(about.recordTitle)}</h3>
          <dl>
            ${about.record
              .map((r) => `<div${r.small ? ' class="is-small"' : ''}><dt>${esc(r.term)}</dt><dd>${r.detail.includes(' · ') ? keepParts(r.detail) : t(r.detail)}</dd></div>`)
              .join('\n            ')}
          </dl>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

/* --------------------------------------------------------------- services */
function servicesSection() {
  const group = (g, i) => `<div class="svc-group">
          <h3 class="label svc-group__title" id="svc-group-${i + 1}">${esc(g.title)}</h3>
          <ul class="svc-list" aria-labelledby="svc-group-${i + 1}">
            ${g.items
              .map((item) => `<li><h4 class="svc__name">${t(item.name)}</h4><p class="svc__text">${t(item.text)}</p></li>`)
              .join('\n            ')}
          </ul>
        </div>`;
  return `<section class="section section--tint" id="services" aria-labelledby="services-title">
  <div class="wrap section__grid">
    ${label(services.label)}
    <div>
      <div class="section__head section__head--split">
        <h2 class="h2" id="services-title">${headingLines(services.title)}</h2>
        <p class="section__intro">${t(services.intro)}</p>
      </div>
      <div class="services">
        ${services.groups.map(group).join('\n        ')}
      </div>
    </div>
  </div>
</section>`;
}

/* --------------------------------------------------------------- approach */
function approachSection() {
  return `<section class="section section--navy on-navy" id="approach" aria-labelledby="approach-title">
  <div class="wrap section__grid">
    ${label(approach.label)}
    <div class="approach">
      <div class="approach__intro">
        <h2 class="h2 h2--compact" id="approach-title">${headingLines(approach.title)}</h2>
        <p class="lede">${t(approach.intro)}</p>
      </div>
      <ol class="principles">
        ${approach.principles.map((p) => `<li><h3>${t(p.name)}</h3><p>${t(p.text)}</p></li>`).join('\n        ')}
      </ol>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------- leadership */
function leadershipSection() {
  const roles = (r) => `<li><p class="role">${t(r.role)}</p><p class="org">${t(r.org)}</p></li>`;
  const talk = (x) => `<li>
            <p class="talk__date">${t(x.date)}</p>
            <p class="talk__title">${t(x.title)}</p>
            <p class="talk__text">${t(x.text)}</p>${x.link ? `\n            <p class="talk__link">${extLink(x.link.href, x.link.label)}</p>` : ''}
          </li>`;
  return `<section class="section" id="leadership" aria-labelledby="leadership-title">
  <div class="wrap section__grid">
    ${label(leadership.label)}
    <div>
      <div class="section__head section__head--split">
        <h2 class="h2" id="leadership-title">${headingLines(leadership.title)}</h2>
        <p class="section__intro">${t(leadership.intro)}</p>
      </div>
      <div class="leadership">
        <div>
          <h3 class="sr-only">Roles by year</h3>
          <ol class="ledger" reversed>
            ${leadership.years
              .map(
                (y) => `<li>
              <p class="ledger__year">${y.year}</p>
              <ul class="ledger__roles">
                ${y.roles.map(roles).join('\n                ')}
              </ul>
            </li>`,
              )
              .join('\n            ')}
          </ol>
          <div class="earlier">
            <h3 class="label">${esc(leadership.earlierTitle)}</h3>
            <ul>
              ${leadership.earlier.map((e) => `<li>${t(e.text)}</li>`).join('\n              ')}
            </ul>
            <p class="membership">${t(leadership.membership.text)} <span class="num">· No.&nbsp;${esc(leadership.membership.detail)}</span></p>
          </div>
        </div>
        <section class="teaching" aria-labelledby="teaching-title">
          <h3 class="h3" id="teaching-title">${esc(leadership.teachingTitle)}</h3>
          <ol class="talks">
          ${leadership.teaching.map(talk).join('\n          ')}
          </ol>
        </section>
      </div>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------ recognition */
function recognitionSection() {
  const text = t(recognition.text).replace('F/2023/P-48', '<span class="citation__entry">F/2023/P-48</span>');
  return `<section class="section section--rule" id="recognition" aria-labelledby="recognition-title">
  <div class="wrap section__grid">
    ${label(recognition.label)}
    <div>
      <div class="section__head">
        <h2 class="h2" id="recognition-title">${headingLines(recognition.title)}</h2>
      </div>
      <div class="recognition">
        <figure class="photo">
          ${picture(images.fellowship, { sizes: '(min-width: 1280px) 400px, (min-width: 900px) 32vw, 420px' })}
          <figcaption>${t(images.fellowship.caption)}</figcaption>
        </figure>
        <div class="citation">
          <p class="citation__kicker">${esc(recognition.kicker)}</p>
          <p class="citation__title">${t(recognition.award)}</p>
          <p class="citation__mark"><span class="citation__short">${recognition.short}</span><span class="citation__dot" aria-hidden="true">·</span><span class="citation__year">${recognition.year}</span></p>
          <p class="citation__text">${text}</p>
          <p class="citation__link">${extLink(recognition.link.href, recognition.link.label)}</p>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

/* -------------------------------------------------------------- community */
function communitySection() {
  const s = community.school;
  const r = community.road;
  return `<section class="section section--tint" id="community" aria-labelledby="community-title">
  <div class="wrap section__grid">
    ${label(community.label)}
    <div>
      <div class="section__head">
        <h2 class="h2" id="community-title">${headingLines(community.title)}</h2>
      </div>
      <div class="school">
        <div>
          <h3 class="h3">${t(s.title)}</h3>
          <div class="prose">
            ${s.paragraphs.map((p) => `<p>${t(p)}</p>`).join('\n            ')}
          </div>
          <p class="school__link">${extLink(s.link.href, s.link.label, { lang: s.link.lang })}</p>
        </div>
        <div class="focus">
          <h4 class="label focus__title">${t(s.focusTitle)}</h4>
          <ul>
            ${s.focus.map((f) => `<li>${t(f)}</li>`).join('\n            ')}
          </ul>
        </div>
      </div>
      <div class="road-wrap">
        <h3 class="h3">${t(r.title)}</h3>
        <p class="road__intro">${t(r.intro)}</p>
        <ol class="road">
          ${r.milestones
            .map(
              (m) => `<li>
            <span class="road__year">${m.year}</span>
            <span class="road__dot" aria-hidden="true"></span>
            <h4 class="road__title">${t(m.title)}</h4>
            <p class="road__text">${t(m.text)}</p>
          </li>`,
            )
            .join('\n          ')}
        </ol>
      </div>
    </div>
  </div>
</section>`;
}

/* ---------------------------------------------------- gallery & coverage */
function zoomFigure(img, sizes) {
  return `<figure class="photo" style="--ar:${(img.width / img.height).toFixed(4)}">
          <a class="zoom" href="${largestSrc(img)}" data-caption="${esc(img.caption)}">
            ${picture(img, { sizes })}
            <span class="sr-only">View larger</span>
          </a>
          <figcaption>${t(img.caption)}</figcaption>
        </figure>`;
}

/* `sizes` for a justified row: each photo's share of the row width. */
function rowSizes(list, rowPx, gapsPx) {
  const total = list.reduce((sum, g) => sum + g.width / g.height, 0);
  return (img) => {
    const share = img.width / img.height / total;
    return `(min-width: 1280px) ${Math.round((rowPx - gapsPx) * share)}px, (min-width: 761px) ${Math.round(100 * share)}vw, 100vw`;
  };
}

function pressItem(item) {
  return `<li><a href="${esc(item.href)}" target="_blank" rel="noopener noreferrer">
            <span class="press__pub">${esc(item.publisher)}<span class="press__date">${t(item.date)}</span></span>
            <span class="press__topic">${t(item.topic)}${item.lang ? ` <span class="press__lang">(${esc(item.lang)})</span>` : ''}<span class="sr-only"> (opens in a new tab)</span></span>
            ${icons.arrowUp}
          </a></li>`;
}

function gallerySection() {
  const shown = coverage.items.slice(0, coverage.visible);
  const rest = coverage.items.slice(coverage.visible);
  const sizesFor = rowSizes(images.gallery, 1200, 36);
  return `<section class="section section--gallery" id="gallery" aria-labelledby="gallery-title">
  <div class="wrap section__grid">
    ${label(gallery.label)}
    <div>
      <div class="section__head">
        <h2 class="h2" id="gallery-title">${headingLines(gallery.title)}</h2>
      </div>
      <div class="photo-row photo-row--bleed">
        ${images.gallery.map((img) => zoomFigure(img, sizesFor(img))).join('\n        ')}
      </div>

      <div class="coverage" id="coverage">
        <h3 class="h3 coverage__title">${esc(coverage.title)}</h3>
        <ul class="press">
          ${shown.map(pressItem).join('\n          ')}
        </ul>${
          rest.length
            ? `
        <details class="more">
          <summary>${icons.chev}<span>${rest.length} earlier report${rest.length > 1 ? 's' : ''}</span></summary>
          <ul class="press">
          ${rest.map(pressItem).join('\n          ')}
          </ul>
        </details>`
            : ''
        }
      </div>
    </div>
  </div>
</section>`;
}

/* --------------------------------------------------------------- hospital */
function hospitalSection() {
  return `<section class="section section--tint" id="hospital" aria-labelledby="hospital-title">
  <div class="wrap section__grid">
    ${label(hospital.label)}
    <div class="hospital">
      <div>
        <h2 class="h2" id="hospital-title">${headingLines(hospital.title)}</h2>
        <div class="prose">
          ${hospital.paragraphs.map((p) => `<p>${t(p)}</p>`).join('\n          ')}
        </div>
        <p class="hospital__link">${extLink(contact.website.href, hospital.link)}</p>
      </div>
      <div class="hospital__photos">
        ${images.hospital.map((img) => zoomFigure(img, '(min-width: 1280px) 530px, (min-width: 960px) 44vw, 100vw')).join('\n        ')}
      </div>
    </div>
  </div>
</section>`;
}

/* ---------------------------------------------------------------- contact */
function contactSectionMarkup() {
  const primary = contact.phones.find((p) => p.primary);
  return `<section class="section section--navy on-navy contact" id="contact" aria-labelledby="contact-title">
  <div class="wrap section__grid">
    ${label(contactSection.label)}
    <div>
      <h2 class="h2" id="contact-title">${headingLines(contactSection.title)}</h2>
      <p class="lede contact__lede">${t(contactSection.intro)}</p>
      <div class="contact__grid">
        <div class="contact__card">
          <p class="label">WhatsApp</p>
          ${bookingLink(esc(booking.display), 'phone-big')}
          <div class="contact__actions">
            ${bookingLink(`${icons.whatsapp}Book on WhatsApp`, 'btn btn--gold', { saysWhatsApp: true })}
            <a class="btn btn--line" href="tel:${primary.tel}">${icons.phone}Call the hospital</a>
          </div>
          <div class="lines">
            <p class="label">Hospital telephone</p>
            <ul>
              ${contact.phones.map((p) => `<li><a href="tel:${p.tel}">${esc(p.display)}</a></li>`).join('\n              ')}
            </ul>
          </div>
        </div>
        <dl class="contact-list contact__card">
          <div>
            <dt class="label">Address</dt>
            <dd><address>${contact.addressLines.map(esc).join('<br>')}</address></dd>
            <dd>${extLink(contact.mapsUrl, 'Get directions')}</dd>
          </div>
          <div>
            <dt class="label">Email</dt>
            ${contact.emails.map((e) => `<dd><a class="plain" href="mailto:${e}">${esc(e)}</a></dd>`).join('\n            ')}
          </div>
          <div>
            <dt class="label">Antara Hospital online</dt>
            <dd class="online">
              ${extLink(contact.website.href, contact.website.label)}
              <ul class="social">
                ${contact.social
                  .map((s) => `<li><a href="${esc(s.href)}" target="_blank" rel="noopener noreferrer" aria-label="Antara Hospital on ${esc(s.label)} (opens in a new tab)">${icons[s.icon]}</a></li>`)
                  .join('\n                ')}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------- page */
export function renderHome({ origin, year, assetVersion }) {
  return `<!doctype html>
<html lang="${site.lang}">
${head({ page: 'home', title: site.home.title, description: site.home.description, origin, path: '', assetVersion })}
<body>
<a class="skip-link" href="#main">Skip to content</a>
${siteHeader()}
<main id="main" tabindex="-1">
${heroSection()}
${aboutSection()}
${servicesSection()}
${approachSection()}
${leadershipSection()}
${recognitionSection()}
${communitySection()}
${gallerySection()}
${hospitalSection()}
${contactSectionMarkup()}
</main>
${siteFooter({ year })}
<dialog class="lightbox" aria-labelledby="lightbox-caption">
  <figure><img alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"><figcaption id="lightbox-caption"></figcaption></figure>
  <button class="lightbox__close" type="button">${icons.close}<span class="sr-only">Close photograph</span></button>
</dialog>
</body>
</html>
`;
}
