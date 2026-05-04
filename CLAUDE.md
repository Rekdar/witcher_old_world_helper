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

On Windows, `npm run build` fails because it sets `NODE_ENV=production` using Unix syntax. Use `npx webpack --mode production` instead.

> **Note:** The `npm run i18n` script in `package.json` still references removed locales (cs, de, es, fr, it). To sync EN → PL manually, run:
> `npx i18next-locales-sync -p en -s pl -l src/locales --spaces 4`

## Architecture

**Entry point:** `src/index.tsx` → wraps `<App>` in `I18nextProvider`

**Routing:** `src/pages/App.tsx` uses `createHashRouter` (hash-based for GitHub Pages compatibility). The `t` function from `useTranslation()` is called once in `App` and passed as a prop to every page and component — pages do not call `useTranslation` themselves.

**Pages (`src/pages/`):**
- `Home` — card grid driven entirely by `t("home.linkedPages")` array in translation JSON
- `MonsterRoller` — thin wrapper around `MonsterPicker` component. `MonsterPicker` has **two modes** for I/II/III buttons: when no expansion is ticked *or* only Wild Hunt is ticked (`useCardMode = !exp[0] && !exp[2] && !exp[3]`), it draws from `monsters.json` by level and shows full card front images from `src/img/monsters_full_cards/`; otherwise it uses `MonstersDeck` and renders token images. The legendary/Wild Hunt button always uses `MonstersDeck` regardless of mode. Display state is a discriminated union `{ kind: 'card'; card } | { kind: 'token'; token } | null` — do not split into two separate state variables.
- `SetupHelper` — ordered setup instructions; expansions/player count drive `compileSteps()` in `src/classes/setup.tsx`
- `LocationTokens` / `LostMount` — both wrap `TerrainTokenPicker` component; `LostMount` is absent from `home.linkedPages` but accessible via navbar
- `WitcherPicker` — assigns Witcher Schools to players (2–5), draws starting player. Optional Ciri checkbox adds her to the pool. Results show school icons (from `src/img/witcher_schools_back/`) and a per-player dropdown for manual school override. Victory track (`tor.png`) uses absolute positioning with `CIRCLE_TOPS_PCT` (% from top) to align icons to the 5 circles. Full state in `witcherPicker_state` localStorage.
- `Opponents` — Full Wild Hunt expansion page with multiple sections: (1) player count `Form.Select` dropdown + knight selector in the same row (mini figures only, no front card shown after selection); (2) preparation modal button; (3) clickable round-guide HTML table beside a rounds image, both player-count-dependent; (4) Wild Hunt movement draw — edit form supports adding/removing players beyond the `numPlayers` count; (5) hound section — hound card, knight front card, shield counter (`frozen_shield.png` icon), note textarea, hound-rules modal, three-level reward draw (2 options each, no-repeat until reset); (6) knight fight setup (back card, HP default **20**, shield count) → fight view (deck of 4 ability + 16 random main cards, HP tracking, editable shield counter with `frozen_shield.png`, attack draw, peek/add/undo/end, background music). Full state in `wildHunt_opponents_state` localStorage.
- `MonsterFight` — two-phase page: **setup view** (pick monster by level, set HP, select weakness tokens, Monster Trail toggle, Wild Hunt toggle) → **fight view** (draw cards from deck, HP tracking, monster attack draw, deck scouting, undo last draw). Setup has two expansion checkboxes stacked: "Na tropie potworów" (`monsterTrail`) then "Dodatek Dziki Gon" (`wildHunt`), both with `expansionHeaders/` header images. When `wildHunt` is true, a prominent reminder box is shown in the fight view above the end-fight buttons. Full state persisted to `monsterFight_state` in localStorage. Combat music (`src/music/combat_music.mp3`) played via `useRef<HTMLAudioElement>`. Monster-specific UI appears in the fight view based on `selectedMonster.name_pl`. Current examples: **Troll** — "Zdolność specjalna" button (disabled when no discarded cards) opens a modal to pick one card from `revealedCards` and place it on top of `fightDeck` (also increments `fightHp`); **Leszy** — "Liczba kości" `InputGroup` (±1 buttons + free input, min 0, default 0) stored as `leshyDiceCount` in `MonsterFightState`. To add a new monster ability: add any needed fields to `MonsterFightState` + `DEFAULT_STATE`, add a handler, and conditionally render the UI gated on `selectedMonster.name_pl`.
- `DicePoker` — static rules + image (zoomable modal) + background music (`src/music/poker.mp3`). Above the image: a toggle switch "Dodatek Dziki Gon" (with `expansionHeaders/wildHunt.png`) that swaps the poker reference image between `poker.png` and `wild_hunt/poker_wild_hunt.png` (modal enlargement also reflects the toggle). Bottom section has two independent dice-roller panels (white/black) each with: roll 5d6, select dice to reroll, reroll once, reorder dice left/right, hand evaluation (`evaluateHand`). No localStorage. Music toggled via a fixed floating button.
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
- `wildHunt_opponents_state` — full `AppState` for `Opponents` (player count, selected knight, table cell, saved player names, hound shield/note/rewards, knight fight state)
- `monsterFight_state` — full `MonsterFightState` object (setup + fight fields)
- `witcherPicker_state` — combined state for `WitcherPicker`; shape: `{ numPlayers, playerNames: string[], results: PlayerResult[] | null, ciriEnabled, trackPositions: Record<string, number> }`. `playerNames` is read cross-component by `TerrainTokenPicker` and `Opponents` to pre-populate player name inputs.

**Cross-component reads:** Components may read another page's localStorage key to enrich their own UI (e.g. `TerrainTokenPicker` reads `witcherPicker_state.playerNames`). Do this with a standalone `load*` function — never couple the two pages at the React level.

## Save / Load State (global)

`src/util/saveLoad.ts` exports `exportState()` and `importState(file, onDone)`.

- `exportState()` — reads every key listed in `STATE_KEYS`, bundles them into a single JSON object, and downloads it as `witcher-old-world-state.json`.
- `importState(file, onDone)` — parses the JSON file, writes each recognized key back to localStorage, then calls `onDone` (typically `window.location.reload()`).
- `STATE_KEYS` — the canonical list of all localStorage keys included in export/import. **When adding a new page with persistent state, add its key to `STATE_KEYS` in `saveLoad.ts`.**

The save/load buttons live on the `Home` page (`src/pages/Home.tsx`) above the card grid. Translation keys: `home.saveState` / `home.loadState`.

## Wild Hunt data and assets

Knight data: `src/wild_hunt_monster.json` — 4 knights (Caranthir, Eredin, Nithral, Imlerith), each with `name_pl`, `level`, `base_heal`, `front_name`, `back_name`, `abilities[]` (4 card filenames per knight). Shared by `Opponents`.

Asset locations:
- Front/back cards: `src/img/wild_hunt/{front_name}.jpg`, `{back_name}.jpg`
- Ability cards: `src/img/wild_hunt/{name}_ability_{1-4}.jpg` (keyed `ability:{filename}` in the fight deck)
- Hound cards: `src/img/wild_hunt/hound_card_player_{1-5}.jpg`
- Rounds guide images: `src/img/wild_hunt/rounds_player_{1-5}.jpg`
- Reward icons: `src/img/wild_hunt/hound1.png`, `hound2.png`, `hound3.png`
- Preparation image: `src/img/wild_hunt/preparation.jpg`
- Frozen shield icon: `src/img/wild_hunt/frozen_shield.png` — used in place of 🛡️❄️ emoji throughout `Opponents`
- Knight minis: `src/img/monsters/wildHunt/{name_lowercase}Mini.png`
- Fight music: `src/music/wild_hunt/` — 5 tracks (`Eredin, King Of The Hunt.mp3`, `Hail To Caranthir.mp3`, `On Thin Ice.mp3`, `The Hunt Is Coming.mp3`, `Welcome, Imlerith.mp3`)

Knight fight deck: 4 ability cards (`ability:{filename}`) + 16 random cards from the same `monster_trial_01…_20.jpg` pool as `MonsterFight` (`main:{filename}`). `getCardImage(key)` dispatches on the prefix.

## MonsterFight deck mechanics

Monster data is in `src/monsters.json` (28 monsters, levels 1–3, with `base_heal`, `front_name`, `back_name`). This file is shared between `MonsterFight` (HP/deck building) and `MonsterPicker` base mode (draw by level, display full card).

Card images:
- Full card fronts/backs: `src/img/monsters_full_cards/{front_name}.jpg` — filename comes from `front_name`/`back_name` in `monsters.json`. Used by `MonsterPicker` (base mode) and available for `MonsterFight`.
- Main fight cards: `src/img/monster_fight/monster_trial_01.jpg` … `_20.jpg` (keys prefixed `main:`)
- Monster Trail cards: `src/img/monster_fight/monster_trail/monster_trail_1.jpg` … `_4.jpg` (keys prefixed `trail:`)
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
- **Background music (single track, looping):** `new Audio(require(...))` created inside `useEffect([], [])`, stored in `useRef<HTMLAudioElement | null>`. `audio.loop = true`. Cleanup via `audio.pause()` in the effect's return. Toggled with a fixed-position floating button (bottom-right, circular, 48×48px). See `DicePoker` for the canonical pattern.
- **Background music (multi-track, sequential):** Used in `Opponents` knight fight. `useEffect([knightFightStarted])` — when fight starts, a `playNext(exclude?, autoplay?)` closure picks a random track (excluding the just-finished one), creates a new `Audio`, sets `audio.onended = () => playNext(track.title, true)`, and plays only if `autoplay` is true. The initial call passes no `autoplay` so music doesn't start automatically; subsequent `onended` calls pass `autoplay = true`. A `cancelled` flag prevents stale-closure playback after fight ends. Track title displayed in small italic text next to the floating 🎵 button.
- **Symmetric two-panel state:** When a page has two independent panels with identical behavior (e.g. DicePoker's white/black dice), define a single state interface + a `makeHandlers(setState)` factory that returns all handlers for one panel, then call it twice.
- **Undo last draw:** Store drawn cards in a `revealedCards: string[]` array. Undo = pop last from `revealedCards`, prepend to deck, restore HP by +1. Implemented in both `MonsterFight` and `Opponents` knight fight.
- **Peek + delete invariant:** When the peek modal allows card deletion, `handlePeekSave` must sync HP: `const removed = peekOriginalCount - peekCards.length; hp = Math.max(0, hp - removed)`. Without this, deck size and HP diverge. Both `MonsterFight` (`fightHp`) and `Opponents` (`knightFightHp`) use this pattern.
