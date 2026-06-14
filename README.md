# 72h Aktionszentrale – Mockup

Statisches HTML/CSS/JS-Mockup eines internen Organisationstools für die regionale
72h Aktion. Verwendet vom Koordinierungskreis zur Verwaltung von teilnehmenden
Gruppen, organisatorischen Themenfeldern, Vorgängen und Aktionsdokumentation.

> Dies ist nur ein Mockup. Es gibt keine Backend-Anbindung und keine Persistenz —
> alle Daten sind statische Dummy-Inhalte.

## Mockup starten

Es werden **keine** Build-Tools oder Abhängigkeiten benötigt. Einfach
`index.html` im Browser öffnen:

```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

Alternativ ein kleiner lokaler Webserver, z. B.:

```bash
python3 -m http.server 8080
# dann http://localhost:8080 öffnen
```

## Module / Seiten

| Datei                       | Beschreibung                                                      |
| --------------------------- | ----------------------------------------------------------------- |
| `index.html`                | **Dashboard** – Übersicht, KPIs, aktuelle Lage, Termine           |
| `einsatzboard.html`         | **Einsatzboard** – Kanban-artige Vorgangsansicht (7 Spalten)      |
| `vorgaenge.html`            | **Vorgänge** – Tabellenansicht mit Filtern                        |
| `vorgang-detail.html`       | **Vorgang-Detail** – Beispiel `KNTLS-2` mit Metadaten-Sidebar     |
| `bereiche.html`             | **Bereiche** – Gruppen + interne Themenfelder als Karten          |
| `bereich-detail.html`       | **Bereich-Detail** – Beispiel `KNTLS` mit Tabs (Übersicht etc.)   |
| `aktionsmappe.html`         | **Aktionsmappe** – Doku-Übersicht pro Bereich                     |
| `aktionsmappe-seite.html`   | **Doku-Seite** – Beispielseite mit Seitenbaum + Vorgangsbadges    |
| `lagezentrum.html`          | **Lagezentrum** – Cockpit-Ansicht für die 72h-Phase (Ampelstatus) |
| `administration.html`       | **Administration** – Benutzer, Rollen, Vorgangstypen, Status …   |

## Dateistruktur

```text
/
├── index.html
├── einsatzboard.html
├── vorgaenge.html
├── vorgang-detail.html
├── bereiche.html
├── bereich-detail.html
├── aktionsmappe.html
├── aktionsmappe-seite.html
├── lagezentrum.html
├── administration.html
├── README.md
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        └── app.js
```

## Begriffsmodell

- **Bereich** – entweder eine *teilnehmende Gruppe* (z. B. KNTLS = Messdiener
  Knittelsheim) oder ein *internes Themenfeld* (z. B. ORGA1 = Organisation).
  Jeder Bereich hat einen 5-stelligen Schlüssel.
- **Vorgang** – Aufgabe, Materialbedarf, Genehmigung, Rückfrage oder Idee.
  Schlüsselformat: `<Bereich>-<lfd. Nr.>`, z. B. `KNTLS-2`, `MATE1-4`.
- **Einsatzboard** – Boardansicht der Vorgänge (Spalten nach Status).
- **Aktionsmappe** – Doku-Bereich pro Bereich (Konzepte, Stammdaten, Notizen,
  Abschlussdoku).
- **Lagezentrum** – operative Ansicht während der eigentlichen 72h-Phase.

## Interaktion im Mockup

- Sidebar markiert die aktive Seite automatisch (`assets/js/app.js`).
- Filter auf `vorgaenge.html` filtern die Tabelle live.
- Tabs auf `bereich-detail.html` schalten zwischen Übersicht / Vorgänge /
  Aktionsmappe / Check-ins / Material.
- Admin-Navigation auf `administration.html` schaltet die Panels um.
- Vorgangsschlüssel im Fließtext (z. B. `KNTLS-2`) werden automatisch als
  klickbare Badges dargestellt (siehe `data-autolink`).
- Tabellenzeilen und Karten mit `data-link` öffnen die jeweilige Detailseite.

## Designsystem

Zentrale Variablen in `assets/css/styles.css` (Farben, Spacing, Radius,
Schatten). Wiederverwendbare Komponenten:
`.card`, `.badge`, `.status`, `.priority`, `.table`, `.sidebar`, `.topbar`,
`.board-column`, `.issue-card`, `.page-layout`, `.meta-panel`, `.area-card`,
`.cockpit-card`, `.doc`, `.doc-tree`, `.kpi`.

Einzige externe Abhängigkeit: Google-Font *Inter* via CDN (rein optisch,
funktioniert ohne).
