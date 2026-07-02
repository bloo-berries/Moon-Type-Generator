'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const MoonType = require('../src/moon.js');
const { toMoon, fromMoon, MOON_LETTERS, MOON_MAP, FAMILIES } = MoonType;

test('alphabet covers exactly A–Z, once each', () => {
  assert.equal(MOON_LETTERS.length, 26);
  const letters = MOON_LETTERS.map((e) => e.letter).sort().join('');
  assert.equal(letters, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
});

test('every Moon stand-in is a single, unique character', () => {
  const seen = new Set();
  for (const entry of MOON_LETTERS) {
    assert.equal([...entry.moon].length, 1, `${entry.letter} maps to one code point`);
    assert.ok(!seen.has(entry.moon), `${entry.moon} is not reused`);
    seen.add(entry.moon);
  }
});

test('metadata is complete and code points match the characters', () => {
  const familyIds = new Set(FAMILIES.map((f) => f.id));
  for (const entry of MOON_LETTERS) {
    assert.ok(entry.name.length > 0, `${entry.letter} has a Unicode name`);
    assert.ok(entry.shape.length > 0, `${entry.letter} has a shape description`);
    assert.ok(familyIds.has(entry.family), `${entry.letter} belongs to a known family`);
    const declared = parseInt(entry.codepoint.replace('U+', ''), 16);
    assert.equal(entry.moon.codePointAt(0), declared, `${entry.letter} code point matches`);
  }
});

test('letters unchanged from print map to themselves', () => {
  for (const letter of ['C', 'J', 'L', 'N', 'O', 'U', 'V', 'Z']) {
    assert.equal(MOON_MAP[letter], letter);
  }
});

test('encoding is case-insensitive and preserves spacing', () => {
  assert.equal(toMoon('Moon'), toMoon('MOON'));
  assert.equal(toMoon('MOON'), '\u2142OON');
  assert.equal(toMoon('HELLO WORLD'), '\u25D0\u0393LLO \u2229O\u2216L\u0186');
  assert.equal(toMoon('a b'), '\u039B B'.replace('B', '\u053C'));
  assert.equal(toMoon('one\ntwo'), toMoon('one') + '\n' + toMoon('two'));
});

test('round trip: decode(encode(x)) returns the uppercase original', () => {
  const samples = [
    'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG',
    'Pack my box with five dozen liquor jugs',
    'William Moon, Brighton, 1845!'
  ];
  for (const sample of samples) {
    assert.equal(fromMoon(toMoon(sample)), sample.toUpperCase());
  }
});

test('punctuation and unknown characters pass through by default', () => {
  assert.equal(toMoon('!?.,;:'), '!?.,;:');
  assert.equal(toMoon('12 cats'), '12 C\u039B\u2014\u2215');
});

test('unknown: drop removes untranslatable characters', () => {
  assert.equal(toMoon('a.b!', { unknown: 'drop' }), '\u039B\u053C');
});

test('lettered number mode uses number sign + A–J, once per run of digits', () => {
  assert.equal(toMoon('42', { numberMode: 'lettered' }), '#\u0186\u053C');
  assert.equal(
    toMoon('year 1845', { numberMode: 'lettered' }),
    toMoon('year') + ' #\u039B\u25D0\u0186\u0393'
  );
  assert.equal(
    toMoon('1 2', { numberMode: 'lettered' }),
    '#\u039B #\u053C'
  );
  assert.equal(toMoon('7', { numberMode: 'lettered', numberSign: '№' }), '№\u0295');
});

test('decoding accepts common ASCII and near-identical aliases', () => {
  assert.equal(fromMoon('|'), 'I');
  assert.equal(fromMoon('\\'), 'R');
  assert.equal(fromMoon('/'), 'S');
  assert.equal(fromMoon('\u2212'), 'T');
  assert.equal(fromMoon('\u00AC'), 'M');
});

test('null and empty input are safe', () => {
  assert.equal(toMoon(null), '');
  assert.equal(toMoon(''), '');
  assert.equal(fromMoon(undefined), '');
});
