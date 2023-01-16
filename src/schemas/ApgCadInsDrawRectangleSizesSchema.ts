/** -----------------------------------------------------------------------
 * @module [CAD-JSV]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/26] Github Beta
 * @version 0.9.4 [APG 2023/01/07] Deno Deploy Beta
  * -----------------------------------------------------------------------
 */
import { Uts, Jsv } from '../../deps.ts'
import { eApgCadInstructionTypes } from "../enums/eApgCadInstructionTypes.ts";


const rawSchema: Jsv.IApgJsvInterface = {
    $schema: 'http://json-schema.org/schema#',
    $id: 'IApgCadIns_DrawRectangleSizes#',
    type: 'object',
    properties: {
        type: {
            const: eApgCadInstructionTypes.DRAW_RECTANGLE_SIZES as string
        },
        name: {
            type: 'string'
        },
        origin: {
            type: 'string'
        },
        w: {
            type: 'number'
        },
        h: {
            type: 'number'
        },
        angle: {
            type: 'number'
        },
        pivot: {
            type: 'string'
        },
        strokeStyle: {
            type: 'string'
        },
        fillStyle: {
            type: 'string'
        },
    },
    additionalProperties: false,
    allErrors: true,
    required: [
        'type','origin', 'w', 'h'
    ]

};

export const ApgCadIns_DrawRectangleSizesSchema = Uts.ApgUtsObj.DeepFreeze(rawSchema) as Jsv.IApgJsvInterface;