/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * -----------------------------------------------------------------------
 */

export interface IApgCadSvgTextStyle {
  family: string;
  size: number;
  anchor: string;
  italic: boolean;
  bold: boolean;
  fill: string;
  stroke: string;
  /** Average font H/W Ratio depends from Font Family*/
  HWRatio: number;
}
