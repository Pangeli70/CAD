/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * -----------------------------------------------------------------------
 */


export interface IApgCadSvgViewBox {
  /** Canvas Width in pixels */
  canvasWidth: number;
  /** Canvas Height in pixels */
  canvasHeight: number;
  /** ViewPort Width in pixels */
  viewPortWidth: number;
  /** ViewPort Height in pixels */
  viewPortHeight: number;
  /** Origin x displacement */
  originXDisp: number;
  /** Origin y displacement */
  originYDisp: number;
}
