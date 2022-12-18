/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { Svg } from "../../deps.ts";

export interface IApgCadSvgTextStyle {
  /** Name of the font */
  font: string;
  /** Height of the font in pixels */
  size: number;
  /**  Position of the text */
  // TODO use enum here
  anchor: Svg.eApgSvgTextAnchor;
  italic: boolean;
  bold: boolean;
  /**  Fill color */
  fill: string;
  /** Stroke color */
  stroke: string;
  /** Average font H/W Ratio depends from Font Family*/
  HWRatio: number;
  /** Line spacing factor */
  leading?: number;
}
