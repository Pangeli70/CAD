/** -----------------------------------------------------------------------
 * @module [SVG-CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * -----------------------------------------------------------------------
 */

import { A2D, Svg } from "../../deps.ts";

import {
  ApgCadSvgPrimitiveFactory,
  eApgCadOrientations,
  eApgCadSvgPrimitiveFactoryTypes,
  IApgCadSvgAxis,
} from "../../mod.ts";

export class ApgCadSvgAxisFactory extends ApgCadSvgPrimitiveFactory {

  public constructor(adoc: Svg.ApgSvgDoc, anode: Svg.ApgSvgNode) {
    super(adoc, anode);
    this.type = eApgCadSvgPrimitiveFactoryTypes.axis;
  }

  buildAxis(
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
    asettings: IApgCadSvgAxis,
  ) {
    let firstTick: number;
    let lastTick: number;
    let ticksNum: number;
    const topLeft = this.svgDoc.topLeft();
    const bottomRight = this.svgDoc.bottomRight();

    if (atype == eApgCadOrientations.horizontal) {

      firstTick = Math.floor(topLeft.x / asettings.ticksDistance)
        * asettings.ticksDistance;
      lastTick = Math.floor(bottomRight.x / asettings.ticksDistance)
        * asettings.ticksDistance;
      ticksNum = (lastTick - firstTick) / asettings.ticksDistance;

    } else {

      firstTick = Math.floor(topLeft.y / asettings.ticksDistance)
        * asettings.ticksDistance;
      lastTick = Math.floor(bottomRight.y / asettings.ticksDistance)
        * asettings.ticksDistance;
      ticksNum = (lastTick - firstTick) / asettings.ticksDistance;
    }

    let currentTick = 0;
    do {
      this.#drawTick(aancestor, atype, asettings, currentTick, firstTick);
      currentTick++;
    } while (currentTick <= ticksNum);
  }


  #drawTick(
    aancestor: Svg.ApgSvgNode,
    atype: eApgCadOrientations,
    asettings: IApgCadSvgAxis,
    atickNumber: number,
    afirstTick: number,
  ) {
    if (asettings.drawTicks) {
      // If nth tick so is Big one
      const isBigTick = atickNumber % asettings.bigTicksEvery === 0;
      /** Lenght of the tick */
      let tickSize = asettings.ticksSize;
      if (asettings.drawBigTicks && isBigTick) {
        tickSize = asettings.bigTicksSize;
      }
      const tickValue: number = atickNumber * asettings.ticksDistance;
      let p1, p2: A2D.Apg2DPoint;
      if (atype == eApgCadOrientations.horizontal) {
        p1 = new A2D.Apg2DPoint(tickValue + afirstTick, 0);
        p2 = new A2D.Apg2DPoint(tickValue + afirstTick, -tickSize);
      } else {
        p1 = new A2D.Apg2DPoint(0, tickValue + afirstTick);
        p2 = new A2D.Apg2DPoint(-tickSize, tickValue + afirstTick);
      }

      this.svgDoc
        .line(p1.x, p1.y, p2.x, p2.y)
        .stroke(asettings.tickStroke.color, asettings.tickStroke.width)
        .childOf(aancestor);

      if (asettings.drawBigTicksLables && isBigTick) {
        const topLeft = this.svgDoc.topLeft();
        const value = tickValue +
          (
            (atype == eApgCadOrientations.horizontal)
              ? topLeft.x
              : topLeft.y
          );

        const labelPoint = new A2D.Apg2DPoint(p1.x, p1.y);
        if (asettings.labelsStyle) {
          if (atype == eApgCadOrientations.horizontal) {
            labelPoint.y -= (asettings.labelsStyle.size + tickSize);
          } else {
            labelPoint.x -=
              (asettings.labelsStyle.size /** value.toString().length*/ +
                tickSize);
            labelPoint.y -= (asettings.labelsStyle.size / 2.75);
          }
        }

        const label = this.svgDoc
          .text(labelPoint.x, labelPoint.y, value.toString())
          .childOf(aancestor);

        if (asettings.labelsStyle) {
          this.textStyle(label, asettings.labelsStyle);
        }
      }
    }
  }
}
