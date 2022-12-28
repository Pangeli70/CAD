/** -----------------------------------------------------------------------
 * @module [CAD-Svg]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.7.0 [APG 2019/08/15]
 * @version 0.7.1 [APG 2019/08/27]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { A2D, Lgr, Rst, Svg, Uts, Jsv } from "../../deps.ts";

import {
  ApgCadSvgBasicShapesFactory,
  ApgCadSvgLinearDimensionsFactory,
  ApgCadSvgAnnotationsFactory,
  eApgCadInstructionTypes,
  IApgCadSvgAxis,
  IApgCadSvgBackground,
  IApgCadSvgViewBox,
  IApgCadInstruction,
  ApgCadSvg,
  eApgCadLinearDimensionTypes,
  eApgCadSvgPrimitiveFactoryTypes,
  eApgCadDftTextStyles
} from "../../mod.ts";

import { eApgCadIns_TypesSchema } from "../schemas/eApgCadInsTypesSchema.ts";
import { ApgCadIns_GenericSchema } from "../schemas/ApgCadInsGenericSchema.ts";
import { ApgCadIns_DrawLineSchema } from "../schemas/ApgCadInsDrawLineSchema.ts";
import { ApgCadIns_SetNameSchema } from "../schemas/ApgCadInsSetNameSchema.ts";
import { ApgCadIns_NewPointSchema } from "../schemas/ApgCadInsNewPointSchema.ts";
import { IApgCadStyleOptions } from "../interfaces/IApgCadStyleOptions.ts";


const APG_SVG_INS_VALIDATORS = [
  {
    type: eApgCadInstructionTypes.TYPES,
    schema: 'eApgCadInsTypes',
    jsonSchema: eApgCadIns_TypesSchema,
  },
  {
    type: eApgCadInstructionTypes.GENERIC,
    schema: 'IApgCadInsGeneric',
    jsonSchema: ApgCadIns_GenericSchema,
    dependencies: ['eApgCadInsTypes']
  }, {
    type: eApgCadInstructionTypes.SET_NAME,
    schema: 'IApgCadInsSetName',
    jsonSchema: ApgCadIns_SetNameSchema,
  }, {
    //   type: eApgCadInstructionTypes.SET_VIEWBOX,
    //   schema: 'IApgCadSvgInsSetViewbox'
    // }, {
    //   type: eApgCadInstructionTypes.SET_AXIS,
    //   schema: 'IApgCadSvgInsSetAxis'
    // }, {
    //   type: eApgCadInstructionTypes.SET_BACKGROUND,
    //   schema: 'IApgCadSvgInsSetBackground'
    // }, {
    //   type: eApgCadInstructionTypes.SET_LAYER,
    //   schema: 'IApgCadSvgInsSetLayer'
    // }, {
    type: eApgCadInstructionTypes.NEW_POINT,
    schema: 'IApgCadInsNewPoint',
    jsonSchema: ApgCadIns_NewPointSchema,
  }, {
    //   type: eApgCadInstructionTypes.NEW_POINT_DELTA,
    //   schema: 'IApgCadSvgInsNewPointDelta'
    // }, {
    //   type: eApgCadInstructionTypes.DRAW_POINTS,
    //   schema: 'IApgCadSvgInsDrawPoints'
    // }, {
    //   type: eApgCadInstructionTypes.DRAW_ALL_POINTS,
    //   schema: 'IApgCadSvgInsDrawAllPoints'
    // }, {
    //   type: eApgCadInstructionTypes.DRAW_ARC,
    //   schema: 'IApgCadSvgInsDrawArc'
    // }, {
    //   type: eApgCadInstructionTypes.DRAW_CIRCLE,
    //   schema: 'IApgCadSvgInsDrawCircle'
    // }, {
    type: eApgCadInstructionTypes.DRAW_LINE,
    schema: 'IApgCadInsDrawLine',
    jsonSchema: ApgCadIns_DrawLineSchema,
    // }, {
    //   type: eApgCadInstructionTypes.DRAW_POLYLINE,
    //   schema: 'IApgCadSvgInsDrawPolyline'
    // }, {
    //   type: eApgCadInstructionTypes.DRAW_RECTANGLE_POINTS,
    //   schema: 'IApgCadSvgInsDrawRectanglePoints'
    // }, {
    //   type: eApgCadInstructionTypes.DRAW_RECTANGLE_SIZE,
    //   schema: 'IApgCadSvgInsDrawRectangleSize'
    // }, {
    //   type: eApgCadInstructionTypes.DRAW_POLYGON,
    //   schema: 'IApgCadSvgInsDrawPolygon'
    // }, {
    //   type: eApgCadInstructionTypes.DRAW_TEXT,
    //   schema: 'IApgCadSvgInsDrawText'
    // }, {
    //   type: eApgCadInstructionTypes.DRAW_NAME,
    //   schema: 'IApgCadSvgInsDrawName'
  }
];


/** Apg Svg Instruction set Manager
 */
export class ApgCadInstructionsSet extends Lgr.ApgLgrLoggable {

  /** Apg Cad Set Name*/
  private name: string;

  /** Apg Cad Svg Instance*/
  private _cad: ApgCadSvg;
  /** Set of the points defined in the drawing */
  private _points: Map<string, A2D.Apg2DPoint> = new Map<string, A2D.Apg2DPoint>();
  /** Index for auto labelling of the points */
  private _lastPointIndex = 0;
  /** Set of instructions */
  instructions: IApgCadInstruction[] = [];
  /** All the validators for the various instruction types */
  validators: Map<eApgCadInstructionTypes, Jsv.ApgJsvAjvValidator> = new Map();
  /** The Object is correctly initialized */
  private _ready = false;
  /** The general status of the object */
  status: Rst.ApgRst;



  constructor(alogger: Lgr.ApgLgr, acad: ApgCadSvg, ainstructions?: IApgCadInstruction[]) {

    super('ApgCadInstructionsSet', alogger);
    this.logBegin('constructor');

    this._cad = acad;
    this.name = 'Undefined';

    this.status = this.#getValidators();

    if (this.status.Ok) {
      this._ready = true;
      if (ainstructions) {
        this.validateAndSet(ainstructions);
      }
      else {
        this.instructions = [];
      }
    }

    this.logEnd(this.status);
  }


  #getValidators() {

    this.logBegin(this.#getValidators.name);
    let r = new Rst.ApgRst();

    const validatorService = new Jsv.ApgJsvService(this._logger);

    APG_SVG_INS_VALIDATORS.forEach(element => {
      if (r.Ok && element.jsonSchema) {
        const deps = element.dependencies ? element.dependencies : [];
        r = validatorService.addValidator(element.jsonSchema, deps);
        if (r.Ok) {
          const validatorName = element.jsonSchema.$id.replaceAll("#", "");
          const validator = validatorService.getValidator(validatorName);
          this.validators.set(element.type, validator!);
        }
      }
    });

    this.logEnd(r);
    return r;
  }


  public async load(adataPath: string) {

    if (this._ready) {
      this.logBegin(this.load.name);

      const jsonData = await Uts.ApgUtsJsonFile.Read(adataPath);
      const instructions = <IApgCadInstruction[]>jsonData;

      this.status = this.#validateInstructions(instructions);

      if (this.status.Ok) {
        this.instructions = instructions;
      }

      this.logEnd(this.status);

    }
    return this.status;
  }


  public validateAndSet(ainstructions: IApgCadInstruction[]) {

    if (this._ready) {
      this.logBegin(this.validateAndSet.name);

      this.status = this.#validateInstructions(ainstructions);

      if (this.status.Ok) {
        this.instructions = ainstructions;
      }

      this.logEnd(this.status);
    }
    return this.status;

  }


  #validateInstructions(instructions: IApgCadInstruction[]) {

    let r = this.status;

    if (r.Ok) {
      r = this.#validateInstructionsWithAjv(instructions);
      if (r.Ok) {
        r = this.#checkFirstInstruction(instructions);
        if (r.Ok) {
          r = this.#checkUniqueIds(instructions);
        }
      }
    }
    return r;
  }


  #validateInstructionsWithAjv(instructions: IApgCadInstruction[]) {

    let r = this.status;

    if (r.Ok) {

      const genVal = this.validators.get(eApgCadInstructionTypes.GENERIC);

      if (!genVal) {
        r = Rst.ApgRstErrors.NotFound("", "Validator [%1] Not found", [eApgCadInstructionTypes.GENERIC]);
      }
      else {
        instructions.forEach(instruction => {

          if (r.Ok) {

            r = genVal!.validate(instruction);

            if (r.Ok) {

              const instVal = this.validators.get(instruction.type);

              if (!instVal) {
                r = Rst.ApgRstErrors.NotFound("", "Validator [%1] Not found", [instruction.type]);
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


  #checkUniqueIds(ainstructions: IApgCadInstruction[]) {

    let r = this.status;

    if (r.Ok) {
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
          r = Rst.ApgRstErrors.AlreadyExists(
            "",
            "Wrong id [%1] for instruction number [%2]",
            [duplicatedId.toString(), i.toString()]
          );
        }
      }
    }
    return r;
  }


  #checkFirstInstruction(instructions: IApgCadInstruction[]) {
    let r = new Rst.ApgRst();

    if (instructions[0].type !== eApgCadInstructionTypes.SET_NAME) {
      r = Rst.ApgRstErrors.NotFound(
        "",
        "[%1] not found as first instruction",
        [eApgCadInstructionTypes.SET_NAME]
      );
    }

    return r;
  }


  /** Sets the viewbox parameters
   */
  #setName(
    ainstructionId: number,
    aname: string
  ) {
    let r = new Rst.ApgRst();

    if (ainstructionId === 0) {
      this.name = aname;
    }
    else {
      r = Rst.ApgRstErrors.Managed(
        "",
        "If present [%1] must first instruction",
        [eApgCadInstructionTypes.SET_NAME]
      );
    }

    return r;
  }


  /** Sets the viewbox parameters
 */
  #setViewBox(
    ainstructionId: number,
    aviewBox: IApgCadSvgViewBox
  ) {
    this.logBegin(this.#setViewBox.name);
    this.logTrace(`${ainstructionId}`);

    if (ainstructionId === 1) {
      this._cad.setViewBox(aviewBox);
    }
    else {
      this.status = Rst.ApgRstErrors.Managed(
        "",
        "If present [%1] must be the second instruction immediately after [%2]",
        [eApgCadInstructionTypes.SET_VIEWBOX, eApgCadInstructionTypes.SET_NAME]
      );
    }

    this.logEnd(this.status);
  }

  /** Sets the axis parameters
   */
  #setAxis(
    ainstructionId: number,
    aaxis: IApgCadSvgAxis
  ) {
    this.logBegin(this.#setAxis.name);
    this.logTrace(`${ainstructionId}`);

    const prevType = this.instructions[ainstructionId - 1].type;
    if (
      (prevType === eApgCadInstructionTypes.SET_NAME) ||
      (prevType === eApgCadInstructionTypes.SET_VIEWBOX) ||
      (prevType === eApgCadInstructionTypes.SET_BACKGROUND)
    ) {
      this._cad.setAxis(aaxis);
    }
    else {
      this.status = Rst.ApgRstErrors.Managed(
        "",
        "If present [%1] must follow [%2], [%3] or [%4]",
        [eApgCadInstructionTypes.SET_AXIS, eApgCadInstructionTypes.SET_NAME, eApgCadInstructionTypes.SET_VIEWBOX, eApgCadInstructionTypes.SET_BACKGROUND]
      );
    }

    this.logEnd(this.status);
  }


  /** Sets the background parameters
 */
  #setBackground(
    ainstructionId: number,
    abckg: IApgCadSvgBackground
  ) {
    this.logBegin(this.#setBackground.name);
    this.logTrace(`${ainstructionId}`);

    const prevType = this.instructions[ainstructionId - 1].type;
    if (
      (prevType === eApgCadInstructionTypes.SET_NAME) ||
      (prevType === eApgCadInstructionTypes.SET_VIEWBOX)
    ) {
      this._cad.setBackground(abckg);
    }
    else {
      this.status = Rst.ApgRstErrors.Managed(
        "",
        "If present [%1] must follow [%2], or [%3]",
        [eApgCadInstructionTypes.SET_BACKGROUND, eApgCadInstructionTypes.SET_NAME, eApgCadInstructionTypes.SET_VIEWBOX]
      );
    }

    this.logEnd(this.status);
  }


  /** Adds a point to the points set.
   */
  #newPoint(
    ainstructionId: number,
    ax: number,
    ay: number,
    anewPointName?: string
  ) {
    this.logBegin(this.#newPoint.name);
    this.logTrace(`${ainstructionId}`);

    if (anewPointName) {
      const pointExists = this._points.get(anewPointName);
      if (pointExists) {
        this.status = Rst.ApgRstErrors.AlreadyExists(
          "",
          `Point named [%1] already exists`,
          [anewPointName]
        )
      }
    }
    if (this.status.Ok) {
      const newPoint = new A2D.Apg2DPoint(ax, ay);
      this._lastPointIndex++;
      let pointName;
      if (!anewPointName) {
        pointName = 'P#' + this._lastPointIndex;
      }
      else {
        pointName = anewPointName;
      }
      this._points.set(pointName, newPoint);
    }

    this.logEnd(this.status);
  }


  /** Adds a point to the points set, by setting a distance from another point.
   */
  #newPointByDelta(
    ainstructionId: number,
    aoriginPointName: string,
    adeltax: number,
    adeltay: number,
    anewPointName?: string
  ) {
    this.logBegin(this.#newPointByDelta.name,);
    this.logTrace(`${ainstructionId}`);
    const point = this._points.get(aoriginPointName);

    if (!point) {
      this.status = Rst.ApgRstErrors.NotFound(
        "",
        `Point origin named [%1] not found in set.`,
        [aoriginPointName]
      )
    }
    else {
      const x = point.x + adeltax;
      const y = point.y + adeltay;
      this.#newPoint(ainstructionId, x, y, anewPointName);
    }

    this.logEnd(this.status);
    return this.status;
  }


  /** Sets the current layer
   */
  #currentLayer(
    ainstructionId: number,
    alayerName: string
  ) {
    this.logBegin(this.#currentLayer.name);
    this.logTrace(`${ainstructionId}`);

    const layer: Svg.ApgSvgNode | undefined = this._cad.setCurrentLayer(alayerName);

    if (!layer) {
      this.status = Rst.ApgRstErrors.NotFound(
        "",
        `Layer [%1] not found `,
        [alayerName]
      )
    }

    this.logEnd(this.status);
    return this.status;
  }


  /** Creates a new group in the current layer ad sets it as the current one
   * @returns Error If the group name already exists
   */
  #newGroup(
    ainstructionId: number,
    agroupName: string,
    aoptions: IApgCadStyleOptions
  ) {

    this.logBegin(this.#newGroup.name);
    this.logTrace(`${ainstructionId}`);

    const group: Svg.ApgSvgNode | undefined = this._cad.getGroup(agroupName);

    if (group) {
      this.status = Rst.ApgRstErrors.AlreadyExists(
        "",
        `Group name [%1] already exists . Use setGroup instead.`,
        [agroupName]
      )
    }
    else {
      if (aoptions.strokeName) {
        this.#checkStrokeStyle(aoptions.strokeName);
      }
      if (this.status.Ok && aoptions.fillName) {
        this.#checkFillStyle(aoptions.fillName);
      }
      if (this.status.Ok) {
        this._cad.newGroup(agroupName, aoptions);
      }
    }

    this.logEnd(this.status);
    return this.status;
  }


  /** Sets the current group
   */
  #setGroup(
    ainstructionId: number,
    agroupName: string
  ) {
    this.logBegin(this.#setGroup.name);
    this.logTrace(`${ainstructionId}`);

    const group: Svg.ApgSvgNode | undefined = this._cad.setCurrentGroup(agroupName);

    if (!group) {
      this.status = Rst.ApgRstErrors.NotFound(
        "",
        `Group [%1] not found .`,
        [agroupName]
      )
    }

    this.logEnd(this.status);
    return this.status;
  }


  /** Draws a line between the given points
   */
  #drawLine(
    ainstructionId: number,
    apointsNames: string[],
    astrokeStyleName?: string
  ) {
    this.logBegin(this.#drawLine.name);
    this.logTrace(`${ainstructionId}`);

    const pts = this.#get2PointsByNames(apointsNames);

    if (this.status.Ok) {
      const currentGroup = (this._cad.currentGroup) ? this._cad.currentGroup : this._cad.currentLayer;
      const pf = <ApgCadSvgBasicShapesFactory>this._cad.getPrimitiveFactory(eApgCadSvgPrimitiveFactoryTypes.basicShapes)
      const e = pf.buildLine(pts[0], pts[1], currentGroup);
      e.fill('none');
      if (astrokeStyleName) {
        const strokeStyle = this.#checkStrokeStyle(astrokeStyleName);
        if (strokeStyle) {
          e.stroke(strokeStyle.color, strokeStyle.width);
        }
      }
    }

    this.logEnd();
    return this.status;
  }


  #get2PointsByNames(apointsNames: string[]) {

    let r: A2D.Apg2DPoint[] = [];

    if (apointsNames.length !== 2) {
      this.status = Rst.ApgRstErrors.NotValidParameters(
        "",
        `Wrong number of points: must be 2`)
    }
    else {
      const pts = this.#getPointsByNames(apointsNames);

      if (this.status.Ok) {
        if (pts.length !== 2) {
          this.status = Rst.ApgRstErrors.NotValidParameters(
            "",
            `Points are identical`,
          )
        }
        else {
          const jsonPt1 = JSON.stringify(pts[0]);
          const jsonPt2 = JSON.stringify(pts[1]);

          if (jsonPt1 === jsonPt2) {
            this.status = Rst.ApgRstErrors.AlreadyExists(
              "",
              `Points 1 and 2 are overlapped`,
            )
          }
          else {
            r = [...pts]
          }
        }
      }
    }
    return r;
  }


  #drawPolyLine(
    ainstructionId: number,
    apointsNames: string[],
    astrokeStyleName?: string
  ) {
    this.logBegin(this.#drawPolyLine.name);
    this.logTrace(`${ainstructionId}`);

    const pts = this.#getPointsByNames(apointsNames);

    if (this.status.Ok && pts.length > 2) {

      const pf = this._cad.getPrimitiveFactory(
        eApgCadSvgPrimitiveFactoryTypes.basicShapes
      ) as ApgCadSvgBasicShapesFactory;
      const e = pf.buildPolyLine(pts);
      e.fill('none');
      if (astrokeStyleName) {
        const strk = this.#checkStrokeStyle(astrokeStyleName);
        if (strk) {
          e.stroke(strk.color, strk.width);
        }
      }
    }

    this.logEnd();
    return this.status;
  }


  #getPointsByNames(apts: string[]) {

    this.logBegin(this.#getPointsByNames.name);
    const r: A2D.Apg2DPoint[] = []

    let prevPt: string;
    let first = true;
    apts.forEach(apt => {
      if (this.status.Ok) {
        const p = this._points.get(apt);
        if (!p) {
          this.status = Rst.ApgRstErrors.NotFound(
            "",
            `Point named [%1] not found: `,
            [apt]
          )
        }
        else {
          if (first) {
            first = false;
            r.push(p);
          }
          else {
            if (prevPt !== apt) {
              r.push(p);
            }
          }
          prevPt = apt;
        }
      }
    });

    this.logEnd(this.status);
    return r;
  }


  /** Draws a series of points
   */
  #drawPoints(
    ainstructionId: number,
    apointsNames: string[],
    aradious: number,
    astrokeStyleName?: string,
    afillStyleName?: string
  ) {
    this.logBegin(this.#drawPoints.name);
    this.logTrace(`${ainstructionId}`);

    const pts: A2D.Apg2DPoint[] = this.#getPointsByNames(apointsNames);

    if (this.status.Ok) {

      const fill = this.#checkFillStyle(afillStyleName);
      const strk = this.#checkStrokeStyle(astrokeStyleName);
      const pf = this._cad.getPrimitiveFactory(
        eApgCadSvgPrimitiveFactoryTypes.basicShapes
      ) as ApgCadSvgBasicShapesFactory;
      pts.forEach(pt => {
        const e = pf.buildDot(pt, aradious);
        if (strk) {
          e.stroke(strk.color, strk.width);
        }
        if (fill) {
          e.fill(fill.color);
        }
      });
    }

    this.logEnd(this.status);
    return this.status;
  }


  /** Draws all the points adding debbugging info (name / coordinates)
   */
  #drawAllpoints(
    ainstructionId: number,
    aradious: number,
    atextStyle: Svg.IApgSvgTextStyle
  ) {
    this.logBegin(this.#drawAllpoints.name);
    this.logTrace(`${ainstructionId}`);


    const pf = this._cad.getPrimitiveFactory(
      eApgCadSvgPrimitiveFactoryTypes.basicShapes
    ) as ApgCadSvgBasicShapesFactory;

    this._points.forEach((pt, name) => {
      const g = pf.buildPoint(pt, aradious, name, atextStyle);
    });

    this.logEnd();
    return this.status;
  }


  #drawRectanglePoints(
    ainstructionId: number,
    apointsNames: string[],
    astrokeStyleName?: string,
    afillStyleName?: string
  ) {
    this.logBegin(this.#drawRectanglePoints.name);
    this.logTrace(`${ainstructionId}`);

    const pts: A2D.Apg2DPoint[] = this.#get2PointsByNames(apointsNames);

    if (this.status.Ok) {

      const ppts: A2D.Apg2DPoint[] = [];
      ppts.push(new A2D.Apg2DPoint(pts[0].x, pts[0].y));
      ppts.push(new A2D.Apg2DPoint(pts[0].x, pts[1].y));
      ppts.push(new A2D.Apg2DPoint(pts[1].x, pts[1].y));
      ppts.push(new A2D.Apg2DPoint(pts[1].x, pts[0].y));

      const strk = this.#checkStrokeStyle(astrokeStyleName);
      const fill = this.#checkFillStyle(afillStyleName);

      const pf = this._cad.getPrimitiveFactory(
        eApgCadSvgPrimitiveFactoryTypes.basicShapes
      ) as ApgCadSvgBasicShapesFactory;
      const node = pf.buildClosedPolyLine(ppts);

      if (strk) {
        node.stroke(strk.color, strk.width);
      }
      if (fill) {
        node.fill(fill.color);
      }
    }
    this.logEnd();
    return this.status;
  }



  /** Draws a rectangle from an origin and sizes
   */
  #drawRectangleWH(
    ainstructionId: number,
    aorigin: string,
    ax: number,
    ay: number,
    astrk?: string,
    afill?: string
  ) {
    this.logBegin(this.#drawRectangleWH.name);
    this.logTrace(`${ainstructionId}`);

    const p = this._points.get(aorigin);
    if (!p) {
      this.status = Rst.ApgRstErrors.NotFound(
        "",
        `Point named [%1] not found: `,
        [aorigin]
      )
    }
    else {

      const ppts: A2D.Apg2DPoint[] = [];
      ppts.push(new A2D.Apg2DPoint(p.x, p.y));
      ppts.push(new A2D.Apg2DPoint(p.x + ax, p.y));
      ppts.push(new A2D.Apg2DPoint(p.x + ax, p.y + ay));
      ppts.push(new A2D.Apg2DPoint(p.x, p.y + ay));

      const strk = this.#checkStrokeStyle(astrk);
      const fill = this.#checkFillStyle(afill);

      const pf = this._cad.getPrimitiveFactory(
        eApgCadSvgPrimitiveFactoryTypes.basicShapes
      ) as ApgCadSvgBasicShapesFactory;
      const e = pf.buildClosedPolyLine(ppts);

      if (strk) {
        e.stroke(strk.color, strk.width);
      }
      if (fill) {
        e.fill(fill.color);
      }
    }
    this.logEnd(this.status);
    return this.status;
  }


  /** Draws a regular polygon from the given points
   */
  #drawClosedPolyline(
    ainstructionId: number,
    apts: string[],
    astrk?: string,
    afill?: string
  ) {

    this.logBegin(this.#drawClosedPolyline.name);
    this.logTrace(`${ainstructionId}`);

    const pts = this.#getPointsByNames(apts);

    if (pts.length < 3) {
      this.status = Rst.ApgRstErrors.NotValidParameters(
        "",
        `Not enough points [%1] for a closed polyline`,
        [pts.length.toString()]
      )
    }

    if (this.status.Ok) {

      const pf = this._cad.getPrimitiveFactory(
        eApgCadSvgPrimitiveFactoryTypes.basicShapes
      ) as ApgCadSvgBasicShapesFactory;

      const e = pf.buildClosedPolyLine(pts);

      const strk = this.#checkStrokeStyle(astrk);
      if (strk) {
        e.stroke(strk.color, strk.width);
      }

      const fill = this.#checkFillStyle(afill);
      if (fill) {
        e.fill(fill.color);
      }

    }
    this.logEnd(this.status);
    return this.status;
  }


  /** Draws a text at the given coords */
  #drawText(
    ainstructionId: number,
    atext: string[],
    aorigin: string,
    atextStyleName?: string
  ) {

    this.logBegin(this.#drawText.name);
    this.logTrace(`${ainstructionId}`);

    const pts = this.#getPointsByNames([aorigin]);

    if (pts.length < 1) {
      this.status = Rst.ApgRstErrors.NotFound(
        "",
        `Origin point [%1] for the text  not found`,
        [aorigin]
      )
    }

    if (this.status.Ok) {
      const zero = new A2D.Apg2DPoint(0, 0);
      pts.push(zero);

      if (this.status.Ok) {
        const pf = this._cad.getPrimitiveFactory(
          eApgCadSvgPrimitiveFactoryTypes.annotations
        ) as ApgCadSvgAnnotationsFactory;
        const g = pf.build(pts[0], pts[1], atext[0]);
        const textStyle = this.#checkTextStyle(atextStyleName);
        if (textStyle) {
          g?.textStyle(textStyle);
        }
      }

    }
    this.logEnd(this.status);
    return this.status;
  }


  /** Draws the name of the Drawing
*/
  #drawTitle(
    ainstructionId: number,
    ax: number,
    ay: number
  ) {

    this.logBegin(this.#drawTitle.name);
    this.logTrace(`${ainstructionId}`);

    const origin = new A2D.Apg2DPoint(ax, ay);
    const zero = new A2D.Apg2DPoint(0, 0);

    if (this.status.Ok) {
      const pf = this._cad.getPrimitiveFactory(
        eApgCadSvgPrimitiveFactoryTypes.annotations
      ) as ApgCadSvgAnnotationsFactory;
      // TODO this is a mess better to draw text without Annotations factory -- APG
      const g = pf.build(origin, zero, this.name);
      const textStyle = this.#checkTextStyle(eApgCadDftTextStyles.TITLE);
      if (textStyle) {
        g?.textStyle(textStyle);
      }
    }

    this.logEnd();
    return this.status;
  }


  /** Draws an annotation from the given data
   */
  #drawAnnotation(
    ainstructionId: number,
    apointsNames: string[],
    atext: string[],
    aangle = 0
  ) {

    this.logBegin(this.#drawAnnotation.name);
    this.logTrace(`${ainstructionId}`);

    const pts = this.#get2PointsByNames(apointsNames);

    if (this.status.Ok) {
      const pf = this._cad.getPrimitiveFactory(
        eApgCadSvgPrimitiveFactoryTypes.annotations
      ) as ApgCadSvgAnnotationsFactory;

      const disp = new A2D.Apg2DPoint(pts[1].x - pts[0].x, pts[1].y - pts[0].y);

      const _g = pf.build(pts[0], disp, atext[0], aangle);
    }
    this.logEnd();
    return this.status;
  }



  /** Draws an annotation from the given data
   */
  #drawLinearDim(
    ainstructionId: number,
    apointsNames: string[],
    adisplacement: number,
    atext: string[]
  ) {
    this.logBegin(this.#drawLinearDim.name);
    this.logTrace(`${ainstructionId}`);

    const pts = this.#get2PointsByNames(apointsNames);

    if (this.status.Ok) {

      const pf = this._cad.getPrimitiveFactory(
        eApgCadSvgPrimitiveFactoryTypes.linearDimensions
      ) as ApgCadSvgLinearDimensionsFactory;
      pf.build(eApgCadLinearDimensionTypes.Aligned, pts[0], pts[1], adisplacement, atext[0], atext[1]); // <=(X)

    }
    this.logEnd();
    return this.status;
  }


  /** Parses the instructions set and builds the SVG drawing
   */
  build(asettingsOnly = false): { svg: string, data: any } {

    this.logBegin(this.build.name);

    /** Current Instruction Index */
    let lcii = 0;

    this.instructions.forEach((ainstruction: IApgCadInstruction) => {
      if (this.status.Ok) {
        switch (ainstruction.type) {
          case eApgCadInstructionTypes.SET_NAME: {
            this.#setName(lcii, ainstruction.name!); // 2018/12/02 *
            break;
          }
          case eApgCadInstructionTypes.SET_VIEWBOX: {
            this.#setViewBox(lcii, ainstruction.payload!); // 2018/12/02 *
            break;
          }
          case eApgCadInstructionTypes.SET_AXIS: {
            this.#setAxis(lcii, ainstruction.payload!); // 2018/12/08 *
            break;
          }
          case eApgCadInstructionTypes.SET_BACKGROUND: {
            this.#setBackground(lcii, ainstruction.payload!); // 2018/12/08 *
            break;
          }
          case eApgCadInstructionTypes.NEW_POINT: {
            this.#newPoint(lcii, ainstruction.x!, ainstruction.y!, ainstruction.name); // 2017/11/25 *
            break;
          }
          case eApgCadInstructionTypes.NEW_POINT_DELTA: {
            this.#newPointByDelta(lcii, ainstruction.origin!, ainstruction.x!, ainstruction.y!, ainstruction.name); // 2017/11/25 *
            break;
          }
          case eApgCadInstructionTypes.NEW_STROKE_STYLE: {
            this._cad.newStrokeStyle(ainstruction.name!, ainstruction.payload!);
            break;
          }
          case eApgCadInstructionTypes.NEW_FILL_STYLE: {
            this._cad.newFillStyle(ainstruction.name!, ainstruction.payload!);
            break;
          }
          case eApgCadInstructionTypes.SET_LAYER: {
            this.#currentLayer(lcii, ainstruction.name!); // 2017/11/26
            break;
          }
          case eApgCadInstructionTypes.NEW_GROUP: {
            const options: IApgCadStyleOptions = { strokeName: ainstruction.stroke, fillName: ainstruction.fill }
            this.#newGroup(lcii, ainstruction.name!, options); // 2017/11/26
            break;
          }
          case eApgCadInstructionTypes.SET_GROUP: {
            this.#setGroup(lcii, ainstruction.name!); // 2017/11/26
            break;
          }
          case eApgCadInstructionTypes.DRAW_POINTS: {
            if (!asettingsOnly) {
              this.#drawPoints(lcii, ainstruction.points!, ainstruction.radious!, <string>ainstruction.stroke, <string>ainstruction.fill); // 2017/11/26 *
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_ALL_POINTS: {
            if (!asettingsOnly) {
              const textStyle = this.#checkTextStyle(eApgCadDftTextStyles.MONO)
              this.#drawAllpoints(lcii, ainstruction.radious!, textStyle!); // 2017/11/26 *
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_LINE: {
            if (!asettingsOnly) {
              this.#drawLine(lcii, ainstruction.points!, <string>ainstruction.stroke); // 2017/11/26 *
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_POLYLINE: {
            if (!asettingsOnly) {
              this.#drawPolyLine(lcii, ainstruction.points!, <string>ainstruction.stroke); // 2017/11/25 *
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_RECTANGLE_POINTS: {
            if (!asettingsOnly) {
              this.#drawRectanglePoints(lcii, ainstruction.points!, <string>ainstruction.stroke, <string>ainstruction.fill); // 2018/12/08 *
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_RECTANGLE_SIZE: {
            if (!asettingsOnly) {
              this.#drawRectangleWH(lcii, ainstruction.origin!, ainstruction.x!, ainstruction.y!, <string>ainstruction.stroke, <string>ainstruction.fill); // 2018/12/08 *
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_POLYGON: {
            if (!asettingsOnly) {
              this.#drawClosedPolyline(lcii, ainstruction.points!, <string>ainstruction.stroke, <string>ainstruction.fill); // 2018/12/08 *
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_TEXT: {
            if (!asettingsOnly) {
              this.#drawText(lcii, ainstruction.text!, ainstruction.origin!, <string>ainstruction.font);
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_NAME: {
            if (!asettingsOnly) {
              this.#drawTitle(lcii, ainstruction.x!, ainstruction.y!);
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_ANNOTATION: {
            if (!asettingsOnly) {
              this.#drawAnnotation(lcii, ainstruction.points!, ainstruction.text!, ainstruction.angle);
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_LIN_DIM: {
            if (!asettingsOnly) {
              this.#drawLinearDim(lcii, ainstruction.points!, ainstruction.radious!, ainstruction.text!);
            }
          }

        }
      }
      lcii++;
    }, this);

    this.logEnd();

    const r: any = {};
    r.svg = this._cad.svg.render();
    r.data = this.#getData();
    return r;
  }


  /** Builds the instructions set but only for getting back the svg object settings */
  getSvgData(): any {
    this.logBegin(this.getSvgData.name);

    const r: any = this.build(true).data;

    this.logEnd();

    return r;
  }

  #getData() {
    const r: any = {};
    r.settings = this._cad.settings;
    r.points = Uts.ApgUtsMap.ToArray(this._points);
    r.fonts = Uts.ApgUtsMap.ToArray(this._cad.textStyles);
    r.layers = Uts.ApgUtsMap.ToArray(this._cad.layers);
    r.groups = Uts.ApgUtsMap.ToArray(this._cad.groupsDefs);
    r.strokes = Uts.ApgUtsMap.ToArray(this._cad.strokeStyles);
    r.fills = Uts.ApgUtsMap.ToArray(this._cad.fillStyles);
    r.gradients = Uts.ApgUtsMap.ToArray(this._cad.gradients);
    r.patterns = this._cad.patternsDefs;
    return r;
  }

  #checkStrokeStyle(astrokeStyleName?: string) {
    let r: Svg.IApgSvgStrokeStyle | undefined = undefined;
    if (astrokeStyleName) {
      r = this._cad.getStrokeStyle(astrokeStyleName);
      if (r === undefined) {
        this.status = Rst.ApgRstErrors.NotFound(
          "",
          `Stroke style [%1] not found`,
          [astrokeStyleName]
        )
      }
    }
    return r;
  }

  #checkFillStyle(afillStyleName?: string) {
    let r: Svg.IApgSvgFillStyle | undefined = undefined;
    if (afillStyleName !== undefined) {
      r = this._cad.getFillStyle(afillStyleName);
      if (r === undefined) {
        this.status = Rst.ApgRstErrors.NotFound(
          "",
          `Fill style [%1] not found`,
          [afillStyleName]
        )
      }
    }
    return r;
  }

  #checkTextStyle(atextStyleName?: string) {
    let r: Svg.IApgSvgTextStyle | undefined = undefined;
    if (atextStyleName !== undefined) {
      r = this._cad.getTextStyle(atextStyleName);
      if (r === undefined) {
        this.status = Rst.ApgRstErrors.NotFound(
          "",
          `Text style [%1] not found`,
          [atextStyleName]
        )
      }
    }
    return r;
  }

}
