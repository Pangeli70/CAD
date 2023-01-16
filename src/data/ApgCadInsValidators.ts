/** -----------------------------------------------------------------------
 * @module [CAD-Svg]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.4 [APG 2023/01/14] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { eApgCadInstructionTypes } from "../enums/eApgCadInstructionTypes.ts";
import { eApgCadIns_TypesSchema } from "../schemas/eApgCadInsTypesSchema.ts";
import { ApgCadIns_GenericSchema } from "../schemas/ApgCadInsGenericSchema.ts";
import { ApgCadIns_SetNameSchema } from "../schemas/ApgCadInsSetNameSchema.ts";
import { ApgCadIns_SetLayerSchema } from "../schemas/ApgCadInsSetLayerSchema.ts";
import { ApgCadIns_NewPointSchema } from "../schemas/ApgCadInsNewPointSchema.ts";
import { ApgCadIns_NewPointDeltaSchema } from "../schemas/ApgCadInsNewPointDeltaSchema.ts";
import { ApgCadIns_DrawAllPointsSchema } from "../schemas/ApgCadInsDrawAllPointsSchema.ts";
import { ApgCadIns_DrawPointsSchema } from "../schemas/ApgCadInsDrawPointsSchema.ts";
import { ApgCadIns_DrawLineSchema } from "../schemas/ApgCadInsDrawLineSchema.ts";
import { ApgCadIns_DrawPolylineSchema } from "../schemas/ApgCadInsDrawPolylineSchema.ts";
import { ApgCadIns_DrawCircleSchema } from "../schemas/ApgCadInsDrawCircleSchema.ts";
import { ApgCadIns_DrawArcSchema } from "../schemas/ApgCadInsDrawArcSchema.ts";
import { ApgCadIns_DrawRectanglePointsSchema } from "../schemas/ApgCadInsDrawRectanglePointsSchema.ts";
import { ApgCadIns_DrawRectangleSizesSchema } from "../schemas/ApgCadInsDrawRectangleSizesSchema.ts";
import { ApgCadIns_DrawRegularPolygonSchema } from "../schemas/ApgCadInsDrawRegularPolygonSchema.ts";
import { ApgCadIns_DrawPolygonSchema } from "../schemas/ApgCadInsDrawPolygonSchema.ts";
import { ApgCadIns_DrawLinearDimSchema } from "../schemas/ApgCadInsDrawLinearDimSchema.ts";
import { ApgCadIns_DrawArcDimSchema } from "../schemas/ApgCadInsDrawArcDimSchema.ts";
import { ApgCadIns_DrawAnnotationSchema } from "../schemas/ApgCadInsDrawAnnotationSchema.ts";


export const ApgCadInsValidators = [
    {
        type: eApgCadInstructionTypes.TYPES, // Ok 2023/01/04
        jsonSchema: eApgCadIns_TypesSchema,
    },
    {
        type: eApgCadInstructionTypes.GENERIC, // Ok 2023/01/04
        jsonSchema: ApgCadIns_GenericSchema,
        dependencies: ['eApgCadIns_Types']
    },
    {
        type: eApgCadInstructionTypes.SET_NAME,
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
        jsonSchema: ApgCadIns_SetLayerSchema,
    },
    {
        type: eApgCadInstructionTypes.NEW_POINT, // Ok 2023/01/04
        jsonSchema: ApgCadIns_NewPointSchema,
    },
    {
        type: eApgCadInstructionTypes.NEW_POINT_DELTA, // Ok 2023/01/04
        jsonSchema: ApgCadIns_NewPointDeltaSchema,
    },
    {
        type: eApgCadInstructionTypes.DRAW_POINTS,  // Ok 2023/01/06
        jsonSchema: ApgCadIns_DrawPointsSchema,
    },
    {
        type: eApgCadInstructionTypes.DRAW_ALL_POINTS, // Ok 2023/01/04
        jsonSchema: ApgCadIns_DrawAllPointsSchema,
    },
    {
        type: eApgCadInstructionTypes.DRAW_ARC, // Ok 2023/01/15
        jsonSchema: ApgCadIns_DrawArcSchema,
    },
    {
        type: eApgCadInstructionTypes.DRAW_CIRCLE, // Ok 2023/01/06
        jsonSchema: ApgCadIns_DrawCircleSchema,
    },
    {
        type: eApgCadInstructionTypes.DRAW_LINE, // Ok 2023/01/04
        jsonSchema: ApgCadIns_DrawLineSchema,
    },
    {
        type: eApgCadInstructionTypes.DRAW_POLYLINE, // Ok 2023/01/06
        jsonSchema: ApgCadIns_DrawPolylineSchema,
    },
    {
        type: eApgCadInstructionTypes.DRAW_POLYGON, // Ok 2023/01/06
        jsonSchema: ApgCadIns_DrawPolygonSchema,
    },
    {
        type: eApgCadInstructionTypes.DRAW_REGULAR_POLYGON, // Ok 2023/01/06
        jsonSchema: ApgCadIns_DrawRegularPolygonSchema,
    },
    {
        type: eApgCadInstructionTypes.DRAW_RECTANGLE_POINTS, // Ok 2023/01/06
        jsonSchema: ApgCadIns_DrawRectanglePointsSchema,
    },
    {
        type: eApgCadInstructionTypes.DRAW_RECTANGLE_SIZES, // Ok 2023/01/06
        jsonSchema: ApgCadIns_DrawRectangleSizesSchema,
    },
    {
        type: eApgCadInstructionTypes.DRAW_LIN_DIM, // Ok 2023/01/15
        jsonSchema: ApgCadIns_DrawLinearDimSchema,
    },
    {
        type: eApgCadInstructionTypes.DRAW_ARC_DIM, // Ok 2023/01/15
        jsonSchema: ApgCadIns_DrawArcDimSchema,
    },
    {
        type: eApgCadInstructionTypes.DRAW_ANNOTATION, // Ok 2023/01/15
        jsonSchema: ApgCadIns_DrawAnnotationSchema,
    },
    //{
    //   type: eApgCadInstructionTypes.DRAW_TEXT,
    //   schema: 'IApgCadSvgInsDrawText'
    // },
    //{
    //   type: eApgCadInstructionTypes.DRAW_NAME,
    //   schema: 'IApgCadSvgInsDrawName'
    //}
];
