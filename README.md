# Mobile-optimiertes Voting (nur Name, 1 Stimme pro Gerät)

- Mobile-first Layout, große Touch-Ziele (≥48px), keine iOS-Zoomsprünge (16px Base), Vollbreite-Button.
- Speichert nur Name + Auswahl (+ Gerät-ID, Zeitstempel, UserAgent/Zeitzone/Sprache).

## Setup (wie gehabt)
1) Dateien ins Repo `happy_hippo_Dance_platzhirsch` (Root) kopieren.
2) GitHub Pages aktivieren (Branch `main`, Folder `/`).
3) Google Sheet: `votes`-Tab, Sheet-ID in `backend/Code.gs` eintragen.
4) Apps Script deployen (Web App, anyone with the link). URL in `assets/app.js` bei `BACKEND_URL` setzen.
5) Commit & Push, testen.

## Hinweise
- Ein Vote pro Gerät (LocalStorage + Serverprüfung). Anderes Gerät/anderer Browser = neue Stimme möglich.
