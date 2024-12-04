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

To run the whole project, just run `pnpm start`, which will run all of the days' tasks.

## Developing

In development mode, only the most recent day found will run. You will need two terminal windows/tabs/panes to run this.

In the first window, start the compilation tasks by running `pnpm watch` and then in the second run the actual puzzles with `pnpm dev`. This gives a live-reloading terminal view of the answers.

> **TIP:** I run the first "watch" task in _iTerm_ and then run the main "dev" task in a terminal within VSCode, so I can see the live results as I type.

