/**
 * Google Apps Script Backend – speichert Stimmen in einem Google Sheet
 * Anleitung siehe README.md
 */

// === KONFIGURATION ===
const SHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'votes';

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return _json({ ok:false, message:'No data' }, 400);
    }

    const body = JSON.parse(e.postData.contents);
    const { name, email, phone, choice, ua } = body || {};

    if (!name || !email || !choice) {
      return _json({ ok:false, message:'Missing fields' }, 400);
    }

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Kopfzeile sicherstellen
    if (sh.getLastRow() === 0) {
      sh.appendRow(['timestamp','name','email','phone','choice','userAgent']);
    }

    // Duplikat verhindern: gleiche Email ODER gleiche Telefonnummer
    const range = sh.getDataRange().getValues();
    const emailCol = 3; // 1‑basiert
    const phoneCol = 4;

    const dupe = range.some((row, idx) => idx>0 && (
      (email && row[emailCol-1] && row[emailCol-1].toString().toLowerCase() === email.toLowerCase()) ||
      (phone && row[phoneCol-1] && row[phoneCol-1].toString().replace(/\s+/g,'') === (phone||'').replace(/\s+/g,''))
    ));

    if (dupe) {
      return _json({ ok:false, message:'Duplicate' }, 409);
    }

    // Speichern
    sh.appendRow([
      new Date(),
      body.name,
      email.toLowerCase(),
      (phone||''),
      body.choice,
      ua || ''
    ]);

    return _json({ ok:true }, 200);
  } catch (err) {
    return _json({ ok:false, message: err && err.message ? err.message : 'Server error' }, 500);
  }
}

function doGet() {
  return _json({ ok:true, status:'alive' }, 200);
}

function _json(obj, status) {
  const output = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  return output.setStatusCode ? output.setStatusCode(status) : output;
}
