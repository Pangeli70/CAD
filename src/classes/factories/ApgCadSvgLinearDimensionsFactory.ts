/** -----------------------------------------------------------------------
 * @module [CAD-svg]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * @version 0.9.4 [APG 2023/01/06] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { A2D, Svg, Uts } from "../../../deps.ts";

import { eApgCadDftLayers } from "../../enums/eApgCadDftLayers.ts";
import { eApgCadLinearDimensionTypes } from "../../enums/eApgCadLinearDimensionTypes.ts";
import { eApgCadFactories } from "../../enums/eApgCadFactories.ts";
import { IApgCadDimension } from "../../interfaces/IApgCadDimension.ts";

import { ApgCadSvgUtils } from "../ApgCadSvgUtils.ts";

import { ApgCadSvgBasicShapesFactory } from "./ApgCadSvgBasicShapesFactory.ts";
import { ApgCadSvgDimensionsFactoryBase } from "./ApgCadSvgDimensionsFactoryBase.ts";


/**
 * Factory for Linear dimensions with arrows and ladders
 */
export class ApgCadSvgLinearDimensionsFactory extends ApgCadSvgDimensionsFactoryBase {



  /** Builds a Cad Linear Dimension with the ladders*/
  build(
    atype: eApgCadLinearDimensionTypes,
    a1stPoint: A2D.Apg2DPoint,
    a2ndPoint: A2D.Apg2DPoint,
    adisplacement: number,
    atextBef = '',
    atextAft = '',
  ) {
    const r = this.cad.svg.group();

    const data: IApgCadDimension = {
      firstP: a1stPoint,
      secondP: a2ndPoint,
      p1: A2D.Apg2DPoint.Clone(a1stPoint),
      p2: A2D.Apg2DPoint.Clone(a2ndPoint),
      ladderStart1: A2D.Apg2DPoint.Clone(a1stPoint),
      ladderStart2: A2D.Apg2DPoint.Clone(a2ndPoint),
      value: 0,
      dimension: ""
    };

    // step 1) Preliminary checks
    // ------------------------------------------------------------------------------

    // The two points are coincident
    const dx = Math.abs(data.p1.x - data.p2.x);
    const dy = Math.abs(data.p1.y - data.p2.y);
    if (dx == 0 && dy == 0) {
      this.messages.push('The two points are coincident');
      return r;
    }

    // The two points are almost coincident in the current digits precision
    const signicativeDx = Uts.ApgUtsMath.RoundToSignificant(dx, this.digits);
    const signicativeDy = Uts.ApgUtsMath.RoundToSignificant(dy, this.digits);
    if (signicativeDx == 0 && signicativeDy == 0) {
      this.messages.push('The two points are almost coincident accordingly with the current digits setting');
      return r;
    }

    // Verify if the type in correct
    atype = this.#checkType(data, atype);

    // step 2) Prepare the starting and ending points
    // Eg. this is necessary if the segment is diagonal but we need an horizontal or vertical dimension
    // --------------------------------------------------------------------------------------------

    // Verify if displacement value is correct accordingly with type and orientation
    data.displacement = this.#adaptDisplacementByType(data.p1, data.p2, atype, adisplacement);

    // If necessary modifies the points accordingly with type and orientation
    this.#adaptPointsByType(data.p1, data.p2, atype)

    //  step 3) perform calculations
    // --------------------------------------------------------------------------------------------

    const value = this.#calculate(data);

    data.dimension =
      (atextBef !== '' ? atextBef + ' ' : '')
      + value.toString()
      + (atextAft !== '' ? ' ' + atextAft : '')

    // step 4: draw the svg
    // ---------------------------------------------------------------------------------

    // Create the svg element
    this.#draw(data, r);

    // Draw debug elements
    if (this.cad.settings.debug) {
      const debugText = this.#debugText(data, atype);
      this.#drawDebug(data, debugText);
    }
    return r;

  }


  #calculate(adata: IApgCadDimension) {

    adata.pointsLine = new A2D.Apg2DLine(adata.p1, adata.p2);

    adata.arrow1Pos = adata.pointsLine.offsetPoint(adata.p1, adata.displacement!);
    adata.arrow2Pos = adata.pointsLine.offsetPoint(adata.p2, adata.displacement!);

    adata.dimLine = new A2D.Apg2DLine(adata.arrow1Pos, adata.arrow2Pos);
    if (adata.dimLine.angle > 90 && adata.dimLine.angle <= 270) {
      adata.arrow1Pos.swapWith(adata.arrow2Pos);
      adata.ladderStart1!.swapWith(adata.ladderStart2!);
      adata.dimLine = new A2D.Apg2DLine(adata.arrow1Pos, adata.arrow2Pos);
    }
    adata.value = adata.dimLine.length;

    adata.textBasePoint = adata.arrow1Pos.halfwayFrom(adata.arrow2Pos);

    adata.textOrientation = ApgCadSvgUtils.GetTextOrientation(adata.dimLine.angle);
    adata.arrowOrientation = adata.dimLine.angle % 360;

    adata.textLineSpacing = this.textStyle.size * ((this.textStyle.leading || 1.1) - 1);

    adata.textPoint = adata.dimLine.offsetPoint(adata.textBasePoint, adata.textLineSpacing);

    return Uts.ApgUtsMath.RoundToSignificant(adata.value, this.digits)
  }


  #checkType(data: IApgCadDimension, atype: eApgCadLinearDimensionTypes) {

    // Vertical dimensions cannot be horizontal
    if (data.p1.x === data.p2.x && atype === eApgCadLinearDimensionTypes.HORIZONTAL) {
      this.messages.push('Changed the dimension type from horizontal to vertical');
      atype = eApgCadLinearDimensionTypes.VERTICAL;
    }

    // Horizontal dimensions cannot be vertical
    if (data.p1.y === data.p2.y && atype === eApgCadLinearDimensionTypes.VERTICAL) {
      this.messages.push('Changed the dimension type from vertical to horizontal');
      atype = eApgCadLinearDimensionTypes.HORIZONTAL;
    }

    // The aligned dimensions must be forced to become vertical or horizontal if necessary
    if (atype === eApgCadLinearDimensionTypes.ALIGNED) {
      if (data.p1.x === data.p2.x) {
        this.messages.push('Changed the dimension type from aligned to vertical');
        atype = eApgCadLinearDimensionTypes.VERTICAL;
      }
      if (data.p1.y === data.p2.y) {
        this.messages.push('Changed the dimension type from aligned to horizontal');
        atype = eApgCadLinearDimensionTypes.HORIZONTAL;
      }
    }
    return atype;
  }


  #adaptPointsByType(
    afirst: A2D.Apg2DPoint,
    asecond: A2D.Apg2DPoint,
    atype: eApgCadLinearDimensionTypes,
  ) {

    // If the segment is diagonal
    if ((afirst.x !== asecond.x) && (afirst.y !== asecond.y)) {
      // Segment diagonal type vertical
      if (atype === eApgCadLinearDimensionTypes.VERTICAL) {
        afirst.x = asecond.x
      }
      // Segment diagonal type horizontal
      else if (atype === eApgCadLinearDimensionTypes.HORIZONTAL) {
        afirst.y = asecond.y //k
      }
    }
  }


  #adaptDisplacementByType(
    afirst: A2D.Apg2DPoint,
    asecond: A2D.Apg2DPoint,
    atype: eApgCadLinearDimensionTypes,
    adisplacement: number
  ) {
    let r = adisplacement;
    // If the segment is diagonal
    if ((afirst.x !== asecond.x) && (afirst.y !== asecond.y)) {
      // Segment diagonal type vertical
      if (atype === eApgCadLinearDimensionTypes.VERTICAL) {
        if (afirst.x < asecond.x && asecond.y > afirst.y) {
          r *= -1;
        }
        if (afirst.x > asecond.x && asecond.y < afirst.y) {
          r *= -1;
        }
      }
      // Segment diagonal type horizontal
      else if (atype === eApgCadLinearDimensionTypes.HORIZONTAL) {
        if (afirst.y > asecond.y && asecond.x > afirst.x) {
          r *= -1;
        }
        if (afirst.y < asecond.y && asecond.x < afirst.x) {
          r *= -1;
        }
      }
    }
    return r;
  }


  #draw(
    adata: IApgCadDimension,
    ar: Svg.ApgSvgNode
  ) {

    // If specified adds the CSS class
    if (this.cssClass !== '') {
      ar.class(this.cssClass);
    }

    // Draw the main line
    this.cad.svg
      .line(adata.arrow1Pos!.x, adata.arrow1Pos!.y, adata.arrow2Pos!.x, adata.arrow2Pos!.y)
      .childOf(ar);

    // Draw the arrow symbols
    const arrowBlock = this.cad.svg
      .getFromDef(this.arrowStyle);

    if (arrowBlock) {
      this.cad.svg
        .use(this.arrowStyle, adata.arrow1Pos!.x, adata.arrow1Pos!.y)
        .rotate(adata.arrowOrientation!, adata.arrow1Pos!.x, adata.arrow1Pos!.y)
        .childOf(ar);

      this.cad.svg
        .use(this.arrowStyle, adata.arrow2Pos!.x, adata.arrow2Pos!.y)
        .rotate(adata.arrowOrientation! + 180, adata.arrow2Pos!.x, adata.arrow2Pos!.y)
        .childOf(ar);
    }

    // Draw the text
    const _textDef = this.cad.svg
      .text(adata.textPoint!.x, adata.textPoint!.y, adata.dimension, this.textStyle.leading || 1.1)
      .rotate(adata.textOrientation!)
      .stroke("none", 0)
      .childOf(ar);

    // Draw the ladders
    this.cad.svg
      .line(adata.ladderStart1!.x, adata.ladderStart1!.y, adata.arrow1Pos!.x, adata.arrow1Pos!.y)
      .childOf(ar);

    this.cad.svg
      .line(adata.ladderStart2!.x, adata.ladderStart2!.y, adata.arrow2Pos!.x, adata.arrow2Pos!.y)
      .childOf(ar);
    return ar;
  }


  #debugText(adata: IApgCadDimension, atype: eApgCadLinearDimensionTypes) {
    let debugText = '';
    if (this.cad.settings.debug) {

      const t1stP = ApgCadSvgUtils.GetPointAsString('1stP', adata.firstP);
      const t2ndP = ApgCadSvgUtils.GetPointAsString('2ndP', adata.secondP);
      const tP1 = ApgCadSvgUtils.GetPointAsString('P1', adata.p1);
      const tP2 = ApgCadSvgUtils.GetPointAsString('P2', adata.p2);
      const taP1 = ApgCadSvgUtils.GetPointAsString('ap1', adata.arrow1Pos!);
      const taP2 = ApgCadSvgUtils.GetPointAsString('ap2', adata.arrow2Pos!);
      const ttbp = ApgCadSvgUtils.GetPointAsString('tbp', adata.textBasePoint!);
      const ttp = ApgCadSvgUtils.GetPointAsString('tp', adata.textPoint!);
      debugText += '\n'
        + 't: ' + atype + '\n'
        + `${t1stP} - ${t2ndP}\n`
        + `${tP1} - ${tP2}\n`
        + `${taP1} - ${taP2}\n`
        + `${ttbp} - ${ttp}\n`
        + 'ts: ' + adata.textLineSpacing!.toFixed(0) + '\n'
        + 'o: ' + adata.dimLine!.angle.toFixed(2) + '°\n'
        + 'll: ' + adata.displacement!.toFixed(0);
    }
    return debugText;
  }


  #drawDebug(
    adata: IApgCadDimension,
    adebugText: string
  ) {
    const currLayer = this.cad.currentLayer;

    this.cad.setCurrentLayer(eApgCadDftLayers.DEBUG);
    const layerDef = this.cad.layerDefs.get(eApgCadDftLayers.DEBUG);

    const DOT_SIZE = 10;
    const pf = this.cad.getPrimitiveFactory(eApgCadFactories.BASIC_SHAPES) as ApgCadSvgBasicShapesFactory;

    // First and last point
    pf
      .buildDot(adata.firstP, DOT_SIZE)
      .childOf(this.cad.currentLayer);

    pf
      .buildDot(adata.secondP, DOT_SIZE)
      .childOf(this.cad.currentLayer);

    // Text origin
    pf
      .buildDot(adata.textPoint!, DOT_SIZE)
      .childOf(this.cad.currentLayer);

    // Line between original points
    pf
      .buildLine(adata.firstP, adata.secondP)
      .childOf(this.cad.currentLayer);

    // Line between dimension points
    pf
      .buildLine(adata.p1, adata.p2)
      .childOf(this.cad.currentLayer);

    const textStyle = layerDef!.textStyle;
    const textLineHeight = (textStyle.size * (textStyle.leading || 1.1));

    // Draw the debug info
    const _debugText = this.cad.svg
      .text(adata.textPoint!.x, adata.textPoint!.y, adebugText, textLineHeight)
      .rotate(adata.textOrientation!)
      .textStyle(textStyle)
      .childOf(this.cad.currentLayer);

    this.cad.currentLayer = currLayer;
  }

}
