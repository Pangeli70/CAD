/** -----------------------------------------------------------------------
 * @module [JSV]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/26] Github Beta
  * -----------------------------------------------------------------------
 */
import { Uts, Jsv } from '../../deps.ts'

const rawSchema: Jsv.IApgJsvInterface = {
    $schema: 'http://json-schema.org/schema#',
    $id: 'IApgSvgInstruction#',
    title: 'Defines all the possible properties for preliminary validation',
    type: 'object',
    properties: {
        id: {
            type: 'integer'
        },
        type: {
            $ref: 'eApgCadInsTypes#/definitions/enumType'
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
        stroke: {
            type: 'string'
        },
        fill: {
            type: 'string'
        },
        font: {
            type: 'string'
        },
        payload: {
            type: 'object'
        }
    },
    additionalProperties: false,
    allErrors: true,
    required: [
        'id', 'type'
    ]
}



export const ApgCadIns_GenericSchema = Uts.ApgUtsObj.DeepFreeze(rawSchema) as Jsv.IApgJsvInterface;