// Job board.
//
// Clicking a listing opens its description page (careers/handyman.html,
// careers/irrigation.html), which has its own Apply buttons leading into
// the scored questionnaire at careers/apply.html (see that file +
// careers/GOOGLE_SHEETS_SETUP.md for how submissions are stored).
// Once there's an admin UI for managing postings, this static array gets
// replaced with a fetch() against that backend.

const JOBS = [
  { title: 'General Handyman / Maintenance Technician', location: 'West Point, VA', type: 'Full-Time · $21–24/hr', detailHref: 'careers/handyman.html' },
  { title: 'Irrigation Technician', location: 'Chesterfield / Tri-Cities, VA', type: 'Full-Time · $21–24/hr', detailHref: 'careers/irrigation.html' },
];

function renderJobs() {
  const mount = document.getElementById('job-list-mount');
  if (!mount) return;

  if (!JOBS.length) {
    mount.innerHTML = `
      <div class="empty-state">
        <strong>No open positions right now</strong>
        <p>Check back soon, or email us your resume below and we'll reach out when a role opens up.</p>
      </div>`;
    return;
  }

  mount.innerHTML = `<div class="job-list">${JOBS.map((job) => `
    <a class="job-card-link" href="${job.detailHref}">
      <div class="job-card">
        <div>
          <h3>${job.title}</h3>
          <div class="job-meta">${job.location} &middot; ${job.type}</div>
        </div>
        <span class="btn btn-outline-dark">View Details</span>
      </div>
    </a>`).join('')}</div>`;
}

document.addEventListener('DOMContentLoaded', renderJobs);
