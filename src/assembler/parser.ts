import AppError from './appError';

import { IToken } from './tokenizer';

interface IIterable {
  [key: string]: number;
}

function getFacilitators(lines: IToken[][]) {
  const labels: IIterable = {};
  const constants: IIterable = {};
  let actualLine = 0;

  for (let line = 0; line < lines.length; line++) {
    const tokens = lines[line];

    if (tokens[0].type === 'label') {
      if (tokens[1] && tokens[1].type === 'name') {
        if (tokens[2] && tokens[2].type === 'set') {
          labels[tokens[1].value] = actualLine * 2;
        } else {
          throw new AppError(
            `[LINE: ${
              tokens[0].line + 1
            }]: A set char (:) must be placed after defining a label.`,
          );
        }
      } else {
        throw new AppError(
          `[LINE: ${
            tokens[0].line + 1
          }]: A string must follow the label char (@).`,
        );
      }

      continue;
    }

    if (tokens[0].type === 'constant') {
      if (tokens[1] && tokens[1].type === 'name') {
        if (tokens[1].value === 'define') {
          if (tokens[2] && tokens[2].type === 'name') {
            if (tokens[3] && tokens[3].type === 'number') {
              constants[tokens[2].value] = Number(tokens[3].value);
            } else {
              throw new AppError(
                `[LINE: ${
                  tokens[0].line + 1
                }]: The constant value should be a number.`,
              );
            }
          } else {
            throw new AppError(
              `[LINE: ${
                tokens[0].line + 1
              }]: You must name your constant when defining it with "#define".`,
            );
          }
        } else {
          throw new AppError(
            `[LINE: ${
              tokens[0].line + 1
            }]: After the constant char (#) must be placed the "define" string.`,
          );
        }
      } else {
        throw new AppError(
          `[LINE: ${
            tokens[0].line + 1
          }]: After the constant char (#) must be placed the "define" string.`,
        );
      }

      continue;
    }

    actualLine++;
  }

  return { labels, constants };
}

export default function parser(lines: IToken[][]): string[] {
  const { labels, constants } = getFacilitators(lines);
  const codeLines = [];

  for (let line = 0; line < lines.length; line++) {
    const tokens = lines[line];

    if (tokens[0].type === 'label' || tokens[0].type === 'constant') {
      continue;
    }

    if (tokens[0].type === 'name') {
      if (!tokens[1] || tokens[1].type === 'comment') {
        codeLines.push(`${tokens[0].value} 0`);
        continue;
      }

      if (tokens[1].type === 'number') {
        codeLines.push(`${tokens[0].value} ${tokens[1].value}`);
        continue;
      }

      if (tokens[1].type === 'label') {
        if (tokens[2] && tokens[2].type === 'name') {
          if (labels[tokens[2].value] === undefined) {
            throw new AppError(
              `[LINE: ${tokens[0].line + 1}]: The label "${
                tokens[2].value
              }" does not exists`,
            );
          }
          codeLines.push(`${tokens[0].value} ${labels[tokens[2].value]}`);
        } else {
          throw new AppError(
            `[LINE: ${
              tokens[0].line + 1
            }]: You must refer to a variable after using the label char (@).`,
          );
        }
        continue;
      }

      if (tokens[1].type === 'name') {
        if (constants[tokens[1].value] === undefined) {
          throw new AppError(
            `[LINE: ${tokens[0].line + 1}]: The label "${
              tokens[1].value
            }" does not exists`,
          );
        }
        codeLines.push(`${tokens[0].value} ${constants[tokens[1].value]}`);
        continue;
      }
    }
  }

  return codeLines;
}
