# Silver Fox Horizons — website (mockup)

One-page site for Silver Fox Horizons, an international strategic advisory firm.
Everything is in `index.html` (plain HTML, CSS and JavaScript, no build step).
Typefaces live in `fonts/` and the Earth imagery in `img/`, so the site makes
no outside requests.

This folder is parked inside the hairdresser demo repo for now. Before it goes
live it should move to its own repository (copy this folder's contents to the
root of a new repo and turn on GitHub Pages, same as the salon sites).

## Viewing it

Open it through a web address, not by double-clicking the file. The planet in
the hero is drawn live by the browser, and browsers block that for pages opened
straight from disk. On GitHub Pages it just works.

## The hero

The Earth is drawn live in the browser from satellite imagery. It opens at
night over Africa, the sunrise crosses the continent, and lines reach out from
African cities to other world centres.

- **The lines are illustrative.** The city pairs are in the `ROUTES` list in
  `index.html` (Lagos to London, Nairobi to Dubai and so on). Swap them for
  places that are true for the firm, or remove the list to drop the lines.
- **Imagery.** `img/earth-day-*` and `img/earth-night-*` are NASA Blue Marble
  and Black Marble (public domain). The cloud and water maps came bundled with
  the open-source `three-globe` project; confirm their source before launch.
- People who have "reduce motion" switched on see the finished daytime view
  with no animation. If a browser cannot draw it, a plain dark background shows.

## Before it goes live

Search `index.html` for each of these:

1. **`PLACEHOLDER ADDRESS`** — the contact button emails
   `enquiries@silverfoxhorizons.com`, which is a guess. Swap in the real address.
2. **`Placeholder mark`** — the small circle-and-line logo in the header and
   footer is a stand-in. Replace with the firm's real logo.
3. **`DRAFT COPY`** — the three short "Who we work with" descriptions were
   written from the brief. The client should approve or rewrite them.
4. **`noindex`** — remove that line near the top so Google can list the site.
5. Add `og:url` and an `og:image` (1200 × 630) once the web address is known,
   so links shared on WhatsApp and LinkedIn show a preview.

## Not built yet (needs content from the client)

Leadership / team, insights or publications, office locations, legal pages
(privacy notice), and a contact form (needs somewhere to send submissions).
