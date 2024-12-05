import { getDataForPuzzle, logAnswer } from '../utils/index.js';

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const lines = dataToUse.split('\n').map((line) => line.trim());

  // Get the ordering rules
  const beforeMap = new Map<number, number[]>();
  let emptyLineIndex: number | undefined;
  for (let i = 0; i < lines.length; i++) {
    const nextLine = lines[i]!;
    if (nextLine.length === 0) {
      emptyLineIndex = i;
      break;
    }

    const [before, after] = nextLine.split('|').map((numStr) => Number.parseInt(numStr, 10)) as [number, number];
    const currentAfters = beforeMap.get(before) ?? [];
    beforeMap.set(before, currentAfters.concat([after]));
  }

  // Run through the pages
  const pageUpdates = lines.slice(emptyLineIndex! + 1);
  let middlePageCount = 0;
  for (const nextUpdate of pageUpdates) {
    // Might have blank line(s) at end of input
    if (nextUpdate.length === 0) {
      continue;
    }

    // Setup pages and checklist
    const updatePages = nextUpdate.split(',').map((numStr) => Number.parseInt(numStr, 10));
    const pagesSeenInUpdate = new Set<number>();

    // Check the pages are valid
    const pagesAreValid = updatePages.every((nextPageNum) => {
      if (beforeMap.has(nextPageNum)) {
        const shouldBeAfter = beforeMap.get(nextPageNum)!;
        if (shouldBeAfter.some((shouldBeAfterPageNum) => pagesSeenInUpdate.has(shouldBeAfterPageNum))) {
          return false;
        }
      }

      pagesSeenInUpdate.add(nextPageNum);
      return true;
    });

    // Add middle page when valid
    if (pagesAreValid) {
      const middleIndex = Math.floor(updatePages.length / 2);
      middlePageCount += updatePages[middleIndex]!;
    }
  }

  logAnswer({
    answer: middlePageCount,
    expected: USE_TEST_DATA ? 143 : 5_108,
    partNum: 1,
    taskStartedAt,
  });
};

// Run task two
const runTwo = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST2 : data.REAL;
  const lines = dataToUse.split('\n').map((line) => line.trim());

  // Get the ordering rules
  const beforeMap = new Map<number, number[]>();
  let emptyLineIndex: number | undefined;
  for (let i = 0; i < lines.length; i++) {
    const nextLine = lines[i]!;
    if (nextLine.length === 0) {
      emptyLineIndex = i;
      break;
    }

    const [before, after] = nextLine.split('|').map((numStr) => Number.parseInt(numStr, 10)) as [number, number];
    const currentAfters = beforeMap.get(before) ?? [];
    beforeMap.set(before, currentAfters.concat([after]));
  }

  // Run through the pages
  const pageUpdates = lines.slice(emptyLineIndex! + 1);
  const invalidUpdates: number[][] = [];
  for (const nextUpdate of pageUpdates) {
    // Might have blank line(s) at end of input
    if (nextUpdate.length === 0) {
      continue;
    }

    // Setup pages and checklist
    const updatePages = nextUpdate.split(',').map((numStr) => Number.parseInt(numStr, 10));
    const pagesSeenInUpdate = new Set<number>();

    // Check the pages are valid
    const pagesAreValid = updatePages.every((nextPageNum) => {
      if (beforeMap.has(nextPageNum)) {
        const shouldBeAfter = beforeMap.get(nextPageNum)!;
        if (shouldBeAfter.some((shouldBeAfterPageNum) => pagesSeenInUpdate.has(shouldBeAfterPageNum))) {
          // console.log(`INVALID: (${nextPageNum})`, updatePages);
          return false;
        }
      }

      pagesSeenInUpdate.add(nextPageNum);
      return true;
    });

    if (!pagesAreValid) {
      invalidUpdates.push(updatePages);
    }
  }

  const afterMap: Map<number, number[]> = new Map();
  for (const [before, after] of beforeMap.entries()) {
    for (const nextAfter of after) {
      const currentBefores = afterMap.get(nextAfter) ?? [];
      afterMap.set(nextAfter, currentBefores.concat([before]));
    }
  }

  let middlePageCount = 0;
  for (const updatesForSorting of invalidUpdates) {
    updatesForSorting.sort((a, b) => {
      if (beforeMap.get(a)?.includes(b)) {
        return -1;
      } else if (afterMap.get(b)?.includes(a)) {
        return 1;
      }

      return 0;
    });

    // Add the updates
    const middleIndex = Math.floor(updatesForSorting.length / 2);
    middlePageCount += updatesForSorting[middleIndex]!;
  }

  logAnswer({
    answer: middlePageCount,
    expected: USE_TEST_DATA ? 123 : 7_380,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
