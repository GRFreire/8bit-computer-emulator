import { promises as fs } from 'fs';

import AppError from './appError';

export default async function loader(filePath: string): Promise<string[]> {
  try {
    const fileBuffer = await fs.readFile(filePath);
    const fileContent = fileBuffer.toString();

    const lines = fileContent.split('\n');

    return lines;
  } catch (error) {
    throw new AppError('Assembly program was not found');
  }
}
