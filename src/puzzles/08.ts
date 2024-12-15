import { getDataForPuzzle, type Grid, linesToStringGrid, logAnswer, type Point, type Vector } from '../utils/index.js';

type AddAntinodesFn = (params: { antinodes: Set<string>; grid: Grid<string>; startPos: Point; vector: Vector }) => void;

type Antennas = Map<string, Point[]>;

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

const ANTENNA_REGEX = /^[A-Za-z0-9]$/u;

const mapAntennas = (grid: Grid<string>): Antennas => {
  const antennas = new Map<string, Point[]>();

  for (const { point, value } of grid) {
    if (ANTENNA_REGEX.test(value)) {
      const currentAntennae = antennas.get(value) ?? [];
      antennas.set(value, currentAntennae.concat([point]));
    }
  }

  return antennas;
};

const calculateAntinodes1 = (grid: Grid<string>, antennas: Antennas): Set<string> => {
  const antinodes = new Set<string>();

  for (const nextFrequency of antennas.keys()) {
    const thisFrequencyAntennas = antennas.get(nextFrequency)!;
    for (let i = 0; i < thisFrequencyAntennas.length; i++) {
      const firstAntenna = thisFrequencyAntennas[i]!;
      for (let j = i + 1; j < thisFrequencyAntennas.length; j++) {
        const secondAntenna = thisFrequencyAntennas[j]!;
        const vector = firstAntenna.getVectorTo(secondAntenna);
        const firstAntinode = firstAntenna.applyVector(vector, true);
        const secondAntinode = secondAntenna.applyVector(vector);

        if (grid.boundsContain(firstAntinode)) {
          antinodes.add(firstAntinode.toString());
        }

        if (grid.boundsContain(secondAntinode)) {
          antinodes.add(secondAntinode.toString());
        }
      }
    }
  }

  return antinodes;
};

const addAntinodes: AddAntinodesFn = ({ antinodes, grid, startPos, vector }) => {
  const nextPos = startPos.applyVector(vector);
  if (grid.boundsContain(nextPos)) {
    antinodes.add(nextPos.toString());
    addAntinodes({ antinodes, grid, startPos: nextPos, vector });
  }
};

const calculateAntinodes2 = (grid: Grid<string>, antennas: Antennas): Set<string> => {
  const antinodes = new Set<string>();

  for (const nextFrequency of antennas.keys()) {
    const frequencyAntennas = antennas.get(nextFrequency)!;
    for (let i = 0; i < frequencyAntennas.length; i++) {
      const firstAntenna = frequencyAntennas[i]!;
      for (let j = i + 1; j < frequencyAntennas.length; j++) {
        const secondAntenna = frequencyAntennas[j]!;
        const vector = firstAntenna.getVectorTo(secondAntenna);

        antinodes.add(firstAntenna.toString());
        antinodes.add(secondAntenna.toString());
        addAntinodes({ antinodes, grid, startPos: secondAntenna, vector });
        addAntinodes({
          antinodes,
          grid,
          startPos: secondAntenna,
          vector: vector.invert(),
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
  const lines = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .filter((row) => row.length > 0);
  const grid = linesToStringGrid(lines);

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
  const lines = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .filter((row) => row.length > 0);
  const grid = linesToStringGrid(lines);

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
