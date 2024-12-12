import { getDataForPuzzle, type Grid, gridRefToPoint, logAnswer, type Point } from '../utils/index.js';

type GetTrailheadScoreFn = (params: {
  col: number;
  grid: Grid<number>;
  path?: Point[];
  prevVal?: number;
  row: number;
}) => number;

type VisitTrailheadSummitsFn = (params: {
  col: number;
  grid: Grid<number>;
  prevVal?: number;
  row: number;
  summits: Set<Point>;
}) => void;

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

const getTrailheadScore: GetTrailheadScoreFn = ({ col, grid, path = [], prevVal, row }) => {
  const thisVal = grid[row]?.[col];
  const thisPoint = gridRefToPoint({ col, row });
  if (thisVal === undefined) {
    return 0;
  } else if (prevVal !== undefined && thisVal !== prevVal + 1) {
    return 0;
  } else if (thisVal === 9) {
    return 1;
  }

  const nextCells = [
    { col, row: row + 1 },
    { col, row: row - 1 },
    { col: col + 1, row },
    { col: col - 1, row },
  ];

  return nextCells.reduce((prev, next) => {
    return (
      prev +
      getTrailheadScore({
        col: next.col,
        grid,
        path: path.concat(thisPoint),
        prevVal: thisVal,
        row: next.row,
      })
    );
  }, 0);
};

const visitTrailheadSummits: VisitTrailheadSummitsFn = ({ col, grid, prevVal, row, summits }) => {
  const thisVal = grid[row]?.[col];
  const thisPoint = gridRefToPoint({ col, row });
  if (thisVal === undefined) {
    return;
  } else if (prevVal !== undefined && thisVal !== prevVal + 1) {
    return;
  } else if (thisVal === 9) {
    summits.add(thisPoint);
    return;
  }

  const nextCells = [
    { col, row: row + 1 },
    { col, row: row - 1 },
    { col: col + 1, row },
    { col: col - 1, row },
  ];

  for (const next of nextCells) {
    visitTrailheadSummits({
      col: next.col,
      grid,
      prevVal: thisVal,
      row: next.row,
      summits,
    });
  }
};

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const grid = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.split('').map(Number));

  let totalScore = 0;
  for (let row = 0; row < grid.length; row++) {
    const nextRow = grid[row]!;
    for (let col = 0; col < nextRow.length; col++) {
      const nextCell = nextRow[col]!;
      if (nextCell === 0) {
        const summits = new Set<Point>();
        visitTrailheadSummits({ col, grid, row, summits });
        totalScore += summits.size;
      }
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
  const grid = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.split('').map(Number));

  let totalScore = 0;
  for (let row = 0; row < grid.length; row++) {
    const nextRow = grid[row]!;
    for (let col = 0; col < nextRow.length; col++) {
      const nextCell = nextRow[col]!;
      if (nextCell === 0) {
        const trailheadScore = getTrailheadScore({ col, grid, row });
        totalScore += trailheadScore;
      }
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
