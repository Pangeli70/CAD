/** -----------------------------------------------------------------------
 * @module [CAD-Svg]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { Svg, A2D } from "../../../deps.ts";

import {
  ApgCadSvgPrimitivesFactory,
  eApgCadSvgPrimitiveFactoryTypes,
  IApgCadSvgTextStyle,
} from "../../../mod.ts";

export class ApgCadSvgBasicShapesFactory extends ApgCadSvgPrimitivesFactory {


  public constructor(adoc: Svg.ApgSvgDoc, alayer: Svg.ApgSvgNode) {
    super(adoc, alayer);
    this.type = eApgCadSvgPrimitiveFactoryTypes.basicShapes;
  }


  buildLine(
    afirstPoint: A2D.Apg2DPoint,
    asecondPoint: A2D.Apg2DPoint,
    alayer?: Svg.ApgSvgNode
  ) {
    const r = this.svgDoc
      .line(afirstPoint.x, afirstPoint.y, asecondPoint.x, asecondPoint.y)
      .childOf((alayer) ? alayer : this.layer);
    return r;
  }


  buildPolyLine(
    apoints: A2D.Apg2DPoint[],
    alayer?: Svg.ApgSvgNode
  ) {
    const r = this.svgDoc
      .polyline(apoints)
      .childOf((alayer) ? alayer : this.layer);
    return r;
  }


  buildClosedPolyLine(
    apoints: A2D.Apg2DPoint[],
    alayer?: Svg.ApgSvgNode
  ) {
    const pts = [apoints];
    pts.push(pts[0]);

    const r = this.svgDoc
      .polyline(apoints)
      .childOf((alayer) ? alayer : this.layer);
    return r;
  }


  buildRectWH(
    apoint: A2D.Apg2DPoint,
    awidth: number,
    aheight: number,
    alayer?: Svg.ApgSvgNode
  ) {
    const r = this.svgDoc
      .rect(apoint.x, apoint.y, awidth, aheight)
      .childOf((alayer) ? alayer : this.layer);
    return r;
  }

  
  buildRect2P(
    afirstPoint: A2D.Apg2DPoint,
    asecondPoint: A2D.Apg2DPoint,
    alayer?: Svg.ApgSvgNode
  ) {
    const lwidth = asecondPoint.x - afirstPoint.x;
    const lheight = asecondPoint.y - afirstPoint.y;
    const r = this.svgDoc
      .rect(afirstPoint.x, afirstPoint.y, lwidth, lheight)
      .childOf((alayer) ? alayer : this.layer);
    return r;
  }


  buildPolygon(
    acenter: A2D.Apg2DPoint,
    aradious: number,
    asides: number,
    arotDeg: number,
    alayer?: Svg.ApgSvgNode
  ) {

    const pts: A2D.Apg2DPoint[] = [];
    const alpha = Math.PI * 2 / asides;
    for (let i = 0; i < asides; i++) {
      const dx = Math.cos(alpha * i) * aradious;
      const dy = Math.sin(alpha * i) * aradious;
      const x = acenter.x + dx;
      const y = acenter.y + dy;
      const p = new A2D.Apg2DPoint(x, y);
      pts.push(p);
    }

    const r = this.svgDoc
      .polygon(pts)
      .rotate(arotDeg, acenter.x, acenter.y)
      .childOf((alayer) ? alayer : this.layer);
    return r;
  }


  buildCircle(
    acenter: A2D.Apg2DPoint,
    aradious: number,
    alayer?: Svg.ApgSvgNode
  ) {
    const r = this.svgDoc
      .circle(acenter.x, acenter.y, aradious)
      .childOf((alayer) ? alayer : this.layer)
    return r;
  }


  buildDot(
    acenter: A2D.Apg2DPoint,
    aradious: number,
    alayer?: Svg.ApgSvgNode
  ) {
    const r = this.svgDoc
      .circle(acenter.x, acenter.y, aradious)
      .childOf((alayer) ? alayer : this.layer);
    return r;
  }


  buildPoint(
    acenter: A2D.Apg2DPoint,
    aradious: number,
    aname: string,
    atextStyle: IApgCadSvgTextStyle,
    alayer?: Svg.ApgSvgNode,
  ) {
    const r = this.svgDoc
      .group()
      .childOf((alayer) ? alayer : this.layer);

    const _c = this.svgDoc
      .circle(acenter.x, acenter.y, aradious)
      .childOf(r);

    const text = `${aname}:${acenter.x},${acenter.y}`;
    const t = this.svgDoc
      .text(acenter.x, acenter.y, text)
      .childOf(r);

    this.applyTextStyle(t, atextStyle);

    return r;
  }

}
