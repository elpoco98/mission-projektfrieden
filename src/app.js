'use strict';
(() => {
  const C = globalThis.MissionContent;
  const E = globalThis.MissionEngine;
  const root = document.getElementById('app');
  let storage;
  try { storage = window.localStorage; } catch { /* Sitzung funktioniert auch ohne Speicher. */ }
  const loaded = E.load(storage);
  let state = loaded.state;
  let view = 'home';
  let selected = new Set();
  let editing = false;
  let hints = 0;
  let drawer = false;
  let filter = '';
  let saveOk = loaded.status !== 'unavailable';
  let notice = loaded.status === 'invalid' ? 'Der gespeicherte Stand ist nicht mit dieser Version kompatibel. Du kannst neu beginnen.' : loaded.status === 'unavailable' ? 'Ein gespeicherter Stand konnte nicht gelesen werden. Die Sitzung funktioniert; du kannst deine Notizen am Ende exportieren.' : '';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const paths = {
    radar: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="m12 12 7-7"/>',
    layers: '<path d="m12 3 10 6-10 6L2 9Zm-9 11 9 5 9-5M3 19l9 5 9-5"/>',
    shield: '<path d="M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7Z"/><path d="M12 8v5m0 3v.1"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6Z"/>',
    chat: '<path d="M4 4h16v12H9l-5 4Z"/><path d="M8 8h8M8 12h5"/>',
    checklist: '<path d="M10 5h11M10 12h11M10 19h11M2 5l2 2 3-4M2 12l2 2 3-4M2 19l2 2 3-4"/>',
    flag: '<path d="M5 22V3m0 1c4-4 10 4 15 0v10c-5 4-11-4-15 0"/>',
    check: '<path d="m5 12 4 4L20 5"/>',
    book: '<path d="M12 6C9 3 5 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-7-1-10 2Zm0 0v15"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    replay: '<path d="M3 10a9 9 0 1 1 2 8M3 3v7h7"/>',
    home: '<path d="m3 10 9-7 9 7v11H3Zm6 11v-8h6v8"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/>',
    save: '<path d="M4 3h13l4 4v14H3V3Zm3 0v7h10V3M7 21v-7h10v7"/>',
    close: '<path d="m5 5 14 14M5 19 19 5"/>',
    menu: '<path d="M3 5h18M3 12h18M3 19h18"/>',
    bulb: '<path d="M9 18h6m-5 4h4M8 14a7 7 0 1 1 8 0l-1 2H9Z"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M3 16v5h18v-5"/>',
    search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 10v7m0-10v.1"/>',
    spark: '<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>',
    print: '<path d="M6 8V2h12v6M6 17H3V8h18v9h-3M6 13h12v9H6Z"/>'
  };
  function icon(name, cls = '') { return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.spark}</svg>`; }
  function logo() { return `<span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="M8 26V12l12 7 12-7v14l-12 7Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg></span><span class="brand-text">MISSION<span>PROJEKTFRIEDEN</span></span>`; }
  function portrait(key, cls = '') {
    const p = C.characters[key];
    const longHair = ['mara', 'sponsor', 'nina'].includes(key);
    return `<span class="portrait ${cls}" style="--portrait:${p.color}" aria-hidden="true"><svg viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="${p.color}"/><path d="M9 64c1-16 10-23 23-23s22 7 23 23" fill="${longHair ? '#eee4d1' : '#203d44'}"/>${longHair ? '<path d="M15 43V26c0-23 35-23 35 0v20L39 37H25Z" fill="#3c302d"/>' : '<path d="M17 26c0-22 31-22 31 0l-4 9H21Z" fill="#302b29"/>'}<ellipse cx="32" cy="29" rx="12" ry="16" fill="#e8b697"/><path d="M20 25c0-13 23-17 26-1-9 0-12-5-14-8-3 5-6 7-12 9" fill="#3c302d"/><path d="M26 30h1m10 0h1" stroke="#44312b" stroke-width="2" stroke-linecap="round"/><path d="M29 37q3 3 6 0" fill="none" stroke="#986452" stroke-width="1.5"/>${!longHair ? '<path d="M21 33q11 17 22 0-2 16-11 13-8 0-11-13" fill="#51403a" opacity=".6"/>' : ''}</svg></span>`;
  }
  function dialogue(key, text, cls = '') {
    const p = C.characters[key];
    return `<div class="dialogue ${cls}">${portrait(key)}<div><div class="person-name">${esc(p.name)} <span>${esc(p.role)}</span></div><p>«${esc(text)}»</p></div></div>`;
  }
  function persist() { saveOk = E.save(state, storage); updateSaveLabel(); }
  function updateSaveLabel() {
    const el = document.getElementById('save-label');
    if (el) { el.innerHTML = `${icon(saveOk ? 'check' : 'info')}<span>${saveOk ? 'Lokal gespeichert' : 'Speicher nicht verfügbar'}</span>`; }
  }
  function announce(text) { document.getElementById('announcer').textContent = text; }
  function focusMain() { document.getElementById('main')?.focus({ preventScroll: true }); }
  function render(focus = true) {
    if (view === 'home') root.innerHTML = home();
    else root.innerHTML = shell();
    if (focus) { focusMain(); window.scrollTo({ top: 0, behavior: 'instant' }); }
  }

  function home() {
    const hasSave = Boolean(state.startedAt);
    return `<div class="landing"><header class="landing-header"><a href="#" class="brand" data-action="home" aria-label="Mission Projektfrieden, Startseite">${logo()}</a><div class="edition">INTERAKTIVES LERNSPIEL <span>·</span> KONFLIKTMANAGEMENT</div><button class="button text-button" data-action="archive">${icon('book')} Wissensarchiv</button></header>
      <main id="main" tabindex="-1" class="landing-main">
        ${notice ? `<div class="notice">${icon('info')}<p>${esc(notice)}</p></div>` : ''}
        <div class="hero-copy"><div class="eyebrow"><span class="live-dot"></span> DEIN PROJEKT BRAUCHT DICH</div>
        <h1>Vier Wochen.<br>Ein Portal.<br><em>Zwei Fronten.</em></h1>
        <p class="hero-description">Der Start rückt näher. Die Fronten verhärten sich.<br class="desktop-only"> Kannst du aus einem Konflikt einen gemeinsamen Plan machen?</p>
        <div class="hero-actions"><button class="button primary large" data-action="${hasSave ? 'resume' : 'start'}">${icon(hasSave ? 'replay' : 'flag')} ${hasSave ? 'Mission fortsetzen' : 'Mission starten'}</button>${hasSave ? '<button class="button text-button" data-action="reset">Neu beginnen</button>' : '<span class="no-account">Ohne Anmeldung.<br>In deinem Tempo.</span>'}</div>
        <div class="hero-facts"><span>${icon('clock')} ca. 60 Minuten</span><span>${icon('layers')} 7 Levels</span><span>${icon('chat')} 20 Entscheidungen</span></div>
        ${hasSave ? `<p class="resume-note">Dein Stand: Level ${state.route.level + 1} · ${E.score(state)} von 20 Punkten · ${state.completed.length} Levels abgeschlossen</p>` : ''}</div>
        <div class="hero-scene" aria-label="Projektakte Kundenportal: Mara benötigt Kundennutzen, Leon benötigt Stabilität.">
          <div class="scene-grid" aria-hidden="true"></div><div class="scene-orbit orbit-one" aria-hidden="true"></div><div class="scene-orbit orbit-two" aria-hidden="true"></div>
          <div class="floating-tag">${icon('flag')} PROJEKT KUNDENPORTAL <span>START IN 4 WOCHEN</span></div>
          <div class="portal-window"><div class="window-top"><span class="window-dots"><i></i><i></i><i></i></span><span>kundenportal / projektlage</span>${icon('lock')}</div><div class="portal-content"><div class="portal-mini-nav"><span class="mini-logo"></span><i></i><i></i><i></i></div><div class="portal-project"><div class="portal-label">GEMEINSAMES ZIEL</div><h2>Ein guter Start.</h2><p>Nutzen. Qualität. Zusammenarbeit.</p><div class="project-path" aria-hidden="true"><span></span><i></i><span></span><i></i><span></span></div><div class="portal-bars" aria-hidden="true"><b></b><b></b><b></b></div><div class="portal-status">${icon('info')} Abstimmung erforderlich</div></div></div></div>
          <div class="hero-person mara-person">${portrait('mara', 'large-portrait')}<div><b>Mara</b><span>VERTRIEB</span></div><p>«Der Kunde braucht<br>diese Funktionen.»</p></div>
          <div class="hero-person leon-person">${portrait('leon', 'large-portrait')}<div><b>Leon</b><span>ENTWICKLUNG</span></div><p>«Wir brauchen einen<br>realistischen Umfang.»</p></div>
          <div class="hero-role">${icon('compass')}<div><b>Deine Rolle: Projektleitung</b><span>Verstehen. Entscheiden. Gemeinsam weiterkommen.</span></div></div>
        </div>
      </main><footer class="landing-footer"><p>Kein Konflikt ist wie der andere.<br><strong>Dein nächster Schritt macht einen Unterschied.</strong></p><div class="landing-roadmap">${C.levels.map(l => `<span title="${esc(l.title)}">${icon(l.icon)}</span>`).join('<i></i>')}</div><span class="footer-caption">VOM ERSTEN SIGNAL<br>ZUR KONKRETEN VEREINBARUNG</span></footer></div>`;
  }

  function sidebar() {
    const n = E.attempted(state);
    return `<aside class="sidebar ${drawer ? 'is-open' : ''}" id="sidebar" aria-label="Spielnavigation"><a href="#" class="brand" data-action="home" aria-label="Zur Startseite">${logo()}</a><button class="mobile-close icon-button" data-action="menu" aria-label="Navigation schliessen">${icon('close')}</button>
      <div class="sidebar-project"><span class="eyebrow">DEIN AUFTRAG</span><strong>Projekt Kundenportal</strong><span>Konflikte konstruktiv klären</span></div>
      <div class="nav-caption">DEIN MISSIONSWEG</div><nav aria-label="Levels"><ol class="level-list">${C.levels.map((l, i) => {
        const done = state.completed.includes(i), locked = i > E.unlocked(state), active = view === 'play' && state.route.level === i;
        return `<li><button data-action="level" data-level="${i}" ${locked ? 'disabled' : ''} ${active ? 'aria-current="step"' : ''} class="level-link ${done ? 'done' : ''} ${active ? 'active' : ''}"><span class="level-number">${done ? icon('check') : locked ? icon('lock') : String(i + 1).padStart(2, '0')}</span><span>${esc(l.short)}<small>${l.minutes} Min.${done ? ' · abgeschlossen' : locked ? ' · gesperrt' : ''}</small></span></button></li>`;
      }).join('')}</ol></nav>
      <div class="sidebar-bottom"><div class="progress-label"><span>Entscheidungen bearbeitet</span><b>${n}/20</b></div><div class="progress-track" role="progressbar" aria-label="Entscheidungen bearbeitet" aria-valuemin="0" aria-valuemax="20" aria-valuenow="${n}"><span style="width:${n / 20 * 100}%"></span></div>
      <button class="utility-link ${view === 'timeline' ? 'active' : ''}" data-action="timeline">${icon('replay')} Entscheidungsjournal</button><button class="utility-link ${view === 'archive' ? 'active' : ''}" data-action="archive">${icon('book')} Wissensarchiv</button><button class="utility-link ${view === 'summary' ? 'active' : ''}" data-action="summary">${icon('flag')} Meine Werkzeugkarte</button><button class="utility-link" data-action="home">${icon('home')} Startseite</button></div></aside>`;
  }
  function shell() {
    return `<div class="game-shell">${sidebar()}${drawer ? '<button class="nav-backdrop" data-action="menu" aria-label="Navigation schliessen"></button>' : ''}<div class="game-body"><header class="game-header"><div><button class="icon-button mobile-menu" data-action="menu" aria-label="Navigation öffnen" aria-expanded="${drawer}" aria-controls="sidebar">${icon('menu')}</button><span class="header-label">MISSION PROJEKTFRIEDEN</span><span class="header-divider">/</span><span>${view === 'play' ? 'Projektleitungsbüro' : view === 'archive' ? 'Wissensarchiv' : view === 'timeline' ? 'Entscheidungsjournal' : 'Werkzeugkarte'}</span></div><div class="header-right"><span class="save-label" id="save-label">${icon(saveOk ? 'check' : 'info')}<span>${saveOk ? 'Lokal gespeichert' : 'Speicher nicht verfügbar'}</span></span><span class="score-pill">${icon('spark')} ${E.score(state)}<span>/20</span></span></div></header>
      <main id="main" class="game-main" tabindex="-1">${!saveOk ? '<div class="notice">Dein Browser erlaubt keine zuverlässige Speicherung. Du kannst weiterspielen und deine Notizen über die Werkzeugkarte exportieren.</div>' : ''}${view === 'play' ? play() : view === 'archive' ? archive() : view === 'timeline' ? timeline() : summary()}</main><footer class="game-footer"><span>Deine Entscheidungen. Dein Lerntempo.</span><span>Reflexionen bleiben in diesem Browser. Keine Übertragung.</span></footer></div></div>`;
  }
  function play() {
    const l = C.levels[state.route.level];
    const stage = state.route.stage;
    return `<div class="level-heading"><div class="eyebrow">LEVEL ${String(l.id).padStart(2, '0')} <span> / </span> ${esc(l.kicker)}</div><h1>${esc(l.title)}</h1><div class="level-subline"><p>${esc(l.objective)}</p><span>${icon('clock')} Richtzeit ${l.minutes} Min.</span></div></div>
      <nav class="stage-tabs" aria-label="Abschnitte dieses Levels">${[['briefing', 'Briefing', 'book'], ['mission', 'Mission', 'compass'], ['reflection', 'Reflexion', 'checklist']].map(([id, label, glyph]) => `<button class="stage-tab ${stage === id ? 'selected' : ''}" data-action="stage" data-stage="${id}" ${id === 'reflection' && !E.allAnswered(state, state.route.level) ? 'disabled' : ''} ${stage === id ? 'aria-current="page"' : ''}>${icon(glyph)} ${label}${id === 'mission' ? `<span>${l.tasks.filter(q => E.answered(state, q.id)).length}/${l.tasks.length}</span>` : ''}</button>`).join('')}</nav>
      <div class="play-grid"><div class="play-primary">${stage === 'briefing' ? briefing(l) : stage === 'mission' ? mission(l) : reflection(l)}</div>${caseAside(l)}</div>`;
  }
  function theory(sections) { return sections.map(s => `<section class="theory-section"><h3>${esc(s.title)}</h3>${s.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}${s.bullets.length ? `<ul>${s.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}${s.example ? `<div class="theory-example"><span>BEISPIEL</span><p>${esc(s.example).replace(/\n/g, '<br>')}</p></div>` : ''}</section>`).join(''); }
  function briefing(l) {
    return `<section class="scene-card"><div class="card-kicker">${icon(l.icon)} DIE SITUATION</div><p class="scene-intro">${esc(l.intro)}</p><div class="dialogue-stack">${l.dialogue.map(d => dialogue(d.who, d.text)).join('')}</div></section>
      <section class="briefing-card"><div class="card-kicker">${icon('book')} DEIN WERKZEUG FÜR DIESES LEVEL</div>${theory(l.theory)}${l.id === 4 ? strategyMatrix() : ''}</section>
      <div class="section-actions"><span>${l.tasks.length} Entscheidungen · Reflexion ohne Bewertung</span><button class="button primary" data-action="begin-mission">${icon('compass')} In die Mission</button></div>`;
  }
  function strategyMatrix() {
    return `<figure class="strategy-figure"><figcaption>Die fünf Stile im Überblick</figcaption><div class="matrix-y">Eigenes Anliegen: hoch</div><div class="strategy-matrix"><span>Durchsetzen<small>eigenes Anliegen hoch<br>anderes Anliegen niedrig</small></span><span>Zusammenarbeiten<small>beide Anliegen hoch</small></span><span class="matrix-center">Kompromiss<small>gegenseitige Zugeständnisse</small></span><span>Vermeiden<small>beide Anliegen vorerst<br>wenig verfolgen</small></span><span>Nachgeben<small>eigenes Anliegen niedrig<br>anderes Anliegen hoch</small></span></div><div class="matrix-x">Anliegen der anderen Seite: niedrig → hoch</div><p>Situatives Verhalten, keine Persönlichkeitstypen.</p></figure>`;
  }
  function caseAside(l) {
    const completeCount = l.tasks.filter(q => E.mastered(state, q.id)).length;
    return `<aside class="case-aside"><div class="case-file"><div class="file-label">${icon('layers')} ${esc(l.evidence.label)}</div><h2>${esc(l.evidence.title)}</h2><p>${esc(l.evidence.text)}</p><div class="file-divider"></div><div class="case-team">${l.id === 7 ? portrait('nina') + portrait('omar') : portrait('mara') + portrait('leon') + portrait('sponsor')}<span>${l.id === 7 ? 'Zwei Vorhaben.<br>Eine Ressource.' : 'Drei Perspektiven.<br>Ein gemeinsamer Auftrag.'}</span></div></div>
      <div class="mission-status"><span class="eyebrow">DEIN LERNSTAND</span><strong>${completeCount}<span>/${l.tasks.length}</span></strong><p>Entscheidungen in diesem Level korrekt gelöst.</p><span class="status-note">Wiederholen ist Teil der Mission. Pro Aufgabe zählt höchstens ein Punkt.</span></div>
      <div class="aside-note">${icon('bulb')}<p>Du kannst jederzeit ins Wissensarchiv wechseln. Dein Spielstand bleibt erhalten.</p></div></aside>`;
  }
  function mission(l) {
    const q = l.tasks[state.route.task];
    const record = state.answers[q.id];
    const last = record?.history.at(-1);
    const submitted = Boolean(last) && !editing;
    if (submitted) selected = new Set(last.selected);
    const correct = submitted && E.grade(q.id, last.selected);
    const previous = state.route.task > 0 ? l.tasks[state.route.task - 1] : null;
    const previousLast = previous ? state.answers[previous.id]?.history.at(-1) : null;
    const bridge = previousLast && !E.grade(previous.id, previousLast.selected);
    return `<div class="task-progress">${l.tasks.map((t, i) => `<button data-action="task" data-task="${i}" class="task-dot ${i === state.route.task ? 'current' : ''} ${E.mastered(state, t.id) ? 'solved' : E.answered(state, t.id) ? 'tried' : ''}" aria-label="Aufgabe ${i + 1}: ${esc(t.title)}${E.mastered(state, t.id) ? ', korrekt gelöst' : ''}" ${i === state.route.task ? 'aria-current="step"' : ''}>${E.mastered(state, t.id) ? icon('check') : String(i + 1).padStart(2, '0')}</button>`).join('')}<span>ENTSCHEIDUNG ${state.route.task + 1} VON ${l.tasks.length}</span></div>
      ${bridge ? `<div class="bridge-note">${icon('info')}<p>Die vorige Entscheidung hat die Klärung erschwert. Für diesen nächsten Übungsschritt sichert die Moderation erneut einen sachlichen Rahmen. Du kannst die vorige Entscheidung im Journal wiederholen.</p></div>` : ''}
      <section class="decision-card"><div class="card-kicker">${icon(q.type === 'dialogue' ? 'chat' : 'compass')} ${q.type === 'dialogue' ? 'DEIN GESPRÄCH · DU ANTWORTEST' : 'DEINE ENTSCHEIDUNG'}</div><h2>${esc(q.title)}</h2><p class="task-scene">${esc(q.scene)}</p><form id="answer-form"><fieldset ${submitted ? 'disabled' : ''}><legend>${esc(q.question)}</legend><p class="selection-instruction" id="selection-instruction">${q.type === 'multi' ? `Mehrfachauswahl · Wähle genau ${q.correct.length} Antworten.` : 'Einzelauswahl · Wähle eine Antwort.'}</p><div class="answer-options">${q.options.map((o, i) => `<label class="answer-option ${selected.has(o.id) ? 'is-selected' : ''} ${submitted && q.correct.includes(o.id) ? 'is-correct' : ''} ${submitted && selected.has(o.id) && !q.correct.includes(o.id) ? 'is-incorrect' : ''}"><input type="${q.type === 'multi' ? 'checkbox' : 'radio'}" name="choice" value="${o.id}" ${selected.has(o.id) ? 'checked' : ''} aria-describedby="selection-instruction"><span class="option-letter">${String.fromCharCode(65 + i)}</span><span class="option-text">${esc(o.text)}</span>${submitted && q.correct.includes(o.id) ? `<span class="option-verdict">${icon('check')} Passend</span>` : ''}</label>`).join('')}</div></fieldset>${!submitted ? `<div class="decision-actions"><button type="button" class="button text-button" data-action="hint">${icon('bulb')} ${hints ? 'Nächster Hinweis' : 'Denkhilfe'}${hints >= 3 ? ' ansehen' : ''}</button><button class="button primary" type="submit" id="submit-answer" ${selected.size === (q.type === 'multi' ? q.correct.length : 1) ? '' : 'disabled'}>${q.type === 'dialogue' ? 'So antworte ich' : 'Entscheidung prüfen'}</button></div>` : ''}</form>
      ${hints ? `<div class="hint-box"><div class="card-kicker">${icon('bulb')} DENKHILFE ${Math.min(hints, 3)} / 3</div><p>${esc(hints === 1 ? q.hint : hints === 2 ? q.explanation : 'Prüfe diese passende Auswahl: ' + q.options.filter(o => q.correct.includes(o.id)).map(o => o.text).join(' · '))}</p><small>Hilfen kosten keine Punkte.</small></div>` : ''}
      </section>${submitted ? feedback(q, last, correct) : ''}`;
  }
  function feedback(q, last, correct) {
    const reaction = last.selected.map(id => q.options.find(o => o.id === id)?.reaction).find(Boolean);
    let response = '';
    if (reaction) { const sep = reaction.indexOf('|'); response = `<div class="reaction-label">EIN MÖGLICHER GESPRÄCHSVERLAUF</div>${dialogue(reaction.slice(0, sep), reaction.slice(sep + 1), 'reaction-dialogue')}`; }
    return `<section class="feedback-card ${correct ? 'correct' : 'learning'}" aria-labelledby="feedback-title"><div class="feedback-heading">${icon(correct ? 'check' : 'bulb')}<div><span>${correct ? 'PASSEND ENTSCHIEDEN' : 'EIN MOMENT ZUM WEITERLERNEN'}</span><h2 id="feedback-title" tabindex="-1">${correct ? 'Das bringt die Klärung weiter.' : 'Hier lohnt sich ein anderer Weg.'}</h2></div><strong>${correct ? '1' : '0'}<small>/1 Punkt</small></strong></div>${response}<p>${esc(q.explanation)}</p><details class="option-explanations" ${!correct ? 'open' : ''}><summary>Die Antworten im Detail</summary>${q.options.map(o => `<div><strong>${q.correct.includes(o.id) ? 'Passend' : 'Problematisch'}${last.selected.includes(o.id) ? ' · Deine Wahl' : ''}</strong><p>${esc(o.text)}</p><p class="explanation">${esc(o.why)}</p></div>`).join('')}</details><div class="next-step"><b>Nächster sinnvoller Schritt</b><p>${esc(q.next)}</p></div><div class="feedback-actions">${!correct ? `<button class="button secondary" data-action="retry">${icon('replay')} Entscheidung wiederholen</button>` : '<span class="secured">Wissen gesichert. Du kannst weitergehen.</span>'}<button class="button primary" data-action="next-task">${state.route.task === C.levels[state.route.level].tasks.length - 1 ? 'Zur Reflexion' : 'Nächste Situation'}</button></div></section>`;
  }
  function reflection(l) {
    return `<section class="reflection-card"><div class="card-kicker">${icon('checklist')} DEIN PERSÖNLICHER TRANSFER</div><h2>Was nimmst du mit?</h2><p>Übertrage das Gelernte in deinen Alltag. Es gibt hier keine automatische Bewertung. Du darfst Felder leer lassen und später ergänzen.</p><div class="takeaway">${icon('spark')}<p>${esc(l.takeaway)}</p></div><div class="reflection-fields">${l.reflections.map(r => `<div class="reflection-field"><label for="reflection-${r.id}">${esc(r.label)}</label><p id="help-${r.id}">${esc(r.prompt)}</p><textarea id="reflection-${r.id}" data-reflection="${r.id}" maxlength="10000" rows="4" aria-describedby="help-${r.id}" placeholder="${esc(r.placeholder)}">${esc(state.reflections[r.id] || '')}</textarea></div>`).join('')}</div><p class="privacy-note">${icon('lock')} Deine Texte werden nur lokal in diesem Browser gespeichert. Verwende keine vertraulichen Angaben.</p><div class="section-actions"><button class="button text-button" data-action="stage" data-stage="mission">Entscheidungen ansehen</button><button class="button primary" data-action="complete-level">${icon(l.id === 7 ? 'flag' : 'check')} ${l.id === 7 ? 'Mission abschliessen' : 'Level sichern & weiter'}</button></div></section>`;
  }
  function archive() {
    return `<div class="page-heading"><div class="eyebrow">DEIN NACHSCHLAGEWERK</div><h1>Wissen, das weiterhilft.</h1><p>Die vollständige Theorie aus allen sieben Levels. Jederzeit verfügbar, ohne Punktabzug.</p></div><div class="archive-toolbar"><label class="search-box">${icon('search')}<span class="sr-only">Wissensarchiv durchsuchen</span><input id="archive-search" type="search" placeholder="Begriff oder Thema suchen …" value="${esc(filter)}"></label><button class="button secondary" data-action="resume">${icon('compass')} Zur Mission</button></div><div id="archive-results">${archiveResults()}</div>`;
  }
  function archiveResults() {
    const term = filter.trim().toLocaleLowerCase('de-CH');
    const glossary = C.glossary.filter(g => g.join(' ').toLocaleLowerCase('de-CH').includes(term));
    const levels = C.levels.map(l => ({ ...l, filtered: l.theory.filter(s => [s.title, ...s.paragraphs, ...s.bullets, s.example].join(' ').toLocaleLowerCase('de-CH').includes(term)) })).filter(l => l.filtered.length);
    if (!glossary.length && !levels.length) return '<div class="empty-state">Kein Treffer. Versuche beispielsweise «Interessen», «Glasl» oder «Vereinbarung».</div>';
    return `${glossary.length ? `<section class="glossary"><h2>Begriffe auf einen Blick</h2><dl>${glossary.map(([title, text]) => `<div><dt>${esc(title)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl></section>` : ''}<div class="archive-levels">${levels.map(l => `<details class="archive-level" ${term ? 'open' : ''}><summary><span class="archive-number">${String(l.id).padStart(2, '0')}</span><span>${esc(l.title)}<small>${l.minutes} Minuten Richtzeit</small></span>${icon('book')}</summary><div class="archive-level-body">${theory(l.filtered)}${l.id === 4 ? strategyMatrix() : ''}</div></details>`).join('')}</div><p class="source-note">Fachliche Grundlage: die für dieses Lernspiel bereitgestellte Schulungsvorlage «Konfliktmanagement im Projektmanagement». Modelle: Eskalation nach Friedrich Glasl, Konfliktstile nach Thomas-Kilmann und Harvard-Konzept, entsprechend der Vorlage erläutert.</p>`;
  }
  function timeline() {
    return `<div class="page-heading"><div class="eyebrow">DEINE ENTSCHEIDUNGEN UND IHRE WIRKUNG</div><h1>Zurück zum Wendepunkt.</h1><p>Hier siehst du, was du gewählt hast und warum ein anderer Schritt helfen könnte. Wiederhole offene Aufgaben, um deinen Lernstand zu verbessern.</p></div><div class="journal-info">${icon('replay')}<p>Eine Wiederholung ist ein neuer Lernversuch. Ein bereits erreichter Punkt bleibt erhalten. Die Fallakte und die Auswertung werden aus deinen Lernentscheidungen aktualisiert. Menschliche Reaktionen sind mögliche Verläufe.</p></div><div class="timeline-levels">${C.levels.map((l, i) => `<section class="timeline-level"><h2><span>${String(l.id).padStart(2, '0')}</span>${esc(l.title)}</h2>${l.tasks.map((q, qi) => {
      const record = state.answers[q.id], last = record?.history.at(-1), mastered = E.mastered(state, q.id);
      const history = record?.history.length > 1 ? `<details class="attempt-history"><summary>Vorherige Versuche vergleichen</summary>${record.history.slice(0, -1).map((a, ai) => `<p><b>Versuch ${ai + 1} · ${E.grade(q.id, a.selected) ? 'passend' : 'erneut prüfen'}</b><br>${a.selected.map(id => esc(q.options.find(o => o.id === id).text)).join(' · ')}</p>`).join('')}</details>` : '';
      const answer = last ? `<p><b>Deine letzte Wahl:</b> ${last.selected.map(id => esc(q.options.find(o => o.id === id).text)).join(' · ')}</p><p class="journal-effect">${esc(q.next)}</p><span class="journal-status">${mastered ? 'Korrekt gelöst · 1 Punkt' : 'Noch nicht korrekt · 0 Punkte'} · ${record.history.length} ${record.history.length === 1 ? 'Versuch' : 'Versuche'}</span>${history}` : '<span class="journal-status">Noch nicht bearbeitet</span>';
      return `<div class="journal-entry ${mastered ? 'mastered' : ''}"><div class="journal-entry-icon">${icon(mastered ? 'check' : last ? 'replay' : 'lock')}</div><div><h3>${esc(q.title)}</h3>${answer}</div>${i <= E.unlocked(state) ? `<button class="button secondary compact" data-action="jump" data-level="${i}" data-task="${qi}">${last ? mastered ? 'Ansehen' : 'Wiederholen' : 'Öffnen'}</button>` : ''}</div>`;
    }).join('')}</section>`).join('')}</div>`;
  }
  function summary() {
    const score = E.score(state), finished = state.completed.length === 7, passed = finished && score >= C.passScore;
    const outcome = E.outcome(state);
    const missing = E.questions.filter(q => E.answered(state, q.id) && !E.mastered(state, q.id));
    return `<div class="page-heading"><div class="eyebrow">${finished ? 'DEINE MISSION · DEIN NÄCHSTER SCHRITT' : 'WÄCHST MIT DEINER MISSION'}</div><h1>${passed ? 'Du bringst Bewegung rein.' : finished ? 'Dein Werkzeug ist bereit.' : 'Deine persönliche Werkzeugkarte.'}</h1><p>${passed ? 'Mission bestanden. Nimm die Werkzeuge mit in dein nächstes Projektgespräch.' : finished ? 'Du hast den Lernweg durchlaufen. Für das Bestehen kannst du offene Entscheidungen wiederholen.' : 'Deine Erkenntnisse und Notizen sammeln sich hier. Du kannst jederzeit zur Mission zurückkehren.'}</p></div>
      <section class="result-banner"><div class="result-emblem">${icon(passed ? 'flag' : 'compass')}</div><div><span class="eyebrow">${finished ? passed ? 'MISSION BESTANDEN' : 'WEITERLERNEN ERWÜNSCHT' : 'MISSION LÄUFT'}</span><h2>${score} von 20 Punkten</h2><p>${finished ? 'Bestanden ab 14 Punkten. Pro Aufgabe zählt höchstens ein Punkt.' : `${E.attempted(state)} von 20 Aufgaben bearbeitet · ${state.completed.length} von 7 Levels abgeschlossen.`}</p></div><div class="result-actions"><button class="button ${passed ? 'light' : 'primary'}" data-action="${finished ? 'timeline' : 'resume'}">${icon(finished ? 'replay' : 'compass')}${finished ? 'Entscheidungen ansehen' : 'Mission fortsetzen'}</button></div></section>
      ${finished ? `<section class="outcome-card"><div class="card-kicker">${icon('layers')} DER STAND IM PROJEKTFALL</div><h2>${esc(outcome.title)}</h2><p>${esc(outcome.text)}</p><p class="muted">Die Darstellung beschreibt deinen Lernweg im fiktiven Fall. Sie ist keine Prognose über reale Personen oder Projekte.</p></section>` : ''}
      <div class="summary-grid"><section class="toolkit"><h2>Sieben Schritte für dein nächstes Gespräch.</h2><ol>${C.skills.map((skill, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><div><h3>${['Beobachten.', 'Interessen verstehen.', 'Eskalation einschätzen.', 'Strategie wählen.', 'Gespräch führen.', 'Vereinbarung sichern.', 'Bei Bedarf Entscheidung oder Unterstützung einholen.'][i]}</h3><p>${['Beschreibe überprüfbare Ereignisse und trenne sie von Bewertungen.', 'Frage nach dem Anliegen hinter der Forderung und überprüfe Vermutungen.', 'Achte auf Angriffe und Lagerbildung. Vermeide vorschnelle Stufendiagnosen.', 'Prüfe Bedeutung, Dringlichkeit, Befugnis, Zusammenarbeit und Zeit.', 'Bereite vor, vereinbare den Rahmen, höre zu und prüfe Optionen.', 'Halte Ergebnis, Person, Termin, Freigabe und Überprüfung fest.', 'Nutze die zuständige Entscheidungsinstanz oder passende Konfliktbegleitung.'][i]}</p></div></li>`).join('')}</ol></section><section class="competency-card"><h2>Deine Lernbilanz</h2><p>Abgeleitet aus den bearbeiteten Aufgaben. Unterstützung und erneute Versuche sind Teil des Lernens.</p>${C.skills.map((skill, i) => { const c = E.competency(state, i); return `<div class="competency-item"><div><b>${esc(skill)}</b><span>${c.solved}/${c.total}</span></div><p>${c.solved === 0 && !E.questions.some(q => q.skill === i && E.answered(state, q.id)) ? 'Noch nicht bearbeitet' : c.status}</p></div>`; }).join('')}</section></div>
      <section class="personal-notes"><div class="card-kicker">${icon('checklist')} DEINE PERSÖNLICHEN TRANSFERANTWORTEN</div><h2>Das nimmst du in den Alltag mit.</h2>${C.levels.map((l, index) => `<details class="notes-group" ${l.id === 7 ? 'open' : ''}><summary>Level ${l.id} · ${esc(l.title)}</summary>${l.reflections.map(r => `<div class="saved-reflection"><h3>${esc(r.label)}</h3><p>${state.reflections[r.id] ? esc(state.reflections[r.id]) : '<em>Noch keine Notiz. Du kannst sie im jeweiligen Level ergänzen.</em>'}</p></div>`).join('')}${index <= E.unlocked(state) ? `<button class="button text-button" data-action="edit-notes" data-level="${index}">Notizen ergänzen</button>` : ''}</details>`).join('')}</section>
      ${missing.length ? `<section class="review-card"><h2>Hier kannst du weiterüben.</h2><p>${missing.length} bearbeitete ${missing.length === 1 ? 'Aufgabe ist' : 'Aufgaben sind'} noch offen.</p>${missing.map(q => `<button class="review-link" data-action="review" data-id="${q.id}">${icon('replay')}${esc(q.title)}<span>Erneut versuchen</span></button>`).join('')}</section>` : ''}
      <div class="export-actions"><button class="button secondary" data-action="export">${icon('download')} Werkzeugkarte als Text speichern</button><button class="button secondary" data-action="print">${icon('print')} Drucken / als PDF sichern</button><button class="button text-button" data-action="reset">Neu beginnen</button></div><p class="source-note">Bewertung zum Lernen, keine psychologische Diagnose. Deine Reflexionen werden nicht automatisch bewertet. Die Richtzeiten ergeben zusammen 60 Minuten; dein tatsächliches Tempo kann abweichen.</p>`;
  }

  function goPlay(level = state.route.level, stage = state.route.stage, taskIndex = state.route.task) {
    state.route = { level, stage, task: taskIndex };
    view = 'play'; drawer = false; selected = new Set(); editing = false; hints = 0;
    if (state.startedAt) persist();
    render();
  }
  function start() { if (!state.startedAt) state.startedAt = new Date().toISOString(); persist(); goPlay(); }
  function continueTask() {
    const l = C.levels[state.route.level];
    if (state.route.task < l.tasks.length - 1) goPlay(state.route.level, 'mission', state.route.task + 1);
    else if (E.allAnswered(state, state.route.level)) goPlay(state.route.level, 'reflection', state.route.task);
    else {
      const next = l.tasks.findIndex(q => !E.answered(state, q.id));
      goPlay(state.route.level, 'mission', next);
      announce('Vor der Reflexion folgt noch eine offene Aufgabe.');
    }
  }
  function reset() {
    const dialog = document.createElement('dialog');
    dialog.className = 'reset-dialog';
    dialog.innerHTML = `<h2>Eine neue Mission starten?</h2><p>Damit löschst du deinen Spielstand und deine lokalen Reflexionen. Du kannst deine Notizen vorher über die Werkzeugkarte als Text speichern.</p><div><button class="button secondary" data-cancel>Abbrechen</button><button class="button primary" data-confirm>Ja, neu beginnen</button></div>`;
    const trigger = document.activeElement;
    document.body.append(dialog);
    dialog.addEventListener('close', () => { dialog.remove(); trigger?.focus(); });
    dialog.querySelector('[data-cancel]').onclick = () => dialog.close();
    dialog.querySelector('[data-confirm]').onclick = () => { state = E.fresh(); notice = ''; view = 'home'; persist(); dialog.close(); render(); announce('Dein Spielstand wurde zurückgesetzt.'); };
    dialog.showModal(); dialog.querySelector('[data-cancel]').focus();
  }
  function exportNotes() {
    const lines = ['MISSION PROJEKTFRIEDEN', 'Meine persönliche Werkzeugkarte', '', `Lernstand: ${E.score(state)} von 20 Punkten. Bestanden ab 14 Punkten nach Abschluss aller Levels.`, `Levels abgeschlossen: ${state.completed.length}/7`, '', ...C.skills.map((s, i) => `${i + 1}. ${s}`), '', 'MEINE REFLEXIONEN', ''];
    for (const l of C.levels) { lines.push(`LEVEL ${l.id}: ${l.title}`); for (const r of l.reflections) lines.push(r.label, state.reflections[r.id] || '(Noch keine Notiz)', ''); }
    lines.push('Die Reflexionen sind unbewertet. Lernbewertung, keine psychologische Diagnose.');
    const url = URL.createObjectURL(new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'Mission-Projektfrieden-Werkzeugkarte.txt'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce('Deine Werkzeugkarte wurde als Textdatei zum Speichern bereitgestellt.');
  }

  root.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button || button.disabled) return;
    event.preventDefault();
    const action = button.dataset.action;
    if (action === 'start') return start();
    if (action === 'resume') return state.startedAt ? goPlay() : start();
    if (action === 'home') { view = 'home'; drawer = false; return render(); }
    if (action === 'menu') { drawer = !drawer; const oldFocus = document.activeElement; render(false); document.querySelector(drawer ? '.mobile-close' : '.mobile-menu')?.focus(); return; }
    if (['archive', 'timeline', 'summary'].includes(action)) { view = action; drawer = false; filter = ''; return render(); }
    if (action === 'level') return goPlay(Number(button.dataset.level), 'briefing', 0);
    if (action === 'stage') return goPlay(state.route.level, button.dataset.stage, state.route.task);
    if (action === 'begin-mission') {
      if (!state.startedAt) state.startedAt = new Date().toISOString();
      const first = C.levels[state.route.level].tasks.findIndex(q => !E.answered(state, q.id));
      return goPlay(state.route.level, 'mission', first < 0 ? 0 : first);
    }
    if (action === 'task') return goPlay(state.route.level, 'mission', Number(button.dataset.task));
    if (action === 'hint') { hints = Math.min(3, hints + 1); render(false); document.querySelector('.hint-box')?.scrollIntoView({ block: 'nearest' }); announce(`Denkhilfe ${hints} geöffnet. Hilfen kosten keine Punkte.`); return; }
    if (action === 'retry') { editing = true; selected = new Set(); hints = 0; render(); document.querySelector('input[name="choice"]')?.focus(); return; }
    if (action === 'next-task') return continueTask();
    if (action === 'complete-level') {
      E.complete(state, state.route.level); persist();
      if (state.route.level < 6) return goPlay(state.route.level + 1, 'briefing', 0);
      view = 'summary'; render(); announce(E.score(state) >= 14 ? 'Mission bestanden.' : 'Lernweg abgeschlossen. Du kannst offene Entscheidungen wiederholen.'); return;
    }
    if (action === 'jump') return goPlay(Number(button.dataset.level), 'mission', Number(button.dataset.task));
    if (action === 'review') {
      const li = C.levels.findIndex(l => l.tasks.some(q => q.id === button.dataset.id));
      const qi = C.levels[li].tasks.findIndex(q => q.id === button.dataset.id);
      goPlay(li, 'mission', qi); editing = true; selected = new Set(); render(); return;
    }
    if (action === 'edit-notes') {
      const li = Number(button.dataset.level);
      return goPlay(li, E.allAnswered(state, li) ? 'reflection' : 'mission', 0);
    }
    if (action === 'reset') return reset();
    if (action === 'export') return exportNotes();
    if (action === 'print') { view = 'summary'; render(); document.querySelectorAll('.notes-group').forEach(d => d.open = true); window.print(); }
  });
  root.addEventListener('change', event => {
    if (event.target.name !== 'choice') return;
    selected = new Set([...root.querySelectorAll('input[name="choice"]:checked')].map(el => el.value));
    root.querySelectorAll('.answer-option').forEach(el => el.classList.toggle('is-selected', el.querySelector('input').checked));
    const q = C.levels[state.route.level].tasks[state.route.task];
    const button = document.getElementById('submit-answer');
    if (button) button.disabled = selected.size !== (q.type === 'multi' ? q.correct.length : 1);
  });
  root.addEventListener('submit', event => {
    if (event.target.id !== 'answer-form') return;
    event.preventDefault();
    const q = C.levels[state.route.level].tasks[state.route.task];
    if (E.mastered(state, q.id) && !editing) return;
    if (!state.startedAt) state.startedAt = new Date().toISOString();
    try {
      const result = E.submit(state, q.id, [...selected], hints > 0);
      editing = false; persist(); render(false);
      document.getElementById('feedback-title')?.focus();
      announce(`${result.correct ? 'Passende Entscheidung. Ein Punkt.' : 'Noch nicht passend. Nutze das Feedback und versuche es erneut.'} Dein Stand: ${result.score} von 20 Punkten.`);
    } catch (err) { announce(err.message); }
  });
  root.addEventListener('input', event => {
    const el = event.target;
    if (el.dataset.reflection) { state.reflections[el.dataset.reflection] = el.value.slice(0, 10000); persist(); }
    if (el.id === 'archive-search') { filter = el.value; document.getElementById('archive-results').innerHTML = archiveResults(); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && drawer) { drawer = false; render(false); document.querySelector('.mobile-menu')?.focus(); }
  });
  window.addEventListener('pagehide', () => { if (state.startedAt) persist(); });
  render(false);
})();
