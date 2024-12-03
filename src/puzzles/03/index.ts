import { getDataForPuzzle, logAnswer } from '../../utils/index.js';

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const lines = dataToUse.split('\n').filter((line) => line.trim().length > 0);
  const regex = /mul\((\d+),(\d+)\)/gu;

  let total = 0;
  for (const line of lines) {
    const matches = line.matchAll(regex);
    for (const match of matches) {
      const [, operand1, operand2] = match;
      const result = Number.parseInt(operand1!, 10) * Number.parseInt(operand2!, 10);
      total += result;
    }
  }

  logAnswer({
    answer: total,
    expected: USE_TEST_DATA ? 161 : 161_289_189,
    partNum: 1,
    taskStartedAt,
  });
};

// Run task two
const runTwo = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST2 : data.REAL;
  const lines = dataToUse.split('\n').filter((line) => line.trim().length > 0);
  const regex = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/gu;

  let total = 0;
  let performMultiply = true;
  for (const line of lines) {
    const matches = line.matchAll(regex);
    for (const match of matches) {
      const [fullMatch, operand1, operand2] = match;
      if (fullMatch.startsWith('don')) {
        performMultiply = false;
      } else if (fullMatch.startsWith('do')) {
        performMultiply = true;
      } else if (performMultiply) {
        const result = Number.parseInt(operand1!, 10) * Number.parseInt(operand2!, 10);
        total += result;
      }
    }
  }

  logAnswer({
    answer: total,
    expected: USE_TEST_DATA ? 48 : 83_595_109,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
