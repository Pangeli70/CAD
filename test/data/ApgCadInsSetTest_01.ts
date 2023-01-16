/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * @version 0.9.4 [APG 2023/01/15] Deno Deploy beta
 * -----------------------------------------------------------------------
 */

import { eApgCadDftLayers } from "../../src/enums/eApgCadDftLayers.ts";
import { eApgCadInstructionTypes } from "../../src/enums/eApgCadInstructionTypes.ts";
import { eApgCadLinearDimensionTypes } from "../../src/enums/eApgCadLinearDimensionTypes.ts";
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
            origin: "P16",
            radious: 400,
            n: 12
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P17',
            x: 2500,
            y: 1500
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P18',
            x: 2200,
            y: 1500
        },
        {
            type: eApgCadInstructionTypes.DRAW_ARC,
            points: ['P17', 'P18'],
            angle: -80
        },
        {
            type: eApgCadInstructionTypes.DRAW_ARC,
            points: ['P18', 'P17'],
            angle: 80
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
            //text: [ '<[(', ')]>'],
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
            type: eApgCadInstructionTypes.DRAW_ANNOTATION,
            points: ['P23', 'P24'],
            text: ['Prova', 'Test', 'Tentativo', 'Come il precedente'],
        },
        {
            type: eApgCadInstructionTypes.SET_LAYER,
            name: eApgCadDftLayers.DEBUG
        },
        {
            type: eApgCadInstructionTypes.DRAW_ALL_POINTS,
            radious: 10
        },

    ]
}