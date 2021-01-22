import path from 'path';
import { promises as fs } from 'fs';

export default async function program(
  writableBytes: Uint8Array,
): Promise<void> {
  try {
    const buffer = await fs.readFile(
      path.resolve(__dirname, '..', 'code', 'code.out'),
    );

    const bytes = new Uint8Array(buffer);

    bytes.forEach((value, i) => {
      writableBytes[i] = value;
    });
  } catch {
    throw new Error(
      `${'\x1b[31m'}Binary program was not found. Try compiling it first${'\x1b[0m'}`,
    );
  }
}
