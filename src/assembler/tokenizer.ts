export interface IToken {
  type: 'label' | 'set' | 'number' | 'name' | 'comment' | 'constant';
  value: string;
  position: number;
  line: number;
  end?: number;
}

const NUMBERS = /[0-9]/;
const LETTERS = /(?:[a-z])|(?:(?:_))/i;
const HEX_CHAR = /(?:[a-f])|(?:[0-9])/i;

export default function tokenizer(input: string, line: number): IToken[] {
  let current = 0;
  let negative = false;
  const tokens: IToken[] = [];

  if (!input) return tokens;
  while (current < input.length) {
    let char = input[current];

    if (char === ';') {
      tokens.push({
        line,
        type: 'comment',
        value: ';',
        position: current,
      });

      current++;

      continue;
    }

    if (char === '#') {
      tokens.push({
        line,
        type: 'constant',
        value: '#',
        position: current,
      });

      current++;

      continue;
    }

    if (char === '@') {
      tokens.push({
        line,
        type: 'label',
        value: '@',
        position: current,
      });

      current++;

      continue;
    }

    if (char === ':') {
      tokens.push({
        line,
        type: 'set',
        value: ':',
        position: current,
      });
      current++;
      continue;
    }

    if (char === '-') {
      negative = true;
      current++;
      continue;
    }

    if (char === ' ') {
      current++;
      continue;
    }

    if (NUMBERS.test(char) && input[current + 1] === 'x') {
      char = input[++current];
      char = input[++current];

      const position = current;
      let value = '';

      while (HEX_CHAR.test(char)) {
        if (!char) {
          current++;
          break;
        }

        value += char;
        char = input[++current];
      }

      const parsedNumber = parseInt(`0x${value}`, 16);

      tokens.push({
        line,
        type: 'number',
        value: negative ? String(-parsedNumber) : String(parsedNumber),
        position,
        end: current,
      });

      negative = false;
      continue;
    }

    if (NUMBERS.test(char)) {
      const position = current;
      let value = '';

      while (NUMBERS.test(char)) {
        if (!char) {
          current++;
          break;
        }

        value += char;
        char = input[++current];
      }

      tokens.push({
        line,
        type: 'number',
        value: negative ? String(-Number(value)) : value,
        position,
        end: current,
      });

      negative = false;
      continue;
    }

    if (LETTERS.test(char)) {
      const position = current;
      let value = '';

      while (LETTERS.test(char)) {
        if (!char) {
          current++;
          break;
        }

        value += char;
        char = input[++current];
      }

      tokens.push({
        line,
        type: 'name',
        value,
        position,
        end: current,
      });

      continue;
    }

    current++;
    continue;
  }

  return tokens;
}
