/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/05/21] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * @version 0.9.4 [APG 2023/01/07] Deno Deploy beta
 * -----------------------------------------------------------------------
 */

/** Apg Cad Istruction Names */
export enum eApgCadInstructionTypes {

  TYPES = "TYPES",
  GENERIC = "GENERIC",

  SET_NAME = "SET_NAME",
  SET_VIEWBOX = "SET_VIEWBOX",
  SET_CARTESIAN = "SET_AXIS",
  SET_BACKGROUND = "SET_BACKGROUND",

  NEW_STROKE_STYLE = "NEW_STROKE_STYLE", 
  SET_STROKE = "SET_STROKE_STYLE", 
  NEW_FILL_STYLE = "NEW_FILL_STYLE", 
  SET_FILL = "SET_FILL_STYLE", 

  NEW_LAYER = "NEW_LAYER", // unused
  SET_LAYER = "SET_LAYER",  // S + I
  NEW_GROUP = "NEW_GROUP", // S
  SET_GROUP = "SET_GROUP", // S
  NO_GROUP = "NO_GROUP", // S

  NEW_POINT = "NEW_POINT", // S + I
  NEW_POINT_DELTA = "NEW_POINT_DELTA", // S + I

  DRAW_POINTS = "DRAW_POINTS", // S + I
  DRAW_ALL_POINTS = "DRAW_ALL_POINTS", // S + I
  DRAW_LINE = "DRAW_LINE", // S + I
  DRAW_POLYLINE = "DRAW_POLYLINE", // S + I
  DRAW_POLYGON = "DRAW_POLYGON", // S + I
  DRAW_REGULAR_POLYGON = "DRAW_REGULAR_POLYGON", // S + I
  DRAW_RECTANGLE_POINTS = "DRAW_RECTANGLE_POINTS", // S + I
  DRAW_RECTANGLE_SIZES = "DRAW_RECTANGLE_SIZE", // S + I
  DRAW_CIRCLE = "DRAW_CIRCLE", // S + I
  DRAW_ARC = "DRAW_ARC", // S + I // TODO test
  DRAW_TEXT = "DRAW_TEXT", 
  DRAW_NAME = "DRAW_NAME", 
  DRAW_IMAGE = "DRAW_IMAGE",
  DRAW_ANNOTATION = "DRAW_ANNOTATION",
  DRAW_LIN_DIM = "DRAW_LIN_DIM", // S + I // TODO test
  DRAW_ARC_DIM = "DRAW_ARC_DIM",
  DRAW_ANG_DIM = "DRAW_ANG_DIM",

  DRAW_ARRAY = "DRAW_ARRAY",
}
