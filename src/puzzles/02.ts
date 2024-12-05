import { getDataForPuzzle, logAnswer } from '../utils/index.js';

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

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
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const lines = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

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
  const dataToUse = USE_TEST_DATA ? data.TEST2 : data.REAL;
  const lines = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

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
