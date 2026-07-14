// Job board — structural placeholder.
//
// Phase 2 replaces the JOBS array below with a fetch() call to the admin
// backend (the portal where an admin logs in and manages postings).
// For now this renders straight from local data so the page layout —
// job cards, empty state — can be reviewed without the backend built yet.

const JOBS = [
  // Example shape once real postings exist:
  // { title: 'Industrial Handyman', location: 'South Chesterfield, VA', type: 'Full-Time', posted: '2026-07-01' }
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
      <a href="mailto:info@wdsinc.net?subject=Application:%20${encodeURIComponent(job.title)}" class="btn btn-primary">Apply</a>
    </div>`).join('')}</div>`;
}

document.addEventListener('DOMContentLoaded', renderJobs);
