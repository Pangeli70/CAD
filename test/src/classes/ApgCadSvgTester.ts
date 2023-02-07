/** -----------------------------------------------------------------------
 * @module [CAD/Test]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/21] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * @version 0.9.4 [APG 2023/01/04] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */


import { A2D, Svg, Uts } from '../../../deps.ts';
import { ApgCadSvg } from "../../../src/classes/ApgCadSvg.ts";
import { eApgCadStdColors } from "../../../src/enums/eApgCadStdColors.ts";
import { eApgCadTestSvg } from "../enums/eApgCadTestSvg.ts";
import { ApgCadBaseTester } from "./ApgCadBaseTester.ts";


export class ApgCadSvgTester extends ApgCadBaseTester {



  static async RunTest(atest: eApgCadTestSvg, aisBlackBack = false) {

    let cad: ApgCadSvg | undefined = undefined;
    switch (atest) {
      case eApgCadTestSvg.POINTS:
        cad = await this.testRawPoints(aisBlackBack);
        break;
      case eApgCadTestSvg.LINES:
        cad = await this.testRawLines(aisBlackBack);
        break;
      case eApgCadTestSvg.POLYLINES:
        cad = await this.testRawPolyLines(aisBlackBack);
        break;
      case eApgCadTestSvg.ARCS:
        cad = await this.testRawArcs(aisBlackBack);
        break;
      case eApgCadTestSvg.CIRCLES:
        cad = await this.testRawCircles(aisBlackBack);
        break;
      case eApgCadTestSvg.TEXTS:
        cad = await this.testRawText(aisBlackBack);
        break;
      case eApgCadTestSvg.PATHS:
        cad = await this.testPaths(aisBlackBack);
        break;
      case eApgCadTestSvg.IMAGES:
        cad = await this.testRawImages(aisBlackBack);
        break;
      case eApgCadTestSvg.ASPECT_RATIOS:
        cad = await this.testAspectRatios(aisBlackBack);
        break;
    }

    if (cad) {
      this.DrawCartouche(cad);
      this.Gui(cad);
    }
    return cad;

  }



  static async testRawPoints(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    await cad.init();

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
    return cad;
  }


  static async testRawLines(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    await cad.init();

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

    return cad;
  }


  static async testRawPolyLines(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    await cad.init();

    cad.svg.title = "Test Random Polylines";
    cad.svg.description = "Apg Svg Cad";
    const layers = this.buildTestLayers(cad);
    const layId = this.randomLayer(layers);
    cad.setCurrentLayer(layId);

    const maxPtsInPolyLine = 10;

    for (let i = 0; i < this.randomInN(); i++) {

      const np = 2 + Math.floor(Math.random() * (maxPtsInPolyLine - 2));

      const minD = -1000;
      const maxD = 1000;

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

    return cad;
  }


  static async testRawCircles(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    await cad.init();

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

    return cad;
  }


  static async testRawArcs(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    await cad.init();

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

    return cad;
  }


  static async testRawText(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    await cad.init();

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
        .rotate(line.angle)
        .stroke(eApgCadStdColors.NONE, 0)
        .childOf(cad.currentLayer);
    }

    return cad;
  }


  static async testRawImages(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    await cad.init();

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

      const p1 = this.randomPointInRange();

      cad.svg
        .rect(p1.x, p1.y, 800, 600)
        .childOf(cad.currentLayer);

      cad.svg
        .image(p1.x, p1.y, 800, 600, imagesRefs[i])
        .childOf(cad.currentLayer);

    }

    return cad;
  }


  static async testAspectRatios(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    await cad.init();

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


      currY += 400;
    }

    return cad;
  }


  static async testPaths(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    await cad.init();

    cad.svg.title = "Test Random Paths";
    cad.svg.description = "Apg Svg Cad";
    const layers = this.buildTestLayers(cad);
    const layId = this.randomLayer(layers);
    cad.setCurrentLayer(layId);

    const MAX_COMMANDS_IN_PATH = 10;
    const pointsPoolSize = MAX_COMMANDS_IN_PATH * 4;

    for (let i = 0; i < this.randomInN(); i++) {

      let relPoint: A2D.Apg2DPoint;
      const relPointsPool: A2D.Apg2DPoint[] = [];
      let absPoint: A2D.Apg2DPoint;
      const absPointsPool: A2D.Apg2DPoint[] = [];

      const minD = -1000;
      const maxD = 1000;

      for (let j = 0; j < pointsPoolSize; j++) {

        let x, y;
        if (j === 0) {
          x = this.randomInRange();
          y = this.randomInRange();
          relPoint = new A2D.Apg2DPoint(x, y);
          absPoint = new A2D.Apg2DPoint(x, y);
        }
        else {
          x = this.randomInt(minD, maxD);
          y = this.randomInt(minD, maxD);
          relPoint = new A2D.Apg2DPoint(x, y);

          x = absPointsPool[j - 1].x + x;
          y = absPointsPool[j - 1].y + y;
          absPoint = new A2D.Apg2DPoint(x, y);
        }
        relPointsPool.push(relPoint);
        absPointsPool.push(absPoint);
      }

      const pathBuilder = new Svg.ApgSvgPathBuilder();
      const pathCommands = Uts.ApgUtsEnum.StringValues(Svg.eApgSvgPathCommands);

      const numCommands = this.randomInt(5, MAX_COMMANDS_IN_PATH);

      let pointIndex = 0;
      for (let i = 0; i < numCommands; i++) {
        if (i == 0) {
          pathBuilder.moveAbs(absPointsPool[pointIndex].x, absPointsPool[pointIndex].y);
        }
        else {
          const commandIndex = this.randomInt(0, pathCommands.length);
          const command = pathCommands[commandIndex] as Svg.eApgSvgPathCommands;
          switch (command) {
            case Svg.eApgSvgPathCommands.ARC_ABS: {
              pointIndex++;
              const p1 = absPointsPool[pointIndex];
              pathBuilder.arcRel(p1.x, p1.y, 1, 1, 0, false, false);
              break;
            }
            case Svg.eApgSvgPathCommands.ARC_REL: {
              pointIndex++;
              const p1 = relPointsPool[pointIndex];
              pathBuilder.arcRel(p1.x, p1.y, 1, 1, 0, false, false);
              break;
            }
            case Svg.eApgSvgPathCommands.CLOSE_ABS: {
              pathBuilder.close();
              break;
            }
            case Svg.eApgSvgPathCommands.CLOSE_REL: {
              pathBuilder.close();
              break;
            }
            case Svg.eApgSvgPathCommands.CUBIC_CURVE_ABS: {
              pointIndex++;
              const p1 = absPointsPool[pointIndex];
              pointIndex++;
              const p2 = absPointsPool[pointIndex];
              pointIndex++;
              const p3 = absPointsPool[pointIndex];
              pathBuilder.cubicAbs(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
              break;
            }
            case Svg.eApgSvgPathCommands.CUBIC_CURVE_REL: {
              pointIndex++;
              const p1 = relPointsPool[pointIndex];
              pointIndex++;
              const p2 = relPointsPool[pointIndex];
              pointIndex++;
              const p3 = relPointsPool[pointIndex];
              pathBuilder.cubicRel(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
              break;
            }
            case Svg.eApgSvgPathCommands.LINE_ABS: {
              pointIndex++;
              const p1 = absPointsPool[pointIndex];
              pathBuilder.lineAbs(p1.x, p1.y);
              break;
            }
            case Svg.eApgSvgPathCommands.LINE_REL: {
              pointIndex++;
              const p1 = relPointsPool[pointIndex];
              pathBuilder.lineRel(p1.x, p1.y);
              break;
            }
            case Svg.eApgSvgPathCommands.LINE_HOR_ABS: {
              pointIndex++;
              const p1 = absPointsPool[pointIndex];
              pathBuilder.lineHorizontalAbs(p1.x);
              break;
            }
            case Svg.eApgSvgPathCommands.LINE_HOR_REL: {
              pointIndex++;
              const p1 = relPointsPool[pointIndex];
              pathBuilder.lineHorizontalRel(p1.x);
              break;
            }
            case Svg.eApgSvgPathCommands.LINE_VERT_ABS: {
              pointIndex++;
              const p1 = absPointsPool[pointIndex];
              pathBuilder.lineVerticalAbs(p1.y);
              break;
            }
            case Svg.eApgSvgPathCommands.LINE_VERT_REL: {
              pointIndex++;
              const p1 = relPointsPool[pointIndex];
              pathBuilder.lineVerticalRel(p1.y);
              break;
            }
            case Svg.eApgSvgPathCommands.MOVE_ABS: {
              pointIndex++;
              const p1 = absPointsPool[pointIndex];
              pathBuilder.moveAbs(p1.x, p1.y);
              break;
            }
            case Svg.eApgSvgPathCommands.MOVE_REL: {
              pointIndex++;
              const p1 = relPointsPool[pointIndex];
              pathBuilder.moveRel(p1.x, p1.y);
              break;
            }
            case Svg.eApgSvgPathCommands.QUADRATIC_CURVE_ABS: {
              pointIndex++;
              const p1 = absPointsPool[pointIndex];
              pointIndex++;
              const p2 = absPointsPool[pointIndex];
              pathBuilder.quadraticAbs(p1.x, p1.y, p2.x, p2.y);
              break;
            }
            case Svg.eApgSvgPathCommands.QUADRATIC_CURVE_REL: {
              pointIndex++;
              const p1 = relPointsPool[pointIndex];
              pointIndex++;
              const p2 = relPointsPool[pointIndex];
              pathBuilder.quadraticRel(p1.x, p1.y, p2.x, p2.y);
              break;
            }
            case Svg.eApgSvgPathCommands.SMOOTH_QUADRATIC_CURVE_ABS: {
              pointIndex++;
              const p1 = relPointsPool[pointIndex];
              pathBuilder.quadraticSmoothRel(p1.x, p1.y,);
              break;
            }
            case Svg.eApgSvgPathCommands.SMOOTH_QUADRATIC_CURVE_REL: {
              pointIndex++;
              const p1 = absPointsPool[pointIndex];
              pathBuilder.quadraticSmoothAbs(p1.x, p1.y,);
              break;
            }

          }
        }
      }

      const path = pathBuilder.build();
      cad.svg
        .path(path)
        .fill(eApgCadStdColors.NONE)
        .childOf(cad.currentLayer);
    }

    return cad;
  }



}

