import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

type GetDataForPuzzleFn = (importUrl: string) => { REAL: string; TEST1: string; TEST2: string };

const THIS_FILE = url.fileURLToPath(import.meta.url);
const THIS_DIR = path.dirname(THIS_FILE);
const INPUTS_ROOTDIR = path.resolve(THIS_DIR, '../../inputs');

export const getDataForPuzzle: GetDataForPuzzleFn = (importUrl) => {
  // Work out where to get the puzzle inputs
  const puzzleFilename = url.fileURLToPath(importUrl);
  const puzzleDirNum = path.dirname(puzzleFilename).split(path.sep).at(-1)!;
  const inputsFolder = path.join(INPUTS_ROOTDIR, puzzleDirNum);
  const paths = {
    DATA: path.join(inputsFolder, 'data.txt'),
    TEST_DATA_01: path.join(inputsFolder, 'test-data-01.txt'),
    TEST_DATA_02: path.join(inputsFolder, 'test-data-02.txt'),
  };

  return {
    REAL: fs.readFileSync(paths.DATA, 'utf8') as string,
    TEST1: fs.readFileSync(paths.TEST_DATA_01, 'utf8') as string,
    TEST2: fs.readFileSync(paths.TEST_DATA_02, 'utf8') as string,
  };
};
