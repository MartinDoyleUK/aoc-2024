/* eslint-disable no-console */
/* eslint-disable unicorn/no-lonely-if */
import { getDataForPuzzle, logAnswer } from '../utils/index.js';

// eslint-disable-next-line perfectionist/sort-union-types
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Toggle this to use test or real data
const USE_TEST_DATA = true;

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

  const visitedPositions = new Set<string>();
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
        // console.log(`Found obstacle at ${nextPosition}, stepping back and turning to ${direction}`);
        nextPosition = toPoint({ col, row });
      } else {
        visitedPositions.add(nextPosition);
      }
    }
  }

  logAnswer({
    answer: visitedPositions.size,
    expected: USE_TEST_DATA ? 41 : 5_131,
    partNum: 1,
    taskStartedAt,
  });
};

// Run task two
// eslint-disable-next-line complexity
const runTwo = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST2 : data.REAL;
  const lines = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const grid = lines.map((line) => line.split(''));

  const obstaclesByRow = new Map<number, number[]>();
  const obstaclesByCol = new Map<number, number[]>();
  let startingPosition: string | undefined;
  for (let row = 0; row < grid.length; row++) {
    const nextRow = grid[row]!;
    for (let col = 0; col < nextRow.length; col++) {
      const nextCell = nextRow[col]!;
      const nextPoint = toPoint({ col, row });
      if (nextCell === '#') {
        console.log(`Found obstacle at ${row},${col}`);
        const currentByRow = obstaclesByRow.get(row) ?? [];
        obstaclesByRow.set(row, currentByRow.concat([col]));
        const currentByCol = obstaclesByCol.get(col) ?? [];
        obstaclesByCol.set(col, currentByCol.concat([row]));
      } else if (nextCell === '^') {
        startingPosition = nextPoint;
      }
    }
  }

  // console.log({ obstaclesByCol, obstaclesByRow });

  const turnedAtPositionsByRow = new Map<number, number[]>();
  const turnedAtPositionsByCol = new Map<number, number[]>();
  const turnedAt = new Set<string>();
  const newObstacles = new Set<string>();
  if (startingPosition !== undefined) {
    let direction: Direction = 'UP';
    let offGrid = false;
    let nextPosition = startingPosition;
    while (!offGrid) {
      // console.log('checking', nextPosition);
      const currPosition = nextPosition;
      const { col: currCol, row: currRow } = fromPoint(currPosition);
      if (direction === 'UP') {
        nextPosition = toPoint({ col: currCol, row: currRow - 1 });
      } else if (direction === 'DOWN') {
        nextPosition = toPoint({ col: currCol, row: currRow + 1 });
      } else if (direction === 'LEFT') {
        nextPosition = toPoint({ col: currCol - 1, row: currRow });
      } else if (direction === 'RIGHT') {
        nextPosition = toPoint({ col: currCol + 1, row: currRow });
      }

      const { col: newCol, row: newRow } = fromPoint(nextPosition);
      if (newRow < 0 || newRow >= grid.length || newCol < 0 || newCol >= grid[0]!.length) {
        offGrid = true;
      } else if (obstaclesByRow.get(newRow)?.includes(newCol)) {
        direction = getNextDirection(direction);
        nextPosition = toPoint({ col: currCol, row: currRow });

        console.log('Adding turn at', nextPosition);
        turnedAt.add(nextPosition);
        const currentTurnedAtRow = turnedAtPositionsByRow.get(currRow) ?? [];
        turnedAtPositionsByRow.set(currRow, currentTurnedAtRow.concat([currCol]));
        const currentTurnedAtCol = turnedAtPositionsByCol.get(currCol) ?? [];
        turnedAtPositionsByCol.set(currCol, currentTurnedAtCol.concat([currRow]));
      } else if (!turnedAt.has(currPosition)) {
        const turningsOnRow = turnedAtPositionsByRow.get(currRow);
        const turningsOnCol = turnedAtPositionsByCol.get(currCol);
        const obstaclesOnRow = obstaclesByCol.get(currRow);
        const obstaclesOnCol = obstaclesByRow.get(currCol);
        if (direction === 'UP' && currRow > 0 && turningsOnRow) {
          for (const prevTurningCol of turningsOnRow) {
            if (!newObstacles.has(nextPosition) && prevTurningCol > currCol) {
              if (
                !obstaclesOnRow ||
                obstaclesOnRow.every((obstacleCol) => {
                  const isObstacleInWay = obstacleCol > currCol && obstacleCol < prevTurningCol;
                  return !isObstacleInWay;
                })
              ) {
                console.log(`Adding new obstacle at ${nextPosition}`);
                newObstacles.add(nextPosition);
              }
            }
          }
        } else if (direction === 'DOWN' && currRow < grid.length - 1 && turningsOnRow) {
          for (const prevTurningCol of turningsOnRow) {
            if (!newObstacles.has(nextPosition) && prevTurningCol < currCol) {
              if (
                !obstaclesOnRow ||
                obstaclesOnRow.every((obstacleCol) => {
                  const isObstacleInWay = obstacleCol < currCol && obstacleCol > prevTurningCol;
                  return !isObstacleInWay;
                })
              ) {
                console.log(`Adding new obstacle at ${nextPosition}`);
                newObstacles.add(nextPosition);
              }
            }
          }
        } else if (direction === 'LEFT' && currCol > 0 && turningsOnCol) {
          for (const prevTurningRow of turningsOnCol) {
            console.log(`At ${currPosition} (prevTurningRow=${prevTurningRow}, next=${nextPosition})`);
            if (!newObstacles.has(nextPosition) && prevTurningRow < currRow) {
              console.log(`Checking for obstacles (${obstaclesOnCol})`);
              if (
                !obstaclesOnCol ||
                obstaclesOnCol.every((obstacleRow) => {
                  const isObstacleInWay = obstacleRow < currRow && obstacleRow > prevTurningRow;
                  return !isObstacleInWay;
                })
              ) {
                console.log(`Adding new obstacle at ${nextPosition}`);
                newObstacles.add(nextPosition);
              }
            }
          }
        } else if (direction === 'RIGHT' && currCol < grid[0]!.length - 1 && turningsOnCol) {
          for (const prevTurningRow of turningsOnCol) {
            if (!newObstacles.has(nextPosition) && prevTurningRow > currRow) {
              if (
                !obstaclesOnCol ||
                obstaclesOnCol.every((obstacleRow) => {
                  const isObstacleInWay = obstacleRow > currRow && obstacleRow < prevTurningRow;
                  return !isObstacleInWay;
                })
              ) {
                console.log(`Adding new obstacle at ${nextPosition}`);
                newObstacles.add(nextPosition);
              }
            }
          }
        }
      }
    }
  }

  // console.log({ turnedAtPositionsByCol, turnedAtPositionsByRow });

  logAnswer({
    answer: newObstacles.size,
    expected: USE_TEST_DATA ? 6 : undefined,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
