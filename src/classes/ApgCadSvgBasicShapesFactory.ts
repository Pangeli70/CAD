/** -----------------------------------------------------------------------
 * @module [SVG-CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * -----------------------------------------------------------------------
 */

import { Svg, A2D } from "../../deps.ts";

import {
  ApgCadSvgPrimitiveFactory,
  eApgCadSvgPrimitiveFactoryTypes,
  IApgCadSvgTextStyle,
} from "../../mod.ts";

export class ApgCadSvgBasicShapesFactory extends ApgCadSvgPrimitiveFactory {

  public constructor(adoc: Svg.ApgSvgDoc, anode: Svg.ApgSvgNode) {
    super(adoc, anode);
    this.type = eApgCadSvgPrimitiveFactoryTypes.basicShapes;
  }

  buildLine(
    ap1: A2D.Apg2DPoint,
    ap2: A2D.Apg2DPoint,
    alayer?: Svg.ApgSvgNode
  ) {
    const r = this.svgDoc
      .line(ap1.x, ap1.y, ap2.x, ap2.y)
      .childOf((alayer) ? alayer : this.layer);
    return r;
  }

  buildPolyLine(apts: A2D.Apg2DPoint[], alayer?: Svg.ApgSvgNode) {
    const r = this.svgDoc
      .polyline(apts)
      .childOf((alayer) ? alayer : this.layer);
    return r;
  }

  buildPolygon(apts: A2D.Apg2DPoint[], alayer?: Svg.ApgSvgNode) {
    const r = this.svgDoc
      .polygon(apts)
      .childOf((alayer) ? alayer : this.layer);
    return r;
  }


  buildCircle(ac: A2D.Apg2DPoint, ar: number, alayer?: Svg.ApgSvgNode) {
    const r = this.svgDoc
      .circle(ac.x, ac.y, ar)
      .childOf((alayer) ? alayer : this.layer)
      .fill("none");
    return r;
  }


  buildDot(ac: A2D.Apg2DPoint, ar: number, alayer?: Svg.ApgSvgNode) {
    const r = this.svgDoc
      .circle(ac.x, ac.y, ar)
      .childOf((alayer) ? alayer : this.layer);
    return r;
  }

  buildPoint(
    ac: A2D.Apg2DPoint,
    ar: number,
    aname: string,
    astyle: IApgCadSvgTextStyle,
    alayer?: Svg.ApgSvgNode,
  ) {
    const r = this.svgDoc
      .group()
      .childOf((alayer) ? alayer : this.layer);

    const _c = this.svgDoc
      .circle(ac.x, ac.y, ar)
      .childOf(r);

    const text = `${aname}:${ac.x},${ac.y}`;
    const t = this.svgDoc
      .text(ac.x, ac.y, text)
      .childOf(r);

    this.textStyle(t, astyle);

    return r;
  }
}
