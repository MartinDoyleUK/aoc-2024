/* eslint-disable @typescript-eslint/no-non-null-assertion */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { logAnswer } from '../../utils/index.js';

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const THIS_FILENAME = url.fileURLToPath(import.meta.url);
const THIS_DIRNAME = path.dirname(THIS_FILENAME);
const PATHS = {
  DATA: path.join(THIS_DIRNAME, 'data.txt'),
  TEST_DATA_01: path.join(THIS_DIRNAME, 'test-data-01.txt'),
  TEST_DATA_02: path.join(THIS_DIRNAME, 'test-data-02.txt'),
};
const DATA = {
  REAL: fs.readFileSync(PATHS.DATA, 'utf8') as string,
  TEST1: fs.readFileSync(PATHS.TEST_DATA_01, 'utf8') as string,
  TEST2: fs.readFileSync(PATHS.TEST_DATA_02, 'utf8') as string,
};

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? DATA.TEST1 : DATA.REAL;
  const lines = dataToUse.split('\n').filter((line) => line.trim().length > 0);

  const firstCol: number[] = [];
  const secondCol: number[] = [];
  for (const nextLine of lines) {
    const [first, second] = nextLine.split(/ +/u);
    firstCol.push(Number.parseInt(first!, 10));
    secondCol.push(Number.parseInt(second!, 10));
  }

  firstCol.sort((a, b) => a - b);
  secondCol.sort((a, b) => a - b);

  let total = 0;
  // eslint-disable-next-line unicorn/no-for-loop
  for (let index = 0; index < firstCol.length; index++) {
    total += Math.abs(firstCol[index]! - secondCol[index]!);
  }

  logAnswer({
    answer: total,
    expected: USE_TEST_DATA ? 11 : 1_579_939,
    partNum: 1,
    taskStartedAt,
  });
};

// Run task two
const runTwo = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? DATA.TEST2 : DATA.REAL;
  const lines = dataToUse.split('\n').filter((line) => line.trim().length > 0);

  let similarity = 0;
  const occurrenceCount = new Map<number, number>();

  const firstCol: number[] = [];
  for (const nextLine of lines) {
    const [first, second] = nextLine.split(/ +/u);
    firstCol.push(Number.parseInt(first!, 10));

    const secondNumber = Number.parseInt(second!, 10);
    const previousOccurrence = occurrenceCount.get(secondNumber) ?? 0;
    occurrenceCount.set(secondNumber, previousOccurrence + 1);
  }

  for (const nextNumber of firstCol) {
    similarity += nextNumber * (occurrenceCount.get(nextNumber) ?? 0);
  }

  logAnswer({
    answer: similarity,
    expected: USE_TEST_DATA ? 31 : 20_351_745,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
