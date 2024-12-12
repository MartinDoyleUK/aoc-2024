import {
  getDataForPuzzle,
  type Grid,
  type GridRef,
  gridRefToPoint,
  isWithinGrid,
  logAnswer,
  type Point,
  pointToGridRef,
  type Vector,
} from '../utils/index.js';

type AddAntinodesFn = (params: { antinodes: Set<Point>; grid: Grid<string>; startPos: Point; vector: Vector }) => void;

type Antennas = Map<string, Point[]>;

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

const ANTENNA_REGEX = /^[A-Za-z0-9]$/u;

const mapAntennas = (grid: Grid<string>): Antennas => {
  const antennas = new Map<string, Point[]>();
  const numRows = grid.length;
  const numCols = grid[0]!.length;

  for (let row = 0; row < numRows; row++) {
    const nextRow = grid[row]!;
    for (let col = 0; col < numCols; col++) {
      const nextCell = nextRow[col]!;
      if (ANTENNA_REGEX.test(nextCell)) {
        const cellPos = gridRefToPoint({ col, row });
        const currentAntennae = antennas.get(nextCell) ?? [];
        antennas.set(nextCell, currentAntennae.concat([cellPos]));
      }
    }
  }

  return antennas;
};

const calculateAntinodes1 = (grid: Grid<string>, antennas: Antennas) => {
  const antinodes = new Set<Point>();

  for (const nextFrequency of antennas.keys()) {
    const frequencyAntennas = antennas.get(nextFrequency)!;
    for (let i = 0; i < frequencyAntennas.length; i++) {
      const firstAntenna = pointToGridRef(frequencyAntennas[i]!);
      for (let j = i + 1; j < frequencyAntennas.length; j++) {
        const secondAntenna = pointToGridRef(frequencyAntennas[j]!);
        const pointDistances = { col: firstAntenna.col - secondAntenna.col, row: firstAntenna.row - secondAntenna.row };
        const firstAntinode: GridRef = {
          col: firstAntenna.col + pointDistances.col,
          row: firstAntenna.row + pointDistances.row,
        };
        const secondAntinode: GridRef = {
          col: secondAntenna.col - pointDistances.col,
          row: secondAntenna.row - pointDistances.row,
        };
        if (isWithinGrid(firstAntinode, grid)) {
          antinodes.add(gridRefToPoint(firstAntinode));
        }

        if (isWithinGrid(secondAntinode, grid)) {
          antinodes.add(gridRefToPoint(secondAntinode));
        }
      }
    }
  }

  return antinodes;
};

const addAntinodes: AddAntinodesFn = ({ antinodes, grid, startPos, vector }) => {
  const { col: startCol, row: startRow } = pointToGridRef(startPos);
  const nextPos = { col: startCol + vector.col, row: startRow + vector.row };
  if (isWithinGrid(nextPos, grid)) {
    antinodes.add(gridRefToPoint(nextPos));
    addAntinodes({ antinodes, grid, startPos: gridRefToPoint(nextPos), vector });
  }
};

const calculateAntinodes2 = (grid: Grid<string>, antennas: Antennas) => {
  const antinodes = new Set<Point>();

  for (const nextFrequency of antennas.keys()) {
    const frequencyAntennas = antennas.get(nextFrequency)!;
    // console.log(`\n***** Checking frequency ${nextFrequency} with antennas [${frequencyAntennas.join('],[')}]`);
    for (let i = 0; i < frequencyAntennas.length; i++) {
      const firstAntenna = pointToGridRef(frequencyAntennas[i]!);
      for (let j = i + 1; j < frequencyAntennas.length; j++) {
        const secondAntenna = pointToGridRef(frequencyAntennas[j]!);
        const pointVector = { col: firstAntenna.col - secondAntenna.col, row: firstAntenna.row - secondAntenna.row };

        antinodes.add(gridRefToPoint(firstAntenna));
        antinodes.add(gridRefToPoint(secondAntenna));
        addAntinodes({ antinodes, grid, startPos: gridRefToPoint(secondAntenna), vector: pointVector });
        addAntinodes({
          antinodes,
          grid,
          startPos: gridRefToPoint(secondAntenna),
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
    .map((line) => line.trim().split(''))
    .filter((row) => row.length > 0) as Grid<string>;

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
    .map((line) => line.trim().split(''))
    .filter((row) => row.length > 0) as Grid<string>;

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
