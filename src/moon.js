/*!
 * moon.js — Moon Type Generator core library
 * Translates English text to Grade 1 Moon type as copy/paste-able Unicode.
 *
 * Moon script is not yet encoded in Unicode (it has only a tentative
 * allocation in the SMP roadmap), so each Moon letter is mapped to an
 * existing Unicode character whose printed form matches the Moon glyph.
 * Shape references: the per-letter descriptions and "Dotty Moon" dot
 * grids published at fakoo.de/en/moon.html.
 *
 * Zero dependencies. Works as a plain <script> in the browser
 * (exposes window.MoonType) and via require() in Node.
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.MoonType = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '0.1.0';

  /**
   * The Grade 1 Moon alphabet.
   * Each entry: the Latin letter, the Unicode stand-in for the Moon glyph,
   * its code point, the character's Unicode name, a plain-language
   * description of the Moon shape, and the base-shape family it belongs to.
   *
   * Moon type is systematic: a few base shapes rotated in four directions
   * produce most of the alphabet. The `family` field encodes that system.
   */
  var MOON_LETTERS = [
    { letter: 'A', moon: '\u039B', codepoint: 'U+039B', name: 'GREEK CAPITAL LETTER LAMDA',           shape: 'Two lines meeting in an angle that opens downward', family: 'angles' },
    { letter: 'B', moon: '\u053C', codepoint: 'U+053C', name: 'ARMENIAN CAPITAL LETTER LIWN',         shape: 'Vertical stem with a bow at the bottom right',      family: 'hooks' },
    { letter: 'C', moon: 'C',      codepoint: 'U+0043', name: 'LATIN CAPITAL LETTER C',               shape: 'Arc opening to the right (unchanged from print)',   family: 'arcs' },
    { letter: 'D', moon: '\u0186', codepoint: 'U+0186', name: 'LATIN CAPITAL LETTER OPEN O',          shape: 'Arc opening to the left (a mirrored C)',            family: 'arcs' },
    { letter: 'E', moon: '\u0393', codepoint: 'U+0393', name: 'GREEK CAPITAL LETTER GAMMA',           shape: 'Corner: vertical left stroke, horizontal top',      family: 'corners' },
    { letter: 'F', moon: '\u0294', codepoint: 'U+0294', name: 'LATIN LETTER GLOTTAL STOP',            shape: 'Vertical stem with a bow at the top right',         family: 'hooks' },
    { letter: 'G', moon: '\u0295', codepoint: 'U+0295', name: 'LATIN LETTER PHARYNGEAL VOICED FRICATIVE', shape: 'Vertical stem with a bow at the top left',      family: 'hooks' },
    { letter: 'H', moon: '\u25D0', codepoint: 'U+25D0', name: 'CIRCLE WITH LEFT HALF BLACK',          shape: 'Small circle, half filled',                         family: 'rounds' },
    { letter: 'I', moon: '\u01C0', codepoint: 'U+01C0', name: 'LATIN LETTER DENTAL CLICK',            shape: 'A single vertical line',                            family: 'lines' },
    { letter: 'J', moon: 'J',      codepoint: 'U+004A', name: 'LATIN CAPITAL LETTER J',               shape: 'Vertical stem with a bow at the bottom left (unchanged from print)', family: 'hooks' },
    { letter: 'K', moon: '<',      codepoint: 'U+003C', name: 'LESS-THAN SIGN',                       shape: 'Two lines meeting in an angle that opens rightward', family: 'angles' },
    { letter: 'L', moon: 'L',      codepoint: 'U+004C', name: 'LATIN CAPITAL LETTER L',               shape: 'Corner: vertical left stroke, horizontal bottom (unchanged from print)', family: 'corners' },
    { letter: 'M', moon: '\u2142', codepoint: 'U+2142', name: 'TURNED SANS-SERIF CAPITAL L',          shape: 'Corner: horizontal top, vertical right stroke',     family: 'corners' },
    { letter: 'N', moon: 'N',      codepoint: 'U+004E', name: 'LATIN CAPITAL LETTER N',               shape: 'Vertical zigzag from bottom left to top right (close to print)', family: 'zigzags' },
    { letter: 'O', moon: 'O',      codepoint: 'U+004F', name: 'LATIN CAPITAL LETTER O',               shape: 'A full circle (unchanged from print)',              family: 'rounds' },
    { letter: 'P', moon: '\u2220', codepoint: 'U+2220', name: 'ANGLE',                                shape: 'Horizontal line with a small upward tick at its left end', family: 'ticks' },
    { letter: 'Q', moon: '\u29A3', codepoint: 'U+29A3', name: 'REVERSED ANGLE',                       shape: 'Horizontal line with a small upward tick at its right end', family: 'ticks' },
    { letter: 'R', moon: '\u2216', codepoint: 'U+2216', name: 'SET MINUS',                            shape: 'Oblique line from top left to bottom right',        family: 'obliques' },
    { letter: 'S', moon: '\u2215', codepoint: 'U+2215', name: 'DIVISION SLASH',                       shape: 'Oblique line from bottom left to top right',        family: 'obliques' },
    { letter: 'T', moon: '\u2014', codepoint: 'U+2014', name: 'EM DASH',                              shape: 'A single horizontal line',                          family: 'lines' },
    { letter: 'U', moon: 'U',      codepoint: 'U+0055', name: 'LATIN CAPITAL LETTER U',               shape: 'Arc opening at the top (unchanged from print)',     family: 'arcs' },
    { letter: 'V', moon: 'V',      codepoint: 'U+0056', name: 'LATIN CAPITAL LETTER V',               shape: 'Two lines meeting in an angle that opens upward (unchanged from print)', family: 'angles' },
    { letter: 'W', moon: '\u2229', codepoint: 'U+2229', name: 'INTERSECTION',                         shape: 'Arc opening at the bottom',                         family: 'arcs' },
    { letter: 'X', moon: '>',      codepoint: 'U+003E', name: 'GREATER-THAN SIGN',                    shape: 'Two lines meeting in an angle that opens leftward', family: 'angles' },
    { letter: 'Y', moon: '\u2143', codepoint: 'U+2143', name: 'REVERSED SANS-SERIF CAPITAL L',        shape: 'Corner: vertical right stroke, horizontal bottom',  family: 'corners' },
    { letter: 'Z', moon: 'Z',      codepoint: 'U+005A', name: 'LATIN CAPITAL LETTER Z',               shape: 'Horizontal zigzag from top left to bottom right (unchanged from print)', family: 'zigzags' }
  ];

  /** Base-shape families, in teaching order. Structure encodes the system. */
  var FAMILIES = [
    { id: 'angles',   label: 'Angles',   note: 'One open angle, rotated four ways' },
    { id: 'corners',  label: 'Corners',  note: 'One right-angle corner, rotated four ways' },
    { id: 'arcs',     label: 'Arcs',     note: 'One semicircle, rotated four ways' },
    { id: 'hooks',    label: 'Hooks',    note: 'One stem-and-bow cane, rotated four ways' },
    { id: 'ticks',    label: 'Ticks',    note: 'A line with a small flag, mirrored' },
    { id: 'obliques', label: 'Obliques', note: 'One diagonal stroke, mirrored' },
    { id: 'lines',    label: 'Lines',    note: 'A bare stroke, upright and flat' },
    { id: 'zigzags',  label: 'Zigzags',  note: 'A zigzag, upright and flat' },
    { id: 'rounds',   label: 'Rounds',   note: 'The circle, open and half filled' }
  ];

  /** letter -> moon character */
  var MOON_MAP = {};
  /** moon character -> letter */
  var REVERSE_MAP = {};
  MOON_LETTERS.forEach(function (entry) {
    MOON_MAP[entry.letter] = entry.moon;
    REVERSE_MAP[entry.moon] = entry.letter;
  });

  /**
   * Alternative characters accepted when decoding, for text that was
   * produced with ASCII stand-ins or common near-identical code points.
   */
  var DECODE_ALIASES = {
    '\u2227': 'A', // ∧ LOGICAL AND
    '\u2C6D' : undefined, // reserved
    '|':      'I',
    'I':      'I',
    '\u2223': 'I', // ∣ DIVIDES
    '\u0186': 'D',
    '\u2183': 'D', // Ↄ ROMAN NUMERAL REVERSED ONE HUNDRED
    '\u017F': 'F', // ſ LONG S
    '\uA780': 'M', // Ꞁ LATIN CAPITAL LETTER TURNED L
    '\u00AC': 'M', // ¬ NOT SIGN
    '\\':     'R',
    '/':      'S',
    '\u2212': 'T', // − MINUS SIGN
    '\u2013': 'T', // – EN DASH
    '\u00D7': 'X'  // × MULTIPLICATION SIGN
  };

  /**
   * Historically, early Moon used a numeral indicator followed by the
   * letters A–J for the digits 1–9 and 0, the same convention braille
   * uses. The dedicated Moon numeral glyphs added later have no close
   * Unicode stand-ins, so `numberMode: 'lettered'` applies the historical
   * convention instead.
   */
  var DIGIT_TO_LETTER = {
    '1': 'A', '2': 'B', '3': 'C', '4': 'D', '5': 'E',
    '6': 'F', '7': 'G', '8': 'H', '9': 'I', '0': 'J'
  };

  var DEFAULTS = {
    /** 'passthrough' leaves digits as-is; 'lettered' uses number sign + A–J. */
    numberMode: 'passthrough',
    /** Placeholder printed before a run of digits in 'lettered' mode. */
    numberSign: '#',
    /** What to do with characters that have no Moon form: 'keep' or 'drop'. */
    unknown: 'keep'
  };

  function mergeOptions(options) {
    var merged = {};
    for (var key in DEFAULTS) merged[key] = DEFAULTS[key];
    if (options) for (var given in options) merged[given] = options[given];
    return merged;
  }

  var LETTER_RE = /[A-Z]/;
  var DIGIT_RE = /[0-9]/;

  /**
   * Translate English text into Moon type.
   * Case-insensitive (Moon has no case). Whitespace and punctuation pass
   * through untouched so line breaks and word spacing survive the trip.
   *
   * @param {string} text
   * @param {{numberMode?: 'passthrough'|'lettered', numberSign?: string, unknown?: 'keep'|'drop'}} [options]
   * @returns {string} Moon type as plain Unicode text
   */
  function toMoon(text, options) {
    if (text == null) return '';
    var opts = mergeOptions(options);
    var out = [];
    var chars = String(text).split('');
    var inNumber = false;

    for (var i = 0; i < chars.length; i++) {
      var ch = chars[i];
      var upper = ch.toUpperCase();

      if (LETTER_RE.test(upper)) {
        inNumber = false;
        out.push(MOON_MAP[upper]);
        continue;
      }

      if (DIGIT_RE.test(ch) && opts.numberMode === 'lettered') {
        if (!inNumber) {
          out.push(opts.numberSign);
          inNumber = true;
        }
        out.push(MOON_MAP[DIGIT_TO_LETTER[ch]]);
        continue;
      }

      inNumber = false;

      if (/\s/.test(ch)) {
        out.push(ch);
        continue;
      }

      if (opts.unknown === 'keep') out.push(ch);
      // 'drop' emits nothing
    }
    return out.join('');
  }

  /**
   * Translate Moon type back to English capitals.
   * Accepts the canonical stand-ins plus common aliases. Characters that
   * are not Moon letters pass through unchanged.
   *
   * @param {string} text
   * @returns {string}
   */
  function fromMoon(text) {
    if (text == null) return '';
    var out = [];
    var chars = String(text).split('');
    for (var i = 0; i < chars.length; i++) {
      var ch = chars[i];
      if (REVERSE_MAP[ch]) {
        out.push(REVERSE_MAP[ch]);
      } else if (DECODE_ALIASES[ch]) {
        out.push(DECODE_ALIASES[ch]);
      } else {
        out.push(ch);
      }
    }
    return out.join('');
  }

  /** Convenience: the full alphabet as a single Moon string. */
  function alphabet() {
    return MOON_LETTERS.map(function (e) { return e.moon; }).join(' ');
  }

  return {
    VERSION: VERSION,
    MOON_LETTERS: MOON_LETTERS,
    FAMILIES: FAMILIES,
    MOON_MAP: MOON_MAP,
    REVERSE_MAP: REVERSE_MAP,
    DIGIT_TO_LETTER: DIGIT_TO_LETTER,
    toMoon: toMoon,
    fromMoon: fromMoon,
    alphabet: alphabet
  };
});
