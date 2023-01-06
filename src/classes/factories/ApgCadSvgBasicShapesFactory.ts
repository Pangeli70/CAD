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
import { eApgCadPrimitiveFactoryTypes } from "../../enums/eApgCadPrimitiveFactoryTypes.ts";
import { ApgCadSvg } from "../ApgCadSvg.ts";
import { ApgCadSvgPrimitivesFactory } from "./ApgCadSvgPrimitivesFactory.ts";


export class ApgCadSvgBasicShapesFactory extends ApgCadSvgPrimitivesFactory {


  public constructor(adoc: ApgCadSvg) {
    super(adoc, eApgCadPrimitiveFactoryTypes.BASIC_SHAPES);
  }


  buildLine(
    afirstPoint: A2D.Apg2DPoint,
    asecondPoint: A2D.Apg2DPoint,
  ) {
    const r = this._cad.svg
      .line(afirstPoint.x, afirstPoint.y, asecondPoint.x, asecondPoint.y)

    return r;
  }


  buildPolyLine(
    apoints: A2D.Apg2DPoint[],
    aclosed = false
  ) {

    const pts = [...apoints];
    if (aclosed) {
      pts.push(pts[0]); //to close the polyline
    }

    const r = this._cad.svg
      .polyline(apoints)

    return r;
  }


  buildRect(
    apoint: A2D.Apg2DPoint,
    awidth: number,
    aheight: number,
  ) {
    const r = this._cad.svg
      .rect(apoint.x, apoint.y, awidth, aheight)

    return r;
  }


  buildRect2P(
    afirstPoint: A2D.Apg2DPoint,
    asecondPoint: A2D.Apg2DPoint,
  ) {
    const lwidth = asecondPoint.x - afirstPoint.x;
    const lheight = asecondPoint.y - afirstPoint.y;
    const r = this._cad.svg
      .rect(afirstPoint.x, afirstPoint.y, lwidth, lheight)

    return r;
  }


  buildPolygon(
    acenter: A2D.Apg2DPoint,
    aradious: number,
    asides: number,
    arotDeg: number,
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

    const r = this._cad.svg
      .polygon(pts)
      .rotate(arotDeg, acenter.x, acenter.y);

    return r;
  }


  buildCircle(
    acenter: A2D.Apg2DPoint,
    aradious: number,
  ) {
    const r = this._cad.svg
      .circle(acenter.x, acenter.y, aradious)
    return r;
  }


  buildDot(
    acenter: A2D.Apg2DPoint,
    aradious: number,
  ) {
    const r = this._cad.svg
      .circle(acenter.x, acenter.y, aradious)

    return r;
  }


  buildPoint(
    acenter: A2D.Apg2DPoint,
    aradious: number,
    aname: string,
    atextStyle: Svg.IApgSvgTextStyle,
  ) {
    const r = this._cad.svg
      .group()

    const _c = this._cad.svg
      .circle(acenter.x, acenter.y, aradious)
      .childOf(r);

    const tx = acenter.x + atextStyle.size * atextStyle.aspectRatio;
    const ty = acenter.y - atextStyle.size;
    const text = ` ${aname}: ${acenter.x},${acenter.y}`;
    const _t = this._cad.svg
      .text(tx, ty, text, 0)
      .textStyle(atextStyle)
      .childOf(r);

    return r;
  }

}
