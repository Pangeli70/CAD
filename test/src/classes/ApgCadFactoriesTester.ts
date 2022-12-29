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
import { ApgCadSvgAngularDimensionsFactory } from "../../../src/classes/factories/ApgCadSvgAngularDimensionsFactory.ts";
import { ApgCadSvgBasicShapesFactory } from "../../../src/classes/factories/ApgCadSvgBasicShapesFactory.ts";
import { ApgCadSvgLinearDimensionsFactory } from "../../../src/classes/factories/ApgCadSvgLinearDimensionsFactory.ts";
import { eApgCadDftDimArrowStyles } from "../../../src/enums/eApgCadDftDimArrowStyles.ts";
import { eApgCadDftTextStyles } from "../../../src/enums/eApgCadDftTextStyles.ts";
import { eApgCadLinearDimensionTypes } from "../../../src/enums/eApgCadLinearDimensionTypes.ts";
import { eApgCadStdColors } from "../../../src/enums/eApgCadStdColors.ts";
import { eApgCadTestFactories } from "../enums/eApgCadTestFactories.ts";
import { eApgCadTestLayers } from "../enums/eApgCadTestLayers.ts";
import { ApgCadBaseTester } from "./ApgCadBaseTester.ts";



export class ApgCadFactoriesTester extends ApgCadBaseTester {


  static testBasicShapes() {
    const cad = new ApgCadSvg();
    cad.svg.title = "Test Random Points";
    cad.svg.description = "Apg Svg Cad";
    const layers = this.buildTestLayers(cad);
    const layId = this.getLayerName(eApgCadTestLayers.GREEN);
    cad.setCurrentLayer(layId);

    const maxR = 100;
    const minR = 10;
    const maxSides = 8;
    const minSides = 3;

    const shapeFact = new ApgCadSvgBasicShapesFactory(cad.svg, layers[0]);

    for (let i = 0; i < this.randomInN(); i++) {
      const cp = this.randomPointInRange();
      const r = this.randomInt(minR, maxR);
      const circle = shapeFact.buildCircle(cp, r);
      circle.fill("none");
    }

    for (let i = 0; i < this.randomInN(); i++) {
      const cp = this.randomPointInRange();
      const r = this.randomInt(minR, maxR);
      shapeFact.buildDot(cp, r, layers[1]);
    }

    for (let i = 0; i < this.randomInN(); i++) {
      const p1 = this.randomPointInRange();
      const p2 = this.randomPointInRange();
      shapeFact.buildLine(p1, p2, layers[2]);
    }

    for (let i = 0; i < this.randomInN(); i++) {
      const p1 = this.randomPointInRange();
      const w = this.randomInt(minR, maxR);
      const h = this.randomInt(minR, maxR);
      const rect = shapeFact.buildRectWH(p1, w, h, layers[3]);
      rect.attrib("fill", "none");
    }

    for (let i = 0; i < this.randomInN(); i++) {
      const cp = this.randomPointInRange();
      const r = this.randomInt(minR, maxR);
      const sides = this.randomInt(minSides, maxSides);
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
  
      // TODO @9 implement this mockup
      return dxf.toDxfString();
    }
*/

  static #testLinearDims(atype: eApgCadLinearDimensionTypes) {

    const cad = new ApgCadSvg();
    cad.svg.title = `Test Linear dims (${atype})`;
    cad.svg.description = "Apg Svg Cad";
    const layers = this.buildTestLayers(cad);
    const layId = this.getLayerName(eApgCadTestLayers.GREEN);
    cad.setCurrentLayer(layId);
    const dimFact = new ApgCadSvgLinearDimensionsFactory(cad.svg, layers[eApgCadTestLayers.RED]);
    dimFact.setup(layers[0], 20, eApgCadDftDimArrowStyles.ARCHITECTURAL);


    const maxD = 100;
    const minD = 10;

    for (let i = 0; i < this.randomInN(); i++) {
      const p1 = this.randomPointInRange();
      const p2 = this.randomPointInRange();
      const d = this.randomInt(minD, maxD);
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
    const layers = this.buildTestLayers(cad);
    const layId = this.getLayerName(eApgCadTestLayers.GREEN);
    cad.setCurrentLayer(layId);
    const dimFact = new ApgCadSvgLinearDimensionsFactory(cad.svg, layers[eApgCadTestLayers.YELLOW]);
    dimFact.setup(layers[0], 20, eApgCadDftDimArrowStyles.SIMPLE);


    const maxR = 400;
    const minR = 10;

    for (let i = 0; i < this.randomInN(); i++) {
      const centerPoint = this.randomPointInRange();
      const ladderPoint = this.randomPointInRange();
      const radious = this.randomInt(minR, maxR);
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

  static testAngularDims() {
    const cad = new ApgCadSvg();
    cad.svg.title = `Test Angular dims`;
    cad.svg.description = "Apg Svg Cad";
    const textStyle = cad.getTextStyle(eApgCadDftTextStyles.DIMENSIONS)
    const layers = this.buildTestLayers(cad);
    const layId = this.getLayerName(eApgCadTestLayers.GREEN);
    cad.setCurrentLayer(layId);
    const dimFact = new ApgCadSvgAngularDimensionsFactory(
      cad.svg,
      layers[eApgCadTestLayers.RED],
      textStyle!,
      eApgCadDftDimArrowStyles.MECHANICAL,
      20
    );




    for (let i = 0; i < this.randomInN(); i++) {
      const p1 = this.randomPointInRange()
      const p2 = this.randomPointInRange()
      const p3 = this.randomPointInRange()
      const p4 = this.randomPointInRange()


      cad.setCurrentLayer('3');
      cad.svg.line(p1.x, p1.y, p2.x, p2.y)
      cad.svg.line(p3.x, p3.y, p4.x, p4.y);

      const xm = [p1.x, p2.x, p3.x, p4.x];
      const ym = [p1.y, p2.y, p3.y, p4.y];

      const mx = this._m(xm);
      const my = this._m(ym);

      const l1 = new A2D.Apg2DLine(p1, p2);
      const l2 = new A2D.Apg2DLine(p3, p4);

      cad.setCurrentLayer('2');
      dimFact.build(l1, l2, 50, A2D.eApg2DQuadrant.posXposY, "##", "##");
    }

    return cad.svg.render();
  }



  static RunTest(atest: eApgCadTestFactories) {

    let r = "";
    switch (atest) {
     
      case eApgCadTestFactories.BASIC_SHAPES:
        r = this.testBasicShapes();
        break;
      case eApgCadTestFactories.DIM_STYLES:
        //r = this.testDimStyles();
        break;
      case eApgCadTestFactories.HORIZONTAL_DIMS:
        r = this.testHorizontalDims();
        break;
      case eApgCadTestFactories.VERTICAL_DIMS:
        r = this.testVerticalDims();
        break;
      case eApgCadTestFactories.ALIGNED_DIMS:
        r = this.testAlignedDims();
        break;
      case eApgCadTestFactories.DIAMETER_DIMS:
        r = this.testDiameterDims();
        break;
      case eApgCadTestFactories.RADIOUS_DIMS:
        r = this.testRadiousDims();
        break;
      case eApgCadTestFactories.ANGULAR_DIMS:
        r = this.testAngularDims();
        break;
    }

    return r;
  }

}

