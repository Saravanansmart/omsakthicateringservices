/**
 * Om Sakthi Catering — unified Google Apps Script backend.
 *
 * Handles TWO kinds of submissions into the SAME spreadsheet but
 * SEPARATE tabs (subsheets):
 *
 *   1. OFFER page (/offers)  ->  first sheet tab  (phone + unique coupon)
 *   2. LEAD / enquiry form   ->  "Leads" tab      (full enquiry details)
 *
 * The request "type" field decides the route:
 *   { "type": "lead", name, phone, email, eventType, eventDate, guests, message }
 *   { "type": "offer", phone }   // or no type -> treated as an offer (back-compat)
 *
 * DEPLOY: Extensions -> Apps Script -> paste -> Save ->
 *   Deploy -> Manage deployments -> edit -> New version -> Deploy
 *   (keeps the same /exec URL).
 */

var LEADS_SHEET   = 'Leads';   // enquiry-form submissions go here
var COUPON_PREFIX = 'OMS';

var OFFERS = [
  { title: 'FREE WELCOME DRINK', note: 'for your whole event' },
  { title: '₹2,000 OFF',         note: 'on orders above ₹2 lakhs' },
  { title: '₹5,000 OFF',         note: 'on orders above ₹4 lakhs' },
  { title: '₹10,000 OFF',        note: 'on orders above ₹8 lakhs' }
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var data = {};
    try { data = JSON.parse(e.postData.contents) || {}; }
    catch (err) { data = (e && e.parameter) || {}; }

    if (String(data.type) === 'lead') return handleLead_(data);
    return handleOffer_(data);
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json({ ok: true, service: 'Om Sakthi Catering backend' });
}

/* ---------------- LEAD / enquiry form ---------------- */
function handleLead_(data) {
  var sheet = getOrCreateSheet_(LEADS_SHEET);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Phone', 'Email', 'Event Type', 'Event Date', 'Guests', 'Message']);
    sheet.getRange('A1:H1').setFontWeight('bold');
  }

  var name  = String(data.name  || '').trim();
  var phone = String(data.phone || '').trim();
  if (!name || !phone) return json({ ok: false, error: 'missing_fields' });

  sheet.appendRow([
    new Date(),
    name,
    "'" + phone,                       // leading quote keeps the number as text
    String(data.email     || ''),
    String(data.eventType || ''),
    String(data.eventDate || ''),
    String(data.guests    || ''),
    String(data.message   || '')
  ]);
  return json({ ok: true });
}

/* ---------------- OFFER page (phone + unique coupon) ---------------- */
function handleOffer_(data) {
  var phone = String(data.phone || '').replace(/\D/g, '');
  if (!/^[6-9]\d{9}$/.test(phone)) return json({ ok: false, error: 'invalid_phone' });

  var sheet = getFirstSheet_();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Phone Number', 'Coupon Code', 'Offer', 'Offer Note']);
    sheet.getRange('A1:E1').setFontWeight('bold');
  }

  var coupon = uniqueCoupon_(sheet, phone);
  var offer  = OFFERS[Math.floor(Math.random() * OFFERS.length)];
  sheet.appendRow([new Date(), "'" + phone, coupon, offer.title, offer.note]);

  return json({ ok: true, coupon: coupon, offerTitle: offer.title, offerNote: offer.note });
}

/* ---------------- helpers ---------------- */
function getFirstSheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}
function getOrCreateSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function uniqueCoupon_(sheet, phone) {
  var used = {};
  var last = sheet.getLastRow();
  if (last > 1) {
    var codes = sheet.getRange(2, 3, last - 1, 1).getValues();
    for (var i = 0; i < codes.length; i++) used[String(codes[i][0])] = true;
  }
  var last4 = phone.slice(-4);
  for (var len = 2; len <= 5; len++) {
    var lo = Math.pow(10, len - 1), hi = Math.pow(10, len);
    for (var t = 0; t < 200; t++) {
      var code = COUPON_PREFIX + last4 + Math.floor(lo + Math.random() * (hi - lo));
      if (!used[code]) return code;
    }
  }
  return COUPON_PREFIX + last4 + String(new Date().getTime()).slice(-6);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
