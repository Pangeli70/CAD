/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
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
      leading: 1.1
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
    const _b = acad.svg
      .rect(x, y, aoptions.w, aoptions.h)
      .childOf(g);

    const cx = x + aoptions.w / 2;
    const cy = y + aoptions.h / 2;

    const _t = acad.svg
      .text(x + aoptions.w, y + aoptions.h, aname, 0)
      .textStyle(this.getTestTextStyle(acad))
      .childOf(g)

    return { group: g, point: new A2D.Apg2DPoint(cx, cy), w: aoptions.w, h: aoptions.h };
  }


  protected static DrawCartouche(acad: ApgCadSvg) {
    const WIDTH = 2000;
    const HEIGHT = 500;

    const topRight = acad.svg.topRight();

    const x = (topRight.x - WIDTH);
    const y = (topRight.y - HEIGHT);

    acad.setCurrentLayer(eApgCadDftLayers.CARTOUCHE);
    acad.svg
      .rect(x, y, WIDTH, HEIGHT)
      .fill(eApgCadStdColors.NONE, 0)
      .childOf(acad.currentLayer);

    const currLayerDef = acad.layerDefs.get(acad.currentLayer.ID);
    const currTextStyle = currLayerDef!.textStyle;
    const titleTextStyle = Uts.ApgUtsObj.DeepCopy(currTextStyle) as Svg.IApgSvgTextStyle;
    const textStyle = Uts.ApgUtsObj.DeepCopy(currTextStyle) as Svg.IApgSvgTextStyle;
    textStyle.size /= 2;
    const titleY = topRight.y - (titleTextStyle.size * (titleTextStyle.leading || 1.1));

    acad.svg
      .text(x + (WIDTH / 2), titleY, acad.svg.title, 0)
      .textStyle(titleTextStyle)
      .stroke(eApgCadStdColors.NONE, 0)
      .childOf(acad.currentLayer);

    const descriptionY = titleY - (textStyle.size * (textStyle.leading || 1.1));
    acad.svg
      .text(x + (WIDTH / 2), descriptionY, acad.svg.description, 0)
      .textStyle(textStyle)
      .stroke(eApgCadStdColors.NONE, 0)
      .childOf(acad.currentLayer);

    const dateY = descriptionY - (textStyle.size * (textStyle.leading || 1.1));
    const date = new Date().toISOString();
    acad.svg
      .text(x + (WIDTH / 2), dateY, date, 0)
      .textStyle(textStyle)
      .stroke(eApgCadStdColors.NONE, 0)
      .childOf(acad.currentLayer);
  }

  protected static Gui(acad: ApgCadSvg) {
    acad.setCurrentLayer(eApgCadDftLayers.GUI);
    this.GuiButton(acad);
    this.GuiMenu(acad);
    this.LayerBoardGui(acad);
  }

  static GuiButton(acad: ApgCadSvg) {
    const boundaries = acad.getBoundaries();
    acad.setCurrentLayer(eApgCadDftLayers.GUI);

    const currLayerDef = acad.layerDefs.get(acad.currentLayer.ID);
    const currTextStyle = currLayerDef!.textStyle;
    const textStyle = Uts.ApgUtsObj.DeepCopy(currTextStyle) as Svg.IApgSvgTextStyle;

    const textHeight = textStyle.size;

    const width = textHeight * 3;
    const height = (boundaries[1].y - boundaries[0].y) / 2;
    let x = boundaries[1].x - width;
    let y = boundaries[0].y + height / 2;
    const id = "BTN_GUI";
    acad.svg
      .rect(x, y, width, height, id)
      .fill(eApgCadStdColors.WHITE, 0)
      .attrib('onclick', "top.GuiButtonOnClick(event)")
      .attrib('show', "false")
      .attrib('style', "display:'block'")
      .childOf(acad.currentLayer)

    const text = 'Toolbar';

    x = x + (2 / 3 * width);
    y = boundaries[0].y
      + ((boundaries[1].y - boundaries[0].y) / 2)
      - (text.length * textStyle.size * textStyle.aspectRatio / 2);
    acad.svg
      .text(x, y, text, 0)
      .stroke(eApgCadStdColors.NONE, 0)
      .fill(eApgCadStdColors.BLUE)
      .rotate(90)
      .childOf(acad.currentLayer)
  }

  static GuiMenu(acad: ApgCadSvg) {
    const boundaries = acad.getBoundaries();
    acad.setCurrentLayer(eApgCadDftLayers.GUI);

    const currLayerDef = acad.layerDefs.get(acad.currentLayer.ID);
    const currTextStyle = currLayerDef!.textStyle;
    const textStyle = Uts.ApgUtsObj.DeepCopy(currTextStyle) as Svg.IApgSvgTextStyle;

    const textHeight = textStyle.size;
    const textWidth = textHeight * textStyle.aspectRatio;
    const guiButtonWidth = textHeight * 3;
    const MAX_CHARS = 40;

    const width = textWidth * MAX_CHARS;
    const height = (boundaries[1].y - boundaries[0].y) / 2;
    let x = boundaries[1].x - width - guiButtonWidth;
    let y = boundaries[0].y + height / 2;

    const r = acad.svg
      .group("GUI_MENU")
      .attrib('style', 'display:none')
      .childOf(acad.currentLayer);

    acad.svg
      .rect(x, y, width, height)
      .fill(eApgCadStdColors.ORANGE, 0)
      .childOf(r);

    let btnX = x + (textWidth);
    let btnY = y + height - textWidth - (textHeight * 3);
    acad.svg
      .rect(btnX, btnY, width - (2 * textWidth), textHeight * 3, 'BTN_LAYER_MENU')
      .fill(eApgCadStdColors.GRAY, 0)
      .attrib('onclick', "top.LayerBoardMenuOnClick(event)")
      .childOf(r)

    acad.svg
      .text(btnX, btnY, 'Layers', 0)
      .stroke(eApgCadStdColors.NONE, 0)
      .fill(eApgCadStdColors.BLUE)
      .childOf(r)

    return r;
  }

  static LayerBoardGui(acad: ApgCadSvg) {
    acad.setCurrentLayer(eApgCadDftLayers.GUI);
    const WIDTH = 200;
    const HEIGHT = 200;
    let y = 0;
    const DELTA_XY = 220;

    const r = acad.svg
      .group('LAYER_BOARD')
      .attrib('style', 'display:none')
      .childOf(acad.currentLayer);

    for (const layer of acad.layers.keys()) {
      const id = "BTN_LAYER_" + layer;
      acad.svg
        .rect(0, y, WIDTH, HEIGHT, id)
        .fill(eApgCadStdColors.GREEN, 0)
        .attrib('onclick', "top.LayerBoardButtonOnClick(event)")
        .attrib('show', "true")
        .childOf(r)

      acad.svg
        .text(DELTA_XY, y, layer, 0)
        .stroke(eApgCadStdColors.NONE, 0)
        .fill(eApgCadStdColors.BLUE)
        .childOf(r)

      y += DELTA_XY;
    }

  }

}