import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

type ReadDataFunction = (options: { importUrl: string; useTestData: boolean }) => string[];

export const readData: ReadDataFunction = ({ importUrl, useTestData }) => {
  const sourceFilename = url.fileURLToPath(importUrl);
  const sourceDirectory = path.dirname(sourceFilename);
  const dataFilename = useTestData ? 'test-data.txt' : 'data.txt';
  const dataPath = path.join(sourceDirectory, dataFilename);

  const untypedData = fs.readFileSync(dataPath, 'utf8');
  const data = untypedData as string;

  return data.split('\n');
};
