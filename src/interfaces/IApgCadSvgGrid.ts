/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * @version 0.9.4 [APG 2023/01/04] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */

import { Svg } from "../../deps.ts";
import { eApgCadGridMode } from "../enums/eApgCadGridMode.ts";

/**
 * Grid data
 */
export interface IApgCadSvgGrid {
  mode: eApgCadGridMode;
  gridStep: number;
  gridStroke: Svg.IApgSvgStrokeStyle;
  drawMajors: boolean;
  majorEvery: number;
  majorGridStroke: Svg.IApgSvgStrokeStyle;
}
