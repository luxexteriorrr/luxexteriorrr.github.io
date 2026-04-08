# Portfolio Rebuild Plan — kirillkonstantinov.com

## Vision
A minimal, KABK-inspired portfolio with a synced scroll-wheel selector as the homepage. Visitors scroll through projects with synced name/description/preview columns. Clicking a project opens its detail page. Clean, black & white, lets the work speak.

## Reference
- **Primary:** kabk.github.io/go-theses-24 — synced keen-slider wheels (names / titles / images), hover color transitions, abstract preview, single-viewport layout
- **Secondary:** lovrinov.com — overlay navigation, horizontal image gallery, persistent index, URL-per-project

## Tech Stack
- HTML / CSS / vanilla JS (no framework)
- keen-slider (lightweight, dependency-free slider library)
- Hosted on GitHub Pages (luxexteriorrr.github.io)
- Custom domain: kirillkonstantinov.com (needs DNS setup)

## Site Structure

### Homepage (index.html)
- Header: "Kirill Konstantinov" + minimal nav (About, Contact, Are.na)
- Three synced scroll wheels:
  - Left: Project names
  - Center: Project descriptions/tags
  - Right: Preview images
- Scrolling any wheel updates the others in sync
- Hover: color transition on active item (0.3s)
- Click: navigates to project detail page
- Footer: timestamp + local time (keep the existing feature you like)

### Project Detail Pages (each in own folder)
- Keep existing project pages: occult.of.encryption, around.a.memory, vestige, glimmers
- Each project folder = self-contained (own HTML/CSS/JS)
- Add any new projects (AAM.COMFORT, IRP, + new work)
- Back button / nav to return to homepage

### Data
- projects.json — single file listing all projects:
  ```json
  {
    "projects": [
      {
        "slug": "occult.of.encryption",
        "name": "Occult Of Encryption",
        "description": "...",
        "tags": ["digital", "print"],
        "year": "2025",
        "thumbnail": "assets/coveroccult.png",
        "url": "/occult.of.encryption"
      }
    ]
  }
  ```
- Homepage reads this JSON and builds the scroll wheels dynamically
- Adding a project = add entry to JSON + create project folder

## Implementation Phases

### Phase 1: Homepage Rebuild
1. Set up keen-slider with three synced wheels
2. Create projects.json with existing projects
3. Build the scroll-wheel UI (names / descriptions / images)
4. Add hover transitions and click-through navigation
5. Style: minimal, black/white, clean typography
6. Responsive: mobile layout (stacked or simplified)

### Phase 2: Project Pages
7. Review and clean up existing project pages
8. Add consistent nav/back button across all project pages
9. Build out any new project pages (AAM.COMFORT, IRP, etc.)

### Phase 3: Polish & Launch
10. Typography decisions (licensed fonts or own typeface?)
11. About/Contact section or page
12. Domain setup: CNAME file + DNS records at registrar
13. Performance: optimize images (webp), lazy loading
14. SEO: meta tags, Open Graph, favicon
15. Test across browsers and devices

## Open Questions
- [ ] Fonts: Use own typeface, license Arketa/Kolonia, or pick new fonts?
- [ ] Which projects to include in the curated 5-10?
- [ ] About page: separate page or section on homepage?
- [ ] Contact: form, email link, or just social links?
- [ ] Where is the domain registered? (for DNS transfer)
- [ ] Do existing project pages need a visual refresh or just nav updates?
