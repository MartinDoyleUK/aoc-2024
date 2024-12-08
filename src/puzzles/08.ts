import { type Point, type Vector } from '../types/index.js';
import { getDataForPuzzle, isPointWithinGrid, logAnswer, pointToString, stringToPoint } from '../utils/index.js';

type AddAntinodesFn = (params: { antinodes: Set<string>; grid: string[]; startPos: Point; vector: Vector }) => void;

type Antennas = Map<string, string[]>;

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

const ANTENNA_REGEX = /^[A-Za-z0-9]$/u;

const mapAntennas = (grid: string[]): Antennas => {
  const antennas = new Map<string, string[]>();
  const numRows = grid.length;
  const numCols = grid[0]!.length;

  for (let row = 0; row < numRows; row++) {
    const nextRow = grid[row]!;
    for (let col = 0; col < numCols; col++) {
      const nextCell = nextRow[col]!;
      if (ANTENNA_REGEX.test(nextCell)) {
        const cellPos = pointToString({ col, row });
        const currentAntennae = antennas.get(nextCell) ?? [];
        antennas.set(nextCell, currentAntennae.concat([cellPos]));
      }
    }
  }

  return antennas;
};

const calculateAntinodes1 = (grid: string[], antennas: Antennas) => {
  const antinodes = new Set<string>();

  for (const nextFrequency of antennas.keys()) {
    const frequencyAntennas = antennas.get(nextFrequency)!;
    for (let i = 0; i < frequencyAntennas.length; i++) {
      const firstAntenna = stringToPoint(frequencyAntennas[i]!);
      for (let j = i + 1; j < frequencyAntennas.length; j++) {
        const secondAntenna = stringToPoint(frequencyAntennas[j]!);
        const pointDistances = { col: firstAntenna.col - secondAntenna.col, row: firstAntenna.row - secondAntenna.row };
        const firstAntinode: Point = {
          col: firstAntenna.col + pointDistances.col,
          row: firstAntenna.row + pointDistances.row,
        };
        const secondAntinode: Point = {
          col: secondAntenna.col - pointDistances.col,
          row: secondAntenna.row - pointDistances.row,
        };
        if (isPointWithinGrid({ grid, point: firstAntinode })) {
          antinodes.add(pointToString(firstAntinode));
        }

        if (isPointWithinGrid({ grid, point: secondAntinode })) {
          antinodes.add(pointToString(secondAntinode));
        }
      }
    }
  }

  return antinodes;
};

const addAntinodes: AddAntinodesFn = ({ antinodes, grid, startPos, vector }) => {
  const nextPos = { col: startPos.col + vector.col, row: startPos.row + vector.row };
  if (isPointWithinGrid({ grid, point: nextPos })) {
    antinodes.add(pointToString(nextPos));
    addAntinodes({ antinodes, grid, startPos: nextPos, vector });
  }
};

const calculateAntinodes2 = (grid: string[], antennas: Antennas) => {
  const antinodes = new Set<string>();

  for (const nextFrequency of antennas.keys()) {
    const frequencyAntennas = antennas.get(nextFrequency)!;
    // console.log(`\n***** Checking frequency ${nextFrequency} with antennas [${frequencyAntennas.join('],[')}]`);
    for (let i = 0; i < frequencyAntennas.length; i++) {
      const firstAntenna = stringToPoint(frequencyAntennas[i]!);
      for (let j = i + 1; j < frequencyAntennas.length; j++) {
        const secondAntenna = stringToPoint(frequencyAntennas[j]!);
        const pointVector = { col: firstAntenna.col - secondAntenna.col, row: firstAntenna.row - secondAntenna.row };

        antinodes.add(pointToString(firstAntenna));
        antinodes.add(pointToString(secondAntenna));
        addAntinodes({ antinodes, grid, startPos: secondAntenna, vector: pointVector });
        addAntinodes({
          antinodes,
          grid,
          startPos: secondAntenna,
          vector: { col: -pointVector.col, row: -pointVector.row },
        });
      }
    }
  }

  return antinodes;
};

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const grid = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0) as string[];

  const antennas = mapAntennas(grid);
  const antinodes = calculateAntinodes1(grid, antennas);

  logAnswer({
    answer: antinodes.size,
    expected: USE_TEST_DATA ? 14 : 336,
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
    .filter((line) => line.length > 0);

  const antennas = mapAntennas(grid);
  const antinodes = calculateAntinodes2(grid, antennas);

  logAnswer({
    answer: antinodes.size,
    expected: USE_TEST_DATA ? 34 : 1_131,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
