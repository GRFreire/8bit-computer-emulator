# The Assembly Language Spec

See an example program [here](example.md)

## Comments
Comments are indicated by a `;` char. It can be placed at the beginning of the line or after some instruction.
```
; this is a comment
HLT ; this is also a comment
```

## Labels
Labels, or named addresses, are placeholders for memory addresses that will be determined at compile time.
```
@loop: ; define the label
ADD 0x7f
OUT
JMP @loop ; jump to the label address
```

## Constants
Constants are named numbers value defined in the assembly and replaced when compiled.
```
#define valueAddress 0x7f ; define value 0x7f to constant valueAddress

LDI 10
STA valueAddress ; uses the value defined above
```

## Numbers
Numbers are 8 bits signed integers, meaning that it can store from -128 to +127. Memory addresses are an exception and are stored as unsigned integers.

Numbers can be specified as decimal or hexadecimal prefixed by "`0x`".
```
LDI 10   ; dec number 10
LDI 0x0a ; hex number 10
```

## Flags
|FLAG |UPDATE_AT_INSTRUCTIONS|DESCRIPTION                                   |
|-----|----------------------|----------------------------------------------|
|CARRY|`ADD`                 |The result of the last operation carried a bit|
|ZERO |`ADD`, `SUB`          |The result of the last operation is zero      |

---

## Instructions

|INS|OP_CODE|ARG_TYPE|EXAMPLE                |DESCRIPTION                                                                                           |
|---|-------|-------|------------------------|------------------------------------------------------------------------------------------------------|
|NOP|0x00   |none   |`NOP`                   |The NOP instruction does nothing                                                                      |
|LDA|0x01   |address|`LDA 0x7f`              |Loads the value that is on the argument address to the A register                                         |
|ADD|0x02   |address|`ADD 0x7e`              |Sum the content of the argument address and the A register. Put the result on SUM and A registers     |
|SUB|0x03   |address|`SUB 0x7e`              |Subtract the content of the argument address and the A register. Put the result on SUM and A registers|
|STA|0x04   |address|`STA 0x7d`              |Store the A register value to the argument address                                                    |
|LDI|0x05   |value  |`LDI 0x7f`              |Put the argument value to the A register                                                              |
|JMP|0x06   |address|`JMP @label` or `JMP 15`|Set the PROGRAM_COUNTER register to the argument address, the execution will continue from there      |
|JCF|0x07   |address|`JCF @label` or `JCF 15`|Jump if the carry flag is set                                                                         |
|JZF|0x08   |address|`JZF @label` or `JZF 15`|Jump if the zero flag is set                                                                          |
|PSH|0x09   |none   |`PSH`                   |Push the value of the A register to the stack                                                         |
|POP|0x0a   |none   |`POP`                   |Pop the value of the stack and put to the A register                                                  |
|JSR|0x0b   |address|`JSR @label` or `JSR 15`|Jump to subroutine                                                                                    |
|RET|0x0c   |none   |`RET`                   |Return from subroutine and continue from where it was called                                          |
|OUT|0x7e   |none   |`OUT`                   |Log the value of the A register                                                                       |
|HLT|0x7f   |none   |`HLT`                   |Stop the clock                                                                                        |
