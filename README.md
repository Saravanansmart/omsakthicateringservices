# Om Sakthi Catering Services

A modern, responsive static marketing website for **Om Sakthi Catering Services** — an authentic South Indian and multi-cuisine catering business based in Chennai, Tamil Nadu.

The site is built with plain **HTML, CSS, and vanilla JavaScript** — no build step, no framework, no dependencies. Just open it in a browser and it runs.

---

## Features

- **Responsive design** — adapts cleanly from mobile phones to widescreen desktops.
- **Hero section** — bold introduction with brand emblem, tagline, and call-to-action buttons.
- **About section** — the story of the catering service, presented with image/gradient tiles.
- **Services** — an overview of catering offerings (weddings, corporate events, house functions, etc.).
- **Tabbed menu** — browse dishes by category (e.g. Breakfast, Lunch, Sweets) via interactive tabs.
- **Gallery with lightbox** — food and event imagery that opens in an overlay when clicked.
- **Testimonials slider** — rotating customer reviews.
- **Animated stat counters** — numbers count up as they scroll into view (events catered, happy clients, etc.).
- **Enquiry form** — a contact/booking form for prospective customers.
- **Smooth scrolling & scroll animations** — polished navigation and reveal effects.

---

## Project Structure

```
catering-service/
├── index.html            # The single-page site (all sections live here)
├── css/
│   └── styles.css        # All styles + brand color custom properties
├── js/
│   └── main.js           # Interactivity: tabs, lightbox, slider, counters, form, nav
├── assets/
│   ├── logo.svg          # Brand logo mark (serving dome + flame emblem)
│   ├── favicon.svg       # Simplified favicon version of the mark
│   └── images/           # Drop real food & event photos here
└── README.md             # This file
```

---

## Running / Previewing Locally

You have two easy options.

### Option 1 — Just open the file

Double-click `index.html`, or drag it into your browser. Because the site is fully static, this works with no server.

### Option 2 — Serve it locally (recommended)

Some browsers restrict certain features when loading over `file://`. Serving over HTTP avoids that. From the project root run:

```bash
python3 -m http.server 8000
```

Then visit **http://localhost:8000** in your browser.

> Any static file server works — for example `npx serve` or the VS Code "Live Server" extension.

---

## Customise

Everything on the site currently uses **placeholder content**. Here is what to replace before going live.

### Business contact details

These are all placeholders in **`index.html`** — search for them and update:

| Detail   | Placeholder value                                             |
|----------|--------------------------------------------------------------|
| Phone    | `+91 90000 00000` (also in `tel:+919000000000` links)        |
| Email    | `hello@omsakthicatering.com` (also in `mailto:` links)       |
| Address  | `123 Temple Road, Central Railway Station, Chennai, Tamil Nadu 600003` |

They appear in the contact section and the footer — update every occurrence.

### Photos (gallery & about tiles)

The gallery and about sections currently use **emoji + CSS gradient tiles** as stand-ins for real photography. To use real images:

1. Add your food/event photos to `assets/images/`.
2. In `index.html`, replace the gradient/emoji tile markup with an `<img src="assets/images/your-photo.jpg" alt="..." />`.
3. Keep the same wrapping element/classes so the layout and lightbox continue to work.

### Brand colors

The brand palette is defined once as **CSS custom properties at the top of `css/styles.css`** (inside the `:root` block). Change them there and the whole site updates:

| Token   | Color     | Hex       |
|---------|-----------|-----------|
| Saffron | amber     | `#E8770E` |
| Maroon  | deep red  | `#7A1E1E` |
| Gold    | warm gold | `#C9A24B` |
| Cream   | background | `#FDF8F0` |

### Enquiry form

The enquiry form is **front-end only** right now — it validates and gives feedback in the browser, but does **not** actually send anything anywhere.

To make it deliver real enquiries, wire it up to a backend or a form service. The quickest route is a hosted service such as [Formspree](https://formspree.io):

1. Create a form on Formspree and copy your endpoint URL.
2. Point the form's `action` at that URL and set `method="POST"` (or POST via `fetch()` in `js/main.js`).
3. Test with a real submission.

Alternatively, connect it to your own backend endpoint, or a service like Netlify Forms, Getform, or Google Apps Script.

---

## SEO & Analytics

The site ships SEO- and analytics-ready:

- **On-page SEO** — descriptive `<title>`/meta description with local keywords (Chennai), `keywords`, `author`, `robots`, **canonical URL**, geo meta, full **Open Graph** + **Twitter Card** tags, and an OG image (`assets/og-cover.jpg`).
- **Structured data (JSON-LD)** — a `@graph` with `Caterer`/`LocalBusiness` (name, phone, address, hours, cuisine, area served), `WebSite`, `BreadcrumbList`, and `FAQPage` (matches the on-page FAQ). Test it in [Google's Rich Results Test](https://search.google.com/test/rich-results).
- **`robots.txt`** — allows all crawlers and points to the sitemap.
- **`sitemap.xml`** — lists the homepage and key section anchors. Submit it in [Google Search Console](https://search.google.com/search-console).
- **FAQ section** — native `<details>` accordion (no JS), doubles as SEO content.

### Google Tag Manager & GA4
- **GTM container `GTM-MZ9FZ29J`** is installed — the loader is high in `<head>` and the `<noscript>` fallback is right after `<body>`.
- **GA4 runs through GTM.** Add a *GA4 Configuration* tag inside the GTM container (with your `G-XXXXXXXXXX` Measurement ID). Don't also hardcode a `gtag.js` block on the page — that would double-count.
- Verify with GTM **Preview** mode and the GA4 **Realtime** report.

### Before going live — update these
- **Canonical/OG/sitemap/robots URLs** assume `https://omsakthicateringservices.in/`. Change them if the domain differs.
- **Business address** in the JSON-LD and contact section is `Central Railway Station, Chennai 600003` (placeholder-ish) — set the exact street address.
- **Email** was removed from the contact block (only phone + WhatsApp shown). Add one back if you want it.
- **Social links** (Facebook/Instagram/YouTube) are `#` placeholders; WhatsApp is wired to `wa.me/message/XDDBKSHT3CEVF1`.
- Replace `assets/og-cover.jpg` with a branded 1200×630 image for the best social preview.

## License / Credits

Built as a bespoke marketing site for Om Sakthi Catering Services. Fonts are loaded from Google Fonts (Playfair Display + Poppins). Replace placeholder content and imagery with your own before publishing.
