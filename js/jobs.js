// Job board.
//
// These two postings link straight into the scored application
// questionnaire at careers/apply.html (see that file +
// careers/GOOGLE_SHEETS_SETUP.md for how submissions are stored).
// Once there's an admin UI for managing postings, this static array gets
// replaced with a fetch() against that backend.

const JOBS = [
  { title: 'General Handyman / Maintenance Technician', location: 'West Point, VA', type: 'Full-Time · $21–24/hr', applyHref: 'careers/apply.html?position=handyman' },
  { title: 'Irrigation Technician', location: 'Chesterfield / Tri-Cities, VA', type: 'Full-Time · $21–24/hr', applyHref: 'careers/apply.html?position=irrigation' },
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
    <div class="job-card">
      <div>
        <h3>${job.title}</h3>
        <div class="job-meta">${job.location} &middot; ${job.type}</div>
      </div>
      <a href="${job.applyHref}" class="btn btn-primary">Apply</a>
    </div>`).join('')}</div>`;
}

document.addEventListener('DOMContentLoaded', renderJobs);
