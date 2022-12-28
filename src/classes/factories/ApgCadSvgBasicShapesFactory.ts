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
  eApgCadSvgPrimitiveFactoryTypes
} from "../../../mod.ts";

export class ApgCadSvgBasicShapesFactory extends ApgCadSvgPrimitivesFactory {


  public constructor(adoc: Svg.ApgSvgDoc, alayer: Svg.ApgSvgNode) {
    super(adoc, alayer);
    this._type = eApgCadSvgPrimitiveFactoryTypes.basicShapes;
  }



  buildLine(
    afirstPoint: A2D.Apg2DPoint,
    asecondPoint: A2D.Apg2DPoint,
    aparent?: Svg.ApgSvgNode
  ) {
    const r = this._svgDoc
      .line(afirstPoint.x, afirstPoint.y, asecondPoint.x, asecondPoint.y)
    this._setParent(r, aparent);
    return r;
  }

  buildPolyLine(
    apoints: A2D.Apg2DPoint[],
    aparent?: Svg.ApgSvgNode
  ) {
    const r = this._svgDoc.polyline(apoints)
    this._setParent(r, aparent);
    return r;
  }


  buildClosedPolyLine(
    apoints: A2D.Apg2DPoint[],
    aparent?: Svg.ApgSvgNode
  ) {
    const pts = [apoints];
    pts.push(pts[0]); //to close the polyline

    const r = this._svgDoc.polyline(apoints)
    this._setParent(r, aparent);
    return r;
  }


  buildRectWH(
    apoint: A2D.Apg2DPoint,
    awidth: number,
    aheight: number,
    aparent?: Svg.ApgSvgNode
  ) {
    const r = this._svgDoc.rect(apoint.x, apoint.y, awidth, aheight)
    this._setParent(r, aparent);
    return r;
  }


  buildRect2P(
    afirstPoint: A2D.Apg2DPoint,
    asecondPoint: A2D.Apg2DPoint,
    aparent?: Svg.ApgSvgNode
  ) {
    const lwidth = asecondPoint.x - afirstPoint.x;
    const lheight = asecondPoint.y - afirstPoint.y;
    const r = this._svgDoc.rect(afirstPoint.x, afirstPoint.y, lwidth, lheight)
    this._setParent(r, aparent);
    return r;
  }


  buildPolygon(
    acenter: A2D.Apg2DPoint,
    aradious: number,
    asides: number,
    arotDeg: number,
    aparent?: Svg.ApgSvgNode
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

    const r = this._svgDoc
      .polygon(pts)
      .rotate(arotDeg, acenter.x, acenter.y)
    this._setParent(r, aparent);
    return r;
  }


  buildCircle(
    acenter: A2D.Apg2DPoint,
    aradious: number,
    aparent?: Svg.ApgSvgNode
  ) {
    const r = this._svgDoc.circle(acenter.x, acenter.y, aradious)
    this._setParent(r, aparent);
    return r;
  }


  buildDot(
    acenter: A2D.Apg2DPoint,
    aradious: number,
    aparent?: Svg.ApgSvgNode
  ) {
    const r = this._svgDoc.circle(acenter.x, acenter.y, aradious)
    this._setParent(r, aparent);
    return r;
  }


  buildPoint(
    acenter: A2D.Apg2DPoint,
    aradious: number,
    aname: string,
    atextStyle: Svg.IApgSvgTextStyle,
    aparent?: Svg.ApgSvgNode,
  ) {
    const r = this._svgDoc.group()
    this._setParent(r, aparent);

    const _c = this._svgDoc
      .circle(acenter.x, acenter.y, aradious)
      .childOf(r);

    const text = `${aname}:${acenter.x},${acenter.y}`;
    const _t = this._svgDoc
      .text(acenter.x, acenter.y, text)
      .textStyle(atextStyle)
      .childOf(r);

    return r;
  }

}
