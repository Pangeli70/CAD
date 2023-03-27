/** -----------------------------------------------------------------------
 * @module [CAD-Svg]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * @version 0.9.4 [APG 2023/01/04] Deno Deploy Beta
 * @version 0.9.6 [APG 2023/03/19] Draw ticks using patterns
 * -----------------------------------------------------------------------
 */

import { A2D, Svg } from "../../../deps.ts";
import { eApgCadOrientations } from "../../enums/eApgCadOrientations.ts";
import { eApgCadFactories } from "../../enums/eApgCadFactories.ts";
import { IApgCadSvgCartesians } from "../../interfaces/IApgCadSvgCartesians.ts";
import { ApgCadSvg } from "../ApgCadSvg.ts";
import { ApgCadSvgFactoryBase } from "./ApgCadSvgFactoryBase.ts";
import { eApgCadDftPatterns } from "../../enums/eApgCadDftPatterns.ts";


interface IApgCadAxisTickData {
  p1: A2D.Apg2DPoint;
  p2: A2D.Apg2DPoint;
  isBigTick: boolean;
  tickValue: number;
  tickSize: number;
}


export class ApgCadSvgCartesiansFactory extends ApgCadSvgFactoryBase {

  public constructor(acad: ApgCadSvg) {
    super(acad, eApgCadFactories.CARTESIANS);
  }

  build(
    aparent: Svg.ApgSvgNode,
    atype: eApgCadOrientations,
    asettings: IApgCadSvgCartesians,
  ) {
    const r = this.cad.svg
      .group()
      .stroke(asettings.axisStroke.color, asettings.axisStroke.width)
      .childOf(aparent);

    const topLeft = this.cad.svg.bottomLeft();
    const bottomRight = this.cad.svg.topRight();

    let p1, p2: A2D.Apg2DPoint;
    if (atype == eApgCadOrientations.horizontal) {
      p1 = new A2D.Apg2DPoint(topLeft.x, 0);
      p2 = new A2D.Apg2DPoint(bottomRight.x, 0);
    } else {
      p1 = new A2D.Apg2DPoint(0, topLeft.y);
      p2 = new A2D.Apg2DPoint(0, bottomRight.y);
    }

    this.cad.svg
      .line(p1.x, p1.y, p2.x, p2.y)
      .childOf(r);

    this.#drawTicks(r, atype, asettings);

    return r;
  }

  #drawTicks(
    aparent: Svg.ApgSvgNode,
    atype: eApgCadOrientations,
    asettings: IApgCadSvgCartesians,
  ) {
    const bottomLeft = this.cad.svg.bottomLeft();
    const topRight = this.cad.svg.topRight();
    let x = 0, y = 0, w = 0, h = 0;
    if (atype == eApgCadOrientations.horizontal) {
      x = bottomLeft.x;
      y = -asettings.bigTicksSize;
      w = topRight.x - bottomLeft.x;
      h = asettings.bigTicksSize;
    }
    else {
      x = -asettings.bigTicksSize;
      y = bottomLeft.y;
      w = asettings.bigTicksSize;
      h = topRight.y - bottomLeft.y;
    }
    const r = this.cad.svg
      .rect(x, y, w, h)
      .stroke('none', 0)
      .fillPattern(eApgCadDftPatterns.CARTESIAN_HORIZONTAL)
      .childOf(aparent);

    if (atype == eApgCadOrientations.vertical) {
      r.fillPattern(eApgCadDftPatterns.CARTESIAN_VERTICAL)
    }

    let firstTick: number;
    let lastTick: number;
    let ticksNum: number;
    const topLeft = this.cad.svg.bottomLeft();
    const bottomRight = this.cad.svg.topRight();

    if (atype == eApgCadOrientations.horizontal) {

      firstTick = Math.floor(topLeft.x / asettings.ticksStep) * asettings.ticksStep;
      lastTick = Math.floor(bottomRight.x / asettings.ticksStep) * asettings.ticksStep;
      ticksNum = (lastTick - firstTick) / asettings.ticksStep;

    } else {

      firstTick = Math.floor(topLeft.y / asettings.ticksStep) * asettings.ticksStep;
      lastTick = Math.floor(bottomRight.y / asettings.ticksStep) * asettings.ticksStep;
      ticksNum = (lastTick - firstTick) / asettings.ticksStep;
    }

    const ticksG = this.cad.svg
      .group()
      .childOf(aparent);

    const labelsG = this.cad.svg
      .group()
      .childOf(aparent);

    if (asettings.labelsStyle) {
      labelsG.textStyle(asettings.labelsStyle);
    }

    let currentTick = 0;
    do {
      const tickData = this.#getTickData(asettings, atype, currentTick, firstTick);
      // this.#drawTick(ticksG, asettings, tickData);
      this.#drawTickLabel(labelsG, asettings, atype, tickData);
      currentTick++;
    } while (currentTick <= ticksNum);
  }

  #getTickData(
    aaxis: IApgCadSvgCartesians,
    atype: eApgCadOrientations,
    atickNumber: number,
    afirstTick: number,
  ) {
    const tickValue = (atickNumber * aaxis.ticksStep) + afirstTick;
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
    aparent: Svg.ApgSvgNode,
    aaxis: IApgCadSvgCartesians,
    atickData: IApgCadAxisTickData,
  ) {
    if (aaxis.drawTicks) {

      this.cad.svg
        .line(atickData.p1.x, atickData.p1.y, atickData.p2.x, atickData.p2.y)
        .childOf(aparent);
    }
  }

  #drawTickLabel(
    aparent: Svg.ApgSvgNode,
    aaxis: IApgCadSvgCartesians,
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

        const _label = this.cad.svg
          .text(labelPoint.x, labelPoint.y, atickData.tickValue.toString(), 0)
          .childOf(aparent);
      }
    }
  }
}


