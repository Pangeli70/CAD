/** -----------------------------------------------------------------------
 * @module [SVG-CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/21] Porting to Deno
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



export class ApgCadSvgTester {

  static readonly MAX_X = 2000;
  static readonly MAX_N = 20;

  private _outputPath = '';

  constructor(apath: string) {
    this._outputPath = apath;
  }


  #save(asvg: string, atestname: string, aisProd = true) {

    // In production we don't have write permissions
    if (!aisProd) {
      const encoder = new TextEncoder();
      const data = encoder.encode(asvg);

      Deno.writeFileSync(this._outputPath + atestname + '.svg', data);
    }

  }

  private _testLayers() {
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


  private _testLineStyles() {
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


  static #buildTestLayers(acad: ApgCadSvg) {

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

  private _testArcs() {

    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Arcs";
    cad.svg.description = "Apg Svg Cad";
    const _layers = ApgCadSvgTester.#buildTestLayers(cad);
    cad.setLayer('1');

    const maxX = ApgCadSvgTester.MAX_X;
    const num = ApgCadSvgTester.MAX_N;
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


  private _testCircles() {
    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Circles";
    cad.svg.description = "Apg Svg Cad";
    const _layers = ApgCadSvgTester.#buildTestLayers(cad);
    cad.setLayer('1');

    const maxX = ApgCadSvgTester.MAX_X;
    const num = ApgCadSvgTester.MAX_N;
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


  private _testLines() {

    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Lines";
    cad.svg.description = "Apg Svg Cad";
    const _layers = ApgCadSvgTester.#buildTestLayers(cad);
    cad.setLayer('1');

    const maxX = ApgCadSvgTester.MAX_X;
    const num = ApgCadSvgTester.MAX_N;

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




  private _testPoints() {

    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Points";
    cad.svg.description = "Apg Svg Cad";
    const _layers = ApgCadSvgTester.#buildTestLayers(cad);
    cad.setLayer('1');

    const maxX = ApgCadSvgTester.MAX_X;
    const num = ApgCadSvgTester.MAX_N;

    for (let i = 0; i < num; i++) {
      const cx = Math.trunc(Math.random() * maxX);
      const cy = Math.trunc(Math.random() * maxX);
      cad.svg.circle(cx, cy, 1)
        .childOf(cad.currentLayer);
    }

    return cad.svg.render();
  }


  private _testPolyLines() {

    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Points";
    cad.svg.description = "Apg Svg Cad";
    const _layers = ApgCadSvgTester.#buildTestLayers(cad);
    cad.setLayer('1');

    const maxX = ApgCadSvgTester.MAX_X;
    const num = ApgCadSvgTester.MAX_N;

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


  private _testTextLabels() {

    const maxX = ApgCadSvgTester.MAX_X;
    const maxn = ApgCadSvgTester.MAX_N;

    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Labels";
    cad.svg.description = "Apg Svg Cad";
    const _layers = ApgCadSvgTester.#buildTestLayers(cad);
    cad.setLayer('1');

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
    const layers = ApgCadSvgTester.#buildTestLayers(cad);
    const dimFact = new ApgCadSvgLinearDimensionsFactory(cad.svg, layers[0]);

    const maxxy = ApgCadSvgTester.MAX_X;
    const maxn = ApgCadSvgTester.MAX_N;

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

  private _testHorizontalDims() {
    return ApgCadSvgTester.#testLinearDims(
      eApgCadLinearDimensionTypes.Horizontal);
  }
  private _testVerticalDims() {
    return ApgCadSvgTester.#testLinearDims(
      eApgCadLinearDimensionTypes.Vertical);
  }
  private _testAlignedDims() {
    return ApgCadSvgTester.#testLinearDims(
      eApgCadLinearDimensionTypes.Aligned);
  }


  static #testArcDims(atype: eApgCadLinearDimensionTypes) {

    const cad = new ApgCadSvg();
    cad.svg.title = `Test Arc dims (${atype})`;
    cad.svg.description = "Apg Svg Cad";
    const layers = ApgCadSvgTester.#buildTestLayers(cad);
    const dimFact = new ApgCadSvgLinearDimensionsFactory(cad.svg, layers[2]);


    const maxxy = ApgCadSvgTester.MAX_X;
    const maxn = ApgCadSvgTester.MAX_N;

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

  private _testDiameterDims() {
    return ApgCadSvgTester.#testArcDims(
      eApgCadLinearDimensionTypes.Radious);
  }
  private _testRadiousDims() {
    return ApgCadSvgTester.#testArcDims(
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


  #tester(an: number, afn: Function, aname: string, aisProd: boolean) {
    const dateTimeStamp = new Uts.ApgUtsDateTimeStamp(new Date()).Value;
    const svg = afn();
    const n = (an).toString().padStart(2, "0");
    const fileName = `CadSvgTest_${n}_${aname}_${dateTimeStamp}`;
    this.#save(svg, fileName, aisProd);
  }

  runAllTests(aisProd: boolean) {

    if (!aisProd) {
      Uts.ApgUtsFs.ClearFolderSync(this._outputPath);
    }

    let i = 0;
    this.#tester(i++, this._testLayers, "Layers", aisProd);
    
    this.#tester(i++, this._testLineStyles, "StrokeStyles", aisProd);

    this.#tester(i++, this._testPoints, "Points", aisProd);
    this.#tester(i++, this._testLines, "Lines", aisProd);
    this.#tester(i++, this._testPolyLines, "PolyLines", aisProd);
    this.#tester(i++, this._testArcs, "Arcs", aisProd);
    this.#tester(i++, this._testCircles, "Circles", aisProd);
    this.#tester(i++, this._testTextLabels, "Lables", aisProd);

    // this.#tester(i++,this._testDimStyles, `DimStyles`, aisProd);
    this.#tester(i++, this._testHorizontalDims, `HorizontalDims`, aisProd);
    this.#tester(i++, this._testVerticalDims, `VerticaleDims`, aisProd);
    this.#tester(i++, this._testAlignedDims, `AlignedDims`, aisProd);
    this.#tester(i++, this._testDiameterDims, `DiameterDims}`, aisProd);
    this.#tester(i++, this._testRadiousDims, `RadiousDims`, aisProd);
    // this.#tester(i++,this._testAngularDims, `AngularDims`, aisProd);

    // this.#tester(i++,this.demo, `${i++}_SvgTestDemoDrawing`, aisProd);

  }

}

