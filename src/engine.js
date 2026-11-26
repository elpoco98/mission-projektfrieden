'use strict';
globalThis.MissionEngine = (() => {
  const C = globalThis.MissionContent;
  const questions = C.levels.flatMap(level => level.tasks);
  const questionById = Object.fromEntries(questions.map(q => [q.id, q]));
  const storageKey = 'mission-projektfrieden-v1';
  const fresh = () => ({ version: C.version, startedAt: null, updatedAt: null,
    route: { level: 0, stage: 'briefing', task: 0 }, answers: {}, reflections: {}, completed: [] });

  function grade(id, selected) {
    const q = questionById[id];
    if (!q || !Array.isArray(selected)) return false;
    const values = [...new Set(selected)];
    if (values.length !== selected.length) return false;
    return values.length === q.correct.length && values.every(x => q.correct.includes(x));
  }
  function answered(state, id) { return Boolean(state.answers[id]?.history?.length); }
  function mastered(state, id) { return Boolean(state.answers[id]?.history?.some(a => grade(id, a.selected))); }
  function score(state) { return questions.filter(q => mastered(state, q.id)).length; }
  function attempted(state) { return questions.filter(q => answered(state, q.id)).length; }
  function unlocked(state) { return Math.min(state.completed.length, C.levels.length - 1); }
  function allAnswered(state, index) { return C.levels[index].tasks.every(q => answered(state, q.id)); }

  function submit(state, id, selected, usedHint = false) {
    const q = questionById[id];
    const level = C.levels.findIndex(l => l.tasks.some(t => t.id === id));
    if (!q || level > unlocked(state)) throw new Error('Diese Aufgabe ist noch nicht freigeschaltet.');
    if (!Array.isArray(selected) || selected.length === 0 || selected.some(x => !q.options.some(o => o.id === x)))
      throw new Error('Wähle eine gültige Antwort.');
    if (new Set(selected).size !== selected.length || (q.type !== 'multi' && selected.length !== 1))
      throw new Error('Die Auswahl passt nicht zum Aufgabentyp.');
    if (q.type === 'multi' && selected.length !== q.correct.length)
      throw new Error(`Wähle genau ${q.correct.length} Antworten.`);
    const answer = state.answers[id] || { history: [] };
    answer.history.push({ selected: [...selected], usedHint: Boolean(usedHint) });
    state.answers[id] = answer;
    return { correct: grade(id, selected), score: score(state) };
  }
  function complete(state, index) {
    if (!Number.isInteger(index) || index < 0 || index >= C.levels.length || index > unlocked(state) || !allAnswered(state, index))
      throw new Error('Bearbeite zuerst alle Aufgaben dieses Levels.');
    if (!state.completed.includes(index)) state.completed.push(index);
    return state;
  }
  function competency(state, skill) {
    const relevant = questions.filter(q => q.skill === skill);
    const solved = relevant.filter(q => mastered(state, q.id));
    const help = solved.some(q => {
      const history = state.answers[q.id].history;
      const success = history.findIndex(a => grade(q.id, a.selected));
      return success > 0 || history.slice(0, success + 1).some(a => a.usedHint);
    });
    return { total: relevant.length, solved: solved.length, status: solved.length < relevant.length ? 'Weiter üben' : help ? 'Mit Unterstützung angewendet' : 'Im Fall sicher angewendet' };
  }
  function outcome(state) {
    const project = questions.filter(q => !q.id.startsWith('l7-'));
    const n = project.filter(q => mastered(state, q.id)).length;
    const critical = ['l3-2', 'l5-5', 'l6-1', 'l6-2'].every(id => mastered(state, id));
    if (n >= 13 && critical) return {
      title: 'Ein tragfähiger Weg ist vorbereitet.', tone: 'good',
      text: 'Du hast die Interessen geklärt, einen geeigneten Gesprächsrahmen gewählt und die Option anhand gemeinsamer Kriterien geprüft. Konkrete Verantwortlichkeiten und eine transparente Entscheidungsvorlage schaffen eine Grundlage für den nächsten Projektabschnitt. Der Startumfang wird von der zuständigen Instanz entschieden; der Projekterfolg ist damit noch nicht garantiert.'
    };
    if (n >= 8) return {
      title: 'Eine Arbeitsgrundlage mit offenen Punkten.', tone: 'warm',
      text: 'Mehrere deiner Entscheidungen unterstützen die Klärung. In anderen Situationen fehlen noch passende Schritte. Prüfe besonders den Gesprächsrahmen, die sachlichen Kriterien und die Verbindlichkeit von Vereinbarungen. Die Projektlage lässt sich mit weiteren Lernversuchen verbessern.'
    };
    return { title: 'Der Fall braucht weitere Klärung.', tone: 'warm',
      text: 'In mehreren Situationen ist ein nächster Klärungsschritt offen geblieben. Die bisherigen Entscheidungen reichen noch nicht für einen verlässlichen gemeinsamen Arbeitsplan. Kehre zu den markierten Aufgaben zurück, nutze das Feedback und probiere ein anderes Vorgehen aus.' };
  }

  function normalize(raw) {
    if (!raw || typeof raw !== 'object' || raw.version !== C.version) return null;
    const state = fresh();
    if (typeof raw.startedAt === 'string' && Number.isFinite(Date.parse(raw.startedAt))) state.startedAt = raw.startedAt;
    if (typeof raw.updatedAt === 'string' && Number.isFinite(Date.parse(raw.updatedAt))) state.updatedAt = raw.updatedAt;
    for (const q of questions) {
      const history = raw.answers?.[q.id]?.history;
      if (!Array.isArray(history)) continue;
      const valid = history.slice(-1000).filter(a => a && Array.isArray(a.selected) &&
        new Set(a.selected).size === a.selected.length &&
        a.selected.length === (q.type === 'multi' ? q.correct.length : 1) &&
        a.selected.every(x => q.options.some(o => o.id === x)))
        .map(a => ({ selected: [...a.selected], usedHint: Boolean(a.usedHint) }));
      if (valid.length) state.answers[q.id] = { history: valid };
    }
    for (let i = 0; i < C.levels.length; i++) {
      if (!Array.isArray(raw.completed) || !raw.completed.includes(i) || !allAnswered(state, i)) break;
      state.completed.push(i);
    }
    // Ein manipuliertes/kaputtes Save kann keine späteren Aufgaben freischalten.
    for (let i = unlocked(state) + 1; i < C.levels.length; i++)
      for (const q of C.levels[i].tasks) delete state.answers[q.id];
    const reflectionIds = C.levels.flatMap(l => l.reflections.map(r => r.id));
    for (const id of reflectionIds) if (typeof raw.reflections?.[id] === 'string')
      state.reflections[id] = raw.reflections[id].slice(0, 10000);
    const level = Number.isInteger(raw.route?.level) ? Math.max(0, Math.min(unlocked(state), raw.route.level)) : 0;
    const stage = ['briefing', 'mission', 'reflection'].includes(raw.route?.stage) ? raw.route.stage : 'briefing';
    const taskIndex = Number.isInteger(raw.route?.task) ? Math.max(0, Math.min(C.levels[level].tasks.length - 1, raw.route.task)) : 0;
    state.route = { level, stage: stage === 'reflection' && !allAnswered(state, level) ? 'mission' : stage, task: taskIndex };
    return state;
  }
  function load(storage) {
    try {
      const text = storage.getItem(storageKey);
      if (!text) return { state: fresh(), status: 'empty' };
      const state = normalize(JSON.parse(text));
      return state ? { state, status: 'loaded' } : { state: fresh(), status: 'invalid' };
    } catch { return { state: fresh(), status: 'unavailable' }; }
  }
  function save(state, storage) {
    state.updatedAt = new Date().toISOString();
    try { storage.setItem(storageKey, JSON.stringify(state)); return true; } catch { return false; }
  }
  return { questions, questionById, storageKey, fresh, grade, answered, mastered, score, attempted,
    unlocked, allAnswered, submit, complete, competency, outcome, normalize, load, save };
})();
