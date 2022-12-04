/* -----------------------------------------------------------------------
 * Apg Svg Angular dimensions Factory
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/30]
 * @version 0.5.0 [APG 2018/11/25]
 * -----------------------------------------------------------------------
 */
import { Apg2DLine, Apg2DPoint, eApg2DQuadrant } from '../../2D';
import { ApgSvgU } from '../classes/ApgSvgU';
import { ApgSvgPrimitiveFactory } from './ApgSvgPrimitiveFactory';
import { ApgSvgCadBaseFactory } from './ApgSvgBaseFactory';


/** Factory that creates Cad Linear dimensions with arrows and ladders
 */
export class ApgSvgAngularDimensionFactory extends ApgSvgCadBaseFactory {

  /** The font data */
  font: svgjs.FontData;
  /** Character Height */
  charHeight: number;
  /** Arrow symbol */
  arrow: svgjs.Element;

  /** Line and interline height Ratio
   * @todo_9 Maybe is better to get this value from the leading of the fontdata
   */
  readonly K_H_LINE_RATIO = 3 / 2;

  /** Minimum difference in the slope of the lines */
  readonly K_MIN_SLOPE_DIFF = 0.001;

  /** Creates a Cad Angular Dimension Factory
   * @param {svgjs.G} alayer Layer to draw on
   * @param {FontData} afont The font data used to draw the text
   * @param {number} acharHeight Character height
   * @param {svgjs.Element} aarrow Element symbol used for the arrow
   * @param {string=} acss Additional class added to the element (default = '')
   *
   * @version 0.0.1 [APG 2017/10/31]
   * @author [APG] ANGELI Paolo Giusto
   */
  constructor(
    alayer: svgjs.G,
    afont: svgjs.FontData,
    acharHeight: number,
    aarrow: svgjs.Element,
    acss: string = ''
  ) {
    // debugger // [APG 2017/11/05]

    // Ancestor class
    super(alayer, acss);

    this.font = afont;
    this.charHeight = acharHeight;
    this.arrow = aarrow;

    this._inited = true;
  }

  /** Builds a Cad Angular Dimension with the ladders
   * @param {Apg2DLine} al1 First line
   * @param {Apg2DLine} al2 second line
   * @param {number} all (L)adder (L)enght.The value positive or negative determines the text position
   * @param {eApg2DQuadrant} aq Quadrant where we want to display the dimension (default = posXposY)
   * @param {string=} atextBef Additional text of the annotation Before the value (default = '')
   * @param {string=} atextAft Additional text of the annotation After the value (default = '')
   * @ritorna {svgjs.G | undefined} An svg group of the Dimension or undefined
   *
   * @version 0.0.1 [APG 2017/11/05]
   * @author [APG] ANGELI Paolo Giusto
   */
  build(
    al1: Apg2DLine,
    al2: Apg2DLine,
    alg: number,
    aq: eApg2DQuadrant = eApg2DQuadrant.posXposY,
    atextBef: string = '',
    atextAft: string = ''
  ): svgjs.G | undefined {
    // debugger // [APG 2017/11/05]


    // Preliminary checks


    // Factory non initialized
    if (!this._inited) {
      this._error = 'Tried to build a dimension defore initializing the factory';
      return undefined;
    }

    // If the straight lines are 'almost' parallel exits
    if (Math.abs(al1.m - al2.m) < this.K_MIN_SLOPE_DIFF) {
      this._error = 'The two segments are parallel';
      return undefined;
    }

    // 1st step: Perform initial calculations

    /** Angles and quadrants */
    const aaq = al1.anglesAndQuadrants(al2);

    // Imposta valori in base al quadrante indicato
    let lva = 0; // (V)alore (A)ngolo della quota
    let lai = 0; // (A)ngolo (I)nizio della quota
    switch (aq) {
      case eApg2DQuadrant.negXposY:
        lva = aaq.a2_4;
        lai = aaq.ia2_3;
        break;
      case eApg2DQuadrant.negXnegY:
        lva = aaq.a3;
        lai = aaq.ia2_3;
        break;
      case eApg2DQuadrant.posXnegY:
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
    /** punto intersezione delle due rette */
    const pi = <Apg2DPoint>al1.intersection(al2);

    // Calcola tutti e quattro i (P)otenziali (P)unti (F)recce alla distanza impostata alg dall'intersezione
    const ppf1 = al1.pointsOverLine(pi, alg);
    const ppf2 = al2.pointsOverLine(pi, alg);

    // Calcola le 4 (R)ette orientate passanti per l'(I)ntersezione ed i potenziali (P)unti (F)reccia
    const ri11 = new Apg2DLine(pi, ppf1.p1);
    const ri12 = new Apg2DLine(pi, ppf1.p2);
    const ri21 = new Apg2DLine(pi, ppf2.p1);
    const ri22 = new Apg2DLine(pi, ppf2.p2);

    /** Punti freccia */
    let lpf1: Apg2DPoint, lpf2: Apg2DPoint;
    /** flag Rette invertite */
    let lri = false;

    // Verifica quale è la retta che passa per l'angolo di inizio
    if (ri11.d === lai) {
      lpf1 = ppf1.p1;
    } else if (ri12.d === lai) {
      lpf1 = ppf1.p2;
    } else if (ri21.d === lai) {
      lpf1 = ppf2.p1;
      lri = true;
    } else {
      lpf1 = ppf2.p2;
      lri = true;
    }
    // Verifica quale è la retta che passa per l'angolo di fine
    if (ri11.d === laf) {
      lpf2 = ppf1.p1;
      lri = true;
    } else if (ri12.d === laf) {
      lpf2 = ppf1.p2;
      lri = true;
    } else if (ri21.d === laf) {
      lpf2 = ppf2.p1;
    } else {
      lpf2 = ppf2.p2;
    }

    /** Calcola (P)unto (B)isettrice */
    const pb: Apg2DPoint = lpf1.halfway(lpf2);

    /** (R)etta (B)isettrice passante tra intersezione e punto bisettrice */
    const rb: Apg2DLine = new Apg2DLine(pi, pb);

    /** Calcola (P)punto (T)esto su bisettrice alla distanza alg + aht */
    const pt = rb.pointAtTheDistanceFromPoint(pi, alg + this.charHeight);

    /** (R)etta inclinazione (T)esto in base a bisettrice */
    const rt: Apg2DLine = rb.perpendicular(pt.p);

    /** (R)etta (T)angente alla (Q)uota e passante per un (P)unto (F)reccia */
    let lrtqpf: Apg2DLine;
    if (al1.belongs(lpf1)) {
      lrtqpf = al1.perpendicular(lpf1);
    } else {
      lrtqpf = al2.perpendicular(lpf1);
    }

    /** (P)punto di (I)ntersezione (T)angente freccia con (B)isettrice */
    const pitb = <Apg2DPoint>rb.intersection(lrtqpf);

    const atl1 = new Apg2DLine(pitb, lpf1);
    const atl2 = new Apg2DLine(pitb, lpf2);

    // Calcola inclinazione frecce
    const if1: number = ApgSvgU.getArrowOrientation(atl1.d);
    const if2: number = ApgSvgU.getArrowOrientation(atl2.d);

    /** inclinazioni testo */
    const it = ApgSvgU.getTextOrientation(rt.d);

    /** (D)ebug (T)ext */
    let ldbgTxt = '';
    if (ApgSvgU.DEBUG_MODE) {
      ldbgTxt += '\n'
        + 'q:' + aq + ' - o2:' + it.toFixed(0).toString() + '°\n'
        + 'd1:' + al1.d.toFixed(0).toString() + ', d2:' + al2.d.toFixed(0).toString() + '\n'
        + 'l1p1:' + al1.p1.x.toFixed(0).toString() + ',' + al1.p1.y.toFixed(0).toString() + '\n'
        + 'l1p2:' + al1.p2.x.toFixed(0).toString() + ',' + al1.p2.y.toFixed(0).toString() + '\n'
        + 'l2p1:' + al2.p1.x.toFixed(0).toString() + ',' + al2.p1.y.toFixed(0).toString() + '\n'
        + 'l2p2:' + al2.p2.x.toFixed(0).toString() + ',' + al2.p2.y.toFixed(0).toString() + '\n'

        + '';
    }

    // Disegna gli elementi SVG
    // (T)ext of the (A)nnotation
    // prepara stringa del testo da stampare
    const tex = atextBef + ' ' + lva.toFixed(1).toString() + '°' + atextAft + ldbgTxt;

    // Start to create the svg element
    const r: svgjs.G = this.layer.group();

    // If specified adds the CSS class
    if (this.cssClass !== '') {
      r.addClass(this.cssClass);
    }

    // aggiunge simboli freccia
    r.use(this.arrow)
      .move(lpf1.x, ApgSvgU.y(lpf1.y))
      .rotate(if1, lpf1.x, ApgSvgU.y(lpf1.y));
    r.use(this.arrow)
      .move(lpf2.x, ApgSvgU.y(lpf2.y))
      .rotate(if2, lpf2.x, ApgSvgU.y(lpf2.y));


    // Draw the svg Text
    r.text(tex)
      .move(pt.p.x, ApgSvgU.y(pt.p.y))
      .rotate(it, pt.p.x, ApgSvgU.y(pt.p.y))
      .stroke('none')
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
    if (ApgSvgU.DEBUG_MODE) {

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
