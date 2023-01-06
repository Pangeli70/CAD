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
import { ApgCadSvgAnnotationsFactory } from "../../../src/classes/factories/ApgCadSvgAnnotationsFactory.ts";
import { ApgCadSvgBasicShapesFactory } from "../../../src/classes/factories/ApgCadSvgBasicShapesFactory.ts";
import { ApgCadSvgLinearDimensionsFactory } from "../../../src/classes/factories/ApgCadSvgLinearDimensionsFactory.ts";
import { eApgCadDftDimArrowStyles } from "../../../src/enums/eApgCadDftDimArrowStyles.ts";
import { eApgCadDftLayers } from "../../../src/enums/eApgCadDftLayers.ts";
import { eApgCadDftTextStyles } from "../../../src/enums/eApgCadDftTextStyles.ts";
import { eApgCadLinearDimensionTypes } from "../../../src/enums/eApgCadLinearDimensionTypes.ts";
import { eApgCadStdColors } from "../../../src/enums/eApgCadStdColors.ts";
import { eApgCadTestFactories } from "../enums/eApgCadTestFactories.ts";
import { eApgCadTestLayers } from "../enums/eApgCadTestLayers.ts";
import { ApgCadBaseTester } from "./ApgCadBaseTester.ts";



export class ApgCadFactoriesTester extends ApgCadBaseTester {



  static RunTest(atest: eApgCadTestFactories, isBlackBack = false) {

    let r = "";
    switch (atest) {

      case eApgCadTestFactories.BASIC_SHAPES:
        r = this.testBasicShapes(isBlackBack);
        break;
      case eApgCadTestFactories.ANNOTATIONS:
        r = this.testAnnotations(isBlackBack);
        break;
      case eApgCadTestFactories.HORIZONTAL_DIMS:
        r = this.testHorizontalDims(isBlackBack);
        break;
      case eApgCadTestFactories.VERTICAL_DIMS:
        r = this.testVerticalDims(isBlackBack);
        break;
      case eApgCadTestFactories.ALIGNED_DIMS:
        r = this.testAlignedDims(isBlackBack);
        break;
      case eApgCadTestFactories.DIAMETER_DIMS:
        r = this.testDiameterDims(isBlackBack);
        break;
      case eApgCadTestFactories.RADIOUS_DIMS:
        r = this.testRadiousDims(isBlackBack);
        break;
      case eApgCadTestFactories.ANGULAR_DIMS:
        r = this.testAngularDims(isBlackBack);
        break;
    }

    return r;
  }


  static testBasicShapes(aisBlackBack = false) {
    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Test Basic Shapes";
    cad.svg.description = "Apg Svg Cad Factory";
    const layers = this.buildTestLayers(cad);
    const layId = this.getLayerName(eApgCadTestLayers.GREEN);
    cad.setCurrentLayer(layId);

    const maxR = 100;
    const minR = 10;
    const maxSides = 8;
    const minSides = 3;

    const shapeFact = new ApgCadSvgBasicShapesFactory(cad,);

    for (let i = 0; i < this.randomInN(); i++) {
      const cp = this.randomPointInRange();
      const r = this.randomInt(minR, maxR);
      shapeFact
        .buildCircle(cp, r)
        .fill("none")
        .childOf(layers[0]);
    }

    for (let i = 0; i < this.randomInN(); i++) {
      const cp = this.randomPointInRange();
      const r = this.randomInt(minR, maxR);
      shapeFact
        .buildDot(cp, r)
        .childOf(layers[1]);
    }

    for (let i = 0; i < this.randomInN(); i++) {
      const p1 = this.randomPointInRange();
      const p2 = this.randomPointInRange();
      shapeFact
        .buildLine(p1, p2)
        .childOf(layers[2]);
    }

    for (let i = 0; i < this.randomInN(); i++) {
      const p1 = this.randomPointInRange();
      const w = this.randomInt(minR, maxR);
      const h = this.randomInt(minR, maxR);
      shapeFact
        .buildRect(p1, w, h)
        .fill("none")
        .childOf(layers[3]);
    }

    for (let i = 0; i < this.randomInN(); i++) {
      const cp = this.randomPointInRange();
      const r = this.randomInt(minR, maxR);
      const sides = this.randomInt(minSides, maxSides);
      shapeFact
        .buildPolygon(cp, r, sides, 360 / sides / 2)
        .fill("none")
        .childOf(layers[4]);
      shapeFact
        .buildDot(cp, 4)
        .childOf(layers[4]);
    }
    this.cartouche(cad);
    return cad.svg.render();
  }

  static testAnnotations(isBlackBack = false) {

    const cad = new ApgCadSvg(isBlackBack);
    cad.svg.title = `Test Annotations`;
    cad.svg.description = "Apg Svg Cad";

    cad.setCurrentLayer(eApgCadDftLayers.ANNOTATIONS);
    //const textStyle: IApgSvgTextStyle = { size: 30, stroke: { color: "none", width: 0 }, aspectRatio: 0.5, leading:30 }
    const textStyle = cad.getTextStyle(eApgCadDftTextStyles.ANNOTATIONS)
    const annotFact = new ApgCadSvgAnnotationsFactory(
      cad,
      textStyle!,
      eApgCadDftDimArrowStyles.MECHANICAL
    );

    const strings = [
      'APG CAD Manual test',
      'APG CAD, we love it!',
      'APG CAD is fun \n and is easy',
      'APG CAD don\'t lie',
      'APG CAD\nNow multiline!',
      'APG CAD\nNow even more\nmultiline!',
    ];

    const maxD = 500;
    const minD = 100;
    const ncases = this.randomInN() + 1;
    const cases = [{
      stringId: 0,
      orientation: 0,
      p1: new A2D.Apg2DPoint(1000, 1000),
      dispP: new A2D.Apg2DPoint(500, 500),
    }]

    for (let i = 1; i < ncases; i++) {
      const dispX = this.randomInt(minD, maxD);
      const dispY = this.randomInt(minD, maxD);

      cases.push({
        stringId: this.randomInt(1, strings.length - 1),
        orientation: this.randomInt(0, 90),
        p1: this.randomPointInRange(),
        dispP: new A2D.Apg2DPoint(dispX, dispY)
      })
    }

    for (const c of cases) {
      const g = annotFact.build(cad.currentLayer, c.p1, c.dispP, strings[c.stringId], c.orientation)
      g?.childOf(cad.currentLayer);
    }

    this.cartouche(cad);
    return cad.svg.render();

  }




  /*  
    private _testDimStyles() {
      const dxf = new ApgDxfDrawing();
  
      // TODO @9 implement this mockup
      return dxf.toDxfString();
    }
*/

  static #testLinearDims(atype: eApgCadLinearDimensionTypes, isBlackBack = false) {

    const RANDOM = true;
    const cad = new ApgCadSvg(isBlackBack);
    cad.svg.title = `Test Linear dims (${atype})`;
    cad.svg.description = "Apg Svg Cad";
    // const textStyle: IApgSvgTextStyle = { size: 30, stroke: { color: "none", width: 0 }, aspectRatio: 0.5 }
    const textStyle = cad.getTextStyle(eApgCadDftTextStyles.DIMENSIONS)
    const dimFact = new ApgCadSvgLinearDimensionsFactory(
      cad,
      textStyle!,
      eApgCadDftDimArrowStyles.SIMPLE
    );

    const pts: A2D.Apg2DPoint[] = [];
    if (RANDOM) {
      for (let i = 0; i < this.randomInN(); i++) {
        const p1 = this.randomPointInRange();
        pts.push(p1);
        const p2 = this.randomPointInRange();
        pts.push(p2);
      }
    }
    else { 
      pts.push(new A2D.Apg2DPoint(1000, 0));
      pts.push(new A2D.Apg2DPoint(2000, 1000));
      pts.push(new A2D.Apg2DPoint(3000, 1000));
      pts.push(new A2D.Apg2DPoint(4000, 0));
      pts.push(new A2D.Apg2DPoint(2000, 4000));
      pts.push(new A2D.Apg2DPoint(1000, 3000));
      pts.push(new A2D.Apg2DPoint(4000, 3000));
      pts.push(new A2D.Apg2DPoint(3000, 4000));
    }
      

    const maxD = 500;
    const minD = 100;

    
    for (let i = 0; i < pts.length; i+=2) {

      const p1 = pts[i];
      const p2 = pts[i+1];
      const d = this.randomInt(minD, maxD);
      //const d = 500;

      cad.setCurrentLayer(eApgCadDftLayers.DIMENSIONS);
      dimFact
        .build(atype, p1, p2, d, "<", ">")
        ?.childOf(cad.currentLayer)

    }
    this.cartouche(cad);
    return cad.svg.render();

  }

  static testHorizontalDims(isBlackBack = false) {
    return this.#testLinearDims(
      eApgCadLinearDimensionTypes.Horizontal, isBlackBack);
  }
  static testVerticalDims(isBlackBack = false) {
    return this.#testLinearDims(
      eApgCadLinearDimensionTypes.Vertical, isBlackBack);
  }
  static testAlignedDims(isBlackBack = false) {
    return this.#testLinearDims(
      eApgCadLinearDimensionTypes.Aligned, isBlackBack);
  }


  static #testArcDims(atype: eApgCadLinearDimensionTypes, isBlackBack = false) {

    const cad = new ApgCadSvg(isBlackBack);
    cad.svg.title = `Test Arc dims (${atype})`;
    cad.svg.description = "Apg Svg Cad";
    const layers = this.buildTestLayers(cad);
    cad.setCurrentLayer(eApgCadDftLayers.DIMENSIONS);
    const textStyle = cad.getTextStyle(eApgCadDftTextStyles.DIMENSIONS)
    const dimFact = new ApgCadSvgLinearDimensionsFactory(
      cad,
      textStyle!,
      eApgCadDftDimArrowStyles.SIMPLE
    );

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

      dimFact
        .build(atype, pc1!, pc2!, 50)
        ?.childOf(cad.currentLayer)
    }
    this.cartouche(cad);
    return cad.svg.render();
  }

  static testDiameterDims(isBlackBack = false) {
    return this.#testArcDims(
      eApgCadLinearDimensionTypes.Diameter, isBlackBack);
  }
  static testRadiousDims(isBlackBack = false) {
    return this.#testArcDims(
      eApgCadLinearDimensionTypes.Radious, isBlackBack);
  }




  static _m(arr: number[]) {
    const sorted = arr.sort((a, b) => a === b ? 0 : a < b ? -1 : 1);
    const min = sorted[0];
    const max = sorted[arr.length - 1];
    const delta = (max - min) / 2;
    return delta + min;
  }

  static testAngularDims(isBlackBack = false) {
    const cad = new ApgCadSvg(isBlackBack);
    cad.svg.title = `Test Angular dims`;
    cad.svg.description = "Apg Svg Cad";
    const textStyle = cad.getTextStyle(eApgCadDftTextStyles.DIMENSIONS)
    const layers = this.buildTestLayers(cad);
    const layId = this.getLayerName(eApgCadTestLayers.GREEN);
    cad.setCurrentLayer(layId);
    const dimFact = new ApgCadSvgAngularDimensionsFactory(
      cad,
      textStyle!,
      eApgCadDftDimArrowStyles.MECHANICAL,
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
      dimFact.build(cad.currentLayer, l1, l2, 50, A2D.eApg2DQuadrant.posXposY, "##", "##");
    }
    this.cartouche(cad);
    return cad.svg.render();
  }




}

