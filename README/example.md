# Example program

This program will count from 0 to 128 and then down to 0 again.

```asm
#define one 0x7f

JMP @setup

@setup:
; Store 1 to address "one"
LDI 1
STA one

LDI 0    ; Load 0 to the A register
JMP @inc ; Jump to the inc flag

@inc:
ADD one  ; Add one
OUT      ; Print the value of A register
JCF @dec ; Jump to dec label if carry flag is set
JMP @inc ; Jump to inc label otherwise

@dec:
SUB one  ; Subtract one
OUT      ; Print the value of A register
JZF @end ; Jump to end label if zero flag is set
JMP @dec ; Jump to dec label otherwise

@end:
HLT      ; Stop the program

```
