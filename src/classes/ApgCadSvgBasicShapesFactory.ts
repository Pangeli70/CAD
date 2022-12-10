/** -----------------------------------------------------------------------
 * @module [SVG-CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/05] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { Svg, A2D, Uts } from "../../deps.ts";

import {
  ApgCadSvgPrimitivesFactory,
  eApgCadSvgPrimitiveFactoryTypes,
  IApgCadSvgTextStyle,
} from "../../mod.ts";

export class ApgCadSvgBasicShapesFactory extends ApgCadSvgPrimitivesFactory {


  public constructor(adoc: Svg.ApgSvgDoc, alayer: Svg.ApgSvgNode) {
    super(adoc, alayer);
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


  buildRect(
    ap: A2D.Apg2DPoint,
    aw: number,
    ah: number,
    alayer?: Svg.ApgSvgNode
  ) {
    const r = this.svgDoc
      .rect(ap.x, ap.y, aw, ah)
      .childOf((alayer) ? alayer : this.layer);
    return r;
  }


  buildPolygon(
    ac: A2D.Apg2DPoint,
    ar: number,
    asides: number,
    arotDeg: number,
    alayer?: Svg.ApgSvgNode
  ) {

    const pts: A2D.Apg2DPoint[] = [];
    const alpha = Math.PI * 2 / asides;
    for (let i = 0; i < asides; i++) {
      const dx = Math.cos(alpha * i) * ar;
      const dy = Math.sin(alpha * i) * ar;
      const x = ac.x + dx;
      const y = ac.y + dy;
      const p = new A2D.Apg2DPoint(x, y);
      pts.push(p);
    }

    const r = this.svgDoc
      .polygon(pts)
      .rotate(arotDeg, ac.x, ac.y)
      .childOf((alayer) ? alayer : this.layer);
    return r;
  }


  buildCircle(ac: A2D.Apg2DPoint, ar: number, alayer?: Svg.ApgSvgNode) {
    const r = this.svgDoc
      .circle(ac.x, ac.y, ar)
      .childOf((alayer) ? alayer : this.layer)
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
