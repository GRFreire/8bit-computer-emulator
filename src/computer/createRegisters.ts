import createMemory from './createMemory';

interface IRegistersAddresses {
  [key: string]: number;
}

export interface IRegistersOperations {
  get: (name: string) => number;
  set: (name: string, value: number) => void;
}

export default function createRegisters(
  registersName: string[],
): IRegistersOperations {
  const registers = createMemory(registersName.length * 2);

  const registersAddresses = registersName.reduce((addresses, name, i) => {
    const newAddresses = { ...addresses, [name]: i * 2 };
    return newAddresses;
  }, {} as IRegistersAddresses);

  function get(name: string): number {
    if (!(name in registersAddresses)) {
      throw new Error(`getRegister: No such register ${name}.`);
    }

    return registers.getUint8(registersAddresses[name]);
  }

  function set(name: string, value: number) {
    if (!(name in registersAddresses)) {
      throw new Error(`setRegister: No such register ${name}.`);
    }

    return registers.setUint8(registersAddresses[name], value);
  }

  return { get, set };
}
