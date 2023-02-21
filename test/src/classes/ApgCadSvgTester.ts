/** -----------------------------------------------------------------------
 * @module [CAD/Test]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/21] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * @version 0.9.4 [APG 2023/01/04] Deno Deploy Beta
 * @version 0.9.5 [APG 2023/02/12] Improving Beta
 * -----------------------------------------------------------------------
 */


import { A2D, Svg, Uts } from '../../../deps.ts';
import { ApgCadSvg } from "../../../src/classes/ApgCadSvg.ts";
import { eApgCadStdColors } from "../../../src/enums/eApgCadStdColors.ts";
import { IApgCadSvgOptions } from "../../../src/interfaces/IApgCadSvgOptions.ts";
import { eApgCadTestSvg } from "../enums/eApgCadTestSvg.ts";
import { IApgCadTestParameters } from "../interfaces/IApgCadTestParameters.ts";

import { ApgCadBaseTester } from "./ApgCadBaseTester.ts";


export class ApgCadSvgTester extends ApgCadBaseTester {


  static async RunTest(
    aparams: IApgCadTestParameters
  ) {

    const options: IApgCadSvgOptions = {
      name: aparams.name,
      blackBack: aparams.blackBack,
      gridMode: aparams.gridMode,
      cartesiansMode: aparams.cartesianMode,
      debug: aparams.debug
    }

    const cad = await ApgCadSvg.New(options);
    cad.svg.title = "Apg Cad Test";

    const layers = this.buildTestLayers(cad);
    const layId = this.randomLayer(layers);
    cad.setCurrentLayer(layId);

    const type = aparams.name as eApgCadTestSvg;

    switch (type) {
      case eApgCadTestSvg.POINTS:
        this.testRawPoints(cad);
        break;
      case eApgCadTestSvg.LINES:
        this.testRawLines(cad);
        break;
      case eApgCadTestSvg.POLYLINES:
        this.testRawPolyLines(cad, aparams.random);
        break;
      case eApgCadTestSvg.POLYGONS:
        this.testRawPolygons(cad, aparams.random);
        break;
      case eApgCadTestSvg.ARCS:
        this.testRawArcs(cad);
        break;
      case eApgCadTestSvg.CIRCLES:
        this.testRawCircles(cad);
        break;
      case eApgCadTestSvg.TEXTS:
        this.testRawText(cad);
        break;
      case eApgCadTestSvg.PATHS:
        this.testRawPaths(cad, aparams.random);
        break;
      case eApgCadTestSvg.IMAGES:
        this.testRawImages(cad);
        break;
      case eApgCadTestSvg.ASPECT_RATIOS:
        this.testAspectRatios(cad);
        break;
    }

    if (cad) {
      this.DrawCartouche(cad);
    }
    return cad;

  }



  static testRawPoints(acad: ApgCadSvg) {

    acad.svg.description = "Points";

    for (let i = 0; i < this.randomInN(); i++) {
      const cx = this.randomInRange();
      const cy = this.randomInRange();
      acad.svg
        .circle(cx, cy, 20)
        .childOf(acad.currentLayer);
    }
    return acad;
  }


  static testRawLines(acad: ApgCadSvg) {

    acad.svg.description = "Lines";

    for (let i = 0; i < this.randomInN(); i++) {
      const x1 = this.randomInRange();
      const y1 = this.randomInRange();
      const x2 = this.randomInRange();
      const y2 = this.randomInRange();

      acad.svg
        .line(x1, y1, x2, y2)
        .childOf(acad.currentLayer);
    }

    return acad;
  }



  static testRawPolyLines(cad: ApgCadSvg, arandom: boolean) {

    if (arandom) {
      this.#testPolylinesRandom(cad);
    }
    else {
      this.#testPolylinesManual(cad);
    }
  }

  static #testPolylinesManual(cad: ApgCadSvg) {

    cad.svg.description = "Manual polyline";

    const pts: A2D.Apg2DPoint[] = [];
    pts.push(new A2D.Apg2DPoint(100, 100));
    pts.push(new A2D.Apg2DPoint(100, 1000));
    pts.push(new A2D.Apg2DPoint(1000, 1000));
    pts.push(new A2D.Apg2DPoint(2000, 2000));

    cad.svg
      .polyline(pts)
      .fill(eApgCadStdColors.NONE)
      .childOf(cad.currentLayer);

    return cad;
  }

  static #testPolylinesRandom(cad: ApgCadSvg) {

    cad.svg.description = "Random polylines";

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




  static testRawPolygons(cad: ApgCadSvg, arandom: boolean) {

    if (arandom) {
      this.#testPolygonsRandom(cad);
    }
    else {
      this.#testPolygonsManual(cad);
    }
  }

  static #testPolygonsManual(cad: ApgCadSvg) {

    cad.svg.description = "Manual polygon";
    const pts: A2D.Apg2DPoint[] = [];
    pts.push(new A2D.Apg2DPoint(1000, 0));
    pts.push(new A2D.Apg2DPoint(0, 1000));
    pts.push(new A2D.Apg2DPoint(500, 1500));
    pts.push(new A2D.Apg2DPoint(1000, 1500));
    pts.push(new A2D.Apg2DPoint(1000, 2000));
    pts.push(new A2D.Apg2DPoint(2000, 1000));
    pts.push(new A2D.Apg2DPoint(1500, 500));
    pts.push(new A2D.Apg2DPoint(1000, 500));

    cad.svg
      .polygon(pts)
      .fill(eApgCadStdColors.NONE)
      .childOf(cad.currentLayer);

    return cad;
  }

  static #testPolygonsRandom(cad: ApgCadSvg) {

    cad.svg.description = "Random polygons";

    const maxPtsInPolyLine = 10;

    for (let i = 0; i < this.randomInN(); i++) {

      const np = 2 + Math.floor(Math.random() * (maxPtsInPolyLine - 2));

      const minD = -250;
      const maxD = 250;

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
        .polygon(pts)
        .fill(eApgCadStdColors.NONE)
        .childOf(cad.currentLayer);
    }

    return cad;
  }




  static testRawCircles(cad: ApgCadSvg) {

    cad.svg.description = "Circles";

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


  static testRawArcs(cad: ApgCadSvg) {

    cad.svg.description = "Arcs";

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


  static testRawText(cad: ApgCadSvg) {

    cad.svg.description = "Texts";

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


  static testRawImages(cad: ApgCadSvg) {

    cad.svg.description = "Images";

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


  static testAspectRatios(cad: ApgCadSvg) {


    cad.svg.description = "Text aspect ratios";

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



  static testRawPaths(cad: ApgCadSvg, arandom: boolean) {

    if (arandom) {
      this.#testPathsRandom(cad);
    }
    else {
      this.#testPathsManual(cad);
    }
  }

  static #testPathsManual(cad: ApgCadSvg) {

    cad.svg.description = "Manual paths";

    const pathBuilder = new Svg.ApgSvgPathBuilder();

    // Absolute commands
    pathBuilder
      .moveAbs(1000, 1000)
      .lineHorizontalAbs(1100)
      .lineVerticalAbs(1100)
      .lineAbs(1200, 1200)
      .cubicAbs(1300, 1200, 1300, 1400, 1400, 1400)
      .cubicSmoothAbs(1500, 1200, 1600, 1200)
      .quadraticAbs(1800, 1300, 2000, 1200)
      .quadraticSmoothAbs(2400, 1200)
      .arcAbs(2400, 1500, 300, 150, 0, false, false)
      .arcAbs(2400, 1800, 100, 300, 0, true, true)
      .close()

    // Relative commands
    pathBuilder
      .moveAbs(0, 0)
      .moveRel(3000, 1000)
      .lineHorizontalRel(100)
      .lineVerticalRel(100)
      .lineRel(100, 100)
      .cubicRel(100, 0, 100, 200, 200, 200)
      .cubicSmoothRel(100, -200, 200, -200)
      .quadraticRel(200, 100, 400, 0)
      .quadraticSmoothRel(400, 0)
      .arcRel(0, 300, 300, 150, 0, false, false)
      .arcRel(0, 300, 100, 300, 0, true, true)
      .close();

    const path = pathBuilder.build();
    cad.svg
      .path(path)
      .fill(eApgCadStdColors.NONE)
      .childOf(cad.currentLayer);
    return cad;
  }

  static #testPathsRandom(cad: ApgCadSvg) {

    cad.svg.description = "Random paths";

    const MIN_COMMANDS_IN_PATH = 8;
    const MAX_COMMANDS_IN_PATH = 12;
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

      const numCommands = this.randomInt(MIN_COMMANDS_IN_PATH, MAX_COMMANDS_IN_PATH);

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
              pathBuilder.arcAbs(p1.x, p1.y, 1, 1, 0, false, false);
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

