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
import { eApgCadOrientations } from "../../enums/eApgCadOrientations.ts";
import { eApgCadPrimitiveFactoryTypes } from "../../enums/eApgCadPrimitiveFactoryTypes.ts";
import { IApgCadSvgAxis } from "../../interfaces/IApgCadSvgAxis.ts";
import { ApgCadSvgPrimitivesFactory } from "./ApgCadSvgPrimitivesFactory.ts";


interface IApgCadAxisTickData {
  p1: A2D.Apg2DPoint;
  p2: A2D.Apg2DPoint;
  isBigTick: boolean;
  tickValue: number;
  tickSize: number;
}


export class ApgCadSvgAxisFactory extends ApgCadSvgPrimitivesFactory {

  public constructor(adoc: Svg.ApgSvgDoc, anode: Svg.ApgSvgNode) {
    super(adoc, anode, eApgCadPrimitiveFactoryTypes.AXISES);
  }

  build(
    atype: eApgCadOrientations,
    asettings: IApgCadSvgAxis,
    alayer?: Svg.ApgSvgNode,
  ) {
    const r = this._svgDoc.group();
    r
      .stroke(asettings.axisStroke.color, asettings.axisStroke.width)
      .childOf(alayer ? alayer : this._parent);

    const topLeft = this._svgDoc.topLeft();
    const bottomRight = this._svgDoc.bottomRight();

    let p1, p2: A2D.Apg2DPoint;
    if (atype == eApgCadOrientations.horizontal) {
      p1 = new A2D.Apg2DPoint(topLeft.x, 0);
      p2 = new A2D.Apg2DPoint(bottomRight.x, 0);
    } else {
      p1 = new A2D.Apg2DPoint(0, topLeft.y);
      p2 = new A2D.Apg2DPoint(0, bottomRight.y);
    }

    this._svgDoc
      .line(p1.x, p1.y, p2.x, p2.y)
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
    const topLeft = this._svgDoc.topLeft();
    const bottomRight = this._svgDoc.bottomRight();

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

    const ticksG = this._svgDoc.group().childOf(aancestor);

    const labelsG = this._svgDoc.group().childOf(aancestor);
    if (aaxis.labelsStyle) {
      labelsG.textStyle(aaxis.labelsStyle);
    }


    let currentTick = 0;
    do {
      const tickData = this.#getTickData(aaxis, atype, currentTick, firstTick);
      this.#drawTick(ticksG, aaxis, tickData);
      this.#drawTickLabel(labelsG, aaxis, atype, tickData);
      currentTick++;
    } while (currentTick <= ticksNum);
  }

  #getTickData(
    aaxis: IApgCadSvgAxis,
    atype: eApgCadOrientations,
    atickNumber: number,
    afirstTick: number,
  ) {
    const tickValue = (atickNumber * aaxis.ticksDistance) + afirstTick;
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
    return { p1, p2, isBigTick, tickValue, tickSize } as IApgCadAxisTickData
  }

  #drawTick(
    aancestor: Svg.ApgSvgNode,
    aaxis: IApgCadSvgAxis,
    atickData: IApgCadAxisTickData,
  ) {
    if (aaxis.drawTicks) {

      this._svgDoc
        .line(atickData.p1.x, atickData.p1.y, atickData.p2.x, atickData.p2.y)
        .childOf(aancestor);
    }
  }

  #drawTickLabel(
    aancestor: Svg.ApgSvgNode,
    aaxis: IApgCadSvgAxis,
    atype: eApgCadOrientations,
    atickData: IApgCadAxisTickData,
  ) {
    if (aaxis.drawTicks) {

      if (aaxis.drawBigTicksLables && atickData.isBigTick) {

        const labelPoint = new A2D.Apg2DPoint(atickData.p1.x, atickData.p1.y);
        if (aaxis.labelsStyle) {
          if (atype == eApgCadOrientations.horizontal) {
            labelPoint.y -= (aaxis.labelsStyle.size + atickData.tickSize);
          } else {
            labelPoint.x -= (aaxis.labelsStyle.size + atickData.tickSize);
            labelPoint.y -= (aaxis.labelsStyle.size / 2.75);
          }
        }

        const _label = this._svgDoc
          .text(labelPoint.x, labelPoint.y, atickData.tickValue.toString())
          .childOf(aancestor);
      }
    }
  }
}


