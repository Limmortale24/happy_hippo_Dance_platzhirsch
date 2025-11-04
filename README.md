# Platzhirsch – Event‑Voting (GitHub Pages + Google Sheets)

Fertige, statische Event‑Seite mit Abstimmung (eine Rückmeldung pro Person) – Datenspeicherung in Google Sheets.

## 1) Repository vorbereiten
Kopiere alle Dateien in dein Repo `happy_hippo_Dance_platzhirsch` und commite.

## 2) GitHub Pages aktivieren
Settings → **Pages** → Build from **main / root** → speichern.
Seite dann unter: `https://limmortale24.github.io/happy_hippo_Dance_platzhirsch/`

## 3) Google Sheet anlegen
- Neues Google Sheet erstellen → Tabellenblatt `votes`
- **Sheet ID** aus der URL kopieren und in `backend/Code.gs` bei `SHEET_ID` eintragen

## 4) Apps Script Backend deployen
- https://script.google.com → Neues Projekt → `backend/Code.gs` einfügen
- `SHEET_ID` eintragen
- Deploy → **Web app**
  - **Execute as:** Me
  - **Who has access:** Anyone with the link
  - URL kopieren

## 5) Frontend verbinden
- In `assets/app.js` die Web‑App‑URL bei `BACKEND_URL` eintragen
- Commit & Push

## 6) Test
- Seite öffnen → Formular ausfüllen → Auswahl treffen → absenden
- Im Google Sheet erscheint eine neue Zeile
- Doppelte Abgabe mit gleicher E‑Mail/Telefon führt zu HTTP 409 (Fehlermeldung im Frontend)

## 7) Hinweise
- DSGVO‑Text im `index.html` anpassen (Verantwortliche Stelle, Löschfristen)
- Für mehrere Events: eigenen `STORAGE_KEY` setzen und ggf. Ordner pro Event anlegen
