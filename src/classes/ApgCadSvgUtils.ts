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

import { A2D } from "../../deps.ts";


/** Utility class for SVG-CAD with static members and methods
 */
export class ApgCadSvgUtils {

  /** Static flag that enables or disables the debuggin features of the library */
  static readonly DEBUG_MODE = true;


  /** Calculate the lenght in characters of the the longest row in a multirow text
   * @param {string} amrt multirow text to check
   * @returns {number} number of characters of the longest row
   */
  static GetMaxRowLenghtOfMultilineText(amrt: string): number {

    const as = amrt.split('\n');

    let lmax = 0;

    as.map((item) => {
      if (item.length > lmax) {
        lmax = item.length;
      }
    })
    return lmax;
  }




  /** Calculates the text direction accordingly with the inclination
   *
   * @param adeg Inclination of the text in degrees
   */
  static GetTextFlip(adeg: number): number {

    let r = 1;

    if (adeg > 90 && adeg <= 270) {
      r = -1;
    }

    return r;
  }


  /** Calculates the text orientation accordingly with the inclination
   *
   * @param adeg Inclination of the text in degrees
   */
  static GetTextOrientation(adeg: number): number {

    let r = adeg % 360;

    if (adeg > 90 && adeg <= 270) {
      r = adeg + 180;
    }

    return r;
  }



  static GetPointAsString(aname: string, apoint: A2D.Apg2DPoint, adigits = 0) {
    return `${aname}: ${apoint.x.toFixed(adigits)}, ${apoint.y.toFixed(adigits)}`;
  }

}
