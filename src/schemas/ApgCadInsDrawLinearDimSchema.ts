/** -----------------------------------------------------------------------
 * @module [CAD-JSV]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/26] Github Beta
 * @version 0.9.4 [APG 2023/01/15] Deno Deploy Beta
  * -----------------------------------------------------------------------
 */
import { Uts, Jsv } from '../../deps.ts'
import { eApgCadInstructionTypes } from "../enums/eApgCadInstructionTypes.ts";

const rawSchema: Jsv.IApgJsvInterface = {
    $schema: 'http://json-schema.org/schema#',
    $id: 'IApgCadIns_DrawLinearDim#',
    type: 'object',
    properties: {
        type: {
            const: eApgCadInstructionTypes.DRAW_LIN_DIM as string
        },
        name: {
            type: 'string'
        },
        points: {
            type: 'array',
            items: {
                type: 'string'
            },
            minItems: 2,
            maxItems: 2,
            uniqueItems: true
        },
        radious: {
            type: 'number'
        },
        text: {
            type: 'array',
            items: {
                type: 'string'
            },
            minItems: 2,
            maxItems: 2,
            uniqueItems: true
        },
        strokeStyle: {
            type: 'string'
        },
        payload: {
            type: 'object',
        }
    },
    additionalProperties: false,
    allErrors: true,
    required: [
        'type', 'points', 'radious'
    ]

};

export const ApgCadIns_DrawLinearDimSchema = Uts.ApgUtsObj.DeepFreeze(rawSchema) as Jsv.IApgJsvInterface;