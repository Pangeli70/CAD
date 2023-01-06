/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/29] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { Svg, Uts } from "../../../deps.ts";
import { ApgCadSvg } from "../../../src/classes/ApgCadSvg.ts";
import { eApgCadDftFillStyles } from "../../../src/enums/eApgCadDftFillStyles.ts";
import { eApgCadDftLayers } from "../../../src/enums/eApgCadDftLayers.ts";
import { eApgCadDftStrokeStyles } from "../../../src/enums/eApgCadDftStrokeStyles.ts";
import { eApgCadDftTextStyles } from "../../../src/enums/eApgCadDftTextStyles.ts";
import { eApgCadStdColors } from "../../../src/enums/eApgCadStdColors.ts";
import { eApgCadTestFeatures } from "../enums/eApgCadTestFeatures.ts";
import { ApgCadBaseTester } from "./ApgCadBaseTester.ts";


export class ApgCadFeaturesTester extends ApgCadBaseTester {




  static RunTest(atest: eApgCadTestFeatures, aisBlackBack = false) {

    let r = "";
    switch (atest) {
      case eApgCadTestFeatures.LAYERS:
        r = this.testLayers(aisBlackBack);
        break;
      case eApgCadTestFeatures.STROKE_STYLES:
        r = this.testDftStrokeStyles(aisBlackBack);
        break;
      case eApgCadTestFeatures.FILL_STYLES:
        r = this.testFillStyles(aisBlackBack);
        break;
      case eApgCadTestFeatures.TEXT_STYLES:
        r = this.testTextStyles(aisBlackBack);
        break;
      case eApgCadTestFeatures.PATTERNS:
        r = this.testPatterns(aisBlackBack);
        break;
      case eApgCadTestFeatures.GRADIENTS:
        r = this.testGradients(aisBlackBack);
        break;
      case eApgCadTestFeatures.BLOCKS:
        r = this.testBlocks(aisBlackBack);
        break;
    }

    return r;
  }

  static testLayers(aisBlackBack = false) {
    const layerNames = Uts.ApgUtsEnum.StringValues(eApgCadDftLayers);
    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Default Layers";
    cad.svg.description = "Apg-Cad";
    for (let i = 0; i < layerNames.length; i++) {
      const layerName = layerNames[i];
      const r = this.getTestBox(cad, i, layerName);
      const layer = cad.setCurrentLayer(layerName);
      if (!layer) {
        throw new Error("Layer [" + layerName + "] Not implemented")
      }
      r.group.childOf(cad.currentLayer);
      const _rect = cad.svg
        .rect(r.point.x - r.w / 4, r.point.y - r.h / 4, r.w / 2, r.h / 2)
        .fill('#0f000f')
        .childOf(r.group);
      const _text = cad.svg
        .text(r.point.x, r.point.y, "AsBbCcYyWwXxZz \n 1234567890", cad.standardSize)
        .anchor(Svg.eApgSvgTextAnchor.middle)
        .stroke(eApgCadStdColors.NONE)
        .childOf(r.group);
    }
    this.cartouche(cad);
    return cad.svg.render();

  }

  static testDftStrokeStyles(aisBlackBack = false) {
    const styles = Uts.ApgUtsEnum.StringValues(eApgCadDftStrokeStyles);
    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Default Stroke Styles";
    cad.svg.description = "Apg-Cad";
    for (let i = 0; i < styles.length; i++) {
      const style = styles[i];
      const r = this.getTestBox(cad, i, style);
      const strokeStyle = cad.getStrokeStyle(style);
      if (!strokeStyle) {
        throw new Error("Style [" + style + "] Not implemented")
      }
      r.group.stroke(strokeStyle!.color, strokeStyle!.width);
      if (strokeStyle!.dashPattern) {
        r.group.strokeDashPattern(strokeStyle!.dashPattern, strokeStyle!.width);
      }
      r.group.childOf(cad.currentLayer);
    }
    this.cartouche(cad);
    return cad.svg.render();
  }

  static testFillStyles(aisBlackBack = false) {
    const styles = Uts.ApgUtsEnum.StringValues(eApgCadDftFillStyles);
    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Default Fill Styles";
    cad.svg.description = "Apg-Cad";
    for (let i = 0; i < styles.length; i++) {
      const style = styles[i];
      const r = this.getTestBox(cad, i, style);
      const fillStyle = cad.getFillStyle(style);
      if (!fillStyle) {
        throw new Error("Style [" + style + "] Not implemented")
      }
      r.group.fill(fillStyle!.color, fillStyle!.opacity);
      r.group.childOf(cad.currentLayer);
    }
    this.cartouche(cad);
    return cad.svg.render();
  }

  static testBlocks(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);

    cad.svg.title = "Default Blocks";
    cad.svg.description = "Apg-Cad";
    for (let i = 0; i < cad.blockDefs.length; i++) {
      const blockDef = cad.blockDefs[i];
      const r = this.getTestBox(cad, i, blockDef);
      r.group.childOf(cad.currentLayer);

      const block = cad.getBlock(blockDef);
      if (!block) {
        throw new Error("Block [" + block + "] Not implemented")
      }
      const _b = cad.svg
        .useT(blockDef, r.point.x, r.point.y, {})
        //.useT(blockDef, r.point.x, r.point.y, { scale: { x: 4, y: 4 }, rotate: { a: 90 }, translate: { x: 0, y: 100 } })
        .fill(eApgCadStdColors.CYAN)
        .childOf(r.group);
    }
    this.cartouche(cad);
    return cad.svg.render();
  }
  

  static testGradients(aisBlackBack = false) {
    const cad = new ApgCadSvg(aisBlackBack);
    const r = this.notImplemented(cad);
    return cad.svg.render();
  }


  static testPatterns(aisBlackBack = false) {
    const cad = new ApgCadSvg(aisBlackBack);
    const r = this.notImplemented(cad);
    return cad.svg.render();
  }


  static testTextStyles(aisBlackBack = false) {
    const textStyleNames = Uts.ApgUtsEnum.StringValues(eApgCadDftTextStyles);
    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Default Text styles";
    cad.svg.description = "Apg-Cad";

    const options = {
      w: 1800,
      h: 1000,
      dx: 200,
      dy: 200,
      itemsPerLine: 3
    }
    const debugTextStyle = this.getTestTextStyle(cad);
    debugTextStyle.anchor = Svg.eApgSvgTextAnchor.start;

    for (let i = 0; i < textStyleNames.length; i++) {
      const styleName = textStyleNames[i];
      const r = this.getTestBox(cad, i, styleName, options);
      const textStyle = cad.getTextStyle(styleName);
      if (!textStyle) {
        throw new Error("Text tyle [" + styleName + "] Not implemented")
      }

      let tx = r.point.x;
      if (textStyle.anchor) {
        if (textStyle.anchor == Svg.eApgSvgTextAnchor.start) {
          tx -= r.w / 2;
        }
      }
      cad.setCurrentLayer(eApgCadDftLayers.ZERO);
      r.group.childOf(cad.currentLayer);
      const _text = cad.svg
        .text(tx, r.point.y + r.h / 2, '\nAaBbCc 0123', textStyle.size * 1.1)
        .textStyle(textStyle)
        .childOf(r.group);

      const textLines = JSON
        .stringify(textStyle, undefined, "  ").replaceAll(" ", "&nbsp;")
      const jsonText = "\n\n\n" + textLines;
      const _jsonText = cad.svg
        .text(r.point.x - r.w / 2, r.point.y + r.h / 2, jsonText, debugTextStyle.size * 1.1)
        .textStyle(debugTextStyle)
        .childOf(r.group);
    }
    this.cartouche(cad);
    return cad.svg.render();
  }



}

