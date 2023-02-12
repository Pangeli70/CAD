/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * @version 0.9.4 [APG 2023/01/04] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */

/**
 * Ground Data
 */
export interface IApgCadSvgGround {
  /** Flag that controls if the background has to be drawn */
  draw: boolean;
  /** Width of the border of the ground in pixels*/
  strokeWidth: number;
  /** Color of the border of the background*/
  strokeColor: string;
  /** Color of ground */
  fillColor: string;
}
