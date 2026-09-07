# Om Shakti Catering Services — Website

The full marketing site for Om Shakti Catering Services, plus a mobile-number-gated
"unlock your offer" scratch-card promo page at `/offers/`.

## Pages
- **`index.html`** (home) — About, services, menu highlights, gallery, testimonials,
  service areas, FAQ, and an enquiry form. Nav includes a link to **Offers**.
- **`offers/index.html`** — Guest enters a 10-digit mobile number → **Reveal My Offer**.
  The number is saved to a Google Sheet; the backend returns a unique, non-repeating
  coupon code and a random offer. Guest scratches the card to reveal it, with
  **Call to Book** and **Chat on WhatsApp** buttons. **No OTP step.**

## Files
| Path | Purpose |
|------|---------|
| `index.html` | The homepage. |
| `css/styles.css` | Homepage styles. |
| `js/main.js` | Homepage interactivity (tabs, lightbox, slider, counters, nav, enquiry form). |
| `offers/index.html` | The offer/scratch-card page — self-contained (HTML/CSS/JS), no build step. |
| `assets/` | Shared images: logo, favicon, OG cover, hero photo. |
| `google-apps-script.gs` | Reference copy of the Google Apps Script backend (already deployed; see below). |
| `SETUP.md` | Full setup / deployment notes for the offer page's backend. |
| `robots.txt`, `sitemap.xml`, `llms.txt` | Search engine / AI crawler discovery files. |

## Hosting the site
Upload the whole repo to any static host (GitHub Pages, Netlify, Vercel, Firebase
Hosting, or any web server). No build step.

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
3. If the domain shows registry status `clientHold` (new registration), complete
   GoDaddy's verification/activation so it resolves. DNS can take up to a few hours to
   propagate; HTTPS provisioning follows.

## Backend (Google Sheet)
Both the homepage's **enquiry form** and the **offers page's** phone + coupon flow
post to the same Google Apps Script Web App, which routes by request `type` into
separate sheet tabs (`Leads` vs. the offers tab). That script is **already
deployed** — both pages post to its `/exec` URL (`LEAD_SCRIPT_URL` in `js/main.js`,
`SCRIPT_URL` in `offers/index.html`). You do **not** need to redeploy it to run the site.

`google-apps-script.gs` is kept here only as a reference/backup. To change the
backend (offers, sheet columns, coupon format, lead fields), edit it in the sheet's
**Extensions → Apps Script** editor and redeploy. See `SETUP.md`.

Coupon uniqueness (offers page) is guaranteed server-side: before saving, the script
checks every existing coupon and regenerates until it finds an unused one, with a
script lock to prevent collisions across concurrent submissions.
