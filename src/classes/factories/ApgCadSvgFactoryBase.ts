/** -----------------------------------------------------------------------
 * @module [CAD-svg]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * @version 0.9.4 [APG 2023/01/03] Changed from SvgDoc to CadSvg
 * -----------------------------------------------------------------------
 */

import { eApgCadFactories } from "../../enums/eApgCadFactories.ts";
import { ApgCadSvg } from "../ApgCadSvg.ts";


export class ApgCadSvgFactoryBase {

  protected ready = false;

  protected messages: string[] = [];

  protected type = eApgCadFactories.UNDEFINED;

  protected cad: ApgCadSvg;


  public constructor(acad: ApgCadSvg, atype: eApgCadFactories) {
    this.cad = acad;
    this.type = atype;
  }

 
}
