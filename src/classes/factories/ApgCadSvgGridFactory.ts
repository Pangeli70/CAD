/** -----------------------------------------------------------------------
 * @module [CAD-Svg]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2023/01/01] Deno Deploy
 * @version 0.9.4 [APG 2023/01/04] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */

import { A2D, Svg } from "../../../deps.ts";
import { eApgCadPrimitiveFactoryTypes } from "../../enums/eApgCadPrimitiveFactoryTypes.ts";
import { IApgCadSvgGrid } from "../../interfaces/IApgCadSvgGrid.ts";
import { ApgCadSvg } from "../ApgCadSvg.ts";
import { ApgCadSvgPrimitivesFactory } from "./ApgCadSvgPrimitivesFactory.ts";


interface IApgCadGridData {
  p1: A2D.Apg2DPoint;
  p2: A2D.Apg2DPoint;
  isMajor: boolean;
}


export class ApgCadSvgGridFactory extends ApgCadSvgPrimitivesFactory {

  public constructor(acad: ApgCadSvg) {
    super(acad,  eApgCadPrimitiveFactoryTypes.GRIDS);
  }

  build(
    aparent: Svg.ApgSvgNode,
    agridSettings: IApgCadSvgGrid,
  ) {

    const gridData = this.#getData(agridSettings);
    const r = this.cad.svg
      .group()
      .stroke(agridSettings.gridStroke.color, agridSettings.gridStroke.width)
      .childOf(aparent);

    if (agridSettings.asDots) {
      r.strokeDashPattern([10, agridSettings.gridStep - 10], 5)
    }

    this.#drawGridLines(gridData, r, agridSettings);

    return r;
  }

  #drawGridLines(alinesData: IApgCadGridData[], r: Svg.ApgSvgNode, agridSettings: IApgCadSvgGrid) {
    for (const adata of alinesData) {
      const l = this.cad.svg
        .line(adata.p1.x, adata.p1.y, adata.p2.x, adata.p2.y)
        .childOf(r);
      if (adata.isMajor) {
        l.stroke(agridSettings.majorGridStroke.color, agridSettings.majorGridStroke.width);
      }
    }
  }

  #getData(
    agrid: IApgCadSvgGrid
  ) {
    const bottomLeft = this.cad.svg.bottomLeft();
    const topRight = this.cad.svg.topRight();

    const left = Math.trunc(bottomLeft.x / agrid.gridStep) * agrid.gridStep;
    const bottom = Math.trunc(bottomLeft.y / agrid.gridStep) * agrid.gridStep;
    const right = Math.trunc(topRight.x / agrid.gridStep) * agrid.gridStep;
    const top = Math.trunc(topRight.y / agrid.gridStep) * agrid.gridStep;

    const numX = (top - bottom) / agrid.gridStep;
    const numY = (right - left) / agrid.gridStep;

    const r: IApgCadGridData[] = []
    for (let i = 0; i < numX; i++) {
      const y = bottom + agrid.gridStep * i
      const xdata: IApgCadGridData = {
        p1: new A2D.Apg2DPoint(left, y),
        p2: new A2D.Apg2DPoint(right, y),
        isMajor: y % agrid.majorEvery == 0
      }
      r.push(xdata);
    }
    for (let i = 0; i < numY; i++) {
      const x = left + agrid.gridStep * i
      const ydata: IApgCadGridData = {
        p1: new A2D.Apg2DPoint(x, bottom),
        p2: new A2D.Apg2DPoint(x, top),
        isMajor: x % agrid.majorEvery == 0
      }
      r.push(ydata);
    }
    return r;
  }


}


