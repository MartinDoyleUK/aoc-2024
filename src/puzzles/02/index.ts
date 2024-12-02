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

const isReportSafe = (reportLevels: number[]) => {
  let direction: 'down' | 'up' | undefined;
  let lastLevel: number;

  return reportLevels.every((nextLevel) => {
    if (lastLevel !== undefined) {
      const diff = lastLevel - nextLevel;
      if (diff === 0 || Math.abs(diff) > 3 || (direction === 'up' && diff > 0) || (direction === 'down' && diff < 0)) {
        return false;
      }

      if (direction === undefined) {
        direction = diff < 0 ? 'up' : 'down';
      }
    }

    lastLevel = nextLevel;
    return true;
  });
};

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? DATA.TEST1 : DATA.REAL;
  const lines = dataToUse.split('\n').filter((line) => line.trim().length > 0);

  const safeReports = lines.filter((nextLine) => {
    const reportLevels = nextLine.split(' ').map((value) => Number.parseInt(value, 10));

    return isReportSafe(reportLevels);
  });

  logAnswer({
    answer: safeReports.length,
    expected: USE_TEST_DATA ? 2 : 585,
    partNum: 1,
    taskStartedAt,
  });
};

// Run task two
const runTwo = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? DATA.TEST2 : DATA.REAL;
  const lines = dataToUse.split('\n').filter((line) => line.trim().length > 0);

  const safeReports = lines.filter((nextLine) => {
    const reportLevels = nextLine.split(' ').map((value) => Number.parseInt(value, 10));

    if (isReportSafe(reportLevels)) {
      return true;
    }

    // Brute force ... ugly!
    for (let index = 0; index < reportLevels.length; index++) {
      const cloned = reportLevels.slice();
      cloned.splice(index, 1);
      if (isReportSafe(cloned)) {
        return true;
      }
    }

    return false;
  });

  logAnswer({
    answer: safeReports.length,
    expected: USE_TEST_DATA ? 4 : 626,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
