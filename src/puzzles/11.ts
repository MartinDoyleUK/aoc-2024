import { getDataForPuzzle, logAnswer } from '../utils/index.js';

type BlinkResult = number[];

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

const memoisedTransforms = new Map<number, BlinkResult>();
const blinkStone = (stone: number): BlinkResult => {
  if (memoisedTransforms.has(stone)) {
    return memoisedTransforms.get(stone)!;
  }

  let result: BlinkResult;
  if (stone === 0) {
    result = [1];
  } else if (Math.floor(Math.log10(stone)) % 2 === 1) {
    const stoneAsString = `${stone}`;
    const firstNewStone = stoneAsString.slice(0, stoneAsString.length / 2);
    const secondNewStone = stoneAsString.slice(stoneAsString.length / 2);
    result = [Number(firstNewStone), Number(secondNewStone)];
  } else {
    result = [stone * 2_024];
  }

  memoisedTransforms.set(stone, result);
  return result;
};

const countBlinkingStones = (stones: number[], numBlinks: number): number => {
  let stoneCounts = new Map(stones.map((nextStone) => [nextStone, 1]));
  for (let i = 0; i < numBlinks; i++) {
    const nextCounts = new Map<number, number>();
    for (const [nextStone, nextStoneCount] of stoneCounts.entries()) {
      const result = blinkStone(nextStone);
      for (const nextNewStone of result) {
        const currCount = nextCounts.get(nextNewStone) ?? 0;
        nextCounts.set(nextNewStone, currCount + nextStoneCount);
      }
    }

    stoneCounts = nextCounts;
    // console.log(stoneCounts);
  }

  return stoneCounts.values().reduce((prev, next) => prev + next, 0);
};

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const stones = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 0)!
    .split(' ')
    .map(Number);

  const totalStones = countBlinkingStones(stones, 25);

  logAnswer({
    answer: totalStones,
    expected: USE_TEST_DATA ? 55_312 : 190_865,
    partNum: 1,
    taskStartedAt,
  });
};

// Run task two
const runTwo = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST2 : data.REAL;
  const stones = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 0)!
    .split(' ')
    .map(Number);

  const totalStones = countBlinkingStones(stones, 75);

  logAnswer({
    answer: totalStones,
    // NOTE: Test answer derived after real answer was correct
    expected: USE_TEST_DATA ? 65_601_038_650_482 : 225_404_711_855_335,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
