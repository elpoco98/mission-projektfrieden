'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
require('../src/content.js');
require('../src/engine.js');
const C = globalThis.MissionContent, E = globalThis.MissionEngine;
const wrong = q => q.type === 'multi' ? [...q.correct.slice(1), q.options.find(o => !q.correct.includes(o.id)).id] : [q.options.find(o => !q.correct.includes(o.id)).id];
function walkthrough(right = 20) {
  const state = E.fresh(); let index = 0;
  state.startedAt = new Date().toISOString();
  for (const [li, level] of C.levels.entries()) {
    for (const q of level.tasks) E.submit(state, q.id, index++ < right ? q.correct : wrong(q));
    E.complete(state, li);
  }
  return state;
}

test('Sieben Levels, genau 20 Aufgaben und 60 Minuten mit geforderter Verteilung', () => {
  assert.equal(C.levels.length, 7); assert.equal(E.questions.length, 20);
  assert.deepEqual(C.levels.map(l => l.tasks.length), [2, 3, 2, 3, 5, 2, 3]);
  assert.deepEqual(C.levels.map(l => l.minutes), [5, 8, 7, 10, 15, 8, 7]);
  assert.equal(C.levels.reduce((sum, l) => sum + l.minutes, 0), 60);
});
test('Jede Aufgabe hat eindeutige IDs, begründete Lösungen, Feedback und nächsten Schritt', () => {
  assert.equal(new Set(E.questions.map(q => q.id)).size, 20);
  for (const q of E.questions) {
    assert.ok(q.explanation.length > 30); assert.ok(q.next.length > 20); assert.ok(q.hint);
    assert.ok(q.correct.length >= 1); assert.ok(q.skill >= 0 && q.skill < C.skills.length);
    assert.equal(new Set(q.options.map(o => o.id)).size, q.options.length);
    for (const o of q.options) assert.ok(o.text && o.why.length > 20);
    for (const id of q.correct) assert.ok(q.options.some(o => o.id === id));
    if (q.type !== 'multi') assert.equal(q.correct.length, 1);
  }
});
test('Alle fünf bewerteten Gesprächsschritte haben mögliche Figurenreaktionen', () => {
  const dialogue = C.levels[4].tasks;
  assert.equal(dialogue.length, 5);
  for (const q of dialogue) {
    assert.equal(q.type, 'dialogue');
    for (const o of q.options) assert.ok(C.characters[o.reaction.split('|')[0]]);
  }
});
test('Jedes Level enthält Theorie, Reflexion und einen Transfermerksatz', () => {
  for (const l of C.levels) {
    assert.ok(l.theory.length >= 2); assert.ok(l.reflections.length); assert.ok(l.takeaway);
    for (const r of l.reflections) assert.ok(r.id && r.prompt && r.label);
  }
  assert.equal(new Set(C.levels.flatMap(l => l.reflections.map(r => r.id))).size, C.levels.flatMap(l => l.reflections).length);
});
test('Eine korrekte Antwort ergibt genau einen Punkt, Wiederholung keine Zusatzpunkte', () => {
  const s = E.fresh(); E.submit(s, 'l1-1', ['b']); E.submit(s, 'l1-1', ['b']);
  assert.equal(E.score(s), 1); assert.equal(E.attempted(s), 1);
});
test('Eine Wiederholung kann eine offene Aufgabe korrigieren', () => {
  const s = E.fresh(); E.submit(s, 'l1-1', ['a']); assert.equal(E.score(s), 0);
  E.submit(s, 'l1-1', ['b']); assert.equal(E.score(s), 1);
  assert.equal(E.competency(s, 0).solved, 1);
});
test('Ein erreichter Punkt bleibt auch bei späteren Fehlversuchen erhalten', () => {
  const s = E.fresh(); E.submit(s, 'l1-1', ['b']); E.submit(s, 'l1-1', ['a']);
  assert.equal(E.score(s), 1);
});
test('Mehrfachauswahl erfordert die exakte Menge, Reihenfolge ist egal', () => {
  assert.equal(E.grade('l3-1', ['c', 'a']), true);
  assert.equal(E.grade('l3-1', ['a']), false);
  assert.equal(E.grade('l3-1', ['a', 'b']), false);
  assert.equal(E.grade('l3-1', ['a', 'b', 'c']), false);
  assert.equal(E.grade('l3-1', ['a', 'a']), false);
  assert.equal(E.grade('l3-1', ['a', 'a', 'c']), false);
});
test('Leere, doppelte, unbekannte und unzulässige Antworten werden verworfen', () => {
  const s = E.fresh();
  for (const selection of [[], ['x'], ['b', 'b'], ['a', 'b']]) assert.throws(() => E.submit(s, 'l1-1', selection));
  assert.equal(E.score(s), 0); assert.throws(() => E.submit(s, 'unbekannt', ['a']));
});
test('Ein gesperrtes Level kann nicht beantwortet oder abgeschlossen werden', () => {
  const s = E.fresh(); assert.throws(() => E.submit(s, 'l7-3', ['a']));
  assert.throws(() => E.complete(s, 6)); assert.throws(() => E.complete(s, 0));
});
test('Levelabschluss verlangt Bearbeitung, keine Mindestpunktzahl oder Reflexion', () => {
  const s = E.fresh(); E.submit(s, 'l1-1', ['a']); E.submit(s, 'l1-2', ['a']);
  E.complete(s, 0); assert.equal(E.unlocked(s), 1); assert.equal(E.score(s), 0);
  E.complete(s, 0); assert.deepEqual(s.completed, [0]);
});
test('Vollständiger korrekter Durchlauf erzielt 20 Punkte und sieben Abschlüsse', () => {
  const s = walkthrough(); assert.equal(E.score(s), 20); assert.equal(s.completed.length, 7);
  assert.equal(E.outcome(s).tone, 'good'); assert.equal(E.attempted(s), 20);
});
test('Bestehensgrenze: 13 reichen nicht, 14 Punkte reichen', () => {
  assert.equal(E.score(walkthrough(13)) >= C.passScore, false);
  assert.equal(E.score(walkthrough(14)) >= C.passScore, true);
});
test('Alle drei Fallausgänge sind erreichbar', () => {
  assert.match(E.outcome(walkthrough(0)).title, /weitere Klärung/);
  assert.match(E.outcome(walkthrough(10)).title, /offenen Punkten/);
  assert.match(E.outcome(walkthrough(20)).title, /tragfähiger Weg/);
});
test('Ein kritischer offener Schritt verhindert den besten Projektstand', () => {
  const s = walkthrough(20); s.answers['l6-2'].history = [{ selected: wrong(E.questionById['l6-2']), usedHint: false }];
  assert.notEqual(E.outcome(s).tone, 'good');
});
test('Neuberechnung nach Wiederholungen verbessert den Fallausgang', () => {
  const s = walkthrough(0); const old = E.outcome(s).title;
  for (const q of E.questions) E.submit(s, q.id, q.correct);
  assert.notEqual(E.outcome(s).title, old); assert.equal(E.outcome(s).tone, 'good');
});
test('Reflexionen beeinflussen weder Bewertung noch Bestehen', () => {
  const s = walkthrough(14); const before = E.score(s);
  s.reflections.opening = 'Ein beliebiger persönlicher Text'; assert.equal(E.score(s), before);
});
test('Lernbilanz unterscheidet korrekte Erstversuche, Hilfe und Wiederholung', () => {
  const direct = walkthrough(20); assert.equal(E.competency(direct, 0).status, 'Im Fall sicher angewendet');
  direct.answers['l1-1'].history[0].usedHint = true;
  assert.equal(E.competency(direct, 0).status, 'Mit Unterstützung angewendet');
  const retry = walkthrough(0); for (const q of E.questions.filter(q => q.skill === 0)) E.submit(retry, q.id, q.correct);
  assert.equal(E.competency(retry, 0).status, 'Mit Unterstützung angewendet');
});
test('Spielstand-Roundtrip erhält Fortschritt, Antworten und Notizen', () => {
  let value; const storage = { setItem: (key, text) => { value = text; }, getItem: () => value };
  const s = walkthrough(20); s.reflections.transferQuestion = 'Was ist dir wichtig?';
  assert.equal(E.save(s, storage), true);
  const result = E.load(storage); assert.equal(result.status, 'loaded');
  assert.equal(E.score(result.state), 20); assert.equal(result.state.completed.length, 7);
  assert.equal(result.state.reflections.transferQuestion, 'Was ist dir wichtig?');
});
test('Keine Speicherung und beschädigtes JSON blockieren die Sitzung nicht', () => {
  assert.equal(E.load({ getItem: () => null }).status, 'empty');
  assert.equal(E.load({ getItem: () => '{kaputt' }).status, 'unavailable');
  assert.equal(E.load(undefined).status, 'unavailable');
  assert.equal(E.save(E.fresh(), { setItem() { throw new Error('quota'); } }), false);
});
test('Unbekannte Spielstandversion wird zurückgewiesen', () => {
  assert.equal(E.normalize({ version: 999 }), null);
  assert.equal(E.normalize(null), null);
});
test('Manipulierte Punktfelder werden ignoriert, Antworten neu ausgewertet', () => {
  const s = E.fresh(); s.score = 20; s.answers['l1-1'] = { correct: true, history: [{ selected: ['a'], correct: true }] };
  const clean = E.normalize(s); assert.equal(E.score(clean), 0);
});
test('Manipulierte Freischaltungen und unbekannte Antworten werden entfernt', () => {
  const s = E.fresh(); s.completed = [0, 1, 2, 3, 4, 5, 6];
  s.answers['l7-3'] = { history: [{ selected: ['a'] }] };
  s.answers['l1-1'] = { history: [{ selected: ['does-not-exist'] }] };
  const clean = E.normalize(s); assert.deepEqual(clean.completed, []);
  assert.equal(E.attempted(clean), 0);
});
test('Ungültige Route wird auf einen erlaubten Spielabschnitt begrenzt', () => {
  const s = E.fresh(); s.route = { level: 999, stage: 'reflection', task: -9 };
  assert.deepEqual(E.normalize(s).route, { level: 0, stage: 'mission', task: 0 });
});
test('Notizen bleiben Text und sind auf bekannte Felder und eine sinnvolle Länge begrenzt', () => {
  const s = E.fresh(); s.reflections = { observation: '<script>alert(1)</script>', opening: 'a'.repeat(20000), unknown: 'nein' };
  const clean = E.normalize(s); assert.equal(clean.reflections.observation, '<script>alert(1)</script>');
  assert.equal(clean.reflections.opening.length, 10000); assert.equal(clean.reflections.unknown, undefined);
});
