/* Inhalt und Fachtexte: unabhängig von Darstellung und Spiellogik bearbeitbar. */
'use strict';
globalThis.MissionContent = (() => {
  const option = (id, text, why, reaction) => ({ id, text, why, reaction });
  const task = (id, type, title, scene, question, options, correct, explanation, next, skill, hint) =>
    ({ id, type, title, scene, question, options, correct, explanation, next, skill, hint });
  const section = (title, paragraphs = [], bullets = [], example = '') => ({ title, paragraphs, bullets, example });
  const skills = [
    'Konflikte erkennen', 'Interessen verstehen', 'Eskalation einschätzen',
    'Strategie wählen', 'Gespräch führen', 'Vereinbarung sichern', 'Unterstützung einholen'
  ];
  const levels = [
    {
      id: 1, title: 'Alarm im Projekt', short: 'Alarm erkennen', minutes: 5, icon: 'radar',
      kicker: 'Vier Wochen vor dem Start', objective: 'Erkenne den Konflikt und trenne Tatsachen von Bewertungen.',
      intro: 'Du leitest das Projekt Kundenportal. In vier Wochen soll die erste Version starten. Im heutigen Meeting geht es um zusätzliche Funktionen für einen wichtigen Kunden. Aus einer Abstimmung wird eine Konfrontation.',
      dialogue: [
        { who: 'mara', text: 'Ohne diese Funktionen können wir das Portal unseren wichtigsten Kunden nicht zeigen.' },
        { who: 'leon', text: 'Das wurde nie vereinbart. Ihr versprecht ständig Dinge, die wir ausbaden müssen.' }
      ],
      evidence: { label: 'Projektakte · Ausgangslage', title: 'Ein gemeinsames Ziel. Unterschiedliche Erwartungen.', text: 'Start in vier Wochen. Mara fordert Zusatzfunktionen. Leon verweist auf den vereinbarten Umfang. Noch ist weder der konkrete Kundennutzen geklärt noch eine Änderung beschlossen.' },
      theory: [
        section('Wann ist es ein Konflikt?', ['Ein Konflikt entsteht, wenn Beteiligte ihre Ziele, Interessen, Erwartungen oder Handlungen als unvereinbar erleben und sich dadurch beeinträchtigt fühlen.', 'Eine Meinungsverschiedenheit allein ist noch kein destruktiver Konflikt. Fachlicher Widerspruch kann Entscheidungen verbessern. Kritisch wird es, wenn sich Beteiligte blockiert fühlen, die Zusammenarbeit leidet oder persönliche Angriffe entstehen.']),
        section('Typische Ursachen im Projekt', [], ['Konkurrenz zwischen Termin, Kosten, Umfang und Qualität.', 'Knappe Ressourcen.', 'Unklare Rollen und Entscheidungsbefugnisse.', 'Unterschiedliche Erwartungen.', 'Änderungen ohne gemeinsame Abstimmung.', 'Fehlende oder unterschiedlich interpretierte Informationen.']),
        section('Beobachten, ohne zu unterstellen', ['Eine Beobachtung beschreibt ein überprüfbares Ereignis. Bewertungen und Unterstellungen sind keine gesicherten Tatsachen.', 'Konflikte können auf Probleme aufmerksam machen und Verbesserungen ermöglichen. Werden sie ignoriert oder persönlich ausgetragen, können sie Vertrauen und Projekterfolg beeinträchtigen.'], [], 'Beobachtung: «Leon hat auf Maras letzte Nachricht bisher nicht geantwortet.»\nBewertung: «Leon ist unprofessionell.»\nUnterstellung: «Leon will das Projekt sabotieren.»')
      ],
      tasks: [
        task('l1-1', 'single', 'Widerspruch oder Konflikt?', 'Mara sieht den Kundentermin gefährdet. Leon erlebt die Zusatzforderungen als nicht tragbare Belastung. Die Abstimmung stockt.', 'Woran erkennst du hier einen Konflikt?', [
          option('a', 'Bereits daran, dass zwei Fachbereiche unterschiedliche Meinungen haben.', 'Fachlicher Widerspruch allein ist noch kein destruktiver Konflikt. Entscheidend ist das erlebte gegenseitige Beeinträchtigen.'),
          option('b', 'Beide erleben ihre Anliegen als unvereinbar und fühlen sich gegenseitig beeinträchtigt.', 'Die Beschreibung enthält die entscheidenden Merkmale: erlebte Unvereinbarkeit und Beeinträchtigung.'),
          option('c', 'Erst wenn die Sponsorin einen offiziellen Konflikt bestätigt.', 'Ein Konflikt braucht keine formale Bestätigung. Wenn du auf sie wartest, kann die Zusammenarbeit bereits leiden.')
        ], ['b'], 'Hier treffen unterschiedliche Anliegen aufeinander, und beide Seiten erleben eine Blockade. Das ist mehr als eine sachliche Meinungsverschiedenheit.', 'Kläre die konkreten Beobachtungen und Anliegen, statt eine schuldige Seite zu suchen.', 0, 'Achte darauf, ob unterschiedliche Ansichten bereits als gegenseitige Beeinträchtigung erlebt werden.'),
        task('l1-2', 'single', 'Was weisst du wirklich?', 'Im Projektchat steht Maras Nachricht seit gestern ohne Antwort von Leon. Über seine Gründe weisst du noch nichts.', 'Welche Aussage ist eine überprüfbare Beobachtung?', [
          option('a', 'Leon nimmt den Vertrieb nicht ernst.', 'Das ist eine Deutung seiner Haltung. Du kennst seine Gründe noch nicht.'),
          option('b', 'Leon blockiert absichtlich die Zusammenarbeit.', 'Eine Absicht wird unterstellt. Das könnte Vorwürfe auslösen und die Klärung erschweren.'),
          option('c', 'Leon hat auf Maras letzte Nachricht bisher nicht geantwortet.', 'Das beschreibt einen überprüfbaren Vorgang, ohne eine Absicht zu behaupten.')
        ], ['c'], 'Die ausbleibende Antwort ist beobachtbar. Unprofessionalität, Geringschätzung oder Sabotage lassen sich daraus nicht ableiten.', 'Frage nach dem Stand und den Hindernissen, bevor du die Situation bewertest.', 0, 'Welche Aussage könnte eine andere Person im Nachrichtenverlauf nachprüfen?')
      ],
      reflections: [{ id: 'observation', label: 'Ein eigener Konflikt als Beobachtung', prompt: 'Beschreibe eine Situation aus deinem Alltag in einem überprüfbaren Satz. Lass Namen und vertrauliche Details weg.', placeholder: 'Im letzten Abstimmungstermin wurde …' }],
      takeaway: 'Beschreibe zuerst, was passiert ist. Prüfe erst danach, wie es verstanden wird.'
    },
    {
      id: 2, title: 'Hinter die Positionen schauen', short: 'Interessen verstehen', minutes: 8, icon: 'layers',
      kicker: 'Zwei Forderungen, mehrere Anliegen', objective: 'Unterscheide Konfliktperspektiven, Positionen und überprüfte Interessen.',
      intro: 'Du prüfst die Projektakte. Der vereinbarte Umfang ist dokumentiert. Wer Zusatzanforderungen bewilligen darf, ist im Team jedoch nicht geklärt. In getrennten Vorgesprächen versuchst du, die Anliegen hinter den Forderungen zu verstehen.',
      dialogue: [{ who: 'mara', text: 'Ich brauche nicht einfach mehr Funktionen. Ich muss dem Kunden zeigen können, dass sein wichtigster Ablauf funktioniert.' }, { who: 'leon', text: 'Wenn wir den Umfang weiter öffnen, bleibt keine Zeit zum Testen. Ich will eine stabile Version und einen tragbaren Plan.' }],
      evidence: { label: 'Projektakte · Änderungsnotiz', title: 'Wer darf den Umfang ändern?', text: 'Mara gibt eine Kundenanforderung direkt an die Entwicklung. Leon hält sie für unzulässig. Beide gehen von unterschiedlichen Entscheidungsrechten aus. Die Sponsorin entscheidet über Änderungen ausserhalb deiner Befugnis.' },
      theory: [
        section('Fünf Perspektiven auf Konflikte', ['Mehrere Perspektiven können gleichzeitig zutreffen. Die Einordnung ist eine Orientierungshilfe und keine endgültige Diagnose.'], ['Sachkonflikt: unterschiedliche Informationen oder fachliche Einschätzungen.', 'Interessenkonflikt: unterschiedliche Bedürfnisse, Ziele oder Prioritäten.', 'Rollen- und Zuständigkeitskonflikt: unklare Verantwortung oder Entscheidungsbefugnis.', 'Beziehungskonflikt: erlebte Abwertung, Misstrauen oder belasteter Umgang.', 'Wertekonflikt: unterschiedliche grundlegende Massstäbe und Überzeugungen.']),
        section('Position ist nicht Interesse', ['Eine Position ist eine konkrete Forderung. Ein Interesse ist das Anliegen hinter der Forderung.', 'Interessen dürfen nicht einfach unterstellt werden. Sie müssen durch Fragen überprüft werden. Das Verstehen von Interessen eröffnet zusätzliche Lösungen.'], [], 'Mara: «Alle Funktionen müssen in die erste Version.» → Position.\nMögliches Interesse: Der Kunde soll seinen wichtigsten Arbeitsablauf demonstrieren können.\nLeon: «Keine zusätzlichen Funktionen.» → Position.\nMögliches Interesse: Eine stabile Version bei realistischem Aufwand liefern.'),
        section('Mit offenen Fragen prüfen', [], ['«Was ist dir daran besonders wichtig?»', '«Was soll damit erreicht werden?»', '«Welche Folgen hätte es, wenn wir das nicht umsetzen?»', '«Welche Rahmenbedingungen müssen wir berücksichtigen?»'], 'Ein begrenzter Demonstrationsumfang könnte beide Interessen besser verbinden als «alles» oder «nichts». Ob er das tatsächlich tut, muss gemeinsam geprüft werden.')
      ],
      tasks: [
        task('l2-1', 'single', 'Die unsichtbare Zuständigkeit', 'Mara meint, sie dürfe neue Funktionen zusagen. Leon meint, nur die Projektleitung dürfe den Umfang ändern. Die Entscheidungsrechte sind nicht gemeinsam geklärt.', 'Welche Konfliktperspektive ist hier besonders deutlich?', [
          option('a', 'Rollen- und Zuständigkeitskonflikt.', 'Die Beteiligten haben unterschiedliche Vorstellungen darüber, wer entscheiden darf.'),
          option('b', 'Ausschliesslich ein Wertekonflikt.', 'Unterschiedliche Grundüberzeugungen sind hier nicht belegt. Die Szene beschreibt unklare Entscheidungsrechte.'),
          option('c', 'Ein reiner Sachkonflikt über die Programmiertechnik.', 'Über eine technische Lösung wird hier nicht gestritten. Es geht um die Befugnis zur Umfangsänderung.')
        ], ['a'], 'Klare Entscheidungsrechte helfen, diesen Teil des Konflikts zu bearbeiten. Andere Konfliktperspektiven können zusätzlich vorhanden sein.', 'Kläre, wer Anforderungen einbringt, prüft und verbindlich freigibt.', 1, 'Welche Unklarheit betrifft nicht das Was, sondern das Wer darf entscheiden?'),
        task('l2-2', 'single', 'Forderung oder Anliegen?', 'Mara fordert alle Zusatzfunktionen. Du möchtest eine Hypothese bilden, die du anschliessend mit ihr prüfst.', 'Welche Aussage beschreibt ein mögliches Interesse?', [
          option('a', 'Alle Zusatzfunktionen müssen sofort umgesetzt werden.', 'Das ist eine konkrete Forderung und damit eine Position.'),
          option('b', 'Der Kunde soll seinen wichtigsten Arbeitsablauf überzeugend demonstrieren können.', 'Das beschreibt einen möglichen Zweck hinter der Forderung. Frage Mara, ob er tatsächlich zentral ist.'),
          option('c', 'Leon soll dem Vertrieb endlich nachgeben.', 'Das legt ein Motiv nahe, das bisher nicht überprüft ist, und richtet sich gegen eine Person.')
        ], ['b'], 'Das Interesse beschreibt, was erreicht werden soll. Es eröffnet mehr Handlungsmöglichkeiten als die unveränderte Forderung nach allen Funktionen.', 'Überprüfe das vermutete Interesse mit Mara, bevor du Lösungen daraus ableitest.', 1, 'Suche den Zweck hinter der geforderten Lösung.'),
        task('l2-3', 'single', 'Die Frage, die etwas öffnet', 'Du sprichst mit Mara, bevor du über einzelne Funktionen verhandelst.', 'Welche Frage eignet sich am besten zur Interessenklärung?', [
          option('a', 'Warum versprichst du immer mehr, als wir schaffen?', 'Die pauschale Bewertung kann Rechtfertigung auslösen und hilft wenig bei der Klärung des konkreten Anliegens.'),
          option('b', 'Du willst doch eigentlich nur den Kunden beeindrucken, oder?', 'Die Frage legt eine Antwort nahe und unterstellt ein Motiv.'),
          option('c', 'Was soll der Kunde mit diesen Funktionen konkret zeigen können?', 'Die offene Frage erkundet den gewünschten Nutzen, ohne ihn vorzugeben.')
        ], ['c'], 'Eine offene, konkrete Frage macht das Anliegen überprüfbar. Das gilt auch dann, wenn du die Forderung zunächst für unrealistisch hältst.', 'Frage anschliessend nach unverzichtbaren Abläufen und verhandelbaren Ergänzungen.', 1, 'Welche Frage ermöglicht eine eigene Antwort, ohne ein Motiv vorzugeben?')
      ],
      reflections: [
        { id: 'position', label: 'Eine Position', prompt: 'Wähle Mara oder Leon. Welche konkrete Forderung vertritt die Person?', placeholder: 'Die Person fordert …' },
        { id: 'interest', label: 'Ein mögliches Interesse', prompt: 'Was könnte hinter dieser Forderung stehen? Kennzeichne es als Vermutung.', placeholder: 'Möglicherweise ist der Person wichtig, dass …' },
        { id: 'interestQuestion', label: 'Deine Prüffrage', prompt: 'Mit welcher offenen Frage überprüfst du deine Vermutung?', placeholder: 'Was ist dir an … besonders wichtig?' }
      ], takeaway: 'Frage nach dem Anliegen, bevor du über die geforderte Lösung verhandelst.'
    },
    {
      id: 3, title: 'Die Eskalation stoppen', short: 'Eskalation stoppen', minutes: 7, icon: 'shield',
      kicker: 'Der Konflikt bekommt ein Publikum', objective: 'Erkenne Warnsignale und organisiere passende Unterstützung.',
      intro: 'Im nächsten Meeting wertet Leon den Vertrieb pauschal ab. Kurz darauf verschickt Mara alte Entwicklungsfehler an mehrere Führungskräfte. Beide suchen Unterstützung gegen die andere Seite. Die konkrete Portalfrage gerät in den Hintergrund.',
      dialogue: [{ who: 'leon', text: 'Mit dem Vertrieb kann man ohnehin nichts verlässlich planen.' }, { who: 'mara', text: 'Ich habe die alten Fehler jetzt an die Führung geschickt. Die sollen sehen, wie die Entwicklung arbeitet.' }],
      evidence: { label: 'Projektakte · Meeting und Verteiler', title: 'Vom Problem zur Gegenseite', text: 'Eine pauschale Abwertung im Meeting. Ein erweiterter Verteiler mit alten Fehlern. Unterstützung wird gegen die andere Seite gesucht. Diese Warnsignale erlauben keine sichere Diagnose einer einzelnen Eskalationsstufe.' },
      theory: [
        section('Glasl: drei Hauptphasen zur Orientierung', ['Das Eskalationsmodell nach Friedrich Glasl umfasst neun Stufen in drei Hauptphasen. Für dieses Spiel genügt das Verständnis der Phasen.'], ['Win-win: Eine gemeinsame Lösung ist noch vorstellbar. Standpunkte verhärten sich, Debatten wiederholen sich und die Gesprächsbereitschaft sinkt.', 'Win-lose: Gewinnen gegen die andere Seite tritt in den Vordergrund. Mögliche Anzeichen: Lagerbildung, öffentliche Abwertung und Drohungen.', 'Lose-lose: Die Schädigung der anderen Seite wird auch unter Inkaufnahme eigener erheblicher Nachteile verfolgt.']),
        section('Warnsignale sind keine Ferndiagnose', ['Konflikte durchlaufen diese Phasen nicht zwangsläufig gleichmässig. Aus einer einzelnen Aussage lässt sich keine sichere Stufe diagnostizieren.', 'Mit zunehmender Eskalation wird eigenständige Klärung schwieriger. Früh können strukturierte Gespräche helfen. Bei festgefahrenen persönlichen Angriffen kann neutrale Moderation oder qualifizierte Konfliktbegleitung erforderlich sein.']),
        section('Wann andere Verfahren nötig sind', ['Bei Bedrohungen, Diskriminierung oder anderen schwerwiegenden Vorfällen müssen die vorgesehenen betrieblichen Stellen und Verfahren einbezogen werden. Ein gemeinsames Gespräch ist dann nicht automatisch der geeignete erste Schritt.'])
      ],
      tasks: [
        task('l3-1', 'multi', 'Die Warnsignale lesen', 'Du vergleichst die jüngsten Ereignisse. Wähle die beiden Beobachtungen, die in dieser Szene besonders auf Eskalation hindeuten.', 'Welche zwei Warnsignale erkennst du?', [
          option('a', 'Leon wertet den gesamten Vertrieb öffentlich ab.', 'Die pauschale öffentliche Abwertung verschiebt den Fokus von der Sache auf die Gegenseite.'),
          option('b', 'Mara und Leon haben unterschiedliche fachliche Prioritäten.', 'Unterschiedliche Prioritäten sind im Projekt normal. Für sich allein zeigen sie keine Eskalation.'),
          option('c', 'Beide suchen Verbündete gegen die andere Seite.', 'Lagerbildung ist ein Warnsignal: Gewinnen gegen andere rückt in den Vordergrund.'),
          option('d', 'Im Projekt gibt es einen dokumentierten Starttermin.', 'Ein Starttermin ist für sich genommen kein Warnsignal sozialer Eskalation.')
        ], ['a', 'c'], 'Öffentliche Abwertung und Lagerbildung sprechen dafür, die Konfliktbearbeitung anzupassen. Sie erlauben keine sichere Zuordnung zu einer einzelnen Glasl-Stufe.', 'Begrenze persönliche Angriffe und kläre, welche Form der Unterstützung erforderlich ist.', 2, 'Achte auf den Wechsel von der Sachfrage zum Gewinnen gegen die andere Seite.'),
        task('l3-2', 'single', 'Eingreifen, ohne Öl nachzugiessen', 'Die Angriffe wiederholen sich. Als Projektleitung bist du selbst in die bisherigen Entscheidungen eingebunden. Eine neutrale Gesprächsführung erscheint dir schwierig.', 'Wie reagierst du angemessen?', [
          option('a', 'Du lässt beide im nächsten offenen Teammeeting alles austragen.', 'Ein grösseres Publikum kann die Lagerbildung verstärken. Ein ungeklärter Rahmen bietet wenig Schutz vor weiteren Angriffen.'),
          option('b', 'Du begrenzt öffentliche Angriffe, klärst die Situation und organisierst passende neutrale Unterstützung.', 'Das schützt den Gesprächsrahmen und berücksichtigt die Grenzen deiner eigenen Neutralität.'),
          option('c', 'Du erklärst den Konflikt anhand dieses Meetings endgültig als Glasl-Stufe 7.', 'Eine einzelne Szene trägt keine sichere Stufendiagnose. Das Etikett ersetzt keine passende Intervention.')
        ], ['b'], 'Bei festgefahrenen Angriffen kann neutrale Moderation oder qualifizierte Konfliktbegleitung helfen. Bei schwerwiegenden Vorfällen gelten die vorgesehenen betrieblichen Verfahren.', 'Kläre mit den zuständigen Stellen den Rahmen, die Zuständigkeit und den nächsten Schritt.', 6, 'Wer kann einen tragfähigen Rahmen ermöglichen, wenn deine eigene Neutralität begrenzt ist?')
      ],
      reflections: [
        { id: 'warning', label: 'Mein Warnsignal', prompt: 'Woran würdest du merken, dass eine Auseinandersetzung in deinem Umfeld eskaliert?', placeholder: 'Ich werde aufmerksam, wenn …' },
        { id: 'support', label: 'Eine geeignete Ansprechstelle', prompt: 'Welche Rolle oder betriebliche Stelle könnte je nach Situation unterstützen?', placeholder: 'In meinem Umfeld wäre eine Ansprechstelle …' }
      ], takeaway: 'Begrenze persönliche Angriffe. Prüfe deine Neutralität und hole passende Unterstützung.'
    },
    {
      id: 4, title: 'Die passende Strategie wählen', short: 'Strategie wählen', minutes: 10, icon: 'compass',
      kicker: 'Es gibt nicht den einen richtigen Stil', objective: 'Wähle dein Vorgehen passend zu Dringlichkeit, Bedeutung und Befugnis.',
      intro: 'Mit einer neutralen Moderation ist ein neuer Gesprächsrahmen vereinbart. Du musst nun entscheiden, wann eine Pause sinnvoll ist, wann ein Kompromiss reicht und wann die Beteiligten gemeinsam an einer neuen Lösung arbeiten sollten.',
      dialogue: [{ who: 'sponsor', text: 'Ihr könnt Optionen vorbereiten. Änderungen ausserhalb eurer Befugnis entscheidet ihr aber nicht allein. Bringt mir eine transparente Grundlage.' }],
      evidence: { label: 'Projektakte · Entscheidungsspielraum', title: 'Eine Strategie ist eine bewusste Wahl', text: 'Die Zusammenarbeit wird nach dem Start weitergehen. Die Portalfrage ist für beide Seiten wichtig. Für eine gemeinsame Lösung sind Zeit und Gesprächsbereitschaft vorhanden. Eine kurze Pause zur Informationsbeschaffung ist möglich.' },
      theory: [
        section('Thomas-Kilmann: zwei Dimensionen', ['Die fünf Konfliktstile beschreiben die Orientierung am eigenen Anliegen und am Anliegen der anderen Seite.', 'Kein Stil ist immer richtig. Menschen können alle fünf Verhaltensweisen nutzen. Das Modell legt keine unveränderlichen Persönlichkeitstypen fest.']),
        section('Die fünf Konfliktstile', [], ['Durchsetzen: Das eigene Anliegen konsequent verfolgen. Kann bei dringenden Entscheidungen innerhalb der eigenen Befugnis sinnvoll sein. Risiko: Andere Perspektiven werden übergangen.', 'Nachgeben: Dem Anliegen der anderen Seite Vorrang geben. Kann bei geringer eigener Bedeutung und vertretbarem Nachteil sinnvoll sein. Risiko: Wesentliche eigene Interessen bleiben dauerhaft unberücksichtigt.', 'Vermeiden: Die Bearbeitung vorerst zurückstellen. Kann für eine Pause oder zur Informationsbeschaffung sinnvoll sein. Risiko: Der Konflikt bleibt ungelöst. Eine bewusste Pause braucht eine Vereinbarung zur Fortsetzung.', 'Kompromiss: Beide Seiten machen Zugeständnisse. Kann unter Zeitdruck eine akzeptable Lösung ermöglichen. Risiko: Zentrale Interessen bleiben teilweise unerfüllt.', 'Zusammenarbeiten: Gemeinsam Lösungen für die wesentlichen Interessen entwickeln. Besonders geeignet bei wichtigen Themen und vorhandener Gesprächsbereitschaft. Benötigt Zeit und Aufwand.']),
        section('Fünf Fragen vor der Wahl', [], ['Wie wichtig ist das Thema?', 'Wie dringend ist die Entscheidung?', 'Welche Entscheidungsbefugnis besteht?', 'Wie wichtig ist die weitere Zusammenarbeit?', 'Wie viel Zeit und Gesprächsbereitschaft sind vorhanden?'])
      ],
      tasks: [
        task('l4-1', 'single', 'Eine Pause mit Rückkehr', 'Im Gespräch fehlen belastbare Aufwandszahlen. Ihr vereinbart: 20 Minuten Pause, danach dieselbe Runde mit den ergänzten Zahlen.', 'Welcher Stil beschreibt dieses Vorgehen am besten?', [
          option('a', 'Nachgeben: Eine Seite akzeptiert die Forderung der anderen.', 'Hier gibt keine Seite ihre Forderung auf. Die Bearbeitung wird gezielt vertagt.'),
          option('b', 'Vermeiden: bewusst und vorübergehend, mit vereinbarter Fortsetzung.', 'Die Pause dient der Informationsbeschaffung. Zeitpunkt und Rahmen der Fortsetzung sind klar.'),
          option('c', 'Durchsetzen: Die Projektleitung entscheidet den Umfang.', 'Eine Umfangsentscheidung wird gerade nicht getroffen. Es werden erst Informationen ergänzt.')
        ], ['b'], 'Vermeiden kann als bewusste Pause sinnvoll sein. Entscheidend ist, dass die Bearbeitung verbindlich fortgesetzt wird.', 'Halte fest, welche Informationen bis zur Fortsetzung benötigt werden.', 3, 'Wird ein Anliegen aufgegeben oder wird die Bearbeitung zeitlich verschoben?'),
        task('l4-2', 'single', 'Zeit für eine tragfähige Lösung', 'Kundennutzen und Stabilität sind beiden Seiten wichtig. Ihr habt Zeit, mehrere Optionen zu prüfen. Beide sind gesprächsbereit, und die Zusammenarbeit wird fortgesetzt.', 'Welche Strategie passt am besten zu dieser Situation?', [
          option('a', 'Zusammenarbeiten: Anliegen klären und gemeinsam Optionen entwickeln.', 'Bedeutung, Zeit und Gesprächsbereitschaft sprechen dafür, die wesentlichen Interessen gemeinsam zu bearbeiten.'),
          option('b', 'Durchsetzen: Mara erhält alle Funktionen, weil der Kunde wichtig ist.', 'Damit würde ein Anliegen übergangen. Zudem müssen Befugnis und Auswirkungen geprüft werden.'),
          option('c', 'Vermeiden: Bis nach dem Start nicht mehr über Zusatzfunktionen sprechen.', 'Ein dauerhaftes Verschieben würde die wichtige und aktuell bearbeitbare Frage offenlassen.')
        ], ['a'], 'Zusammenarbeiten ist hier passend, weil das Thema wichtig ist und die Voraussetzungen dafür vorhanden sind. Daraus folgt keine allgemeine Rangfolge der Stile.', 'Entwickelt mehrere Optionen und prüft sie anhand gemeinsam akzeptierter Kriterien.', 3, 'Welche Strategie nutzt die vorhandene Zeit für die wichtigen Anliegen beider Seiten?'),
        task('l4-3', 'single', 'Halbieren oder neu denken?', 'Option A: Beide verzichten auf einen Teil ihrer Forderungen. Option B: Ihr gestaltet eine kleine Demonstration des zentralen Kundenablaufs und schützt zugleich die Testzeit; Aufwand und Machbarkeit werden noch geprüft.', 'Welche Einordnung passt?', [
          option('a', 'A ist Zusammenarbeit, weil beide etwas verlieren; B ist immer Nachgeben.', 'Gegenseitige Zugeständnisse beschreiben den Kompromiss. Das gemeinsame Bearbeiten der Interessen kennzeichnet Zusammenarbeit.'),
          option('b', 'A und B sind identisch, weil beide zu weniger Funktionen führen.', 'Der Umfang allein beschreibt den Konfliktstil nicht. Entscheidend ist, wie mit den Interessen umgegangen wird.'),
          option('c', 'A ist ein Kompromiss; B ist eine gemeinsam entwickelte Option zur Verbindung wesentlicher Interessen.', 'A verteilt Zugeständnisse. B sucht eine andere Lösung für Kundennutzen und Stabilität, deren Eignung noch geprüft wird.')
        ], ['c'], 'Ein Kompromiss kann sinnvoll sein. Zusammenarbeit versucht, die wichtigen Interessen durch zusätzliche Optionen besser zu verbinden; ein Erfolg ist dadurch nicht garantiert.', 'Prüfe bei B Kundennutzen, Aufwand, Terminrisiken und Qualitätsanforderungen.', 3, 'Unterscheide gegenseitige Zugeständnisse von einer neu entwickelten Option.')
      ],
      reflections: [{ id: 'style', label: 'Mein Verhalten unter Druck', prompt: 'Wie reagierst du häufig unter Druck? Welche andere Verhaltensweise könntest du beim nächsten Mal bewusst prüfen?', placeholder: 'Unter Druck neige ich dazu, … Eine mögliche Alternative wäre …' }],
      takeaway: 'Wähle einen Stil für die Situation. Lege Menschen nicht auf einen Stil fest.'
    },
    {
      id: 5, title: 'Das Konfliktgespräch führen', short: 'Gespräch führen', minutes: 15, icon: 'chat',
      kicker: 'Jetzt wird aus Wissen ein Gespräch', objective: 'Führe das Gespräch von konkreten Beobachtungen zu prüfbaren Optionen.',
      intro: 'Die neutrale Moderation sichert den Rahmen und begrenzt persönliche Angriffe. Du bringst als Projektleitung die fachlichen Fragen ein. Eure Aufgabe: Interessen verstehen und eine tragfähige Option vorbereiten. Die Sponsorin entscheidet später, soweit eure Befugnis nicht ausreicht.',
      dialogue: [{ who: 'mara', text: 'Ich möchte endlich erklären können, was der Kunde wirklich braucht.' }, { who: 'leon', text: 'Und ich möchte, dass unsere Kapazität und die nötigen Tests ernst genommen werden.' }],
      evidence: { label: 'Gesprächsakte · Vereinbarter Rahmen', title: 'Verstehen bedeutet nicht automatisch zustimmen', text: 'Ihr sprecht über konkrete Situationen, lasst einander ausreden und begrenzt Abwertungen. Nach jedem Abschnitt prüfst du, was verstanden wurde. Die folgenden Reaktionen zeigen mögliche Verläufe, keine garantierten menschlichen Reaktionen.' },
      theory: [
        section('1 · Vorbereiten', ['Kläre Beobachtungen, Auswirkungen, eigene Interessen, deinen eigenen Anteil und deine Entscheidungsbefugnis. Prüfe, ob deine Neutralität für eine Moderation ausreicht.']),
        section('2 · Rahmen vereinbaren', ['Benenne Ziel, Zeit und Gesprächsregeln. Lasst einander ausreden, beschreibt konkrete Situationen und begrenzt persönliche Abwertungen.']),
        section('3 · Perspektiven verstehen', ['Stelle offene Fragen, höre aktiv zu und fasse das Gehörte zusammen. Überprüfe mit «Habe ich dich richtig verstanden?». Verstehen bedeutet nicht automatisch zustimmen.']),
        section('4 · Interessen und Optionen bearbeiten', ['Nutze die vier Prinzipien des Harvard-Konzepts:'], ['Menschen und Problem getrennt betrachten.', 'Interessen hinter Positionen erkunden.', 'Mehrere Lösungsoptionen entwickeln.', 'Gemeinsam akzeptierte sachliche Kriterien verwenden.'], 'Mögliche Kriterien im Projekt: Kundennutzen, Aufwand, Terminrisiken und vereinbarte Qualitätsanforderungen. Welche Kriterien gelten, muss im konkreten Fall geklärt werden.'),
        section('5 · Vereinbarungen sichern', ['Wer übernimmt was bis wann? Wer entscheidet offene Punkte? Wann wird die Wirkung überprüft?']),
        section('Eine hilfreiche Formulierung', ['«Wenn [Beobachtung], hat das [Auswirkung]. Mir ist [Anliegen] wichtig. Können wir [konkrete Bitte]?»', '«Ich finde, du bist unzuverlässig» ist trotz Ich-Form eine Bewertung.'], [], '«In den letzten beiden Abstimmungen wurden zusätzliche Funktionen direkt an die Entwicklung gegeben. Dadurch war unklar, welche Aufgaben Vorrang haben. Ich brauche eine gemeinsame Priorisierung. Können wir neue Anforderungen zuerst im vereinbarten Änderungsprozess prüfen?»')
      ],
      tasks: [
        task('l5-1', 'dialogue', 'Das Gespräch eröffnen', 'Die Moderation hat Ziel, Zeit und Regeln vereinbart. Du eröffnest den fachlichen Teil. In zwei Abstimmungen wurden neue Funktionen direkt an die Entwicklung gegeben.', 'Wie beginnst du?', [
          option('a', '«Mara, du bringst unseren Plan ständig durcheinander. Das muss aufhören.»', 'Die pauschale Bewertung richtet den Fokus auf die Person und kann Rechtfertigung auslösen.', 'mara|«Ich versuche, den Kunden zu halten. Du stellst mich gerade als das Problem dar.»'),
          option('b', '«In zwei Abstimmungen gingen neue Funktionen direkt an die Entwicklung. Dadurch war die Priorität unklar. Mir ist ein gemeinsamer Plan wichtig. Können wir die Anforderungen zusammen prüfen?»', 'Beobachtung, Auswirkung, Anliegen und konkrete Bitte sind erkennbar. Das erleichtert eine sachliche Bearbeitung.', 'leon|«Ja. Dann können wir endlich klären, was wirklich Vorrang hat.»'),
          option('c', '«Ich finde, ihr seid beide unprofessionell. Jetzt vertragt euch.»', 'Eine Ich-Form macht die Bewertung nicht sachlich. Die Aufforderung klärt weder Anlass noch Vorgehen.', 'mara|«Was genau soll ich denn jetzt anders machen?»')
        ], ['b'], 'Ein konkreter Einstieg benennt das beobachtbare Problem und lädt zur gemeinsamen Bearbeitung ein.', 'Lass nun beide Seiten ihre Perspektive und die Auswirkungen schildern.', 4, 'Suche Beobachtung, Auswirkung, Anliegen und eine konkrete Bitte.'),
        task('l5-2', 'dialogue', 'Maras Forderung öffnen', 'Mara sagt: «Wir brauchen alle Zusatzfunktionen. Sonst wird der Kundentermin nichts.»', 'Wie erkundest du den benötigten Kundennutzen?', [
          option('a', '«Welche konkreten Abläufe muss der Kunde beim Termin zeigen können, und was ist daran unverzichtbar?»', 'Die Frage erkundet Zweck und Prioritäten, ohne ein Motiv zu unterstellen.', 'mara|«Er muss einen Auftrag vom Eingang bis zur Freigabe zeigen. Die übrigen Auswertungen könnten später kommen.»'),
          option('b', '«Dann verspreche ich dir alle Funktionen für den Start.»', 'Die Zusage überspringt Aufwand, Risiken und Entscheidungsbefugnis. Das kann Erwartungen erzeugen, die nicht tragbar sind.', 'leon|«Wie sollen wir das ohne Prüfung verbindlich schaffen?»'),
          option('c', '«Du meinst also, dein Kunde ist wichtiger als unser Team?»', 'Die zugespitzte Entweder-oder-Frage kann die Fronten verhärten, statt den benötigten Nutzen zu klären.', 'mara|«Darum geht es mir nicht. So kommen wir nicht weiter.»')
        ], ['a'], 'Das Interesse hinter «alle Funktionen» kann ein bestimmter Kundenablauf sein. Diese Information muss im Gespräch gewonnen werden.', 'Halte den bestätigten Kundenablauf fest und prüfe anschliessend die Rahmenbedingungen.', 4, 'Welche offene Frage macht den Zweck der Funktionen konkret?'),
        task('l5-3', 'dialogue', 'Leon wirklich verstehen', 'Leon erklärt: «Wir brauchen vor dem Start ausreichend Testzeit. Dauernde Zusatzaufgaben machen unsere Kapazitätsplanung unbrauchbar.»', 'Welche Antwort zeigt aktives Zuhören?', [
          option('a', '«Du willst also grundsätzlich keine Veränderung.»', 'Die Zusammenfassung übergeht seine genannten Anliegen und macht aus einer Bedingung eine pauschale Haltung.', 'leon|«Nein. Ich habe über Tests und Kapazität gesprochen.»'),
          option('b', '«Verstanden. Dann streichen wir den Kundentermin sofort.»', 'Verstehen bedeutet nicht, ohne Prüfung eine Lösung zuzusagen. Andere Interessen und Befugnisse bleiben offen.', 'mara|«Unser Anliegen ist damit noch gar nicht geprüft.»'),
          option('c', '«Dir sind eine stabile Version und ein realistischer Plan mit genügend Testzeit wichtig. Habe ich dich richtig verstanden?»', 'Du fasst seine Interessen zusammen und prüfst, ob deine Zusammenfassung zutrifft.', 'leon|«Genau. Wenn wir das absichern, können wir über einen begrenzten Umfang sprechen.»')
        ], ['c'], 'Aktives Zuhören verbindet Zusammenfassen mit Überprüfen. Es ist keine automatische Zustimmung zu einer Forderung.', 'Nimm Stabilität und realistischen Aufwand in die gemeinsamen Prüfkriterien auf.', 4, 'Welche Antwort fasst das Gesagte zusammen und lässt eine Korrektur zu?'),
        task('l5-4', 'dialogue', 'Eine Grenze setzen', 'Leon sagt gereizt: «Der Vertrieb denkt doch nie nach, bevor er etwas verspricht.» Die Moderation hält inne. Du reagierst auf den fachlichen Gesprächsbedarf.', 'Wie begrenzt du den Angriff und führst zurück zur Sache?', [
          option('a', '«Das stimmt leider oft. Mara, rechtfertige dich bitte.»', 'Du bestätigst die Abwertung. Das kann Lagerbildung und Verteidigung verstärken.', 'mara|«Wenn das hier das Urteil ist, brauchen wir nicht weiterzureden.»'),
          option('b', '«Die pauschale Abwertung hilft uns nicht. Bleiben wir bei konkreten Situationen. Auf welche Zusage beziehst du dich und welche Auswirkung hatte sie?»', 'Du begrenzt die Abwertung und fragst nach überprüfbarem Verhalten und dessen Wirkung.', 'leon|«Ich meine die Zusage der Auswertung am Dienstag. Dafür mussten wir Testaufgaben verschieben.»'),
          option('c', '«Wir ignorieren den Satz einfach und stimmen jetzt über den Umfang ab.»', 'Der Angriff bleibt unadressiert. Eine Abstimmung klärt weder die belastete Zusammenarbeit noch die Kriterien.', 'mara|«Bevor wir abstimmen: So möchte ich hier nicht angesprochen werden.»')
        ], ['b'], 'Grenzen und Konkretisierung können zusammenwirken. Bei anhaltenden Angriffen oder schwerwiegenden Vorfällen muss der Unterstützungsrahmen angepasst werden.', 'Kläre die konkrete Situation und ihre Auswirkungen, ohne die Abwertung zu übernehmen.', 4, 'Verbinde eine klare Grenze mit einer Frage nach dem konkreten Ereignis.'),
        task('l5-5', 'dialogue', 'Eine Option gemeinsam prüfen', 'Als Arbeitsoption liegt ein begrenzter Startumfang mit späterer Erweiterung auf dem Tisch. Ob Kundennutzen und Stabilität damit gesichert sind, ist noch zu prüfen.', 'Was ist der passende nächste Schritt?', [
          option('a', 'Gemeinsam Kundennutzen, Aufwand, Terminrisiken und Qualitätsanforderungen klären und die Option daran prüfen; offene Freigaben kenntlich machen.', 'Die Option wird anhand gemeinsam akzeptierter Kriterien geprüft. Befugnisse und offene Entscheide bleiben transparent.', 'sponsor|«Mit dieser Prüfung kann ich die offenen Änderungen fundiert entscheiden.»'),
          option('b', 'Die Option sofort als beschlossen erklären, weil beide etwas bekommen.', 'Eine attraktive Idee ist noch keine geprüfte und freigegebene Lösung. Machbarkeit und Befugnisse bleiben ungeklärt.', 'leon|«Wir haben den Aufwand dafür noch nicht geprüft.»'),
          option('c', 'Nur die Anzahl der Funktionen halbieren und andere Kriterien weglassen.', 'Ein mechanisches Halbieren kann zentrale Interessen verfehlen. Entscheidend ist der Nutzen unter tragbaren Bedingungen.', 'mara|«Die Hälfte hilft nicht, wenn der wichtige Ablauf trotzdem fehlt.»')
        ], ['a'], 'Das Harvard-Konzept verbindet Interessenklärung, mehrere Optionen und sachliche Kriterien. Ein begrenzter Umfang ist eine prüfbare Option, keine automatische Musterlösung.', 'Bereitet eine konkrete Vereinbarung und bei Bedarf eine Entscheidungsvorlage vor.', 4, 'Eine Lösungsidee braucht Kriterien, eine Machbarkeitsprüfung und gegebenenfalls eine Freigabe.')
      ],
      reflections: [{ id: 'opening', label: 'Mein Gesprächseinstieg', prompt: 'Formuliere Beobachtung, Auswirkung, eigenes Anliegen und eine offene Frage oder konkrete Bitte.', placeholder: 'Wenn …, hat das … Mir ist … wichtig. Können wir …?' }],
      takeaway: 'Beschreibe konkret, höre überprüfend zu und prüfe Optionen anhand gemeinsamer Kriterien.'
    },
    {
      id: 6, title: 'Die Lösung im Projekt verankern', short: 'Lösung verankern', minutes: 8, icon: 'checklist',
      kicker: 'Aus einem guten Gespräch wird ein Arbeitsplan', objective: 'Sichere konkrete Vereinbarungen und trenne Entscheidung von Konfliktbegleitung.',
      intro: 'Mara und Leon haben ihre Anliegen erklärt. Als Option steht ein begrenzter Demonstrationsumfang mit späterer Erweiterung zur Prüfung. Jetzt brauchst du Verantwortliche, Termine, Freigaben und eine Überprüfung. Eine freundliche Absichtserklärung reicht nicht.',
      dialogue: [{ who: 'sponsor', text: 'Legt mir die offene Entscheidung mit Optionen, Auswirkungen und Empfehlung vor. Sagt auch, bis wann der Entscheid benötigt wird.' }],
      evidence: { label: 'Projektakte · Zwei verschiedene Wege', title: 'Eine offene Entscheidung ist nicht dasselbe wie ein sozialer Konflikt', text: 'Die Sponsorin entscheidet über Änderungen ausserhalb eurer Befugnis. Eine neutrale Moderation oder qualifizierte Konfliktbegleitung unterstützt bei festgefahrener Zusammenarbeit. Beide Wege können unabhängig voneinander nötig sein.' },
      theory: [
        section('Eine belastbare Vereinbarung', ['Eine Einigung muss in konkrete Handlungen übersetzt werden. Eine belastbare Vereinbarung enthält:'], ['Inhalt oder erwartetes Ergebnis.', 'Verantwortliche Person.', 'Termin.', 'Erforderliche Entscheidung oder Freigabe.', 'Zeitpunkt und Kriterien der Überprüfung.'], '«Mara liefert bis Dienstag die priorisierten Kundenabläufe. Leon ergänzt bis Donnerstag Aufwand und Risiken. Am Freitag entscheidet das zuständige Gremium über den Startumfang.» Ergänze für die praktische Umsetzung den Überprüfungstermin und die Kriterien.'),
        section('Entscheidung oder soziale Unterstützung?', [], ['Fachliche Eskalation: Eine Entscheidung überschreitet die Befugnis der Beteiligten.', 'Unterstützung bei einem sozialen Konflikt: Die Zusammenarbeit lässt sich im bisherigen Rahmen nicht ausreichend klären.']),
        section('Eine gute Entscheidungsvorlage', [], ['Die offene Entscheidung.', 'Verfügbare Optionen.', 'Relevante Auswirkungen.', 'Eine begründete Empfehlung.', 'Die benötigte Entscheidungsfrist.']),
        section('Konflikten vorbeugen', [], ['Rollen und Entscheidungsrechte klären.', 'Prioritäten gemeinsam verstehen.', 'Einen nachvollziehbaren Änderungsprozess vereinbaren.', 'Kommunikationsregeln festlegen.', 'Spannungen regelmässig früh ansprechen.'])
      ],
      tasks: [
        task('l6-1', 'single', 'Was wird wirklich vereinbart?', 'Du hältst fest, wie die Option geprüft und entschieden wird. Für diese Übung gelten die genannten Wochentage relativ zur laufenden Projektwoche.', 'Welche Vereinbarung ist belastbar?', [
          option('a', '«Alle bemühen sich um eine gute Lösung. Wir schauen bald wieder darauf.»', 'Ergebnis, Verantwortlichkeit und verbindliche Termine fehlen. Die Umsetzung bleibt unklar.'),
          option('b', '«Leon kümmert sich zeitnah um alles Weitere.»', 'Eine Person ist genannt, aber Ergebnis, Frist, Freigabe und Überprüfung sind nicht geklärt.'),
          option('c', '«Mara priorisiert bis Dienstag Kundenabläufe. Leon ergänzt bis Donnerstag Aufwand und Risiken. Die Sponsorin entscheidet Freitag über den Umfang. Am folgenden Montag prüfen wir gemeinsam Kundennutzen, Testzeit und offene Risiken.»', 'Die Vereinbarung enthält Ergebnisse, Verantwortliche, Termine, Entscheidung und eine Überprüfung mit Kriterien.')
        ], ['c'], 'Eine konkrete Vereinbarung macht sichtbar, wer was bis wann tut, wer entscheidet und wie die Wirkung geprüft wird.', 'Dokumentiere sie zugänglich und bestätige das gemeinsame Verständnis.', 5, 'Prüfe die fünf Bestandteile: Ergebnis, Person, Termin, Freigabe und Überprüfung.'),
        task('l6-2', 'multi', 'Die Sponsorin braucht eine Grundlage', 'Die Umfangsänderung überschreitet deine Befugnis. Du bereitest eine knappe Entscheidungsvorlage vor.', 'Welche fünf Bestandteile gehören hinein?', [
          option('a', 'Die konkret offene Entscheidung.', 'Die zuständige Instanz muss wissen, was entschieden werden soll.'),
          option('b', 'Die verfügbaren Optionen.', 'Alternativen machen den Entscheidungsspielraum sichtbar.'),
          option('c', 'Die relevanten Auswirkungen der Optionen.', 'Folgen für Nutzen, Aufwand, Termin und Qualität ermöglichen eine fundierte Abwägung.'),
          option('d', 'Eine begründete Empfehlung.', 'Eine nachvollziehbare Empfehlung unterstützt den Entscheid, ohne ihn vorwegzunehmen.'),
          option('e', 'Die benötigte Entscheidungsfrist.', 'Die Frist macht deutlich, wann der Entscheid für den Projektverlauf gebraucht wird.'),
          option('f', 'Das vollständige Chatarchiv als Ersatz für eine Zusammenfassung.', 'Rohmaterial ersetzt keine strukturierte Entscheidungsvorlage. Relevante Belege können gezielt ergänzt werden.'),
          option('g', 'Eine bereits verbindlich erteilte Zusage für die bevorzugte Option.', 'Die Zusage würde die erforderliche Entscheidung vorwegnehmen und die eigene Befugnis überschreiten.')
        ], ['a', 'b', 'c', 'd', 'e'], 'Eine transparente Vorlage verbindet Entscheidungsfrage, Optionen, Auswirkungen, Empfehlung und Frist. Sie ersetzt keine erforderliche Konfliktbegleitung.', 'Übermittle die Vorlage an die zuständige Instanz und halte den Entscheid nachvollziehbar fest.', 6, 'Welche Informationen ermöglichen einer befugten Person einen fundierten und rechtzeitigen Entscheid?')
      ],
      reflections: [{ id: 'agreement', label: 'Meine vollständige Vereinbarung', prompt: 'Formuliere für den Projektfall: Ergebnis, verantwortliche Person, Termin, Freigabe und Überprüfung mit Kriterien.', placeholder: 'Bis … erstellt … Die Freigabe erfolgt durch … Am … überprüfen wir … anhand von …' }],
      takeaway: 'Eine Vereinbarung braucht Umsetzung und Überprüfung. Eine offene Befugnisfrage braucht einen Entscheid.'
    },
    {
      id: 7, title: 'Abschlussmission', short: 'Transfermission', minutes: 7, icon: 'flag',
      kicker: 'Neuer Fall. Dein Werkzeug bleibt.', objective: 'Übertrage dein Vorgehen auf einen Ressourcenkonflikt.',
      intro: 'Zwei Teilprojektleitende benötigen dieselbe Datenanalystin in derselben Woche. Nina braucht sie für einen Kundentest, Omar für eine Budgetprognose. Beide geben ihr direkt Aufgaben. Eine verbindliche Priorisierung fehlt. Du darfst die Priorität zwischen den Vorhaben nicht allein festlegen.',
      dialogue: [{ who: 'nina', text: 'Bei Omar ist grundsätzlich alles dringend.' }, { who: 'omar', text: 'Ohne die Prognose fehlt die Grundlage für den Budgetentscheid. Ich brauche ihre Unterstützung diese Woche.' }],
      evidence: { label: 'Neue Fallakte · Eine knappe Ressource', title: 'Kundentest oder Budgetprognose?', text: 'Die Aufgaben konkurrieren um dieselbe Kapazität. Bedarf, Aufwand, Fristen und Folgen müssen noch geklärt werden. Deine Befugnis reicht nicht aus, die Priorität zwischen den Vorhaben allein festzulegen.' },
      theory: [
        section('Dein Werkzeug für den neuen Fall', ['Nutze die Inhalte der bisherigen Levels. Du kannst jederzeit das Wissensarchiv öffnen. Die Abschlussmission enthält drei bewertete Aufgaben.'], ['Beobachten und Konfliktursachen erkennen.', 'Bedarfe, Interessen, Aufwand, Fristen und Folgen klären.', 'Persönliche Angriffe begrenzen.', 'Optionen und sachliche Kriterien prüfen.', 'Bei verbleibendem Engpass eine transparente Entscheidungsvorlage an die zuständige Instanz geben.']),
        section('Was die Bewertung aussagt', ['Jede der 20 Aufgaben ergibt höchstens einen Punkt. Ab 14 Punkten ist die Mission bestanden. Nicht korrekt gelöste Aufgaben dürfen wiederholt werden.', 'Reflexionen und persönliche Texte werden nicht automatisch als richtig oder falsch bewertet. Die Bewertung dient dem Lernen, nicht einer psychologischen Diagnose.'])
      ],
      tasks: [
        task('l7-1', 'multi', 'Den neuen Konflikt einordnen', 'Nina und Omar planen gleichzeitig mit derselben Analystin. Eine verbindliche Regel für die Priorisierung fehlt.', 'Welche zwei Ursachen sind anhand der Angaben gesichert erkennbar?', [
          option('a', 'Konkurrenz um eine knappe Ressource.', 'Beide Vorhaben beanspruchen dieselbe Kapazität im gleichen Zeitraum.'),
          option('b', 'Eine grundsätzlich mangelnde Leistungsbereitschaft der Analystin.', 'Dafür gibt es keinen Beleg. Die Angaben beschreiben konkurrierende Anforderungen.'),
          option('c', 'Fehlende verbindliche Priorisierung der Aufgaben.', 'Ohne abgestimmte Priorität erhält die Analystin widersprüchliche Anforderungen.'),
          option('d', 'Eine bewiesene Sabotageabsicht von Omar.', 'Ninas pauschaler Satz beweist keine Absicht. Eine solche Unterstellung würde den Konflikt zusätzlich belasten.')
        ], ['a', 'c'], 'Die Kapazitätskonkurrenz und die fehlende Priorisierung sind beschrieben. Persönliche Motive oder Leistungsdefizite sind nicht belegt.', 'Kläre die Anforderungen beider Vorhaben und die zuständige Entscheidungsinstanz.', 0, 'Bleibe bei den beschriebenen Rahmenbedingungen statt bei unterstellten Motiven.'),
        task('l7-2', 'single', 'Der erste sinnvolle Schritt', 'Ninas persönliche Spitze steht im Chat. Noch fehlen Aufwandszahlen und die Folgen möglicher Verschiebungen.', 'Wie gehst du zunächst vor?', [
          option('a', 'Du gibst Nina Vorrang, weil ein Kundentermin grundsätzlich alles andere übertrifft.', 'Die pauschale Priorität ist nicht belegt und überschreitet deine Befugnis. Wichtige Auswirkungen bleiben ungeprüft.'),
          option('b', 'Du begrenzt die persönliche Abwertung, klärst Bedarfe, Aufwand, Fristen und Folgen und prüfst gemeinsam Optionen.', 'Du schaffst eine sachliche Grundlage und behandelst zugleich den belastenden Umgang.'),
          option('c', 'Du lässt die Analystin heimlich entscheiden, für wen sie arbeitet.', 'Damit verlagerst du den ungeklärten Priorisierungskonflikt auf die betroffene Person.')
        ], ['b'], 'Informationsklärung und ein respektvoller Rahmen ermöglichen Optionen, ohne eine unbefugte Priorität vorwegzunehmen.', 'Prüfe beispielsweise zeitliche Aufteilung, Umfangsanpassung oder Verschiebung anhand der tatsächlichen Anforderungen.', 4, 'Was schafft Klarheit und begrenzt Abwertung, ohne schon die Priorität zu entscheiden?'),
        task('l7-3', 'single', 'Wenn der Engpass bestehen bleibt', 'Die Anforderungen sind geklärt. Auch nach der Prüfung möglicher Anpassungen reicht die Kapazität nicht für beide Vorhaben. Deine Befugnis bleibt unverändert.', 'Was tust du jetzt?', [
          option('a', 'Eine transparente Entscheidungsvorlage mit Optionen, Auswirkungen, Empfehlung und Frist an die zuständige Instanz geben.', 'So kann die befugte Instanz den verbleibenden Zielkonflikt fundiert entscheiden.'),
          option('b', 'Ohne Rücksprache verbindliche Mehrarbeit der Analystin zusagen.', 'Das ist keine geklärte Kapazitätslösung. Befugnis, Machbarkeit und Folgen bleiben offen.'),
          option('c', 'Den Konflikt als gelöst markieren, weil alle ihre Interessen erklärt haben.', 'Interessenklärung allein beseitigt den realen Engpass nicht. Es bleibt eine verbindliche Entscheidung nötig.')
        ], ['a'], 'Wenn die Entscheidung ausserhalb deiner Befugnis liegt, bereite sie transparent für die zuständige Instanz vor. Bei fortbestehenden sozialen Problemen ist zusätzlich passende Unterstützung zu prüfen.', 'Dokumentiere den Entscheid, passe die Planung an und überprüfe die Wirkung.', 6, 'Wer hat die Befugnis für die Priorität zwischen den Vorhaben?')
      ],
      reflections: [
        { id: 'transferSignal', label: 'Mein Warnsignal für die Zukunft', prompt: 'Ein Warnsignal, auf das ich künftig achte, ist …', placeholder: 'Ich achte künftig auf …' },
        { id: 'transferQuestion', label: 'Meine nächste gute Frage', prompt: 'Eine Frage für mein nächstes Konfliktgespräch lautet …', placeholder: 'In meinem nächsten Gespräch frage ich …' },
        { id: 'transferHelp', label: 'Meine Unterstützung', prompt: 'Wenn meine Befugnis oder meine Möglichkeiten zur Klärung nicht ausreichen, wende ich mich an …', placeholder: 'Für einen Entscheid / für Konfliktbegleitung wende ich mich an …' }
      ], takeaway: 'Du musst nicht alles allein entscheiden oder klären. Du musst den passenden nächsten Schritt ermöglichen.'
    }
  ];
  const characters = {
    mara: { name: 'Mara', role: 'Vertrieb', color: '#bc7158', initials: 'MA' },
    leon: { name: 'Leon', role: 'Entwicklung', color: '#658b8a', initials: 'LE' },
    sponsor: { name: 'Sponsorin', role: 'Entscheidungsinstanz', color: '#8576a5', initials: 'SP' },
    nina: { name: 'Nina', role: 'Teilprojektleitung · Kundentest', color: '#bc7158', initials: 'NI' },
    omar: { name: 'Omar', role: 'Teilprojektleitung · Budget', color: '#658b8a', initials: 'OM' }
  };
  const glossary = [
    ['Beobachtung', 'Ein überprüfbares Ereignis ohne Bewertung oder unterstellte Absicht.'],
    ['Position', 'Eine konkrete Forderung, etwa «Alle Funktionen müssen in die erste Version».'],
    ['Interesse', 'Das Anliegen hinter einer Forderung. Ein vermutetes Interesse muss durch Fragen überprüft werden.'],
    ['Sachkonflikt', 'Unterschiedliche Informationen oder fachliche Einschätzungen.'],
    ['Interessenkonflikt', 'Unterschiedliche Bedürfnisse, Ziele oder Prioritäten.'],
    ['Rollen- und Zuständigkeitskonflikt', 'Unklare Verantwortung oder Entscheidungsbefugnis.'],
    ['Beziehungskonflikt', 'Erlebte Abwertung, Misstrauen oder belasteter Umgang.'],
    ['Wertekonflikt', 'Unterschiedliche grundlegende Massstäbe und Überzeugungen.'],
    ['Glasl', 'Orientierungsmodell mit neun Eskalationsstufen in drei Hauptphasen: Win-win, Win-lose und Lose-lose. Keine sichere Diagnose aus einer einzelnen Aussage.'],
    ['Thomas-Kilmann', 'Fünf situativ nutzbare Konfliktstile: Durchsetzen, Nachgeben, Vermeiden, Kompromiss und Zusammenarbeiten. Keine festen Persönlichkeitstypen.'],
    ['Harvard-Konzept', 'Menschen und Problem trennen, Interessen erkunden, mehrere Optionen entwickeln und gemeinsam akzeptierte sachliche Kriterien nutzen.'],
    ['Aktives Zuhören', 'Gehörtes aufmerksam aufnehmen, zusammenfassen und mit der anderen Person überprüfen. Verstehen bedeutet nicht automatisch zustimmen.'],
    ['Fachliche Eskalation', 'Eine offene Entscheidung an die befugte Instanz geben, wenn die eigene Entscheidungsbefugnis nicht ausreicht.'],
    ['Konfliktbegleitung', 'Passende Unterstützung für eine Zusammenarbeit, die sich im bisherigen Rahmen nicht ausreichend klären lässt.'],
    ['Vereinbarung', 'Ergebnis, verantwortliche Person, Termin, erforderliche Freigabe und Überprüfung mit Zeitpunkt und Kriterien.']
  ];
  return { levels, characters, glossary, skills, passScore: 14, total: 20, version: 1 };
})();
