# GUESS THE NUMBER
A complete browser game in vanilla HTML/CSS/JS (ES modules). No backend, accounts or paid APIs.

## Features
5 difficulty levels with unlockable progression + Quick Play · 3 modes (Classic, Time Attack, Endless) · 4 limited hints · scoring with streak bonuses · statistics · 7 achievements · daily hint reward · Web Audio sound effects (no audio files) · confetti, circular timer, pause/restart · keyboard & screen-reader friendly · reduced-motion support · responsive layout.

## Structure
```
guess-the-number/
├── index.html
├── README.md
├── assets/icons/
├── css/  style.css · animations.css · responsive.css
└── js/   app.js (wiring) · game.js (rules/state) · levels.js (config) · timer.js · hints.js
          scoring.js · storage.js · achievements.js · audio.js · ui.js (DOM)
```

## Run it
ES modules are blocked on `file://`, so serve the folder locally:
```
cd guess-the-number
python3 -m http.server 8000     # then open http://localhost:8000
# or: npx serve .
```

## Rules & controls
Type a whole number and press **Enter** (or click Guess). The timer starts on your first valid guess. Empty, non-integer, out-of-range or repeated guesses never cost an attempt. Each round has 1 free hint; bonus hints come from the daily reward (+1) and every achievement (+1). Hints cost 40 points each and never reveal the number.
Score = difficulty×100 + 25 per unused attempt + 5 per second left + 20 per streak win (max 10) − 40 per hint (never below 0).
Time Attack: 60s shared clock, +10s per correct guess; running out of guesses skips to a new number. Endless: ranges grow each round; failing ends the run.

## Customize
Edit `js/levels.js`: add an object to `LEVELS` (`id, name, max, guesses, time, pts`) and it appears in the menu automatically. `ATTACK` sets Time Attack start/bonus seconds; `endlessLevel()` controls Endless scaling.

## Saved data
Everything lives in LocalStorage under the key `guess-the-number-v1` (unlocked levels, stats, achievements, bonus hints, mute setting). *Settings → Reset all progress* clears it after confirmation.

## Troubleshooting
Blank page / console module error → you opened `index.html` directly; use a local server. No sound → click the page first (browsers require interaction) and check the mute setting. Progress not saving → private browsing or blocked storage; the game still works for the session.
