# Factory Direct · Meesho C2M prototype

Working prototype for **Team Violet's** Meesho DICE Challenge 3.0 (Business Track) entry: a strategy to grow Meesho's consumer-to-manufacturer (C2M) seller base.

> Bring a proven product to its factory, not a cold catalogue to the app.

**Live:** https://7collector.github.io/factory-direct-prototype/ · **Journey (recommended):** https://7collector.github.io/factory-direct-prototype/v3/

## Ways to walk through it

The landing page (`index.html`) links to three story versions and the free explorer:

| Path | Version | How to move |
|---|---|---|
| `v3/` | **Journey (recommended)**: follow one bedsheet set from Meesho's data to the factory, the Cluster Hub, a buyer's home and back to the reorder | → / ← / Space, click a route stop, **N** talk track, **F** fullscreen, `#b1`–`#b12` |
| `v1/` | Keynote: 13 chapters, each with a live product screen | → / ←, 1–9, **N** notes, **F** fullscreen |
| `v2/` | Scroll story: narrative with a pinned live product screen | scroll, or → / Space to glide |
| `explore.html` | The full app with all five screens and a guided demo | see below |

## Explorer screens

| # | Screen | What it shows |
|---|---|---|
| 1 | **Overview** | The idea, the ₹381 → ₹345 cost waterfall, the four barriers and what answers each, the 24-month cluster roadmap and sizing |
| 2 | **Supplier Panel** | What a Panipat factory sees: Demand Cards (EN/हिं), the settlement calculator, a 3-step bid, its pilot batch at D+14/30/60/90 with a replenishment offer, and the Gate 0 applicant flow |
| 3 | **Cluster Hub** | The shared operator's day: spec samples checked against the card, packing and one pickup manifest, returns graded with defect codes |
| 4 | **Buyer App** | The same listing today vs. with Factory Direct: maker line, Spec Card, all-in price |
| 5 | **C2M Console** | 30 pilot batches vs 30 matched controls, rule-computed status, pilot gates, north star (second batch on the factory's own money) |

**Guided demo:** press the *Guided demo* button for a 10-step walkthrough with talking points. Use the ← / → keys to move between steps and Esc to exit. Outside the demo, keys **1–5** switch screens. The reset button clears saved demo state.

## Run locally

It's a static site with no build step:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Opening `index.html` directly also works.

## Deploy

- **GitHub Pages:** push this folder to a repo, then go to Settings → Pages → Deploy from branch → `main` / root. `.nojekyll` is included.
- **Netlify / Vercel / Cloudflare Pages:** set the publish directory to this folder. There is no build command.

## Structure

```
index.html        landing page (picks a version)
explore.html      explorer shell, app bar, overlays
v1/ v2/ v3/       story versions (each: index.html, story.css, story.js; reuse assets/data.js)
thumbs/           landing-page thumbnails
assets/app.css    Meesho-palette design system (magenta #9F2089, plum #570A57, pink #F43397)
assets/data.js    economics, Demand Cards, sizing, pilot cohort, rules engine
assets/app.js     router, shared UI (drawer, modal, toast), overview, guided demo
assets/views.js   Supplier Panel, Cluster Hub, Buyer App, C2M Console
```

## Numbers

The scenario numbers follow the detailed deck:
- Buyer price: ₹381 → ₹345 all-in (−₹36, 9.4%).
- What the factory receives: ₹245 per kept set on day 7. It keeps ₹27, which is ₹22 in today's money against a ₹19 wholesale margin.
- Returns ladder: ≤4% target / 5% base / 6% review / 12% stop.
- North star: 50% of factories place a self-funded second batch by D+60, 60% by D+90.

Factory names, pilot reads and Hub queues are illustrative sample data.

Not an official Meesho product.
