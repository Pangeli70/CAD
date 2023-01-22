/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.4 [APG 2023/01/21] Deno Deploy beta
 * -----------------------------------------------------------------------
 */

import { eApgCadDftLayers } from "../../src/enums/eApgCadDftLayers.ts";
import { eApgCadDftStrokeStyles } from "../../src/enums/eApgCadDftStrokeStyles.ts";
import { eApgCadInstructionTypes } from "../../src/enums/eApgCadInstructionTypes.ts";
import { eApgCadLinearDimensionTypes } from "../../src/enums/eApgCadLinearDimensionTypes.ts";
import { IApgCadInstruction } from "../../src/interfaces/IApgCadInstruction.ts";
import { eApgCadTestInsSets } from "../src/enums/eApgCadTestInsSets.ts";
import { IApgCadInsSetTest } from "../src/interfaces/IApgCadInsSetTest.ts";



function DoorOrWindowFrontView(
    aname: string,
    aorigin: string,
    awidth: number,
    aheight: number,
    aopenLeft: boolean,
    ainward: boolean
) {
    const r: IApgCadInstruction[] = [];
    r.push({
        type: eApgCadInstructionTypes.NEW_GROUP,
        name: aname,
    });
    r.push({
        type: eApgCadInstructionTypes.NEW_POINT_DELTA,
        name: aname + '_BL',
        origin: aorigin,
        w: 0,
        h: 0
    });
    r.push({
        type: eApgCadInstructionTypes.NEW_POINT_DELTA,
        name: aname + '_BR',
        origin: aname + '_BL',
        w: awidth,
        h: 0
    });
    r.push({
        type: eApgCadInstructionTypes.NEW_POINT_DELTA,
        name: aname + '_TR',
        origin: aname + '_BR',
        w: 0,
        h: aheight
    });
    r.push({
        type: eApgCadInstructionTypes.NEW_POINT_DELTA,
        name: aname + '_TL',
        origin: aname + '_TR',
        w: -awidth,
        h: 0
    });
    r.push({
        type: eApgCadInstructionTypes.NEW_POINT_DELTA,
        name: aname + '_ML',
        origin: aname + '_TL',
        w: 0,
        h: (-aheight / 2)
    });
    r.push({
        type: eApgCadInstructionTypes.NEW_POINT_DELTA,
        name: aname + '_MR',
        origin: aname + '_TR',
        w: 0,
        h: (-aheight / 2)
    });
    r.push({
        type: eApgCadInstructionTypes.NEW_POINT_DELTA,
        name: aname + '_TO',
        origin: aname + ((aopenLeft) ? '_TR' : '_TL'),
        w: awidth / 10 * ((aopenLeft) ? -1 : 1),
        h: awidth / 10 * ((ainward) ? 1 : -1),
    });
    r.push({
        type: eApgCadInstructionTypes.NEW_POINT_DELTA,
        name: aname + '_BO',
        origin: aname + ((aopenLeft) ? '_BR' : '_BL'),
        w: awidth / 10 * ((aopenLeft) ? -1 : 1),
        h: awidth / 10 * ((ainward) ? -1 : +1),
    });
    r.push({
        type: eApgCadInstructionTypes.DRAW_RECTANGLE_SIZES,
        origin: aname + '_BL',
        w: awidth,
        h: aheight
    });
    r.push({
        type: eApgCadInstructionTypes.DRAW_POLYLINE,
        points: (aopenLeft) ?
            [aname + '_TL', aname + '_MR', aname + '_BL'] :
            [aname + '_TR', aname + '_ML', aname + '_BR'],
        strokeStyle: (ainward) ? eApgCadDftStrokeStyles.FOREGROUND : eApgCadDftStrokeStyles.HIDDEN_LARGE
    });
    r.push({
        type: eApgCadInstructionTypes.DRAW_POLYLINE,
        points: (aopenLeft) ?
            [aname + '_TL', aname + '_TO', aname + '_BO', aname + '_BL'] :
            [aname + '_TR', aname + '_TO', aname + '_BO', aname + '_BR'],
        strokeStyle: eApgCadDftStrokeStyles.HIDDEN
    });
    r.push({
        type: eApgCadInstructionTypes.NO_GROUP
    });
    return r;

}


export const ApgCadInsSetTest_04: IApgCadInsSetTest = {
    name: eApgCadTestInsSets.TC_PED_DOORS_1,
    description: "Pedestrian doors on side view 1",
    instructions: [
        {
            type: eApgCadInstructionTypes.SET_NAME,
            name: 'TEST 04',
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'ZERO',
            x: 0,
            y: 0
        },
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'Door1_O',
            x: 200,
            y: 200
        },
        ...DoorOrWindowFrontView('Door1', "Door1_O", 800, 2250, true, true),
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'Door2_O',
            x: 2000,
            y: 200
        },
        ...DoorOrWindowFrontView('Door2', "Door2_O", 800, 1800, true, false),
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'Door3_O',
            x: 3400,
            y: 50
        },
        ...DoorOrWindowFrontView('Door3', "Door3_O", 780, 2150, false, true),
        {
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'Door4_O',
            x: 4500,
            y: 0
        },
        ...DoorOrWindowFrontView('Door4', "Door4_O", 900, 2050, false, false),
        {
            type: eApgCadInstructionTypes.PUSH_LAYER,
            name: eApgCadDftLayers.DEBUG
        },
        // {
        //     type: eApgCadInstructionTypes.DRAW_ALL_POINTS,
        //     radious: 10
        // },

    ]
}