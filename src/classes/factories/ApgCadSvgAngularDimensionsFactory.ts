/** -----------------------------------------------------------------------
 * @module [CAD-Svg]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/30]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * -----------------------------------------------------------------------
 */
import { A2D, Svg, Uts } from "../../../deps.ts";
import {
  ApgCadSvgUtils,
  eApgCadDftDimArrowStyles,
  IApgCadSvgTextStyle
} from "../../../mod.ts";
import { ApgCadSvgPrimitivesFactory } from './ApgCadSvgPrimitivesFactory.ts';


/** Factory that creates Cad Linear dimensions with arrows and ladders
 */
export class ApgCadSvgAngularDimensionsFactory extends ApgCadSvgPrimitivesFactory {

  /** The local copy of the text style data */
  textStyle: IApgCadSvgTextStyle;

  /** Arrow Block name*/
  arrowName = eApgCadDftDimArrowStyles.UNDEFINED;

  /** Additional class for the dimension */
  cssClass: string;

  /** Line and interline height Ratio
   * @todo_9 Maybe is better to get this value from the leading of the fontdata
   */
  readonly K_H_LINE_RATIO = 3 / 2;

  /** Minimum difference in the slope of the lines */
  readonly K_MIN_SLOPE_DIFF = 0.001;

  /** Creates a Cad Angular Dimension Factory
   * @param adoc Cad document
   * @param alayer Layer to draw on
   * @param atextStyle The font data used to draw the text
   * @param aarrowName Element symbol used for the arrow
   * @param acssClass Additional class added to the element (default = '')
   */
  constructor(
    adoc: Svg.ApgSvgDoc,
    alayer: Svg.ApgSvgNode,
    atextStyle: IApgCadSvgTextStyle,
    aarrowName: eApgCadDftDimArrowStyles,
    acssClass: string = ''
  ) {
    super(adoc, alayer);
    this.textStyle = <IApgCadSvgTextStyle>Uts.ApgUtsObj.DeepCopy(atextStyle);
    this.arrowName = aarrowName;
    this.cssClass = acssClass;
    this._ready = true;
  }

  /** Builds a Cad Angular Dimension with the ladders
   * @param  al1 First line
   * @param  al2 second line
   * @param  alg (L)adder (L)enght.The value positive or negative determines the text position
   * @param  aq Quadrant where we want to display the dimension (default = posXposY)
   * @param atextBef Additional text of the annotation Before the value (default = '')
   * @param  atextAft Additional text of the annotation After the value (default = '')
   * @returns An svg group of the Dimension or undefined
   */
  build(
    al1: A2D.Apg2DLine,
    al2: A2D.Apg2DLine,
    alg: number,
    aq: A2D.eApg2DQuadrant = A2D.eApg2DQuadrant.posXposY,
    atextBef: string = '',
    atextAft: string = ''
  ) {

    // Preliminary checks

    // Factory non initialized
    if (!this._ready) {
      this._error = 'Tried to build a dimension defore initializing the factory';
      return undefined;
    }

    // If the straight lines are 'almost' parallel exits
    if (Math.abs(al1.slope - al2.slope) < this.K_MIN_SLOPE_DIFF) {
      this._error = 'The two segments are parallel';
      return undefined;
    }

    // 1st step: Perform initial calculations

    /** Angles and quadrants */
    const aaq = al1.intersectionAngles(al2);

    // Imposta valori in base al quadrante indicato
    let lva = 0; // (V)alore (A)ngolo della quota
    let lai = 0; // (A)ngolo (I)nizio della quota
    switch (aq) {
      case A2D.eApg2DQuadrant.negXposY:
        lva = aaq.a2_4;
        lai = aaq.q2_3AngleStart;
        break;
      case A2D.eApg2DQuadrant.negXnegY:
        lva = aaq.a3;
        lai = aaq.q2_3AngleStart;
        break;
      case A2D.eApg2DQuadrant.posXnegY:
        lva = aaq.a2_4;
        lai = aaq.ia4;
        break;
      default: // eQuadrant.posXposY
        lva = aaq.a1;
        lai = aaq.ia1;
        break;
    }
    /** (A)ngolo (F)ine della quota */
    let laf = lai + lva;
    if (laf === 360) { laf = 0; }

    const pi = <A2D.Apg2DPoint>al1.intersection(al2);

    // Calcola tutti e quattro i (P)otenziali (P)unti (F)recce alla distanza impostata alg dall'intersezione
    const ppf1 = al1.pointsOverLine(pi, alg);
    const ppf2 = al2.pointsOverLine(pi, alg);

    // Calcola le 4 (R)ette orientate passanti per l'(I)ntersezione ed i potenziali (P)unti (F)reccia
    const ri11 = new A2D.Apg2DLine(pi, ppf1[0]);
    const ri12 = new A2D.Apg2DLine(pi, ppf1[1]);
    const ri21 = new A2D.Apg2DLine(pi, ppf2[0]);
    const ri22 = new A2D.Apg2DLine(pi, ppf2[1]);

    /** Punti freccia */
    let lpf1, lpf2: A2D.Apg2DPoint;
    /** flag Rette invertite */
    let lri = false;

    // Verifica quale è la retta che passa per l'angolo di inizio
    if (ri11.angle === lai) {
      lpf1 = ppf1[0];
    } else if (ri12.angle === lai) {
      lpf1 = ppf1[1];
    } else if (ri21.angle === lai) {
      lpf1 = ppf2[0];
      lri = true;
    } else {
      lpf1 = ppf2[1];
      lri = true;
    }
    // Verifica quale è la retta che passa per l'angolo di fine
    if (ri11.angle === laf) {
      lpf2 = ppf1[0];
      lri = true;
    } else if (ri12.angle === laf) {
      lpf2 = ppf1[1];
      lri = true;
    } else if (ri21.angle === laf) {
      lpf2 = ppf2[0];
    } else {
      lpf2 = ppf2[1];
    }

    /** Calcola (P)unto (B)isettrice */
    const pb = lpf1.halfwayFrom(lpf2);

    /** (R)etta (B)isettrice passante tra intersezione e punto bisettrice */
    const rb = new A2D.Apg2DLine(pi, pb);

    /** Calcola (P)punto (T)esto su bisettrice alla distanza alg + aht */
    const pt = rb.pointAtDistanceFromPoint(pi, alg + this.charHeight);

    /** (R)etta inclinazione (T)esto in base a bisettrice */
    const rt = rb.perpendicular(pt!);

    /** (R)etta (T)angente alla (Q)uota e passante per un (P)unto (F)reccia */
    let lrtqpf: A2D.Apg2DLine;
    if (al1.belongs(lpf1)) {
      lrtqpf = al1.perpendicular(lpf1);
    } else {
      lrtqpf = al2.perpendicular(lpf1);
    }

    /** (P)punto di (I)ntersezione (T)angente freccia con (B)isettrice */
    const pitb = rb.intersection(lrtqpf);

    const atl1 = new A2D.Apg2DLine(pitb!, lpf1);
    const atl2 = new A2D.Apg2DLine(pitb!, lpf2);

    // Calcola inclinazione frecce
    const if1: number = ApgCadSvgUtils.getArrowOrientation(atl1.angle);
    const if2: number = ApgCadSvgUtils.getArrowOrientation(atl2.angle);

    /** inclinazioni testo */
    const it = ApgCadSvgUtils.getTextOrientation(rt.angle);

    /** (D)ebug (T)ext */
    let ldbgTxt = '';
    if (ApgCadSvgUtils.DEBUG_MODE) {
      ldbgTxt += '\n'
        + 'q:' + aq + ' - o2:' + it.toFixed(2) + '°\n'
        + 'd1:' + al1.angle.toFixed(2) + ', d2:' + al2.angle.toFixed(2) + '\n'
        + 'l1p1:' + al1.p1.x. + ',' + al1.p1.y.toFixed(2) + '\n'
        + 'l1p2:' + al1.p2.x.toFixed(0).toStritoFixed(2)ng() + ',' + al1.p2.y.toFixed(2) + '\n'
          + 'l2p1:' + al2.p1.x.toFixed(2) + ',' + al2.p1.y.toFixed(2) + '\n'
          + 'l2p2:' + al2.p2.x.toFixed(2) + ',' + al2.p2.y.toFixed(2) + '\n'

          + '';
    }

    // Disegna gli elementi SVG
    // (T)ext of the (A)nnotation
    // prepara stringa del testo da stampare
    const tex = atextBef + ' ' + lva.toFixed(1) + '°' + atextAft + ldbgTxt;

    // Start to create the svg element
    const r = this.svgDoc.group();

    // If specified adds the CSS class
    if (this.cssClass !== '') {
      r.class(this.cssClass);
    }

    // aggiunge simboli freccia
    this.svgDoc.use(lpf1.x, lpf1.y, this.arrowName)
      .rotate(if1, lpf1.x, lpf1.y)
      .childOf(r);

    this.svgDoc.use(lpf2.x, lpf2.y, this.arrowName)
      .rotate(if2, lpf2.x, lpf2.y)
      .childOf(r);


    // Draw the svg Text
    this.svgDoc
      .text(pt!.x, pt!.y, tex)
      .rotate(it, pt!.x, pt!.y)
      .stroke('none', 0)
      .font(this.font)
      .font({
        size: this.charHeight
      });

    // Disegna le gambe di prolungamento se non sono dentro i segmenti
    let lpg: Apg2DPoint; // punto gamba
    if (lri === false) {
      if (!al1.inTheSegment(lpf1)) {
        lpg = pi.nearest([al1.p1, al1.p2]);
        r.line(lpf1.x, ApgSvgU.y(lpf1.y), lpg.x, ApgSvgU.y(lpg.y));
      }
    } else {
      if (!al2.inTheSegment(lpf1)) {
        lpg = pi.nearest([al2.p1, al2.p2]);
        r.line(lpf1.x, ApgSvgU.y(lpf1.y), lpg.x, ApgSvgU.y(lpg.y));
      }
    }

    if (lri === false) {
      if (!al2.inTheSegment(lpf2)) {
        lpg = pi.nearest([al2.p1, al2.p2]);
        r.line(lpf2.x, ApgSvgU.y(lpf2.y), lpg.x, ApgSvgU.y(lpg.y));
      }
    } else {
      if (!al1.inTheSegment(lpf2)) {
        lpg = pi.nearest([al1.p1, al1.p2]);
        r.line(lpf2.x, ApgSvgU.y(lpf2.y), lpg.x, ApgSvgU.y(lpg.y));
      }
    }

    // Disegna arco della quota interna
    if (aq === eApg2DQuadrant.posXposY) {
      r.path(
        'M ' + lpf1.x.toString() + ' ' + ApgSvgU.y(lpf1.y).toString() +
        ' A ' + alg.toString() + ' ' + alg.toString() + ' 0 0 0 ' + lpf2.x.toString() + ' ' + ApgSvgU.y(lpf2.y).toString()
      )
        .fill('none');
      // Disegna arco della prima quota complementare
    } else if (aq === eApg2DQuadrant.negXposY) {
      r.path(
        'M ' + lpf1.x.toString() + ' ' + ApgSvgU.y(lpf1.y).toString() +
        ' A ' + alg.toString() + ' ' + alg.toString() + ' 0 0 0 ' + lpf2.x.toString() + ' ' + ApgSvgU.y(lpf2.y).toString()
      )
        .fill('none');
      // Disegna arco della seconda quota complementare
    } else if (aq === eApg2DQuadrant.negXnegY) {
      r.path(
        'M ' + lpf1.x.toString() + ' ' + ApgSvgU.y(lpf1.y).toString() +
        ' A ' + alg.toString() + ' ' + alg.toString() + ' 0 0 0 ' + lpf2.x.toString() + ' ' + ApgSvgU.y(lpf2.y).toString()
      )
        .fill('none');
    } else {
      // Disegna arco della quota esplementare
      r.path(
        'M ' + lpf1.x.toString() + ' ' + ApgSvgU.y(lpf1.y).toString()
        + ' A ' + alg.toString() + ' ' + alg.toString() + ' 0 1 0 ' + lpf2.x.toString() + ' ' + ApgSvgU.y(lpf2.y).toString()
      )
        .fill('none');
    }

    // Disegna elementi di debug
    if (ApgCadSvgUtils.DEBUG_MODE) {

      const pf = new ApgSvgPrimitiveFactory(r);

      // First and last point first line
      pf.buildCircle(al1.p1, 20);
      pf.buildCircle(al1.p2, 20);
      // First line
      pf.buildLine(al1.p1, al1.p2);

      // First and last point second line
      pf.buildCircle(al2.p1, 20);
      pf.buildCircle(al2.p2, 20);
      // Second line
      pf.buildLine(al2.p1, al2.p2);

      // Intersection
      pf.buildCircle(pi, 20);

      // Bisector line
      pf.buildLine(pi, pb);

      // Text origin
      pf.buildCircle(pt.p, 20);

      // Line between arrowpoints
      pf.buildLine(lpf1, lpf2);

    }

    return r;


  }

}
