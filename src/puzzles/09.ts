import { getDataForPuzzle, logAnswer } from '../utils/index.js';

import { File } from './puzzle-helpers/09/index.js';

type DiskBlocks = (File | undefined)[];

type Gap = { offset: number; size: number };

// Toggle this to use test or real data
const USE_TEST_DATA = false;

// Load data from files
const data = getDataForPuzzle(import.meta.url);

const layOutDisk = (diskMap: string): { blocks: DiskBlocks; files: File[]; gaps: Gap[] } => {
  const blocks: DiskBlocks = [];
  const files: File[] = [];
  const gaps: Gap[] = [];

  for (let i = 0; i < diskMap.length; i++) {
    const fileSize = Number(diskMap[i++]);
    const nextFile = new File({ size: fileSize, startingOffset: blocks.length });
    const fileBlocks = nextFile.blocks;

    files.push(nextFile);
    blocks.push(...fileBlocks);

    // No final gap size (data always has odd number of chars)
    if (i < diskMap.length) {
      const gapSize = Number(diskMap[i]);
      if (gapSize > 0) {
        const nextGaps = Array.from<undefined>({ length: gapSize }).fill(undefined);
        gaps.push({ offset: blocks.length, size: gapSize });
        blocks.push(...nextGaps);
      }
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
  console.log(`Disk blocks: ${diskBlocksStr}`);
};

// Export only to stop complaining about being unused
export const logGaps = (gaps: Gap[]) => {
  const gapsStr = gaps.map(({ offset, size }) => `${offset}(${size})`).join(' ');
  // eslint-disable-next-line no-console
  console.log(`Gaps: ${gapsStr}`);
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
  // logGaps(gaps);

  let nextFile: File | undefined;
  while ((nextFile = files.pop())) {
    for (let i = 0; i < gaps.length; i++) {
      const nextGap = gaps[i]!;
      if (nextGap.offset > nextFile.startingOffset) {
        break;
      }

      if (nextFile.size <= nextGap.size) {
        const filledGaps = blocks.splice(nextGap.offset, nextFile.size, ...nextFile.blocks);
        blocks.splice(nextFile.startingOffset, nextFile.size, ...filledGaps);

        // Add back in the new gap, joining if necessary!
        let newGap = { offset: nextFile.startingOffset, size: nextFile.size };
        for (let j = i; j < gaps.length; j++) {
          const nextCandidateGap = gaps[j]!;
          if (nextCandidateGap.offset > nextFile.startingOffset) {
            gaps.splice(j, 0, newGap);
            const afterGap = gaps[j + 1];
            if (afterGap && newGap.offset + newGap.size === afterGap.offset) {
              newGap = { offset: newGap.offset, size: newGap.size + afterGap.size };
              gaps.splice(j, 2, newGap);
            }

            const beforeGap = gaps[j - 1];
            if (beforeGap && beforeGap.offset + beforeGap.size === newGap.offset) {
              gaps.splice(j - 1, 2, { offset: beforeGap.offset, size: beforeGap.size + newGap.size });
            }

            break;
          }
        }

        nextGap.size -= nextFile.size;
        nextGap.offset += nextFile.size;
        if (nextGap.size === 0) {
          gaps.splice(i, 1);
        }

        // logDiskBlocks(blocks);
        // logGaps(gaps);

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
