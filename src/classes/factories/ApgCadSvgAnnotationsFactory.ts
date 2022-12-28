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
import { A2D, Svg, Uts } from "../../../deps.ts";

import {
  ApgCadSvgPrimitivesFactory
} from "../../../mod.ts";

import { ApgCadSvgUtils } from "../ApgCadSvgUtils.ts";


/** Factory that creates Annotations With arrows and ladders
 */
export class ApgCadSvgAnnotationsFactory extends ApgCadSvgPrimitivesFactory {

  /** The local copy of the text style data */
  textStyle: Svg.IApgSvgTextStyle;

  /** Arrow block name  */
  arrowName: string;
  /** Additional class for the annotations */
  cssClass: string;

  /** Additional space around the annotation in characters */
  readonly K_ADDITIONAL_SPACE = 2;


  /** Creates a Cad Annotation Factory
   *
   * @param adoc Cad document
   * @param alayer Layer to draw on
   * @param atextStyle The font data used to draw the text
   * @param aarrowName Element symbol used for the arrow
   * @param acssClass Additional class added to the element (default = '')
   */
  constructor(
    adoc: Svg.ApgSvgDoc,
    alayer: Svg.ApgSvgNode,
    atextStyle: Svg.IApgSvgTextStyle,
    aarrowName: string,
    acssClass = ''
  ) {
    super(adoc, alayer)
    this.textStyle = Uts.ApgUtsObj.DeepCopy(atextStyle) as Svg.IApgSvgTextStyle;
    this.arrowName = aarrowName;
    this.cssClass = acssClass;
    this._ready = true;
  }

  /** Builds a Cad Annotation with the ladder
   *
   * @param aorigin Origin point of the arrow of the annotation
   * @param adisplacement Displacement of the beginning of the text from the origin of the annotation.
   * If it is (0,0) the annotation will be drawn without ladder and arrow
   * @param atext  Text of the annotation
   * @param aorientation Orientation of the text in degrees (default = 0)
   * @returns An svg group of the Annotation or undefined
   */
  build(
    aorigin: A2D.Apg2DPoint,
    adisplacement: A2D.Apg2DPoint,
    atext: string,
    aorientation = 0
  ) {

    // Factory non initialized
    if (!this._ready) { return undefined; }

    const averageCharWidth = this.textStyle.size! * this.textStyle.HWRatio;

    const annotationStartPosition = new A2D.Apg2DPoint(aorigin.x + adisplacement.x, aorigin.y + adisplacement.y);

    const lengthOfTheMultilineText = (Uts.ApgUtsStr.LinesMaxLength(atext) + this.K_ADDITIONAL_SPACE) * averageCharWidth;

    const annotationEndPosition = annotationStartPosition.displacedCopy(aorientation, lengthOfTheMultilineText);

    const annotationTextPosition = annotationStartPosition.halfwayFrom(annotationEndPosition);

    const annotationLine = new A2D.Apg2DLine(annotationStartPosition, annotationEndPosition);

    const textDirection = ApgCadSvgUtils.getTextDirection(annotationLine.angle);

    const textOrientation = ApgCadSvgUtils.getTextOrientation(annotationLine.angle);

    const textLineSpacing = (this.textStyle.leading == undefined) ? <number>this.textStyle.leading! : 0;

    const numberOfLines = Uts.ApgUtsStr.LinesNum(atext);

    const textLineHeight = (this.textStyle.size! + textLineSpacing);

    const textHeight = textLineHeight * numberOfLines * textDirection;

    const textPosition = annotationLine.offsetPoint(annotationTextPosition, textHeight);

    // Start to create the svg element
    const g = this._svgDoc.group()
    g.childOf(this._layer);

    if (this.cssClass && this.cssClass !== '') {
      g.class(this.cssClass);
    }

    let debugText = '';
    if (ApgCadSvgUtils.DEBUG_MODE) {
      debugText += '\n'
        + 'o1:' + aorientation + ' - o2:' + annotationLine.angle.toFixed(2) + '°\n'
        + 'p1:' + aorigin.x.toFixed(2) + ',' + aorigin.y.toFixed(2) + '\n'
        + 'p2:' + annotationStartPosition.x.toFixed(2) + ',' + annotationStartPosition.y.toFixed(2) + '\n'
        + 'p3:' + annotationEndPosition.x.toFixed(2) + ',' + annotationEndPosition.y.toFixed(2) + '\n'
        + 'tp:' + textPosition.x.toFixed(2) + ',' + textPosition.y.toFixed(2) + '\n'
        + 'tw:' + lengthOfTheMultilineText.toFixed(2) + ' - th:' + textHeight.toFixed(2);
    }

    const annotationText = atext + debugText;
    // Draw the svg Text
    const _text = this._svgDoc.text(textPosition.x, textPosition.y, annotationText)
      .rotate(textOrientation, textPosition.x, textPosition.y)
      .textStyle(this.textStyle)
      .childOf(g);

    this._svgDoc
      .line(annotationStartPosition.x, annotationStartPosition.y, annotationEndPosition.x, annotationEndPosition.y)
      .childOf(g)

    // if the displacement allows to draw the ladder and the arrow
    const drawLadderAndArrow = (adisplacement.x === 0 && adisplacement.y === 0) ? false : true;

    if (drawLadderAndArrow) {
      const annotationLadderLine = new A2D.Apg2DLine(aorigin, annotationStartPosition);
      const arrowOrientation = ApgCadSvgUtils.getArrowOrientation(annotationLadderLine.angle);

      // Draw the arrow ladder
      this._svgDoc
        .line(aorigin.x, aorigin.y, annotationStartPosition.x, annotationStartPosition.y)
        .childOf(g);

      // Draw the underline
      this._svgDoc
        .line(annotationStartPosition.x, annotationStartPosition.y, annotationEndPosition.x, annotationEndPosition.y)
        .childOf(g);

      // Draw the arrow
      this._svgDoc
        .use(aorigin.x, aorigin.y, this.arrowName)
        .rotate(arrowOrientation, aorigin.x, aorigin.y)
        .childOf(g);

    }

    return g;
  }

}

