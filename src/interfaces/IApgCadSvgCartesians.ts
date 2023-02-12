/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.5.1 [APG 2019/01/16]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * @version 0.9.4 [APG 2023/01/04] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */

import { Svg } from "../../deps.ts";
import { eApgCadCartesianMode } from "../enums/eApgCadCartesianMode.ts";

/**
 * Cartesian axises data
 */
export interface IApgCadSvgCartesians {

  mode: eApgCadCartesianMode,
  axisStroke: Svg.IApgSvgStrokeStyle;
  drawTicks: boolean;
  tickStroke: Svg.IApgSvgStrokeStyle;
  ticksStep: number;
  ticksSize: number;
  drawBigTicks: boolean;
  bigTicksEvery: number;
  bigTicksSize: number;

  drawBigTicksLables: boolean;
  labelsTextStyleName: string;

  labelsStyle?: Svg.IApgSvgTextStyle;
}
