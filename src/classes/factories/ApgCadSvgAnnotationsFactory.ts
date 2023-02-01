/** -----------------------------------------------------------------------
 * @module [CAD-svg]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * @version 0.9.4 [APG 2023/01/04] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { A2D, Svg, Uts } from "../../../deps.ts";
import { eApgCadDftLayers } from "../../enums/eApgCadDftLayers.ts";
import { eApgCadDftDimArrowStyles } from "../../enums/eApgCadDftDimArrowStyles.ts";
import { eApgCadPrimitiveFactoryTypes } from "../../enums/eApgCadPrimitiveFactoryTypes.ts";
import { ApgCadSvg } from "../ApgCadSvg.ts";
import { ApgCadSvgUtils } from "../ApgCadSvgUtils.ts";
import { ApgCadSvgPrimitivesFactory } from "./ApgCadSvgPrimitivesFactory.ts";


/** Factory that creates Annotations With arrows and ladders
 */
export class ApgCadSvgAnnotationsFactory extends ApgCadSvgPrimitivesFactory {

  /** The local copy of the text style data */
  textStyle: Svg.IApgSvgTextStyle;

  /** Arrow block name  */
  arrowStyle: string = eApgCadDftDimArrowStyles.UNDEFINED;

  /** Additional class for the annotations */
  cssClass: string;

  /** Additional space around the annotation in characters */
  readonly ADDITIONAL_CHARACTERS_SPACE = 2;


  /** Creates a Cad Annotation Factory
   *
   * @param acad Cad document
   * @param atextStyle The font data used to draw the text
   * @param aarrowName Element symbol used for the arrow
   * @param acssClass Additional class added to the element (default = '')
   */
  constructor(
    acad: ApgCadSvg,
    atextStyle: Svg.IApgSvgTextStyle,
    aarrowName: string,
    acssClass = ''
  ) {
    super(acad, eApgCadPrimitiveFactoryTypes.ANNOTATIONS)

    this.textStyle = Uts.ApgUtsObj.DeepCopy(atextStyle) as Svg.IApgSvgTextStyle;
    this.arrowStyle = aarrowName;
    this.cssClass = acssClass;
    this.ready = true;
  }

  /** Builds a Cad Annotation with the ladder and arrow
   *
   * @param aparent The SvgNode that will be the parent of this annotation
   * @param aorigin Origin point of the arrow of the annotation
   * @param adisplacement Displacement of the beginning of the text from the origin of the annotation.
   * If it is (0,0) the annotation will be drawn without ladder and arrow
   * @param atext  Text of the annotation
   * @param aorientation Orientation of the text in degrees (default = 0)
   * @returns An svg group of the Annotation or undefined
   */
  build(
    aparent: Svg.ApgSvgNode,
    aorigin: A2D.Apg2DPoint,
    adisplacement: A2D.Apg2DPoint,
    atext: string,
    aorientation = 0
  ) {

    if (!this.ready) { return undefined; }

    const charAverageHeightWidthRatio = this.textStyle.aspectRatio || 0.5;

    const averageCharWidth = this.textStyle.size * charAverageHeightWidthRatio

    const annotationStartPosition = new A2D.Apg2DPoint(aorigin.x + adisplacement.x, aorigin.y + adisplacement.y);

    const lengthOfTheMultilineText = (Uts.ApgUtsStr.LinesMaxLength(atext) + this.ADDITIONAL_CHARACTERS_SPACE) * averageCharWidth;

    const annotationEndPosition = annotationStartPosition.displacedCopy(aorientation, lengthOfTheMultilineText);

    const anchor = this.textStyle.anchor || Svg.eApgSvgTextAnchor.start;
    let annotationTextPosition = annotationStartPosition;
    switch (anchor) {
      case Svg.eApgSvgTextAnchor.middle:
        annotationTextPosition = annotationStartPosition.halfwayFrom(annotationEndPosition);
        break;
      case Svg.eApgSvgTextAnchor.end:
        annotationTextPosition = annotationEndPosition;
        break;
    }

    const annotationLine = new A2D.Apg2DLine(annotationStartPosition, annotationEndPosition);

    const textFlip = ApgCadSvgUtils.GetTextFlip(annotationLine.angle);

    const textOrientation = ApgCadSvgUtils.GetTextOrientation(annotationLine.angle);

    const textLineSpacing = this.textStyle.size * ((this.textStyle.leading || 1.1) - 1);

    const textLineHeight = (this.textStyle.size + textLineSpacing);

    const numberOfLines = Uts.ApgUtsStr.LinesNum(atext);

    const textHeight = (textLineHeight * (numberOfLines - 1) * textFlip) + textLineSpacing;

    const textPosition = annotationLine.offsetPoint(annotationTextPosition, textHeight);

    // Start to create the svg element

    const g = this.cad.svg.group();
    g.childOf(aparent);

    if (this.cssClass && this.cssClass !== '') {
      g.class(this.cssClass);
    }


    const annotationText = atext;
    // Draw the svg Text
    const _text = this.cad.svg
      .text(textPosition.x, textPosition.y, annotationText, textLineHeight)
      .rotate(textOrientation)//, textPosition.x, textPosition.y)
      .textStyle(this.textStyle)
      .childOf(g);

    this.cad.svg
      .line(annotationStartPosition.x, annotationStartPosition.y, annotationEndPosition.x, annotationEndPosition.y)
      .childOf(g)

    // if the displacement allows to draw the ladder and the arrow
    const drawLadderAndArrow = (adisplacement.x === 0 && adisplacement.y === 0) ? false : true;

    if (drawLadderAndArrow) {
      const annotationLadderLine = new A2D.Apg2DLine(aorigin, annotationStartPosition);
      const arrowOrientation = annotationLadderLine.angle % 360;

      // Draw the arrow ladder
      this.cad.svg
        .line(aorigin.x, aorigin.y, annotationStartPosition.x, annotationStartPosition.y)
        .childOf(g);

      // Draw the underline
      this.cad.svg
        .line(annotationStartPosition.x, annotationStartPosition.y, annotationEndPosition.x, annotationEndPosition.y)
        .childOf(g);

      // Draw the arrow
      this.cad.svg
        .use(this.arrowStyle, aorigin.x, aorigin.y)
        .rotate(arrowOrientation, aorigin.x, aorigin.y)
        .childOf(g);

    }

    if (this.cad.settings.debug) {
      const currLayer = this.cad.currentLayer;
      const currGroup = this.cad.currentGroup;

      this.cad.setCurrentLayer(eApgCadDftLayers.DEBUG);
      const leyerDef = this.cad.layerDefs.get(eApgCadDftLayers.DEBUG);

      const debugText = '\n\n'
        + 'o1:' + aorientation.toFixed(2) + '° - o2:' + annotationLine.angle.toFixed(2) + '°\n'
        + 'p1:' + aorigin.x.toFixed(2) + ',' + aorigin.y.toFixed(2) + '\n'
        + 'p2:' + annotationStartPosition.x.toFixed(2) + ',' + annotationStartPosition.y.toFixed(2) + '\n'
        + 'p3:' + annotationEndPosition.x.toFixed(2) + ',' + annotationEndPosition.y.toFixed(2) + '\n'
        + 'tp:' + textPosition.x.toFixed(2) + ',' + textPosition.y.toFixed(2) + '\n'
        + 'tw:' + lengthOfTheMultilineText.toFixed(2) + ' - th:' + textHeight.toFixed(2);

      const textStyle = leyerDef!.textStyle;
      const textLineHeight = (textStyle.size * (textStyle.leading || 1.1));
      
      // Draw the debug info
      const _debugText = this.cad.svg
        .text(annotationStartPosition.x, annotationStartPosition.y, debugText, textLineHeight)
        //.rotate(textOrientation)//, textPosition.x, textPosition.y)
        .textStyle(textStyle)
        .childOf(this.cad.currentLayer);

      // Draw text position
      this.cad.svg
        .circle(textPosition.x, textPosition.y, 5)
        .childOf(this.cad.currentLayer)

      this.cad.currentGroup = currGroup;
      this.cad.currentLayer = currLayer;
    }

    return g;
  }

}

