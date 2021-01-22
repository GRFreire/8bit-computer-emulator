<p align="center">
 <a href="#project">Project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#assembler">Assembler</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#requirements">Requirements</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#how-to-use">How to use</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#license">License</a>
</p>

# 8 BIT COMPUTER EMULATOR

## Project
A zero dependency 8-bit computer emulator written in typescript.

* 1 general purpose register.
* 256 bytes of addressable memory.
* 15 instructions.

## Assembler
Convert your assembly code to binary.
See more about the assembly language spec [here](README/assembly.md).

Once you have your assembly code placed at `src/code/code.asm`, compile it running: `yarn assembler`.

The binary will be placed at `src/code/code.out`, which is the default location that the CPU will look for when loading the program.


## Requirements
* [NodeJS](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/)

## How to use

```sh
git clone https://github.com/GRFreire/8bit-computer-emulator.git # 1. Clone the repository
cd 8bit-computer-emulator

yarn # 2. Install the dev dependencies

yarn assembler # 3.  Compile your code

yarn start # 4. Run the emulator
```

## License

This project is under the MIT license. See the file [LICENSE](LICENSE) for more details.
