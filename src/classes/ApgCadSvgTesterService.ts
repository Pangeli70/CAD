/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/21] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * -----------------------------------------------------------------------
 */

import {
  A2D, Svg, Lgr
} from '../../deps.ts';


import {
ApgCadInstructionsSet,
  ApgCadSvg,
  ApgCadSvgAngularDimensionsFactory,
  ApgCadSvgBasicShapesFactory,
  ApgCadSvgLinearDimensionsFactory,
  eApgCadDftDimArrowStyles,
  eApgCadDftTextStyles,
  eApgCadLinearDimensionTypes,
  eApgCadStdColors
} from '../../mod.ts';
import { ApgCadInsSetTest_01 } from "../../test/data/ApgCadInsSetTest_01.ts";
import { eApgCadTestNames } from "../enums/eApgCadTestNames.ts";



enum eApgCadSvgTesterLayerStokeStyles {
  green
}

enum eApgCadSvgTesterLayerFillStyles {
  green
}

enum eApgCadSvgTesterLayers {
  green
}


export class ApgCadSvgTesterService {

  static readonly MAX_X = 4000;
  static readonly MAX_N = 3;


  static #buildTestLayers(acad: ApgCadSvg) {

    const r: Svg.ApgSvgNode[] = [];

    acad.newStrokeStyle('GreenPen', {
      color: eApgCadStdColors.GREEN,
      width: 4
    });
    acad.newFillStyle('GreenBrush', {
      color: eApgCadStdColors.GREEN,
      opacity: 1
    });
    const layer1 = acad.newLayer('1', 'GreenPen', 'GreenBrush');
    r.push(layer1);


    acad.newStrokeStyle('RedPen', {
      color: eApgCadStdColors.RED,
      width: 4
    });
    acad.newFillStyle('RedBrush', {
      color: eApgCadStdColors.RED,
      opacity: 1
    });
    const layer2 = acad.newLayer('2', 'RedPen', 'RedBrush');
    r.push(layer2);


    acad.newStrokeStyle('BluePen', {
      color: eApgCadStdColors.BLUE,
      width: 4
    });
    acad.newFillStyle('BlueBrush', {
      color: eApgCadStdColors.BLUE,
      opacity: 1
    });
    const layer3 = acad.newLayer('3', 'BluePen', 'BlueBrush');
    r.push(layer3);


    acad.newStrokeStyle('MagentaPen', {
      color: eApgCadStdColors.MAGENTA,
      width: 4
    });
    acad.newFillStyle('MagentaBrush', {
      color: eApgCadStdColors.MAGENTA,
      opacity: 1
    });
    const layer4 = acad.newLayer('4', 'MagentaPen', 'MagentaBrush');
    r.push(layer4);

    acad.newStrokeStyle('YellowPen', {
      color: eApgCadStdColors.YELLOW,
      width: 4
    });
    acad.newFillStyle('YellowBrush', {
      color: eApgCadStdColors.YELLOW,
      opacity: 1
    });
    const layer5 = acad.newLayer('5', 'YellowPen', 'YellowBrush');
    r.push(layer5);

    return r;
  }


  static #randomInt(aminVal: number, amaxVal: number) {
    return Math.round(Math.random() * (amaxVal - aminVal)) + aminVal;
  }


  static #randomPoint(aminVal: number, maxVal: number) {
    const cx = this.#randomInt(aminVal, maxVal);
    const cy = this.#randomInt(aminVal, maxVal);
    const cp = new A2D.Apg2DPoint(cx, cy);
    return cp;
  }


  static testRawPoints() {

    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Points";
    cad.svg.description = "Apg Svg Cad";
    const layers = this.#buildTestLayers(cad);
    const layId = this.#randomInt(1, layers.length).toString();
    cad.setCurrentLayer(layId);

    const maxX = this.MAX_X;
    const num = this.MAX_N;

    for (let i = 0; i < num; i++) {
      const cx = this.#randomInt(0, maxX);
      const cy = this.#randomInt(0, maxX);
      cad.svg
        .circle(cx, cy, 20)
        .fill(eApgCadStdColors.WHITE)
        .childOf(cad.currentLayer);
    }

    return cad.svg.render();
  }


  static testRawLines() {

    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Lines";
    cad.svg.description = "Apg Svg Cad";
    const layers = this.#buildTestLayers(cad);
    const layId = this.#randomInt(1, layers.length).toString();
    cad.setCurrentLayer(layId);

    const maxX = this.MAX_X;
    const num = this.MAX_N;

    for (let i = 0; i < num; i++) {
      const x1 = this.#randomInt(0, maxX);
      const y1 = this.#randomInt(0, maxX);
      const x2 = this.#randomInt(0, maxX);
      const y2 = this.#randomInt(0, maxX);

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
    const layers = this.#buildTestLayers(cad);
    const layId = this.#randomInt(1, layers.length).toString();
    cad.setCurrentLayer(layId);

    const maxX = this.MAX_X;
    const num = this.MAX_N;

    const maxPtsInPolyLine = 10;

    for (let i = 0; i < num; i++) {

      const np = 2 + Math.floor(Math.random() * (maxPtsInPolyLine - 2));

      const pts: A2D.Apg2DPoint[] = [];
      for (let j = 0; j < np; j++) {

        let x, y;
        if (j === 0) {
          x = Math.trunc(Math.random() * maxX);
          y = Math.trunc(Math.random() * maxX);
        }
        else {
          x = Math.trunc(Math.random() * maxX) / 20;
          y = Math.trunc(Math.random() * maxX) / 20;

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
    const layers = this.#buildTestLayers(cad);
    const layId = this.#randomInt(1, layers.length).toString();
    cad.setCurrentLayer(layId);

    const maxX = this.MAX_X;
    const num = this.MAX_N;
    const maxR = 100;
    const minR = 10;

    for (let i = 0; i < num; i++) {
      const cx = this.#randomInt(0, maxX);
      const cy = this.#randomInt(0, maxX);
      const r = this.#randomInt(minR, maxR);
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
    const layers = this.#buildTestLayers(cad);
    const layId = this.#randomInt(1, layers.length).toString();
    cad.setCurrentLayer(layId);

    const maxX = this.MAX_X;
    const num = this.MAX_N;
    const maxR = 100;
    const minR = 10;

    for (let i = 0; i < num; i++) {
      const cx = this.#randomInt(0, maxX);
      const cy = this.#randomInt(0, maxX);
      const r = this.#randomInt(minR, maxR);
      const begin = this.#randomInt(0, 360);
      const end = this.#randomInt(0, 360);
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
    const layers = this.#buildTestLayers(cad);
    const layId = this.#randomInt(1, layers.length).toString();
    cad.setCurrentLayer(layId);

    const maxX = this.MAX_X;
    const maxn = this.MAX_N;
    const strings = [
      'We love APG SVG-CAD',
      'APG SVG-CAD is fun',
      'APG SVG-CAD its easy',
      'APG SVG-CAD don\'t lie'
    ];

    for (let i = 0; i < maxn; i++) {

      const stringId = this.#randomInt(0, strings.length - 1);

      const p1 = this.#randomPoint(0, maxX)
      const p2 = this.#randomPoint(0, maxX)
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


  static testBasicShapes() {
    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Points";
    cad.svg.description = "Apg Svg Cad";
    const layers = this.#buildTestLayers(cad);
    cad.setCurrentLayer('4');

    const maxX = this.MAX_X;
    const num = this.MAX_N;
    const maxR = 100;
    const minR = 10;
    const maxSides = 8;
    const minSides = 3;

    const shapeFact = new ApgCadSvgBasicShapesFactory(cad.svg, layers[0]);

    for (let i = 0; i < num; i++) {
      const cp = this.#randomPoint(0, maxX);
      const r = this.#randomInt(minR, maxR);
      const circle = shapeFact.buildCircle(cp, r);
      circle.fill("none");
    }

    for (let i = 0; i < num; i++) {
      const cp = this.#randomPoint(0, maxX);
      const r = this.#randomInt(minR, maxR);
      shapeFact.buildDot(cp, r, layers[1]);
    }

    for (let i = 0; i < num; i++) {
      const p1 = this.#randomPoint(0, maxX);
      const p2 = this.#randomPoint(0, maxX);
      shapeFact.buildLine(p1, p2, layers[2]);
    }

    for (let i = 0; i < num; i++) {
      const p1 = this.#randomPoint(0, maxX);
      const w = this.#randomInt(minR, maxR);
      const h = this.#randomInt(minR, maxR);
      const rect = shapeFact.buildRectWH(p1, w, h, layers[3]);
      rect.attrib("fill", "none");
    }

    for (let i = 0; i < num; i++) {
      const cp = this.#randomPoint(0, maxX);
      const r = this.#randomInt(minR, maxR);
      const sides = this.#randomInt(minSides, maxSides);
      const rect = shapeFact.buildPolygon(cp, r, sides, 360 / sides / 2, layers[4]);
      rect.fill("none");
      shapeFact.buildDot(cp, 4);
    }

    return cad.svg.render();
  }


  static testLayers() {
    const cad = new ApgCadSvg();

    cad.newStrokeStyle('ContinuousGreen4', {
      color: eApgCadStdColors.GREEN,
      width: 4
    });

    cad.newLayer('1', 'ContinuousGreen4');
    cad.setCurrentLayer('1');
    cad.svg.line(0, 0, 200, 200)
      .childOf(cad.currentLayer);

    cad.newStrokeStyle('DottedRed8', {
      color: eApgCadStdColors.RED,
      width: 8,
      dashPattern: [8, 8]
    });

    cad.newLayer('2', 'DottedRed8');
    cad.setCurrentLayer('2');
    cad.svg.line(0, 40, 200, 240)
      .childOf(cad.currentLayer);

    return cad.svg.render();
  }


  static testLineStyles() {
    const cad = new ApgCadSvg();
    cad.svg.title = "Test Line Styles";
    cad.svg.description = "Apg Eds";

    cad.newStrokeStyle('MyDASHDOT', {
      color: eApgCadStdColors.GREEN,
      width: 10,
      dashPattern: [50, 10, 10, 10]
    });

    cad.newLayer('1', 'MyDASHDOT');
    cad.setCurrentLayer('1');
    cad.svg
      .line(0, 0, 200, 200)
      .childOf(cad.currentLayer);

    cad.newStrokeStyle('MyDOT', {
      color: eApgCadStdColors.BLUE,
      width: 20,
      dashPattern: [20, 20]
    });

    cad.newLayer('2', 'MyDOT');
    cad.setCurrentLayer('2');
    cad.svg
      .line(0, 200, 200, 400)
      .childOf(cad.currentLayer);

    return cad.svg.render();
  }

  /*  
    private _testDimStyles() {
      const dxf = new ApgDxfDrawing();
  
      // @todo_9 implement this mockup
      return dxf.toDxfString();
    }
*/

  static #testLinearDims(atype: eApgCadLinearDimensionTypes) {

    const cad = new ApgCadSvg();
    cad.svg.title = `Test Linear dims (${atype})`;
    cad.svg.description = "Apg Svg Cad";
    const layers = this.#buildTestLayers(cad);
    const dimFact = new ApgCadSvgLinearDimensionsFactory(cad.svg, layers[0]);
    dimFact.setup(layers[0], 20, eApgCadDftDimArrowStyles.ARCHITECTURAL);

    const maxX = this.MAX_X;
    const num = this.MAX_N;
    const maxD = 100;
    const minD = 10;

    for (let i = 0; i < num; i++) {
      const p1 = this.#randomPoint(0, maxX);
      const p2 = this.#randomPoint(0, maxX);
      const d = this.#randomInt(minD, maxD);
      dimFact.build(atype, p1, p2, d, "<", ">");

      cad.setCurrentLayer(layers[1].ID);
      cad.svg
        .line(p1.x, p1.y, p2.x, p2.y)
        .childOf(cad.currentLayer);
    }
    return cad.svg.render();

  }

  static testHorizontalDims() {
    return this.#testLinearDims(
      eApgCadLinearDimensionTypes.Horizontal);
  }
  static testVerticalDims() {
    return this.#testLinearDims(
      eApgCadLinearDimensionTypes.Vertical);
  }
  static testAlignedDims() {
    return this.#testLinearDims(
      eApgCadLinearDimensionTypes.Aligned);
  }


  static #testArcDims(atype: eApgCadLinearDimensionTypes) {

    const cad = new ApgCadSvg();
    cad.svg.title = `Test Arc dims (${atype})`;
    cad.svg.description = "Apg Svg Cad";
    const layers = this.#buildTestLayers(cad);
    const dimFact = new ApgCadSvgLinearDimensionsFactory(cad.svg, layers[2]);
    dimFact.setup(layers[0], 20, eApgCadDftDimArrowStyles.SIMPLE);

    const maxX = this.MAX_X;
    const num = this.MAX_N;
    const maxR = 400;
    const minR = 10;

    for (let i = 0; i < num; i++) {
      const centerPoint = this.#randomPoint(0, maxX);
      const ladderPoint = this.#randomPoint(0, maxX);
      const radious = this.#randomInt(minR, maxR);
      const ladderline = new A2D.Apg2DLine(centerPoint, ladderPoint);
      const pc1 = ladderline.pointAtDistanceFromPoint(centerPoint, radious);
      const pc2 = ladderline.pointAtDistanceFromPoint(centerPoint, -radious);

      cad.setCurrentLayer(layers[4].ID);
      cad.svg
        .circle(centerPoint.x, centerPoint.y, radious)
        .fill(eApgCadStdColors.NONE)
        .childOf(cad.currentLayer);

      cad.setCurrentLayer(layers[1].ID);
      cad.svg
        .line(centerPoint.x, centerPoint.y, ladderPoint.x, ladderPoint.y)
        .childOf(cad.currentLayer);

      cad.setCurrentLayer(layers[2].ID);
      cad.svg
        .line(pc1!.x, pc1!.y, pc2!.x, pc2!.y)
        .childOf(cad.currentLayer);

      dimFact.build(atype, pc1!, pc2!, 50);
    }

    return cad.svg.render();
  }

  static testDiameterDims() {
    return this.#testArcDims(
      eApgCadLinearDimensionTypes.Diameter);
  }
  static testRadiousDims() {
    return this.#testArcDims(
      eApgCadLinearDimensionTypes.Radious);
  }

  
 
  
  static _m(arr: number[]) {
    const sorted = arr.sort((a, b) => a === b ? 0 : a < b ? -1 : 1);
    const min = sorted[0];
    const max = sorted[arr.length - 1];
    const delta = (max - min) / 2;
    return delta + min;
  }
  
  static  testAngularDims() {
    const cad = new ApgCadSvg();
    cad.svg.title = `Test Angular dims`;
    cad.svg.description = "Apg Svg Cad";
    const textStyle = cad.getTextStyle(eApgCadDftTextStyles.DIMENSIONS)
    const layers = this.#buildTestLayers(cad);
    const dimFact = new ApgCadSvgAngularDimensionsFactory(
      cad.svg,
      layers[2],
      textStyle!,
      eApgCadDftDimArrowStyles.MECHANICAL,
      20
    );


    const maxxy = this.MAX_X;
    const maxn = this.MAX_N;

    for (let i = 0; i < maxn; i++) {
      const x1 = Math.random() * maxxy - maxxy / 2;
      const y1 = Math.random() * maxxy - maxxy / 2;
      const x2 = Math.random() * maxxy - maxxy / 2;
      const y2 = Math.random() * maxxy - maxxy / 2;
      const x3 = Math.random() * maxxy - maxxy / 2;
      const y3 = Math.random() * maxxy - maxxy / 2;
      const x4 = Math.random() * maxxy - maxxy / 2;
      const y4 = Math.random() * maxxy - maxxy / 2;


      cad.setCurrentLayer('3');
      cad.svg.line(x1, y1, x2, y2)
      cad.svg.line(x3, y3, x4, y4);

      const xm = [x1, x2, x3, x4];
      const ym = [y1, y2, y3, y4];

      const mx = this._m(xm);
      const my = this._m(ym);

      const pt1 = new A2D.Apg2DPoint(x1, y1);
      const pt2 = new A2D.Apg2DPoint(x2, y2);
      const l1 = new A2D.Apg2DLine(pt1, pt2);

      const pt3 = new A2D.Apg2DPoint(x3, y3);
      const pt4 = new A2D.Apg2DPoint(x4, y4);
      const l2 = new A2D.Apg2DLine(pt3, pt4);

      cad.setCurrentLayer('2');
      dimFact.build(l1, l2, 50, A2D.eApg2DQuadrant.posXposY, "##", "##");
    }

    return cad.svg.render();
  }
  
  /*
  demo(): string {
    const dxf = new ApgDxfDrawing();
  
    // @todo_9 add more functions in this test
  
    dxf.drawText(10, 0, 10, 0, 'Apg Dxf Simple test');
  
    dxf.addLayer('l', eApgDxfStdColors.GREEN, eApgDxfDftLineStyles.CONTINUOUS)
      .setActiveLayer('l')
      .drawText(20, -70, 10, 0, 'Version 0.5.1');
  
    dxf.addLayer('2', eApgDxfStdColors.RED, 'DOTTED')
      .setActiveLayer('2')
      .drawCircle(50, -30, 25);
  
    return dxf.toDxfString();
  }
 */

  static testInstructionsSet() {
    const cad = new ApgCadSvg();
    cad.svg.title = `Test instructions set`;
    cad.svg.description = "Apg Svg Cad";

    const logger = new Lgr.ApgLgr('Instructions set');

    const set = new ApgCadInstructionsSet(logger, cad, ApgCadInsSetTest_01);
    const { svg, data } = set.build();
    return svg
  }
  


  static RunTest(atest: eApgCadTestNames) {

    let r = "";
    switch (atest) {
      case eApgCadTestNames.LAYERS:
        r = this.testLayers();
        break;
      case eApgCadTestNames.STROKE_STYLES:
        r = this.testLineStyles();
        break;
      case eApgCadTestNames.POINTS:
        r = this.testRawPoints();
        break;
      case eApgCadTestNames.LINES:
        r = this.testRawLines();
        break;
      case eApgCadTestNames.POLYLINES:
        r = this.testRawPolyLines();
        break;
      case eApgCadTestNames.ARCS:
        r = this.testRawArcs();
        break;
      case eApgCadTestNames.CIRCLES:
        r = this.testRawCircles();
        break;
      case eApgCadTestNames.LABELS:
        r = this.testRawText();
        break;
      case eApgCadTestNames.BASIC_SHAPES:
        r = this.testBasicShapes();
        break;
      case eApgCadTestNames.DIM_STYLES:
        //r = this.testDimStyles();
        break;
      case eApgCadTestNames.HORIZONTAL_DIMS:
        r = this.testHorizontalDims();
        break;
      case eApgCadTestNames.VERTICAL_DIMS:
        r = this.testVerticalDims();
        break;
      case eApgCadTestNames.ALIGNED_DIMS:
        r = this.testAlignedDims();
        break;
      case eApgCadTestNames.DIAMETER_DIMS:
        r = this.testDiameterDims();
        break;
      case eApgCadTestNames.RADIOUS_DIMS:
        r = this.testRadiousDims();
        break;
      case eApgCadTestNames.ANGULAR_DIMS:
        r = this.testAngularDims();
        break;
      case eApgCadTestNames.INSTRUCTIONS_SETS:
        r = this.testInstructionsSet();
        break;
    }

    // this.testers.set('DemoDrawing',this.demo);
    return r;
  }

}

