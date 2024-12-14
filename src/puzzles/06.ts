import {
  getDataForPuzzle,
  type Grid,
  linesToStringGrid,
  logAnswer,
  type Point,
  type Vector,
  VECTORS,
} from '../utils/index.js';

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

const turnRight = (curr: Vector): Vector => {
  if (curr.eq(VECTORS.N)) {
    return VECTORS.E;
  } else if (curr.eq(VECTORS.E)) {
    return VECTORS.S;
  } else if (curr.eq(VECTORS.S)) {
    return VECTORS.W;
  } else if (curr.eq(VECTORS.W)) {
    return VECTORS.N;
  }

  throw new SyntaxError(`Unexpected vector: ${curr}`);
};

const getVisitedPositions = (grid: Grid<string>, obstacles: Set<string>, startingPosition?: Point): Set<string> => {
  const visited = new Set<string>();

  if (startingPosition !== undefined) {
    let direction = VECTORS.N;
    let offGrid = false;
    let nextPosition = startingPosition;
    let thisPosition: Point;
    while (!offGrid) {
      thisPosition = nextPosition;
      nextPosition = nextPosition.applyVector(direction);

      if (!grid.isWithinBounds(nextPosition)) {
        offGrid = true;
      } else if (obstacles.has(nextPosition.toString())) {
        direction = turnRight(direction);
        nextPosition = thisPosition;
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
    let direction = VECTORS.N;
    let offGrid = false;
    let nextPosition = startingPosition;
    let thisPosition: Point;
    while (!offGrid) {
      thisPosition = nextPosition;
      nextPosition = nextPosition.applyVector(direction);

      const { col: newCol, row: newRow } = nextPosition;
      if (newRow < 0 || newRow >= grid.numRows || newCol < 0 || newCol >= grid.numCols) {
        offGrid = true;
      } else if (obstacles.has(nextPosition.toString())) {
        direction = turnRight(direction);
        nextPosition = thisPosition;

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
