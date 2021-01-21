export default function createMemory(sizeInBytes: number): DataView {
  const arrayBuffer = new ArrayBuffer(sizeInBytes);
  const dataView = new DataView(arrayBuffer);
  return dataView;
}
