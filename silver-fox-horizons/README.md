# Silver Fox Horizons — website (first draft)

One-page site for Silver Fox Horizons, an international strategic advisory firm.
Everything is in `index.html` (plain HTML, CSS and JavaScript, no build step).
The two typefaces live in `fonts/` so the site makes no outside requests.

This folder is parked inside the hairdresser demo repo for now. Before it goes
live it should move to its own repository (copy this folder's contents to the
root of a new repo and turn on GitHub Pages, same as the salon sites).

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
