(function () {
  'use strict';

  var input = document.getElementById('input');
  var output = document.getElementById('output');
  var count = document.getElementById('count');
  var copyBtn = document.getElementById('copy');
  var copyNote = document.getElementById('copy-note');
  var swapBtn = document.getElementById('swap');
  var tabEncode = document.getElementById('tab-encode');
  var tabDecode = document.getElementById('tab-decode');
  var inputLabel = document.getElementById('input-label');
  var outputLabel = document.getElementById('output-label');

  var mode = 'encode'; // 'encode' | 'decode'
  var noteTimer = null;

  function translate() {
    var text = input.value;
    var result = mode === 'encode' ? MoonType.toMoon(text) : MoonType.fromMoon(text);
    output.textContent = result;
    output.classList.toggle('is-latin', mode === 'decode');
    count.textContent = result ? result.length + ' characters' : '';
  }

  function setMode(next) {
    mode = next;
    var encoding = mode === 'encode';
    tabEncode.setAttribute('aria-pressed', String(encoding));
    tabDecode.setAttribute('aria-pressed', String(!encoding));
    inputLabel.textContent = encoding ? 'Enter text' : 'Enter Moon type';
    outputLabel.textContent = encoding ? 'Moon type' : 'English';
    copyBtn.textContent = encoding ? 'Copy Moon text' : 'Copy English text';
    translate();
  }

  function flashNote(message) {
    copyNote.textContent = message;
    if (noteTimer) clearTimeout(noteTimer);
    noteTimer = setTimeout(function () { copyNote.textContent = ''; }, 2200);
  }

  function legacyCopy(text) {
    var helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    document.body.removeChild(helper);
    return ok;
  }

  function copyOutput() {
    var text = output.textContent;
    if (!text) { flashNote('Nothing to copy yet.'); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { flashNote('Copied.'); },
        function () { flashNote(legacyCopy(text) ? 'Copied.' : 'Select the text and copy manually.'); }
      );
    } else {
      flashNote(legacyCopy(text) ? 'Copied.' : 'Select the text and copy manually.');
    }
  }

  function swap() {
    var result = output.textContent;
    if (!result) { flashNote('Nothing to move yet.'); return; }
    input.value = result;
    setMode(mode === 'encode' ? 'decode' : 'encode');
    input.focus();
  }

  function buildChart() {
    var chart = document.getElementById('chart');
    MoonType.FAMILIES.forEach(function (family) {
      var members = MoonType.MOON_LETTERS.filter(function (e) { return e.family === family.id; });
      if (!members.length) return;

      var section = document.createElement('div');
      section.className = 'family';

      var head = document.createElement('div');
      head.className = 'family-head';
      var name = document.createElement('span');
      name.className = 'family-name';
      name.textContent = family.label;
      var note = document.createElement('span');
      note.className = 'family-note';
      note.textContent = family.note;
      head.appendChild(name);
      head.appendChild(note);
      section.appendChild(head);

      var tiles = document.createElement('div');
      tiles.className = 'tiles';
      members.forEach(function (entry) {
        var tile = document.createElement('button');
        tile.className = 'tile';
        tile.type = 'button';
        tile.setAttribute('aria-label', entry.letter + ' \u2013 ' + entry.shape);
        tile.title = entry.letter + ' \u2013 ' + entry.shape + '. Rendered as ' +
          entry.name + ' (' + entry.codepoint + ').';
        tile.addEventListener('click', function () {
          var pos = input.selectionStart != null ? input.selectionStart : input.value.length;
          input.value = input.value.slice(0, pos) + entry.moon + input.value.slice(pos);
          input.selectionStart = input.selectionEnd = pos + entry.moon.length;
          if (mode !== 'decode') setMode('decode');
          else translate();
          input.focus();
        });

        var glyph = document.createElement('span');
        glyph.className = 'glyph';
        glyph.textContent = entry.moon;
        var latin = document.createElement('span');
        latin.className = 'latin';
        latin.textContent = entry.letter;
        var cp = document.createElement('span');
        cp.className = 'cp';
        cp.textContent = entry.codepoint;

        tile.appendChild(glyph);
        tile.appendChild(latin);
        tile.appendChild(cp);
        tiles.appendChild(tile);
      });
      section.appendChild(tiles);
      chart.appendChild(section);
    });
  }

  // The page demonstrates itself: the subtitle is the title, in Moon.
  document.getElementById('hero-moon').textContent = MoonType.toMoon('Moon Type Generator');

  input.addEventListener('input', translate);
  copyBtn.addEventListener('click', copyOutput);
  swapBtn.addEventListener('click', swap);
  tabEncode.addEventListener('click', function () { setMode('encode'); });
  tabDecode.addEventListener('click', function () { setMode('decode'); });

  buildChart();
  translate();
})();
