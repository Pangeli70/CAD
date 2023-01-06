/** -----------------------------------------------------------------------
 * @module [JSV]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/26] Github Beta
  * -----------------------------------------------------------------------
 */
import { Uts, Jsv } from '../../deps.ts'
import { eApgCadInstructionTypes } from "../enums/eApgCadInstructionTypes.ts";


const rawSchema: Jsv.IApgJsvInterface = {
    $schema: 'http://json-schema.org/schema#',
    $id: 'IApgCadIns_DrawAllPoints#',
    type: 'object',
    properties: {
        id: {
            type: 'integer'
        },
        type: {
            const: eApgCadInstructionTypes.DRAW_ALL_POINTS as string
        },
        name: {
            type: 'string',
        },
        radious: {
            type: 'number'
        },
    },
    additionalProperties: false,
    allErrors: true,
    required: [
        'id', 'type', 'name', 'radious'
    ]

};

export const ApgCadIns_DrawAllPointsSchema = Uts.ApgUtsObj.DeepFreeze(rawSchema) as Jsv.IApgJsvInterface;