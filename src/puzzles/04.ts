import { getDataForPuzzle, logAnswer } from '../utils/index.js';

type CheckForMasFn = (path: [number, number][]) => void;

// eslint-disable-next-line perfectionist/sort-union-types
type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

// Constants
const DIRECTIONS: Direction[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const lines = dataToUse.split('\n').filter((line) => line.trim().length > 0);

  const numRows = lines.length;
  const numCols = lines[0]!.length;

  const xPositions: [number, number][] = [];
  const grid = lines.map((nextLine, rowIndex) => {
    // Get all the X's (starting positions)
    const matches = nextLine.matchAll(/X/gu);
    for (const nextMatch of matches) {
      xPositions.push([rowIndex, nextMatch.index]);
    }

    return nextLine.split('');
  });

  const xmasLetters = 'XMAS'.split('');
  const checkForXmas: CheckForMasFn = (path) => {
    // console.log(`Checking [${path.join('],[')}]`);
    for (let i = 0; i < path.length; i++) {
      const [rowIndex, colIndex] = path[i]!;
      if (grid[rowIndex]![colIndex] !== xmasLetters[i]) {
        return false;
      }
    }

    return true;
  };

  let xmasCounter = 0;
  for (const [rowIndex, colIndex] of xPositions) {
    for (const nextDir of DIRECTIONS) {
      const pathToCheck: [number, number][] = [[rowIndex, colIndex]];
      switch (nextDir) {
        case 'N': {
          if (rowIndex >= 3) {
            pathToCheck.push([rowIndex - 1, colIndex], [rowIndex - 2, colIndex], [rowIndex - 3, colIndex]);
          }

          break;
        }

        case 'NE': {
          if (rowIndex >= 3 && colIndex <= numCols - 4) {
            pathToCheck.push([rowIndex - 1, colIndex + 1], [rowIndex - 2, colIndex + 2], [rowIndex - 3, colIndex + 3]);
          }

          break;
        }

        case 'E': {
          if (colIndex <= numCols - 4) {
            pathToCheck.push([rowIndex, colIndex + 1], [rowIndex, colIndex + 2], [rowIndex, colIndex + 3]);
          }

          break;
        }

        case 'SE': {
          if (rowIndex <= numRows - 4 && colIndex <= numCols - 4) {
            pathToCheck.push([rowIndex + 1, colIndex + 1], [rowIndex + 2, colIndex + 2], [rowIndex + 3, colIndex + 3]);
          }

          break;
        }

        case 'S': {
          if (rowIndex <= numRows - 4) {
            pathToCheck.push([rowIndex + 1, colIndex], [rowIndex + 2, colIndex], [rowIndex + 3, colIndex]);
          }

          break;
        }

        case 'SW': {
          if (rowIndex <= numRows - 4 && colIndex >= 3) {
            pathToCheck.push([rowIndex + 1, colIndex - 1], [rowIndex + 2, colIndex - 2], [rowIndex + 3, colIndex - 3]);
          }

          break;
        }

        case 'W': {
          if (colIndex >= 3) {
            pathToCheck.push([rowIndex, colIndex - 1], [rowIndex, colIndex - 2], [rowIndex, colIndex - 3]);
          }

          break;
        }

        case 'NW': {
          if (rowIndex >= 3 && colIndex >= 3) {
            pathToCheck.push([rowIndex - 1, colIndex - 1], [rowIndex - 2, colIndex - 2], [rowIndex - 3, colIndex - 3]);
          }

          break;
        }
      }

      if (pathToCheck.length === 4 && checkForXmas(pathToCheck)) {
        xmasCounter++;
      }
    }
  }

  logAnswer({
    answer: xmasCounter,
    expected: USE_TEST_DATA ? 18 : 2_543,
    partNum: 1,
    taskStartedAt,
  });
};

// Run task two
const runTwo = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST2 : data.REAL;
  const lines = dataToUse.split('\n').filter((line) => line.trim().length > 0);

  const numRows = lines.length;
  const numCols = lines[0]!.length;

  const mPositions: [number, number][] = [];
  const grid = lines.map((nextLine, rowIndex) => {
    // Get all the M's (starting positions)
    const matches = nextLine.matchAll(/M/gu);
    for (const nextMatch of matches) {
      mPositions.push([rowIndex, nextMatch.index]);
    }

    return nextLine.split('');
  });

  const masLetters = 'MAS'.split('');
  const masAPositionsCounter = new Map<string, number>();
  const checkForMas: CheckForMasFn = (path) => {
    for (let i = 0; i < path.length; i++) {
      const [rowIndex, colIndex] = path[i]!;
      if (grid[rowIndex]![colIndex] !== masLetters[i]) {
        return;
      }
    }

    // Found MAS, increment counter at the A
    const aPosition = path[1]!.join(',');
    const currentCounter = masAPositionsCounter.get(aPosition) ?? 0;
    masAPositionsCounter.set(aPosition, currentCounter + 1);
  };

  for (const [rowIndex, colIndex] of mPositions) {
    for (const nextDir of DIRECTIONS) {
      const pathToCheck: [number, number][] = [[rowIndex, colIndex]];
      switch (nextDir) {
        case 'NE': {
          if (rowIndex >= 2 && colIndex <= numCols - 3) {
            pathToCheck.push([rowIndex - 1, colIndex + 1], [rowIndex - 2, colIndex + 2]);
          }

          break;
        }

        case 'SE': {
          if (rowIndex <= numRows - 3 && colIndex <= numCols - 3) {
            pathToCheck.push([rowIndex + 1, colIndex + 1], [rowIndex + 2, colIndex + 2]);
          }

          break;
        }

        case 'SW': {
          if (rowIndex <= numRows - 3 && colIndex >= 2) {
            pathToCheck.push([rowIndex + 1, colIndex - 1], [rowIndex + 2, colIndex - 2]);
          }

          break;
        }

        case 'NW': {
          if (rowIndex >= 2 && colIndex >= 2) {
            pathToCheck.push([rowIndex - 1, colIndex - 1], [rowIndex - 2, colIndex - 2]);
          }

          break;
        }

        // Do nothing!
        default: {
          break;
        }
      }

      if (pathToCheck.length === 3) {
        checkForMas(pathToCheck);
      }
    }
  }

  const foundPositions = [...masAPositionsCounter.values()].filter((nextValue) => nextValue > 1);

  logAnswer({
    answer: foundPositions.length,
    expected: USE_TEST_DATA ? 9 : 1_930,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
