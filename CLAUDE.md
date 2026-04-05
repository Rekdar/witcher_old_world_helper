# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React/TypeScript web app that assists players of the board game *The Witcher: Old World*. It automates randomized game setup steps (monster placement, terrain tokens, lost mount, etc.) and provides an inventory checklist by expansion. Deployed to GitHub Pages via `gh-pages`.

## Commands

```bash
npm install          # Install dependencies
npm start            # Dev server on port 3000 (after tsc compiles)
npm run dev          # TypeScript watch + auto-restart dev server
npm run build        # Production webpack build → dist/
npm run lint         # ESLint on all .ts/.tsx files
npm run deploy       # Build + push dist/ to gh-pages branch
npm run i18n         # Sync translation keys from EN to all other locales
npm run clean        # Remove dist/
npx tsc --noEmit    # Type-check without building (fast validation)
```

No test suite is configured (`npm test` exits with error).

## Architecture

**Entry point:** `src/index.tsx` → wraps `<App>` in `I18nextProvider`

**Routing:** `src/pages/App.tsx` uses `createHashRouter` (hash-based for GitHub Pages compatibility). The `t` function from `useTranslation()` is called once in `App` and passed as a prop to every page and component — pages do not call `useTranslation` themselves.

**Pages (`src/pages/`):**
- `Home` — card grid driven entirely by `t("home.linkedPages")` array in translation JSON
- `MonsterRoller` — thin wrapper around `MonsterPicker` component
- `SetupHelper` — ordered setup instructions; expansions/player count drive `compileSteps()` in `src/classes/setup.tsx`
- `LocationTokens` / `LostMount` — both wrap `TerrainTokenPicker` component
- `WitcherPicker` — assigns Witcher Schools to players (2–5), draws starting player
- `Opponents` — Monster Attack (bite/charge random draw) + Wild Hunt Movement (player draw with localStorage persistence)
- `InventoryChecker` — static card inventory reference
- `CommunityLinks` — external link list

**Domain classes (`src/classes/`):**
- `dataClasses.ts` — `Deck<T>` abstraction on `QueueCollection<T>`. `ReadonlyDeck` auto-shuffles and repopulates when exhausted; `MutableDeck` is for variable player hands.
- `monsters.tsx` — `MonstersDeck` wraps four `ReadonlyDeck` instances (levels 1–3 + legendary). Monster classes extend `monsterClass` which renders token/mini images. Expansion booleans passed to constructor control which monsters are included.
- `terrains.tsx` — `TerrainLocation` type, named location constants, and `TerrainTokenDeck` class with separate Mountain/Forest/Water `ReadonlyDeck` instances. Skellige expansion adds extra tokens to each deck. `getTokenImgSrc(imgStr)` resolves webpack image paths.
- `setup.tsx` — `compileSteps()` builds ordered JSX setup instructions per expansion/player count.
- `inventory.tsx` — static inventory data for `InventoryChecker`.

**Key component: `TerrainTokenPicker`** (`src/components/TerrainTokenPicker.tsx`) — shared by `LocationTokens` and `LostMount`. Maintains a task list (persisted in localStorage key `locationTokens_tasks`) that tracks which token was assigned to which player with a note. Tasks survive page refresh.

**i18n:** 7 locales (cs, de, en, es, fr, it, pl) in `src/locales/[lang]/translation.json`. Always edit `en` first, then run `npm run i18n` to propagate new keys to other locales. Home page tiles are driven by the `home.linkedPages` array in each locale file — adding a tile requires editing all 7 files. Navbar dropdown links also require a `navbar.*` key in all 7 files.

**Utilities (`src/util/`):** `generic.ts` exports `shuffle<T>()` (Fisher-Yates) used by all randomization pages.

**Build:** Webpack 5 with `ts-loader`. Images must be loaded via `require('../img/...')` — no static imports.

## localStorage Patterns

Two features persist state across sessions:
- `locationTokens_tasks` (array of `TaskEntry`) — terrain token task list in `TerrainTokenPicker`
- `opponents_wildHunt_players` (array of strings) — player names in `Opponents`

Pattern: module-level `loadX()` / `saveX()` functions with try/catch, passed as lazy initializer to `useState`: `useState<T>(loadX)` (function reference, not call).

## Adding a New Page

1. Create `src/pages/MyPage.tsx` — accept `{ t }` prop, use `<PageTitle>` and Bootstrap grid
2. Add route in `src/pages/App.tsx` — import + entry in `createHashRouter` array before the `"*"` catch-all
3. Add navbar item in `src/components/Navbar.tsx` — `<NavDropdown.Item href="#/myPage">` before `<NavDropdown.Divider />`
4. Add `navbar.myPage` key and a `home.linkedPages` tile object to all 7 locale files
5. Add page-specific translation keys to `en/translation.json`, run `npm run i18n`

## Adding New Expansions

1. Add monster data in `src/classes/monsters.tsx` — create instances of the appropriate level class and add an expansion flag to `MonstersDeck` constructor.
2. Add terrain tokens in `src/classes/terrains.tsx` — new `XToken` instances in the `*TokensSkellige`-style arrays, add images to `src/img/tokens/reducedTerrainTokens/`.
3. Add setup steps in `src/locales/en/translation.json`, then run `npm run i18n`.
4. Add expansion checkbox to `SetupHelper` and thread the boolean through `compileSteps()` in `src/classes/setup.tsx`.

## UI Patterns

- **Result animations:** Use a counter state + `key={counter}` on the result element + CSS `@keyframes` in a component-specific CSS file (e.g., `src/css/Opponents.css`). Incrementing the key forces React to remount, replaying the animation even when the value is the same.
- **Button variants:** `secondary` (primary action), `outline-secondary` (secondary action), `success`/`primary`/`warning`/`danger` for domain-specific color coding.
- **Page layout:** `<Container id="PageName">` → `<PageTitle>` → `<Row className="justify-content-center">` → `<Col xs={12} md={8} lg={6}>`.
