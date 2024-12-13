import { getDataForPuzzle, type Grid, linesToStringGrid, logAnswer, Point } from '../utils/index.js';

// eslint-disable-next-line perfectionist/sort-union-types
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

const getNextDirection = (currDirection: Direction): Direction => {
  if (currDirection === 'UP') {
    return 'RIGHT';
  } else if (currDirection === 'RIGHT') {
    return 'DOWN';
  } else if (currDirection === 'DOWN') {
    return 'LEFT';
  } else {
    return 'UP';
  }
};

const getVisitedPositions = (grid: Grid<string>, obstacles: Set<string>, startingPosition?: Point): Set<string> => {
  const visited = new Set<string>();

  if (startingPosition !== undefined) {
    let direction: Direction = 'UP';
    let offGrid = false;
    let nextPosition = startingPosition;
    while (!offGrid) {
      const { col: thisCol, row: thisRow } = nextPosition;
      if (direction === 'UP') {
        nextPosition = new Point({ col: thisCol, row: thisRow - 1 });
      } else if (direction === 'DOWN') {
        nextPosition = new Point({ col: thisCol, row: thisRow + 1 });
      } else if (direction === 'LEFT') {
        nextPosition = new Point({ col: thisCol - 1, row: thisRow });
      } else if (direction === 'RIGHT') {
        nextPosition = new Point({ col: thisCol + 1, row: thisRow });
      }

      if (!grid.isWithinBounds(nextPosition)) {
        offGrid = true;
      } else if (obstacles.has(nextPosition.toString())) {
        direction = getNextDirection(direction);
        nextPosition = new Point({ col: thisCol, row: thisRow });
      } else {
        visited.add(nextPosition.toString());
      }
    }
  }

  return visited;
};

const getsInLoop = (grid: Grid<string>, obstacles: Set<string>, startingPosition?: Point) => {
  const turnedAt = new Set<string>();
  let isLoopFound = false;

  if (startingPosition !== undefined) {
    let direction: Direction = 'UP';
    let offGrid = false;
    let nextPosition = startingPosition;
    while (!offGrid) {
      const { col, row } = nextPosition;
      if (direction === 'UP') {
        nextPosition = new Point({ col, row: row - 1 });
      } else if (direction === 'DOWN') {
        nextPosition = new Point({ col, row: row + 1 });
      } else if (direction === 'LEFT') {
        nextPosition = new Point({ col: col - 1, row });
      } else if (direction === 'RIGHT') {
        nextPosition = new Point({ col: col + 1, row });
      }

      const { col: newCol, row: newRow } = nextPosition;
      if (newRow < 0 || newRow >= grid.numRows || newCol < 0 || newCol >= grid.numCols) {
        offGrid = true;
      } else if (obstacles.has(nextPosition.toString())) {
        direction = getNextDirection(direction);
        nextPosition = new Point({ col, row });

        if (turnedAt.has(`${nextPosition}${direction}`)) {
          isLoopFound = true;
          break;
        } else {
          turnedAt.add(`${nextPosition}${direction}`);
        }
      }
    }
  }

  return isLoopFound;
};

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const lines = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const grid = linesToStringGrid(lines);

  const obstacles = new Set<string>();
  let startingPosition: Point | undefined;
  for (const { point, value } of grid) {
    if (value === '#') {
      obstacles.add(point.toString());
    } else if (value === '^') {
      startingPosition = point;
    }
  }

  const visitedPositions = getVisitedPositions(grid, obstacles, startingPosition);

  logAnswer({
    answer: visitedPositions.size,
    expected: USE_TEST_DATA ? 41 : 5_131,
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
  const grid = linesToStringGrid(lines);

  const obstacles = new Set<string>();
  let startingPosition: Point | undefined;
  for (const { point, value } of grid) {
    if (value === '#') {
      obstacles.add(point.toString());
    } else if (value === '^') {
      startingPosition = point;
    }
  }

  const visitedPositions = getVisitedPositions(grid, obstacles, startingPosition);

  let validObstacles = 0;
  for (const nextPosition of visitedPositions) {
    const tempObstacles = new Set([nextPosition, ...obstacles]);
    if (getsInLoop(grid, tempObstacles, startingPosition)) {
      validObstacles++;
    }
  }

  logAnswer({
    answer: validObstacles,
    expected: USE_TEST_DATA ? 6 : 1_784,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
