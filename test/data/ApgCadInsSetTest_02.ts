/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { eApgCadInstructionTypes } from "../../src/enums/eApgCadInstructionTypes.ts";
import { eApgCadTestInsSets } from "../src/enums/eApgCadTestInsSets.ts";
import { IApgCadInsSetTest } from "../src/interfaces/IApgCadInsSetTest.ts";

export const ApgCadInsSetTest_02: IApgCadInsSetTest = {
    name: eApgCadTestInsSets.BASIC,
    description: "All the primitives on default layers",
    instructions: [
        {
            id: 0,
            type: eApgCadInstructionTypes.SET_NAME,
            name: 'TEST 02',
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
            x: 900,
            y: 900
        },
        {
            id: 3,
            type: eApgCadInstructionTypes.DRAW_ANNOTATION,
            name: 'Annot1',
            points: ['P1', 'P2']
        }
    ]
}