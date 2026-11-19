# Design notes

## Email address

The address is base64-encoded on the server (`emailEnc` in `src/app/page.tsx`) and decoded in the browser only after a click or a command-menu email action (`EmailReveal` in `scene.tsx` and `email-reveal.tsx`, `command-menu.tsx`). The rendered page source does not contain it as plain text. When the clipboard is unavailable, the decoded address is shown as selectable text.

## Open Graph image

`src/app/opengraph-image.tsx` draws a small version of the career map: time climbs the trunk and regions sit around it. It loads Oxanium Bold from Google Fonts so the card matches the site, and falls back to the default font when the fetch fails. The image renderer needs a plain `<img>` element, so `.eslintrc.json` turns off `@next/next/no-img-element` for that file.

## Career map (`src/components/ascent`)

- All rules in `ascent.css` are scoped under `.asc` so they do not affect the rest of the site.
- Time runs upward: 2011 sits at `y = 0`, later years higher.
- `graph.ts` holds the authored layout and short copy; content comes from `RESUME_DATA` by index. Publications are listed newest first in `RESUME_DATA`. The skill links list the skills each project or highlight draws on, matching the tech stacks plus the descriptions.
- Node fields: `short` is the label drawn on the map, `a`/`b` the year span for the duration rails, `col` an accent colour override, `kind` the label in the detail panel, `parent` the hub a node belongs to (hidden until the hub is open), `hls` marks a node whose children are listed as highlights. `path` is the experience path, newest first.
- Labels: when two overlap, the more important one is kept. On phones, labels that would be cut off or sit under the pill or dock are skipped.
- Selecting a skill highlights everything that uses it.
- The render loop runs at full speed only while something moves, at about 12 fps for the ambient drift otherwise, and not at all with reduced motion.
- Visited nodes and the intro state are stored in `localStorage` and `sessionStorage`; when storage is unavailable the map starts fresh.
- The collapsed profile shows the photo, name and role only.

## Checks

`scripts/check` runs Prettier, ESLint, `tsc` and the docs and comment lint.
