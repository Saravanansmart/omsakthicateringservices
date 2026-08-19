# OM Shakthi Catering — Landing Page

A faithful rebuild of the Lovable design **with the OTP step removed**. The guest
enters their mobile number → the number is saved to your Google Sheet with a
**unique, non-repeating coupon code** → they land straight on the scratch-card
offer reveal.

## Files
- `index.html` — the landing page (self-contained; open it directly or host it).
- `assets/catering-hero.jpg` — the hero image.
- `google-apps-script.gs` — the code that writes to your sheet and mints coupons.

## Flow (OTP removed)
1. **Enter mobile number** → validates a 10-digit Indian mobile.
2. On submit → the number is POSTed to your sheet; the server returns a
   **unique** coupon + a random offer.
3. **Scratch-card reveal** → guest scratches to reveal the offer + coupon code,
   with a **Call to Book** button.

## Connect the Google Sheet (≈3 minutes)

Your sheet: https://docs.google.com/spreadsheets/d/1xdVs5W_FNuNtFrk2qO-RaPcHrZg499usTzoilIWFWVk/edit

1. Open the sheet → **Extensions → Apps Script**.
2. Delete any sample code, paste the entire contents of `google-apps-script.gs`, and **Save**.
3. Click **Deploy → New deployment**.
   - Gear icon → **Web app**.
   - **Execute as:** *Me*
   - **Who has access:** *Anyone*
   - **Deploy**, then authorize when prompted (approve your own account).
4. Copy the **Web app URL** (it ends in `/exec`).
5. Open `index.html`, find this line near the bottom, and paste your URL:
   ```js
   const SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
6. (Optional) Set your real booking number:
   ```js
   const BOOKING_PHONE = "+919876543210";
   ```

The sheet fills in these columns automatically:

| Timestamp | Phone Number | Coupon Code | Offer | Offer Note |
|-----------|--------------|-------------|-------|------------|

### How coupon uniqueness is guaranteed
The coupon is generated **in Apps Script**, not in the browser. Before saving, the
script reads every existing coupon in the sheet and keeps generating until it finds
one that has never been used (`OMS` + last 4 digits + a numeric suffix, widening if
needed). A script lock serializes concurrent submissions so two guests can never get
the same code. → **No repeated codes, ever.**

## Preview locally
```bash
cd /Users/vakilsearch/Downloads/Personal_Web/om_catering
python3 -m http.server 8777
```
Open http://localhost:8777 . Until `SCRIPT_URL` is set, the page runs in **preview
mode**: the full flow works but nothing is saved to the sheet (a console note
confirms this).

## Deploy the page
Host the folder on any static host (Netlify, Vercel, GitHub Pages, Firebase Hosting,
or your own web server). Just upload `index.html` + the `assets/` folder. No build step.
