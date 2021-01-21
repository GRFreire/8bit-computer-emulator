import createRegisters, { IRegistersOperations } from './createRegisters';
import * as instructions from './instructions';

class CPU {
  public CLOCK = 50;

  private memory: DataView;

  private registers: IRegistersOperations;

  constructor(memory: DataView) {
    this.memory = memory;

    this.registers = createRegisters(['PC', 'SP', 'A', 'B', 'SUM', 'C', 'Z']);

    this.registers.set('SP', this.memory.byteLength - 1 - 1);
  }

  private fetch() {
    const nextInstructionAddress = this.registers.get('PC');
    const instruction = this.memory.getUint8(nextInstructionAddress);
    this.registers.set('PC', nextInstructionAddress + 1);
    return instruction;
  }

  private push(value: number) {
    const stackAddress = this.registers.get('SP');
    this.memory.setUint8(stackAddress, value);
    this.registers.set('SP', stackAddress - 1);
  }

  private pop() {
    const stackAddress = this.registers.get('SP') + 1;
    const value = this.memory.getUint8(stackAddress);
    this.registers.set('SP', stackAddress);

    return value;
  }

  private execute(instruction: number) {
    switch (instruction) {
      case instructions.NOP: {
        this.fetch();
        return false;
      }
      case instructions.LDA: {
        const address = this.fetch();
        const value = this.memory.getUint8(address);
        this.registers.set('A', value);
        return false;
      }
      case instructions.ADD: {
        const address = this.fetch();
        const value = this.memory.getUint8(address);
        this.registers.set('B', value);

        const A = this.registers.get('A');
        const B = value;
        const SUM = A + B;

        this.registers.set('SUM', SUM);
        this.registers.set('A', SUM);

        // Set Carry Flag
        if (SUM > 2 ** (8 - 1) - 1) this.registers.set('C', 1);
        else this.registers.set('C', 0);

        // Set Zero Flag
        if (SUM === 0) this.registers.set('Z', 1);
        else this.registers.set('Z', 0);

        return false;
      }
      case instructions.SUB: {
        const address = this.fetch();
        const value = this.memory.getUint8(address);
        this.registers.set('B', value);

        const A = this.registers.get('A');
        const B = value;
        const SUM = A - B;

        // Set Zero Flag
        if (SUM === 0) this.registers.set('Z', 1);
        else this.registers.set('Z', 0);

        this.registers.set('SUM', SUM);
        this.registers.set('A', SUM);
        return false;
      }
      case instructions.STA: {
        const address = this.fetch();
        const value = this.registers.get('A');

        this.memory.setUint8(address, value);
        return false;
      }
      case instructions.LDI: {
        const value = this.fetch();

        this.registers.set('A', value);
        return false;
      }
      case instructions.JMP: {
        const address = this.fetch();

        this.registers.set('PC', address);
        return false;
      }
      case instructions.JCF: {
        const address = this.fetch();

        const shouldJump = this.registers.get('C');

        if (shouldJump) this.registers.set('PC', address);

        return false;
      }
      case instructions.JZF: {
        const address = this.fetch();

        const shouldJump = this.registers.get('Z');

        if (shouldJump) this.registers.set('PC', address);

        return false;
      }
      case instructions.PSH: {
        this.fetch();

        const value = this.registers.get('A');
        this.push(value);

        return false;
      }
      case instructions.POP: {
        this.fetch();
        const value = this.pop();

        this.registers.set('A', value);

        return false;
      }
      case instructions.JSR: {
        const address = this.fetch();

        this.push(this.registers.get('PC'));
        this.registers.set('PC', address);

        return false;
      }
      case instructions.RET: {
        this.fetch();
        this.registers.set('PC', this.pop());

        return false;
      }
      case instructions.OUT: {
        const byteSize = 8;

        this.fetch();

        const A = this.registers.get('A');
        const OUT = A > 2 ** (byteSize - 1) ? A - 2 ** byteSize : A;

        console.log(`dec: ${OUT} bin: ${A.toString(2)}`);
        return false;
      }
      case instructions.HLT: {
        this.fetch();
        return true;
      }
      default: {
        throw new Error(`execute: No such instruction ${instruction}.`);
      }
    }
  }

  public step(): boolean {
    const instruction = this.fetch();
    return this.execute(instruction);
  }

  public async run(): Promise<void> {
    let hlt = false;
    while (!hlt) {
      hlt = this.step();
      await new Promise(res => setTimeout(res, (1 / this.CLOCK) * 1000));
    }
  }
}

export default CPU;
