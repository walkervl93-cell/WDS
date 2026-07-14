# Connecting the Job Application Tool to Google Sheets

`careers/apply.html` is the applicant questionnaire + admin dashboard. It
needs a live Google Apps Script Web App to save and read applications —
without this connected, submissions only get stashed in the browser's
local storage (see the "Unsynced" warning it shows in that case).

## 1. Create the Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new,
   blank spreadsheet. Name it something like **WDS Job Applications**.
2. Leave it empty — the script creates its own "Applications" tab and
   header row automatically the first time it runs.

## 2. Add the script

1. In that Sheet, go to **Extensions → Apps Script**.
2. Delete whatever's in the default `Code.gs` editor.
3. Copy the entire contents of `careers/apps-script.gs` (in this repo) and
   paste it in.
4. Click the save icon (or `Cmd/Ctrl+S`).

## 3. Deploy as a Web App

1. Top-right, click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → choose **Web app**.
3. Settings:
   - **Execute as:** Me (your Google account)
   - **Who has access:** Anyone
   - (This has to be "Anyone" for the static site to call it from a
     browser with no login — see the security note below.)
4. Click **Deploy**. Google will ask you to authorize the script the first
   time — approve it (it's your own script, acting only on this Sheet).
5. Copy the **Web app URL** it gives you — it looks like
   `https://script.google.com/macros/s/AKfycb.../exec`.

## 4. Wire it into apply.html

1. Open `careers/apply.html` in this repo.
2. Find this line near the top of the `<script>` block:
   ```js
   const SHEETS_WEBAPP_URL = "";
   ```
3. Paste your Web app URL between the quotes.
4. Save, commit, push.

That's it — new submissions will append rows to the "Applications" tab,
and the admin dashboard (behind the `wdstrades26` passcode, changeable in
the same file) will read from it.

## Security note — please read

`SHEETS_SHARED_KEY` (in `apply.html`) and `SHARED_KEY` (in
`apps-script.gs`) must match — they're a shared-secret check the script
uses to reject requests that don't include the right key. **This is not
real security.** Because this is a static site with no server of its own,
that key is sitting in plain text in the page source — anyone who opens
dev tools can read it and hit your Apps Script URL directly, bypassing
the admin passcode entirely, and pull every applicant's name/phone/email/
answers.

In practice this means: don't treat this as a vault. It's fine for
low-stakes internal hiring data where the main goal is "don't index it on
Google, don't let it be casually stumbled into" — which is what the key
buys you. If you want real protection (e.g. because state law treats
applicant PII more strictly, or the volume/sensitivity grows), the
right fix later is a proper server-side auth layer — happy to build that
when you're ready.

## Changing the passcode / key

- Admin dashboard passcode: `ADMIN_PASSCODE` in `careers/apply.html`
- Shared key: `SHEETS_SHARED_KEY` in `careers/apply.html` **and**
  `SHARED_KEY` in `careers/apps-script.gs` — change both together, then
  redeploy the Apps Script (Deploy → Manage deployments → edit → new
  version) for the change to take effect.
