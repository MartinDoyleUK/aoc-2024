import { getDataForPuzzle, type Grid, linesToNumberGrid, logAnswer, Point } from '../utils/index.js';

type GetTrailheadScoreFn = (params: { grid: Grid<number>; path?: Point[]; point: Point; prevVal?: number }) => number;

type VisitTrailheadSummitsFn = (params: {
  grid: Grid<number>;
  point: Point;
  prevVal?: number;
  summits: Set<string>;
}) => void;

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

const getTrailheadScore: GetTrailheadScoreFn = ({ grid, path = [], point, prevVal }) => {
  const thisVal = grid.at(point);
  if (thisVal === undefined) {
    return 0;
  } else if (prevVal !== undefined && thisVal !== prevVal + 1) {
    return 0;
  } else if (thisVal === 9) {
    return 1;
  }

  const { col, row } = point;
  const nextCells = [
    new Point({ col, row: row + 1 }),
    new Point({ col, row: row - 1 }),
    new Point({ col: col + 1, row }),
    new Point({ col: col - 1, row }),
  ];

  return nextCells.reduce((prev, next) => {
    return (
      prev +
      getTrailheadScore({
        grid,
        path: path.concat(point),
        point: next,
        prevVal: thisVal,
      })
    );
  }, 0);
};

const visitTrailheadSummits: VisitTrailheadSummitsFn = ({ grid, point, prevVal, summits }) => {
  const thisVal = grid.at(point);
  if (thisVal === undefined) {
    return;
  } else if (prevVal !== undefined && thisVal !== prevVal + 1) {
    return;
  } else if (thisVal === 9) {
    summits.add(point.toString());
    return;
  }

  const { col, row } = point;
  const nextCells = [
    new Point({ col, row: row + 1 }),
    new Point({ col, row: row - 1 }),
    new Point({ col: col + 1, row }),
    new Point({ col: col - 1, row }),
  ];

  for (const next of nextCells) {
    visitTrailheadSummits({
      grid,
      point: next,
      prevVal: thisVal,
      summits,
    });
  }
};

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
      visitTrailheadSummits({ grid, point, summits });
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
      const trailheadScore = getTrailheadScore({ grid, point });
      totalScore += trailheadScore;
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
