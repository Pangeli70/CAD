/** -----------------------------------------------------------------------
 * @module [CAD-Svg]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2023/01/01] Deno Deploy
 * @version 0.9.4 [APG 2023/01/04] Deno Deploy Beta
 * @version 0.9.5 [APG 2023/02/12] Improving Beta
 * -----------------------------------------------------------------------
 */

import { Svg } from "../../../deps.ts";
import { eApgCadDftPatterns } from "../../enums/eApgCadDftPatterns.ts";
import { eApgCadFactories } from "../../enums/eApgCadFactories.ts";
import { eApgCadGridMode } from "../../enums/eApgCadGridMode.ts";
import { IApgCadSvgGrid } from "../../interfaces/IApgCadSvgGrid.ts";
import { ApgCadSvg } from "../ApgCadSvg.ts";
import { ApgCadSvgFactoryBase } from "./ApgCadSvgFactoryBase.ts";

export class ApgCadSvgGridFactory extends ApgCadSvgFactoryBase {

  public constructor(acad: ApgCadSvg) {
    super(acad, eApgCadFactories.GRIDS);
  }

  build(
    aparent: Svg.ApgSvgNode,
    agridSettings: IApgCadSvgGrid,
  ) {

    const bottomLeft = this.cad.svg.bottomLeft();
    const topRight = this.cad.svg.topRight();
    const r1 = this.cad.svg
      .rect(bottomLeft.x, bottomLeft.y, topRight.x, topRight.y)
      .fillPattern(eApgCadDftPatterns.BACK_GRID_LINES)
      .stroke(agridSettings.gridStroke.color, agridSettings.gridStroke.width)
      .childOf(aparent);

    if (agridSettings.mode == eApgCadGridMode.DOTS ) {
      r1.fillPattern(eApgCadDftPatterns.BACK_GRID_LINES_AS_DOTS)
    }

    return r1;
  }

}


