/**
 * OM Shakthi Catering — lead capture + unique coupon generator.
 *
 * Receives a mobile number from the landing page, generates a coupon code
 * that is GUARANTEED unique across the sheet (no repeats), picks a random
 * offer, appends [Timestamp, Phone, Coupon, Offer, Note] to the sheet, and
 * returns { ok, coupon, offerTitle, offerNote } to the page.
 *
 * SETUP: see SETUP.md. In short —
 *   1. Open your Google Sheet → Extensions → Apps Script.
 *   2. Delete the sample code, paste this file, Save.
 *   3. Deploy → New deployment → Web app →
 *        Execute as: Me   |   Who has access: Anyone
 *   4. Copy the /exec Web app URL into SCRIPT_URL in index.html.
 */

// Sheet tab (gid=0 is the first/default tab). Change if you use another tab.
var SHEET_NAME = '';           // '' = use the first sheet tab
var COUPON_PREFIX = 'OMS';

var OFFERS = [
  { title: 'FREE WELCOME DRINK', note: 'for your whole event' },
  { title: '₹2,000 OFF',         note: 'on orders above ₹2 lakhs' },
  { title: '₹5,000 OFF',         note: 'on orders above ₹4 lakhs' },
  { title: '₹10,000 OFF',        note: 'on orders above ₹8 lakhs' }
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // serialize so two guests can't get the same code
  try {
    var phone = '';
    try { phone = String((JSON.parse(e.postData.contents) || {}).phone || ''); }
    catch (err) { phone = String((e.parameter && e.parameter.phone) || ''); }
    phone = phone.replace(/\D/g, '');

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return json({ ok: false, error: 'invalid_phone' });
    }

    var sheet = getSheet_();
    ensureHeader_(sheet);

    var coupon = uniqueCoupon_(sheet, phone);
    var offer  = OFFERS[Math.floor(Math.random() * OFFERS.length)];

    sheet.appendRow([new Date(), "'" + phone, coupon, offer.title, offer.note]);

    return json({ ok: true, coupon: coupon, offerTitle: offer.title, offerNote: offer.note });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Health check when the URL is opened in a browser.
function doGet() {
  return json({ ok: true, service: 'OM Shakthi lead capture' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Phone Number', 'Coupon Code', 'Offer', 'Offer Note']);
    sheet.getRange('A1:E1').setFontWeight('bold');
  }
}

/** Build a coupon that does not already exist in column C. */
function uniqueCoupon_(sheet, phone) {
  var used = {};
  var last = sheet.getLastRow();
  if (last > 1) {
    var codes = sheet.getRange(2, 3, last - 1, 1).getValues();
    for (var i = 0; i < codes.length; i++) used[String(codes[i][0])] = true;
  }
  var last4 = phone.slice(-4);
  // Try 2-digit suffixes first (keeps the short OMSxxxxNN look), then widen.
  for (var len = 2; len <= 5; len++) {
    var lo = Math.pow(10, len - 1), hi = Math.pow(10, len);
    for (var t = 0; t < 200; t++) {
      var code = COUPON_PREFIX + last4 + Math.floor(lo + Math.random() * (hi - lo));
      if (!used[code]) return code;
    }
  }
  // Extremely unlikely fallback: timestamp-based, still unique.
  return COUPON_PREFIX + last4 + String(new Date().getTime()).slice(-6);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
