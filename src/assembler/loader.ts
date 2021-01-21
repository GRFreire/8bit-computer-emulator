import { promises as fs } from 'fs';

export default async function loader(filePath: string): Promise<string[]> {
  const fileBuffer = await fs.readFile(filePath);
  const fileContent = fileBuffer.toString();

  const lines = fileContent.split('\n');

  return lines;
}
