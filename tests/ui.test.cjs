'use strict';
// Ereignis- und Renderprüfung mit einer kleinen DOM-Attrappe, kein Browser-/Layouttest.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

function harness({ saved, unavailable = false } = {}) {
  const listeners = {}, elements = {}, values = { checked: [], saved };
  const noop = () => {};
  function element(id) {
    return elements[id] ||= { innerHTML: '', textContent: '', disabled: false, focus: noop, scrollIntoView: noop };
  }
  const app = element('app');
  app.addEventListener = (name, fn) => { listeners[name] = fn; };
  app.querySelectorAll = query => query === 'input[name="choice"]:checked' ? values.checked.map(value => ({ value })) : [];
  const localStorage = {
    getItem() { if (unavailable) throw Error('disabled'); return values.saved || null; },
    setItem(key, value) { if (unavailable) throw Error('disabled'); values.saved = value; }
  };
  const context = vm.createContext({ console, setTimeout, URL, Blob,
    document: { getElementById: element, querySelector: () => null, querySelectorAll: () => [], addEventListener: noop },
    window: { localStorage, scrollTo: noop, addEventListener: noop, print: noop }
  });
  for (const name of ['content', 'engine', 'app']) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', `${name}.js`), 'utf8'), context, { filename: `${name}.js` });
  const click = (action, data = {}) => listeners.click({ preventDefault: noop, target: { closest: () => ({ dataset: { action, ...data }, disabled: false }) } });
  const choose = selected => { values.checked = selected; listeners.change({ target: { name: 'choice' } }); };
  const submit = () => listeners.submit({ preventDefault: noop, target: { id: 'answer-form' } });
  const input = (id, value) => listeners.input({ target: { dataset: { reflection: id }, value } });
  return { click, choose, submit, input, values, app, context, listeners, elements };
}
function playThrough(ui, correct = true) {
  ui.click('start');
  for (const level of ui.context.MissionContent.levels) {
    assert.match(ui.app.innerHTML, new RegExp(level.title));
    ui.click('begin-mission');
    for (const q of level.tasks) {
      assert.ok(ui.app.innerHTML.includes(q.title));
      const selection = correct ? Array.from(q.correct) : q.type === 'multi' ? [...Array.from(q.correct).slice(1), q.options.find(o => !q.correct.includes(o.id)).id] : [q.options.find(o => !q.correct.includes(o.id)).id];
      ui.choose(selection); ui.submit();
      assert.match(ui.app.innerHTML, /feedback-title/);
      assert.ok(ui.app.innerHTML.includes(q.next));
      for (const o of q.options) assert.ok(ui.app.innerHTML.includes(o.why));
      ui.click('next-task');
    }
    assert.match(ui.app.innerHTML, /Was nimmst du mit/);
    for (const r of level.reflections) ui.input(r.id, `Meine Notiz: ${r.label}`);
    ui.click('complete-level');
  }
}

test('Startseite rendert ohne Netzwerk oder gespeicherten Stand', () => {
  const ui = harness(); assert.match(ui.app.innerHTML, /Vier Wochen/); assert.match(ui.app.innerHTML, /Mission starten/);
});
test('Vollständiger Ablauf durch alle Levels, Aufgaben und Reflexionen', () => {
  const ui = harness(); playThrough(ui);
  assert.match(ui.app.innerHTML, /MISSION BESTANDEN/); assert.match(ui.app.innerHTML, /20 von 20 Punkten/);
  assert.match(ui.app.innerHTML, /Meine Notiz: Meine nächste gute Frage/);
  const saved = JSON.parse(ui.values.saved); assert.equal(saved.completed.length, 7); assert.equal(Object.keys(saved.answers).length, 20);
  assert.equal(Object.keys(saved.reflections).length, 12);
});
test('Auch ein Durchlauf mit Fehlern erreicht den Abschluss und erlaubt Korrekturen', () => {
  const ui = harness(); playThrough(ui, false);
  assert.match(ui.app.innerHTML, /0 von 20 Punkten/); assert.doesNotMatch(ui.app.innerHTML, /MISSION BESTANDEN/);
  ui.click('review', { id: 'l1-1' }); ui.choose(['b']); ui.submit(); ui.click('summary');
  assert.match(ui.app.innerHTML, /1 von 20 Punkten/);
});
test('Denkhilfe, ungünstige Antwort, Dialogreaktion und Wiederholung funktionieren', () => {
  const ui = harness(); playThrough(ui, false);
  ui.click('review', { id: 'l5-1' }); ui.click('hint');
  assert.match(ui.app.innerHTML, /DENKHILFE 1/);
  ui.choose(['a']); ui.submit(); assert.match(ui.app.innerHTML, /Du stellst mich gerade als das Problem dar/);
  ui.click('retry'); ui.choose(['b']); ui.submit(); assert.match(ui.app.innerHTML, /Das bringt die Klärung weiter/);
});
test('Gespeicherter Spielstand setzt an der richtigen Stelle fort', () => {
  const ui = harness(); ui.click('start'); ui.click('begin-mission'); ui.choose(['b']); ui.submit(); ui.click('next-task');
  const resumed = harness({ saved: ui.values.saved }); assert.match(resumed.app.innerHTML, /Mission fortsetzen/);
  resumed.click('resume'); assert.match(resumed.app.innerHTML, /Was weisst du wirklich/);
  assert.match(resumed.app.innerHTML, /1<span>\/20/);
});
test('Journal zeigt aktuelle und frühere Versuche; Archivsuche filtert Theorie', () => {
  const ui = harness(); ui.click('start'); ui.click('begin-mission'); ui.choose(['a']); ui.submit();
  ui.click('retry'); ui.choose(['b']); ui.submit(); ui.click('timeline');
  assert.match(ui.app.innerHTML, /Vorherige Versuche vergleichen/); assert.match(ui.app.innerHTML, /2 Versuche/);
  ui.click('archive'); assert.match(ui.app.innerHTML, /Die fünf Konfliktstile/);
  ui.listeners.input({ target: { id: 'archive-search', value: 'Harvard', dataset: {} } });
  assert.match(ui.elements['archive-results'].innerHTML, /Harvard/);
  assert.doesNotMatch(ui.elements['archive-results'].innerHTML, /Wann ist es ein Konflikt/);
});
test('Persönliche Texte werden maskiert statt als HTML ausgeführt', () => {
  const ui = harness(); ui.click('start'); ui.input('observation', '<img src=x onerror=alert(1)>'); ui.click('summary');
  assert.match(ui.app.innerHTML, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(ui.app.innerHTML, /<img src=x/);
});
test('Nicht verfügbarer Speicher verhindert keinen Lernschritt', () => {
  const ui = harness({ unavailable: true }); ui.click('start');
  assert.match(ui.app.innerHTML, /Speicher nicht verfügbar/);
  ui.click('begin-mission'); ui.choose(['b']); ui.submit(); assert.match(ui.app.innerHTML, /Das bringt die Klärung weiter/);
});
