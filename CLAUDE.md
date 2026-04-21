# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React/TypeScript web app that assists players of the board game *The Witcher: Old World*. It automates randomized game setup steps (monster placement, terrain tokens, lost mount, etc.) and provides in-game tools for monster fights. Deployed to GitHub Pages via `gh-pages`.

## Commands

```bash
npm install          # Install dependencies
npm start            # Dev server on port 3000 (webpack serves + compiles via ts-loader)
npm run dev          # tsc-watch → restarts webpack serve on TypeScript changes
npm run build        # Production webpack build → dist/
npm run lint         # ESLint on all .ts/.tsx files
npm run deploy       # Build + push dist/ to gh-pages branch
npm run clean        # Remove dist/
npx tsc --noEmit    # Type-check without building (fast validation)
```

No test suite is configured (`npm test` exits with error).

> **Note:** The `npm run i18n` script in `package.json` still references removed locales (cs, de, es, fr, it). To sync EN → PL manually, run:
> `npx i18next-locales-sync -p en -s pl -l src/locales --spaces 4`

## Architecture

**Entry point:** `src/index.tsx` → wraps `<App>` in `I18nextProvider`

**Routing:** `src/pages/App.tsx` uses `createHashRouter` (hash-based for GitHub Pages compatibility). The `t` function from `useTranslation()` is called once in `App` and passed as a prop to every page and component — pages do not call `useTranslation` themselves.

**Pages (`src/pages/`):**
- `Home` — card grid driven entirely by `t("home.linkedPages")` array in translation JSON
- `MonsterRoller` — thin wrapper around `MonsterPicker` component
- `SetupHelper` — ordered setup instructions; expansions/player count drive `compileSteps()` in `src/classes/setup.tsx`
- `LocationTokens` / `LostMount` — both wrap `TerrainTokenPicker` component; `LostMount` is absent from `home.linkedPages` but accessible via navbar
- `WitcherPicker` — assigns Witcher Schools to players (2–5), draws starting player. Optional Ciri checkbox adds her to the pool. Results show school icons (from `src/img/witcher_schools_back/`) and a per-player dropdown for manual school override. Victory track (`tor.png`) uses absolute positioning with `CIRCLE_TOPS_PCT` (% from top) to align icons to the 5 circles. Full state in `witcherPicker_state` localStorage.
- `Opponents` — Wild Hunt Movement: player draw (including a "player chooses" option) with localStorage persistence. Player names stored in `opponents_wildHunt_players`.
- `MonsterFight` — two-phase page: **setup view** (pick monster by level, set HP, select weakness tokens, Monster Trail expansion toggle) → **fight view** (draw cards from deck, HP tracking, monster attack draw, deck scouting). Full state persisted to `monsterFight_state` in localStorage. Combat music (`src/music/combat_music.mp3`) played via `useRef<HTMLAudioElement>`.
- `DicePoker` — static rules + image (zoomable modal) + background music (`src/music/poker.mp3`). Bottom section has two independent dice-roller panels (white/black) each with: roll 5d6, select dice to reroll, reroll once, reorder dice left/right, hand evaluation (`evaluateHand`). No localStorage. Music toggled via a fixed floating button.
- `CommunityLinks` — card grid of external links, data-driven from `t("communityLinks.links")`. **Not in the router** — accessible only if linked directly.

**Domain classes (`src/classes/`):**
- `dataClasses.ts` — `Deck<T>` abstraction on `QueueCollection<T>`. `ReadonlyDeck` enforces immutable `allItems`; `MutableDeck` allows adding items (e.g. player hands). Auto-repopulate-on-exhaustion is implemented in the consuming class (e.g. `MonstersDeck.draw()` calls `repopulate()` when the sub-deck is empty).
- `monsters.tsx` — `MonstersDeck` wraps four `ReadonlyDeck` instances (levels 1–3 + legendary). Monster classes extend `monsterClass` which renders token/mini images. Expansion booleans passed to constructor control which monsters are included.
- `terrains.tsx` — `TerrainLocation` type, named location constants, and `TerrainTokenDeck` class with separate Mountain/Forest/Water `ReadonlyDeck` instances. Skellige expansion adds extra tokens to each deck. `getTokenImgSrc(imgStr)` resolves webpack image paths. Both base and Skellige token arrays (`MountainTokens`, `ForestTokens`, `WaterTokens`, `MountainTokensSkellige`, `ForestTokensSkellige`, `WaterTokensSkellige`) are exported — import them directly when you need the full list outside a deck (e.g. to populate a dropdown), since `Deck.allItems` is `protected` and inaccessible from components.
- `setup.tsx` — `compileSteps()` builds ordered JSX setup instructions per expansion/player count.

**Key component: `TerrainTokenPicker`** (`src/components/TerrainTokenPicker.tsx`) — shared by `LocationTokens` and `LostMount`. Maintains a task list (persisted in localStorage key `locationTokens_tasks`) that tracks which token was assigned to which player with a note. Tasks survive page refresh. Two ways to add a task: (1) draw a token then click "Add Action", (2) "Add action manually" button (always visible) — opens a form with a token dropdown grouped by terrain type. If `witcherPicker_state` contains non-empty player names, the player name field becomes a dropdown populated from that state instead of a free-text input. Table token thumbnails support click-to-zoom via the shared `enlargedImage`/Modal pattern.

**i18n:** 2 locales (en, pl) in `src/locales/[lang]/translation.json`. Always edit `en` first, then sync to `pl`. Home page tiles are driven by the `home.linkedPages` array in each locale file. Navbar dropdown links require a `navbar.*` key in both locale files.

**Utilities (`src/util/`):** `generic.ts` exports `shuffle<T>()` (Fisher-Yates, mutates and returns the array) used by all randomization pages.

**Build:** Webpack 5 with `ts-loader`. Images and audio must be loaded via `require('../img/...')` / `require('../music/...')` — no static imports. Both `jpg/png` and `mp3` are configured as `asset/resource` in `webpack.config.js`.

## localStorage Patterns

Pattern: module-level `loadX()` / `saveX()` functions with try/catch, passed as lazy initializer to `useState`: `useState<T>(loadX)` (function reference, not call).

When a page has several interdependent state fields, store them as one JSON object and use a single combined-state hook: `useState<MyState>(loadState)`, updating via `setAppState(prev => ({ ...prev, field: value }))`. This avoids calling `loadState()` once per field. See `WitcherPicker` for an example.

Current keys:
- `locationTokens_tasks` — terrain token task list in `TerrainTokenPicker`
- `opponents_wildHunt_players` — player names in `Opponents`
- `monsterFight_state` — full `MonsterFightState` object (setup + fight fields)
- `witcherPicker_state` — combined state for `WitcherPicker`; shape: `{ numPlayers, playerNames: string[], results: PlayerResult[] | null, ciriEnabled, trackPositions: Record<string, number> }`. `playerNames` is read cross-component by `TerrainTokenPicker` to pre-populate player name dropdowns.

**Cross-component reads:** Components may read another page's localStorage key to enrich their own UI (e.g. `TerrainTokenPicker` reads `witcherPicker_state.playerNames`). Do this with a standalone `load*` function — never couple the two pages at the React level.

## MonsterFight deck mechanics

Monster data is in `src/monsters.json` (6 monsters, levels 1–3, with `base_heal`, `front_name`, `back_name`).

Card images:
- Main cards: `src/img/monster_fight/monster_trial_01.jpg` … `_20.jpg` (keys prefixed `main:`)
- Monster Trail cards: `src/img/monster_fight/monster_trial/monster_trial_1.jpg` … `_4.jpg` (keys prefixed `trail:`)
- Deck back: `src/img/monster_fight/back.jpg`

`buildDeck(level, monsterTrail, hp)` — without MonsterTrail: shuffle 20 main cards, take `hp` many; with MonsterTrail: pool = 4 trail cards + 12 (lvl 1/2) or 16 (lvl 3) random main cards, shuffle, take `hp` many. Deck stored as `string[]` of prefixed keys.

Weakness tokens: `src/img/tokens/weaknessTokens/Weakness_{Forest|Mountain|Water}_{1-6}.jpg` (18 selectable, max 6).

All images pre-loaded at module level using `Object.fromEntries` + `require()` template literals so webpack can statically bundle them.

## Adding a New Page

1. Create `src/pages/MyPage.tsx` — accept `{ t }` prop, use `<PageTitle>` and Bootstrap grid
2. Add route in `src/pages/App.tsx` — import + entry in `createHashRouter` array before the `"*"` catch-all
3. Add navbar item in `src/components/Navbar.tsx` — `<NavDropdown.Item href="#/myPage">` before `<NavDropdown.Divider />`
4. Add `navbar.myPage` key and a `home.linkedPages` tile object to both locale files (`en` and `pl`)
5. Add page-specific translation keys to `en/translation.json`, sync to `pl`

## Adding New Expansions

1. Add monster data in `src/classes/monsters.tsx` — create instances of the appropriate level class and add an expansion flag to `MonstersDeck` constructor.
2. Add terrain tokens in `src/classes/terrains.tsx` — new `XToken` instances in the `*TokensSkellige`-style arrays, add images to `src/img/tokens/reducedTerrainTokens/`.
3. Add setup steps in `src/locales/en/translation.json`, sync to `pl`.
4. Add expansion checkbox to `SetupHelper` and thread the boolean through `compileSteps()` in `src/classes/setup.tsx`.

## UI Patterns

- **Result animations:** Counter state + `key={counter}` on the result element + CSS `@keyframes` in a component-specific CSS file (e.g., `src/css/Opponents.css`). `MonsterFight` imports `Opponents.css` to reuse the `result-pop` animation class.
- **Button variants:** `secondary` (primary action), `outline-secondary` (secondary action), `success`/`primary`/`warning`/`danger` for domain-specific color coding.
- **Page layout:** `<Container id="PageName">` → `<PageTitle>` → `<Row className="justify-content-center">` → `<Col xs={12} md={8} lg={6}>`.
- **Image zoom:** Shared `enlargedImage` state + `<Modal size="lg">` pattern — set `cursor: zoom-in` on the thumbnail, `onClick={() => setEnlargedImage(src)}`, modal closes on click.
- **Background music:** `new Audio(require(...))` created inside `useEffect`, stored in `useRef<HTMLAudioElement | null>`. Cleanup via `audio.pause()` in the effect's return. Toggled with a fixed-position floating button (bottom-right, circular, 48×48px). See `DicePoker` for the canonical pattern.
- **Symmetric two-panel state:** When a page has two independent panels with identical behavior (e.g. DicePoker's white/black dice), define a single state interface + a `makeHandlers(setState)` factory that returns all handlers for one panel, then call it twice.
