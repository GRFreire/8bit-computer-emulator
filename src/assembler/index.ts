import path from 'path';

import AppError from './appError';
import tokenizer from './tokenizer';
import parser from './parser';
import loader from './loader';
import generateBytes from './generateBytes';
import save from './save';

interface IFlags {
  debug: boolean;

  [key: string]: boolean;
}

const flags: IFlags = {
  debug: false,
};

function checkFlags() {
  const args = process.argv;

  Object.keys(flags).forEach((flag: string) => {
    if (args.indexOf(`--${flag}`) !== -1) {
      flags[flag] = true;
    }
  });
}

function debug(lineCodes: string[], bytes: number[]) {
  lineCodes.forEach((line, i) => {
    console.log(line, bytes[i * 2], bytes[i * 2 + 1]);
  });
}

async function run() {
  try {
    const lines = await loader(
      path.resolve(__dirname, '..', 'code', 'code.asm'),
    );
    const lineTokens = lines
      .map((line, i) => tokenizer(line, i))
      .filter(line => {
        if (line.length < 1) return false;
        if (line[0].type === 'comment') return false;
        return true;
      });

    const lineCodes = parser(lineTokens);
    const bytes = generateBytes(lineCodes);
    const size = await save(
      path.resolve(__dirname, '..', 'code', 'code.out'),
      bytes,
    );

    console.log(
      `${'\x1b[32m'}Successfully compiled! Your program size is ${size} bytes.${'\x1b[0m'}`,
    );

    if (flags.debug) debug(lineCodes, bytes);
  } catch (error) {
    console.log('\x1b[31m');
    if (error instanceof AppError) {
      console.log(`ERROR ${error.message}`);
    } else if (flags.debug) {
      console.log(`Error: ${error.message}`);
    } else {
      console.log(`An error occurred`);
    }
    console.log('\x1b[0m');
  }
}

checkFlags();
run();
