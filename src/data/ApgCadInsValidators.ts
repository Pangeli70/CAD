/** -----------------------------------------------------------------------
 * @module [CAD-Svg]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.4 [APG 2023/01/04] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { eApgCadInstructionTypes } from "../enums/eApgCadInstructionTypes.ts";
import { eApgCadIns_TypesSchema } from "../schemas/eApgCadInsTypesSchema.ts";
import { ApgCadIns_GenericSchema } from "../schemas/ApgCadInsGenericSchema.ts";
import { ApgCadIns_DrawLineSchema } from "../schemas/ApgCadInsDrawLineSchema.ts";
import { ApgCadIns_SetNameSchema } from "../schemas/ApgCadInsSetNameSchema.ts";
import { ApgCadIns_NewPointSchema } from "../schemas/ApgCadInsNewPointSchema.ts";
import { ApgCadIns_SetLayerSchema } from "../schemas/ApgCadInsSetLayerSchema.ts";
import { ApgCadIns_DrawAllPointsSchema } from "../schemas/ApgCadInsDrawAllPointsSchema.ts";
import { ApgCadIns_NewPointDeltaSchema } from "../schemas/ApgCadInsNewPointDeltaSchema.ts";


export const ApgCadInsValidators = [
    {
        type: eApgCadInstructionTypes.TYPES,
        schema: 'eApgCadIns_Types',
        jsonSchema: eApgCadIns_TypesSchema,
    },
    {
        type: eApgCadInstructionTypes.GENERIC,
        schema: 'IApgCadIns_Generic',
        jsonSchema: ApgCadIns_GenericSchema,
        dependencies: ['eApgCadIns_Types']
    },
    {
        type: eApgCadInstructionTypes.SET_NAME,
        schema: 'IApgCadIns_SetName',
        jsonSchema: ApgCadIns_SetNameSchema,
    },
    // {
    //   type: eApgCadInstructionTypes.SET_VIEWBOX,
    //   schema: 'IApgCadSvgInsSetViewbox'
    // }, {
    //   type: eApgCadInstructionTypes.SET_AXIS,
    //   schema: 'IApgCadSvgInsSetAxis'
    // }, {
    //   type: eApgCadInstructionTypes.SET_BACKGROUND,
    //   schema: 'IApgCadSvgInsSetBackground'
    // },
    {
        type: eApgCadInstructionTypes.SET_LAYER,
        schema: 'IApgCadIns_SetLayer',
        jsonSchema: ApgCadIns_SetLayerSchema,
    },
    {
        type: eApgCadInstructionTypes.NEW_POINT,
        schema: 'IApgCadIns_NewPoint',
        jsonSchema: ApgCadIns_NewPointSchema,
    },
    {
        type: eApgCadInstructionTypes.NEW_POINT_DELTA,
        schema: 'IApgCaIns_NewPointDelta',
        jsonSchema: ApgCadIns_NewPointDeltaSchema,
    },
    //{
    //   type: eApgCadInstructionTypes.DRAW_POINTS,
    //   schema: 'IApgCadSvgInsDrawPoints'
    // },
    {
        type: eApgCadInstructionTypes.DRAW_ALL_POINTS,
        schema: 'IApgCadIns_DrawAllPoints',
        jsonSchema: ApgCadIns_DrawAllPointsSchema,
    },
    // {
    //   type: eApgCadInstructionTypes.DRAW_ARC,
    //   schema: 'IApgCadSvgInsDrawArc'
    // },
    // {
    //   type: eApgCadInstructionTypes.DRAW_CIRCLE,
    //   schema: 'IApgCadSvgInsDrawCircle'
    // }, 
    {
        type: eApgCadInstructionTypes.DRAW_LINE,
        schema: 'IApgCadIns_DrawLine',
        jsonSchema: ApgCadIns_DrawLineSchema,
    },
    // {
    //   type: eApgCadInstructionTypes.DRAW_POLYLINE,
    //   schema: 'IApgCadSvgInsDrawPolyline'
    // },
    //{
    //   type: eApgCadInstructionTypes.DRAW_RECTANGLE_POINTS,
    //   schema: 'IApgCadSvgInsDrawRectanglePoints'
    // },
    // {
    //   type: eApgCadInstructionTypes.DRAW_RECTANGLE_SIZE,
    //   schema: 'IApgCadSvgInsDrawRectangleSize'
    // },
    //{
    //   type: eApgCadInstructionTypes.DRAW_POLYGON,
    //   schema: 'IApgCadSvgInsDrawPolygon'
    // },
    //{
    //   type: eApgCadInstructionTypes.DRAW_TEXT,
    //   schema: 'IApgCadSvgInsDrawText'
    // },
    //{
    //   type: eApgCadInstructionTypes.DRAW_NAME,
    //   schema: 'IApgCadSvgInsDrawName'
    //}
];
