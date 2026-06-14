# CLAUDE.md

Hinweise für Claude Code beim Arbeiten in diesem Repository.

## Projekt

**72h Aktionszentrale** — statisches HTML/CSS/JS-Mockup eines internen
Organisationstools für die regionale 72h Aktion (Koordinierungskreis,
teilnehmende Gruppen, Themenfelder, Vorgänge, Aktionsdokumentation).

Es ist **explizit nur ein Mockup**: kein Backend, keine echte Persistenz,
nur statische Dummy-Daten. Es geht darum, das spätere Tool sichtbar und
diskutierbar zu machen — nicht um produktive Funktionen.

## Harte Regeln (nicht abweichen)

- **Keine Frameworks, keine Build-Tools.** Nur HTML, CSS und Vanilla JS.
  Alles muss durch direktes Öffnen von `index.html` lokal funktionieren.
- **Keine externen Abhängigkeiten** außer der Google-Font Inter via CDN.
  Wenn neue Funktionalität externe Libraries verlangt, **nicht einbauen** —
  vorher mit dem User abklären.
- **Sprache der UI ist Deutsch**, sprechende Begriffe verwenden.
- **Die Begriffe „Jira" und „Confluence" dürfen nicht im Code oder in der UI
  vorkommen.** Stattdessen:
  - Jira-artiger Bereich = **Einsatzboard**
  - Confluence-artiger Bereich = **Aktionsmappe**
  - Gesamtsystem = **72h Aktionszentrale**

## Domänenmodell

- **Bereich** — entweder *Teilnehmende Gruppe* (z. B. `KNTLS` = Messdiener
  Knittelsheim) oder *Internes Themenfeld* (z. B. `ORGA1` = Organisation).
  Jeder Bereich hat einen **5-stelligen Großbuchstaben/Ziffern-Schlüssel**.
- **Vorgang** — gehört genau zu einem Bereich. Schlüsselformat:
  `<BEREICH>-<lfd. Nr.>`, z. B. `KNTLS-2`, `ORGA1-3`, `MATE1-4`.
  Die Nummerierung läuft pro Bereich.
- **Vorgangstypen**: Aufgabe, Materialbedarf, Genehmigung, Rückfrage, Idee.
- **Statuswerte** (in dieser Reihenfolge): Neu, In Prüfung, Geplant, In Arbeit,
  Wartet auf Rückmeldung, Blockiert, Erledigt.
- **Prioritäten**: Kritisch, Hoch, Normal, Niedrig.

Beispielbereiche, die in den Dummy-Daten konsistent verwendet werden:
`KNTLS, BELLH, JUKIR, MINIS, PFADF, JUGSW, KJGZE, CVJMG` (Gruppen) und
`ORGA1, MATE1, PRES1, FINZ1, VERP1, SICH1` (Themenfelder).

## Module / Seiten

| Datei | Zweck |
| --- | --- |
| `index.html` | Dashboard (KPIs, aktuelle Lage, offene Vorgänge, Termine) |
| `einsatzboard.html` | Board mit 7 Statusspalten |
| `vorgaenge.html` | Tabelle aller Vorgänge mit Live-Filter |
| `vorgang-detail.html` | Beispiel-Vorgang (`KNTLS-2`) inkl. Kommentare, Verknüpfungen |
| `bereiche.html` | Bereichsübersicht (Gruppen + Themenfelder) |
| `bereich-detail.html` | Beispiel-Bereich (`KNTLS`) mit Tabs |
| `aktionsmappe.html` | Doku-Übersicht pro Bereich |
| `aktionsmappe-seite.html` | Beispiel-Doku-Seite mit Seitenbaum |
| `lagezentrum.html` | Live-Cockpit für die operative 72h-Phase |
| `administration.html` | Stammdaten (Benutzer, Rollen, Typen, Status, …) |

## Dateistruktur

```
/
├── *.html              (10 Seiten, jeweils vollständig & eigenständig)
├── assets/
│   ├── css/styles.css  (zentrales Designsystem)
│   └── js/app.js       (Mockup-Interaktionen)
├── README.md
└── CLAUDE.md
```

## Designsystem

Alles in `assets/css/styles.css` über CSS-Variablen am Anfang der Datei
(Farben, Spacing, Radius, Schatten, Layout-Maße).

Wiederverwendbare Komponentenklassen — **bei neuen UI-Elementen zuerst
prüfen, ob es bereits eine Klasse gibt, statt neue Styles zu erfinden**:

`.card`, `.kpi`, `.badge` (+`--blue/green/yellow/red/purple`),
`.status` (Ampel-Pill, +Farbvarianten), `.priority` (+`--critical/high/normal/low`),
`.issue-key` (Mono-Badge für Vorgangsschlüssel), `.table` / `.table-wrap`,
`.filter-bar`, `.sidebar`, `.topbar`, `.board-column`, `.issue-card`,
`.area-card`, `.page-layout`, `.meta-panel`, `.doc`, `.doc-tree`,
`.cockpit-card`, `.group-tile`, `.timeline`, `.activity`, `.list-clean`,
`.tabs` / `.tab-panel`, `.admin-nav` / `.admin-panel`, `.linked-list`.

Farbsystem: ruhig, professionell. Status nutzen das Ampelschema
(grün = läuft, gelb = Rückfrage/offen, rot = kritisch).

## Konventionen

- **Vorgangsschlüssel** überall einheitlich als `<a class="issue-key" href="vorgang-detail.html">KNTLS-2</a>`
  darstellen — oder im Fließtext einfach als Klartext `KNTLS-2` schreiben
  und in einen Container mit `data-autolink` packen (siehe JS unten).
- **Bereichsschlüssel** in Karten/Headern: Klasse `.area-card__key` (Mono, primärfarben).
- **Sidebar + Topbar sind in jeder HTML-Seite vollständig dupliziert** —
  bewusste Entscheidung wegen "keine Build-Tools". Änderungen an der
  Navigation müssen in allen 10 Dateien synchron erfolgen
  (am einfachsten per Suchen/Ersetzen über das ganze Repo).
- **Sprechende deutsche Klassen-Tags sind nicht erwünscht** — Klassen
  bleiben englisch (`.card`, `.status`), die *Inhalte* sind deutsch.
- **Detaillinks** gehen von Listen/Boards/Tabellen jeweils auf die eine
  Beispiel-Detailseite (`vorgang-detail.html` bzw. `bereich-detail.html`
  bzw. `aktionsmappe-seite.html`) — es gibt nur je eine Detailseite mit
  Beispieldaten, das ist Absicht.

## JavaScript-Hooks (`assets/js/app.js`)

Verhalten wird über `data-*`-Attribute aktiviert. Reihenfolge ist egal,
alles wird in `DOMContentLoaded` initialisiert.

- **Aktive Navigation** — automatisch anhand `window.location.pathname`.
  Sidebar-Links brauchen nur `href="<datei>.html"`.
- **Tabs** — Container mit `data-tabs` und `data-tabs-target="#panelHost"`,
  Buttons `.tabs__btn` mit `data-tab="key"`, Panels `.tab-panel` mit
  `data-panel="key"`. Beispiel: `bereich-detail.html`.
- **Admin-Panel-Wechsel** — Nav-Items mit `data-admin-target="key"`,
  Panels mit `data-admin-panel="key"`. Beispiel: `administration.html`.
- **Tabellenfilter** — Filter-Form mit `data-filter="#tabellen-id"`, Felder
  bekommen `data-filter-search` / `-bereich` / `-typ` / `-status` / `-prio`,
  Tabellenzeilen `data-bereich="…" data-typ="…" data-status="…" data-prio="…"`,
  durchsuchbare Zellen `data-cell`. Beispiel: `vorgaenge.html`.
- **Autolink für Vorgangsschlüssel** — jeder Container mit `data-autolink`
  bekommt Schlüssel im Text (5 Großbuchstaben/Ziffern + `-` + Zahl)
  automatisch in `.issue-key`-Badges umgewandelt.
- **Klickbare Zeilen/Karten** — Element mit `data-link="ziel.html"`; Klick
  auf Buttons/Links innerhalb wird ignoriert.
- **Kommentar-Mock** — Form mit `data-comment-form`: Button leert Textarea
  und zeigt kurz "Gespeichert ✓".

## Was beim Erweitern beachten

- Bei neuen Seiten: gesamte Sidebar + Topbar aus einer bestehenden Seite
  kopieren, nichts auslagern (keine JS-Includes, kein Templating).
- Neue Dummy-Daten müssen domänenkonsistent sein: existierende Bereiche
  weiterverwenden, neue 5-stellige Schlüssel nur, wenn fachlich sinnvoll.
- Keine echten Personendaten, keine echten E-Mail-Adressen außer den
  bewusst fiktiven `*@kirche-knittelsheim.de`-Beispielen.
- Keine echten Sponsor-/Firmennamen über die bereits etablierten fiktiven
  hinaus (BAUTEC, Gärtnerei Schmitt, Bäckerei Steinmann …).

## Starten

```bash
open index.html          # macOS — reicht für das Mockup
# oder
python3 -m http.server 8080
```

Kein Test-Setup, keine Lints, keine CI.
