/** -----------------------------------------------------------------------
 * @module [CAD/Test]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/29] Deno Deploy
 * @version 0.9.4 [APG 2023/01/04] Deno Deploy Beta
 * @version 0.9.5 [APG 2023/02/12] Improving Beta
 * -----------------------------------------------------------------------
 */

import { Svg, Uts } from "../../../deps.ts";
import { ApgCadSvg } from "../../../src/classes/ApgCadSvg.ts";
import { eApgCadStdColors } from "../../../src/enums/eApgCadStdColors.ts";
import { eApgCadDftFillStyles } from "../../../src/enums/eApgCadDftFillStyles.ts";
import { eApgCadDftLayers } from "../../../src/enums/eApgCadDftLayers.ts";
import { eApgCadDftStrokeStyles } from "../../../src/enums/eApgCadDftStrokeStyles.ts";
import { eApgCadDftTextStyles } from "../../../src/enums/eApgCadDftTextStyles.ts";
import { eApgCadTestDefaults } from "../enums/eApgCadTestDefaults.ts";
import { ApgCadBaseTester } from "./ApgCadBaseTester.ts";
import { IApgCadTestParameters } from "../interfaces/IApgCadTestParameters.ts";
import { IApgCadSvgOptions } from "../../../src/interfaces/IApgCadSvgOptions.ts";


export class ApgCadDefaultsTester extends ApgCadBaseTester {


  static async RunTest(aparams: IApgCadTestParameters) {

    const options: IApgCadSvgOptions = {
      name: aparams.name,
      blackBack: aparams.blackBack,
      gridMode: aparams.gridMode,
      cartesiansMode: aparams.cartesianMode,
      debug: aparams.debug
    }

    const cad = new ApgCadSvg(options);
    await cad.init();

    const atest = aparams.name as eApgCadTestDefaults;

    switch (atest) {
      case eApgCadTestDefaults.LAYERS:
        this.testLayers(cad);
        break;
      case eApgCadTestDefaults.STROKE_STYLES:
        this.testDftStrokeStyles(cad);
        break;
      case eApgCadTestDefaults.FILL_STYLES:
        this.testFillStyles(cad);
        break;
      case eApgCadTestDefaults.TEXT_STYLES:
        this.testTextStyles(cad);
        break;
      case eApgCadTestDefaults.PATTERNS:
        this.testPatterns(cad);
        break;
      case eApgCadTestDefaults.TEXTURES:
        this.testTextures(cad);
        break;
      case eApgCadTestDefaults.GRADIENTS:
        this.testGradients(cad);
        break;
      case eApgCadTestDefaults.BLOCKS:
        this.testBlocks(cad);
        break;
    }

    if (cad) {
      this.DrawCartouche(cad);
      this.Gui(cad);
    }
    return cad;
  }


  static testLayers(cad: ApgCadSvg) {

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

    return cad;

  }


  static testDftStrokeStyles(cad: ApgCadSvg) {

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

    return cad;
  }


  static testFillStyles(cad: ApgCadSvg) {

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

    return cad;
  }


  static testBlocks(cad: ApgCadSvg) {

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
        .useWithTransforms(blockDef, r.point.x, r.point.y, {})
        .fill(eApgCadStdColors.CYAN)
        .childOf(r.group);
    }

    return cad;
  }


  static testGradients(cad: ApgCadSvg) {

    cad.svg.title = "Default Gradients";
    cad.svg.description = "Apg-Cad";

    for (let i = 0; i < cad.gradientsDefs.length; i++) {
      const gradientDef = cad.gradientsDefs[i];
      const r = this.getTestBox(cad, i, gradientDef);

      const gradient = cad.getGradient(gradientDef);
      if (!gradient) {
        throw new Error("Gradient [" + gradient + "] not defined")
      }
      r.rect.fillGradient(gradientDef)
      r.group.childOf(cad.currentLayer);
    }

    return cad;
  }


  static testPatterns(cad: ApgCadSvg) {

    cad.svg.title = "Default Patterns";
    cad.svg.description = "Apg-Cad";

    for (let i = 0; i < cad.patternsDefs.length; i++) {
      const patternDef = cad.patternsDefs[i];
      const r = this.getTestBox(cad, i, patternDef);

      const pattern = cad.getPattern(patternDef);
      if (!pattern) {
        throw new Error("Pattern [" + pattern + "] not defined")
      }
      r.rect.fillPattern(patternDef)
      r.group.childOf(cad.currentLayer);
    }

    return cad;
  }


  static testTextures(cad: ApgCadSvg) {

    cad.svg.title = "Default Textures";
    cad.svg.description = "Apg-Cad";

    for (let i = 0; i < cad.textureDefs.length; i++) {
      const textureDef = cad.textureDefs[i];
      const r = this.getTestBox(cad, i, textureDef);

      const pattern = cad.getTexture(textureDef);
      if (!pattern) {
        throw new Error("Texture [" + pattern + "] not defined")
      }
      const clone = cad.svg.rect(r.point.x - r.w / 2, r.point.y - r.h / 2, r.w, r.h);
      clone.childOf(r.group);
      clone.fill('orange', 0.2);
      clone.stroke('none')

      r.rect.fillTexture(textureDef)
      r.group.childOf(cad.currentLayer);
    }

    return cad;
  }


  static testTextStyles(cad: ApgCadSvg) {

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

    return cad;
  }

}

