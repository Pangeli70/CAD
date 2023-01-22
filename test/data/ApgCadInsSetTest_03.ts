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

export const ApgCadInsSetTest_03: IApgCadInsSetTest = {
    name: eApgCadTestInsSets.TC_MEAS_ON_SITE_1,
    description: "Measures taken on site 1",
    instructions: [
        {
            type: eApgCadInstructionTypes.SET_NAME,
            name: 'TEST 03',
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'ZERO',
            x: 0,
            y: 0
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'HF',
            x: 0,
            y: 2550
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT_DELTA,
            name: 'HFE',
            origin: "HF",
            w: -250,
            h: 0
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT_DELTA,
            name: 'HTE',
            origin: "HFE",
            w: 0,
            h: 1000
        },
        {
            type: eApgCadInstructionTypes.DRAW_POLYLINE,
            points: ['HF', 'HFE', 'HTE'],
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT_DELTA,
            name: 'hF',
            origin: "HF",
            w: 0,
            h: 125
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT_DELTA,
            name: 'hF1',
            origin: "hF",
            w: 250,
            h: 0
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT_DELTA,
            name: 'hT',
            origin: "hF1",
            w: 0,
            h: 800
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT_DELTA,
            name: 'Ceiling1',
            origin: "hT",
            w: 2800,
            h: 800
        },
        {
            type: eApgCadInstructionTypes.DRAW_POLYLINE,
            points: ['HF', 'hF', 'hF1', 'hT', 'Ceiling1'],
        },
        {
            type: eApgCadInstructionTypes.PUSH_LAYER,
            name: eApgCadDftLayers.DIMENSIONS
        },
        {
            type: eApgCadInstructionTypes.DRAW_LIN_DIM,
            points: ['ZERO', 'HF'],
            radious: 500,
            text: ["HF:", ""]
        },
        {
            type: eApgCadInstructionTypes.DRAW_LIN_DIM,
            points: ['hF', 'HF'],
            radious: -700,
            text: ["hF:", ""]
        },
        {
            type: eApgCadInstructionTypes.DRAW_LIN_DIM,
            points: ['ZERO', 'hT'],
            radious: 500,
            text: ["HT:", ""],
            payload: {
                type: eApgCadLinearDimensionTypes.VERTICAL
            }
        },

        {
            type: eApgCadInstructionTypes.NEW_POINT_DELTA,
            name: 'Lintel',
            origin: 'HF',
            w: 0,
            h: 70
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT_DELTA,
            name: 'Lintel1',
            origin: 'Lintel',
            w: 1000,
            h: -600
        },
        {
            type: eApgCadInstructionTypes.PUSH_LAYER,
            name: eApgCadDftLayers.ANNOTATIONS
        },
        {
            type: eApgCadInstructionTypes.DRAW_ANNOTATION,
            points: ['Lintel', 'Lintel1'],
            text: ['Lintel'],
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