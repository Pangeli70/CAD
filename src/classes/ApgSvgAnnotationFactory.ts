/* -----------------------------------------------------------------------
 * Apg Svg Annotations Factory
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/30]
 * @version 0.5.0 [APG 2018/11/25]
 * -----------------------------------------------------------------------
 */
import * as svgjs from 'svg.js';

import { Apg2DLine, Apg2DPoint } from '../../2D';
import { ApgSvgU } from '../classes/ApgSvgU';
import { IApgSvgFont } from '../interfaces';
import { ApgU } from '../../_/classes/Apg_U';


/** Factory that creates Annotations With arrows and ladders
 */
export class ApgSvgAnnotationFactory {

  /** The object is initialized */
  private __inited = false;

  /** Layer of the Factory */
  layer: svgjs.G;
  /** The local copy of the font data */
  localFont: IApgSvgFont;
  /** Arrow symbol */
  arrow?: svgjs.Element;
  /** Additional class for the annotations */
  cssClass?: string;

  /** Additional space around the annotation in characters */
  readonly K_ADDITIONAL_SPACE = 2;


  /** Default Char Height
   * @todo_9 Maybe is better to contiunously adapt the char height accordingly to the canvas size
  */
  readonly DEFAULT_CHAR_HEIGHT_RATIO = 1;


  /** Creates a Cad Annotation Factory
   *
   * @param {svgjs.G} alayer Layer to draw on
   * @param {FontData} afont The font data used to draw the text
   * @param {number} acharHeight Character height
   * @param {svgjs.Element} aarrow Element symbol used for the arrow
   * @param {string=} acss Additional class added to the element (default = '')
   */
  constructor(
    alayer: svgjs.G,
    afont: IApgSvgFont,
    acharHeight: number,
    aarrow?: svgjs.Element,
    acss: string = ''
  ) {
    this.layer = alayer;
    this.localFont = <IApgSvgFont>ApgU.deepCopy(afont);
    this.localFont.font.anchor = 'middle';
    this.localFont.font.size = acharHeight;
    this.arrow = aarrow;
    this.cssClass = acss;
    this.__inited = true;
  }

  /** Builds a Cad Annotation with the ladder
   *
   * @param {Apg2DPoint} aorigin Origin point of the arrow of the annotation
   * @param {Apg2DPoint} adisplacement Displacement of the beginning of the text from the origin of the annotation.
   * If (0,0) the annotation will be drawn without ladder and arrow
   * @param {string} atext  Text of the annotation
   * @param {number=} aorientation Orientation of the text in degrees (default = 0)
   * @ritorna {svgjs.G | undefined} An svg group of the Annotation or undefined
   */
  build(
    aorigin: Apg2DPoint,
    adisplacement: Apg2DPoint,
    atext: string,
    aorientation: number = 0
  ): svgjs.G | undefined {


    // Factory non initialized
    if (!this.__inited) { return undefined; }

    /** (A)verage (C)haracter (W)idth */
    const avCharW = <number>this.localFont.font.size! * this.localFont.HWRatio;

    /** (L)enght of the multirow (T)ext */
    const lt = (ApgSvgU.MaxRowLenght(atext) + this.K_ADDITIONAL_SPACE) * avCharW;

    /** Draw ladder and arrow flag */
    const dla = (adisplacement.x === 0 && adisplacement.y === 0) ? false : true;

    /** (P)oint of the  B)eginning of the (U)nderline */
    const pbu: Apg2DPoint = new Apg2DPoint();
    pbu.x = aorigin.x + adisplacement.x;
    pbu.y = aorigin.y + adisplacement.y;

    /** (A)nnotation (A)rrow (L)ine */
    const aal: Apg2DLine | undefined = (dla) ? new Apg2DLine(aorigin, pbu) : undefined;

    /** (P)oint of the (E)nd of the (U)nderline */
    const peu: Apg2DPoint = pbu.displacedCopy(aorientation, lt);

    /** (A)nnotation (U)nderline (L)ine */
    const alu = new Apg2DLine(pbu, peu);

    /** (U)nderline (L)ine (M)edium (P)oint */
    const ulmp = pbu.halfway(peu);

    /** (T)ext (D)irection */
    const td = ApgSvgU.getTextDirection(alu.d);

    /** (T)ext (O)rientation */
    const to = ApgSvgU.getTextOrientation(alu.d);

    /** (A)rrow (O)rientation */
    const ao = (aal) ? ApgSvgU.getArrowOrientation(aal.d) : 0;

    /** (T)ext (H)eight (K)*/
    const thk = (this.localFont.font.leading) ? <number>this.localFont.font.leading : 1;

    /** (T)ext (H)eight*/
    const th = thk * <number>this.localFont.font.size! * td;

    // (T)ext (P)osition
    const tp = alu.offsetPoint(ulmp, th);

    /** (D)ebug (T)ext */
    let ldbgTxt = '';
    if (ApgSvgU.DEBUG_MODE) {
      ldbgTxt += '\n'
        + 'o1:' + aorientation + ' - o2:' + alu.d.toFixed(0).toString() + '°\n'
        + 'p1:' + aorigin.x.toFixed(0).toString() + ',' + aorigin.y.toFixed(0).toString() + '\n'
        + 'p2:' + pbu.x.toFixed(0).toString() + ',' + pbu.y.toFixed(0).toString() + '\n'
        + 'p3:' + peu.x.toFixed(0).toString() + ',' + peu.y.toFixed(0).toString() + '\n'
        + 'tp:' + tp.x.toFixed(0).toString() + ',' + tp.y.toFixed(0).toString() + '\n'
        + 'tw:' + lt.toFixed(0).toString() + ' - th:' + th.toFixed(0).toString();
    }

    // (T)ext of the (A)nnotation
    const ta = atext + ldbgTxt;

    // Start to create the svg element
    const r: svgjs.G = this.layer.group();

    // If specified adds the CSS class
    if (this.cssClass && this.cssClass !== '') {
      r.addClass(this.cssClass);
    }

    // Draw the svg Text
    r.text(ta)
      .move(tp.x, ApgSvgU.y(tp.y))
      .rotate(to, tp.x, ApgSvgU.y(tp.y))
      .stroke('none')
      .font(this.localFont.font);

    r.line(pbu.x, ApgSvgU.y(pbu.y), peu.x, ApgSvgU.y(peu.y));

    // if the displacement allows to draw the ladder and the arrow
    if (aal) {
      // Draw the arrow ladder
      r.line(aorigin.x, ApgSvgU.y(aorigin.y), pbu.x, ApgSvgU.y(pbu.y));

      // Draw the underline
      r.line(pbu.x, ApgSvgU.y(pbu.y), peu.x, ApgSvgU.y(peu.y));

      // Draw the arrow
      if (this.arrow) {
        r.use(this.arrow)
          .move(aorigin.x, ApgSvgU.y(aorigin.y))
          .rotate(ao, aorigin.x, ApgSvgU.y(aorigin.y));
      }
    }

    return r;
  }

}

