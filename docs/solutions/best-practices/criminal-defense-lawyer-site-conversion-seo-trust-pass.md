---
title: Conversion, SEO and trust pass for a criminal-defense lawyer static site
date: 2026-05-27
category: best-practices
module: marketing-site
problem_type: best_practice
component: frontend_stimulus
severity: medium
applies_when:
  - "Building or improving a static marketing site for a law firm or other trust-sensitive service business"
  - "Adding conversion elements (click-to-call, dual hero CTAs, team bio cards) to a static HTML site"
  - "Adding an SEO foundation (meta, canonical, Open Graph, JSON-LD LegalService, robots.txt, sitemap.xml) across multiple static pages"
  - "Wanting social proof for a real, named firm without fabricating testimonials or case-result numbers"
  - "An agent cannot fetch binary images from web search and must reuse existing project assets instead of inventing URLs"
tags:
  - frontend
  - seo
  - conversion
  - static-site
  - legal-services
  - json-ld
  - accessibility
  - image-sourcing
---

# Conversion, SEO and trust pass for a criminal-defense lawyer static site

> Note on `component`: the schema's `component` enum is Rails/Hotwire-oriented and has no clean static-site value. `frontend_stimulus` is used here as the least-wrong "client-side enhancement layer" bucket — this site's `tsc`-compiled `dist/main.js` is the closest analog. Treat it as "frontend" generically.

## Context

This is a static marketing site (plain HTML, one shared `styles.css`, TypeScript compiled to `dist/main.js` via `npm run build`) for an Argentine criminal-defense law firm, "Estudio Cullen & Cozzi" (Paraná, Entre Ríos). Five pages: `index`, `servicios`, `estudio`, `contacto`, `blog`. Repo: `Honorum435/Cullen_Cozzi`.

After researching 2026 best practices for criminal-defense lawyer sites, we applied a single conversion + trust + SEO pass. The high-stakes, mobile-heavy, phone-first nature of criminal-defense searches drove every decision: the visitor is often in crisis, on a phone, deciding who to call *right now*. Research consistently pointed to conversion-first layout (prominent click-to-call), trust signals (real team, verifiable social proof), a dark/bold palette (already present), fast mobile load, and an SEO foundation (meta, Open Graph, structured data, sitemap/robots). A separate hard constraint shaped the trust work: the agent cannot fetch or save binary images, so we could only build structure around the firm's *existing* photos.

## Guidance

Reusable conventions established for this site (apply consistently across all pages):

1. **Header click-to-call on every page.** A gold pill `<a class="nav-phone" href="tel:+5493434501560">` is the first child of `.nav-social`. On mobile (`<=768px`) the social icons hide (`.nav-social a:not(.nav-phone){display:none}`) but the phone stays, collapsing to a round icon-only button (`.nav-phone span{display:none}`). The phone is the one nav action that must never disappear.

2. **Dual hero CTAs.** Primary "Consultá Ahora" linking to `contacto`, plus a ghost-styled "Llamar 343 450-1560" `tel:` link side by side. Give crisis visitors both the call-now and the considered-form path.

3. **Team as `.equipo-card` articles.** Each card: `.equipo-foto` (`aspect-ratio: 3/2`, `object-fit: cover`, `object-position: center 20%`, grayscale that clears on hover), `.equipo-rol`, `.equipo-tags` pills, and `.btn-mini` Call + `.btn-mini--wa` WhatsApp buttons. Full bios live on `estudio.html`; a mini teaser appears on `index.html`. Real photos with names, roles, and direct contact build trust under high-stakes decisions.

4. **Honest social proof only.** Use a verifiable "En los medios" strip listing real outlets the lawyers appeared on (Canal 9, AHORA, Telediario, CAER) plus the existing gallery. Do **not** fabricate testimonials or invent case-result numbers.

5. **Per-page SEO foundation.** Unique `<meta name="description">`, `<link rel="canonical">`, Open Graph + Twitter card tags, `theme-color`, `favicon.svg` + apple-touch-icon. A JSON-LD `LegalService` schema (name, Paraná/Entre Ríos address, telephone, `areaServed`, `sameAs` socials, `knowsAbout` practice areas) lives on the home page only. Add root `robots.txt` and `sitemap.xml`.

6. **Accessibility baseline.** `.skip-link` ("Saltar al contenido") + `<main id="contenido" tabindex="-1">` on every page.

7. **TypeScript.** Mobile nav closes when a menu link is clicked; recompile with `npm run build` (never edit `dist/main.js` directly).

```css
@media (max-width: 768px) {
  .nav-social a:not(.nav-phone) { display: none; }
  .nav-phone span { display: none; }   /* phone collapses to icon, never hides */
}
```

## Why This Matters

- **Conversion in a crisis.** Criminal-defense visitors decide fast, usually on a phone. An always-visible click-to-call and dual CTAs remove every barrier between "I need a lawyer" and a ringing phone — the single highest-leverage conversion move on this kind of site.
- **Trust is the product.** People hire a defender they believe in. Real faces, roles, and direct call/WhatsApp buttons convert better than anonymous copy.
- **Honest social proof protects the firm.** Fabricated testimonials or invented win-rate numbers are a false-advertising and legal-ethics risk for a real, named firm. Verifiable media mentions deliver the trust signal without the liability.
- **SEO + structured data win local intent.** `LegalService` schema and clean meta/OG tags help the firm surface for local "abogado penalista Paraná" searches and render well when shared.
- **Accessibility is non-negotiable** for a public-service-adjacent site and reinforces SEO and usability.

## When to Apply

Apply these conventions when building or revising any conversion-focused professional-services site, especially law firms, and particularly when visitors are mobile-first and decision-urgent. Specific conditions and gotchas:

- **Always keep click-to-call reachable on mobile.** If you hide a nav for space, exempt the phone — collapse it to an icon, don't remove it.
- **Social proof gotcha (ethics/legal):** when the client is a real, named firm, never fabricate testimonials or case-result statistics. Fall back to verifiable media mentions and an existing gallery. Only use real quoted results with permission.
- **Image-sourcing constraint (hard limitation):** the agent cannot download images from a web/Google search into the project — there is no tool to fetch or save binary images, and guessing/inventing image URLs is disallowed. Workaround: build the page structure using the firm's existing images in `src/Img`, and tell the user the exact filename each replacement should overwrite (e.g., `foto9.jpg` = Cullen, `foto8.jpeg` = Cozzi).
- **Verify photo suitability before wiring it into a bio.** A TV split-screen shot (`foto7`) made a confusing portrait; we substituted a solo shot (`foto9`). Check that an existing image actually reads as a clean headshot at the card's `3/2` crop before using it.
- **Recompile, don't hand-edit `dist/`.** Any TS behavior change requires `npm run build`.

## Examples

**Header click-to-call (first child of `.nav-social`, gold pill → round icon on mobile):**
```html
<a class="nav-phone" href="tel:+5493434501560" aria-label="Llamar al estudio Cullen y Cozzi">
  <svg>...</svg><span>343 450-1560</span>
</a>
```

**Team card with grayscale-on-hover photo + direct contact:**
```html
<article class="equipo-card">
  <div class="equipo-foto">
    <img src="./src/Img/foto9.jpg" width="600" height="400"
         alt="Miguel Ángel Cullen, abogado penalista" loading="lazy" />
  </div>
  <h3>Miguel Ángel Cullen</h3>
  <p class="equipo-rol">Abogado penalista</p>
  <div class="equipo-tags"><span>Juicios por Jurados</span></div>
  <a class="btn-mini" href="tel:+5493434501560">Llamar</a>
  <a class="btn-mini btn-mini--wa" href="https://wa.me/5493434501560"
     target="_blank" rel="noopener noreferrer">WhatsApp</a>
</article>
```

**`LegalService` JSON-LD (home page only):**
```html
<script type="application/ld+json">
{ "@context": "https://schema.org", "@type": "LegalService",
  "name": "Estudio Cullen & Cozzi",
  "address": { "@type": "PostalAddress", "addressLocality": "Paraná",
               "addressRegion": "Entre Ríos", "addressCountry": "AR" },
  "telephone": "+5493434501560",
  "areaServed": "Entre Ríos",
  "sameAs": ["https://instagram.com/...", "https://facebook.com/..."],
  "knowsAbout": ["Derecho Penal", "Juicios por Jurados"] }
</script>
```

**Accessibility skip link (every page):**
```html
<a class="skip-link" href="#contenido">Saltar al contenido</a>
<!-- ... -->
<main id="contenido" tabindex="-1"> ... </main>
```

## Related

- No prior docs in `docs/solutions/` — this is the first entry; the directory was created for it.
- No related GitHub issues found in `Honorum435/Cullen_Cozzi`.
