/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/29] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { ApgCadSvg } from "../../../src/classes/ApgCadSvg.ts";
import { eApgCadStdColors } from "../../../src/enums/eApgCadStdColors.ts";
import { eApgCadDftFillOpacities } from "../../../src/enums/eApgCadDftFillOpacities.ts";
import { eApgCadDftFillStyles } from "../../../src/enums/eApgCadDftFillStyles.ts";
import { eApgCadDftGradients } from "../../../src/enums/eApgCadDftGradients.ts";
import { eApgCadDftLayers } from "../../../src/enums/eApgCadDftLayers.ts";
import { eApgCadDftPatterns } from "../../../src/enums/eApgCadDftPatterns.ts";
import { eApgCadDftStrokeStyles } from "../../../src/enums/eApgCadDftStrokeStyles.ts";
import { eApgCadDftStrokeWidths } from "../../../src/enums/eApgCadDftStrokeWidths.ts";
import { eApgCadDftTextStyles } from "../../../src/enums/eApgCadDftTextStyles.ts";
import { eApgCadTestLayers } from "../enums/eApgCadTestLayers.ts";
import { eApgCadTestDefaults } from "../enums/eApgCadTestDefaults.ts";
import { ApgCadBaseTester } from "./ApgCadBaseTester.ts";
import { A2D, Svg, Uts } from "../../../deps.ts";


export class ApgCadDefaultsTester extends ApgCadBaseTester {


  static RunTest(atest: eApgCadTestDefaults, aisBlackBack = false) {

    let r = "";
    switch (atest) {
      case eApgCadTestDefaults.LAYERS:
        r = this.testLayers(aisBlackBack);
        break;
      case eApgCadTestDefaults.STROKE_STYLES:
        r = this.testDftStrokeStyles(aisBlackBack);
        break;
      case eApgCadTestDefaults.FILL_STYLES:
        r = this.testFillStyles(aisBlackBack);
        break;
      case eApgCadTestDefaults.TEXT_STYLES:
        r = this.testTextStyles(aisBlackBack);
        break;
      case eApgCadTestDefaults.PATTERNS:
        r = this.testPatterns(aisBlackBack);
        break;
      case eApgCadTestDefaults.GRADIENTS:
        r = this.testGradients(aisBlackBack);
        break;
      case eApgCadTestDefaults.BLOCKS:
        r = this.testBlocks(aisBlackBack);
        break;
    }

    return r;
  }

  static testLayers(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Default Layers";
    cad.svg.description = "Apg-Cad";

    const options = {
      w: 2000,
      h: 1000,
      dx: 400,
      dy: 200,
      itemsPerLine: 3
    }
    const layerNames = Uts.ApgUtsEnum.StringValues(eApgCadDftLayers);
    for (let i = 0; i < layerNames.length; i++) {
      const layerName = layerNames[i];

      cad.setCurrentLayer(eApgCadDftLayers.ZERO);
      const tb = this.getTestBox(cad, i, layerName, options);
      tb.group.childOf(cad.currentLayer);

      const layer = cad.setCurrentLayer(layerName);
      if (!layer) {
        throw new Error("Layer [" + layerName + "] Not implemented")
      }
      const r = cad.svg.group()
      r.childOf(cad.currentLayer);

      const GROUPS = 3;
      const padding = tb.h / 10;
      const innerHeight = tb.h - (2 * padding);
      const innerWidth = tb.w - (2 * padding);
      const featureHeight = (innerHeight - ((GROUPS - 1) * padding)) / GROUPS;
      const featureX = tb.point.x - tb.w / 2 + padding;
      const featurey = tb.point.y - tb.h / 2 + padding;

      const _fillRect = cad.svg
        .rect(featureX, featurey, innerWidth, featureHeight)
        .childOf(r);

      const layerDef = cad.layerDefs.get(layerName);
      const layerTextStyle = layerDef!.textStyle;
      const textX = layerTextStyle.anchor == Svg.eApgSvgTextAnchor.middle ?
        tb.point.x :
        featureX;

      const lineHeight = layerTextStyle.size * (layerTextStyle.leading || 1.1);

      const textY = featurey + (featureHeight + padding) * 2
      const _text = cad.svg
        .text(textX, textY, "AsBbCc...YyWwXxZz \n 1234567890", lineHeight)
        .childOf(r);
    }

    this.DrawCartouche(cad);
    this.Gui(cad);
    return cad.svg.render();

  }

  static testDftStrokeStyles(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Default Stroke Styles";
    cad.svg.description = "Apg-Cad";

    const styles = Uts.ApgUtsEnum.StringValues(eApgCadDftStrokeStyles);
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
    this.DrawCartouche(cad);
    this.Gui(cad);
    return cad.svg.render();
  }


  static testFillStyles(aisBlackBack = false) {

    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Default Fill Styles";
    cad.svg.description = "Apg-Cad";

    const styles = Uts.ApgUtsEnum.StringValues(eApgCadDftFillStyles);
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
    this.DrawCartouche(cad);
    this.Gui(cad);
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
        throw new Error("Block [" + block + "] not defined")
      }
      const _b = cad.svg
        .useT(blockDef, r.point.x, r.point.y, {})
        .fill(eApgCadStdColors.CYAN)
        .childOf(r.group);
    }

    this.DrawCartouche(cad);
    this.Gui(cad);
    return cad.svg.render();
  }

  static testGradients(aisBlackBack = false) {
    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Default Gradients";
    cad.svg.description = "Apg-Cad";

    for (let i = 0; i < cad.gradientsDefs.length; i++) {
      const gradientDef = cad.gradientsDefs[i];
      const r = this.getTestBox(cad, i, gradientDef);

      const gradient = cad.getGradient(gradientDef);
      if (!gradient) {
        throw new Error("Gradient [" + gradient + "] not defined")
      }
      r.rect.fill(`url(#${gradientDef})`)
      r.group.childOf(cad.currentLayer);
    }

    this.DrawCartouche(cad);
    this.Gui(cad);
    return cad.svg.render();
  }

  static testPatterns(aisBlackBack = false) {
    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Default Patterns";
    cad.svg.description = "Apg-Cad";

    for (let i = 0; i < cad.patternsDefs.length; i++) {
      const patternDef = cad.patternsDefs[i];
      const r = this.getTestBox(cad, i, patternDef);

      const pattern = cad.getPattern(patternDef);
      if (!pattern) {
        throw new Error("Pattern [" + pattern + "] not defined")
      }
      r.rect.fill(`url(#${patternDef})`)
      r.group.childOf(cad.currentLayer);
    }

    this.DrawCartouche(cad);
    this.Gui(cad);
    return cad.svg.render();

    // TODO @3 APG20220122 -- Implement this
    /**
     * <defs>
        <pattern id="img1" patternUnits="userSpaceOnUse" width="100" height="100">
          <image href="wall.jpg" x="0" y="0" width="100" height="100" />
        </pattern>
      </defs>
      <path d="M5,5 l0,680 l980,0 l0,-680 l-980,0 fill="url(#img1)" />
     * 
     */
  }

  static testTextStyles(aisBlackBack = false) {
    const cad = new ApgCadSvg(aisBlackBack);
    cad.svg.title = "Default Text styles";
    cad.svg.description = "Apg-Cad";

    const options = {
      w: 2000,
      h: 1000,
      dx: 400,
      dy: 200,
      itemsPerLine: 3
    }
    const textStyleNames = Uts.ApgUtsEnum.StringValues(eApgCadDftTextStyles);

    const debugTextStyle = Uts.ApgUtsObj.DeepCopy(this.getTestTextStyle(cad)) as Svg.IApgSvgTextStyle;
    debugTextStyle.size /= 2;
    debugTextStyle.anchor = Svg.eApgSvgTextAnchor.start;

    for (let i = 0; i < textStyleNames.length; i++) {
      const styleName = textStyleNames[i];

      cad.setCurrentLayer(eApgCadDftLayers.ZERO);
      const r = this.getTestBox(cad, i, styleName, options);

      const textStyle = cad.getTextStyle(styleName);
      if (!textStyle) {
        throw new Error("Text tyle [" + styleName + "] Not implemented")
      }

      let xPos = r.point.x;
      if (textStyle.anchor) {
        if (textStyle.anchor == Svg.eApgSvgTextAnchor.start) {
          xPos -= r.w / 2;
        }
      }

      r.group.childOf(cad.currentLayer);
      const lineHeight = textStyle.size * (textStyle.leading || 1.1);
      const yPos = r.point.y + r.h / 2;
      const _text = cad.svg
        .text(xPos, yPos, '\nAaBbCc 0123', lineHeight)
        .textStyle(textStyle)
        .childOf(r.group);

      const textLines = JSON
        .stringify(textStyle, undefined, "  ").replaceAll(" ", "&nbsp;")
      const jsonText = "\n" + textLines;
      const jsonYPos = yPos - lineHeight;
      const debugLineHeight = debugTextStyle.size * (textStyle.leading || 1.1);
      const _jsonText = cad.svg
        .text(r.point.x - r.w / 2, jsonYPos, jsonText, debugLineHeight)
        .textStyle(debugTextStyle)
        .childOf(r.group);
    }

    this.DrawCartouche(cad);
    this.Gui(cad);
    return cad.svg.render();
  }

}

