/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/21] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * -----------------------------------------------------------------------
 */

import {
  Uts, A2D, Svg
} from '../../deps.ts';


import {
  ApgCadSvg,
  ApgCadSvgLinearDimensionsFactory,
  eApgCadDftLineStyles,
  eApgCadLinearDimensionTypes,
  eApgCadStdColors
} from '../../mod.ts';
import { eApgCadTestNames } from "../enums/eApgCadTestNames.ts";

type TesterMethod = () => void;

export class ApgCadSvgTesterService {

  static readonly MAX_X = 2000;
  static readonly MAX_N = 20;

  private static readonly _testers: Map<string, TesterMethod> = new Map();
  private static _ready = false;


  static testLayers() {
    const cad = new ApgCadSvg();

    cad.newStrokeStyle('ContinuousGreen4', {
      color: eApgCadStdColors.GREEN,
      width: 4
    });

    cad.newLayer('1', 'ContinuousGreen4');
    cad.setLayer('1');
    cad.svg.line(0, 0, 200, 200)
      .childOf(cad.currentLayer);

    cad.newStrokeStyle('DottedRed8', {
      color: eApgCadStdColors.RED,
      width: 8,
      dashPattern: [8, 8]
    });

    cad.newLayer('2', 'DottedRed8');
    cad.setLayer('2');
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
    cad.setLayer('1');
    cad.svg.line(0, 0, 200, 200)
      .childOf(cad.currentLayer);

    cad.newStrokeStyle('MyDOT', {
      color: eApgCadStdColors.BLUE,
      width: 20,
      dashPattern: [20, 20]
    });

    cad.newLayer('2', 'MyDOT');
    cad.setLayer('2');
    cad.svg.line(0, 200, 200, 400)
      .childOf(cad.currentLayer);

    return cad.svg.render();
  }


  static buildTestLayers(acad: ApgCadSvg) {

    const r: Svg.ApgSvgNode[] = [];

    acad.newStrokeStyle('GreenPen', {
      color: eApgCadStdColors.GREEN,
      width: 2
    });
    const layer1 = acad.newLayer('1', 'GreenPen');
    r.push(layer1);

    acad.newStrokeStyle('RedPen', {
      color: eApgCadStdColors.RED,
      width: 2
    });
    const layer2 = acad.newLayer('2', 'RedPen');
    r.push(layer2);

    acad.newStrokeStyle('BluePen', {
      color: eApgCadStdColors.BLUE,
      width: 2
    });
    const layer3 = acad.newLayer('3', 'BluePen');
    r.push(layer3);

    acad.newStrokeStyle('MagentaPen', {
      color: eApgCadStdColors.MAGENTA,
      width: 2
    });
    const layer4 = acad.newLayer('4', 'MagentaPen');
    r.push(layer4);

    return r;
  }

  /*  
    private _testDimStyles() {
      const dxf = new ApgDxfDrawing();
  
      // @todo_9 implement this mockup
      return dxf.toDxfString();
    }
*/

  static testArcs() {

    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Arcs";
    cad.svg.description = "Apg Svg Cad";
    const _layers = this.buildTestLayers(cad);
    cad.setLayer('1');

    const maxX = this.MAX_X;
    const num = this.MAX_N;
    const maxR = 100;
    const minR = 10;

    for (let i = 0; i < num; i++) {
      const cx = Math.random() * maxX;
      const cy = Math.random() * maxX;
      const r = Math.random() * (maxR - minR) + minR;
      const begin = Math.random() * 360;
      const end = Math.random() * 360;
      cad.svg.arc(cx, cy, r, begin, end)
        .childOf(cad.currentLayer);
    }

    return cad.svg.render();
  }


  static testCircles() {
    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Circles";
    cad.svg.description = "Apg Svg Cad";
    const _layers = this.buildTestLayers(cad);
    cad.setLayer('1');

    const maxX = this.MAX_X;
    const num = this.MAX_N;
    const maxR = 100;
    const minR = 10;

    for (let i = 0; i < num; i++) {
      const cx = Math.random() * maxX;
      const cy = Math.random() * maxX;
      const r = Math.random() * (maxR - minR) + minR;
      cad.svg.circle(cx, cy, r)
        .childOf(cad.currentLayer);
    }

    return cad.svg.render();
  }


  static testLines() {

    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Lines";
    cad.svg.description = "Apg Svg Cad";
    const _layers = this.buildTestLayers(cad);
    cad.setLayer('2');

    const maxX = this.MAX_X;
    const num = this.MAX_N;

    for (let i = 0; i < num; i++) {
      const x1 = Math.random() * maxX;
      const y1 = Math.random() * maxX;
      const x2 = Math.random() * maxX;
      const y2 = Math.random() * maxX;

      cad.svg.line(x1, y1, x2, y2)
        .childOf(cad.currentLayer);
    }

    return cad.svg.render();
  }




  static testPoints() {

    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Points";
    cad.svg.description = "Apg Svg Cad";
    const _layers = this.buildTestLayers(cad);
    cad.setLayer('3');

    const maxX = this.MAX_X;
    const num = this.MAX_N;

    for (let i = 0; i < num; i++) {
      const cx = Math.trunc(Math.random() * maxX);
      const cy = Math.trunc(Math.random() * maxX);
      cad.svg.circle(cx, cy, 1)
        .childOf(cad.currentLayer);
    }

    return cad.svg.render();
  }


  static testPolyLines() {

    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Points";
    cad.svg.description = "Apg Svg Cad";
    const _layers = this.buildTestLayers(cad);
    cad.setLayer('4');

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
        .childOf(cad.currentLayer);

    }

    return cad.svg.render();
  }


  static testTextLabels() {

    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Labels";
    cad.svg.description = "Apg Svg Cad";
    const _layers = this.buildTestLayers(cad);
    cad.setLayer('2');

    const maxX = this.MAX_X;
    const maxn = this.MAX_N;
    const strings = [
      'We love APG SVG-CAD',
      'APG SVG-CAD is fun',
      'APG SVG-CAD its easy',
      'APG SVG-CAD don\'t lie'
    ];

    for (let i = 0; i < maxn; i++) {
      const x1 = Math.random() * maxX;
      const y1 = Math.random() * maxX;
      const x2 = Math.random() * maxX;
      const y2 = Math.random() * maxX;
      const j = Math.floor(Math.random() * strings.length);

      const p1 = new A2D.Apg2DPoint(x1, y1);
      const p2 = new A2D.Apg2DPoint(x2, y2);
      const line = new A2D.Apg2DLine(p1, p2);

      // cad.svg.text(x1, y1, line.length / strings[j].length, line.slope, strings[j])
      cad.svg
        .text(x1, y1, strings[j])
        .childOf(cad.currentLayer);
      cad.svg
        .line(x1, y1, x2, y2)
        .childOf(cad.currentLayer);
    }

    return cad.svg.render();
  }


  static #testLinearDims(atype: eApgCadLinearDimensionTypes) {

    const cad = new ApgCadSvg();
    cad.svg.title = `Test Linear dims (${atype})`;
    cad.svg.description = "Apg Svg Cad";
    const layers = this.buildTestLayers(cad);
    const dimFact = new ApgCadSvgLinearDimensionsFactory(cad.svg, layers[0]);
    dimFact.setup(layers[0], 20, "");

    const maxxy = this.MAX_X;
    const maxn = this.MAX_N;

    for (let i = 0; i < maxn; i++) {
      const x1 = Math.random() * maxxy;
      const y1 = Math.random() * maxxy;
      const x2 = Math.random() * maxxy;
      const y2 = Math.random() * maxxy;
      const p1 = new A2D.Apg2DPoint(x1, y1);
      const p2 = new A2D.Apg2DPoint(x2, y2);
      dimFact.build(p1, p2, 20, atype);
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
    const layers = this.buildTestLayers(cad);
    const dimFact = new ApgCadSvgLinearDimensionsFactory(cad.svg, layers[2]);


    const maxxy = this.MAX_X;
    const maxn = this.MAX_N;

    for (let i = 0; i < maxn; i++) {
      const cx = Math.random() * maxxy;
      const cy = Math.random() * maxxy;
      const r = Math.random() * maxxy / 20;

      cad.setLayer('1');
      cad.svg.circle(cx, cy, r)
        .childOf(cad.currentLayer);

      const x2 = Math.random() * maxxy;
      const y2 = Math.random() * maxxy;
      cad.setLayer('3');
      cad.svg.line(cx, cy, x2, y2);

      const pc = new A2D.Apg2DPoint(cx, cy);
      const p2 = new A2D.Apg2DPoint(x2, y2);
      const l = new A2D.Apg2DLine(pc, p2);
      const pc1 = l.PointAtTheDistanceFromPoint(pc, r);
      const pc2 = l.PointAtTheDistanceFromPoint(pc, -r);

      cad.setLayer('2');
      dimFact.build(pc1!, pc2!, 50, atype);
    }

    return cad.svg.render();
  }

  static testDiameterDims() {
    return this.#testArcDims(
      eApgCadLinearDimensionTypes.Radious);
  }
  static testRadiousDims() {
    return this.#testArcDims(
      eApgCadLinearDimensionTypes.Radious);
  }

  /*
 
  
  private _m(arr: number[]) {
    const sorted = arr.sort((a, b) => a === b ? 0 : a < b ? -1 : 1);
    const min = sorted[0];
    const max = sorted[arr.length - 1];
    const delta = (max - min) / 2;
    return delta + min;
  }
  
  private _testAngularDims() {
    const maxxy = 200;
    const maxn = 2;
  
    const dxf = new ApgDxfDrawing();
    dxf.addLayer('1', eApgDxfStdColors.GREEN, 'CONTINUOUS');
    dxf.addLayer('2', eApgDxfStdColors.RED, 'CONTINUOUS');
    dxf.addLayer('3', eApgDxfStdColors.BLUE, 'CONTINUOUS');
  
    for (let i = 0; i < maxn; i++) {
      const x1 = Math.random() * maxxy - maxxy / 2;
      const y1 = Math.random() * maxxy - maxxy / 2;
      const x2 = Math.random() * maxxy - maxxy / 2;
      const y2 = Math.random() * maxxy - maxxy / 2;
      const x3 = Math.random() * maxxy - maxxy / 2;
      const y3 = Math.random() * maxxy - maxxy / 2;
      const x4 = Math.random() * maxxy - maxxy / 2;
      const y4 = Math.random() * maxxy - maxxy / 2;
  
      dxf.setActiveLayer('3');
      dxf.drawLine(x1, y1, x2, y2);
      dxf.drawLine(x3, y3, x4, y4);
  
      const xm = [x1, x2, x3, x4];
      const ym = [y1, y2, y3, y4];
  
      const mx = this._m(xm);
      const my = this._m(ym);
  
      dxf.setActiveLayer('2');
      dxf.drawAngularDim(x1, y1, x2, y2, x3, y3, x4, y4, mx, my);
    }
  
    return dxf.toDxfString();
  }
  
  
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
        r = this.testPoints();
        break;
      case eApgCadTestNames.LINES:
        r = this.testLines();
        break;
      case eApgCadTestNames.POLYLINES:
        r = this.testPolyLines();
        break;
      case eApgCadTestNames.ARCS:
        r = this.testArcs();
        break;
      case eApgCadTestNames.CIRCLES:
        r = this.testCircles();
        break;
      case eApgCadTestNames.LABELS:
        r = this.testTextLabels();
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
    }
    // this.testers.set(eApgCadTestNames.ANGULAR_DIMS,this._testAngularDims );

    // this.testers.set('DemoDrawing',this.demo);
    return r;
  }

}

