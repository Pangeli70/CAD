/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.5.1 [APG 2019/01/16]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/05] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { Svg } from "../../deps.ts";
import { IApgCadSvgTextStyle } from "../../mod.ts";


export interface IApgCadSvgAxis {
  axisStroke: Svg.IApgSvgStroke;

  drawTicks: boolean;
  tickStroke: Svg.IApgSvgStroke;
  ticksDistance: number;
  ticksSize: number;
  drawBigTicks: boolean;
  bigTicksEvery: number;
  bigTicksSize: number;

  drawBigTicksLables: boolean;
  labelsStyleName: string;

  labelsStyle?: IApgCadSvgTextStyle;
}
