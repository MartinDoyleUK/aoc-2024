import { getDataForPuzzle, logAnswer } from '../utils/index.js';

// eslint-disable-next-line perfectionist/sort-union-types
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

const toPoint = ({ col, row }: { col: number; row: number }): string => {
  return `${row},${col}`;
};

const fromPoint = (point: string): { col: number; row: number } => {
  const [row, col] = point.split(',').map((rowOrCol) => Number.parseInt(rowOrCol, 10)) as [number, number];
  return { col, row };
};

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

const countVisitedPositions = (grid: string[][], obstacles: Set<string>, startingPosition?: string) => {
  const visited = new Set<string>();

  if (startingPosition !== undefined) {
    let direction: Direction = 'UP';
    let offGrid = false;
    let nextPosition = startingPosition;
    while (!offGrid) {
      const { col, row } = fromPoint(nextPosition);
      if (direction === 'UP') {
        nextPosition = toPoint({ col, row: row - 1 });
      } else if (direction === 'DOWN') {
        nextPosition = toPoint({ col, row: row + 1 });
      } else if (direction === 'LEFT') {
        nextPosition = toPoint({ col: col - 1, row });
      } else if (direction === 'RIGHT') {
        nextPosition = toPoint({ col: col + 1, row });
      }

      const { col: newCol, row: newRow } = fromPoint(nextPosition);
      if (newRow < 0 || newRow >= grid.length || newCol < 0 || newCol >= grid[0]!.length) {
        offGrid = true;
      } else if (obstacles.has(nextPosition)) {
        direction = getNextDirection(direction);
        nextPosition = toPoint({ col, row });
      } else {
        visited.add(nextPosition);
      }
    }
  }

  return visited.size;
};

const getsInLoop = (grid: string[][], obstacles: Set<string>, startingPosition?: string) => {
  const turnedAt = new Set<string>();
  let isLoopFound = false;

  if (startingPosition !== undefined) {
    let direction: Direction = 'UP';
    let offGrid = false;
    let nextPosition = startingPosition;
    while (!offGrid) {
      const { col, row } = fromPoint(nextPosition);
      if (direction === 'UP') {
        nextPosition = toPoint({ col, row: row - 1 });
      } else if (direction === 'DOWN') {
        nextPosition = toPoint({ col, row: row + 1 });
      } else if (direction === 'LEFT') {
        nextPosition = toPoint({ col: col - 1, row });
      } else if (direction === 'RIGHT') {
        nextPosition = toPoint({ col: col + 1, row });
      }

      const { col: newCol, row: newRow } = fromPoint(nextPosition);
      if (newRow < 0 || newRow >= grid.length || newCol < 0 || newCol >= grid[0]!.length) {
        offGrid = true;
      } else if (obstacles.has(nextPosition)) {
        direction = getNextDirection(direction);
        nextPosition = toPoint({ col, row });

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
  const grid = lines.map((line) => line.split(''));

  const obstacles = new Set<string>();
  let startingPosition: string | undefined;
  for (let row = 0; row < grid.length; row++) {
    const nextRow = grid[row]!;
    for (let col = 0; col < nextRow.length; col++) {
      const nextCell = nextRow[col]!;
      const nextPoint = toPoint({ col, row });
      if (nextCell === '#') {
        obstacles.add(nextPoint);
      } else if (nextCell === '^') {
        startingPosition = nextPoint;
      }
    }
  }

  const visitedCount = countVisitedPositions(grid, obstacles, startingPosition);

  logAnswer({
    answer: visitedCount,
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
  const grid = lines.map((line) => line.split(''));

  const obstacles = new Set<string>();
  let startingPosition: string | undefined;
  for (let row = 0; row < grid.length; row++) {
    const nextRow = grid[row]!;
    for (let col = 0; col < nextRow.length; col++) {
      const nextCell = nextRow[col]!;
      const nextPoint = toPoint({ col, row });
      if (nextCell === '#') {
        obstacles.add(nextPoint);
      } else if (nextCell === '^') {
        startingPosition = nextPoint;
      }
    }
  }

  let validObstacles = 0;
  for (let row = 0; row < grid.length; row++) {
    const nextRow = grid[row]!;
    for (let col = 0; col < nextRow.length; col++) {
      const newObstacle = toPoint({ col, row });
      const tempObstacles = new Set([newObstacle, ...obstacles]);
      if (getsInLoop(grid, tempObstacles, startingPosition)) {
        validObstacles++;
      }
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
