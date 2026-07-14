# WDS Inc — Website Rebuild

Structural pass for the WDS Inc website redesign. Static HTML/CSS/JS, no build step.

## Site map

- `index.html` — Home
- `services.html` — Services
- `about.html` — Company history, reputation, team, safety/vetting
- `careers.html` — Job board, links into per-role description pages
- `careers/handyman.html`, `careers/irrigation.html` — Full job descriptions, Apply buttons top & bottom
- `careers/apply.html` — Scored application questionnaire + admin dashboard (see `careers/FIREBASE_SETUP.md`)
- `contact.html` — Contact form + info

Header/nav and footer are consistent across all five pages. Footer markup is
injected by `js/footer.js` so it only has to be edited in one place.

## Copy

All page copy is pulled directly from the live wdsinc.net content (hero,
services, company history, reputation, safety/vetting, contact info).

## Photo placement

Five stock/project photos are placed across Home and Services (one use each,
spread out rather than repeated):

- `AdobeStock_293634819` (open-floor construction interior) — Home hero background
- `pexels-pixabay-159045` (paint/material swatches) — Home "Why Choose Us"
- `AdobeStock_100864184` (tile install) — Services: Interior Design & Renovation card
- `AdobeStock_191129045` (janitorial) — Services: Janitorial Services card
- `AdobeStock_103898262` (torch-down roofing) — Services: Industrial Handyman Services card

## Still needed before this is launch-ready

**Real assets** — still placeholder boxes, no matching photo supplied yet:

- Exterior Design & Renovation photo (Services card)
- Lawncare & Irrigation photo (Services card)
- Founder / early-company archive photo (About page)
- Team headshots for the About page (`about.html` team grid — currently "Name TBD")
- Hero video, if preferred over the current static hero photo
- Google Maps embed on the Contact page

**Animated text / motion pass** — `[data-animate]` attributes are already
placed on hero headlines/eyebrows as hook points; `js/main.js` has a basic
IntersectionObserver reveal wired up as a starting point. The actual
animation treatment (word/line reveals, easing, etc.) is the next layout
pass.

**Job board backend** — built. `careers/apply.html` is a scored
application questionnaire (General Handyman, Irrigation Technician)
backed by Firebase: applicants submit to Firestore (no login needed),
and the admin dashboard at `careers/apply.html#admin` is gated behind
Google Sign-In restricted to an email allowlist. See
`careers/FIREBASE_SETUP.md` for the security rules this depends on —
**the rules must be published in the Firebase console before submissions
or admin login will work.** `careers.html` still lists postings from a
static `JOBS` array in `js/jobs.js`; wiring that to a real "add/edit
listings" admin UI (rather than editing the array by hand) is the one
remaining piece of the original job-board request.

**Contact form** — currently a plain `mailto:` form per the original site's
copy ("insert contact form with mailto link"). Fine as a placeholder;
consider a real form backend (e.g. a small serverless endpoint) before launch.
