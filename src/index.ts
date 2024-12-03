import fs from 'node:fs/promises';
import path from 'node:path';

import { logComplete, logError, logPuzzleDay, logStart, logTime } from './utils/index.js';

const HERE = path.dirname(import.meta.url).slice('file:'.length);
const DAY_REGEX = /(\d{2})\.js$/u;

const sortStringsNumerically = (a: string, b: string) => {
  const aNumber = Number.parseInt(a, 10);
  const bNumber = Number.parseInt(b, 10);
  return aNumber - bNumber;
};

const run = async () => {
  const [runAllArgument] = process.argv.slice(2);
  const runAll = runAllArgument === '--runAll';

  // Get all of the puzzle days
  const puzzlesPath = path.join(HERE, 'puzzles');
  const puzzleDirContents = (await fs.readdir(puzzlesPath)).sort(sortStringsNumerically);

  // Get the paths to the puzzles
  const allPuzzlePaths = [];
  for (const nextItem of puzzleDirContents) {
    if (!DAY_REGEX.test(nextItem)) {
      continue;
    }

    const nextDayPath = path.join(puzzlesPath, nextItem);
    allPuzzlePaths.push(nextDayPath);
  }

  // Run through puzzles
  logStart();
  const beforeAll = performance.now();
  const startIndex = runAll ? 0 : allPuzzlePaths.length - 1;
  const endIndex = allPuzzlePaths.length;
  for (let index = startIndex; index < endIndex; index++) {
    const nextPuzzlePath = allPuzzlePaths[index]!;
    const [, day] = DAY_REGEX.exec(nextPuzzlePath) ?? [];
    if (!day) {
      logError(`Could not determine day from path "${nextPuzzlePath}"`);
      continue;
    }

    const { runTasks } = await import(nextPuzzlePath);
    logPuzzleDay(day, index === startIndex);
    const before = performance.now();
    await runTasks();
    logTime(before, day);
  }

  // Finish up with nice message
  logComplete(beforeAll);
};

run().catch((error) => {
  logError('Error running program', error);
});
