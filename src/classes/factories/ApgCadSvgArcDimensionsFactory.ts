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
import { eApgCadArcDimensionTypes } from "../../enums/eApgCadArcDimensionTypes.ts";
import { eApgCadFactories } from "../../enums/eApgCadFactories.ts";
import { IApgCadDimension } from "../../interfaces/IApgCadDimension.ts";

import { ApgCadSvgUtils } from "../ApgCadSvgUtils.ts";

import { ApgCadSvgBasicShapesFactory } from "./ApgCadSvgBasicShapesFactory.ts";
import { ApgCadSvgDimensionsFactoryBase } from "./ApgCadSvgDimensionsFactoryBase.ts";


/** Apg Svg : Factory for CAD Arc dimensions with arrows and ladders
 */
export class ApgCadSvgArcDimensionsFactory extends ApgCadSvgDimensionsFactoryBase {


  /** Builds a Cad Arc Dimension with the ladders*/
  build(
    atype: eApgCadArcDimensionTypes,
    acenterPoint: A2D.Apg2DPoint,
    a2ndPoint: A2D.Apg2DPoint,
    adisplacement: number,
    atextBef = '',
    atextAft = '',
  ) {
    const r = this.cad.svg.group();

    const data: IApgCadDimension = {
      firstP: acenterPoint,
      secondP: a2ndPoint,
      p1: A2D.Apg2DPoint.Clone(acenterPoint),
      p2: A2D.Apg2DPoint.Clone(a2ndPoint),
      value: acenterPoint.distanceFrom(a2ndPoint),
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

    // If necessary modifies the points accordingly with type and orientation
    this.#adaptPointsByType(data, atype);

    // Verify if displacement value is correct accordingly with type and orientation
    data.displacement = this.#adaptDisplacementByType(data, atype, adisplacement);

    //  step 3) perform calculations
    // --------------------------------------------------------------------------------------------

    const { value, approx } = this.#calculate(data, atype);

    data.dimension =
      ((atextBef !== '') ? atextBef + ' ' : '') +
      ((approx) ? '~' : '') +
      value.toString() +
      ((atextAft !== '') ? ' ' + atextAft : '')

    this.#calculateText(data, atype);

    // step 4: draw the svg
    // ---------------------------------------------------------------------------------

    // Create the svg element
    this.#draw(data, atype, r);

    // Draw debug elements
    if (this.cad.settings.debug) {
      const debugText = this.#debugText(data, atype);
      this.#drawDebug(data, debugText);
    }
    return r;

  }


  #calculate(adata: IApgCadDimension, atype: eApgCadArcDimensionTypes) {

    const r = {
      value: adata.value, //radious;
      approx: false
    }

    let v = adata.value;

    adata.pointsLine = new A2D.Apg2DLine(adata.p1, adata.p2);

    switch (atype) {
      case eApgCadArcDimensionTypes.HORIZONTAL:
      case eApgCadArcDimensionTypes.VERTICAL:
      case eApgCadArcDimensionTypes.OUTER_DIAMETER:
        {
          adata.arrow1Pos = adata.pointsLine.offsetPoint(adata.p1, adata.displacement!);
          adata.arrow2Pos = adata.pointsLine.offsetPoint(adata.p2, adata.displacement!);
          v *= 2;
        }
        break;
      case eApgCadArcDimensionTypes.INNER_DIAMETER:
        {
          adata.arrow1Pos = A2D.Apg2DPoint.Clone(adata.p1);
          adata.arrow2Pos = A2D.Apg2DPoint.Clone(adata.p2);
          v *= 2;
        }
        break;
      case eApgCadArcDimensionTypes.INNER_RADIOUS:
      case eApgCadArcDimensionTypes.OUTER_RADIOUS:
        {
          adata.arrow1Pos = A2D.Apg2DPoint.Clone(adata.firstP);
          adata.arrow2Pos = A2D.Apg2DPoint.Clone(adata.secondP);
        }
        break;
    }

    adata.dimLine = new A2D.Apg2DLine(adata.arrow1Pos, adata.arrow2Pos);
    r.value = Uts.ApgUtsMath.RoundToSignificant(v, this.digits);
    if ((r.value - v) !== 0) r.approx = true;
    return r
  }



  #calculateText(adata: IApgCadDimension, atype: eApgCadArcDimensionTypes) {

    const atextWidth = adata.dimension.length * this.textStyle.size * this.textStyle.aspectRatio;

    adata.textOrientation = ApgCadSvgUtils.GetTextOrientation(adata.dimLine!.angle);
    adata.arrowOrientation = adata.dimLine!.angle % 360;

    adata.textLineSpacing = this.textStyle.size * ((this.textStyle.leading || 1.1) - 1);

    switch (atype) {
      case eApgCadArcDimensionTypes.HORIZONTAL:
      case eApgCadArcDimensionTypes.VERTICAL:
      case eApgCadArcDimensionTypes.OUTER_DIAMETER:
      case eApgCadArcDimensionTypes.INNER_DIAMETER:
      case eApgCadArcDimensionTypes.INNER_RADIOUS:
        {
          adata.textBasePoint = adata.arrow1Pos!.halfwayFrom(adata.arrow2Pos!);
          adata.textPoint = adata.dimLine!.offsetPoint(adata.textBasePoint, adata.textLineSpacing);
        }
        break;
      case eApgCadArcDimensionTypes.OUTER_RADIOUS:
        {
          adata.ladderStart1 = A2D.Apg2DPoint.Clone(adata.secondP!);
          adata.ladderStart2 = adata.dimLine!.pointAtDistanceFromPoint(adata.firstP!, adata.displacement!);
          adata.ladderAdditional = A2D.Apg2DPoint.Clone(adata.ladderStart2!);
          const sign = (adata.dimLine!.angle >= 90 && adata.dimLine!.angle < 270) ? -1 : 1;

          adata.ladderAdditional.x += atextWidth * sign;
          adata.textBasePoint = A2D.Apg2DPoint.Clone(adata.ladderStart2!);
          adata.textBasePoint.x += (atextWidth / 2) * sign;
          adata.textPoint = A2D.Apg2DPoint.Clone(adata.textBasePoint);
          adata.textPoint.y += adata.textLineSpacing;
          adata.textOrientation = 0;
        }
        break;
    }

  }


  #checkType(data: IApgCadDimension, atype: eApgCadArcDimensionTypes) {

    return atype;
  }


  #adaptPointsByType(
    adata: IApgCadDimension,
    atype: eApgCadArcDimensionTypes,
  ) {

    const radious = adata.value;
    const ladderline = new A2D.Apg2DLine(adata.firstP, adata.secondP);

    adata.ladderStart1 = ladderline.pointAtDistanceFromPoint(adata.firstP, radious);
    adata.ladderStart2 = ladderline.pointAtDistanceFromPoint(adata.firstP, -radious);

    // If the segment is diagonal
    if ((adata.firstP.x !== adata.ladderStart1!.x) && (adata.firstP.y !== adata.ladderStart1!.y)) {
      // Segment diagonal type vertical
      if (atype === eApgCadArcDimensionTypes.VERTICAL) {
        const sign = (
          (ladderline.angle >= 0 && ladderline.angle < 90) ||
          (ladderline.angle >= 270 && ladderline.angle < 360)
        ) ? 1 : -1;
        adata.ladderStart1!.x = adata.firstP.x;
        adata.ladderStart1!.y = adata.firstP.y + radious * sign;
        adata.ladderStart2!.x = adata.firstP.x;
        adata.ladderStart2!.y = adata.firstP.y - radious * sign;
      }
      // Segment diagonal type horizontal
      else if (atype === eApgCadArcDimensionTypes.HORIZONTAL) {
        const sign = (ladderline.angle >= 0 && ladderline.angle < 180) ? 1 : -1;
        adata.ladderStart1!.x = adata.firstP.x - radious * sign;
        adata.ladderStart1!.y = adata.firstP.y;
        adata.ladderStart2!.x = adata.firstP.x + radious * sign;
        adata.ladderStart2!.y = adata.firstP.y;
      }
    }

    adata.p1 = A2D.Apg2DPoint.Clone(adata.ladderStart1!);
    adata.p2 = A2D.Apg2DPoint.Clone(adata.ladderStart2!);
  }


  #adaptDisplacementByType(
    adata: IApgCadDimension,
    atype: eApgCadArcDimensionTypes,
    adisplacement: number
  ) {

    const radious = adata.value;

    let r = adisplacement;
    // If the segment is diagonal
    if ((adata.p1.x !== adata.p2.x) && (adata.p1.y !== adata.p2.y)) {
      // Segment diagonal type vertical
      if (atype === eApgCadArcDimensionTypes.VERTICAL) {
        if (adata.p1.x < adata.p2.x && adata.p2.y > adata.p1.y) {
          r *= -1;
        }
        if (adata.p1.x > adata.p2.x && adata.p2.y < adata.p1.y) {
          r *= -1;
        }
      }
      // Segment diagonal type horizontal
      else if (atype === eApgCadArcDimensionTypes.HORIZONTAL) {
        if (adata.p1.y > adata.p2.y && adata.p2.x > adata.p1.x) {
          r *= -1;
        }
        if (adata.p1.y < adata.p2.y && adata.p2.x < adata.p1.x) {
          r *= -1;
        }
      }
    }

    const sign = Math.sign(r);

    switch (atype) {
      case eApgCadArcDimensionTypes.HORIZONTAL:
      case eApgCadArcDimensionTypes.VERTICAL:
      case eApgCadArcDimensionTypes.OUTER_DIAMETER:
        {
          r += (radious * sign);
        }
        break;
      case eApgCadArcDimensionTypes.OUTER_RADIOUS:
        {
          r += (radious);
        }
        break;
      case eApgCadArcDimensionTypes.INNER_DIAMETER:
      case eApgCadArcDimensionTypes.INNER_RADIOUS:
        {
          r = 0;
        }
        break;
    }

    return r;
  }


  #draw(
    adata: IApgCadDimension,
    atype: eApgCadArcDimensionTypes,
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

      switch (atype) {
        case eApgCadArcDimensionTypes.HORIZONTAL:
        case eApgCadArcDimensionTypes.VERTICAL:
        case eApgCadArcDimensionTypes.OUTER_DIAMETER:
        case eApgCadArcDimensionTypes.INNER_DIAMETER:
          {
            this.cad.svg
              .use(this.arrowStyle, adata.arrow1Pos!.x, adata.arrow1Pos!.y)
              .rotate(adata.arrowOrientation!, adata.arrow1Pos!.x, adata.arrow1Pos!.y)
              .childOf(ar);

            this.cad.svg
              .use(this.arrowStyle, adata.arrow2Pos!.x, adata.arrow2Pos!.y)
              .rotate(adata.arrowOrientation! + 180, adata.arrow2Pos!.x, adata.arrow2Pos!.y)
              .childOf(ar);
          }
          break;
        case eApgCadArcDimensionTypes.INNER_RADIOUS:
          {
            this.cad.svg
              .use(this.arrowStyle, adata.secondP!.x, adata.secondP!.y)
              .rotate(adata.arrowOrientation! + 180, adata.secondP!.x, adata.secondP!.y)
              .childOf(ar);
          }
          break;
        case eApgCadArcDimensionTypes.OUTER_RADIOUS:
          {
            this.cad.svg
              .use(this.arrowStyle, adata.secondP!.x, adata.secondP!.y)
              .rotate(adata.arrowOrientation!, adata.secondP!.x, adata.secondP!.y)
              .childOf(ar);
          }
          break;
      }

    }

    // Draw the text
    const _textDef = this.cad.svg
      .text(adata.textPoint!.x, adata.textPoint!.y, adata.dimension, this.textStyle.leading || 1.1)
      .rotate(adata.textOrientation!)
      .stroke("none", 0)
      .childOf(ar);

    // Draw the ladders
    switch (atype) {
      case eApgCadArcDimensionTypes.HORIZONTAL:
      case eApgCadArcDimensionTypes.VERTICAL:
      case eApgCadArcDimensionTypes.OUTER_DIAMETER:
        {
          this.cad.svg
            .line(adata.ladderStart1!.x, adata.ladderStart1!.y, adata.arrow1Pos!.x, adata.arrow1Pos!.y)
            .childOf(ar);

          this.cad.svg
            .line(adata.ladderStart2!.x, adata.ladderStart2!.y, adata.arrow2Pos!.x, adata.arrow2Pos!.y)
            .childOf(ar);
        }
        break;
      case eApgCadArcDimensionTypes.INNER_DIAMETER:
      case eApgCadArcDimensionTypes.INNER_RADIOUS:
        {
          // do nothing
        }
        break;
      case eApgCadArcDimensionTypes.OUTER_RADIOUS:
        {
          this.cad.svg
            .line(adata.ladderStart1!.x, adata.ladderStart1!.y, adata.ladderStart2!.x, adata.ladderStart2!.y)
            .childOf(ar);

          this.cad.svg
            .line(adata.ladderStart2!.x, adata.ladderStart2!.y, adata.ladderAdditional!.x, adata.ladderAdditional!.y)
            .childOf(ar);
        }
        break;
    }

    return ar;
  }


  #debugText(adata: IApgCadDimension, atype: eApgCadArcDimensionTypes) {
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
      debugText += '\n\n'
        + 'type: ' + atype + " val: " + adata.value.toString() + '\n'
        + `${t1stP} - ${t2ndP}\n`
        + `${tP1} - ${tP2}\n`
        + 'disp: ' + adata.displacement!.toFixed(0) + '\n'
        + `${taP1} - ${taP2}\n`
        + `${ttbp} - ${ttp}\n`
        + 'tlsp: ' + adata.textLineSpacing!.toFixed(0) + '\n'
        + 'dla: ' + adata.dimLine!.angle.toFixed(2) + '° ' + 'aro: ' + adata.arrowOrientation!.toFixed(2) + '°\n'
        + 'll: ' + adata.displacement!.toFixed(0);
    }
    return debugText;
  }


  #drawDebug(
    adata: IApgCadDimension,
    adebugText: string
  ) {
    const currLayer = this.cad.currentLayer;
    const currGroup = this.cad.currentGroup;

    this.cad.setCurrentLayer(eApgCadDftLayers.DEBUG);
    const leyerDef = this.cad.layerDefs.get(eApgCadDftLayers.DEBUG);

    const DOT_SIZE = 10;
    const pf = this.cad.getPrimitiveFactory(eApgCadFactories.BASIC_SHAPES) as ApgCadSvgBasicShapesFactory;

    // First and last point
    pf
      .buildDot(adata.firstP, DOT_SIZE * 2)
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

    // Circle 
    pf
      .buildCircle(adata.firstP, adata.value)
      .fill("none")
      .childOf(this.cad.currentLayer);

    const textStyle = leyerDef!.textStyle;
    const textLineHeight = (textStyle.size * (textStyle.leading || 1.1));

    // Draw the debug info
    const _debugText = this.cad.svg
      .text(adata.textPoint!.x, adata.textPoint!.y, adebugText, textLineHeight)
      .rotate(adata.textOrientation!)
      .textStyle(textStyle)
      .childOf(this.cad.currentLayer);

    this.cad.currentGroup = currGroup;
    this.cad.currentLayer = currLayer;
  }
}
