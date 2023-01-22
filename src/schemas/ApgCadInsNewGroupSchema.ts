/** -----------------------------------------------------------------------
 * @module [CAD-JSV]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.4 [APG 2023/01/21] Deno Deploy Beta
  * -----------------------------------------------------------------------
 */
import { Uts, Jsv } from '../../deps.ts'
import { eApgCadInstructionTypes } from "../enums/eApgCadInstructionTypes.ts";


const rawSchema: Jsv.IApgJsvInterface = {
    $schema: 'http://json-schema.org/schema#',
    $id: 'IApgCadIns_NewGroup#',
    type: 'object',
    properties: {
        type: {
            const: eApgCadInstructionTypes.NEW_GROUP as string
        },
        name: {
            type: 'string',
        },
        strokeStyle: {
            type: 'string'
        },
        fillStyle: {
            type: 'string'
        },
        textStyle: {
            type: 'string'
        },
    },
    additionalProperties: false,
    allErrors: true,
    required: [
        'type', 'name'
    ]

};

export const ApgCadIns_NewGroupSchema = Uts.ApgUtsObj.DeepFreeze(rawSchema) as Jsv.IApgJsvInterface;