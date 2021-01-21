import * as instructions from '../computer/instructions';

interface IGeneralInstructions {
  [key: string]: number;
}

export default function generateBytes(lineCodes: string[]): number[] {
  return lineCodes.reduce<number[]>((arr, codeLine) => {
    const [rawIns, arg]: string[] = codeLine.split(' ');
    const ins = rawIns.toUpperCase();

    let newInstruction: number;
    if (
      Object.keys(instructions).findIndex(
        instruction => instruction === ins,
      ) !== -1
    ) {
      const generalInstructions = instructions as IGeneralInstructions;
      newInstruction = generalInstructions[ins];
    } else {
      console.log(`Instruction not found: ${ins}`);
      newInstruction = instructions.NOP;
    }
    arr.push(newInstruction);
    arr.push(Number(arg));

    return arr;
  }, []);
}
