/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/05/21] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * -----------------------------------------------------------------------
 */

/** Apg Cad Istruction Names
 */
export enum eApgCadInstructionTypes {
  GENERIC = "GENERIC",
  SET_NAME = "SET_NAME",
  SET_VIEWBOX = "SET_VIEWBOX",
  SET_AXIS = "SET_AXIS",
  SET_BACKGROUND = "SET_BACKGROUND",
  NEW_POINT = "NEW_POINT", // 0.0.1 *
  NEW_POINT_DELTA = "NEW_POINT_DELTA", // 0.0.1 *
  NEW_LAYER = "NEW_LAYER", // *
  SET_LAYER = "SET_LAYER", // 0.0.1 *
  NEW_STROKE_STYLE = "NEW_STROKE_STYLE", // *
  SET_STROKE = "SET_STROKE_STYLE", // *
  NEW_FILL_STYLE = "NEW_FILL_STYLE", // *
  SET_FILL = "SET_FILL_STYLE", // *
  NEW_GROUP = "NEW_GROUP", // 0.0.1 *
  SET_GROUP = "SET_GROUP", // 0.0.1 *
  DRAW_POINTS = "DRAW_POINTS", // 0.0.1
  DRAW_ALL_POINTS = "DRAW_ALL_POINTS", // 0.0.1
  DRAW_LINE = "DRAW_LINE", // 0.0.1 *
  DRAW_POLYLINE = "DRAW_POLYLINE", // 0.0.1 *
  DRAW_POLYGON = "DRAW_POLYGON", // 0.0.1 *
  DRAW_RECTANGLE_POINTS = "DRAW_RECTANGLE_POINTS", // 0.0.1 *
  DRAW_RECTANGLE_SIZE = "DRAW_RECTANGLE_SIZE", // 0.0.1 *
  DRAW_CIRCLE = "DRAW_CIRCLE", // *
  DRAW_ARC = "DRAW_ARC", // *
  DRAW_TEXT = "DRAW_TEXT", // *
  DRAW_NAME = "DRAW_NAME", // *
  DRAW_CPLX = "DRAW_CPLX",
  DRAW_IMAGE = "DRAW_IMAGE",
  DRAW_ANNOTATION = "DRAW_ANNOTATION",
  DRAW_LIN_DIM = "DRAW_LIN_DIM",
  DRAW_ANG_DIM = "DRAW_ANG_DIM",
  MAKE_GROUP = "MAKE_GROUP",
  DRAW_ARRAY = "DRAW_ARRAY",
}
