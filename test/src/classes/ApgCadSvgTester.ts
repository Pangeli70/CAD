/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/21] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * -----------------------------------------------------------------------
 */


import { A2D, Svg } from '../../../deps.ts';
import { ApgCadSvg } from "../../../src/classes/ApgCadSvg.ts";
import { eApgCadStdColors } from "../../../src/enums/eApgCadStdColors.ts";
import { eApgCadTestSvg } from "../enums/eApgCadTestSvg.ts";
import { ApgCadBaseTester } from "./ApgCadBaseTester.ts";


export class ApgCadSvgTester extends ApgCadBaseTester {


  static testRawPoints(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Test Random Points";
    cad.svg.description = "Apg Svg Cad";
    const layers = this.buildTestLayers(cad);
    const layId = this.randomLayer(layers);
    cad.setCurrentLayer(layId);

    for (let i = 0; i < this.randomInN(); i++) {
      const cx = this.randomInRange();
      const cy = this.randomInRange();
      cad.svg
        .circle(cx, cy, 20)
        .childOf(cad.currentLayer);
    }
    this.DrawCartouche(cad);
    this.Gui(cad);
    return cad.svg.render();
  }


  static testRawLines(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Test Random Lines";
    cad.svg.description = "Apg Svg Cad";
    const layers = this.buildTestLayers(cad);
    const layId = this.randomLayer(layers);
    cad.setCurrentLayer(layId);

    for (let i = 0; i < this.randomInN(); i++) {
      const x1 = this.randomInRange();
      const y1 = this.randomInRange();
      const x2 = this.randomInRange();
      const y2 = this.randomInRange();

      cad.svg
        .line(x1, y1, x2, y2)
        .childOf(cad.currentLayer);
    }
    this.DrawCartouche(cad);
    this.Gui(cad);
    return cad.svg.render();
  }


  static testRawPolyLines(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Test Random Polylines";
    cad.svg.description = "Apg Svg Cad";
    const layers = this.buildTestLayers(cad);
    const layId = this.randomLayer(layers);
    cad.setCurrentLayer(layId);

    const maxPtsInPolyLine = 10;

    for (let i = 0; i < this.randomInN(); i++) {

      const np = 2 + Math.floor(Math.random() * (maxPtsInPolyLine - 2));

      const minD = -100;
      const maxD = 100;

      const pts: A2D.Apg2DPoint[] = [];
      for (let j = 0; j < np; j++) {

        let x, y;
        if (j === 0) {
          x = this.randomInRange();
          y = this.randomInRange();
        }
        else {
          x = this.randomInt(minD, maxD);
          y = this.randomInt(minD, maxD);

          x = pts[j - 1].x + x;
          y = pts[j - 1].y + y;
        }
        const pt = new A2D.Apg2DPoint(x, y);
        pts.push(pt);
      }
      cad.svg
        .polyline(pts)
        .fill(eApgCadStdColors.NONE)
        .childOf(cad.currentLayer);
    }
    this.DrawCartouche(cad);
    this.Gui(cad);
    return cad.svg.render();
  }


  static testRawCircles(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Test Random Circles";
    cad.svg.description = "Apg Svg Cad";
    const layers = this.buildTestLayers(cad);
    const layId = this.randomLayer(layers);
    cad.setCurrentLayer(layId);

    const maxR = 500;
    const minR = 50;

    for (let i = 0; i < this.randomInN(); i++) {
      const cx = this.randomInRange();
      const cy = this.randomInRange();
      const r = this.randomInt(minR, maxR);
      cad.svg
        .circle(cx, cy, r)
        .fill(eApgCadStdColors.NONE)
        .childOf(cad.currentLayer);
    }
    this.DrawCartouche(cad);
    this.Gui(cad);
    return cad.svg.render();
  }


  static testRawArcs(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Test Random Arcs";
    cad.svg.description = "Apg Svg Cad";
    const layers = this.buildTestLayers(cad);
    const layId = this.randomLayer(layers);
    cad.setCurrentLayer(layId);

    const maxR = 1000;
    const minR = 200;

    for (let i = 0; i < this.randomInN(); i++) {
      const cx = this.randomInRange();
      const cy = this.randomInRange();
      const r = this.randomInt(minR, maxR);
      const begin = this.randomInt(0, 360);
      const end = this.randomInt(0, 360);
      cad.svg
        .arc(cx, cy, r, begin, end)
        .fill(eApgCadStdColors.NONE)
        .childOf(cad.currentLayer);
    }
    this.DrawCartouche(cad);
    this.Gui(cad);
    return cad.svg.render();
  }


  static testRawText(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Test Random Texts";
    cad.svg.description = "Apg Svg Cad";
    const layers = this.buildTestLayers(cad);
    const layId = this.randomLayer(layers);
    cad.setCurrentLayer(layId);

    const strings = [
      'We love APG CAD',
      'APG CAD is fun',
      'APG CAD its easy',
      'APG CAD don\'t lie',
      'APG CAD\nNow multiline!'
    ];

    const testTextStyle = this.getTestTextStyle(cad);
    testTextStyle.anchor = Svg.eApgSvgTextAnchor.middle;

    for (let i = 0; i < this.randomInN(); i++) {

      const stringId = this.randomInt(0, strings.length - 1);

      const p1 = this.randomPointInRange();
      const p2 = this.randomPointInRange();
      const midPoint = p1.halfwayFrom(p2);
      const line = new A2D.Apg2DLine(p1, p2);
      const textLineHeight = (testTextStyle.size + testTextStyle.leading!);
      cad.svg
        .line(p1.x, p1.y, p2.x, p2.y)
        .childOf(cad.currentLayer);
      cad.svg
        .circle(p1.x, p1.y, 20)
        .childOf(cad.currentLayer);
      cad.svg
        .text(midPoint.x, midPoint.y, strings[stringId], textLineHeight)
        .textStyle(testTextStyle)
        //.rotate(line.angle, midPoint.x, midPoint.y)
        .rotate(line.angle)
        .stroke(eApgCadStdColors.NONE, 0)
        .childOf(cad.currentLayer);
    }
    this.DrawCartouche(cad);
    this.Gui(cad);
    return cad.svg.render();
  }


  static testRawImages(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Test Image";
    cad.svg.description = "Apg Svg Cad";
    const layers = this.buildTestLayers(cad);
    const layId = this.randomLayer(layers);
    cad.setCurrentLayer(layId);

    const imagesRefs = [
      'https://picsum.photos/id/' + this.randomInt(0, 220).toString() + '/400/300',
      'https://picsum.photos/id/' + this.randomInt(0, 220).toString() + '/400/300',
      'https://picsum.photos/id/' + this.randomInt(0, 220).toString() + '/400/300',
      'https://picsum.photos/id/' + this.randomInt(0, 220).toString() + '/400/300',
      'https://picsum.photos/id/' + this.randomInt(0, 220).toString() + '/400/300',
    ];


    for (let i = 0; i < this.randomInN(); i++) {

      const stringId = this.randomInt(0, imagesRefs.length - 1);

      const p1 = this.randomPointInRange();
      const p2 = this.randomPointInRange();
      const midPoint = p1.halfwayFrom(p2);

      cad.svg
        .rect(p1.x, p1.y, 800, 600)
        .childOf(cad.currentLayer);

      cad.svg
        .image(p1.x, p1.y, 800, 600, imagesRefs[i])
        .childOf(cad.currentLayer);

    }
    this.DrawCartouche(cad);
    this.Gui(cad);
    return cad.svg.render();
  }


  static testAspectRatios(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Test Aspect Ratios";
    cad.svg.description = "Apg Svg Cad";

    const styles = Array.from(cad.textStyles.keys());

    const RULER = "AaBbCcDd IiJjKkLl WwXxYyZz 01234 ,./(!?;"
    const START = 200;
    let currY = START;

    const testTextStyle = this.getTestTextStyle(cad);
    testTextStyle.anchor = Svg.eApgSvgTextAnchor.start;

    for (let i = 0; i < styles.length; i++) {
      const style = styles[i];

      const ts = cad.getTextStyle(style);
      if (!ts) {
        throw new Error("Style [" + style + "] Not found")
      }
      const charWidth = ts.size * (ts.aspectRatio || 0.5)
      const rulerWidth = RULER.length * charWidth;
      const textLineHeight = (ts.size * (ts.leading || 1.2));
      const totalW = START + rulerWidth;

      const tx = (ts!.anchor && ts.anchor == Svg.eApgSvgTextAnchor.middle) ?
        START + rulerWidth / 2 :
        START

      cad.svg
        .line(START, currY, totalW, currY)
        .childOf(cad.currentLayer);
      cad.svg
        .text(tx, currY, RULER, textLineHeight)
        .textStyle(ts)
        .childOf(cad.currentLayer);
      cad.svg
        .text(totalW + START, currY, style + " - " + ts.font + " W/H:" + ts.aspectRatio.toFixed(3), textLineHeight)
        .textStyle(testTextStyle)
        .childOf(cad.currentLayer);


      currY += textLineHeight;
    }
    this.DrawCartouche(cad);
    this.Gui(cad);
    return cad.svg.render();
  }


  static testRawPaths(aisBlackBack = false) {
    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Test Random Paths";
    cad.svg.description = "Apg Svg Cad";
    const layers = this.buildTestLayers(cad);
    const layId = this.randomLayer(layers);
    cad.setCurrentLayer(layId);

    this.notImplemented(cad);

    this.DrawCartouche(cad);
    this.Gui(cad);
    return cad.svg.render();
  }


  static RunTest(atest: eApgCadTestSvg, aisBlackBack = false) {

    let r = "";
    switch (atest) {
      case eApgCadTestSvg.POINTS:
        r = this.testRawPoints(aisBlackBack);
        break;
      case eApgCadTestSvg.LINES:
        r = this.testRawLines(aisBlackBack);
        break;
      case eApgCadTestSvg.POLYLINES:
        r = this.testRawPolyLines(aisBlackBack);
        break;
      case eApgCadTestSvg.ARCS:
        r = this.testRawArcs(aisBlackBack);
        break;
      case eApgCadTestSvg.CIRCLES:
        r = this.testRawCircles(aisBlackBack);
        break;
      case eApgCadTestSvg.TEXTS:
        r = this.testRawText(aisBlackBack);
        break;
      case eApgCadTestSvg.PATHS:
        r = this.testRawPaths(aisBlackBack);
        break;
      case eApgCadTestSvg.IMAGES:
        r = this.testRawImages(aisBlackBack);
        break;
      case eApgCadTestSvg.ASPECT_RATIOS:
        r = this.testAspectRatios(aisBlackBack);
        break;
    }

    return r;
  }

}

