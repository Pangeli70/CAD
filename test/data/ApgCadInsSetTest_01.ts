/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { eApgCadInstructionTypes } from "../../src/enums/eApgCadInstructionTypes.ts";
import { eApgCadTestInsSets } from "../src/enums/eApgCadTestInsSets.ts";
import { IApgCadInsSetTest } from "../src/interfaces/IApgCadInsSetTest.ts";

export const ApgCadInsSetTest_01: IApgCadInsSetTest = {
    name: eApgCadTestInsSets.BASIC,
    description: "Some points and lines on the default layer: Zero ",
    instructions: [
        {
            type: eApgCadInstructionTypes.SET_NAME,
            name: 'TEST 01',
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P1',
            x: 100,
            y: 100
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P2',
            x: 900,
            y: 900
        },
        {
            type: eApgCadInstructionTypes.DRAW_LINE,
            name: 'L2',
            points: ['P1', 'P2']
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT_DELTA,
            name: 'P3',
            origin: 'P2',
            w: 500,
            h: 100,
        },
        {
            type: eApgCadInstructionTypes.DRAW_POINTS,
            name: 'DP1',
            points: ['P3'],
            radious: 10
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P4',
            x: 2500,
            y: 2500
        },
        {
            type: eApgCadInstructionTypes.DRAW_CIRCLE,
            name: 'C1',
            origin: 'P4',
            radious: 500
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P5',
            x: 500,
            y: 3000
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P6',
            x: 1000,
            y: 3100
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P7',
            x: 1500,
            y: 3250
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P8',
            x: 1750,
            y: 3500
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P9',
            x: 1850,
            y: 3650
        },
        {
            type: eApgCadInstructionTypes.DRAW_POLYLINE,
            name: 'PL1',
            points: ['P5', 'P6', 'P7', 'P8', 'P9',],
        },
        {

            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P10',
            x: 2000,
            y: 300
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P11',
            x: 3000,
            y: 300
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P12',
            x: 2600,
            y: 500
        },
        {
            type: eApgCadInstructionTypes.DRAW_POLYGON,
            name: 'POL1',
            points: ['P10', 'P11', 'P12'],
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P13',
            x: 3500,
            y: 1500
        },
        {
            type: eApgCadInstructionTypes.DRAW_RECTANGLE_SIZES,
            name: 'RS1',
            origin: 'P13',
            w: 300,
            h: 1000
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P14',
            x: 3600,
            y: 500
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P15',
            x: 4600,
            y: 250
        },
        {
            type: eApgCadInstructionTypes.DRAW_RECTANGLE_POINTS,
            name: 'RP1',
            points: ['P14', 'P15'],
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P16',
            x: 1000,
            y: 2000
        },
        {
            type: eApgCadInstructionTypes.DRAW_REGULAR_POLYGON,
            name: 'PGN1',
            origin: "P16",
            radious: 400,
            n: 12
        },
        // {
        //     type: eApgCadInstructionTypes.DRAW_ALL_POINTS,
        //     name: 'DAP',
        //     radious: 10
        // },

    ]
}