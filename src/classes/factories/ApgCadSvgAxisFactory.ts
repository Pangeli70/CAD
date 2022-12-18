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

import { A2D, Svg } from "../../../deps.ts";

import {
  ApgCadSvgPrimitivesFactory,
  eApgCadOrientations,
  eApgCadSvgPrimitiveFactoryTypes,
  IApgCadSvgAxis,
} from "../../../mod.ts";

export class ApgCadSvgAxisFactory extends ApgCadSvgPrimitivesFactory {

  public constructor(adoc: Svg.ApgSvgDoc, anode: Svg.ApgSvgNode) {
    super(adoc, anode);
    this.type = eApgCadSvgPrimitiveFactoryTypes.axis;
  }

  build(
    atype: eApgCadOrientations,
    asettings: IApgCadSvgAxis,
    alayer?: Svg.ApgSvgNode,
  ) {
    const r = this.svgDoc.group();
    r.childOf(alayer ? alayer : this.layer);

    const topLeft = this.svgDoc.topLeft();
    const bottomRight = this.svgDoc.bottomRight();

    let p1, p2: A2D.Apg2DPoint;
    if (atype == eApgCadOrientations.horizontal) {
      p1 = new A2D.Apg2DPoint(topLeft.x, 0);
      p2 = new A2D.Apg2DPoint(bottomRight.x, 0);
    } else {
      p1 = new A2D.Apg2DPoint(0, topLeft.y);
      p2 = new A2D.Apg2DPoint(0, bottomRight.y);
    }

    this.svgDoc
      .line(p1.x, p1.y, p2.x, p2.y)
      .stroke(asettings.axisStroke.color, asettings.axisStroke.width)
      .childOf(r);

    this.#drawTicks(r, atype, asettings);

    return r;
  }

  #drawTicks(
    aancestor: Svg.ApgSvgNode,
    atype: eApgCadOrientations,
    aaxis: IApgCadSvgAxis,
  ) {
    let firstTick: number;
    let lastTick: number;
    let ticksNum: number;
    const topLeft = this.svgDoc.topLeft();
    const bottomRight = this.svgDoc.bottomRight();

    if (atype == eApgCadOrientations.horizontal) {

      firstTick = Math.floor(topLeft.x / aaxis.ticksDistance)
        * aaxis.ticksDistance;
      lastTick = Math.floor(bottomRight.x / aaxis.ticksDistance)
        * aaxis.ticksDistance;
      ticksNum = (lastTick - firstTick) / aaxis.ticksDistance;

    } else {

      firstTick = Math.floor(topLeft.y / aaxis.ticksDistance)
        * aaxis.ticksDistance;
      lastTick = Math.floor(bottomRight.y / aaxis.ticksDistance)
        * aaxis.ticksDistance;
      ticksNum = (lastTick - firstTick) / aaxis.ticksDistance;
    }

    let currentTick = 0;
    do {
      this.#drawTick(aancestor, atype, aaxis, currentTick, firstTick);
      currentTick++;
    } while (currentTick <= ticksNum);
  }

  #drawTick(
    aancestor: Svg.ApgSvgNode,
    atype: eApgCadOrientations,
    aaxis: IApgCadSvgAxis,
    atickNumber: number,
    afirstTick: number,
  ) {
    if (aaxis.drawTicks) {

      const tickValue = (atickNumber  * aaxis.ticksDistance) + afirstTick;
      // If nth tick so is Big one
      const isBigTick = tickValue % aaxis.bigTicksEvery === 0;
      /** Lenght of the tick */
      let tickSize = aaxis.ticksSize;
      if (aaxis.drawBigTicks && isBigTick) {
        tickSize = aaxis.bigTicksSize;
      }
      let p1, p2: A2D.Apg2DPoint;
      if (atype == eApgCadOrientations.horizontal) {
        p1 = new A2D.Apg2DPoint(tickValue, 0);
        p2 = new A2D.Apg2DPoint(tickValue, -tickSize);
      } else {
        p1 = new A2D.Apg2DPoint(0, tickValue);
        p2 = new A2D.Apg2DPoint(-tickSize, tickValue);
      }

      this.svgDoc
        .line(p1.x, p1.y, p2.x, p2.y)
        .stroke(aaxis.tickStroke.color, aaxis.tickStroke.width)
        .childOf(aancestor);

      if (aaxis.drawBigTicksLables && isBigTick) {
        const topLeft = this.svgDoc.topLeft();
        const value = tickValue;

        const labelPoint = new A2D.Apg2DPoint(p1.x, p1.y);
        if (aaxis.labelsStyle) {
          if (atype == eApgCadOrientations.horizontal) {
            labelPoint.y -= (aaxis.labelsStyle.size + tickSize);
          } else {
            labelPoint.x -= (aaxis.labelsStyle.size + tickSize);
            labelPoint.y -= (aaxis.labelsStyle.size / 2.75);
          }
        }

        const label = this.svgDoc
          .text(labelPoint.x, labelPoint.y, value.toString())
          .childOf(aancestor);

        if (aaxis.labelsStyle) {
          this.applyTextStyle(label, aaxis.labelsStyle);
        }
      }
    }
  }
}
