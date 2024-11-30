type FindTransitionByIndexArgs = {
  lower: number;
  predicate: (index: number) => boolean;
  upper: number;
};

type FindTransitionByIndexFunction = (args: FindTransitionByIndexArgs) => number | undefined;

/**
 * Find the mid-point of a range, i.e. the next candidate for a binary search
 * @param {number} start The start of the range to be considered
 * @param {number} end The end of the range to be considered
 * @returns {number} The mid-point of the range
 * @throws Will throw an error if the range is invalid (e.g. start above end, or undefined values)
 */
export const getBinaryCandidate = (start: number, end: number) => {
  if (start === undefined || end === undefined || start > end) {
    throw new Error(`Range invalid (start=${start}, end=${end})`);
  }

  return Math.floor((start + end) / 2);
};

export const findTransitionPoint = (array: Array<0 | 1>, length: number) => {
  // Initialise lower and upper bounds
  let start = 0;
  let end = length - 1;

  // Perform Binary search
  while (start <= end) {
    // Find pointer
    // const pointer = Number.parseInt((start + end) / 2, 10);
    const pointer = Math.floor((start + end) / 2);
    const predicateIsFalse = array[pointer] === 0;

    // update lower_bound if pointer contains 0
    if (predicateIsFalse) {
      start = pointer + 1;
    } else {
      // Check if it is the left most 1
      // Return pointer, if yes
      if (pointer === 0 || (pointer > 0 && array[pointer - 1] === 0)) {
        return pointer;
      }

      // Else update upper_bound
      end = pointer - 1;
    }
  }

  return -1;
};

/**
 * Find the point of transition between a predicate being false (lower half) and true (upper half) of a range.
 * @param {object} arg - Arguments object
 * @param {string} arg.lower - The index of the start of the range to be analysed
 * @param {string} arg.upper - The index of the end of the range to be analysed
 * @param {string} arg.predicate - A function that takes an index and returns false before the transition point and true after it
 * @returns {number} The first index for which the predicate returns true or undefined if there's no transition found
 */
export const findTransitionByIndex: FindTransitionByIndexFunction = ({ lower, predicate, upper }) => {
  let start = lower;
  let end = upper;

  let transition: number | undefined;
  let pointer: number;
  while (start <= end) {
    pointer = getBinaryCandidate(start, end);
    if (predicate(pointer)) {
      transition = pointer;
      end = pointer - 1;
    } else {
      start = pointer + 1;
    }
  }

  return transition;
};

export const memoize = <Args, Result>(
  functionToMemoize: (argsObject: Args) => Result,
  countExecutions = false,
): ((argsObject: Args) => Result) => {
  const resultsMap = new Map<string, Result>();
  const argumentCounts = new Map<string, number>();

  const memoized = (argsObject: Args) => {
    const argsString = JSON.stringify(argsObject);
    if (!resultsMap.has(argsString)) {
      resultsMap.set(argsString, functionToMemoize(argsObject));
    }

    if (countExecutions) {
      const existingCount = argumentCounts.get(argsString) ?? 0;
      argumentCounts.set(argsString, existingCount + 1);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return resultsMap.get(argsString)!;
  };

  Object.assign(memoized, {
    getCounts: () => argumentCounts,
  });

  return memoized;
};
