/**
 * Google Apps Script Web App — backend for careers/apply.html.
 *
 * Bind this to the Google Sheet you want applications saved into
 * (Extensions > Apps Script from within the Sheet), paste this whole file
 * in as Code.gs, then deploy per GOOGLE_SHEETS_SETUP.md.
 *
 * SHARED_KEY must match SHEETS_SHARED_KEY in careers/apply.html exactly.
 * This is a shared-secret check, not real auth — anyone who reads the
 * client-side source can see the key. It stops casual/automated hits on
 * the URL, nothing more. See the setup doc for the full caveat.
 */

const SHARED_KEY = "wds-field-apps-2026";
const SHEET_NAME = "Applications";

const COLUMNS = [
  "submittedAt", "position", "positionLabel", "name", "phone", "email",
  "score", "tier", "tierLabel", "flags", "answersJson"
];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
  }
  return sheet;
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.key !== SHARED_KEY) {
      return jsonOut_({ ok: false, error: "bad key" });
    }
    if (body.action !== "save" || !body.record) {
      return jsonOut_({ ok: false, error: "bad request" });
    }
    const r = body.record;
    const sheet = getSheet_();
    sheet.appendRow([
      r.submittedAt, r.position, r.positionLabel, r.name, r.phone, r.email,
      r.score, r.tier, r.tierLabel,
      (r.flags || []).join(" | "),
      JSON.stringify(r.answers || {})
    ]);
    return jsonOut_({ ok: true });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    if (e.parameter.key !== SHARED_KEY) {
      return jsonOut_({ ok: false, error: "bad key" });
    }
    if (e.parameter.action !== "list") {
      return jsonOut_({ ok: false, error: "bad request" });
    }
    const sheet = getSheet_();
    const values = sheet.getDataRange().getValues();
    const rows = values.slice(1); // drop header row
    const records = rows.map(row => {
      const obj = {};
      COLUMNS.forEach((col, i) => { obj[col] = row[i]; });
      let answers = {};
      try { answers = JSON.parse(obj.answersJson || "{}"); } catch (err) {}
      return {
        submittedAt: obj.submittedAt,
        position: obj.position,
        positionLabel: obj.positionLabel,
        name: obj.name,
        phone: obj.phone,
        email: obj.email,
        score: Number(obj.score),
        tier: obj.tier,
        tierLabel: obj.tierLabel,
        flags: obj.flags ? String(obj.flags).split(" | ") : [],
        answers
      };
    });
    return jsonOut_({ ok: true, records });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}
