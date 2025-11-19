# Advent of Code 2025 - AI Agent Instructions

## Project Overview
TypeScript-based Advent of Code solver with live-reload testing, structured utilities, and formatted logging. Each puzzle is a standalone module that exports `runTasks()` to run both parts.

## Architecture

### Entry Point & Execution Flow
- `src/index.ts` orchestrates puzzle execution: reads `src/puzzles/*.ts` files, extracts day numbers from filenames (`01.js`, `02.js`), and runs via CLI args (`all`, `latest`, or specific day number)
- Puzzles import from `dist/` after TypeScript compilation
- Each puzzle must export `runTasks()` function that calls `runOne()` and `runTwo()`

### Data Loading Pattern
- **CRITICAL**: All puzzles use `getDataForPuzzle(import.meta.url)` to load inputs from `inputs/<day>/` directory
- Returns `{ REAL: string, TEST1: string, TEST2: string }` mapped to `data.txt`, `test-data-01.txt`, `test-data-02.txt`
- Toggle `USE_TEST_DATA` constant at top of each puzzle file (default `true` for new puzzles, `false` for solved)
- Inputs folder is submodule/gitignored - structure: `inputs/01/data.txt`, `inputs/01/test-data-01.txt`, etc.

### Logging & Validation
- Use `logAnswer({ answer, expected, partNum, taskStartedAt })` for all solutions
- `expected` enables automatic validation with ✅/❌ indicators
- Set `expected: undefined` when answer unknown, update with actual after solving
- `taskStartedAt` tracks performance: capture `performance.now()` at start of each part
- See `src/puzzles/01.ts` for complete pattern (lines 34-40, 68-74)

## Development Workflow

### Live Coding Setup
Run two terminals simultaneously:
```bash
pnpm watch          # Terminal 1: watches src/, auto-compiles to dist/
pnpm dev            # Terminal 2: watches dist/ & inputs/, auto-runs latest puzzle
pnpm dev -- 5       # Run specific puzzle (e.g., day 5) in live-reload mode
```

### Commands
- `pnpm start` - clean build + run all puzzles
- `pnpm solve [all|latest|<num>]` - run puzzles (default: latest)
- `pnpm test` - run vitest in watch mode
- `pnpm lint` - ESLint + type-check (parallel)

### Nodemon Configuration
`bin/nodemon/dev.json` watches `dist/` and `inputs/` folders, clears terminal on restart, uses Node's experimental ESM resolution

## Code Patterns

### Puzzle Template (`src/puzzles/TEMPLATE.ts`)
1. Import `getDataForPuzzle` and `logAnswer`
2. Set `USE_TEST_DATA = true` (toggle before final solve)
3. Load data: `const data = getDataForPuzzle(import.meta.url)`
4. Implement `runOne()` and `runTwo()` with `taskStartedAt` timing
5. Use `logAnswer()` with expected values when known
6. Export `runTasks()` that calls both parts
7. Parse lines with `.split('\n').map(line => line.trim()).filter(line => line.length > 0)` pattern

### Utilities (`src/utils/`)
- **Spatial**: `Grid`, `Point`, `Vector` classes for 2D grid problems (see `spatial-utils/`)
  - `Grid` supports BFS/DFS traversal with custom visit callbacks
  - `VECTORS` exports common directions (CARDINAL, DIAGONAL, etc.)
- **Math**: `findGreatestCommonDenominator`, `getLowestCommonMultiple`
- **Algorithms**: `getBinaryCandidate`, `findTransitionPoint` for binary search patterns
- **Formatters**: `NUMBER_FORMATTER.format()` for thousand-separators, `timeSinceStarted()` for performance tracking
- All exported from `src/utils/index.ts` - import directly from there

### Day-Specific Helpers
- Store complex puzzle-specific logic in `src/puzzles/puzzle-helpers/<day>/` (e.g., `09/`)
- Keep main puzzle file focused on solution logic

## Technical Details

### TypeScript Configuration
- Extends `@martindoyle/tsconfig/node`
- Compiles `src/` → `dist/` with ES modules
- Node 24 required

### ESLint Setup
- Custom configuration in `eslint-config/` directory
- Layered approach: canonical → package-json → prettier → import → perfectionist → eslint-overrides → unicorn
- Uses ESLint v9 flat config format
- Import from `eslint-config/index.js` in `eslint.config.js`

### Dependencies
- `chalk` - colored terminal output (used in logging functions)
- `lodash` - utility functions
- `number-to-words` - convert day numbers to ordinal words in logs

## Key Files
- `src/index.ts` - main runner with day discovery/execution logic
- `src/puzzles/TEMPLATE.ts` - copy for new days
- `src/utils/file-utils.ts` - `getDataForPuzzle()` implementation
- `src/utils/logging.ts` - all log functions with chalk formatting
- `src/utils/spatial-utils/grid.ts` - Grid traversal algorithms for 2D problems
