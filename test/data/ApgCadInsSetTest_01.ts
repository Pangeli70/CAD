/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { eApgCadInstructionTypes } from "../../src/enums/eApgCadInstructionTypes.ts";
import { eApgCadTestInsSetGroups } from "../src/eApgCadInsSetTestGroups.ts";
import { IApgCadInsSetTest } from "../src/IApgCadInsSetTest.ts";

export const ApgCadInsSetTest_01: IApgCadInsSetTest = {
    group: eApgCadTestInsSetGroups.BASIC,
    name: "",
    description: "",
    instructions: [
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
}