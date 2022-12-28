import { eApgCadInstructionTypes } from "../../src/enums/eApgCadInstructionTypes.ts";
import { IApgCadInstruction } from "../../src/interfaces/IApgCadInstruction.ts";

export const ApgCadInsSetTest_01: IApgCadInstruction[] = [
    {
        id: 0,
        type: eApgCadInstructionTypes.SET_NAME,
        name: 'TEST 01',
    },
    {
        id: 1,
        type: eApgCadInstructionTypes.NEW_POINT,
        name: 'P1',
        x: 100,
        y: 100
    },
    {
        id: 2,
        type: eApgCadInstructionTypes.NEW_POINT,
        name: 'P2',
        x: 300,
        y: 150
    },
    {
        id: 3,
        type: eApgCadInstructionTypes.DRAW_LINE,
        name: 'L2',
        points: ['P1', 'P2']
    }
]