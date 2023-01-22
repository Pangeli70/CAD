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
 * @version 0.9.4 [APG 2023/01/07] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */

import { A2D, Lgr, Rst, Svg, Uts, Jsv } from "../../deps.ts";

import { ApgCadInsValidators } from "../data/ApgCadInsValidators.ts";
import { eApgCadInstructionTypes } from "../enums/eApgCadInstructionTypes.ts";
import { eApgCadDftTextStyles } from "../enums/eApgCadDftTextStyles.ts";
import { eApgCadPrimitiveFactoryTypes } from "../enums/eApgCadPrimitiveFactoryTypes.ts";
import { eApgCadLinearDimensionTypes } from "../enums/eApgCadLinearDimensionTypes.ts";
import { IApgCadStyleOptions } from "../interfaces/IApgCadStyleOptions.ts";
import { IApgCadInstruction } from "../interfaces/IApgCadInstruction.ts";
import { IApgCadSvgCartesians } from "../interfaces/IApgCadSvgCartesians.ts";
import { IApgCadSvgGround } from "../interfaces/IApgCadSvgGround.ts";
import { IApgCadSvgViewBox } from "../interfaces/IApgCadSvgViewBox.ts";
import { ApgCadSvgAnnotationsFactory } from "./factories/ApgCadSvgAnnotationsFactory.ts";
import { ApgCadSvgBasicShapesFactory } from "./factories/ApgCadSvgBasicShapesFactory.ts";
import { ApgCadSvgLinearDimensionsFactory } from "./factories/ApgCadSvgLinearDimensionsFactory.ts";
import { ApgCadSvg } from "./ApgCadSvg.ts";
import { eApgCadArcDimensionTypes } from "../enums/eApgCadArcDimensionTypes.ts";
import { ApgCadSvgArcDimensionsFactory } from "./factories/ApgCadSvgArcDimensionsFactory.ts";


/** Apg Svg Instruction set Manager
 */
export class ApgCadInstructionsSet extends Lgr.ApgLgrLoggable {

  /** Apg Cad Set Name*/
  private _name: string;

  /** Apg Cad Svg Instance*/
  private _cad: ApgCadSvg;

  /** Set of the points defined in the drawing */
  private _points: Map<string, A2D.Apg2DPoint> = new Map<string, A2D.Apg2DPoint>();

  /** Index for auto numbering of ids */
  private _currId = 0;

  /** Index for auto labelling of the points */
  private _lastPointIndex = 0;

  /** Set of instructions */
  private _instructions: IApgCadInstruction[] = [];

  /** All the validators for the various instruction types */
  private _validators: Map<eApgCadInstructionTypes, Jsv.ApgJsvAjvValidator> = new Map();

  /** The Object is correctly initialized */
  private _ready = false;

  /** Stack of layers */
  private _layersStack: Svg.ApgSvgNode[] = [];

  /** The general status of the object */
  private _status: Rst.ApgRst;
  get Status() { return this._status; }

  constructor(alogger: Lgr.ApgLgr, acad: ApgCadSvg, ainstructions?: IApgCadInstruction[]) {

    super('ApgCadInstructionsSet', alogger);
    this.logBegin('constructor');

    this._cad = acad;
    this._name = 'Undefined';

    this._status = this.#getValidators();

    if (this._status.Ok) {
      this._ready = true;
      if (ainstructions) {
        this.#validateAndSet(ainstructions);
      }
      else {
        this._instructions = [];
      }
    }

    this.logEnd(this._status);
  }


  // #region Instuctions loading -----------------------------------------------

  public async load(adataPath: string) {

    if (this._ready) {
      this.logBegin(this.load.name);

      const jsonData = await Uts.ApgUtsJsonFile.Read(adataPath);
      const instructions = <IApgCadInstruction[]>jsonData;

      this._status = this.#validateAndSet(instructions);

      if (this._status.Ok) {
        this._instructions = instructions;
      }

      this.logEnd(this._status);

    }
    return this._status;
  }

  // #endregion


  // #region Instuctions validation --------------------------------------------

  #getValidators() {

    this.logBegin(this.#getValidators.name);
    let r = new Rst.ApgRst();

    const validatorService = new Jsv.ApgJsvService(this._logger);

    ApgCadInsValidators.forEach(element => {
      if (r.Ok && element.jsonSchema) {
        const deps = element.dependencies ? element.dependencies : [];
        r = validatorService.addValidator(element.jsonSchema, deps);
        if (r.Ok) {
          const validatorName = element.jsonSchema.$id.replaceAll("#", "");
          const validator = validatorService.getValidator(validatorName);
          this._validators.set(element.type, validator!);
        }
      }
    });

    this.logEnd(r);
    return r;
  }

  #validateAndSet(ainstructions: IApgCadInstruction[]) {

    if (this._ready) {
      this.logBegin(this.#validateAndSet.name);

      this._status = this.#validateInstructions(ainstructions);

      if (this._status.Ok) {
        this._instructions = ainstructions;
      }

      this.logEnd(this._status);
    }
    return this._status;

  }

  #validateInstructions(instructions: IApgCadInstruction[]) {

    let r = this._status;

    if (r.Ok) {
      r = this.#validateInstructionsWithAjv(instructions);
      if (r.Ok) {
        r = this.#checkFirstInstruction(instructions);
      }
    }
    return r;
  }

  #validateInstructionsWithAjv(instructions: IApgCadInstruction[]) {

    let r = this._status;

    if (r.Ok) {

      const genVal = this._validators.get(eApgCadInstructionTypes.GENERIC);

      if (!genVal) {
        r = Rst.ApgRstErrors.NotFound("", "Validator [%1] Not found", [eApgCadInstructionTypes.GENERIC]);
      }
      else {
        instructions.forEach(instruction => {

          if (r.Ok) {

            r = genVal!.validate(instruction);

            if (r.Ok) {

              const instVal = this._validators.get(instruction.type);

              if (!instVal) {
                r = Rst.ApgRstErrors.NotFound("", "Validator [%1] Not found", [instruction.type]);
              }
              else {
                r = instVal!.validate(instruction);
                debugger;
              }
            }
          }
        });
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

  // #endregion


  // #region Drawing setup -----------------------------------------------------

  setName_(
    aname: string
  ) {
    let r = new Rst.ApgRst();

    if (this._currId === 0) {
      this._name = aname;
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

  setViewBox_(
    aviewBox: IApgCadSvgViewBox
  ) {
    this.logBegin(this.setViewBox_.name);
    this.logTrace(`${this._currId++}`);

    if (this._currId === 1) {
      this._cad.setViewBox(aviewBox);
    }
    else {
      this._status = Rst.ApgRstErrors.Managed(
        "",
        "If present [%1] must be the second instruction immediately after [%2]",
        [eApgCadInstructionTypes.SET_VIEWBOX, eApgCadInstructionTypes.SET_NAME]
      );
    }

    this.logEnd(this._status);
  }

  setCartesian_(
    acartesianParams: IApgCadSvgCartesians
  ) {
    this.logBegin(this.setCartesian_.name);
    this.logTrace(`${this._currId++}`);

    const prevType = this._instructions[this._currId - 1].type;
    if (
      (prevType === eApgCadInstructionTypes.SET_NAME) ||
      (prevType === eApgCadInstructionTypes.SET_VIEWBOX) ||
      (prevType === eApgCadInstructionTypes.SET_BACKGROUND)
    ) {
      this._cad.setCartesian(acartesianParams);
    }
    else {
      this._status = Rst.ApgRstErrors.Managed(
        "",
        "If present [%1] must follow [%2], [%3] or [%4]",
        [eApgCadInstructionTypes.SET_CARTESIAN, eApgCadInstructionTypes.SET_NAME, eApgCadInstructionTypes.SET_VIEWBOX, eApgCadInstructionTypes.SET_BACKGROUND]
      );
    }

    this.logEnd(this._status);
  }

  setBackground_(
    abckg: IApgCadSvgGround
  ) {
    this.logBegin(this.setBackground_.name);
    this.logTrace(`${this._currId++}`);

    const prevType = this._instructions[this._currId - 1].type;
    if (
      (prevType === eApgCadInstructionTypes.SET_NAME) ||
      (prevType === eApgCadInstructionTypes.SET_VIEWBOX)
    ) {
      this._cad.setBackground(abckg);
    }
    else {
      this._status = Rst.ApgRstErrors.Managed(
        "",
        "If present [%1] must follow [%2], or [%3]",
        [eApgCadInstructionTypes.SET_BACKGROUND, eApgCadInstructionTypes.SET_NAME, eApgCadInstructionTypes.SET_VIEWBOX]
      );
    }

    this.logEnd(this._status);
  }

  //#endregion


  // #region Layers and groups -------------------------------------------------

  /** Sets the current layer by name and puts it on the stack. Layer must already exist */
  pushLayer_(
    alayerName: string
  ) {
    this.logBegin(this.pushLayer_.name);
    this.logTrace(`${this._currId++}`);

    const layer: Svg.ApgSvgNode | undefined = this._cad.setCurrentLayer(alayerName);

    if (!layer) {
      this._status = Rst.ApgRstErrors.NotFound(
        "",
        `Layer [%1] not found `,
        [alayerName]
      )
    }
    else {
      this._layersStack.push(layer);
    }

    this.logEnd(this._status);
    return this._status;
  }


  /** Removes the layer from the stack and restores the previous one. Stack must not be empty */
  popLayer_() {
    this.logBegin(this.popLayer_.name);
    this.logTrace(`${this._currId++}`);

    const layer = this._layersStack.pop();

    if (!layer) {
      this._status = Rst.ApgRstErrors.NotFound(
        "",
        `There aren't any layer on the layer stack. There are POP_LAYER mismatches.`,
        []
      )
    }
    else if (this._layersStack.length < 1) {
      this._status = Rst.ApgRstErrors.NotValidParameters(
        "",
        `Pop operation has emptied the layer Stack. There is a POP_LAYER mismatch.`,
        []
      )
    }
    else {
      const layerName = this._layersStack[this._layersStack.length - 1].ID;
      this._cad.setCurrentLayer(layerName);
    }

    this.logEnd(this._status);
    return this._status;
  }


  /** Creates a new group in the current layer ad sets it as the current one
   * @returns Error If the group name already exists */
  newGroup_(
    ainstruction: IApgCadInstruction
  ) {

    this.logBegin(this.newGroup_.name);
    this.logTrace(`${this._currId++}`);

    const group: Svg.ApgSvgNode | undefined = this._cad.getGroup(ainstruction.name!);

    if (group) {
      this._status = Rst.ApgRstErrors.AlreadyExists(
        "",
        `Group name [%1] already exists . Use SetGroup instead.`,
        [ainstruction.name!]
      )
    }
    else {
      const options: IApgCadStyleOptions = {};
      if (ainstruction.strokeStyle) {
        this.#checkStrokeStyle(ainstruction.strokeStyle);
      }
      if (this._status.Ok && ainstruction.fillStyle) {
        this.#checkFillStyle(ainstruction.fillStyle);
      }
      if (this._status.Ok && ainstruction.textStyle) {
        this.#checkTextStyle(ainstruction.textStyle);
      }
      if (this._status.Ok) {
        this._cad.newGroup(ainstruction.name!, options);
      }
    }

    this.logEnd(this._status);
    return this._status;
  }

  /** Relinks the drawing instructions to the already created and named group.  */
  setGroup_(
    agroupName: string
  ) {
    this.logBegin(this.setGroup_.name);
    this.logTrace(`${this._currId++}`);

    const group: Svg.ApgSvgNode | undefined = this._cad.setCurrentGroup(agroupName);

    if (!group) {
      this._status = Rst.ApgRstErrors.NotFound(
        "",
        `Group [%1] not found .`,
        [agroupName]
      )
    }

    this.logEnd(this._status);
    return this._status;
  }

  /** After this call the drawing instructions will bond to the current layer */
  noGroup_(
  ) {
    this.logBegin(this.noGroup_.name);
    this.logTrace(`${this._currId++}`);

    this._cad.unSetCurrentGroup();

    this.logEnd(this._status);
    return this._status;
  }

  //#endregion


  // #region Points management --------------------------------------------------

  /** Adds a point to the points set. */
  newPoint_(ainstruction: IApgCadInstruction) {

    this.logBegin(this.newPoint_.name);

    if (ainstruction.name) {
      const pointExists = this._points.get(ainstruction.name);
      if (pointExists) {
        this._status = Rst.ApgRstErrors.AlreadyExists(
          "",
          `Point named [%1] already exists`,
          [ainstruction.name]
        )
      }
    }
    if (this._status.Ok) {
      const newPoint = new A2D.Apg2DPoint(ainstruction.x!, ainstruction.y!);
      this._lastPointIndex++;
      let pointName;
      if (!ainstruction.name) {
        pointName = 'P#' + this._lastPointIndex;
      }
      else {
        pointName = ainstruction.name;
      }
      this._points.set(pointName, newPoint);
      this.#traceMethod("NewPoint", ainstruction.name);
    }
    this.logEnd(this._status);
  }


  /** Adds a point to the points set, by setting a distance from another point. */
  newPointByDelta_(ainstruction: IApgCadInstruction) {

    this.logBegin(this.newPointByDelta_.name,);

    const point = this._points.get(ainstruction.origin!);

    if (!point) {
      this._status = Rst.ApgRstErrors.NotFound(
        "",
        `Point origin named [%1] not found in set.`,
        [ainstruction.origin!]
      )
    }
    else {
      const x = point.x + ainstruction.w!;
      const y = point.y + ainstruction.h!;
      const newPoint = new A2D.Apg2DPoint(x, y);

      this._lastPointIndex++;
      const pointName = ainstruction.name || 'P#' + this._lastPointIndex;

      this._points.set(pointName, newPoint);
      this.#traceMethod("NewPointByDelta", pointName);
    }

    this.logEnd(this._status);
    return this._status;
  }


  //#endregion


  // #region Utility methods ---------------------------------------------------

  /** 
   * Adds the specified node to the current group if set or to the current layer
   */
  #setParent(anode: Svg.ApgSvgNode) {

    const currentParent = (this._cad.currentGroup) ? this._cad.currentGroup : this._cad.currentLayer;
    anode.childOf(currentParent);

  }

  #get2PointsByNames(apoints: string[]) {

    let r: A2D.Apg2DPoint[] = [];

    if (apoints.length !== 2) {
      this._status = Rst.ApgRstErrors.NotValidParameters(
        "",
        `Wrong number of points: must be 2`)
    }
    else {
      const pts = this.#getPointsByNames(apoints!);

      if (this._status.Ok) {
        if (pts.length !== 2) {
          this._status = Rst.ApgRstErrors.NotValidParameters(
            "",
            `Points are identical`,
          )
        }
        else {
          const jsonPt1 = JSON.stringify(pts[0]);
          const jsonPt2 = JSON.stringify(pts[1]);

          if (jsonPt1 === jsonPt2) {
            this._status = Rst.ApgRstErrors.AlreadyExists(
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

  #getPointsByNames(apts: string[]) {

    this.logBegin(this.#getPointsByNames.name);
    const r: A2D.Apg2DPoint[] = []

    let prevPt: string;
    let first = true;
    apts.forEach(apt => {
      if (this._status.Ok) {
        const p = this._points.get(apt);
        if (!p) {
          this._status = Rst.ApgRstErrors.NotFound(
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

    this.logEnd(this._status);
    return r;
  }

  #trySetRotation(
    node: Svg.ApgSvgNode,
    afirstPoint: A2D.Apg2DPoint,
    aangle?: number,
    apivot?: string,
  ) {
    if (aangle) {
      const pivot = A2D.Apg2DPoint.Clone(afirstPoint);
      if (apivot) {
        const newPivot = this.#getPointsByNames([apivot]);
        if (newPivot.length > 0) {
          pivot.copyFrom(newPivot[0]);
        }
      }
      node.rotate(aangle, pivot.x, pivot.y);
    }
  }

  #trySetFillStyle(node: Svg.ApgSvgNode, afillStyleName?: string) {
    if (afillStyleName) {
      const fill = this.#checkFillStyle(afillStyleName);
      if (fill) {
        node.fill(fill.color, fill.opacity);
      }
    }
  }

  #trySetStrokeStyle(node: Svg.ApgSvgNode, astrokeStyleName?: string) {
    if (astrokeStyleName) {
      const strk = this.#checkStrokeStyle(astrokeStyleName);
      if (strk) {
        node.stroke(strk.color, strk.width);
        if (strk.dashPattern) {
          node.strokeDashPattern(strk.dashPattern, strk.dashOffset)
        }
      }
    }
  }

  #trySetTextStyle(node: Svg.ApgSvgNode, atextStyleName?: string) {
    if (atextStyleName) {
      const textStyle = this.#checkTextStyle(atextStyleName);
      if (textStyle) {
        node.textStyle(textStyle);
      }
    }
  }

  #checkClosedPolygonPoints(apts: A2D.Apg2DPoint[]) {
    const lastI = apts.length - 1;
    if (apts[0].x != apts[lastI].x || apts[0].y != apts[lastI].y) {
      apts.push(apts[0]);
    }
  }

  #checkStrokeStyle(astrokeStyleName?: string) {
    let r: Svg.IApgSvgStrokeStyle | undefined = undefined;
    if (astrokeStyleName) {
      r = this._cad.getStrokeStyle(astrokeStyleName);
      if (r === undefined) {
        this._status = Rst.ApgRstErrors.NotFound(
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
        this._status = Rst.ApgRstErrors.NotFound(
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
        this._status = Rst.ApgRstErrors.NotFound(
          "",
          `Text style [%1] not found`,
          [atextStyleName]
        )
      }
    }
    return r;
  }

  #getBasicShapesFactory() {
    const factory = this._cad.getPrimitiveFactory(
      eApgCadPrimitiveFactoryTypes.BASIC_SHAPES
    ) as ApgCadSvgBasicShapesFactory;
    return factory;
  }

  #traceMethod(amethod: string, aname?: string) {
    if (!aname) {
      aname = `${amethod}${this._currId++}`;
    }
    this.logTrace(aname);
    return aname;
  }

  //#endregion


  // #region Drawing routines --------------------------------------------------

  /** Draws a series of points */
  drawPoints_(ainstruction: IApgCadInstruction) {

    this.logBegin(this.drawPoints_.name);
    this.#traceMethod("DrawPoints", ainstruction.name);

    const pts: A2D.Apg2DPoint[] = this.#getPointsByNames(ainstruction.points!);

    if (this._status.Ok) {

      const factory = this.#getBasicShapesFactory();

      pts.forEach(pt => {
        const node = factory
          .buildDot(pt, ainstruction.radious!)

        this.#trySetStrokeStyle(node, ainstruction.strokeStyle,);

        this.#trySetFillStyle(node, ainstruction.fillStyle);

        this.#setParent(node);
      });
    }

    this.logEnd(this._status);
    return this._status;
  }


  /** Draws all the points adding debbugging info (name / coordinates) */
  drawAllPointsWithInfo_(ainstruction: IApgCadInstruction) {

    this.logBegin(this.drawAllPointsWithInfo_.name);
    this.#traceMethod("DrawAllPoints");

    let textStyle = this.#checkTextStyle(ainstruction.textStyle!)
    if (!textStyle) {
      textStyle = this.#checkTextStyle(eApgCadDftTextStyles.MONO);
    }

    if (this._status.Ok) {
      const factory = this.#getBasicShapesFactory();

      this._points.forEach((pt, name) => {
        const node = factory
          .buildPoint(pt, ainstruction.radious!, name, textStyle!);

        this.#setParent(node);
      });
    }

    this.logEnd();
    return this._status;
  }

  /** Draws a line between the given points */
  drawLine_(ainstruction: IApgCadInstruction) {

    this.logBegin(this.drawLine_.name);
    this.#traceMethod('DrawLine', ainstruction.name);

    const pts = this.#get2PointsByNames(ainstruction.points!);

    if (this._status.Ok) {

      const factory = this.#getBasicShapesFactory();

      const node = factory
        .buildLine(pts[0], pts[1])
        .fill('none');

      this.#trySetStrokeStyle(node, ainstruction.strokeStyle,);

      this.#setParent(node);
    }

    this.logEnd();
    return this._status;
  }

  /** Draws an open polyline */
  #drawPolyLine(ainstruction: IApgCadInstruction) {


    this.logBegin(this.#drawPolyLine.name);
    this.#traceMethod("DrawPolyLine", ainstruction.name);

    const pts = this.#getPointsByNames(ainstruction.points!);

    if (this._status.Ok && pts.length > 2) {

      const factory = this.#getBasicShapesFactory();

      const node = factory
        .buildPolyLine(pts)
        .fill('none');

      this.#trySetRotation(node, pts[0], ainstruction.angle!, ainstruction.pivot!);

      this.#trySetStrokeStyle(node, ainstruction.strokeStyle,);

      this.#setParent(node);
    }

    this.logEnd();
    return this._status;
  }

  /**  */
  #drawRectangleByPoints(ainstruction: IApgCadInstruction) {

    this.logBegin(this.#drawRectangleByPoints.name);
    this.#traceMethod("DrawRectByPoints", ainstruction.name);

    const pts: A2D.Apg2DPoint[] = this.#get2PointsByNames(ainstruction.points!);

    if (this._status.Ok) {

      const ppts: A2D.Apg2DPoint[] = [];
      ppts.push(new A2D.Apg2DPoint(pts[0].x, pts[0].y));
      ppts.push(new A2D.Apg2DPoint(pts[0].x, pts[1].y));
      ppts.push(new A2D.Apg2DPoint(pts[1].x, pts[1].y));
      ppts.push(new A2D.Apg2DPoint(pts[1].x, pts[0].y));
      ppts.push(new A2D.Apg2DPoint(pts[0].x, pts[0].y));

      const factory = this.#getBasicShapesFactory();

      const node = factory.
        buildPolyLine(ppts, true);

      this.#trySetRotation(node, ppts[0], ainstruction.angle, ainstruction.pivot!);

      this.#trySetStrokeStyle(node, ainstruction.strokeStyle,);

      this.#trySetFillStyle(node, ainstruction.fillStyle);

      this.#setParent(node);

    }
    this.logEnd();
    return this._status;
  }

  /** Draws a rectangle from an origin and sizes */
  #drawRectangleBySizes(ainstruction: IApgCadInstruction) {

    this.logBegin(this.#drawRectangleBySizes.name);
    this.#traceMethod("DrawRectBySizes", ainstruction.name);

    const p = this._points.get(ainstruction.origin!);
    if (!p) {
      this._status = Rst.ApgRstErrors.NotFound(
        "",
        `Point named [%1] not found: `,
        [ainstruction.origin!]
      )
    }
    else {

      const ppts: A2D.Apg2DPoint[] = [];
      ppts.push(new A2D.Apg2DPoint(p.x, p.y));
      ppts.push(new A2D.Apg2DPoint(p.x + ainstruction.w!, p.y));
      ppts.push(new A2D.Apg2DPoint(p.x + ainstruction.w!, p.y + ainstruction.h!));
      ppts.push(new A2D.Apg2DPoint(p.x, p.y + ainstruction.h!));
      ppts.push(new A2D.Apg2DPoint(p.x, p.y));

      const factory = this.#getBasicShapesFactory();

      const node = factory.
        buildPolyLine(ppts, true)

      this.#trySetRotation(node, ppts[0], ainstruction.angle, ainstruction.pivot!);

      this.#trySetStrokeStyle(node, ainstruction.strokeStyle,);

      this.#trySetFillStyle(node, ainstruction.fillStyle);

      this.#setParent(node);
    }
    this.logEnd(this._status);
    return this._status;
  }

  /** Draws a closed polyline or any polygon from the given points */
  drawPolygon_(ainstruction: IApgCadInstruction) {


    this.logBegin(this.drawPolygon_.name);
    this.#traceMethod("DrawPolygon", ainstruction.name);

    const pts = this.#getPointsByNames(ainstruction.points!);

    if (pts.length < 3) {
      this._status = Rst.ApgRstErrors.NotValidParameters(
        "",
        `Not enough points [%1] for a polygon`,
        [pts.length.toString()]
      )
    }
    this.#checkClosedPolygonPoints(pts);

    if (this._status.Ok) {

      const factory = this.#getBasicShapesFactory()

      const node = factory
        .buildPolyLine(pts, true)

      this.#trySetRotation(node, pts[0], ainstruction.angle, ainstruction.pivot!);

      this.#trySetStrokeStyle(node, ainstruction.strokeStyle,);

      this.#trySetFillStyle(node, ainstruction.fillStyle);

      this.#setParent(node);

    }
    this.logEnd(this._status);
    return this._status;
  }

  /** Draws a regular polygon from the given origin, radious and number of sides */
  drawRegularPolygon_(ainstruction: IApgCadInstruction) {

    this.logBegin(this.drawRegularPolygon_.name);
    this.#traceMethod("DrawRegPolygon", ainstruction.name);

    const pts = this.#getPointsByNames([ainstruction.origin!]);

    if (this._status.Ok) {

      const factory = this.#getBasicShapesFactory();

      const node = factory
        .buildPolygon(pts[0], ainstruction.radious!, ainstruction.n!, 0)

      this.#trySetRotation(node, pts[0], ainstruction.angle, ainstruction.pivot);

      this.#trySetStrokeStyle(node, ainstruction.strokeStyle);

      this.#trySetFillStyle(node, ainstruction.fillStyle);

      this.#setParent(node);

    }
    this.logEnd(this._status);
    return this._status;
  }

  /** Draws a circle given center and radious  */
  drawCircle_(ainstruction: IApgCadInstruction) {

    this.logBegin(this.drawCircle_.name);
    this.#traceMethod("DrawCircle", ainstruction.name);

    const pts = this.#getPointsByNames([ainstruction.origin!]);

    if (this._status.Ok) {

      const factory = this.#getBasicShapesFactory();

      const node = factory
        .buildCircle(pts[0], ainstruction.radious!)
        .fill('none');

      this.#trySetStrokeStyle(node, ainstruction.strokeStyle);

      this.#setParent(node);
    }

    this.logEnd();
    return this._status;
  }

  /** Draws an arc given center the radious the beggining and the end */
  drawArc_(ainstruction: IApgCadInstruction) {

    this.logBegin(this.drawArc_.name);
    this.#traceMethod("DrawArc", ainstruction.name);

    const pts = this.#getPointsByNames(ainstruction.points!);

    if (this._status.Ok) {

      const factory = this.#getBasicShapesFactory();

      const node = factory
        .buildArc(pts[0], pts[1], ainstruction.angle!)
        .fill('none');

      this.#trySetStrokeStyle(node, ainstruction.strokeStyle);

      this.#setParent(node);
    }

    this.logEnd();
    return this._status;
  }



  /** Draws a text at the given coords */
  #drawText(
    atext: string[],
    aorigin: string,
    atextStyleName?: string,
  ) {

    this.logBegin(this.#drawText.name);
    this.#traceMethod("DrawText");

    const pts = this.#getPointsByNames([aorigin]);

    if (this._status.Ok && pts.length < 1) {
      this._status = Rst.ApgRstErrors.NotFound(
        "",
        `Origin point [%1] for the text not found`,
        [aorigin]
      )
    }

    if (this._status.Ok) {
      const zero = new A2D.Apg2DPoint(0, 0);
      pts.push(zero);
      // TODO @5 APG ... -- this is a mess better to draw text without Annotations factory
      const factory = this._cad.getPrimitiveFactory(
        eApgCadPrimitiveFactoryTypes.ANNOTATIONS
      ) as ApgCadSvgAnnotationsFactory;
      const g = factory.build(this._cad.currentLayer, pts[0], pts[1], atext[0]);
      const textStyle = this.#checkTextStyle(atextStyleName);
      if (textStyle) {
        g?.textStyle(textStyle);
      }

    }
    this.logEnd(this._status);
    return this._status;
  }

  /** Draws the name of the Drawing */
  #drawTitle(
    ax: number,
    ay: number,
  ) {

    this.logBegin(this.#drawTitle.name);
    this.#traceMethod("DrawTitle");

    const origin = new A2D.Apg2DPoint(ax, ay);
    const zero = new A2D.Apg2DPoint(0, 0);

    if (this._status.Ok) {
      const factory = this._cad.getPrimitiveFactory(
        eApgCadPrimitiveFactoryTypes.ANNOTATIONS
      ) as ApgCadSvgAnnotationsFactory;
      // TODO @5 APG ... -- this is a mess better to draw text without Annotations factory
      const g = factory.build(this._cad.currentLayer, origin, zero, this._name);
      const textStyle = this.#checkTextStyle(eApgCadDftTextStyles.TITLE);
      if (textStyle) {
        g?.textStyle(textStyle);
      }
    }

    this.logEnd();
    return this._status;
  }


  /** Draws an annotation from the given data */
  #drawAnnotation(ainstruction: IApgCadInstruction) {

    this.logBegin(this.#drawAnnotation.name);
    this.#traceMethod("DrawAnnotation");

    const pts = this.#get2PointsByNames(ainstruction.points!);

    if (this._status.Ok) {

      const factory = this._cad.getPrimitiveFactory(
        eApgCadPrimitiveFactoryTypes.ANNOTATIONS
      ) as ApgCadSvgAnnotationsFactory;

      const disp = new A2D.Apg2DPoint(pts[1].x - pts[0].x, pts[1].y - pts[0].y);

      const _g = factory.build(
        this._cad.currentLayer,
        pts[0],
        disp,
        ainstruction.text!.join('\n'),
        ainstruction.angle!
      );
    }
    this.logEnd();
    return this._status;
  }


  /** Draws a linear dimension from the given data */
  #drawLinearDim(ainstruction: IApgCadInstruction) {

    this.logBegin(this.#drawLinearDim.name);
    this.#traceMethod("DrawLinDim");

    const pts = this.#get2PointsByNames(ainstruction.points!);

    if (this._status.Ok) {

      const factory = this._cad.getPrimitiveFactory(
        eApgCadPrimitiveFactoryTypes.LINEAR_DIMS
      ) as ApgCadSvgLinearDimensionsFactory;


      let dimType = eApgCadLinearDimensionTypes.ALIGNED;
      if (
        ainstruction.payload &&
        ainstruction.payload.type &&
        typeof (ainstruction.payload.type) == 'number' &&
        Uts.ApgUtsEnum.NumericContains(eApgCadLinearDimensionTypes, ainstruction.payload.type)
      ) {
        dimType = ainstruction.payload.type;
      }
      let before = "";
      let after = ""
      if (ainstruction.text) {
        before = ainstruction.text[0];
        after = ainstruction.text[1];
      }

      const node = factory
        .build(
          dimType,
          pts[0],
          pts[1],
          ainstruction.radious!,
          before,
          after
        );

      this.#setParent(node!);

    }
    this.logEnd();
    return this._status;
  }


  /** Draws an arc dimension from the given data */
  #drawArcDim(ainstruction: IApgCadInstruction) {

    this.logBegin(this.#drawArcDim.name);
    this.#traceMethod("DrawArcDim");

    const pts = this.#get2PointsByNames(ainstruction.points!);

    if (this._status.Ok) {

      const factory = this._cad.getPrimitiveFactory(
        eApgCadPrimitiveFactoryTypes.ARC_DIMS
      ) as ApgCadSvgArcDimensionsFactory;


      let dimType = eApgCadArcDimensionTypes.OUTER_DIAMETER;
      if (
        ainstruction.payload &&
        ainstruction.payload.type &&
        typeof (ainstruction.payload.type) == 'number' &&
        Uts.ApgUtsEnum.NumericContains(eApgCadArcDimensionTypes, ainstruction.payload.type)
      ) {
        dimType = ainstruction.payload.type;
      }
      let before = "";
      let after = ""
      if (ainstruction.text) {
        before = ainstruction.text[0];
        after = ainstruction.text[1];
      }

      const node = factory
        .build(
          dimType,
          pts[0],
          pts[1],
          ainstruction.radious!,
          before,
          after
        );

      this.#setParent(node!);

    }
    this.logEnd();
    return this._status;
  }

  //#endregion

  /** Parses the instructions set and builds the SVG drawing */
  build(asettingsOnly = false) {

    this.logBegin(this.build.name);

    /** Current Instruction Index */
    let index = 0;

    this._instructions.forEach((ainstruction: IApgCadInstruction) => {

      if (this._status.Ok) {

        switch (ainstruction.type) {
          case eApgCadInstructionTypes.SET_NAME: {
            this.setName_(
              ainstruction.name!
            ); //
            break;
          }
          case eApgCadInstructionTypes.SET_VIEWBOX: {
            this.setViewBox_(
              ainstruction.payload!
            ); // 
            break;
          }
          case eApgCadInstructionTypes.SET_CARTESIAN: {
            this.setCartesian_(
              ainstruction.payload!
            ); // 
            break;
          }
          case eApgCadInstructionTypes.SET_BACKGROUND: {
            this.setBackground_(
              ainstruction.payload!
            ); // 
            break;
          }
          case eApgCadInstructionTypes.NEW_POINT: {
            this.newPoint_(ainstruction); // 2023/01/04 
            break;
          }
          case eApgCadInstructionTypes.NEW_POINT_DELTA: {
            this.newPointByDelta_(ainstruction); // 2023/01/04
            break;
          }
          case eApgCadInstructionTypes.NEW_STROKE_STYLE: {
            throw new Error('Not implemented ' + eApgCadInstructionTypes.NEW_STROKE_STYLE);
            // this._cad.newStrokeStyle(
            //   ainstruction.name!,
            //   ainstruction.payload!
            // );
            // break;
          }
          case eApgCadInstructionTypes.NEW_FILL_STYLE: {
            throw new Error('Not implemented ' + eApgCadInstructionTypes.NEW_FILL_STYLE);
            // this._cad.newFillStyle(
            //   ainstruction.name!,
            //   ainstruction.payload!
            // );
            // break;
          }
          case eApgCadInstructionTypes.NEW_TEXT_STYLE: {
            throw new Error('Not implemented ' + eApgCadInstructionTypes.NEW_FILL_STYLE);
            // this._cad.newFillStyle(
            //   ainstruction.name!,
            //   ainstruction.payload!
            // );
            // break;
          }
          case eApgCadInstructionTypes.PUSH_LAYER: {
            this.pushLayer_(
              ainstruction.name!
            ); // 2023/01/04
            break;
          }
          case eApgCadInstructionTypes.POP_LAYER: {
            this.popLayer_(); // 2023/01/22
            break;
          }
          case eApgCadInstructionTypes.NEW_GROUP: {
            this.newGroup_(
              ainstruction
            ); // 2023/01/21
            break;
          }
          case eApgCadInstructionTypes.SET_GROUP: {
            this.setGroup_(
              ainstruction.name!
            ); // 
            break;
          }
          case eApgCadInstructionTypes.NO_GROUP: {
            this.noGroup_(); // 2023/01/21
            break;
          }
          case eApgCadInstructionTypes.DRAW_POINTS: {
            if (!asettingsOnly) {
              this.drawPoints_(ainstruction); // 2023/01/04
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_ALL_POINTS: {
            if (!asettingsOnly) {
              this.drawAllPointsWithInfo_(ainstruction); // 2023/01/04
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_LINE: {
            if (!asettingsOnly) {
              this.drawLine_(ainstruction); // 2023/01/04
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_CIRCLE: {
            if (!asettingsOnly) {
              this.drawCircle_(ainstruction); // 2023/01/06
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_ARC: {
            if (!asettingsOnly) {
              this.drawArc_(ainstruction); // 2023/01/06
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_POLYLINE: {
            if (!asettingsOnly) {
              this.#drawPolyLine(ainstruction); // 2023/01/06
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_RECTANGLE_POINTS: {
            if (!asettingsOnly) {
              this.#drawRectangleByPoints(ainstruction); // 2023/01/07
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_RECTANGLE_SIZES: {
            if (!asettingsOnly) {
              this.#drawRectangleBySizes(ainstruction); // 2023/01/07 
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_POLYGON: {
            if (!asettingsOnly) {
              this.drawPolygon_(ainstruction); // 2023/01/07
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_REGULAR_POLYGON: {
            if (!asettingsOnly) {
              this.drawRegularPolygon_(ainstruction); // 2023/01/15
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_TEXT: {
            if (!asettingsOnly) {
              this.#drawText(
                ainstruction.text!,
                ainstruction.origin!,
                <string>ainstruction.textStyle
              ); // 
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_NAME: {
            if (!asettingsOnly) {
              this.#drawTitle(
                ainstruction.x!,
                ainstruction.y!
              );
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_ANNOTATION: {
            if (!asettingsOnly) {
              this.#drawAnnotation(ainstruction);
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_LIN_DIM: {
            if (!asettingsOnly) {
              this.#drawLinearDim(ainstruction);
            }
            break;
          }
          case eApgCadInstructionTypes.DRAW_ARC_DIM: {
            if (!asettingsOnly) {
              this.#drawArcDim(ainstruction);
            }
            break;
          }

        }
      }
      index++;
    }, this);

    this.logEnd();

  }



}
