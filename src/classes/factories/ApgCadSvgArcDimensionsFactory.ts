/** -----------------------------------------------------------------------
 * @module [CAD-svg]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * -----------------------------------------------------------------------
 */
import { A2D, Svg } from "../../../deps.ts";
import { eApgCadDftDimArrowStyles } from "../../enums/eApgCadDftDimArrowStyles.ts";
import { eApgCadDftLayers } from "../../enums/eApgCadDftLayers.ts";
import { eApgCadLinearDimensionTypes } from "../../enums/eApgCadLinearDimensionTypes.ts";
import { eApgCadPrimitiveFactoryTypes } from "../../enums/eApgCadPrimitiveFactoryTypes.ts";
import { ApgCadSvg } from "../ApgCadSvg.ts";

import { ApgCadSvgUtils } from "../ApgCadSvgUtils.ts";
import { ApgCadSvgBasicShapesFactory } from "./ApgCadSvgBasicShapesFactory.ts";
import { ApgCadSvgPrimitivesFactory } from "./ApgCadSvgPrimitivesFactory.ts";


/** Apg Svg : Factory for CAD Linear dimensions with arrows and ladders
 */
export class ApgCadSvgLinearDimensionsFactory extends ApgCadSvgPrimitivesFactory {

  /** text style */
  textStyle: Svg.IApgSvgTextStyle;
  /** Arrow Block name*/
  arrowStyle: string = eApgCadDftDimArrowStyles.UNDEFINED;
  /** Additional class for the annotations */
  cssClass = "";


  public constructor(
    acad: ApgCadSvg,
    atextStyle: Svg.IApgSvgTextStyle,
    aarrowStyle: string,
    acssClass = ''
  ) {
    super(acad, eApgCadPrimitiveFactoryTypes.LINEAR_DIMS);
    this.textStyle = atextStyle;
    this.arrowStyle = aarrowStyle;
    this.cssClass = acssClass;
    this._ready = true;
  }


  /** Reconditions the original points and type accordingly with the ladder 
   * lenght and the real dimension type
   */
  #isNecessaryToSwapPoints(
    afirst: A2D.Apg2DPoint,
    asecond: A2D.Apg2DPoint,
    adisplacement: number,
    atype: eApgCadLinearDimensionTypes
  ): boolean {
    let r = false;

    // If the segment is diagonal
    if ((afirst.x !== asecond.x) && (afirst.y !== asecond.y)) {

      // Segment diagonal type vertical
      if (atype === eApgCadLinearDimensionTypes.Vertical) {

        if (afirst.x > asecond.x && adisplacement > 0) {
          asecond.x = afirst.x; // ok
        }

        else if (afirst.x > asecond.x && adisplacement < 0) {
          afirst.x = asecond.x;
          if (asecond.y > afirst.y) {
            r = true; // ok
          }
        }

        else if (afirst.x < asecond.x && adisplacement > 0) {
          afirst.x = asecond.x;
          if (asecond.y > afirst.y) {
            r = true; // ok
          }
        }

        else { // (p1.x < p2.x && alg < 0) {
          asecond.x = afirst.x; // ok
        }

      }
      // Segment diagonal type horizontal
      else if (atype === eApgCadLinearDimensionTypes.Horizontal) {

        if (afirst.y > asecond.y && adisplacement > 0) {
          asecond.y = afirst.y; // ok
        }

        else if (afirst.y > asecond.y && adisplacement < 0) {
          afirst.y = asecond.y;
          if (afirst.x > asecond.x) {
            r = true; // ok
          }
        }
        else if (afirst.y < asecond.y && adisplacement > 0) {
          afirst.y = asecond.y;
          if (afirst.x > asecond.x) {
            r = true; // ok
          }
        }
        else { // (p1.x < p2.x && alg < 0) {
          asecond.y = afirst.y;
          if (afirst.x > asecond.x) {
            r = true; // ok
          }
        }

      }
      // Segment diagonal type diagonal
      else {
        if (afirst.x > asecond.x) {
          r = true; // ok
        }
      }
    }
    // Segment is horizontal
    else if (afirst.y === asecond.y) {

      if (afirst.x > asecond.x) {
        r = true;
      }

    }
    // Segment is vertical
    else if (afirst.x === asecond.x) {

      if (asecond.y > afirst.y) {
        r = true; // ok
      }

    }

    return r;
  }

  /** Builds a Cad Linear Dimension with the ladders*/
  build(
    atype: eApgCadLinearDimensionTypes,
    afirstPoint: A2D.Apg2DPoint,
    asecondPoint: A2D.Apg2DPoint,
    adisplacement: number,
    atextBef = '',
    atextAft = ''
  ) {

    const EPSILON = 0.00001;

    // Copy the points
    const p1 = A2D.Apg2DPoint.Clone(afirstPoint);
    const p2 = A2D.Apg2DPoint.Clone(asecondPoint);

    // Preliminary checks
    // ------------------------------------------------------------------------------

    // If the two points are coincident exits without doing nothing
    if (p1.y === p2.y && p1.x === p2.x) {
      this._messages.push('The two points are coincident');
      p2.x += EPSILON;
      p2.y += EPSILON;
    }

    // Vertical dimensions cannot be horizontal
    if (p1.x === p2.x && atype === eApgCadLinearDimensionTypes.Horizontal) {
      this._messages.push('Changed the dimension type from horizontal to vertical');
      atype = eApgCadLinearDimensionTypes.Vertical;
    }

    // Horizontal dimensions cannot be vertical
    if (p1.y === p2.y && atype === eApgCadLinearDimensionTypes.Vertical) {
      this._messages.push('Changed the dimension type from vertical to horizontal');
      atype = eApgCadLinearDimensionTypes.Horizontal;
    }

    // The aligned dimensions must be forced to become vertical or horizontal if necessary
    if (atype === eApgCadLinearDimensionTypes.Aligned) {
      if (p1.x === p2.x) {
        this._messages.push('Changed the dimension type from aligned to vertical');
        atype = eApgCadLinearDimensionTypes.Vertical;
      }
      if (p1.y === p2.y) {
        this._messages.push('Changed the dimension type from aligned to horizontal');
        atype = eApgCadLinearDimensionTypes.Horizontal;
      }
    }

    //In arc dimensions displacement must be calculated properly
    if (atype === eApgCadLinearDimensionTypes.Diameter) {
      const radious = (p1.distanceFrom(p2) * Math.sign(adisplacement)) / 2;
      adisplacement += radious;
    }

    // 1st step: Prepare the starting and ending points
    // Eg. this is necessary if the segment is diagonal but we need an horizontal or vertical dimension
    // --------------------------------------------------------------------------------------------

    // Copy the original points into the Intial Ladder Points.
    const ladderStart1 = A2D.Apg2DPoint.Clone(p1);
    const ladderStart2 = A2D.Apg2DPoint.Clone(p2);

    const swap = this.#isNecessaryToSwapPoints(p1, p2, adisplacement, atype);

    if (swap) {
      p1.swapWith(p2);
      ladderStart1.swapWith(ladderStart2);
    }

    // 2nd step: perform calculations
    // --------------------------------------------------------------------------------------------

    const pointsLine = new A2D.Apg2DLine(p1, p2);
    const arrow1Pos = pointsLine.offsetPoint(p1, adisplacement);
    const arrow2Pos = pointsLine.offsetPoint(p2, adisplacement);
    const dimLine = new A2D.Apg2DLine(arrow1Pos, arrow2Pos);

    const textBasePoint = arrow1Pos.halfwayFrom(arrow2Pos);

    const textDirections = ApgCadSvgUtils.getTextDirection(dimLine.angle);
    const textOrientation = ApgCadSvgUtils.getTextOrientation(dimLine.angle);
    const arrowOrientation = ApgCadSvgUtils.getArrowOrientation(dimLine.angle);

    const textHeight = this.textStyle.size * (this.textStyle.leading || 1.2);

    /** (T)ext (P)osition related to the medium point */
    const textPoint = dimLine.offsetPoint(textBasePoint, textHeight);


    let debugText = '';
    if (ApgCadSvgUtils.DEBUG_MODE) {
      debugText += '\n'
        + 't: ' + atype + '\n'
        + 'p1: ' + p1.x.toFixed(2) + ',' + p1.y.toFixed(2) + '\n'
        + 'p2: ' + p2.x.toFixed(2) + ',' + p2.y.toFixed(2) + '\n'
        + 'p3: ' + arrow1Pos.x.toFixed(2) + ',' + arrow1Pos.y.toFixed(2) + '\n'
        + 'p4: ' + arrow2Pos.x.toFixed(2) + ',' + arrow2Pos.y.toFixed(2) + '\n'
        + 'o: ' + dimLine.angle.toFixed(2) + '°\n'
        + 'll: ' + adisplacement.toFixed(2);
    }

    const dimension =
      (atextBef !== '' ? atextBef + ' ' : '')
      + dimLine.length.toFixed(2)
      + (atextAft !== '' ? ' ' + atextAft : '')

    // 3rd step: draw the svg
    // ---------------------------------------------------------------------------------

    // Start to create the svg element
    const r = this.#draw(
      arrow1Pos, arrow2Pos, arrowOrientation,
      textPoint, dimension, textOrientation,
      ladderStart1, ladderStart2
    );

    // Draw debug elements
    if (ApgCadSvgUtils.DEBUG_MODE) {
      this.#drawDebug(afirstPoint, asecondPoint, textPoint, debugText, textOrientation);
    }
    return r;


  }


  #draw(
    arrow1Pos: A2D.Apg2DPoint,
    arrow2Pos: A2D.Apg2DPoint,
    arrowOrientation: number,
    textPoint: A2D.Apg2DPoint,
    dimension: string,
    textOrientation: number,
    ladderStart1: A2D.Apg2DPoint,
    ladderStart2: A2D.Apg2DPoint
  ) {
    const r = this._cad.svg.group();

    // If specified adds the CSS class
    if (this.cssClass !== '') {
      r.class(this.cssClass);
    }

    // Draw the main line
    this._cad.svg
      .line(arrow1Pos.x, arrow1Pos.y, arrow2Pos.x, arrow2Pos.y)
      .childOf(r);

    // Draw the arrow symbols
    const arrowBlock = this._cad.svg
      .getFromDef(this.arrowStyle);

    if (arrowBlock) {
      this._cad.svg
        .use(this.arrowStyle, arrow1Pos.x, arrow1Pos.y)
        .attrib("transform-origin", "left , middle")
        .rotate(arrowOrientation, arrow1Pos.x, arrow1Pos.y)
        .childOf(r);

      this._cad.svg
        .use(this.arrowStyle, arrow2Pos.x, arrow2Pos.y)
        .attrib("transform-origin", "left , middle")
        .scale(-1, 1)
        .rotate(arrowOrientation + 180)
        .childOf(r);
    }

    // Draw the text
    const _textDef = this._cad.svg
      .text(textPoint.x, textPoint.y, dimension, this.textStyle.leading || 1.2)
      .rotate(textOrientation)
      .stroke("none", 0)
      .childOf(r);

    // Draw the ladders
    this._cad.svg
      .line(ladderStart1.x, ladderStart1.y, arrow1Pos.x, arrow1Pos.y)
      .childOf(r);

    this._cad.svg
      .line(ladderStart2.x, ladderStart2.y, arrow2Pos.x, arrow2Pos.y)
      .childOf(r);
    return r;
  }

  #drawDebug(
    ap1: A2D.Apg2DPoint,
    ap2: A2D.Apg2DPoint,
    atextPoint: A2D.Apg2DPoint,
    adebugText: string,
    atextOrientation: number
  ) {
    const currLayer = this._cad.currentLayer;
    const currGroup = this._cad.currentGroup;

    this._cad.setCurrentLayer(eApgCadDftLayers.DEBUG);
    const leyerDef = this._cad.layerDefs.get(eApgCadDftLayers.DEBUG);

    const DOT_SIZE = 10;
    const pf = this._cad.getPrimitiveFactory(eApgCadPrimitiveFactoryTypes.BASIC_SHAPES) as ApgCadSvgBasicShapesFactory;

    // First and last point
    pf
      .buildDot(ap1, DOT_SIZE)
      .childOf(this._cad.currentLayer);

    pf
      .buildDot(ap2, DOT_SIZE)
      .childOf(this._cad.currentLayer);

    // Text origin
    pf
      .buildDot(atextPoint, DOT_SIZE)
      .childOf(this._cad.currentLayer);

    // Line between points
    pf
      .buildLine(ap1, ap2)
      .childOf(this._cad.currentLayer);

    const textStyle = leyerDef!.textStyle;
    const textLineHeight = (textStyle.size * (textStyle.leading || 1.1));

    // Draw the debug info
    const _debugText = this._cad.svg
      .text(atextPoint.x, atextPoint.y, adebugText, textLineHeight)
      .rotate(atextOrientation)//, textPosition.x, textPosition.y)
//      .childOf(this._cad.currentLayer);

    this._cad.currentGroup = currGroup;
    this._cad.currentLayer = currLayer;
  }
}
