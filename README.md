# Advent of Code 2024

This repo is to store my [Advent of Code](https://adventofcode.com/) submissions for 2024. It is optimised to run TypeScript code, and has been setup to provide a live-reloading tester against expected results for each day.

## Setup

You will need [pnpm](https://pnpm.io/) to run this properly. Just use `npm i -g pnpm` to get setup with it. Then simply go to the project folder and run `pnpm i` to install the dependencies.

> [!IMPORTANT]
> You **MUST** setup your own `inputs` folder in the root directory. In this repository it's been setup as a submodule to a private repository (Advent of Code do not want people sharing inputs), which you could do as well, but instead of a submodule you may prefer just a local folder and to update the `.gitignore` file to exclude it being committed.
>
> In the `inputs` folder, there should be a folder for each day and also a `TEMPLATE` folder to clone every day.
>
> Here's an example subfolder structure:
> ```
> <rootDir>
>  └─ inputs
>    └─ 01
>      ├─ data.txt
>      ├─ test-data-01.txt
>      └─ test-data-02.txt
> ```

## Running

To run the whole project, just run `pnpm start`, which will do a clean build and then run all of the days' tasks.

Alternatively, once the project has been built (or is being watched and built via `pnpm watch`), then you can run `pnpm solve all` to run all of the puzzles; `pnpm solve latest` to run the latest puzzle; or `pnpm solve <number>` to solve a specific puzzle, e.g. `pnpm solve 10` will run the 10th day's puzzle.

> [!NOTE]
> The default if you just run `pnpm solve` is to run the latest puzzle.

## Developing

When developing, you should run two tasks; one to watch the `src/` folder and to rebuild it when required, and a second to run the puzzles when the contents of the `dist/` folder changes.

```bash
# Watch the src/ folder and automatically rebuild
pnpm watch
```

```bash
# Watch the dist/ folder and automatically re-run the latest puzzle
pnpm dev
```

If you want to live-run a specific puzzle then you can run `pnpm dev -- <number>`, e.g. to live-run puzzle #3 you would run `pnpm dev -- 3`.

> [!TIP]
> I run the first "watch" task in _iTerm_ and then run the main "dev" task in a terminal within VSCode, so I can see the live results as I type.
