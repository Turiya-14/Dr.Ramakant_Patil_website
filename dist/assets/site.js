/*
 * Dr. Ramakant Patil — small progressive enhancements.
 * The pages are complete without this file: content, links and navigation all
 * work with JavaScript disabled. Nothing here stores data, sets cookies or
 * contacts another server.
 */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- header */
  var header = doc.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------ mobile menu */
  var toggle = doc.querySelector('.nav-toggle');
  var menu = doc.getElementById('site-menu');

  function setMenu(open, returnFocus) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Menu';
    menu.classList.toggle('is-open', open);
    if (!open && returnFocus) toggle.focus();
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      setMenu(open, false);
      if (open) {
        var first = menu.querySelector('a');
        if (first) first.focus();
      }
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false, false);
    });

    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false, true);
      }
    });

    doc.addEventListener('click', function (event) {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (!header.contains(event.target)) setMenu(false, false);
    });

    // Close the drawer if the window grows into the desktop layout.
    var desktop = window.matchMedia('(min-width: 881px)');
    var onChange = function (e) { if (e.matches) setMenu(false, false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* -------------------------------------------- current section in the nav */
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll('.nav-links a[href^="#"]'));
  if ('IntersectionObserver' in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (link) { byId[link.getAttribute('href').slice(1)] = link; });
    var sections = Object.keys(byId)
      .map(function (id) { return doc.getElementById(id); })
      .filter(Boolean);
    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
      var current = null;
      sections.forEach(function (section) { if (visible[section.id] && !current) current = section.id; });
      navLinks.forEach(function (link) {
        var on = link === byId[current];
        link.classList.toggle('is-current', on);
        if (on) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ------------------------------------------------------- the long road */
  var road = doc.querySelector('.road');
  if (road) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      road.classList.add('is-visible');
    } else {
      var roadObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            road.classList.add('is-visible');
            roadObserver.disconnect();
          }
        });
      }, { threshold: 0.35 });
      roadObserver.observe(road);
    }
  }

  /* ------------------------------------------------------------- lightbox */
  var dialog = doc.querySelector('.lightbox');
  var zoomLinks = doc.querySelectorAll('a.zoom');
  if (dialog && typeof dialog.showModal === 'function' && zoomLinks.length) {
    var big = dialog.querySelector('img');
    var caption = dialog.querySelector('figcaption');
    var closeBtn = dialog.querySelector('.lightbox__close');
    var opener = null;

    Array.prototype.forEach.call(zoomLinks, function (link) {
      link.addEventListener('click', function (event) {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) return;
        event.preventDefault();
        var img = link.querySelector('img');
        opener = link;
        // The offline preview embeds each photo once and reuses it here.
        big.src = link.dataset.inline ? (img.currentSrc || img.src) : link.getAttribute('href');
        big.alt = img.alt;
        caption.textContent = link.dataset.caption || '';
        dialog.showModal();
        closeBtn.focus();
      });
    });

    closeBtn.addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close(); // backdrop click
    });
    dialog.addEventListener('close', function () {
      big.removeAttribute('src');
      if (opener) opener.focus();
    });
  }
})();
