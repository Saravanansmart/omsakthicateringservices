# OM Shakthi Catering Services — Offer Landing Page

A single-page landing site where a guest enters their mobile number and instantly
reveals a scratch-card catering offer. The mobile number and a **unique,
non-repeating coupon code** are saved to a Google Sheet. **No OTP step.**

## Live flow
1. Guest enters a 10-digit mobile number → **Reveal My Offer**.
2. The number is saved to the Google Sheet; the backend returns a unique coupon
   and a random offer.
3. Guest scratches the card to reveal the offer + coupon, with a **Call to Book** button.

## Files
| File | Purpose |
|------|---------|
| `index.html` | The landing page — self-contained (HTML/CSS/JS), no build step. |
| `assets/catering-hero.jpg` | Hero image. |
| `google-apps-script.gs` | Reference copy of the Google Apps Script backend (already deployed; see below). |
| `SETUP.md` | Full setup / deployment notes. |

## Hosting the page
Upload `index.html` + the `assets/` folder to any static host
(GitHub Pages, Netlify, Vercel, Firebase Hosting, or any web server). No build step.

### GitHub Pages
Repo **Settings → Pages → Build from branch → `main` / root**. The site will be
served at `https://<user>.github.io/omsakthicateringservices/`.

### Custom domain — omsakthicateringservices.in
The repo includes a `CNAME` file so GitHub Pages serves the site on the apex domain.

1. **GitHub:** Settings → Pages → Custom domain → `omsakthicateringservices.in` → Save,
   then tick **Enforce HTTPS** (after the certificate provisions).
2. **GoDaddy DNS** (Domain → DNS → Manage). Remove the default parked `@` A record and
   parked `www` CNAME, then add:

   **Apex `@` — four A records:**
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
   **(optional IPv6) `@` — four AAAA records:**
   ```
   2606:50c0:8000::153
   2606:50c0:8001::153
   2606:50c0:8002::153
   2606:50c0:8003::153
   ```
   **`www` — CNAME →** `saravanansmart.github.io`
3. The domain currently shows registry status `clientHold` (new registration). Complete
   GoDaddy's verification/activation so it resolves. DNS can take up to a few hours to
   propagate; HTTPS provisioning follows.

## Backend (Google Sheet)
The phone + coupon are written to a Google Sheet by a Google Apps Script Web App.
That script is **already deployed** — the page posts to its `/exec` URL (configured
as `SCRIPT_URL` in `index.html`). You do **not** need to redeploy it to run the site.

`google-apps-script.gs` is kept here only as a reference/backup. To change the
backend (offers, sheet columns, coupon format), edit it in the sheet's **Extensions →
Apps Script** editor and redeploy. See `SETUP.md`.

Coupon uniqueness is guaranteed server-side: before saving, the script checks every
existing coupon and regenerates until it finds an unused one, with a script lock to
prevent collisions across concurrent submissions.
