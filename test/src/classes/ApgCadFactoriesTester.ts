/** -----------------------------------------------------------------------
 * @module [CAD/Test]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/21] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * @version 0.9.4 [APG 2023/01/04] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */

import { A2D } from '../../../deps.ts';
import { ApgCadSvg } from "../../../src/classes/ApgCadSvg.ts";
import { ApgCadSvgAngularDimensionsFactory } from "../../../src/classes/factories/ApgCadSvgAngularDimensionsFactory.ts";
import { ApgCadSvgAnnotationsFactory } from "../../../src/classes/factories/ApgCadSvgAnnotationsFactory.ts";
import { ApgCadSvgArcDimensionsFactory } from "../../../src/classes/factories/ApgCadSvgArcDimensionsFactory.ts";
import { ApgCadSvgBasicShapesFactory } from "../../../src/classes/factories/ApgCadSvgBasicShapesFactory.ts";
import { ApgCadSvgLinearDimensionsFactory } from "../../../src/classes/factories/ApgCadSvgLinearDimensionsFactory.ts";
import { eApgCadArcDimensionTypes } from "../../../src/enums/eApgCadArcDimensionTypes.ts";
import { eApgCadDftDimArrowStyles } from "../../../src/enums/eApgCadDftDimArrowStyles.ts";
import { eApgCadDftLayers } from "../../../src/enums/eApgCadDftLayers.ts";
import { eApgCadDftTextStyles } from "../../../src/enums/eApgCadDftTextStyles.ts";
import { eApgCadLinearDimensionTypes } from "../../../src/enums/eApgCadLinearDimensionTypes.ts";
import { eApgCadTestFactories } from "../enums/eApgCadTestFactories.ts";
import { eApgCadTestGridMode } from "../enums/eApgCadTestGridMode.ts";
import { eApgCadTestLayers } from "../enums/eApgCadTestLayers.ts";
import { ApgCadBaseTester } from "./ApgCadBaseTester.ts";



export class ApgCadFactoriesTester extends ApgCadBaseTester {



  static async RunTest(atest: eApgCadTestFactories,
    aisBlackBack = false,
    agridMode = eApgCadTestGridMode.LINES,
    aisRandom = false,
    adebug = false,
  ) {

    let cad: ApgCadSvg | undefined = undefined;
    switch (atest) {

      case eApgCadTestFactories.BASIC_SHAPES:
        cad = await this.testBasicShapes(aisBlackBack);
        break;
      case eApgCadTestFactories.ANNOTATIONS:
        cad = await this.testAnnotations(aisBlackBack, agridMode, adebug);
        break;
      case eApgCadTestFactories.HORIZONTAL_LIN_DIMS:
        cad = await this.#testLinearDims(
          eApgCadLinearDimensionTypes.HORIZONTAL, aisBlackBack, agridMode, aisRandom, adebug);
        break;
      case eApgCadTestFactories.VERTICAL_LIN_DIMS:
        cad = await this.#testLinearDims(
          eApgCadLinearDimensionTypes.VERTICAL, aisBlackBack, agridMode, aisRandom, adebug);
        break;
      case eApgCadTestFactories.ALIGNED_LIN_DIMS:
        cad = await this.#testLinearDims(
          eApgCadLinearDimensionTypes.ALIGNED, aisBlackBack, agridMode, aisRandom, adebug);
        break;
      case eApgCadTestFactories.IN_DIAMETER_ARC_DIMS:
        cad = await this.#testArcDims(
          eApgCadArcDimensionTypes.INNER_DIAMETER, aisBlackBack, agridMode, aisRandom, adebug);
        break;
      case eApgCadTestFactories.IN_RADIOUS_ARC_DIMS:
        cad = await this.#testArcDims(
          eApgCadArcDimensionTypes.INNER_RADIOUS, aisBlackBack, agridMode, aisRandom, adebug);
        break;
      case eApgCadTestFactories.OUT_DIAMETER_DIMS:
        cad = await this.#testArcDims(
          eApgCadArcDimensionTypes.OUTER_DIAMETER, aisBlackBack, agridMode, aisRandom, adebug);
        break;
      case eApgCadTestFactories.OUT_RADIOUS_ARC_DIMS:
        cad = await this.#testArcDims(
          eApgCadArcDimensionTypes.OUTER_RADIOUS, aisBlackBack, agridMode, aisRandom, adebug);
        break;
      case eApgCadTestFactories.HORIZONTAL_ARC_DIMS:
        cad = await this.#testArcDims(
          eApgCadArcDimensionTypes.HORIZONTAL, aisBlackBack, agridMode, aisRandom, adebug);
        break;
      case eApgCadTestFactories.VERTICAL_ARC_DIMS:
        cad = await this.#testArcDims(
          eApgCadArcDimensionTypes.VERTICAL, aisBlackBack, agridMode, aisRandom, adebug);
        break;
      case eApgCadTestFactories.ANGULAR_DIMS:
        cad = await this.testAngularDims(aisBlackBack);
        break;
    }

    if (cad) {
      this.DrawCartouche(cad);
      this.Gui(cad);
    }
    return cad;
  }


  static async testBasicShapes(
    aisBlackBack = false,
    agridMode = eApgCadTestGridMode.LINES,
  ) {

    const cad = new ApgCadSvg(aisBlackBack);
    await cad.init();

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

    return cad;
  }

  static async testAnnotations(
    isBlackBack = false,
    agridMode = eApgCadTestGridMode.LINES,
    aisDebug = false,
  ) {

    const isDotGrid = agridMode == eApgCadTestGridMode.DOTS;
    const cad = new ApgCadSvg(isBlackBack, isDotGrid, aisDebug);
    await cad.init();

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

    return cad;

  }




  /*  
    private _testDimStyles() {
      const dxf = new ApgDxfDrawing();
  
      // TODO @9 implement this mockup
      return dxf.toDxfString();
    }
*/

  static async #testLinearDims(
    atype: eApgCadLinearDimensionTypes,
    isBlackBack = false,
    agridMode = eApgCadTestGridMode.LINES,
    aisRandom = false,
    aisDebug = false
  ) {

    const isDotGrid = agridMode == eApgCadTestGridMode.DOTS;
    const cad = new ApgCadSvg(isBlackBack, isDotGrid, aisDebug);
    await cad.init();

    cad.svg.title = `Test Linear dims (${atype})`;
    cad.svg.description = "Apg Svg Cad";

    // const textStyle: IApgSvgTextStyle = { size: 30, stroke: { color: "none", width: 0 }, aspectRatio: 0.5 }
    const textStyle = cad.getTextStyle(eApgCadDftTextStyles.DIMENSIONS)
    const dimFact = new ApgCadSvgLinearDimensionsFactory(
      cad,
      textStyle!,
      eApgCadDftDimArrowStyles.SIMPLE,
      4
    );

    const pts: A2D.Apg2DPoint[] = [];
    if (aisRandom) {
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


    for (let i = 0; i < pts.length; i += 2) {

      const p1 = pts[i];
      const p2 = pts[i + 1];
      const d = this.randomInt(minD, maxD);
      //const d = 500;

      cad.setCurrentLayer(eApgCadDftLayers.DIMENSIONS);
      dimFact
        .build(atype, p1, p2, d, "<", ">")
        ?.childOf(cad.currentLayer)

    }

    return cad;

  }


  static async #testArcDims(
    atype: eApgCadArcDimensionTypes,
    isBlackBack = false,
    agridMode = eApgCadTestGridMode.LINES,
    aisRandom = false,
    aisDebug = false,
  ) {

    const isDotGrid = agridMode == eApgCadTestGridMode.DOTS;
    const cad = new ApgCadSvg(isBlackBack, isDotGrid, aisDebug);
    await cad.init();

    cad.svg.title = `Test Arc dims (${atype})`;
    cad.svg.description = "Apg Svg Cad";

    const layers = this.buildTestLayers(cad);
    cad.setCurrentLayer(eApgCadDftLayers.DIMENSIONS);
    const textStyle = cad.getTextStyle(eApgCadDftTextStyles.DIMENSIONS)
    const dimFact = new ApgCadSvgArcDimensionsFactory(
      cad,
      textStyle!,
      eApgCadDftDimArrowStyles.SIMPLE,
      3
    );


    const maxD = 500;
    const minD = 200;
    let displacement = 200;

    const pts: A2D.Apg2DPoint[] = [];
    if (aisRandom) {
      for (let i = 0; i < this.randomInN(); i++) {
        const p1 = this.randomPointInRange();
        pts.push(p1);
        const p2 = this.randomPointInRange();
        pts.push(p2);
      }
      displacement = this.randomInt(minD, maxD);
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


    for (let i = 0; i < pts.length; i += 2) {

      const centerPoint = pts[i];
      const ladderPoint = pts[i + 1];

      dimFact
        .build(atype, centerPoint, ladderPoint, displacement)
        ?.childOf(cad.currentLayer)
    }

    return cad;
  }

  static _m(arr: number[]) {
    const sorted = arr.sort((a, b) => a === b ? 0 : a < b ? -1 : 1);
    const min = sorted[0];
    const max = sorted[arr.length - 1];
    const delta = (max - min) / 2;
    return delta + min;
  }

  static async testAngularDims(
    isBlackBack = false
  ) {

    const cad = new ApgCadSvg(isBlackBack);
    await cad.init();

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

    return cad;
  }




}

