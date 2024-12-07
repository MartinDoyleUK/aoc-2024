import { getDataForPuzzle, logAnswer } from '../utils/index.js';

type Equation = {
  operands: number[];
  result: number;
};

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

const canMakeResult = (result: number, operands: number[], runningTotal?: number): boolean => {
  const nextOperand = operands[0]!;
  const remaining = operands.slice(1);

  // Need two operands to make something
  if (runningTotal === undefined) {
    return canMakeResult(result, remaining, nextOperand);
  }

  // If this is the last operand, get the final result
  if (remaining.length === 0) {
    return runningTotal + nextOperand === result || runningTotal * nextOperand === result;
  }

  // Fail if results are too large already
  const added = runningTotal + nextOperand;
  const multiplied = runningTotal * nextOperand;
  if (added > result && multiplied > result) {
    return false;
  }

  // Finally pass down the chain
  const canMake = canMakeResult(result, remaining, added) || canMakeResult(result, remaining, multiplied);

  // Pass the final result back
  return canMake;
};

const canMakeResult2 = (result: number, operands: number[], runningTotal?: number): boolean => {
  const nextOperand = operands[0]!;
  const remaining = operands.slice(1);

  // Need two operands to make something
  if (runningTotal === undefined) {
    return canMakeResult2(result, remaining, nextOperand);
  }

  // Check all operators
  const added = runningTotal + nextOperand;
  const multiplied = runningTotal * nextOperand;
  const concatenated = Number.parseInt(`${runningTotal}${nextOperand}`, 10);

  // If this is the last operand, get the final result
  if (remaining.length === 0) {
    return added === result || multiplied === result || concatenated === result;
  }

  // Fail if results are too large already
  if (added > result && multiplied > result && concatenated > result) {
    return false;
  }

  // Finally pass down the chain
  const canMake =
    canMakeResult2(result, remaining, added) ||
    canMakeResult2(result, remaining, multiplied) ||
    canMakeResult2(result, remaining, concatenated);

  // Pass the final result back
  return canMake;
};

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const lines = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const equations = lines.map<Equation>((nextLine) => {
    const [resultStr, operandsStr] = nextLine.split(': ') as [string, string];
    const result = Number.parseInt(resultStr, 10);
    const operands = operandsStr.split(' ').map((nextStr) => Number.parseInt(nextStr, 10));
    return { operands, result };
  });

  let summedResults = 0;
  for (const { operands, result } of equations) {
    if (canMakeResult(result, operands)) {
      summedResults += result;
    }
  }

  logAnswer({
    answer: summedResults,
    expected: USE_TEST_DATA ? 3_749 : 1_153_997_401_072,
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

  const equations = lines.map<Equation>((nextLine) => {
    const [resultStr, operandsStr] = nextLine.split(': ') as [string, string];
    const result = Number.parseInt(resultStr, 10);
    const operands = operandsStr.split(' ').map((nextStr) => Number.parseInt(nextStr, 10));
    return { operands, result };
  });

  let summedResults = 0;
  for (const { operands, result } of equations) {
    if (canMakeResult2(result, operands)) {
      summedResults += result;
    }
  }

  logAnswer({
    answer: summedResults,
    expected: USE_TEST_DATA ? 11_387 : 97_902_809_384_118,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
