import { getDataForPuzzle, linesToNumberGrid, logAnswer } from '../utils/index.js';

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const lines = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const grid = linesToNumberGrid(lines);

  let totalScore = 0;
  for (const { point, value } of grid) {
    if (value === 0) {
      const summits = new Set<string>();
      grid.traverse(point, 'dfs', {
        onVisit: (visitInfo) => {
          let visitNeighbours: boolean;
          const { path, thisPointAndValue } = visitInfo;
          const { point: thisPoint, value: currentValue } = thisPointAndValue;
          const { value: lastValue } = path.at(-1) ?? {};

          if (lastValue === undefined) {
            visitNeighbours = currentValue === 0;
          } else if (currentValue !== lastValue + 1) {
            visitNeighbours = false;
          } else if (currentValue === 9) {
            summits.add(thisPoint.toString());
            visitNeighbours = false;
          } else {
            visitNeighbours = true;
          }

          return {
            abort: false,
            visitNeighbours,
          };
        },
      });
      totalScore += summits.size;
    }
  }

  logAnswer({
    answer: totalScore,
    expected: USE_TEST_DATA ? 36 : 760,
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
  const grid = linesToNumberGrid(lines);

  let totalScore = 0;
  for (const { point, value } of grid) {
    if (value === 0) {
      let trailRating = 0;
      grid.traverse(point, 'dfs', {
        onVisit: (visitInfo) => {
          let visitNeighbours: boolean;
          const { path, thisPointAndValue } = visitInfo;
          const { value: currentValue } = thisPointAndValue;
          const { value: lastValue } = path.at(-1) ?? {};

          if (lastValue === undefined) {
            visitNeighbours = currentValue === 0;
          } else if (currentValue !== lastValue + 1) {
            visitNeighbours = false;
          } else if (currentValue === 9) {
            trailRating++;
            visitNeighbours = false;
          } else {
            visitNeighbours = true;
          }

          return {
            abort: false,
            visitNeighbours,
          };
        },
      });
      totalScore += trailRating;
    }
  }

  logAnswer({
    answer: totalScore,
    expected: USE_TEST_DATA ? 81 : 1_764,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
