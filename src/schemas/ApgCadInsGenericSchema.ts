/** -----------------------------------------------------------------------
 * @module [CAD-JSV]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/26] Github Beta
 * @version 0.9.4 [APG 2023/01/07] Deno Deploy Beta
  * -----------------------------------------------------------------------
 */
import { Uts, Jsv } from '../../deps.ts'

const rawSchema: Jsv.IApgJsvInterface = {
    $schema: 'http://json-schema.org/schema#',
    $id: 'IApgCadSvg_Generic#',
    title: 'Defines all the possible properties for preliminary validation',
    type: 'object',
    properties: {
        type: {
            $ref: 'eApgCadIns_Types#/definitions/enumType'
        },

        name: {
            type: 'string'
        },

        x: {
            type: 'number'
        },

        y: {
            type: 'number'
        },

        w: {
            type: 'number'
        },

        h: {
            type: 'number'
        },

        n: {
            type: 'integer'
        },

        origin: {
            type: 'string'
        },

        radious: {
            type: 'number'
        },

        pivot: {
            type: 'string'
        },

        angle: {
            type: 'number'
        },

        points: {
            type: 'array',
            items: {
                type: 'string'
            }
        },

        text: {
            type: 'array',
            items: {
                type: 'string'
            }
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

        payload: {
            type: 'object'
        }
    },
    additionalProperties: false,
    allErrors: true,
    required: [
        'type'
    ]
}



export const ApgCadIns_GenericSchema = Uts.ApgUtsObj.DeepFreeze(rawSchema) as Jsv.IApgJsvInterface;