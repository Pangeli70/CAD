/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/21] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { A2D } from '../../../deps.ts';
import { ApgCadSvg } from "../../../src/classes/ApgCadSvg.ts";
import { eApgCadStdColors } from "../../../src/enums/eApgCadStdColors.ts";
import { eApgCadTestSvg } from "../enums/eApgCadTestSvg.ts";
import { ApgCadBaseTester } from "./ApgCadBaseTester.ts";


export class ApgCadSvgTester extends ApgCadBaseTester {


  static testRawPoints() {

    const cad = new ApgCadSvg();
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

    return cad.svg.render();
  }


  static testRawLines() {

    const cad = new ApgCadSvg();
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

    return cad.svg.render();
  }


  static testRawPolyLines() {

    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Points";
    cad.svg.description = "Apg Svg Cad";
    const layers = this.buildTestLayers(cad);
    const layId = this.randomLayer(layers);
    cad.setCurrentLayer(layId);


    const maxPtsInPolyLine = 10;

    for (let i = 0; i < this.randomInN(); i++) {

      const np = 2 + Math.floor(Math.random() * (maxPtsInPolyLine - 2));

      const pts: A2D.Apg2DPoint[] = [];
      for (let j = 0; j < np; j++) {

        let x, y;
        if (j === 0) {
          x = this.randomInRange();
          y = this.randomInRange();
        }
        else {
          x = this.randomInRange() / 20;
          y = this.randomInRange() / 20;

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

    return cad.svg.render();
  }


  static testRawCircles() {

    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Circles";
    cad.svg.description = "Apg Svg Cad";
    const layers = this.buildTestLayers(cad);
    const layId = this.randomLayer(layers);
    cad.setCurrentLayer(layId);

    const maxR = 100;
    const minR = 10;

    for (let i = 0; i < this.randomInN(); i++) {
      const cx = this.randomInRange();
      const cy = this.randomInRange();
      const r = this.randomInt(minR, maxR);
      cad.svg
        .circle(cx, cy, r)
        .fill(eApgCadStdColors.NONE)
        .childOf(cad.currentLayer);
    }

    return cad.svg.render();
  }


  static testRawArcs() {

    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Arcs";
    cad.svg.description = "Apg Svg Cad";
    const layers = this.buildTestLayers(cad);
    const layId = this.randomLayer(layers);
    cad.setCurrentLayer(layId);

    const maxR = 100;
    const minR = 10;

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

    return cad.svg.render();
  }


  static testRawText() {

    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Labels";
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

    for (let i = 0; i < this.randomInN(); i++) {

      const stringId = this.randomInt(0, strings.length - 1);

      const p1 = this.randomPointInRange();
      const p2 = this.randomPointInRange();
      const midPoint = p1.halfwayFrom(p2);
      const line = new A2D.Apg2DLine(p1, p2);

      // cad.svg.text(x1, y1, line.length / strings[j].length, line.slope, strings[j])
      cad.svg
        .line(p1.x, p1.y, p2.x, p2.y)
        .childOf(cad.currentLayer);
      cad.svg
        .text(midPoint.x, midPoint.y, strings[stringId])
        .rotate(line.angle - 360, midPoint.x, midPoint.y)
        .stroke(eApgCadStdColors.NONE, 0)
        .childOf(cad.currentLayer);
    }

    return cad.svg.render();
  }


  static testRawPaths() {
    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Points";
    cad.svg.description = "Apg Svg Cad";
    const layers = this.buildTestLayers(cad);
    const layId = this.randomLayer(layers);
    cad.setCurrentLayer(layId);

    this.notImplemented(cad);


    return cad.svg.render();
  }




  static RunTest(atest: eApgCadTestSvg) {

    let r = "";
    switch (atest) {
      case eApgCadTestSvg.POINTS:
        r = this.testRawPoints();
        break;
      case eApgCadTestSvg.LINES:
        r = this.testRawLines();
        break;
      case eApgCadTestSvg.POLYLINES:
        r = this.testRawPolyLines();
        break;
      case eApgCadTestSvg.ARCS:
        r = this.testRawArcs();
        break;
      case eApgCadTestSvg.CIRCLES:
        r = this.testRawCircles();
        break;
      case eApgCadTestSvg.LABELS:
        r = this.testRawText();
        break;
      case eApgCadTestSvg.PATHS:
        r = this.testRawPaths();
        break;
    }

    return r;
  }

}

