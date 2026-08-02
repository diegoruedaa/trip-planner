# Trip Planner

A day-by-day trip planning template: timeline with a progress checklist, shared expenses, automatic/manual dark mode, direct Google Maps links, and offline support as an installable PWA. Vanilla JS, no frameworks, no build step — open `index.html` and you're in.

I built this while planning my own trip, then pulled it apart into a reusable template.

![Trip Planner screenshot](docs/screenshot.png)

> 🔗 Live demo: `<!-- add your GitHub Pages / Netlify / Vercel URL here once you deploy it -->`

## Generating the screenshot/GIF above

1. Open the app in the browser (see [Running it locally](#running-it-locally)) with DevTools in responsive mode (iPhone or similar).
2. Screenshot: `Cmd+Shift+4` (macOS) over the window, or DevTools' own capture command (`Cmd+Shift+P` → "Capture screenshot").
3. GIF: record with QuickTime (`File → New Screen Recording`) and convert with [gifski](https://gif.ski/) or `ffmpeg -i recording.mov -vf "fps=12,scale=480:-1" output.gif`.
4. Drop the result into `docs/screenshot.png` (or `.gif`) and update the path above if you use a different name.

## Stack

- HTML + CSS + vanilla JavaScript. No dependencies, no build step — I wanted something I could hand-edit and reload straight in the browser, not a toolchain to maintain for a weekend project.
- `localStorage` for progress, expenses, and preferences. No backend: nobody but the people on the trip needs this data, and a browser is enough for that.
- Web App Manifest + Service Worker for install and offline use (PWA).
- Google Fonts (Fraunces + Manrope), loaded via `<link>`.

## Running it locally

Serve the folder with any static server — needed for the service worker to work (opening `index.html` directly via `file://` works fine for everything else):

```bash
cd trip-planner
python3 -m http.server 8000
# or: npx serve .
```

Open `http://localhost:8000`.

## Editing `data.js` for your own trip

Everything about the trip lives in [`js/data.js`](js/data.js). You shouldn't need to touch `app.js` or `style.css`.

**1. Header** (`TRIP.eyebrow`, `TRIP.name`, `TRIP.subtitle`, `TRIP.accommodation`): the text shown at the top of the app, plus your accommodation's address (optional — lets you reuse it as a Maps destination across several stops).

**2. Days** (`TRIP.days`): one object per day. Each one needs an `id` (unique, used to save progress), an accent `color`/`bg` pair (use `--d1`, `--d2`, `--d3`, `--de` from `style.css`, or add your own), a `dateLabel` for the tab (e.g. `"Fri 12"`), a `name` for the panel header, an `isoDate` (`YYYY-MM-DD` — triggers the "next stop" banner when it matches today), and a `stops` array.

**3. Stops** (each element of `stops`):

| Field | Required | Description |
|---|---|---|
| `time` | yes | time or range, free text: `"09:00"` or `"09:00–10:30"` |
| `cat` | yes | must exist in `CATEGORIES` (see below) |
| `title` | yes | name of the activity |
| `desc` | no | extra detail |
| `maps` | no | text to search on Google Maps (place name or address) — auto-generates the "Open in Maps" and "Directions" buttons |
| `ticketFile` | no | filename inside `tickets/` — generates the "View ticket" button (see [Adding your tickets](#adding-your-tickets)) |

**4. Categories** (`CATEGORIES`): a `{ key: { icon, label } }` object. Add, remove, or rename categories freely — just make sure every `cat` you use in a stop exists here.

## Adding your tickets

[`tickets/`](tickets/) is gitignored — drop your real PDFs (entries, reservations) in there and they'll never end up in the repo. Full instructions in [`tickets/README.md`](tickets/README.md).

## How it works under the hood

### Folder structure

```
trip-planner/
├── index.html      # page structure
├── css/style.css   # all styling (light + dark)
├── js/data.js      # your trip: CATEGORIES + TRIP
├── js/app.js       # rendering, localStorage, expenses, dark mode
├── manifest.json + sw.js + icons/   # PWA
├── tickets/        # your own PDFs (gitignored) + README with instructions
└── README.md
```

### Load order

`index.html` loads `js/data.js` before `js/app.js`. The first one only declares `CATEGORIES` and `TRIP` — plain data. The second, at the bottom of the file, chains `renderHeader()`, `renderPanels()`, `renderTabs()`, `renderLegend()`, `renderExpenses()`, `applyCompact(storageGet('tp-compact') === '1')`, `initDarkMode()`, and `selectDay()`. Everything on screen is generated from `TRIP` — there's no static per-day HTML.

### localStorage persistence

There's no backend: progress lives in the browser's `localStorage`, under keys prefixed `tp-` (`tp-{dayId}-{idx}` per checkbox, `tp-expenses`, `tp-dark-pref`, `tp-compact`). That means it's tied to one browser on one device — switch browsers or clear site data and the progress is gone. A fine trade-off for a trip you're planning with a handful of people; not worth standing up a backend for.

### Tickets without a PDF

If a stop has a `ticketFile` but the file isn't in `tickets/`, the app doesn't break — the "View ticket" button just 404s when clicked.

### Service worker cache

On first load, `sw.js` caches the app shell (HTML, CSS, JS, manifest, icons). On later visits it serves from cache instantly and refreshes in the background against the network; offline, it just keeps the cached version.

## Accessibility

- Checkboxes, switches, and icon buttons carry `aria-label`/`aria-checked`.
- Each stop's checkbox is keyboard-navigable (`Tab` + `Enter`/`Space`).
- The settings modal closes on `Escape`.
- Contrast checked in both light and dark mode (secondary text tuned to meet WCAG AA).

## License

MIT — see [LICENSE](LICENSE).
