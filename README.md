# Mission Projektfrieden

Ein vollständiges deutschsprachiges Lernspiel zum **Konfliktmanagement im Projektmanagement**. Du leitest das Projekt «Kundenportal» und begleitest einen Konflikt zwischen Vertrieb und Entwicklung. Schweizer Rechtschreibung, sieben Levels, 20 bewertete Aufgaben, direkte Rückmeldungen und persönliche Transferübungen.

**Richtzeit: 60 Minuten** mit Theorie, Lesen, Entscheiden, Feedback und Reflexion. Es gibt keine künstlichen Wartezeiten. Die tatsächliche Dauer hängt vom Lesetempo und der Bearbeitung der Schreibaufgaben ab.

## Sofort starten

```bash
git clone https://github.com/elpoco98/mission-projektfrieden.git
cd mission-projektfrieden
```

**Öffne danach `index.html` per Doppelklick in einem aktuellen Browser.** Kein Build, keine Installation, kein Konto und keine Internetverbindung erforderlich. Alle Bilder, Fachtexte, Styles und Skripte sind im Repository enthalten.

### Empfohlen für eine konstante Speicheradresse: lokaler Server

Mit Node.js ab Version 20:

```bash
npm start
```

Öffne **http://127.0.0.1:3000**. Ein `npm install` ist nicht nötig: Das Projekt hat keine externen Abhängigkeiten. Mit `Strg+C` beendest du den Server.

Alternativ mit Python 3:

```bash
python -m http.server 3000 --bind 127.0.0.1
```

Auch hier öffnest du **http://127.0.0.1:3000**. Verwende immer denselben Browser und dieselbe Adresse, wenn du deinen gespeicherten Stand fortsetzen möchtest. Der enthaltene Node-Server beschränkt den Zugriff standardmässig auf deinen Rechner.

## Dein Lernweg

| Level | Thema | Richtzeit | Bewertete Aufgaben |
| --- | --- | --- | --- |
| 1 | Alarm im Projekt | 5 Min. | 2 |
| 2 | Hinter die Positionen schauen | 8 Min. | 3 |
| 3 | Die Eskalation stoppen | 7 Min. | 2 |
| 4 | Die passende Strategie wählen | 10 Min. | 3 |
| 5 | Das Konfliktgespräch führen | 15 Min. | 5 |
| 6 | Die Lösung im Projekt verankern | 8 Min. | 2 |
| 7 | Abschlussmission: Ressourcenkonflikt | 7 Min. | 3 |
| **Gesamt** | | **60 Min.** | **20** |

Jedes Level enthält ein Briefing mit vollständiger Theorie, eine Mission und unbewertete Reflexionen. Im Wissensarchiv kannst du die Theorie jederzeit nachschlagen und durchsuchen. Die Gesprächsszenen zeigen mögliche Reaktionen auf deine Entscheidungen. Bei ungünstigen Entscheidungen unterstützt eine moderierte Überleitung den nächsten Lernschritt; menschliche Reaktionen werden nicht als zwangsläufig dargestellt.

## Bewertung und Wiederholung

- Pro Aufgabe höchstens ein Punkt, insgesamt maximal 20.
- **Bestanden ab 14 Punkten nach Abschluss aller sieben Levels.**
- Mehrfachauswahl ist deutlich gekennzeichnet und nennt die Anzahl der richtigen Antworten. Ein Punkt wird nur für die vollständig passende Auswahl vergeben.
- Falsch gelöste Aufgaben können direkt oder im Entscheidungsjournal wiederholt werden. Eine spätere korrekte Lösung ergibt den einen Punkt; es gibt keine Zusatzpunkte für Wiederholungen.
- Hinweise kosten keine Punkte. Die Lernbilanz berücksichtigt, ob Unterstützung oder mehrere Versuche genutzt wurden.
- Persönliche Texte werden nicht automatisch bewertet. Du kannst sie leer lassen.
- Drei Fallausgänge zeigen deinen Lernstand im fiktiven Projekt. Kritische Schritte bei Gesprächsrahmen, Kriterien, Vereinbarung und Befugnis können nicht durch andere richtige Aufgaben zum besten Fallausgang ausgeglichen werden. Die allgemeine Bestehensgrenze bleibt 14/20.
- Die Bewertung ist eine Lernhilfe und keine psychologische Diagnose.

## Werkzeugkarte und persönliche Notizen

Die Werkzeugkarte enthält sieben Handlungsschritte, deine Lernbilanz und alle Reflexionen. Du kannst sie als Textdatei herunterladen oder über «Drucken / als PDF sichern» ausgeben. Der neue Ressourcenfall und seine drei Transferfragen sind vollständig enthalten.

Dein Stand wird nach Entscheidungen und während des Schreibens in `localStorage` gespeichert. **Keine Übertragung, keine Analyse-Dienste, keine Cookies und keine Serverdatenbank.** Der Stand gehört zum verwendeten Browserprofil und zur jeweiligen Adresse. Privates Surfen, blockierter Speicher oder das Löschen von Browserdaten können die Speicherung verhindern oder entfernen. Das Spiel bleibt in der aktuellen Sitzung nutzbar und zeigt Speicherprobleme an. Die direkte Dateinutzung über `file://` wird von Browsern beim lokalen Speicher unterschiedlich behandelt; für verlässlicheres Fortsetzen verwende die lokale Servervariante.

Der Textexport ist eine persönliche Lernzusammenfassung, kein importierbares Spielstand-Backup. Verwende in Reflexionen keine vertraulichen oder personenbezogenen Angaben.

## Bedienung und Zugänglichkeit

- Responsive Oberfläche für Desktop, Tablet und Smartphone.
- Native Radio- und Checkboxfelder, sichtbare Fokusmarkierungen und Tastaturbedienung.
- Sprunglink zum Hauptinhalt und Screenreader-Rückmeldung bei Entscheidungen.
- Keine Tonpflicht, kein Zeitdruck und keine Drag-and-drop-Pflicht.
- Reduzierte Bewegung wird berücksichtigt.
- Ein Neustart löscht den lokalen Fortschritt erst nach Bestätigung.

Eine formale Zertifizierung der Barrierefreiheit wurde nicht vorgenommen.

## Inhalte bearbeiten

| Datei | Zweck |
| --- | --- |
| `src/content.js` | Alle sieben Levels, vollständige Theorie, Figuren, 20 Aufgaben, richtige Antworten, Feedback, Hinweise, Reflexionen und Glossar |
| `src/engine.js` | Bewertung, Freischaltung, Lernbilanz, Fallausgänge und Spielstandvalidierung |
| `src/app.js` | Oberfläche, Navigation, Interaktionen, Speicherung, Export und Druck |
| `src/style.css` | Gestaltung, responsive Layouts, reduzierte Bewegung und Druckansicht |
| `server.cjs` | Optionaler lokaler Webserver ohne Abhängigkeiten |
| `tests/engine.test.cjs` | Automatisierte Inhalts- und Spiellogiktests |
| `tests/ui.test.cjs` | Vollständige Ereignis- und Renderabläufe in einer DOM-Simulation, ohne Browserlayout |
| `tests/server.test.cjs` | Start, Assets, MIME-Typen und Pfadschutz des lokalen Servers |
| `docs/lernkonzept.md` | Lernzielzuordnung, didaktische Entscheidungen und Grenzen |

Aufgaben haben stabile IDs wie `l5-3`. Bei inkompatiblen Änderungen des Datenmodells muss die Version in `src/content.js` erhöht und eine Migration oder ein bewusstes Zurücksetzen vorgesehen werden. Texte werden in der Oberfläche als Text behandelt und nicht als HTML ausgeführt.

## Entwickeln und prüfen

```bash
npm run check
npm test
```

Die Tests prüfen unter anderem die geforderte Aufgabenverteilung, 60 Minuten Richtzeit, vollständiges Feedback, Bewertung, Wiederholung, exakte Mehrfachauswahl, Level-Freischaltung, drei Fallausgänge, die Bestehensgrenze und beschädigte beziehungsweise manipulierte Spielstände.

GitHub Actions führt diese Prüfungen bei Pushes und Pull Requests aus. Dafür ist keine Paketinstallation erforderlich.

Die automatisierte UI-Simulation ersetzt keine visuelle Browserprüfung. Eine visuelle Prüfung war in der Erstellungsumgebung wegen einer nicht verfügbaren Vorschau-Infrastruktur nicht möglich. Vor einem breiten Schulungseinsatz sollte die Oberfläche in den tatsächlich verwendeten Browsern und auf einem Smartphone geprüft werden.

## Fachliche Grundlage

Die vom Auftraggeber bereitgestellte Vorlage «Konfliktmanagement im Projektmanagement», einschliesslich der vorgegebenen Erläuterungen zu Glasl, Thomas-Kilmann und Harvard-Konzept. Für Lernende sind alle benötigten Inhalte im Spiel enthalten. Das Spiel ersetzt keine betrieblichen Verfahren bei schwerwiegenden Vorfällen und keine qualifizierte Konfliktbegleitung.
