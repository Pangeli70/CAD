/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.4 [APG 2023/01/21] Deno Deploy beta
 * -----------------------------------------------------------------------
 */

import { eApgCadDftLayers } from "../../src/enums/eApgCadDftLayers.ts";
import { eApgCadInstructionTypes } from "../../src/enums/eApgCadInstructionTypes.ts";
import { eApgCadLinearDimensionTypes } from "../../src/enums/eApgCadLinearDimensionTypes.ts";
import { eApgCadTestInsSets } from "../src/enums/eApgCadTestInsSets.ts";
import { IApgCadInsSetTest } from "../src/interfaces/IApgCadInsSetTest.ts";

export const ApgCadInsSetTest_02: IApgCadInsSetTest = {
    name: eApgCadTestInsSets.DIMS_AND_ANNOTS,
    description: "Dimensions and annotatins o proper layers",
    instructions: [
        {
            type: eApgCadInstructionTypes.SET_NAME,
            name: 'TEST 02',
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P19',
            x: 3500,
            y: 3500
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P20',
            x: 4000,
            y: 3000
        },
        {
            type: eApgCadInstructionTypes.PUSH_LAYER,
            name: eApgCadDftLayers.DIMENSIONS
        },
        {
            type: eApgCadInstructionTypes.DRAW_LIN_DIM,
            points: ['P19', 'P20'],
            radious: 200,
        },
        {
            type: eApgCadInstructionTypes.DRAW_LIN_DIM,
            points: ['P20', 'P19'],
            radious: 200,
            payload: {
                type: eApgCadLinearDimensionTypes.VERTICAL
            }
        },
        {
            type: eApgCadInstructionTypes.DRAW_LIN_DIM,
            points: ['P19', 'P20'],
            radious: 200,
            text: [ '<[(', ')]>'],
            payload: {
                type: eApgCadLinearDimensionTypes.HORIZONTAL
            }
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P21',
            x: 500,
            y: 4500
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P22',
            x: 900,
            y: 4900
        },
        {
            type: eApgCadInstructionTypes.DRAW_ARC_DIM,
            points: ['P21', 'P22'],
            radious: -200,
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P23',
            x: 5000,
            y: 100
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P24',
            x: 5500,
            y: 800
        },
        {
            type: eApgCadInstructionTypes.POP_LAYER,
        },
        {
            type: eApgCadInstructionTypes.PUSH_LAYER,
            name: eApgCadDftLayers.ANNOTATIONS
        },
        {
            type: eApgCadInstructionTypes.DRAW_ANNOTATION,
            points: ['P23', 'P24'],
            text: ['Annotation', 'Test', 'Multiline', 'Will work?'],
        },
        {
            type: eApgCadInstructionTypes.PUSH_LAYER,
            name: eApgCadDftLayers.DEBUG
        },
        {
            type: eApgCadInstructionTypes.DRAW_ALL_POINTS,
            radious: 10
        },

    ]
}