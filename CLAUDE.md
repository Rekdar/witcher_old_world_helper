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
```

No test suite is configured (`npm test` exits with error).

## Architecture

**Entry point:** `src/index.tsx` → wraps `<App>` in `I18nextProvider`

**Routing:** `src/pages/App.tsx` uses `createHashRouter` (hash-based for GitHub Pages compatibility). Routes map to page components in `src/pages/`.

**Pages:**
- `Home` — landing page with links to tools
- `MonsterRoller` — draws random monsters by level using `MonstersDeck`
- `SetupHelper` — generates ordered game setup steps based on selected expansions/player count
- `LostMount` — randomizes lost mount location
- `LocationTokens` / `TerrainTokenPicker` — terrain token randomization
- `InventoryChecker` — expansion inventory reference with card images
- `CommunityLinks` — external resource links

**Domain classes (`src/classes/`):**
- `dataClasses.ts` — generic `Deck<T>` abstraction built on `QueueCollection<T>`. `ReadonlyDeck` for fixed-pool decks (monsters, terrain); `MutableDeck` for variable decks (player hands).
- `monsters.tsx` — `MonstersDeck` class wraps four `ReadonlyDeck` instances (levels 1–3 + legendary). Monster classes (`levelOneMonster`, etc.) extend `monsterClass` which renders token/mini images. Expansion flags passed to constructor determine which monsters are included.
- `terrains.tsx` — `TerrainLocation` type with named location constants and terrain token deck logic.
- `setup.tsx` — `compileSteps()` builds an ordered JSX array of setup instructions based on active expansions and player count; `playerSetup()` constructs i18n keys for player setup steps.
- `inventory.tsx` — inventory data for the `InventoryChecker` page.

**i18n:** `src/i18n/index.ts` initializes i18next with 7 locales (cs, de, en, es, fr, it, pl), browser language detection, and localStorage caching (7-day TTL). Translation files are in `src/locales/[lang]/translation.json`. The `t` function is passed as a prop from `App` down to pages and components.

**Utilities (`src/util/`):** `generic.ts` (shuffle helper), `listify.ts`, `Display.tsx`, `useResize.ts`.

**Build:** Webpack 5 with `ts-loader`, `MiniCssExtractPlugin`, `HtmlWebpackPlugin`, and `ImageMinimizerWebpackPlugin` (sharp). Images are required inline via webpack (`require('../img/...')`).

## Adding New Expansions

1. Add monster data in `src/classes/monsters.tsx` — create instances of the appropriate level class and add an expansion flag to `MonstersDeck` constructor.
2. Add setup steps in `src/locales/en/translation.json` under the relevant key, then run `npm run i18n` to propagate the key to other locales.
3. Add expansion checkbox to `SetupHelper` page and thread the boolean through `compileSteps()` in `src/classes/setup.tsx`.
4. Add any new terrain images to `src/img/` and reference them via `require()`.
