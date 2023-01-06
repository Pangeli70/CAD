/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2023/01/01] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { Svg } from "../../deps.ts";


export interface IApgCadSvgGrid {
  /** Flag that controls if the background has to be drawn */
  draw: boolean;
  gridStep: number;
  gridStroke: Svg.IApgSvgStrokeStyle;
  drawMajors: boolean;
  majorEvery: number;
  majorGridStroke: Svg.IApgSvgStrokeStyle;
  asDots: boolean;
}
