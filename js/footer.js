// Single source of truth for the footer markup, injected on every page.
// Keeps the 5 static pages from drifting out of sync until this becomes
// a templated build.

document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('site-footer');
  if (!mount) return;

  // Pages nested under a subfolder (e.g. careers/handyman.html) set
  // window.SITE_ROOT = '../' before including this script so the footer's
  // root-relative links still resolve correctly.
  const root = window.SITE_ROOT || '';

  mount.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <img class="footer-logo" src="${root}assets/images/wds-logo-white.png" alt="WDS Inc"/>
          <p>Our mission is to provide our customers with a single destination for their project needs while being prompt, doing the job right the first time, &amp; standing behind our work.</p>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            <li><a href="${root}services.html">Interior Design &amp; Renovation</a></li>
            <li><a href="${root}services.html">Exterior Design &amp; Renovation</a></li>
            <li><a href="${root}services.html">Janitorial Services</a></li>
            <li><a href="${root}services.html">Industrial Handyman Services</a></li>
            <li><a href="${root}services.html">Lawncare &amp; Irrigation</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact Information</h4>
          <ul>
            <li><a href="https://www.google.com/maps/place/8200+River+Rd,+Petersburg,+VA+23803" target="_blank" rel="noopener">8200 River Road<br/>South Chesterfield, VA 23803</a></li>
            <li><a href="tel:18045902562">(804) 590-2562</a></li>
            <li><a href="mailto:info@wdsinc.net">info@wdsinc.net</a></li>
            <li>8:00am &ndash; 4:00pm, M&ndash;F</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${new Date().getFullYear()} WDS Inc. All rights reserved.</span>
        <a href="#top" class="back-to-top" aria-label="Back to top">&uarr;</a>
      </div>
    </div>
  `;
});
