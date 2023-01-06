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
    $id: 'IApgCadIns_NewPointDelta#',
    type: 'object',
    properties: {
        id: {
            type: 'integer'
        },
        type: {
            const: eApgCadInstructionTypes.NEW_POINT_DELTA as string
        },
        name: {
            type: 'string',
        },
        origin: {
            type: 'string',
        },
        x: {
            type: 'number'
        },
        y: {
            type: 'number'
        }
    },
    additionalProperties: false,
    allErrors: true,
    required: [
        'id', 'type', 'name', 'origin', 'x', 'y'
    ]

};

export const ApgCadIns_NewPointDeltaSchema = Uts.ApgUtsObj.DeepFreeze(rawSchema) as Jsv.IApgJsvInterface;