/** -----------------------------------------------------------------------
 * @module [SVG-CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.7.0 [APG 2019/08/15]
 * @version 0.7.1 [APG 2019/08/27]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/05] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { Apg2DPoint } from '../2D';
import {
  ApgAjv,
  ApgEventLogger,
  ApgJsonFile,
  ApgLoggable,
  ApgResult,
  eApgInternalErrors,
  IApgJsonFileResult,
  IApgResult,
  ApgErrorResult,
} from '../_';
import { ApgU } from '../_/classes/Apg_U';
import { eraApp } from '../Era';
import { ApgEraSchemasData } from '../Era/Schemas/ApgEraSchemasData';
import { ApgSvg } from './ApgSvg';
import { eApgSvgErrorCodes, eApgSvgInstructionTypes } from './enums';
import {
  IApgSvgAxis,
  IApgSvgBackground,
  IApgSvgFont,
  IApgSvgInstruction,
  IApgSvgViewBox,
} from './interfaces';
import {
  ApgSvgAnnotationFactory,
  ApgSvgCadLinearDimensionFactory,
  ApgSvgPrimitiveFactory,
  eApgSvgLinearDimensionTypes,
} from './svg-fact';


const APG_SVG_INS_VALIDATORS = [
  {
    type: eApgSvgInstructionTypes.GENERIC,
    schema: 'IApgSvgInstruction'
  }, {
    type: eApgSvgInstructionTypes.SET_NAME,
    schema: 'IApgSvgInsSetName'
  }, {
    type: eApgSvgInstructionTypes.SET_VIEWBOX,
    schema: 'IApgSvgInsSetViewbox'
  }, {
    type: eApgSvgInstructionTypes.SET_AXIS,
    schema: 'IApgSvgInsSetAxis'
  }, {
    type: eApgSvgInstructionTypes.SET_BACKGROUND,
    schema: 'IApgSvgInsSetBackground'
  }, {
    type: eApgSvgInstructionTypes.SET_LAYER,
    schema: 'IApgSvgInsSetLayer'
  }, {
    type: eApgSvgInstructionTypes.NEW_POINT,
    schema: 'IApgSvgInsNewPoint'
  }, {
    type: eApgSvgInstructionTypes.NEW_POINT_DELTA,
    schema: 'IApgSvgInsNewPointDelta'
  }, {
    type: eApgSvgInstructionTypes.DRAW_POINTS,
    schema: 'IApgSvgInsDrawPoints'
  }, {
    type: eApgSvgInstructionTypes.DRAW_ALL_POINTS,
    schema: 'IApgSvgInsDrawAllPoints'
  }, {
    type: eApgSvgInstructionTypes.DRAW_ARC,
    schema: 'IApgSvgInsDrawArc'
  }, {
    type: eApgSvgInstructionTypes.DRAW_CIRCLE,
    schema: 'IApgSvgInsDrawCircle'
  }, {
    type: eApgSvgInstructionTypes.DRAW_LINE,
    schema: 'IApgSvgInsDrawLine'
  }, {
    type: eApgSvgInstructionTypes.DRAW_POLYLINE,
    schema: 'IApgSvgInsDrawPolyline'
  }, {
    type: eApgSvgInstructionTypes.DRAW_RECTANGLE_POINTS,
    schema: 'IApgSvgInsDrawRectanglePoints'
  }, {
    type: eApgSvgInstructionTypes.DRAW_RECTANGLE_SIZE,
    schema: 'IApgSvgInsDrawRectangleSize'
  }, {
    type: eApgSvgInstructionTypes.DRAW_POLYGON,
    schema: 'IApgSvgInsDrawPolygon'
  }, {
    type: eApgSvgInstructionTypes.DRAW_TEXT,
    schema: 'IApgSvgInsDrawText'
  }, {
    type: eApgSvgInstructionTypes.DRAW_NAME,
    schema: 'IApgSvgInsDrawName'
  }
];


/** Apg Svg Instruction set Manager
 */
export class ApgCadInstructionsSet extends ApgLoggable {

  /** Apg Svg Set Name*/
  private name: string;

  /** Apg Svg Instance*/
  private _svg: ApgSvg;
  /** Set of the points defined in the drawing */
  private __points: Map<string, Apg2DPoint> = new Map<string, Apg2DPoint>();
  /** Index for auto labelling of the points */
  private __lastPointIndex = 0;
  /** Set of instructions */
  instructions: IApgSvgInstruction[] = [];
  /** All the validators for the set retrieved from Apg Era Schemas */
  validators: Map<eApgSvgInstructionTypes, ApgAjv> = new Map();
  /** The Object is correctly initilized */
  initialized = false;
  /** The general status of the object */
  status: IApgResult;

  constructor(alogger: ApgEventLogger, asvg: ApgSvg, ainstructions?: IApgSvgInstruction[]) {

    super('ApgSvgInstructionsSet', alogger);
    this.logBegin('constructor');

    this._svg = asvg;
    this.name = 'Undefined';

    this.status = this.__getValidators(eraApp.api.schemas);

    if (this.status.ok) {
      this.initialized = true;
      if (ainstructions) {
        this.validateAndSet(ainstructions);
      }
      else {
        this.instructions = [];
      }
    }

    this.logEnd(this.status);
  }


  private __getValidators(aeraSchemas: ApgEraSchemasData) {

    this.logBegin(this.__getValidators.name);
    let r = new ApgResult();

    APG_SVG_INS_VALIDATORS.forEach(element => {
      r = aeraSchemas.getValidator(element.schema);
      if (r.ok) {
        const ajv = <ApgAjv>
          ApgResult.payload('ApgAjv', r);
        this.validators.set(element.type, ajv);
      }
    });

    this.logEnd(r);
    return r;
  }


  public load(adataPath: string) {

    if (this.initialized) {
      this.logBegin(this.load.name);

      this.status = ApgJsonFile.readArray(adataPath);

      if (this.status.ok) {

        const jsonRes = <IApgJsonFileResult>
          ApgResult.payload('IApgJsonFileResult', this.status);

        const instructions = <IApgSvgInstruction[]>jsonRes.data;

        this.status = this.__validateInstructions(instructions);

        if (this.status.ok) {
          this.instructions = instructions;
        }

      }

      this.logEnd(this.status);
    }
    return this.status;

  }


  public validateAndSet(ainstructions: any) {

    if (this.initialized) {
      this.logBegin(this.validateAndSet.name);

      const instructions: IApgSvgInstruction[] = <IApgSvgInstruction[]>ainstructions;

      this.status = this.__validateInstructions(instructions);

      if (this.status.ok) {
        this.instructions = instructions;
      }

      this.logEnd(this.status);
    }
    return this.status;

  }


  private __validateInstructions(instructions: IApgSvgInstruction[]) {

    let r = this.status;

    if (r.ok) {
      r = this.___validateInstructionsWithAjv(instructions);
      if (r.ok) {
        r = this.___checkFirstInstruction(instructions);
        if (r.ok) {
          r = this.___checkUniqueIds(instructions);
        }
      }
    }
    return r;
  }


  private ___validateInstructionsWithAjv(instructions: IApgSvgInstruction[]) {

    let r = this.status;

    if (r.ok) {

      const genVal: ApgAjv | undefined = this.validators.get(eApgSvgInstructionTypes.GENERIC);

      if (!genVal) {
        r = ApgErrorResult.notFound(
          eApgSvgErrorCodes.Svg_Validator_NotFound_1, [eApgSvgInstructionTypes.GENERIC]);
      }
      else {
        instructions.forEach(instruction => {

          if (r.ok) {

            r = genVal!.validate(instruction);

            if (r.ok) {

              const instVal: ApgAjv | undefined = this.validators.get(instruction.type);

              if (!instVal) {
                this.status = ApgErrorResult.notFound(
                  eApgSvgErrorCodes.Svg_Validator_NotFound_1, [instruction.type]);
              }
              else {
                r = instVal!.validate(instruction);
              }
            }
          }
        });
      }
    }
    return r;
  }


  private ___checkUniqueIds(ainstructions: IApgSvgInstruction[]) {

    let r = this.status;

    if (r.ok) {
      let duplicatedId = -1;

      const instructionsMap: Map<number, number> = new Map();

      if (ainstructions.length > 1) {
        instructionsMap.set(ainstructions[0].id, 0);
        const length = ainstructions.length - 1;
        let i = 1;
        do {
          const exists = instructionsMap.get(ainstructions[i].id);
          if (exists) {
            duplicatedId = exists;
          }
          else {
            instructionsMap.set(ainstructions[i].id, i);
          }
          i++;
        } while (duplicatedId === -1 && i < length);

        if (duplicatedId !== -1) {
          r = ApgErrorResult.notFound(
            eApgSvgErrorCodes.Svg_Instructions_WrongID_2, [duplicatedId.toString(), i.toString()]);
        }
      }
    }
    return r;
  }


  private ___checkFirstInstruction(instructions: IApgSvgInstruction[]) {
    let r = new ApgResult();

    if (instructions[0].type !== eApgSvgInstructionTypes.SET_NAME) {
      r = ApgErrorResult.notFound(
        eApgSvgErrorCodes.Svg_Instructions_SetName_NotFound_1, [eApgSvgInstructionTypes.SET_NAME]);
    }

    return r;
  }


  /** Sets the viewbox parameters
   */
  protected _setName(
    ainstructionId: number,
    aname: string
  ) {
    this.logBegin(this._setName.name, `(${ainstructionId})`);

    if (ainstructionId === 0) {
      this.name = aname;
    }
    else {
      this.status.ok = false;
      this.status.internalError = eApgInternalErrors.wrongOrder;
      this.status.message = `If present Set Name must first instruction`;
    }

    this.logEnd(this.status);
  }


  /** Sets the viewbox parameters
 */
  protected _setViewBox(
    ainstructionId: number,
    aviewBox: IApgSvgViewBox
  ) {
    this.logBegin(this._setViewBox.name, `(${ainstructionId})`);

    if (ainstructionId === 1) {
      this._svg.setViewBox(aviewBox);
    }
    else {
      this.status.ok = false;
      this.status.internalError = eApgInternalErrors.wrongOrder;
      this.status.message = `If present Set viewBox must be the second instruction immediately after Set Name`;
    }

    this.logEnd(this.status);
  }

  /** Sets the axis parameters
   */
  protected _setAxis(
    ainstructionId: number,
    aaxis: IApgSvgAxis
  ) {
    this.logBegin(this._setAxis.name, `(${ainstructionId})`);

    const prevType = this.instructions[ainstructionId - 1].type;
    if (
      (prevType === eApgSvgInstructionTypes.SET_NAME) ||
      (prevType === eApgSvgInstructionTypes.SET_VIEWBOX) ||
      (prevType === eApgSvgInstructionTypes.SET_BACKGROUND)
    ) {
      this._svg.setAxis(aaxis);
    }
    else {
      this.status.ok = false;
      this.status.internalError = eApgInternalErrors.wrongOrder;
      this.status.message = `If present Set Axis must follow Set Name, Set Viewbox or Set Background`;
    }

    this.logEnd(this.status);
  }


  /** Sets the background parameters
 */
  protected _setBackground(
    ainstructionId: number,
    abckg: IApgSvgBackground
  ) {
    this.logBegin(this._setBackground.name, `(${ainstructionId})`);
    const prevType = this.instructions[ainstructionId - 1].type;
    if (
      (prevType === eApgSvgInstructionTypes.SET_NAME) ||
      (prevType === eApgSvgInstructionTypes.SET_VIEWBOX)
    ) {
      this._svg.setBackground(abckg);
    }
    else {
      this.status.ok = false;
      this.status.internalError = eApgInternalErrors.wrongOrder;
      this.status.message = `If present Set Background must follow Set Name or Set Viewbox`;
    }

    this.logEnd(this.status);
  }


  /** Adds a point to the points set.
   */
  protected _newPoint(
    ainstructionId: number,
    ax: number,
    ay: number,
    anewPointName?: string
  ) {
    this.logBegin(this._newPoint.name, `(${ainstructionId})`);

    if (anewPointName) {
      const pointExists = this.__points.get(anewPointName);
      if (pointExists) {
        this.status.ok = false;
        this.status.internalError = eApgInternalErrors.notFound;
        this.status.message = `Point named [${anewPointName}] already exists`;
      }
    }
    if (this.status.ok) {
      const newPoint = new Apg2DPoint(ax, ay);
      this.__lastPointIndex++;
      let pointName;
      if (!anewPointName) {
        pointName = 'P#' + this.__lastPointIndex;
      }
      else {
        pointName = anewPointName;
      }
      this.__points.set(pointName, newPoint);
    }

    this.logEnd(this.status);
  }


  /** Adds a point to the points set, by setting a distance from another point.
   */
  protected _newPointDelta(
    ainstructionId: number,
    aorigin: string,
    adeltax: number,
    adeltay: number,
    anewPointName?: string
  ) {
    this.logBegin(this._newPointDelta.name, `(${ainstructionId})`);

    const point: Apg2DPoint | undefined = this.__points.get(aorigin);

    if (!point) {
      this.status.ok = false;
      this.status.internalError = eApgInternalErrors.notFound;
      this.status.message = `Point origin named [${aorigin}] not found in set.`;
    }
    else {
      const x = point.x + adeltax;
      const y = point.y + adeltay;
      this._newPoint(ainstructionId, x, y, anewPointName);
    }

    this.logEnd(this.status);
  }


  /** Sets the current layer
   */
  protected _currentLayer(
    ainstructionId: number,
    alayerName: string
  ) {
    this.logBegin(this._currentLayer.name, `(${ainstructionId})`);

    const layer: svgjs.G | undefined = this._svg.setLayer(alayerName);

    if (!layer) {
      this.status.ok = false;
      this.status.internalError = eApgInternalErrors.notFound;
      this.status.message = `Layer ['${alayerName}'] not found `;
    }

    this.logEnd(this.status);
  }


  /** Creates a new group ad sets it as the current one
   */
  protected _newGroup(
    ainstructionId: number,
    agr: string,
    astrk?: string,
    afill?: string
  ) {

    this.logBegin(this._newGroup.name, `(${ainstructionId})`);

    const group: svgjs.G | undefined = this._svg.getGroup(agr);

    if (group) {
      this.status.ok = false;
      this.status.internalError = eApgInternalErrors.alreadyExist;
      this.status.message = `Group name ['${agr}'] already exists . Use setGroup instead.`;
    }
    else {
      if (astrk) {
        this.__checkStroke(astrk);
      }
      if (this.status.ok && afill) {
        this.__checkFill(afill);
      }
      if (this.status.ok) {
        this._svg.newGroup(agr, astrk, afill);
      }
    }

    this.logEnd(this.status);
  }


  /** Sets the current group
   */
  protected _setGroup(
    ainstructionId: number,
    agr: string
  ) {
    this.logBegin(this._setGroup.name, `(${ainstructionId})`);

    const group: svgjs.G | undefined = this._svg.setGroup(agr);

    if (!group) {
      this.status.ok = false;
      this.status.internalError = eApgInternalErrors.alreadyExist;
      this.status.message = `Group not found ['${agr}'].`;
    }

    this.logEnd(this.status);
  }


  /** Draws a line between the given points
   */
  protected _drawLine(
    ainstructionId: number,
    apts: string[],
    astrk?: string
  ) {
    this.logBegin(this._drawLine.name, `(${ainstructionId})`);

    const pts: Apg2DPoint[] = [];
    this._get2PointsByNames(apts, pts);

    if (this.status.ok) {
      const strk: svgjs.StrokeData | undefined = this.__checkStroke(astrk);

      const pf: ApgSvgPrimitiveFactory = new ApgSvgPrimitiveFactory(this._svg.currentGroup);
      const e: svgjs.Element = pf.buildLine(pts[0], pts[1]);
      e.fill('none');
      if (strk) {
        e.stroke(strk);
      }
    }

    this.logEnd();
  }


  private _get2PointsByNames(apts: string[], pts: Apg2DPoint[]) {
    if (apts.length !== 2) {
      this.status.ok = false;
      this.status.internalError = eApgInternalErrors.notAValidValue;
      this.status.message = `Wrong number of points: must be 2`;
    }
    else {
      this._getPointsByNames(apts, pts);

      if (this.status.ok) {
        if (pts.length !== 2) {
          this.status.ok = false;
          this.status.internalError = eApgInternalErrors.notAValidValue;
          this.status.message = `Points are identical`;
        }
        else {
          const jsonPt1 = JSON.stringify(pts[0]);
          const jsonPt2 = JSON.stringify(pts[1]);

          if (jsonPt1 === jsonPt2) {
            this.status.ok = false;
            this.status.internalError = eApgInternalErrors.alreadyExist;
            this.status.message = `Points 1 and 2 are overlapped`;
          }
        }
      }
    }
  }


  /** Draws a Polyline
   */
  protected _drawPolyLine(
    ainstructionId: number,
    apts: string[],
    astrk?: string
  ) {
    this.logBegin(this._drawPolyLine.name, `(${ainstructionId})`);

    const pts: Apg2DPoint[] = [];
    this._getPointsByNames(apts, pts);

    if (this.status.ok && pts.length > 2) {

      const strk: svgjs.StrokeData | undefined = this.__checkStroke(astrk);

      const pf: ApgSvgPrimitiveFactory = new ApgSvgPrimitiveFactory(this._svg.currentGroup);
      const e: svgjs.Element = pf.buildPolyLine(pts);
      e.fill('none');
      if (strk) {
        e.stroke(strk);
      }
    }

    this.logEnd();

  }


  private _getPointsByNames(apts: string[], pts: Apg2DPoint[]) {
    this.logBegin(this._getPointsByNames.name);

    let prevPt: string;
    let first = true;
    apts.forEach(apt => {
      if (this.status.ok) {
        const p: Apg2DPoint | undefined = this.__points.get(apt);
        if (!p) {
          this.status.ok = false;
          this.status.internalError = eApgInternalErrors.notFound;
          this.status.message = `Point name not found: ${apt}`;
        }
        else {
          if (first) {
            first = false;
            pts.push(p);
          }
          else {
            if (prevPt !== apt) {
              pts.push(p);
            }
          }
          prevPt = apt;
        }
      }
    });

    this.logEnd(this.status);
  }


  /** Draws a series of points
   */
  protected _drawPoints(
    ainstructionId: number,
    apts: string[],
    arad: number,
    astrk?: string,
    afill?: string
  ) {
    this.logBegin(this._drawPoints.name, `(${ainstructionId})`);

    const pts: Apg2DPoint[] = [];
    this._getPointsByNames(apts, pts);

    if (this.status.ok) {
      const strk: svgjs.StrokeData | undefined = this.__checkStroke(astrk);
      const fill: svgjs.FillData | undefined = this.__checkFill(afill);

      const pf: ApgSvgPrimitiveFactory = new ApgSvgPrimitiveFactory(this._svg.currentGroup);
      pts.forEach(pt => {
        const e: svgjs.Element = pf.buildDot(pt, arad);
        if (strk) {
          e.stroke(strk);
        }
        if (fill) {
          e.fill(fill);
        }
      });
    }

    this.logEnd(this.status);

  }


  /** Draws all the points adding debbugging info (name / coordinates)
   */
  protected _drawAllpoints(
    ainstructionId: number,
    arad: number,
    astrk?: string,
    afill?: string
  ) {
    this.logBegin(this._drawAllpoints.name, `(${ainstructionId})`);

    const strk: svgjs.StrokeData | undefined = this.__checkStroke(astrk);
    const fill: svgjs.FillData | undefined = this.__checkFill(afill);

    const pf: ApgSvgPrimitiveFactory = new ApgSvgPrimitiveFactory(this._svg.currentGroup);
    this.__points.forEach((pt, name) => {
      const font: svgjs.FontData = <svgjs.FontData>this._svg.getFont('Mono');
      const e = pf.buildPoint(pt, '#' + name, font, arad);
      if (strk) {
        e.stroke(strk);
      }
      if (fill) {
        e.fill(fill);
      }
    });

    this.logEnd();
  }


  /** Draws a rectangle from the given points
   */
  protected _drawRectanglePoints(
    ainstructionId: number,
    apts: string[],
    astrk?: string,
    afill?: string
  ) {
    this.logBegin(this._drawRectanglePoints.name, `(${ainstructionId})`);

    const pts: Apg2DPoint[] = [];
    this._get2PointsByNames(apts, pts);

    if (this.status.ok) {

      const ppts: Apg2DPoint[] = [];
      ppts.push(new Apg2DPoint(pts[0].x, pts[0].y));
      ppts.push(new Apg2DPoint(pts[0].x, pts[1].y));
      ppts.push(new Apg2DPoint(pts[1].x, pts[1].y));
      ppts.push(new Apg2DPoint(pts[1].x, pts[0].y));

      const strk: svgjs.StrokeData | undefined = this.__checkStroke(astrk);
      const fill: svgjs.FillData | undefined = this.__checkFill(afill);

      const pf: ApgSvgPrimitiveFactory = new ApgSvgPrimitiveFactory(this._svg.currentGroup);
      const e: svgjs.Element = pf.buildPolygon(ppts);

      if (strk) {
        e.stroke(strk);
      }
      if (fill) {
        e.fill(fill);
      }
    }
    this.logEnd();
  }



  /** Draws a rectangle from an origin and sizes
   */
  protected _drawRectangleSizes(
    ainstructionId: number,
    aorigin: string,
    ax: number,
    ay: number,
    astrk?: string,
    afill?: string
  ) {
    this.logBegin(this._drawRectangleSizes.name, `(${ainstructionId})`);

    const p: Apg2DPoint | undefined = this.__points.get(aorigin);
    if (!p) {
      this.status.ok = false;
      this.status.internalError = eApgInternalErrors.notFound;
      this.status.message = `Point name not found: ${aorigin}`;
    }
    else {

      const ppts: Apg2DPoint[] = [];
      ppts.push(new Apg2DPoint(p.x, p.y));
      ppts.push(new Apg2DPoint(p.x + ax, p.y));
      ppts.push(new Apg2DPoint(p.x + ax, p.y + ay));
      ppts.push(new Apg2DPoint(p.x, p.y + ay));

      const strk: svgjs.StrokeData | undefined = this.__checkStroke(astrk);
      const fill: svgjs.FillData | undefined = this.__checkFill(afill);

      const pf: ApgSvgPrimitiveFactory = new ApgSvgPrimitiveFactory(this._svg.currentGroup);
      const e: svgjs.Element = pf.buildPolygon(ppts);

      if (strk) {
        e.stroke(strk);
      }
      if (fill) {
        e.fill(fill);
      }
    }
    this.logEnd(this.status);
  }


  /** Draws a polygon from the given points
   */
  protected _drawPolygon(
    ainstructionId: number,
    apts: string[],
    astrk?: string,
    afill?: string
  ) {

    this.logBegin(this._drawPolygon.name, `(${ainstructionId})`);

    const pts: Apg2DPoint[] = [];
    this._getPointsByNames(apts, pts);

    if (pts.length < 3) {
      this.status.ok = false;
      this.status.internalError = eApgInternalErrors.notInsideLimits;
      this.status.message = `Not enough points [${pts.length}] for a polygon`;
    }

    if (this.status.ok) {

      const strk: svgjs.StrokeData | undefined = this.__checkStroke(astrk);
      const fill: svgjs.FillData | undefined = this.__checkFill(afill);

      const pf: ApgSvgPrimitiveFactory = new ApgSvgPrimitiveFactory(this._svg.currentGroup);
      const e: svgjs.Element = pf.buildPolygon(pts);

      if (strk) {
        e.stroke(strk);
      }
      if (fill) {
        e.fill(fill);
      }

    }
    this.logEnd(this.status);
  }


  /** Draws a text at the given coord
 */
  protected _drawText(
    ainstructionId: number,
    atext: string[],
    aorigin: string,
    afont?: string
  ) {

    this.logBegin(this._drawText.name, `(${ainstructionId})`);

    const pts: Apg2DPoint[] = [];
    this._getPointsByNames([aorigin], pts);

    if (pts.length < 1) {
      this.status.ok = false;
      this.status.internalError = eApgInternalErrors.notInsideLimits;
      this.status.message = `Origin point for the text [${pts.length}] not found`;
    }

    if (this.status.ok) {
      const zero = new Apg2DPoint(0, 0);
      pts.push(zero);
      const font: IApgSvgFont | undefined = this.__checkFont(afont);

      if (this.status.ok) {
        const af: ApgSvgAnnotationFactory = new ApgSvgAnnotationFactory(this._svg.currentGroup, font!, this._svg.standardHeight);
        af.build(pts[0], pts[1], atext[0]);
      }

    }
    this.logEnd(this.status);
  }


  /** Draws the name of the Drawing
*/
  protected _drawName(
    ainstructionId: number,
    ax: number,
    ay: number,
    afont?: string
  ) {

    this.logBegin(this._drawName.name, `(${ainstructionId})`);


    const origin = new Apg2DPoint(ax, ay);
    const zero = new Apg2DPoint(0, 0);
    if (!afont) {
      afont = 'Title';
    }

    const font: IApgSvgFont | undefined = this.__checkFont(afont);

    if (this.status.ok) {
      const af: ApgSvgAnnotationFactory = new ApgSvgAnnotationFactory(this._svg.currentGroup, font!, this._svg.standardHeight);
      af.build(origin, zero, this.name);
    }

    this.logEnd();
  }

  /** Draws an annotation from the given data
   */
  protected _drawAnnotation(
    ainstructionId: number,
    apts: string[],
    atext: string[],
    aangle: number = 0,
    afont: string = 'Dimensions'
  ) {

    this.logBegin(this._drawAnnotation.name, `(${ainstructionId})`);

    const pts: Apg2DPoint[] = [];
    this._get2PointsByNames(apts, pts);

    if (this.status.ok) {

      const font: IApgSvgFont | undefined = this.__checkFont(afont);
      if (font) {

        const arrow = this._svg.getArrowBlock('Arrow', this._svg.standardHeight, 0.25);

        const af: ApgSvgAnnotationFactory =
          new ApgSvgAnnotationFactory(
            this._svg.currentGroup,
            font,
            this._svg.standardHeight,
            arrow
          );

        const disp: Apg2DPoint = new Apg2DPoint(pts[1].x - pts[0].x, pts[1].y - pts[0].y);

        af.build(pts[0], disp, atext[0], aangle);

      }

    }
    this.logEnd();
  }



  /** Draws an annotation from the given data
   */
  protected _drawLinearDim(
    ainstructionId: number,
    apts: string[],
    adisp: number,
    atext: string[],
    afont: string = 'Dimensions'
  ) {
    this.logBegin(this._drawLinearDim.name, `(${ainstructionId})`);

    const pts: Apg2DPoint[] = [];
    this._get2PointsByNames(apts, pts);

    if (this.status.ok) {

      const font: IApgSvgFont | undefined = this.__checkFont(afont);
      if (font) {

        const arrow = this._svg.getArrowBlock('Arrow', this._svg.standardHeight, 0.25);

        const af: ApgSvgCadLinearDimensionFactory =
          new ApgSvgCadLinearDimensionFactory(this._svg.currentGroup, font.font, this._svg.standardHeight, arrow);

        af.build(pts[0], pts[1], adisp, eApgSvgLinearDimensionTypes.Diagonal, atext[0], atext[1]); // <=(X)

      }

    }
    this.logEnd();
  }


  /** Parses the instructions set and builds the SVG drawing
   */
  build(asettingsOnly: boolean = false) { svg: string, data: any } {

    this.logBegin(this.build.name);

    /** Current Instruction Index */
    let lcii = 0;

    this.instructions.forEach((ai: IApgSvgInstruction) => {
      if (this.status.ok) {
        switch (ai.type) {
          case eApgSvgInstructionTypes.SET_NAME: {
            this._setName(lcii, ai.name!); // 2018/12/02 *
            break;
          }
          case eApgSvgInstructionTypes.SET_VIEWBOX: {
            this._setViewBox(lcii, ai.payload!); // 2018/12/02 *
            break;
          }
          case eApgSvgInstructionTypes.SET_AXIS: {
            this._setAxis(lcii, ai.payload!); // 2018/12/08 *
            break;
          }
          case eApgSvgInstructionTypes.SET_BACKGROUND: {
            this._setBackground(lcii, ai.payload!); // 2018/12/08 *
            break;
          }
          case eApgSvgInstructionTypes.NEW_POINT: {
            this._newPoint(lcii, ai.x!, ai.y!, ai.name); // 2017/11/25 *
            break;
          }
          case eApgSvgInstructionTypes.NEW_POINT_DELTA: {
            this._newPointDelta(lcii, ai.origin!, ai.x!, ai.y!, ai.name); // 2017/11/25 *
            break;
          }
          case eApgSvgInstructionTypes.NEW_STROKE_STYLE: {
            this._svg.newStrokeStyle(ai.name!, <svgjs.StrokeData>ai.stroke);
            break;
          }
          case eApgSvgInstructionTypes.NEW_FILL_STYLE: {
            this._svg.newFillStyle(ai.name!, <svgjs.FillData>ai.fill);
            break;
          }
          case eApgSvgInstructionTypes.SET_LAYER: {
            this._currentLayer(lcii, ai.name!); // 2017/11/26
            break;
          }
          case eApgSvgInstructionTypes.NEW_GROUP: {
            this._newGroup(lcii, ai.name!, <string>ai.stroke, <string>ai.fill); // 2017/11/26
            break;
          }
          case eApgSvgInstructionTypes.SET_GROUP: {
            this._setGroup(lcii, ai.name!); // 2017/11/26
            break;
          }
          case eApgSvgInstructionTypes.DRAW_POINTS: {
            if (!asettingsOnly) {
              this._drawPoints(lcii, ai.points!, ai.radious!, <string>ai.stroke, <string>ai.fill); // 2017/11/26 *
            }
            break;
          }
          case eApgSvgInstructionTypes.DRAW_ALL_POINTS: {
            if (!asettingsOnly) {
              this._drawAllpoints(lcii, ai.radious!, <string>ai.stroke, <string>ai.fill); // 2017/11/26 *
            }
            break;
          }
          case eApgSvgInstructionTypes.DRAW_LINE: {
            if (!asettingsOnly) {
              this._drawLine(lcii, ai.points!, <string>ai.stroke); // 2017/11/26 *
            }
            break;
          }
          case eApgSvgInstructionTypes.DRAW_POLYLINE: {
            if (!asettingsOnly) {
              this._drawPolyLine(lcii, ai.points!, <string>ai.stroke); // 2017/11/25 *
            }
            break;
          }
          case eApgSvgInstructionTypes.DRAW_RECTANGLE_POINTS: {
            if (!asettingsOnly) {
              this._drawRectanglePoints(lcii, ai.points!, <string>ai.stroke, <string>ai.fill); // 2018/12/08 *
            }
            break;
          }
          case eApgSvgInstructionTypes.DRAW_RECTANGLE_SIZE: {
            if (!asettingsOnly) {
              this._drawRectangleSizes(lcii, ai.origin!, ai.x!, ai.y!, <string>ai.stroke, <string>ai.fill); // 2018/12/08 *
            }
            break;
          }
          case eApgSvgInstructionTypes.DRAW_POLYGON: {
            if (!asettingsOnly) {
              this._drawPolygon(lcii, ai.points!, <string>ai.stroke, <string>ai.fill); // 2018/12/08 *
            }
            break;
          }
          case eApgSvgInstructionTypes.DRAW_TEXT: {
            if (!asettingsOnly) {
              this._drawText(lcii, ai.text!, ai.origin!, <string>ai.font);
            }
            break;
          }
          case eApgSvgInstructionTypes.DRAW_NAME: {
            if (!asettingsOnly) {
              this._drawName(lcii, ai.x!, ai.y!, <string>ai.font);
            }
            break;
          }
          case eApgSvgInstructionTypes.DRAW_ANNOTATION: {
            if (!asettingsOnly) {
              this._drawAnnotation(lcii, ai.points!, ai.text!, ai.angle, <string>ai.font);
            }
            break;
          }
          case eApgSvgInstructionTypes.DRAW_LIN_DIM: {
            if (!asettingsOnly) {
              this._drawLinearDim(lcii, ai.points!, ai.radious!, ai.text!, <string>ai.font);
            }
          }

        }
      }
      lcii++;
    }, this);

    this.logEnd();

    const r: any = {};
    r.svg = this._svg.doc.svg();
    r.data = this._getData();
    return r;
  }


  /** Builds the instructions set but only for getting back the svg object settings */
  getSvgData(): any {
    this.logBegin(this.getSvgData.name);

    const r: any = this.build(true).data;

    this.logEnd();

    return r;
  }


  private _getData() {
    const r: any = {};
    r.settings = this._svg.settings;
    r.points = ApgU.convertMapToArray(this.__points);
    r.fonts = ApgU.convertMapToArray(this._svg.fonts);
    r.layers = ApgU.convertMapToArray(this._svg.layersDefs);
    r.groups = ApgU.convertMapToArray(this._svg.groupsDefs);
    r.strokes = ApgU.convertMapToArray(this._svg.strokes);
    r.fills = ApgU.convertMapToArray(this._svg.fills);
    r.gradients = ApgU.convertMapToArray(this._svg.gradients);
    r.patterns = this._svg.patternsDefs;
    return r;
  }

  private __checkStroke(astrk: string | undefined): svgjs.StrokeData | undefined {
    let lsrk: svgjs.StrokeData | undefined;
    if (astrk) {
      lsrk = this._svg.getStrokeStyle(astrk);
      if (lsrk === undefined) {
        this.status.ok = false;
        this.status.internalError = eApgInternalErrors.notFound;
        this.status.message = `Stroke style not found [${lsrk}]`;
      }
    }
    return lsrk;
  }

  private __checkFill(afill: string | undefined): svgjs.FillData | undefined {
    let fill: svgjs.FillData | undefined;
    if (afill !== undefined) {
      fill = this._svg.getFillStyle(afill);
      if (fill === undefined) {
        this.status.ok = false;
        this.status.internalError = eApgInternalErrors.notFound;
        this.status.message = `Fill style not found [${afill}]`;
      }
    }
    return fill;
  }

  private __checkFont(afont: string | undefined): IApgSvgFont | undefined {
    let font: IApgSvgFont | undefined;
    if (afont !== undefined) {
      font = this._svg.getFont(afont);
      if (font === undefined) {
        this.status.ok = false;
        this.status.internalError = eApgInternalErrors.notFound;
        this.status.message = `Font not found [${afont}]`;
      }
    }
    return font;
  }

}
