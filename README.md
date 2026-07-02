# Moon Type Generator

Translate English into Grade 1 [Moon type](https://en.wikipedia.org/wiki/Moon_type) — the tactile alphabet of raised curves and angles invented by William Moon in 1845 — as **real Unicode text you can select, copy, and paste anywhere**.

Existing tools like Byron Knoll's [online generator](https://www.byronknoll.com/moon.html) draw Moon letters onto a canvas, so the result is an image. This project takes a different route: Moon script has no Unicode block yet (only a tentative allocation in the SMP roadmap), so each Moon letter is mapped to an *existing* Unicode character whose printed form matches the Moon glyph. The output is ordinary text — it survives copy/paste, works in chats and documents, and can even be translated back.

## Try it

Open `index.html` in a browser (no build step, no server needed), or serve the folder with anything — it's GitHub Pages-ready. Type in the box, press **Copy Moon text**.

```
HELLO WORLD  →  ◐ΓLLO ∩O∖LƆ
MOON         →  ⅂OON
```

## The mapping

Moon designed his alphabet systematically: a few base shapes rotated in four directions, so a reader learns forms, not twenty-six arbitrary symbols. The Unicode stand-ins preserve that system. Shape descriptions follow the per-letter reference and "Dotty Moon" dot grids at [fakoo.de](https://fakoo.de/en/moon.html).

| Letter | Moon | Code point | Unicode name | Moon shape |
|:------:|:----:|------------|--------------|------------|
| A | Λ | U+039B | Greek capital lamda | Angle opening downward |
| B | Լ | U+053C | Armenian capital liwn | Stem with a bow at bottom right |
| C | C | U+0043 | Latin capital C | Arc opening right *(unchanged)* |
| D | Ɔ | U+0186 | Latin capital open O | Arc opening left |
| E | Γ | U+0393 | Greek capital gamma | Corner: vertical left, horizontal top |
| F | ʔ | U+0294 | Latin letter glottal stop | Stem with a bow at top right |
| G | ʕ | U+0295 | Latin pharyngeal voiced fricative | Stem with a bow at top left |
| H | ◐ | U+25D0 | Circle with left half black | Small circle, half filled |
| I | ǀ | U+01C0 | Latin letter dental click | A single vertical line |
| J | J | U+004A | Latin capital J | Stem with a bow at bottom left *(unchanged)* |
| K | < | U+003C | Less-than sign | Angle opening rightward |
| L | L | U+004C | Latin capital L | Corner: vertical left, horizontal bottom *(unchanged)* |
| M | ⅂ | U+2142 | Turned sans-serif capital L | Corner: horizontal top, vertical right |
| N | N | U+004E | Latin capital N | Vertical zigzag *(close to print)* |
| O | O | U+004F | Latin capital O | A full circle *(unchanged)* |
| P | ∠ | U+2220 | Angle | Horizontal line, small upward tick at left end |
| Q | ⦣ | U+29A3 | Reversed angle | Horizontal line, small upward tick at right end |
| R | ∖ | U+2216 | Set minus | Oblique from top left to bottom right |
| S | ∕ | U+2215 | Division slash | Oblique from bottom left to top right |
| T | — | U+2014 | Em dash | A single horizontal line |
| U | U | U+0055 | Latin capital U | Arc opening at the top *(unchanged)* |
| V | V | U+0056 | Latin capital V | Angle opening upward *(unchanged)* |
| W | ∩ | U+2229 | Intersection | Arc opening at the bottom |
| X | > | U+003E | Greater-than sign | Angle opening leftward |
| Y | ⅃ | U+2143 | Reversed sans-serif capital L | Corner: vertical right, horizontal bottom |
| Z | Z | U+005A | Latin capital Z | Horizontal zigzag *(unchanged)* |

The rotation families are easy to see in the table: the four corners are **L Γ ⅂ ⅃**, the four arcs **C Ɔ U ∩**, the four angles **Λ V < >**, the four hooks **J Լ ʔ ʕ**.

## Using the library

`src/moon.js` is dependency-free and works both as a plain browser script (exposing `window.MoonType`) and in Node via `require`.

```js
const MoonType = require('./src/moon.js');

MoonType.toMoon('Hello world');        // '◐ΓLLO ∩O∖LƆ'
MoonType.fromMoon('◐ΓLLO ∩O∖LƆ');      // 'HELLO WORLD'
MoonType.toMoon('Room 42', { numberMode: 'lettered' }); // '∖OO⅂ #ƆԼ'
MoonType.MOON_LETTERS;                 // full metadata: shapes, code points, families
```

`toMoon(text, options)` is case-insensitive (Moon has no case) and passes whitespace and punctuation through untouched. Options: `numberMode` is `'passthrough'` (default) or `'lettered'`, which applies the historical convention of a number sign followed by the letters A–J for 1–0; `numberSign` sets that indicator (default `'#'`); `unknown` is `'keep'` (default) or `'drop'`. `fromMoon(text)` reverses the mapping and also accepts common ASCII aliases such as `/`, `\`, `|`, and `¬`.

## Development

```
npm test        # runs the Node built-in test suite (no dependencies)
```

Tests cover mapping integrity (26 letters, one unique code point each, metadata consistency), round-tripping, casing, spacing, number modes, and decode aliases.

## Known limitations and roadmap

The mapping is a best-available approximation until Moon is encoded in Unicode. A few characters are imperfect: H renders as a filled geometric shape where embossed Moon shows a half-filled outline, and Q (U+29A3) requires a font with mathematical symbols coverage. Digits pass through by default because the later dedicated Moon numerals have no Unicode stand-ins; the historical lettered convention is available as an option. Grade 2 Moon (contractions and shorthand) and true Moon punctuation are not yet implemented. Possible next steps, roughly in order: Moon punctuation research and mapping, a Grade 2 contraction table, a downloadable `.txt` export, an alternate strict-ASCII output profile, and — for the historically curious — an optional boustrophedon display mode, since early Moon books reversed reading direction on alternate lines.

## Credits

Letter shape reference: [fakoo.de/en/moon.html](https://fakoo.de/en/moon.html). Background: [Moon type on Wikipedia](https://en.wikipedia.org/wiki/Moon_type). Inspiration: [Byron Knoll's Moon Type Generator](https://www.byronknoll.com/moon.html). The site's body text is set in Atkinson Hyperlegible, the Braille Institute's typeface.
