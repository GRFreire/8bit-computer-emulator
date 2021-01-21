import CPU from './cpu';
import createMemory from './createMemory';
import program from './program';

const memory = createMemory(256);
const writableBytes = new Uint8Array(memory.buffer);

program(writableBytes).then(() => {
  const cpu = new CPU(memory);
  cpu.run();
});
