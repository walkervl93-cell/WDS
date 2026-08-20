// Mobile nav toggle + sitewide scroll-reveal animations.
//
// Reveal system: any h1/h2 in the main content area gets tagged
// .reveal-heading (dissolves in sliding down from above), and so does
// its preceding .eyebrow sibling if there is one. Its immediately-
// following <p> sibling gets .reveal-body (dissolves in place,
// starting 0.5s later via CSS transition-delay — see css/styles.css).
// All auto-detected, no per-page markup needed. When the heading
// scrolls into view, its eyebrow + body paragraph reveal alongside it.
//
// .badge-row and [data-animate]/.reveal-up elements (the "Our Process"
// step numbers, the About history photo, etc.) reveal independently on
// their own intersection.

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', String(expanded));
    });
  }

  const headingUnits = [];
  document.querySelectorAll('main h1, main h2, section h1, section h2').forEach((heading) => {
    if (heading.closest('header, footer, nav')) return;
    heading.classList.add('reveal-heading');

    const eyebrow = heading.previousElementSibling;
    if (eyebrow && eyebrow.classList.contains('eyebrow')) {
      eyebrow.classList.add('reveal-heading');
    }
    const body = heading.nextElementSibling;
    if (body && body.tagName === 'P') {
      body.classList.add('reveal-body');
    }
    headingUnits.push({ heading, eyebrow, body });
  });

  const staggerTargets = document.querySelectorAll('[data-animate], .badge-row, .reveal-up');

  if ('IntersectionObserver' in window) {
    const revealUnit = (el) => el && el.classList.add('is-visible');

    const headingIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const unit = headingUnits.find((u) => u.heading === entry.target);
        revealUnit(entry.target);
        if (unit) {
          if (unit.eyebrow && unit.eyebrow.classList.contains('eyebrow')) revealUnit(unit.eyebrow);
          if (unit.body && unit.body.tagName === 'P') revealUnit(unit.body);
        }
        headingIo.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    headingUnits.forEach((u) => headingIo.observe(u.heading));

    const staggerIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          staggerIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    staggerTargets.forEach((el) => staggerIo.observe(el));
  } else {
    // No IntersectionObserver support — just show everything.
    headingUnits.forEach((u) => {
      u.heading.classList.add('is-visible');
      if (u.eyebrow) u.eyebrow.classList.add('is-visible');
      if (u.body) u.body.classList.add('is-visible');
    });
    staggerTargets.forEach((el) => el.classList.add('is-visible'));
  }
});
