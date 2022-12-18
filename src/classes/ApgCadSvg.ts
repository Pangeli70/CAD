/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { Svg, A2D } from "../../deps.ts";

import {
  IApgCadSvgViewBox,
  IApgCadSvgSettings,
  eApgCadOrientations,
  eApgCadStdColors,
  IApgCadSvgBackground,
  IApgCadSvgAxis,
  IApgCadSvgTextStyle,
  ApgCadSvgBasicShapesFactory,
  eApgCadDftDimArrowStyles,
  eApgCadSvgPrimitiveFactoryTypes,
  ApgCadSvgPrimitivesFactory,
  ApgCadSvgAxisFactory,
  eApgCadDftLayers,
  eApgCadDftTextStyles,
  ApgCadSvgAnnotationsFactory,
} from "../../mod.ts";

/** The Object that allows to create an Svg CAD Drawing
 */
export class ApgCadSvg {
  /** Our svg drawing created on the server side */
  svg!: Svg.ApgSvgDoc;

  /** Standard size elements */
  readonly STD_SIZE_K = 10;

  /** The ratio for the resizing of the common SVG elements and blocks */
  displayRatio = 1;

  /** The height of the common elements like Text and arrows */
  standardHeight = 1;

  settings!: IApgCadSvgSettings;

  strokeStyles: Map<string, Svg.IApgSvgStroke> = new Map();

  fillStyles: Map<string, Svg.IApgSvgFill> = new Map();

  textStyles: Map<string, IApgCadSvgTextStyle> = new Map();

  layers: Map<string, Svg.ApgSvgNode> = new Map();
  currentLayer!: Svg.ApgSvgNode;

  groupsDefs: Map<string, string> = new Map();
  groups: Map<string, Svg.ApgSvgNode> = new Map();
  currentGroup!: Svg.ApgSvgNode;

  patterns: Map<string, Svg.ApgSvgNode> = new Map();
  patternsDefs: string[] = [];

  gradients: Map<string, Svg.ApgSvgNode> = new Map();

  primitiveFactories: Map<string, ApgCadSvgPrimitivesFactory> = new Map();



  static GetDefaultSettings(): IApgCadSvgSettings {
    return <IApgCadSvgSettings>{
      name: "APG-CAD-SVG",
      viewBox: <IApgCadSvgViewBox>{
        canvasWidth: 800,
        canvasHeight: 800 / 16 * 9,
        viewPortWidth: 8000,
        viewPortHeight: 8000 / 16 * 9,
        originXDisp: 800,
        originYDisp: 800 / 16 * 9,
      },
      background: <IApgCadSvgBackground>{
        draw: true,
        borderWidth: 2,
        borderColor: eApgCadStdColors.BLACK,
        fillColor: eApgCadStdColors.RED,
      },
      axis: <IApgCadSvgAxis>{
        axisStroke: { color: eApgCadStdColors.GRAY, width: 4 },
        drawTicks: true,
        tickStroke: { color: eApgCadStdColors.GRAY, width: 2 },
        ticksDistance: 100,
        ticksSize: 25,
        drawBigTicks: true,
        bigTicksEvery: 500,
        bigTicksSize: 50,
        drawBigTicksLables: true,
        labelsStyleName: "AxisLabel",
      },
    };
  }


  constructor(aset?: IApgCadSvgSettings) {
    // Set defaults
    if (!aset) {
      this.#resetDefaults();
    } else {
      this.settings = aset;
    }

    this.#init();
  }


  #resetDefaults() {
    this.settings = ApgCadSvg.GetDefaultSettings();
  }


  #init() {

    this.svg = new Svg.ApgSvgDoc(
      this.settings.viewBox.canvasWidth,
      this.settings.viewBox.canvasHeight,
    );
    this.svg.title = this.settings.name;


    this._resetViewBox();

    this._initStrokeStyles();

    this._initFillSyles();

    this._initTextStyles();

    this._initLayers();

    this._initPatterns();

    this._initGradients();

    // If requested draws background
    this._initBackGround();

    // Builds standard blocks like arrows
    this._initBlocks();

    this._initPrimitiveFactories();

    this._resetAxis();

    this.setLayer(eApgCadDftLayers.ZERO);
  }


  protected _resetViewBox() {
    /** Display ratio */
    const horizontalDisplayRatio = this.settings.viewBox.viewPortWidth /
      this.settings.viewBox.canvasWidth;
    const verticalDisplayRatio = this.settings.viewBox.viewPortHeight /
      this.settings.viewBox.canvasHeight;
    // the image scale ratio depends on the largest ratio
    this.displayRatio = (horizontalDisplayRatio > verticalDisplayRatio)
      ? horizontalDisplayRatio
      : verticalDisplayRatio;

    // The size of the text and arrows depends on the Display Ratio instead
    // they could not be visible
    this.standardHeight = this.displayRatio * this.STD_SIZE_K;

    // Move the viewbox
    this.svg.setViewbox(
      -this.settings.viewBox.originXDisp,
      -this.settings.viewBox.originYDisp,
      this.settings.viewBox.viewPortWidth,
      this.settings.viewBox.viewPortHeight,
    );
  }


  protected _initStrokeStyles() {

    const sdBkg = <Svg.IApgSvgStroke>{
      color: this.settings.background.borderColor,
      width: this.settings.background.borderWidth,
    };
    this.newStrokeStyle("Background", sdBkg);

    const sdAxis = <Svg.IApgSvgStroke>{
      color: this.settings.axis.axisStroke.color,
      width: this.settings.axis.axisStroke.width,
    };
    this.newStrokeStyle("Axis", sdAxis);

    const sdDbg = <Svg.IApgSvgStroke>{
      color: eApgCadStdColors.MAGENTA,
      width: 5,
    };
    this.newStrokeStyle("Debug", sdDbg);

    const sdDft = <Svg.IApgSvgStroke>{
      color: eApgCadStdColors.BLACK,
      width: 1,
    };
    this.newStrokeStyle("Default", sdDft);

    const sd0 = <Svg.IApgSvgStroke>{
      color: eApgCadStdColors.BLUE,
      width: 8,
    };
    this.newStrokeStyle("BoldBlue", sd0);

    const sdDim = <Svg.IApgSvgStroke>{
      color: eApgCadStdColors.RED,
      width: 2,
    };
    this.newStrokeStyle("Dimensions", sdDim);

    const sdHidden = <Svg.IApgSvgStroke>{
      color: eApgCadStdColors.GRAY,
      width: 2,
      dashPattern: [5, 5]
    };
    this.newStrokeStyle("Hidden", sdHidden);
  }


  protected _initFillSyles() {
    const fdBkg = <Svg.IApgSvgFill>{
      color: this.settings.background.fillColor,
      opacity: 1,
    };
    this.newFillStyle("Background", fdBkg);

    const fdDbg = <Svg.IApgSvgFill>{
      color: eApgCadStdColors.GREEN,
      opacity: 1,
    };
    this.newFillStyle("Debug", fdDbg);

    const fdDims = <Svg.IApgSvgFill>{
      color: eApgCadStdColors.RED,
      opacity: 1,
    };
    this.newFillStyle("Dimensions", fdDims);
  }


  protected _initLayers() {
    // Layer BackGround
    this.newLayer(eApgCadDftLayers.BACKGROUND, "Background", "Background");

    // Layer Axis
    this.newLayer(eApgCadDftLayers.AXIS, "Axis");

    // Layer dimensions
    this.newLayer(eApgCadDftLayers.DIMENSIONS, "Dimensions", "Dimensions");

    // Layer debug
    this.newLayer(eApgCadDftLayers.DEBUG, "Debug", "Debug");

    // Layer hidden
    this.newLayer(eApgCadDftLayers.HIDDEN, "Hidden");

    // Layer zero
    this.newLayer(eApgCadDftLayers.ZERO, "BoldBlue");

  }


  protected _initPatterns() {

    const aname1 = "BlackCheckers";
    const ptn1 = this.svg.pattern(0, 0, 20, 20, aname1);
    this.svg.rect(0, 0, 10, 10).fill("black").childOf(ptn1);
    this.svg.rect(10, 10, 20, 20).fill("black").childOf(ptn1);
    this.newPattern(aname1, ptn1);

    const aname2 = "Grid1";
    const ptn2 = this.svg.pattern(0, 0, 8, 10, aname2);
    this.svg.line(0, 0, 8, 10).stroke("#444444", 2.5).childOf(ptn2);
    this.svg.line(0, 10, 8, 0).stroke("#343434", 2.5).childOf(ptn2);
    this.newPattern(aname2, ptn2);

    const aname3 = "Grid2";
    const ptn3 = this.svg.pattern(0, 0, 12, 16, aname3);
    this.svg.line(0, 0, 12, 16).stroke("#444444", 2).childOf(ptn3);
    this.svg.line(0, 16, 12, 0).stroke("#343434", 2).childOf(ptn3);

    const aname4 = "Grid3";
    this.newPattern(aname3, ptn3);
    const ptn4 = this.svg.pattern(0, 0, 50, 50, aname4);
    this.svg.line(0, 25, 50, 25).stroke("#0f0f0f", 3).childOf(ptn4);
    this.svg.line(25, 0, 25, 50).stroke("#2f2f2f", 3).childOf(ptn4);
    this.newPattern(aname4, ptn4);
  }


  protected _initGradients() {
    /** @todo_9 Implement this  */
  }


  protected _initTextStyles() {
    const defautStyle = <IApgCadSvgTextStyle>{
      font: "Verdana",
      size: this.standardHeight * 1,
      anchor: Svg.eApgSvgTextAnchor.start,
      italic: false,
      bold: false,
      fill: eApgCadStdColors.BLACK,
      stroke: "none",
      HWRatio: 0.51,
    };
    this.newTextStyle(eApgCadDftTextStyles.DEFAULT, defautStyle);

    const debugStyle = <IApgCadSvgTextStyle>{
      font: "Calibri",
      size: this.standardHeight * 1,
      anchor: Svg.eApgSvgTextAnchor.start,
      italic: false,
      bold: false,
      fill: eApgCadStdColors.MAGENTA,
      stroke: "none",
      HWRatio: 0.41,
    };
    this.newTextStyle(eApgCadDftTextStyles.DEBUG, debugStyle);

    const monoStyle = <IApgCadSvgTextStyle>{
      font: "Lucida Console",
      size: this.standardHeight * 1,
      anchor: Svg.eApgSvgTextAnchor.start,
      italic: false,
      bold: false,
      fill: eApgCadStdColors.BLACK,
      stroke: "none",
      HWRatio: 0.59,
    };
    this.newTextStyle(eApgCadDftTextStyles.MONO, monoStyle);

    const titleStyle = <IApgCadSvgTextStyle>{
      font: "Arial",
      size: this.standardHeight * 1,
      anchor: Svg.eApgSvgTextAnchor.middle,
      italic: false,
      bold: false,
      fill: eApgCadStdColors.BLACK,
      stroke: "none",
      HWRatio: 0.45,
    };
    this.newTextStyle(eApgCadDftTextStyles.TITLE, titleStyle);

    const dimensionsType = <IApgCadSvgTextStyle>{
      font: "Lucida Sans Unicode",
      size: this.standardHeight * 1,
      anchor: Svg.eApgSvgTextAnchor.middle,
      italic: false,
      bold: false,
      fill: eApgCadStdColors.RED,
      stroke: "none",
      HWRatio: 0.49,
    };
    this.newTextStyle(eApgCadDftTextStyles.DIMENSIONS, dimensionsType);

    const axisLabelType = <IApgCadSvgTextStyle>{
      font: "Courier new",
      size: this.standardHeight * 1,
      anchor: Svg.eApgSvgTextAnchor.middle,
      italic: false,
      bold: false,
      fill: eApgCadStdColors.GRAY,
      stroke: "none",
      HWRatio: 0.5,
    };
    this.newTextStyle(eApgCadDftTextStyles.AXIS_LABEL, axisLabelType);
  }


  protected _initBackGround() {
    if (this.settings.background.draw) {
      this.setLayer("Background");

      const vb = this.settings.viewBox;
      const x = -vb.originXDisp;
      const y = vb.viewPortHeight - vb.originYDisp;
      const w = vb.viewPortWidth;
      const h = vb.viewPortHeight;
      this.svg.rect(x, y, w, h, "Background");
    }
  }



  protected _initBlocks() {

    const size = 20;
    const ratio = 0.25;

    const mechPts: A2D.Apg2DPoint[] = [
      new A2D.Apg2DPoint(0, 0),
      new A2D.Apg2DPoint(size, -size * ratio),
      new A2D.Apg2DPoint(size, size * ratio),
    ];
    const mechArrow = this.svg
      .polygon(mechPts, eApgCadDftDimArrowStyles.MECHANICAL)
      .stroke(eApgCadStdColors.NONE, 0);
    this.newBlock(mechArrow);

    const simpleArrow = this.svg.group(eApgCadDftDimArrowStyles.SIMPLE);
    this.svg
      .line(mechPts[0].x, mechPts[0].y, mechPts[1].x, mechPts[1].y)
      .childOf(simpleArrow);
    this.svg
      .line(mechPts[0].x, mechPts[0].y, mechPts[2].x, mechPts[2].y)
      .childOf(simpleArrow);
    this.newBlock(simpleArrow);

    const archPts: A2D.Apg2DPoint[] = [
      new A2D.Apg2DPoint(-size * ratio / 2, -size / 2),
      new A2D.Apg2DPoint(size * ratio / 2, size / 2),
    ];
    const archArrow = this.svg
      .line(archPts[0].x, archPts[0].y, archPts[1].x, archPts[1].y, eApgCadDftDimArrowStyles.ARCHITECTURAL);
    this.newBlock(archArrow);

    const dotArrow = this.svg
      .circle(0, 0, size * ratio, eApgCadDftDimArrowStyles.DOT)
      .stroke(eApgCadStdColors.NONE, 0);
    this.newBlock(dotArrow);
  }


  protected _initPrimitiveFactories() {
    const basicShapes = new ApgCadSvgBasicShapesFactory(
      this.svg,
      this.svg.getRoot(),
    );
    this.primitiveFactories.set(
      eApgCadSvgPrimitiveFactoryTypes.basicShapes,
      basicShapes,
    );

    const axis = new ApgCadSvgAxisFactory(
      this.svg,
      this.svg.getRoot(),
    );
    this.primitiveFactories.set(
      eApgCadSvgPrimitiveFactoryTypes.axis,
      axis,
    );

    const textStyle = this.getTextStyle(eApgCadDftTextStyles.DIMENSIONS);
    const annotations = new ApgCadSvgAnnotationsFactory(
      this.svg,
      this.svg.getRoot(),
      textStyle!,
      eApgCadDftDimArrowStyles.MECHANICAL
    );
    this.primitiveFactories.set(
      eApgCadSvgPrimitiveFactoryTypes.annotations,
      annotations,
    );
  }


  public getPrimitiveFactory(
    atype: eApgCadSvgPrimitiveFactoryTypes,
  ) {
    return this.primitiveFactories.get(atype);
  }


  protected _resetAxis() {
    const axisFactory: ApgCadSvgAxisFactory | undefined =
      <ApgCadSvgAxisFactory>this.primitiveFactories.get(
        eApgCadSvgPrimitiveFactoryTypes.axis,
      );
    if (axisFactory) {
      const axisLayer: Svg.ApgSvgNode | undefined = this.getLayer("Axis");

      if (axisLayer) {
        let axisLabelsStyle: IApgCadSvgTextStyle | undefined = this
          .getTextStyle(this.settings.axis.labelsStyleName);
        if (!axisLabelsStyle) {
          axisLabelsStyle = this.getTextStyle("Default");
        }
        this.settings.axis.labelsStyle = axisLabelsStyle;

        axisFactory.setLayer(axisLayer);
        axisFactory.build(
          eApgCadOrientations.horizontal,
          this.settings.axis,
        );
        axisFactory.build(
          eApgCadOrientations.vertical,
          this.settings.axis
        );
      }
    }
  }


  private __drawGridLine(
    g: Svg.ApgSvgNode,
    tickPos: number,
    asd: Svg.IApgSvgStroke,
    x: boolean,
  ) {
    if (this.settings.axis) {
      if (x) {
        // Draw the x grid line
        this.svg.line(
          tickPos,
          -this.settings.viewBox.originYDisp,
          tickPos,
          this.settings.viewBox.viewPortHeight -
          this.settings.viewBox.originYDisp,
        ).stroke(asd.color, asd.width).childOf(g);
      } else {
        // Draw the y grid line
        this.svg.line(
          -this.settings.viewBox.originXDisp,
          tickPos,
          this.settings.viewBox.viewPortWidth -
          this.settings.viewBox.originXDisp,
          tickPos,
        ).stroke(asd.color, asd.width).childOf(g);
      }
    }
  }


  /** Sets the viewbox.
   * This method must be called in the proper order becuse clears 
   * the entire content of the drawing */
  setViewBox(avb: IApgCadSvgViewBox) {
    this.settings.viewBox = avb;
    this.#init();
  }


  /** Draws the axis and grid on the drawing.
     * This method must be called in the proper order becuse clears 
     * the entire content of the drawing */
  setAxis(aa: IApgCadSvgAxis) {
    this.settings.axis = Object.assign({}, this.settings.axis, aa);
    this.#init();
  }


  /** Draws the background of the drawing.
    * This method must be called in the proper order becuse clears 
    * the entire content of the drawing*/
  setBackground(ab: IApgCadSvgBackground) {
    this.settings.background = Object.assign({}, this.settings.background, ab);
    this.#init();
  }


  newLayer(
    aname: string,
    astrokeName: string,
    afillName?: string
  ) {

    const layerId = aname;
    const layerClass = "layer-" + aname.toLowerCase();
    const layer = this.svg.group(layerId)
      .class(layerClass)
      .childOfRoot(this.svg);

    const strokeStyle = this.getStrokeStyle(astrokeName);
    if (!strokeStyle) {
      throw new Error(
        `Stroke named ${astrokeName} not available in ApgCadSvg Stroke Styles`,
      );
    }
    layer.stroke(strokeStyle.color, strokeStyle.width);
    if (strokeStyle.dashPattern) {
      layer.strokeDashPattern(strokeStyle.dashPattern)
    }

    let fill: Svg.IApgSvgFill | undefined = undefined;
    if (afillName) {
      fill = this.getFillStyle(afillName);
      if (!fill) {
        throw new Error(
          `Fill named ${afillName} not available in ApgCadSvg Fill Styles`,
        );
      }
    }
    if (fill) {
      layer.fill(fill.color);
    } else {
      layer.fill("none");
    }

    this.layers.set(aname, layer);

    return layer;
  }


  getLayer(aname: string) {
    const r = this.layers.get(aname);
    return r;
  }


  clearLayer(aname: string) {
    const r = this.layers.get(aname);
    if (r) {
      r.clear();
    }
    return r;
  }


  setLayer(aname: string) {
    const g = this.getLayer(aname);
    if (g !== undefined) {
      this.currentLayer = g;
      // By default sets the current group as the current layer
      this.currentGroup = g;
    }
    return g;
  }


  /** Clear the drawing by clearing all the layers except the Axis one. 
    * Defs, Styles and other stuff will remain */
  clear() {
    this.layers.forEach((_layer, key) => {
      if (key != "Axis") {
        this.clearLayer(key);
      }
    });
  }


  /** Creates a new group on the current layer, sets it as the current group
   * and adds it to the groups library */
  newGroup(aname: string, astroke?: string, afill?: string) {
    const g = this.svg.group("GROUP_" + aname.toUpperCase())
      .childOf(this.currentLayer);

    if (astroke) {
      const l = this.strokeStyles.get(astroke);
      if (l) {
        g.stroke(l.color, l.width);
      }
    }

    if (afill) {
      const l = this.fillStyles.get(afill);
      if (l) {
        g.fill(l.color);
      }
    }
    // Add to library
    this.groups.set(aname, g);
    this.groupsDefs.set(aname, this.currentLayer.ID);
    // Set as current
    this.currentGroup = g;

    return g;
  }


  getGroup(aname: string) {
    const r = this.groups.get(aname);
    return r;
  }


  setGroup(aname: string) {
    const g = this.getGroup(aname);
    if (g !== undefined) {
      this.currentGroup = g;
    }
    return g;
  }


  newPattern(aname: string, apattern: Svg.ApgSvgNode) {
    this.patterns.set(aname, apattern);
    this.patternsDefs.push(aname);
  }


  getPattern(aname: string) {
    const r = this.patterns.get(aname);
    return r;
  }


  newStrokeStyle(aname: string, adata: Svg.IApgSvgStroke) {
    this.strokeStyles.set(aname, adata);
  }


  getStrokeStyle(aname: string) {
    const r = this.strokeStyles.get(aname);
    return r;
  }


  newFillStyle(aname: string, adata: Svg.IApgSvgFill) {
    this.fillStyles.set(aname, adata);
  }


  getFillStyle(aname: string) {
    const r = this.fillStyles.get(aname);
    return r;
  }


  newTextStyle(aname: string, atextStyle: IApgCadSvgTextStyle) {
    this.textStyles.set(aname, atextStyle);
  }


  getTextStyle(aname: string): IApgCadSvgTextStyle | undefined {
    const r: IApgCadSvgTextStyle | undefined = this.textStyles.get(aname);
    return r;
  }


  newBlock(anode: Svg.ApgSvgNode) {
    this.svg.addToDefs(anode.ID, anode);
  }


  getBlock(ablockId: string) {
    return this.svg.getFromDef(ablockId);
  }

  /** Draws a simple svg as stub for the tests */
  drawStub() {
    const layer = this.getLayer("0");
    if (!layer) return;
    //this.svg.SetViewbox(0, 0, 500, 500);
    this.svg
      .rect(50, 50, 150, 150)
      .fill("yellow")
      .childOf(layer);
    this.svg
      .rect(250, 50, 350, 150)
      .fill("blue")
      .childOf(layer);
  }

}
