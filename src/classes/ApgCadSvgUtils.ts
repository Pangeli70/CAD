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


/** Utility class for SVG-CAD with static members and methods
 */
export class ApgCadSvgUtils {

  /** Static flag that enables or disables the debuggin features of the library */
  static DEBUG_MODE = false;


  /** Calculate the lenght in characters of the the longest row in a multirow text
   * @param {string} amrt multirow text to check
   * @returns {number} number of characters of the longest row
   */
  static MultilineMaxRowLenght(amrt: string): number {

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
  static getTextDirection(adeg: number): number {

    let r = 0;

    if (adeg > 0 && adeg < 90) {
      r = 1;            // ok
    }
    else if (adeg === 90) {
      r = 1;            // ok
    }
    else if (adeg > 90 && adeg < 180) {
      r = -1;
    }
    else if (adeg === 180) {
      r = -1;           // ok
    }
    else if (adeg > 180 && adeg < 270) {
      r = -1;           // ok
    }
    else if (adeg === 270) {
      r = -1;           // ok
    }
    else if (adeg > 270 && adeg < 360) {
      r = 1;            // ok
    }
    else {
      r = 1;
    }

    return r;
  }


  /** Calculates the text orientation accordingly with the inclination
   *
   * @param adeg Inclination of the text in degrees
   */
  static getTextOrientation(adeg: number): number {

    let r = 0;

    if (adeg > 0 && adeg < 90) {
      r = 360 - adeg;   // ok
    }
    else if (adeg === 90) {
      r = adeg + 180;   // ok
    }
    else if (adeg > 90 && adeg < 180) {
      r = 180 - adeg;
    }
    else if (adeg === 180) {
      r = adeg + 180;   // ok
    }
    else if (adeg > 180 && adeg < 270) {
      r = 180 - adeg;   // ok
    }
    else if (adeg === 270) {
      r = adeg;         // ok
    }
    else if (adeg > 270 && adeg < 360) {
      r = 360 - adeg;   // ok
    }
    else {
      r = adeg;
    }

    return r;
  }


  /** Similar to text orientation, given an inclination return the orientation for the arrow
   *
   * @param adeg Inclination of the arrow in degrees
   */
  static getArrowOrientation(adeg: number): number {

    let r = 0;

    if (adeg > 0 && adeg < 90) {
      r = 180 - adeg;   // ok
    }
    else if (adeg === 90) {
      r = adeg;         // ok
    }
    else if (adeg > 90 && adeg < 180) {
      r = 180 - adeg;
    }
    else if (adeg === 180) {
      r = adeg + 180;   // ok
    }
    else if (adeg > 180 && adeg < 270) {
      r = 180 - adeg;   // ok
    }
    else if (adeg === 270) {
      r = adeg;         // ok
    }
    else if (adeg > 270 && adeg < 360) {
      r = 180 - adeg;   // ok
    }
    else {
      r = adeg + 180;
    }

    return r;
  }


}
