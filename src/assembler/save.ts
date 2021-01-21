import { promises as fs } from 'fs';

export default async function save(
  path: string,
  bytes: number[],
): Promise<number> {
  const uint8array = Uint8Array.from(bytes);
  fs.writeFile(path, uint8array);

  return uint8array.length;
}
