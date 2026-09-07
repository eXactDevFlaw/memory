# Memory

Ein browserbasiertes Memory-Kartenspiel für zwei Spieler (Blau vs. Orange) mit vier auswählbaren visuellen Themes, geschrieben in TypeScript ohne Framework.

## Features

- Zwei-Spieler-Modus (Blau/Orange) mit Live-Punktestand
- Vier Themes: Code Vibes, Gaming, DA Projects, Foods — jedes mit eigenem Farbschema, Font und Kartenset
- Drei Spielfeldgrößen: 16, 24 oder 36 Karten
- Einstellungsseite mit Live-Vorschau beim Hover über ein Theme
- Exit-Bestätigung während des Spiels sowie eine Gameover-Ansicht

## Tech-Stack

- [Vite](https://vitejs.dev/) als Build-Tool und Dev-Server
- TypeScript (kein Framework, DOM-Rendering per String-Templates)
- SCSS für Styling

## Setup

Voraussetzung: Node.js.

```bash
npm install
```

## Verfügbare Scripts

| Befehl            | Beschreibung                                      |
| ------------------ | -------------------------------------------------- |
| `npm run dev`      | Startet den lokalen Dev-Server mit Hot Reload       |
| `npm run build`    | Typprüfung (`tsc -noEmit`) und Production-Build     |
| `npm run preview`  | Startet einen lokalen Server für den Production-Build |

## Projektstruktur

```
src/
  data/themes.ts       Theme-Konfigurationen (Farben, Fonts, Icons, Assets)
  pages/                Rendering & Event-Bindings pro Screen (home, settings, game, gameover)
  state/game-state.ts   Zentraler In-Memory-Anwendungszustand
  types/index.ts        Geteilte TypeScript-Typen
  styles/               SCSS-Partials pro Screen
  main.ts               Einstiegspunkt, Screen-Routing/Rendering
public/
  icons/<theme>/        Kartenmotive & Buttons pro Theme
  ui/                    Theme-unabhängige UI-Assets (Icons, Vorschaubilder)
  fonts/                 Lokal eingebundene Schriftarten
```

## Spielablauf

1. **Home** – Startbildschirm
2. **Settings** – Theme, Startspieler und Spielfeldgröße wählen; der Start-Button wird erst aktiv, wenn alle drei Optionen gesetzt sind
3. **Game** – Spielfeld mit Punktestand, aktuellem Spieler und Exit-Bestätigung
4. **Gameover** – Abschlussbildschirm mit Endstand
