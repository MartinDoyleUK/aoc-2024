import { getDataForPuzzle, logAnswer } from '../utils/index.js';

import { File } from './puzzle-helpers/09/index.js';

type DiskBlocks = (File | undefined)[];

type Gaps = { offset: number; size: number }[];

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

const layOutDisk = (diskMap: string): { blocks: DiskBlocks; files: File[]; gaps: Gaps } => {
  const blocks: DiskBlocks = [];
  const files: File[] = [];
  const gaps: Gaps = [];

  for (let i = 0; i < diskMap.length; i++) {
    const fileSize = Number(diskMap[i++]);
    const nextFile = new File({ offset: blocks.length, size: fileSize });
    const fileBlocks = nextFile.blocks;

    files.push(nextFile);
    blocks.push(...fileBlocks);

    // No final gap size (data always has odd number of chars)
    if (i < diskMap.length) {
      const gapSize = Number(diskMap[i]);
      const nextGaps = Array.from<undefined>({ length: gapSize }).fill(undefined);
      gaps.push({ offset: blocks.length, size: gapSize });
      blocks.push(...nextGaps);
    }
  }

  return { blocks, files, gaps };
};

const calculateChecksum = (diskBlocks: DiskBlocks): number => {
  let checksum = 0;
  for (let i = 0; i < diskBlocks.length; i++) {
    const nextFile = diskBlocks[i]!;
    checksum += i * (nextFile?.id ?? 0);
  }

  return checksum;
};

// Export only to stop complaining about being unused
export const logDiskBlocks = (diskBlocks: DiskBlocks) => {
  const diskBlocksStr = diskBlocks.map((nextBlock) => (nextBlock === undefined ? '.' : nextBlock!.id)).join('');
  // eslint-disable-next-line no-console
  console.log(`Disk blocks: ${diskBlocksStr}
`);
};

// Run task one
const runOne = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST1 : data.REAL;
  const diskMap = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 0)!;

  const { blocks } = layOutDisk(diskMap);
  // logDiskBlocks(blocks);

  for (let i = 0; i < blocks.length; i++) {
    const nextBlock = blocks[i]!;
    if (nextBlock !== undefined) {
      continue;
    }

    while (blocks.at(-1) === undefined) {
      blocks.pop();
    }

    blocks.splice(i, 1, blocks.pop());
  }

  // logDiskBlocks(blocks);

  const checksum = calculateChecksum(blocks);

  logAnswer({
    answer: checksum,
    expected: USE_TEST_DATA ? 1_928 : 6_435_922_584_968,
    partNum: 1,
    taskStartedAt,
  });
};

// Run task two
const runTwo = () => {
  const taskStartedAt = performance.now();
  const dataToUse = USE_TEST_DATA ? data.TEST2 : data.REAL;
  const diskMap = dataToUse
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 0)!;

  // Necessary to reset to zero for second use case
  File.resetIdCounter();

  const { blocks, files, gaps } = layOutDisk(diskMap);
  // logDiskBlocks(blocks);

  let nextFile: File | undefined;
  while ((nextFile = files.pop())) {
    for (const nextGap of gaps) {
      if (nextGap.offset > nextFile.offset) {
        break;
      }

      if (nextFile.size <= nextGap.size) {
        const filledGaps = blocks.splice(nextGap.offset, nextFile.size, ...nextFile.blocks);
        blocks.splice(nextFile.offset, nextFile.size, ...filledGaps);

        nextGap.size -= nextFile.size;
        nextGap.offset += nextFile.size;
        break;
      }
    }
  }

  // logDiskBlocks(blocks);

  const checksum = calculateChecksum(blocks);

  logAnswer({
    answer: checksum,
    expected: USE_TEST_DATA ? 2_858 : 6_469_636_832_766,
    partNum: 2,
    taskStartedAt,
  });
};

// Export a function to run both tasks
export const runTasks = () => {
  runOne();
  runTwo();
};
