/**
 * Google Apps Script Backend – Name-only Voting (mobile-optimiert)
 */
const SHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'votes';

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return _json({ ok:false, message:'No data' }, 400);
    }
    const body = JSON.parse(e.postData.contents);
    const { name, choice, device_id, ua, tz, lang } = body || {};
    if (!name || !choice || !device_id) {
      return _json({ ok:false, message:'Missing fields' }, 400);
    }

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(['timestamp','name','choice','device_id','userAgent','timezone','lang']);
    }

    const values = sh.getRange(1,1,sh.getLastRow(),sh.getLastColumn()).getValues();
    const header = values.shift();
    const deviceIdx = header.indexOf('device_id');
    const duplicate = values.some(r => r[deviceIdx] && r[deviceIdx].toString() === device_id);
    if (duplicate) {
      return _json({ ok:false, message:'Duplicate device' }, 409);
    }

    sh.appendRow([new Date(), name, choice, device_id, ua || '', tz || '', lang || '']);
    return _json({ ok:true }, 200);
  } catch (err) {
    return _json({ ok:false, message: err && err.message ? err.message : 'Server error' }, 500);
  }
}

function doGet() { return _json({ ok:true, status:'alive' }, 200); }
function _json(obj, status) {
  const output = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  return output.setStatusCode ? output.setStatusCode(status) : output;
}
