/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/05] Deno Deploy
 * -----------------------------------------------------------------------
 */
import { A2D, Svg } from "../../deps.ts";

import {
  ApgCadSvgPrimitivesFactory,
  eApgCadSvgPrimitiveFactoryTypes,
  eApgCadDftDimTerminatorStyles,
  eApgCadLinearDimensionTypes,
  ApgCadSvgBasicShapesFactory
} from "../../mod.ts";
import { ApgCadSvgUtils } from "./ApgCadSvgUtils.ts";


/** Apg Svg : Factory for CAD Linear dimensions with arrows and ladders
 */
export class ApgCadSvgLinearDimensionsFactory extends ApgCadSvgPrimitivesFactory {


  DEBUG_MODE = false;

  /** The font data */
  fontName = "";
  /** Character Height */
  charHeight = 8;
  /** Arrow Block name*/
  terminator = eApgCadDftDimTerminatorStyles.UNDEFINED;
  /** Additional class for the annotations */
  cssClass = "";

  /** Line and interline height Ratio
   * @todo_9 Maybe is better to get this value from the leading of the fontdata
   */
  readonly K_H_LINE_RATIO = 3 / 2;

  public constructor(adoc: Svg.ApgSvgDoc, anode: Svg.ApgSvgNode) {
    super(adoc, anode);
    this.type = eApgCadSvgPrimitiveFactoryTypes.linearDimensions;
  }


  setup(
    alayer: Svg.ApgSvgNode,
    acharHeight: number,
    aterminator: eApgCadDftDimTerminatorStyles,
    acss = ''
  ) {
    this.layer = alayer;
    this.fontName = "...";
    this.charHeight = acharHeight;
    this.terminator = aterminator;
    this.cssClass = acss;
    this._ready = true;
  }

  /** Reconditions the original points and type accordingly with the ladder 
   * lenght and the real dimension type
   */
  #adaptPoints(
    afirst: A2D.Apg2DPoint,
    asecond: A2D.Apg2DPoint,
    all: number,
    atype: eApgCadLinearDimensionTypes
  ): boolean {
    let r = false;

    // If the segment is diagonal
    if ((afirst.x !== asecond.x) && (afirst.y !== asecond.y)) {

      // Segmment diagonal type vertical
      if (atype === eApgCadLinearDimensionTypes.Vertical) {

        if (afirst.x > asecond.x && all > 0) {
          asecond.x = afirst.x; // ok
        }

        else if (afirst.x > asecond.x && all < 0) {
          afirst.x = asecond.x;
          if (asecond.y > afirst.y) {
            r = true; // ok
          }
        }

        else if (afirst.x < asecond.x && all > 0) {
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

        if (afirst.y > asecond.y && all > 0) {
          asecond.y = afirst.y; // ok
        }

        else if (afirst.y > asecond.y && all < 0) {
          afirst.y = asecond.y;
          if (afirst.x > asecond.x) {
            r = true; // ok
          }
        }
        else if (afirst.y < asecond.y && all > 0) {
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
    // If the segment is horizontal
    else if (afirst.y === asecond.y) {

      if (afirst.x > asecond.x) {
        r = true;
      }

    }
    // if the segment is vertical
    else if (afirst.x === asecond.x) {

      if (asecond.y > afirst.y) {
        r = true; // ok
      }

    }

    return r;
  }

  /** Builds a Cad Linear Dimension with the ladders*/
  build(
    atype: eApgCadLinearDimensionTypes = eApgCadLinearDimensionTypes.Aligned,
    afirstPoint: A2D.Apg2DPoint,
    asecondPoint: A2D.Apg2DPoint,
    adisplacement: number,
    atextBef = '',
    atextAft = ''
  ) {

    // Factory non initialized
    if (!this._ready) {
      this._error = 'Tried to build a dimension defore initializing the factory';
      return undefined;
    }

    // Copy the points
    const p1 = A2D.Apg2DPoint.Clone(afirstPoint);
    const p2 = A2D.Apg2DPoint.Clone(asecondPoint);

    // Preliminary checks
    // ------------------------------------------------------------------------------

    // If the two points are coincident exits without doing nothing
    if (p1.y === p2.y && p1.x === p2.x) {
      this._error = 'The two points are coincident';
      return undefined;
    }

    // Vertical dimensions cannot be horizontal
    if (p1.x === p2.x && atype === eApgCadLinearDimensionTypes.Horizontal) {
      this._error = 'Changed the dimension type from horizontal to vertical';
      atype = eApgCadLinearDimensionTypes.Vertical;
    }

    // Horizontal dimensions cannot be vertical
    if (p1.y === p2.y && atype === eApgCadLinearDimensionTypes.Vertical) {
      this._error = 'Changed the dimension type from vertical to horizontall';
      atype = eApgCadLinearDimensionTypes.Horizontal;
    }

    // The diagonal dimensions mut be forced to become vertical or horizontal if necessary
    if (atype === eApgCadLinearDimensionTypes.Aligned) {
      if (p1.x === p2.x) {
        this._error = 'Changed the dimension type from diagonal to vertical';
        atype = eApgCadLinearDimensionTypes.Vertical;
      }
      if (p1.y === p2.y) {
        this._error = 'Changed the dimension type from diagonal to horizontall';
        atype = eApgCadLinearDimensionTypes.Horizontal;
      }
    }

    // 1st step: Manipulate the starting and ending points
    // This is necessary if the segment is diagonal but we need an horizontal or vertical dimension
    // --------------------------------------------------------------------------------------------

    // Copy the original points into the Intial Ladder Points.
    const ip1 = A2D.Apg2DPoint.Clone(p1);
    const ip2 = A2D.Apg2DPoint.Clone(p2);

    /** This flag determines if the points must be exchanged */
    const exchange = this.#adaptPoints(p1, p2, adisplacement, atype);

    if (exchange) {
      p1.SwapWith(p2);
      ip1.SwapWith(ip2);
    }

    // 2nd step: perform calculations
    // --------------------------------------------------------------------------------------------

    const pointsLine = new A2D.Apg2DLine(p1, p2);
    const arrow1Pos = pointsLine.OffsetPoint(p1, adisplacement);
    const arrow2Pos = pointsLine.OffsetPoint(p2, adisplacement);
    const dimLine = new A2D.Apg2DLine(arrow1Pos, arrow2Pos);

    const textBasePoint = arrow1Pos.HalfwayFrom(arrow2Pos);

    const textDirections = ApgCadSvgUtils.getTextDirection(dimLine.angle);
    const textOrientation = ApgCadSvgUtils.getTextOrientation(dimLine.angle);
    const arrowOrientation = ApgCadSvgUtils.getArrowOrientation(dimLine.angle);

    const textHeight = this.K_H_LINE_RATIO * this.charHeight * textDirections;

    /** (T)ext (P)osition related to the medium point */
    const textPoint = dimLine.OffsetPoint(textBasePoint, textHeight);

    /** (D)ebug (T)ext */
    let ldt = '';
    if (this.DEBUG_MODE) {
      ldt += '\n'
        + 't: ' + atype + '\n'
        + 'p1: ' + p1.x.toFixed(0).toString() + ',' + p1.y.toFixed(0).toString() + '\n'
        + 'p2: ' + p2.x.toFixed(0).toString() + ',' + p2.y.toFixed(0).toString() + '\n'
        + 'p3: ' + arrow1Pos.x.toFixed(0).toString() + ',' + arrow1Pos.y.toFixed(0).toString() + '\n'
        + 'p4: ' + arrow2Pos.x.toFixed(0).toString() + ',' + arrow2Pos.y.toFixed(0).toString() + '\n'
        + 'o: ' + dimLine.angle.toFixed(0).toString() + '°\n'
        + 'll: ' + adisplacement.toFixed(0).toString();
    }

    const dimension =
      (atextBef !== '' ? atextBef + ' ' : '')
      + dimLine.length.toFixed(0).toString()
      + (atextAft !== '' ? ' ' + atextAft : '')
      + ldt;

    // 3rd step: draw the svg
    // ---------------------------------------------------------------------------------

    // Start to create the svg element
    const r = this.svgDoc.group();
    r.childOf(this.layer);

    // If specified adds the CSS class
    if (this.cssClass !== '') {
      r.class(this.cssClass);
    }

    // Draw the main line
    this.svgDoc
      .line(arrow1Pos.x, arrow1Pos.y, arrow2Pos.x, arrow2Pos.y)
      .childOf(r);

    // Draw the arrow symbols
    const dimTerminatorDef = this.svgDoc.getFromDef(this.terminator);
    if (dimTerminatorDef) {
      this.svgDoc
        .use(arrow1Pos.x, arrow1Pos.y, this.terminator)
        .rotate(arrowOrientation, arrow1Pos.x, arrow1Pos.y)
        .childOf(r);

      this.svgDoc
        .use(arrow1Pos.x, arrow1Pos.y, this.terminator)
        .rotate(arrowOrientation + 180, arrow2Pos.x, arrow2Pos.y)
        .childOf(r);
    }

    // Draw the text
    const textDef = this.svgDoc.text(textPoint.x, textPoint.y, dimension);
    textDef
      .rotate(textOrientation, textPoint.x, textPoint.y)
      .childOf(r);

    // Draw the ladders
    this.svgDoc
      .line(p1.x, p1.y, arrow1Pos.x, arrow1Pos.y)
      .childOf(r);

    this.svgDoc
      .line(p2.x, p2.y, arrow2Pos.x, arrow2Pos.y)
      .childOf(r);

    // Draw debug elements
    if (this.DEBUG_MODE) {

      const pf = new ApgCadSvgBasicShapesFactory(this.svgDoc, this.layer);

      // First and last point
      pf.buildCircle(p1, 20);
      pf.buildCircle(p2, 20);

      // Text origin
      pf.buildCircle(textPoint, 20);

      // Line between points
      pf.buildLine(p1, p2);

    }
    return r;


  }

}
