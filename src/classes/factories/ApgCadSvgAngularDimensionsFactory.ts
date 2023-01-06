/** -----------------------------------------------------------------------
 * @module [CAD-Svg]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/30]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * -----------------------------------------------------------------------
 */
import { A2D, Svg, Uts } from "../../../deps.ts";
import { eApgCadDftDimArrowStyles } from "../../enums/eApgCadDftDimArrowStyles.ts";
import { eApgCadDftLayers } from "../../enums/eApgCadDftLayers.ts";
import { eApgCadPrimitiveFactoryTypes } from "../../enums/eApgCadPrimitiveFactoryTypes.ts";
import { ApgCadSvg } from "../ApgCadSvg.ts";
import { ApgCadSvgUtils } from "../ApgCadSvgUtils.ts";
import { ApgCadSvgBasicShapesFactory } from "./ApgCadSvgBasicShapesFactory.ts";
import { ApgCadSvgPrimitivesFactory } from './ApgCadSvgPrimitivesFactory.ts';


/** Factory that creates Cad Linear dimensions with arrows and ladders
 */
export class ApgCadSvgAngularDimensionsFactory extends ApgCadSvgPrimitivesFactory {

  /** text style */
  textStyle: Svg.IApgSvgTextStyle;
  /** Arrow Block name*/
  arrowStyle: string = eApgCadDftDimArrowStyles.UNDEFINED;
  /** Additional class for the annotations */
  cssClass = "";

  readonly K_ARROW_LINE = 3;

  /** Minimum difference in the slope of the lines */
  readonly K_MIN_SLOPE_DIFF = 0.001;

  /** Creates a Cad Angular Dimension Factory
   * @param acad Cad document
   * @param atextStyle Text formatting info
   * @param aarrowStyle Element symbol used for the arrow
   * @param acssClass Additional class added to the element (default = '')
   */
  constructor(
    acad: ApgCadSvg,
    atextStyle: Svg.IApgSvgTextStyle,
    aarrowStyle: eApgCadDftDimArrowStyles,
    acssClass: string = ''
  ) {
    super(acad, eApgCadPrimitiveFactoryTypes.ANGULAR_DIMS);
    this.textStyle = Uts.ApgUtsObj.DeepCopy(atextStyle) as Svg.IApgSvgTextStyle;
    this.arrowStyle = aarrowStyle;
    this.cssClass = acssClass;
    this.ready = true;
  }

  /** Builds a Cad Angular Dimension with the ladders
   * @param  afirstLine First line
   * @param  asecondLine second line
   * @param  aladderRadious The value positive or negative determines the text position
   * @param  aquadrant Quadrant where we want to display the dimension (default = posXposY)
   * @param atextBef Additional text of the annotation Before the value (default = '')
   * @param  atextAft Additional text of the annotation After the value (default = '')
   * @returns An svg group of the Dimension or undefined
   */
  build(
    aparent: Svg.ApgSvgNode,
    afirstLine: A2D.Apg2DLine,
    asecondLine: A2D.Apg2DLine,
    aladderRadious: number,
    aquadrant: A2D.eApg2DQuadrant = A2D.eApg2DQuadrant.posXposY,
    atextBef = '',
    atextAft = ''
  ) {

    // Start to create the svg element
    const r = this.cad.svg.group();

    // A) Preliminary checks

    // If the straight lines are 'almost' parallel returns
    if (Math.abs(afirstLine.slope - asecondLine.slope) < this.K_MIN_SLOPE_DIFF) {
      this.messages.push('The two segments are parallel');
      return r;
    }

    // B) 1st step: Perform initial calculations

    const { dimBeginAngle, dimEndAngle, dimAngleValue } = this.#getAngles(afirstLine, asecondLine, aquadrant);

    const intersectionPoint = <A2D.Apg2DPoint>afirstLine.intersection(asecondLine);

    const { arrowPoint1, arrowPoint2, areLinesInverted } = this.#getArrowPoints(
      afirstLine, asecondLine,
      intersectionPoint, aladderRadious,
      dimBeginAngle, dimEndAngle);

    const bisectorPoint = arrowPoint1.halfwayFrom(arrowPoint2);

    const biserctorLine = new A2D.Apg2DLine(intersectionPoint, bisectorPoint);

    const textPoint = biserctorLine.pointAtDistanceFromPoint(intersectionPoint, aladderRadious + this.textStyle.size);

    const textBaseline = biserctorLine.perpendicular(textPoint!);
    const textOrientation = ApgCadSvgUtils.GetTextOrientation(textBaseline.angle);

    const { arrow1Baseline, arrow2Baseline } = this.getArrowsBaselines(
      afirstLine, asecondLine, biserctorLine,
      arrowPoint1, arrowPoint2);

    const { arrow1Orientation, arrow2Orientation } = this.getArrowsOrientations(arrow1Baseline, arrow2Baseline);

    /** (D)ebug (T)ext */
    let ldbgTxt = '';
    if (ApgCadSvgUtils.DEBUG_MODE) {
      ldbgTxt += '\n'
        + 'q:' + aquadrant + ' - o2:' + textOrientation.toFixed(2) + '°\n'
        + 'd1:' + afirstLine.angle.toFixed(2) + ', d2:' + asecondLine.angle.toFixed(2) + '\n'
        + 'l1p1:' + arrowPoint1.x.toFixed(2) + ',' + arrowPoint1.y.toFixed(2) + '\n'
        + 'l1p2:' + arrowPoint2.x.toFixed(2) + ',' + arrowPoint2.y.toFixed(2) + '\n'
        + '';
    }

    const dimText = atextBef + ' ' + dimAngleValue.toFixed(1) + '°' + atextAft + ldbgTxt;



    // If specified adds the CSS class
    if (this.cssClass !== '') {
      r.class(this.cssClass);
    }

    this.cad.svg
      .use(this.arrowStyle, arrowPoint1.x, arrowPoint1.y)
      .rotate(arrow1Orientation, arrowPoint1.x, arrowPoint1.y)
      .childOf(r);

    this.cad.svg
      .use(this.arrowStyle, arrowPoint2.x, arrowPoint2.y)
      .rotate(arrow2Orientation, arrowPoint2.x, arrowPoint2.y)
      .childOf(r);


    // Draw the svg Text
    this.cad.svg
      .text(textPoint!.x, textPoint!.y, dimText, this.textStyle.size * 1.2)
      .rotate(textOrientation, textPoint!.x, textPoint!.y)
      .stroke('none', 0)
      .childOf(r);

    // Draw Arrow lines
    let lpg: A2D.Apg2DPoint;
    if (areLinesInverted === false) {
      if (!afirstLine.isInTheSegment(arrowPoint1)) {
        const pts = arrow1Baseline.pointsOverLine(arrowPoint1, 100 * this.K_ARROW_LINE);
        lpg = intersectionPoint.nearestIn(pts!);
        // TODO @3 APG 20221226 -- this is the inner arrow line that is drawn over the arc
        this.cad.svg
          .line(arrowPoint1.x, arrowPoint1.y, lpg.x, lpg.y)
          .childOf(r);

      }
    } else {
      if (!asecondLine.isInTheSegment(arrowPoint1)) {
        const pts = arrow2Baseline.pointsOverLine(arrowPoint1, 100 * this.K_ARROW_LINE);
        lpg = intersectionPoint.nearestIn(pts!);
        this.cad.svg
          .line(arrowPoint1.x, arrowPoint1.y, lpg.x, lpg.y)
          .childOf(r);
      }
    }

    if (areLinesInverted === false) {
      if (!asecondLine.isInTheSegment(arrowPoint2)) {
        const pts = arrow1Baseline.pointsOverLine(arrowPoint2, 100 * this.K_ARROW_LINE);
        lpg = intersectionPoint.nearestIn(pts);
        this.cad.svg
          .line(arrowPoint2.x, arrowPoint2.y, lpg.x, lpg.y)
          .childOf(r);
      }
    } else {
      if (!afirstLine.isInTheSegment(arrowPoint2)) {
        const pts = arrow2Baseline.pointsOverLine(arrowPoint2, 100 * this.K_ARROW_LINE);
        lpg = intersectionPoint.nearestIn(pts);
        this.cad.svg
          .line(arrowPoint2.x, arrowPoint2.y, lpg.x, lpg.y)
          .childOf(r);
      }
    }

    // Draw arc
    let pathInstruction = "";
    if (aquadrant === A2D.eApg2DQuadrant.posXposY) {
      pathInstruction =
        'M ' + arrowPoint1.x.toString() + ' ' + (arrowPoint1.y).toString() +
        ' A ' + aladderRadious.toString() + ' ' + aladderRadious.toString() + ' 0 0 0 ' + arrowPoint2.x.toString() + ' ' + (arrowPoint2.y).toString();

    } else if (aquadrant === A2D.eApg2DQuadrant.negXposY) {
      pathInstruction =
        'M ' + arrowPoint1.x.toString() + ' ' + (arrowPoint1.y).toString() +
        ' A ' + aladderRadious.toString() + ' ' + aladderRadious.toString() + ' 0 0 0 ' + arrowPoint2.x.toString() + ' ' + (arrowPoint2.y).toString()

    } else if (aquadrant === A2D.eApg2DQuadrant.negXnegY) {
      pathInstruction =
        'M ' + arrowPoint1.x.toString() + ' ' + (arrowPoint1.y).toString() +
        ' A ' + aladderRadious.toString() + ' ' + aladderRadious.toString() + ' 0 0 0 ' + arrowPoint2.x.toString() + ' ' + (arrowPoint2.y).toString()
    } else {

      pathInstruction =
        'M ' + arrowPoint1.x.toString() + ' ' + (arrowPoint1.y).toString()
        + ' A ' + aladderRadious.toString() + ' ' + aladderRadious.toString() + ' 0 1 0 ' + arrowPoint2.x.toString() + ' ' + (arrowPoint2.y).toString()
    }
    // TODO @4 APG 20221226 -- explore the arc instruction instead than path
    this.cad.svg
      .path(pathInstruction)
      .fill('none')
      .childOf(r);

    // Disegna elementi di debug
    if (ApgCadSvgUtils.DEBUG_MODE) {

      this.#drawDebugEntities(
        afirstLine, asecondLine,
        intersectionPoint, bisectorPoint, textPoint!,
        arrowPoint1, arrowPoint2
      );

    }

    return r;


  }


  private getArrowsBaselines(
    afirstLine: A2D.Apg2DLine,
    asecondLine: A2D.Apg2DLine,
    biserctorLine: A2D.Apg2DLine,
    arrowPoint1: A2D.Apg2DPoint,
    arrowPoint2: A2D.Apg2DPoint
  ) {
    let tmpArrowLine: A2D.Apg2DLine;
    if (afirstLine.contains(arrowPoint1)) {
      tmpArrowLine = afirstLine.perpendicular(arrowPoint1);
    } else {
      tmpArrowLine = asecondLine.perpendicular(arrowPoint1);
    }

    const intersectionBetweenTempArrowLineAndBisectorLine = biserctorLine.intersection(tmpArrowLine);

    const arrow1Baseline = new A2D.Apg2DLine(intersectionBetweenTempArrowLineAndBisectorLine!, arrowPoint1);
    const arrow2Baseline = new A2D.Apg2DLine(intersectionBetweenTempArrowLineAndBisectorLine!, arrowPoint2);

    return { arrow1Baseline, arrow2Baseline };
  }

  private getArrowsOrientations(arrow1Baseline: A2D.Apg2DLine, arrow2Baseline: A2D.Apg2DLine) {
    const arrow1Orientation = arrow1Baseline.angle % 360;
    const arrow2Orientation = arrow2Baseline.angle % 360;
    return { arrow1Orientation, arrow2Orientation };
  }

  #drawDebugEntities(
    afirstLine: A2D.Apg2DLine,
    asecondLine: A2D.Apg2DLine,
    intersectionPoint: A2D.Apg2DPoint,
    bisectorPoint: A2D.Apg2DPoint,
    textPoint: A2D.Apg2DPoint,
    arrowPoint1: A2D.Apg2DPoint,
    arrowPoint2: A2D.Apg2DPoint
  ) {
    const DOT_SIZE = 10;

    const pf = new ApgCadSvgBasicShapesFactory(this.cad);
    this.cad.setCurrentLayer(eApgCadDftLayers.DEBUG);

    // First and last point first line
    pf
      .buildCircle(afirstLine.p1, DOT_SIZE)
      .childOf(this.cad.currentLayer);
    pf
      .buildCircle(afirstLine.p2, DOT_SIZE)
      .childOf(this.cad.currentLayer);
    
    // First line
    pf
      .buildLine(afirstLine.p1, afirstLine.p2)
      .childOf(this.cad.currentLayer);
    
    // First and last point second line
    pf
      .buildDot(asecondLine.p1, DOT_SIZE)
      .childOf(this.cad.currentLayer);
    pf
      .buildDot(asecondLine.p2, DOT_SIZE)
      .childOf(this.cad.currentLayer);
    
    // Second line
    pf
      .buildLine(asecondLine.p1, asecondLine.p2)
      .childOf(this.cad.currentLayer);
    
    // Intersection
    pf
      .buildDot(intersectionPoint, DOT_SIZE)
      .childOf(this.cad.currentLayer);
    
    // Bisector line
    pf
      .buildLine(intersectionPoint, bisectorPoint)
      .childOf(this.cad.currentLayer);

    // Text origin
    pf
      .buildCircle(textPoint!, DOT_SIZE)
      .childOf(this.cad.currentLayer);
    
    // Line between arrowpoints
    pf
      .buildLine(arrowPoint1, arrowPoint2)
      .childOf(this.cad.currentLayer);
  }

  #getArrowPoints(
    afirstLine: A2D.Apg2DLine,
    asecondLine: A2D.Apg2DLine,
    aintersectionPoint: A2D.Apg2DPoint,
    aladderRadious: number,
    adimBeginAngle: number,
    adimEndAngle: number
  ) {
    const ladderPointsFirstLine = afirstLine.pointsOverLine(aintersectionPoint, aladderRadious);
    const ladderPointsSecondLine = asecondLine.pointsOverLine(aintersectionPoint, aladderRadious);

    const lineFromIntersecToPt1_0 = new A2D.Apg2DLine(aintersectionPoint, ladderPointsFirstLine[0]);
    const lineFromIntersecToPt1_1 = new A2D.Apg2DLine(aintersectionPoint, ladderPointsFirstLine[1]);
    const lineFromIntersecToPt2_0 = new A2D.Apg2DLine(aintersectionPoint, ladderPointsSecondLine[0]);
    const lineFromIntersecToPt2_1 = new A2D.Apg2DLine(aintersectionPoint, ladderPointsSecondLine[1]);

    let arrowPoint1, arrowPoint2: A2D.Apg2DPoint;

    let areLinesInverted = false;

    // Check which is the line that defines the Begin angle
    if (lineFromIntersecToPt1_0.angle === adimBeginAngle) {
      arrowPoint1 = ladderPointsFirstLine[0];
    } else if (lineFromIntersecToPt1_1.angle === adimBeginAngle) {
      arrowPoint1 = ladderPointsFirstLine[1];
    } else if (lineFromIntersecToPt2_0.angle === adimBeginAngle) {
      arrowPoint1 = ladderPointsSecondLine[0];
      areLinesInverted = true;
    } else {
      arrowPoint1 = ladderPointsSecondLine[1];
      areLinesInverted = true;
    }
    // Check which is the line that defines the End angle
    if (lineFromIntersecToPt1_0.angle === adimEndAngle) {
      arrowPoint2 = ladderPointsFirstLine[0];
      areLinesInverted = true;
    } else if (lineFromIntersecToPt1_1.angle === adimEndAngle) {
      arrowPoint2 = ladderPointsFirstLine[1];
      areLinesInverted = true;
    } else if (lineFromIntersecToPt2_0.angle === adimEndAngle) {
      arrowPoint2 = ladderPointsSecondLine[0];
    } else {
      arrowPoint2 = ladderPointsSecondLine[1];
    }
    return { arrowPoint1, arrowPoint2, areLinesInverted };
  }

  #getAngles(afirstLine: A2D.Apg2DLine, asecondLine: A2D.Apg2DLine, aquadrant: A2D.eApg2DQuadrant) {
    const angleAndQuadrants = afirstLine.intersectionAngles(asecondLine);

    let dimAngleValue = 0;
    let dimBeginAngle = 0;
    switch (aquadrant) {
      case A2D.eApg2DQuadrant.negXposY:
        dimAngleValue = angleAndQuadrants.complementary;
        dimBeginAngle = angleAndQuadrants.q2_3AngleStart;
        break;
      case A2D.eApg2DQuadrant.negXnegY:
        dimAngleValue = angleAndQuadrants.explementary;
        dimBeginAngle = angleAndQuadrants.q2_3AngleStart;
        break;
      case A2D.eApg2DQuadrant.posXnegY:
        dimAngleValue = angleAndQuadrants.complementary;
        dimBeginAngle = angleAndQuadrants.q4AngleStart;
        break;
      default: // eQuadrant.posXposY
        dimAngleValue = angleAndQuadrants.explementary;
        dimBeginAngle = angleAndQuadrants.q1AngleStart;
        break;
    }

    let dimEndAngle = dimBeginAngle + dimAngleValue;
    if (dimEndAngle === 360) { dimEndAngle = 0; }
    return { dimBeginAngle, dimEndAngle, dimAngleValue };
  }
}
