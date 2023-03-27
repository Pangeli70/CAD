/** -----------------------------------------------------------------------
 * @module [CAD/Test]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * @version 0.9.4 [APG 2023/01/04] Deno Deploy Beta
 * @version 0.9.5 [APG 2023/02/12] Improving Beta
 * -----------------------------------------------------------------------
*/

import { A2D, Svg, Uts } from "../../../deps.ts";
import { ApgCadSvg } from "../../../src/classes/ApgCadSvg.ts";
import { eApgCadDftLayers } from "../../../src/enums/eApgCadDftLayers.ts";
import { eApgCadDftStrokeWidths } from "../../../src/enums/eApgCadDftStrokeWidths.ts";
import { eApgCadDftTextStyles } from "../../../src/enums/eApgCadDftTextStyles.ts";
import { eApgCadStdColors } from "../../../src/enums/eApgCadStdColors.ts";
import { eApgCadTestLayers } from "../enums/eApgCadTestLayers.ts";

interface DefaultTesterOptions {
  w: number,
  h: number,
  dx: number,
  dy: number,
  itemsPerLine: number
}

export abstract class ApgCadBaseTester {

  private static _minRange = 0;
  private static _maxRange = 5000;
  private static _minN = 2;
  private static _maxN = 5;


  static SetMinMaxN(amin: number, amax: number) {
    this._minN = amin;
    this._maxN = amax;
  }

  static SetMinMaxRange(amin: number, amax: number) {
    this._minRange = amin;
    this._maxRange = amax;
  }

  protected static randomInt(aminVal: number, amaxVal: number) {
    return Math.round(Math.random() * (amaxVal - aminVal)) + aminVal;
  }

  protected static randomInN() {
    return this.randomInt(this._minN, this._maxN);
  }

  protected static randomInRange() {
    return this.randomInt(this._minRange, this._maxRange);
  }

  protected static randomLayer(alayers: Svg.ApgSvgNode[]) {
    return "T" + this.randomInt(1, alayers.length).toString();
  }

  protected static getLayerName(alayer: eApgCadTestLayers) {
    return "T" + (alayer + 1).toString();
  }

  protected static randomPoint(aminVal: number, maxVal: number) {
    const cx = this.randomInt(aminVal, maxVal);
    const cy = this.randomInt(aminVal, maxVal);
    const cp = new A2D.Apg2DPoint(cx, cy);
    return cp;
  }

  protected static randomPointInRange() {
    return this.randomPoint(this._minRange, this._maxRange);
  }

  protected static buildTestLayers(acad: ApgCadSvg) {

    const r: Svg.ApgSvgNode[] = [];

    acad.newStrokeStyle('GreenPen', {
      color: eApgCadStdColors.GREEN,
      width: 4
    });
    acad.newFillStyle('GreenBrush', {
      color: eApgCadStdColors.GREEN,
      opacity: 1
    });
    const layer1 = acad.newLayer('T1', 'GreenPen', 'GreenBrush', 'Mono');
    r.push(layer1);


    acad.newStrokeStyle('RedPen', {
      color: eApgCadStdColors.RED,
      width: 4
    });
    acad.newFillStyle('RedBrush', {
      color: eApgCadStdColors.RED,
      opacity: 1
    });
    const layer2 = acad.newLayer('T2', 'RedPen', 'RedBrush', 'Mono');
    r.push(layer2);


    acad.newStrokeStyle('CyanPen', {
      color: eApgCadStdColors.CYAN,
      width: 4
    });
    acad.newFillStyle('BlueBrush', {
      color: eApgCadStdColors.BLUE,
      opacity: 1
    });
    const layer3 = acad.newLayer('T3', 'CyanPen', 'BlueBrush', 'Mono');
    r.push(layer3);


    acad.newStrokeStyle('MagentaPen', {
      color: eApgCadStdColors.MAGENTA,
      width: 4
    });
    acad.newFillStyle('MagentaBrush', {
      color: eApgCadStdColors.MAGENTA,
      opacity: 1
    });
    const layer4 = acad.newLayer('T4', 'MagentaPen', 'MagentaBrush', 'Mono');
    r.push(layer4);

    acad.newStrokeStyle('YellowPen', {
      color: eApgCadStdColors.YELLOW,
      width: 4
    });
    acad.newFillStyle('YellowBrush', {
      color: eApgCadStdColors.YELLOW,
      opacity: 1
    });
    const layer5 = acad.newLayer('T5', 'YellowPen', 'YellowBrush', 'Mono');
    r.push(layer5);

    return r;
  }

  protected static notImplemented(acad: ApgCadSvg) {

    const ts = acad.textStyles.get(eApgCadDftTextStyles.DEBUG)
    const mid = (this._maxRange - this._minRange) / 2;
    acad.svg
      .text(mid, mid, 'NOT YET IMPLEMENTED', 0)
      .textStyle(ts!)
      .stroke(eApgCadStdColors.NONE, 0)
      .childOf(acad.currentLayer);
  }

  protected static getTestTextStyle(acad: ApgCadSvg) {
    const r: Svg.IApgSvgTextStyle = {
      size: acad.standardSize,
      fill: { color: acad.settings.foreGround.fillColor, opacity: 1 },
      stroke: { color: eApgCadStdColors.NONE, width: eApgCadDftStrokeWidths.NONE_0 },
      anchor: Svg.eApgSvgTextAnchor.end,
      aspectRatio: 0.5,
      lineHeight: 1.1
    }
    return r;
  }

  protected static getTestBox(acad: ApgCadSvg, anum: number, aname: string, aoptions?: DefaultTesterOptions) {

    if (aoptions == undefined) {
      aoptions = {
        w: 1000,
        h: 500,
        dx: 500,
        dy: 500,
        itemsPerLine: 4
      }
    }

    anum++;
    let numX = anum % aoptions.itemsPerLine;
    let numY = Math.trunc(anum / aoptions.itemsPerLine);
    if (numX == 0) {
      numX = aoptions.itemsPerLine;
      numY--;
    }
    numX--;

    const x = aoptions.dx + (numX * (aoptions.w + aoptions.dx));
    const y = aoptions.dy + (numY * (aoptions.h + aoptions.dy));
    const g = acad.svg.group();
    const rect = acad.svg
      .rect(x, y, aoptions.w, aoptions.h)
      .childOf(g);

    const cx = x + aoptions.w / 2;
    const cy = y + aoptions.h / 2;

    const textStyle = this.getTestTextStyle(acad);

    const _t = acad.svg
      .text(x + aoptions.w, y + (1.1 * aoptions.h), aname, 0)
      .textStyle(textStyle)
      .childOf(g)

    return { group: g, rect, point: new A2D.Apg2DPoint(cx, cy), w: aoptions.w, h: aoptions.h };
  }

  protected static DrawCartouche(acad: ApgCadSvg) {

    acad.setCurrentLayer(eApgCadDftLayers.CARTOUCHE);
    const currLayerDef = acad.layerDefs.get(acad.currentLayer.ID);
    const currTextStyle = currLayerDef!.textStyle;
    const titleTextStyle = Uts.ApgUtsObj.DeepCopy(currTextStyle) as Svg.IApgSvgTextStyle;
    const descrTextStyle = Uts.ApgUtsObj.DeepCopy(currTextStyle) as Svg.IApgSvgTextStyle;
    descrTextStyle.size /= 2;
    const titleTextStyleHeight = (titleTextStyle.size * (titleTextStyle.lineHeight || 1.1));
    const titleBottomPadding = (titleTextStyle.size * ((titleTextStyle.lineHeight || 1.1) - 1));
    const descrTextStyleHeight = (descrTextStyle.size * (descrTextStyle.lineHeight || 1.1));
    const WIDTH = (acad.svg.title.length + 4) * titleTextStyle.size * titleTextStyle.aspectRatio
    const HEIGHT = titleTextStyleHeight + 2 * descrTextStyleHeight + titleBottomPadding;

    const topRight = acad.svg.topRight();

    const x = (topRight.x - WIDTH);
    const y = (topRight.y - HEIGHT);

    const titleY = topRight.y - titleTextStyleHeight;

    acad.svg
      .rect(x, y, WIDTH, HEIGHT)
      .fill(eApgCadStdColors.NONE, 0)
      .childOf(acad.currentLayer);

    acad.svg
      .text(x + (WIDTH / 2), titleY, acad.svg.title, 0)
      .textStyle(titleTextStyle)
      .childOf(acad.currentLayer);

    const descriptionY = titleY - descrTextStyleHeight;
    acad.svg
      .text(x + (WIDTH / 2), descriptionY, acad.svg.description, 0)
      .textStyle(descrTextStyle)
      .childOf(acad.currentLayer);

    const dateY = descriptionY - descrTextStyleHeight;
    const date = new Date().toISOString();
    acad.svg
      .text(x + (WIDTH / 2), dateY, date, 0)
      .textStyle(descrTextStyle)
      .childOf(acad.currentLayer);
  }




}