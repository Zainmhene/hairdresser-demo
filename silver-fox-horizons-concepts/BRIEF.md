# Silver Fox Horizons: website concepts brief

Shared brief for all five concepts. Each concept lives in its own folder (`01-…` to `05-…`)
and uses the shared photos and videos in `assets/`.

## The client

**Silver Fox Horizons** is an international strategic advisory firm partnering with governments,
institutions and businesses to strengthen state capacity, elevate global influence and unlock
investment opportunities across Africa.

Positioning: a strategic advisory firm working **at the intersection of statecraft, international
positioning and investment diplomacy.**

The founder is a woman. She wants something **very clean, sophisticated and professional**:
premium, understated and internationally credible. Her stated reference is the Tony Blair
Institute for Global Change (institute.global): white space, confident editorial typography,
strong topic structure, insight-led, careful motion. She saw a first draft (dark navy + gold,
condensed Oswald capitals, busy) and was lukewarm. So: less "flashy agency", more
"institution with taste". Restraint is the luxury.

### Three areas of expertise (use these names exactly)

1. **Statecraft, Governance & Institutional Transformation**
   Helping governments strengthen institutional capacity, design and implement reforms, and
   improve public-sector performance.
2. **Nation Branding, Strategic Communications & Global Positioning**
   Supporting governments in strengthening their international reputation, soft power and
   global visibility.
3. **Investment Diplomacy, Market Access & Strategic Partnerships**
   Helping international companies and investors navigate African markets, engage with
   governments and develop strategic investment and commercial partnerships.

### Who it serves
Governments and heads of state's offices, ministries and public institutions, development
institutions, international companies and investors.

## Content rules (important: this is a demo for a real client)

- **No invented track record.** Do not claim numbers of clients, deals, "$2B facilitated",
  countries worked in, years of experience, awards or named clients. Where the client must
  supply facts, use a tasteful, clearly-marked placeholder such as "Biography to follow" or a
  subtle `[to be confirmed]`.
- **Context facts about Africa are fine** (and make good stat blocks), e.g. 54 countries;
  about 1.5 billion people; the youngest population of any continent (median age about 19);
  the AfCFTA is the largest free trade area in the world by number of member countries;
  by 2050 roughly one in four people on Earth will be African. Label them as context
  ("Africa in numbers"), not as the firm's achievements.
- **Leadership**: the founder's name and bio are not known yet. Use a placeholder card like
  "Founder & Managing Partner — Biography to follow" with an elegant treatment (monogram,
  silhouette or portrait-crop placeholder), not a stock person pretending to be her.
- **Insights**: sample article titles are fine (they read as "the kind of thinking we publish"),
  e.g. "Delivery units that deliver: lessons for reform-minded governments", "Soft power in
  the age of the algorithm: how African nations can own their story", "Beyond the roadshow:
  what investors need from a first meeting with government", "The AfCFTA and the next decade
  of market access". Give them dates in 2026 and a category tag.
- Contact form: front-end only. Show a polite "Demo — messages are not sent yet" note.
  Email/office: `[to be confirmed]`.
- Footer: © 2026 Silver Fox Horizons. Small credit "Website by TSUGI" linking to
  https://tsugidigital.com (Zain's studio).
- Add `<meta name="robots" content="noindex">` (it's a demo).
- British English spelling (programme, organisation, centre).
- Do not imitate the Tony Blair Institute's logo, name or exact layouts. Learn from its
  qualities, make something original.

## Brand mark
There is no logo yet (she will send one). Design a **refined wordmark** for "Silver Fox
Horizons" for your concept, optionally with a small, abstract mark (e.g. a horizon line,
a geometric fox-ear chevron, a monogram "SFH"). Inline SVG or pure type. Keep it elegant and
easy to swap out later.

## Pages (each concept)
Plain HTML/CSS/JS, no build step, works by opening the files or on GitHub Pages.

- `index.html` — the homepage, the showpiece. Must make someone say "wow" in the first
  three seconds and still feel calm and institutional.
- `expertise.html` — the three practices in depth (what we do, typical engagements as bullet
  lists, who it's for). Anchor ids `#statecraft`, `#nation-branding`, `#investment`.
- `about.html` — mandate, approach/principles (how we work), leadership placeholders.
- `insights.html` — insight listing with category filter (works in JS), featured piece.
- `contact.html` — enquiry form + details placeholders.

Shared `style.css` and `main.js` per concept. Consistent header/footer, working mobile menu.

## Quality bar
- Fully responsive: test 1440px desktop and 390px mobile. No horizontal scroll on mobile.
- Respect `prefers-reduced-motion`.
- Semantic HTML, alt text on images, visible focus states, good contrast.
- Videos: `autoplay muted loop playsinline` with `poster`. Images: `loading="lazy"` below the fold.
- Fonts: Google Fonts only. Scripts only from cdn.jsdelivr.net / cdnjs / unpkg, exact versions
  (e.g. `gsap@3.12.5`, `lenis@1.1.13`). Keep it fast.
- Every link goes somewhere real (page or anchor). No lorem ipsum.

## Shared assets (paths relative to a concept folder: `../assets/...`)

All photos are from Pexels (free licence). Landscape photos are 2000px wide, portraits 1300px wide.

### Photos `../assets/img/`
| file | what it shows |
|---|---|
| nairobi-skyline-dusk.jpg | Nairobi skyline at blue hour, city lights, dramatic sky (landscape, dark) |
| nairobi-highway-skyline.jpg | Nairobi towers and an expressway, overcast golden light |
| nairobi-uhuru-park-kicc.jpg | Nairobi: KICC tower and skyline over green Uhuru Park, daylight |
| lagos-aerial-ocean.jpg | Lagos aerial, towers and Atlantic horizon, daylight |
| lagos-coastline.jpg | Lagos coastline aerial, beach and city, ocean (wide) |
| kigali-aerial.jpg | Kigali aerial, green tree-lined avenues, daylight |
| accra-independence-arch.jpg | Accra Independence Arch with black star, deep blue sky |
| cairo-nile-aerial.jpg | Cairo and the Nile aerial panorama, warm light |
| cairo-aerial.jpg | Cairo aerial with the Nile and Cairo Tower, daylight |
| cairo-nile-river.jpg | Cairo skyline across the Nile, blue sky |
| cape-town-aerial.jpg | Cape Town aerial with Table Mountain, stadium and sea |
| cape-town-mountain.jpg | Mountain over Cape Town suburbs, clouds |
| savanna-acacia-sunset.jpg | Lone acacia silhouette against an orange sunset (iconic, minimal) |
| kilimanjaro-plains.jpg | Kilimanjaro snow cap over savanna plains with acacias, clouds |
| kilimanjaro-night.jpg | Kilimanjaro under a deep blue night sky with acacias |
| kilimanjaro-view.jpg | Kilimanjaro mountain from the slopes, blue sky |
| abidjan-port-cranes.jpg | Container port cranes and ship, Abidjan |
| tema-port.jpg | Tema port (Ghana) cranes and containers, grey sky |
| solar-wind-farm.jpg | Solar farm and wind turbines, hills, blue sky |
| solar-farm-aerial.jpg | Aerial abstract rows of solar panels on sand |
| portrait-woman-black-gold.jpg | Elegant woman, black headwrap, gold earrings, studio, light background (portrait) |
| portrait-man-suit-bw.jpg | Man in suit, black & white, standing (portrait) |
| portrait-traditional-bw.jpg | Person in traditional robes, black & white, ornate chair (portrait) |
| portrait-man-shadow-bw.jpg | Man in shadow, black background, black & white (portrait) |
| portrait-elder-bw.jpg | Distinguished elder in traditional cap, black & white (portrait) |
| woman-executive-office.jpg | Woman executive at a desk in an office with certificates (landscape) |
| woman-executive-white.jpg | Woman in white blazer at a laptop, grey studio (landscape) |
| man-portrait-vest.jpg | Young man in waistcoat and white shirt, gesturing, studio (portrait) |
| portrait-woman-beads.jpg | Woman with beaded jewellery and headband, dark background (portrait) |
| kente-portrait.jpg | Smiling man in kente cloth, Ghana flag behind (portrait, very colourful) |
| boardroom-meeting.jpg | Woman and senior colleague reviewing papers at a table, bright |
| conference-room.jpg | Group meeting around a long table in a bright office (portrait crop) |

### Videos `../assets/video/` (H.264, muted, ~1600px, each has a matching `.jpg` poster)
| file | what it shows |
|---|---|
| johannesburg-night-aerial.mp4 | Drone over Johannesburg at night, glittering city lights (12s) |
| nairobi-dusk-timelapse.mp4 | Nairobi Westlands skyline and highway at dusk, timelapse (7s) |
| johannesburg-sunset.mp4 | Johannesburg skyline silhouette, sun setting (14s) |
| cape-town-harbour-sunset.mp4 | Cape Town harbour and city at golden hour, drone (12s) |
| cape-town-aerial-sunset.mp4 | Drone over Cape Town rooftops toward sunset (12s) |
| city-aerial-intersection.mp4 | Drone over a leafy Cape Town intersection, daylight (9s) |
| city-aerial-day.mp4 | Drone over dense Cape Town city blocks, early light (12s) |
