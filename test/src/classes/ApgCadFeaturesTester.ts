/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/29] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { ApgCadSvg } from "../../../src/classes/ApgCadSvg.ts";
import { eApgCadStdColors } from "../../../src/enums/eApgCadStdColors.ts";
import { eApgCadTestFeatures } from "../enums/eApgCadTestFeatures.ts";
import { ApgCadBaseTester } from "./ApgCadBaseTester.ts";


export class ApgCadFeaturesTester extends ApgCadBaseTester {


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



  static RunTest(atest: eApgCadTestFeatures) {

    let r = "";
    switch (atest) {
      case eApgCadTestFeatures.LAYERS:
        r = this.testLayers();
        break;
      case eApgCadTestFeatures.STROKE_STYLES:
        r = this.testLineStyles();
        break;
    }

    return r;
  }

}

