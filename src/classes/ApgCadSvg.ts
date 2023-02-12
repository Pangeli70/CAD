/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * @version 0.9.4 [APG 2023/01/04] Deno Deploy Beta
 * @version 0.9.5 [APG 2023/02/12] Improving Beta
 * -----------------------------------------------------------------------
 */

import { A2D, Svg } from "../../deps.ts";

import { eApgCadDftFillStyles } from "../enums/eApgCadDftFillStyles.ts";
import { eApgCadDftLayers } from "../enums/eApgCadDftLayers.ts";
import { eApgCadDftStrokeStyles } from "../enums/eApgCadDftStrokeStyles.ts";
import { eApgCadDftTextStyles } from "../enums/eApgCadDftTextStyles.ts";
import { eApgCadOrientations } from "../enums/eApgCadOrientations.ts";
import { eApgCadFactories } from "../enums/eApgCadFactories.ts";
import { eApgCadStdColors } from "../enums/eApgCadStdColors.ts";
import { IApgCadStyleOptions } from "../interfaces/IApgCadStyleOptions.ts";
import { IApgCadSvgCartesians } from "../interfaces/IApgCadSvgCartesians.ts";
import { IApgCadSvgGround } from "../interfaces/IApgCadSvgGround.ts";
import { IApgCadSvgGrid } from "../interfaces/IApgCadSvgGrid.ts";
import { IApgCadSvgSettings } from "../interfaces/IApgCadSvgSettings.ts";
import { IApgCadSvgViewBox } from "../interfaces/IApgCadSvgViewBox.ts";
import { ApgCadSvgCartesiansFactory } from "./factories/ApgCadSvgCartesiansFactory.ts";
import { ApgCadSvgGridFactory } from "./factories/ApgCadSvgGridFactory.ts";
import { ApgCadSvgFactoryBase } from "./factories/ApgCadSvgFactoryBase.ts";
import { ApgCadSvgBlocksInitializer } from "./initializers/ApgCadSvgBlocksInitializer.ts";
import { ApgCadSvgFillStylesInitializer } from "./initializers/ApgCadSvgFillStylesInitializer.ts";
import { ApgCadSvgGradientsInitializer } from "./initializers/ApgCadSvgGradientsInitializer.ts";
import { ApgCadSvgLayersInitializer } from "./initializers/ApgCadSvgLayersInitializer.ts";
import { ApgCadSvgPatternsInitializer } from "./initializers/ApgCadSvgPatternsInitializer.ts";
import { ApgCadSvgTexturesInitializer } from "./initializers/ApgCadSvgTexturesInitializer.ts";
import { ApgCadSvgPrimitivesFactoriesInitializer } from "./initializers/ApgCadSvgPrimitivesFactoriesInitializer.ts";
import { ApgCadSvgStrokeStylesInitializer } from "./initializers/ApgCadSvgStrokeStylesInitializer.ts";
import { ApgCadSvgTextStylesInitializer } from "./initializers/ApgCadSvgTextStylesInitializer.ts";
import { eApgCadDftStrokeWidths } from "../enums/eApgCadDftStrokeWidths.ts";
import { IApgCadSvgLayerDef } from "../interfaces/IApgCadSvgLayerDef.ts";
import { IApgCadSvgOptions } from "../interfaces/IApgCadSvgOptions.ts";
import { eApgCadCartesianMode } from "../enums/eApgCadCartesianMode.ts";
import { eApgCadGridMode } from "../enums/eApgCadGridMode.ts";

/** The Object that allows to create an Svg CAD Drawing
 */
export class ApgCadSvg {
  /** Our svg drawing created on the server side */
  svg!: Svg.ApgSvgDoc;

  /** Standard size elements */
  readonly STD_SIZE = 10;

  /** The ratio for the resizing of the common SVG elements and blocks */
  displayRatio = 1;

  /** The Size of the common elements like Text and blocks */
  standardSize = 1;

  settings!: IApgCadSvgSettings;

  strokeStyles: Map<string, Svg.IApgSvgStrokeStyle> = new Map();

  fillStyles: Map<string, Svg.IApgSvgFillStyle> = new Map();

  textStyles: Map<string, Svg.IApgSvgTextStyle> = new Map();

  layers: Map<string, Svg.ApgSvgNode> = new Map();
  layerDefs: Map<string, IApgCadSvgLayerDef> = new Map();
  currentLayer!: Svg.ApgSvgNode;

  groupsDefs: Map<string, string> = new Map();
  groups: Map<string, Svg.ApgSvgNode> = new Map();
  currentGroup!: Svg.ApgSvgNode | undefined;

  blocks: Map<string, Svg.ApgSvgNode> = new Map();
  blockDefs: string[] = [];

  patterns: Map<string, Svg.ApgSvgNode> = new Map();
  patternsDefs: string[] = [];

  textures: Map<string, Svg.ApgSvgNode> = new Map();
  textureDefs: string[] = [];

  gradients: Map<string, Svg.ApgSvgNode> = new Map();
  gradientsDefs: string[] = [];

  primitiveFactories: Map<string, ApgCadSvgFactoryBase> = new Map();



  static GetDefaultSettings(
    aparams: IApgCadSvgOptions
  ): IApgCadSvgSettings {

    const viewBox: IApgCadSvgViewBox = {
      canvasWidth: 1000,
      canvasHeight: 1000 / 16 * 9,
      viewPortWidth: 10000,
      viewPortHeight: 10000 / 16 * 9,
      originXDisp: 1000,
      originYDisp: 1000 / 16 * 9,
    }

    const background: IApgCadSvgGround = {
      draw: true,
      strokeWidth: eApgCadDftStrokeWidths.MILD_4,
      strokeColor: eApgCadStdColors.GRAY,
      fillColor: aparams.blackBack ? eApgCadStdColors.BLACK : eApgCadStdColors.WHITE,
    }

    const foreGround: IApgCadSvgGround = {
      draw: true,
      strokeWidth: eApgCadDftStrokeWidths.MILD_4,
      strokeColor: aparams.blackBack ? eApgCadStdColors.WHITE : eApgCadStdColors.BLACK,
      fillColor: aparams.blackBack ? eApgCadStdColors.WHITE : eApgCadStdColors.BLACK,
    }

    const grid: IApgCadSvgGrid = {
      mode: aparams.gridMode,
      gridStep: 100,
      gridStroke: { color: eApgCadStdColors.GREEN, width: 1, dashPattern: [10, 90], dashOffset: 5 },
      drawMajors: true,
      majorEvery: 1000,
      majorGridStroke: { color: eApgCadStdColors.CYAN, width: 2, dashPattern: [10, 90], dashOffset: 5 },
    }

    const cartesians: IApgCadSvgCartesians = {
      mode: aparams.cartesiansMode,
      axisStroke: { color: eApgCadStdColors.GRAY, width: 4 },
      drawTicks: true,
      tickStroke: { color: eApgCadStdColors.CYAN, width: 2 },
      ticksStep: 100,
      ticksSize: 25,
      drawBigTicks: true,
      bigTicksEvery: 1000,
      bigTicksSize: 50,
      drawBigTicksLables: true,
      labelsTextStyleName: eApgCadDftTextStyles.CARTESIAN_LABEL,
    };

    const r: IApgCadSvgSettings = {

      name: aparams.name,
      viewBox,
      background,
      foreGround,
      grid,
      cartesians,
      debug: aparams.debug
    }

    return r;
  }


  constructor(aparams: IApgCadSvgOptions) {

    this.settings = ApgCadSvg.GetDefaultSettings(aparams);

  }


  async setup(asettings: IApgCadSvgSettings) {

    this.settings = asettings;

    await this.init();
  }


  async init() {

    this.svg = new Svg.ApgSvgDoc(
      this.settings.viewBox.canvasWidth,
      this.settings.viewBox.canvasHeight,
    );
    this.svg.title = this.settings.name;

    this.#resetViewBox();

    this.#initStrokeStyles();

    this.#initFillSyles();

    this.#initTextStyles();

    this.#initLayers();

    this.#initBlocks();

    this.#initPatterns();

    await this.#initTextures();

    this.#initGradients();

    this.#initPrimitiveFactories();

    this.#initBackGround();

    this.#initGrid();

    this.#initCartesians();

    this.setCurrentLayer(eApgCadDftLayers.ZERO);
  }


  #resetViewBox() {
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
    this.standardSize = this.displayRatio * this.STD_SIZE;

    // Move the viewbox
    this.svg.setViewbox(
      -this.settings.viewBox.originXDisp,
      -this.settings.viewBox.originYDisp,
      this.settings.viewBox.viewPortWidth,
      this.settings.viewBox.viewPortHeight,
    );
  }


  /** Returns an array with BottomLeft and TopRight canvas  */
  getBoundaries() {
    const r: A2D.Apg2DPoint[] = [];
    r.push(new A2D.Apg2DPoint(
      -this.settings.viewBox.originXDisp,
      -this.settings.viewBox.originYDisp
    ));
    r.push(new A2D.Apg2DPoint(
      this.settings.viewBox.viewPortWidth - this.settings.viewBox.originXDisp,
      this.settings.viewBox.viewPortHeight - this.settings.viewBox.originYDisp
    ));
    return r;
  }


  #initStrokeStyles() {
    const initializer = new ApgCadSvgStrokeStylesInitializer(this);
    initializer.build();
  }


  #initFillSyles() {
    const initializer = new ApgCadSvgFillStylesInitializer(this);
    initializer.build();
  }


  #initTextStyles() {
    const initializer = new ApgCadSvgTextStylesInitializer(this);
    initializer.build();
  }


  #initLayers() {
    const initializer = new ApgCadSvgLayersInitializer(this);
    initializer.build();
  }


  #initBlocks() {
    const initializer = new ApgCadSvgBlocksInitializer(this);
    initializer.build();
  }


  #initPatterns() {
    const initializer = new ApgCadSvgPatternsInitializer(this);
    initializer.build();
  }


  async #initTextures() {
    const initializer = new ApgCadSvgTexturesInitializer(this);
    await initializer.build();
  }


  #initGradients() {
    const initializer = new ApgCadSvgGradientsInitializer(this);
    initializer.build();
  }


  #initPrimitiveFactories() {
    const initializer = new ApgCadSvgPrimitivesFactoriesInitializer(this);
    initializer.build();
  }


  #initBackGround() {
    if (!this.settings.background.draw) return;

    this.setCurrentLayer(eApgCadDftLayers.BACKGROUND);

    const vb = this.settings.viewBox;
    const x = -vb.originXDisp;
    const y = -vb.originYDisp;
    const w = vb.viewPortWidth;
    const h = vb.viewPortHeight;
    this.svg
      .rect(x, y, w, h, eApgCadDftLayers.BACKGROUND)
      .childOf(this.currentLayer)

  }


  #initCartesians() {
    if (this.settings.cartesians.mode == eApgCadCartesianMode.NONE) return;

    const factory = this.primitiveFactories.get(eApgCadFactories.CARTESIANS);
    if (factory) {
      const axisFactory = factory as ApgCadSvgCartesiansFactory;
      const axisLayer = this.getLayer(eApgCadDftLayers.CARTESIANS);

      if (axisLayer) {
        let axisLabelsStyle = this
          .getTextStyle(this.settings.cartesians.labelsTextStyleName);
        if (!axisLabelsStyle) {
          axisLabelsStyle = this.getTextStyle("Default");
        }
        this.settings.cartesians.labelsStyle = axisLabelsStyle;

        axisFactory.build(
          axisLayer,
          eApgCadOrientations.horizontal,
          this.settings.cartesians,

        );
        axisFactory.build(
          axisLayer,
          eApgCadOrientations.vertical,
          this.settings.cartesians,
        );
      }
    }
  }


  #initGrid() {
    if (this.settings.grid.mode == eApgCadGridMode.NONE) return;

    const factory = this.primitiveFactories.get(eApgCadFactories.GRIDS);
    if (factory) {
      const gridFactory = factory as ApgCadSvgGridFactory
      const gridLayer: Svg.ApgSvgNode | undefined = this.getLayer(eApgCadDftLayers.GRIDS);

      if (gridLayer) {
        gridFactory.build(
          gridLayer,
          this.settings.grid,
        );
      }
    }
  }


  /** Sets the viewbox.
   * This method must be called in the proper order becuse clears 
   * the entire content of the drawing */
  async setViewBox(avb: IApgCadSvgViewBox) {
    this.settings.viewBox = avb;
    await this.init();
  }


  /** Draws the axis and grid on the drawing.
     * This method must be called in the proper order becuse clears 
     * the entire content of the drawing */
  async setCartesian(aa: IApgCadSvgCartesians) {
    this.settings.cartesians = Object.assign({}, this.settings.cartesians, aa);
    await this.init();
  }


  /** Draws the background of the drawing.
    * This method must be called in the proper order becuse clears 
    * the entire content of the drawing*/
  async setBackground(ab: IApgCadSvgGround) {
    this.settings.background = Object.assign({}, this.settings.background, ab);
    await this.init();
  }


  public getPrimitiveFactory(
    atype: eApgCadFactories,
  ) {
    return this.primitiveFactories.get(atype);
  }

  newLayer(
    aname: string,
    astrokeName: eApgCadDftStrokeStyles | string,
    afillName: eApgCadDftFillStyles | string,
    atextStyleName: eApgCadDftTextStyles | string,
  ) {

    const layerId = aname;
    const layerClass = "layer-" + aname.toLowerCase();
    const layer = this.svg.group(layerId)
      .class(layerClass)
      .childOfRoot(this.svg);

    const strokeStyle = this.getStrokeStyle(astrokeName as string);
    if (!strokeStyle) {
      throw new Error(
        `Stroke named ${astrokeName} not available in ApgCadSvg Stroke Styles`,
      );
    }
    layer.stroke(strokeStyle.color, strokeStyle.width);
    if (strokeStyle.dashPattern) {
      layer.strokeDashPattern(strokeStyle.dashPattern)
    }

    const fillStyle = this.getFillStyle(afillName as string);
    if (!fillStyle) {
      throw new Error(
        `Fill named ${afillName} not available in ApgCadSvg Fill Styles`,
      );
    }
    layer.fill(fillStyle.color, fillStyle.opacity);

    const textStyle = this.getTextStyle(atextStyleName as string);
    if (!textStyle) {
      throw new Error(
        `Text style named ${atextStyleName} not available in ApgCadSvg Text Styles`,
      );
    }
    layer.textStyle(textStyle, false);

    this.layers.set(aname, layer);

    const layerDef: IApgCadSvgLayerDef = {
      name: aname,
      stroke: strokeStyle,
      fill: fillStyle,
      textStyle: textStyle
    }
    this.layerDefs.set(aname, layerDef);

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


  setCurrentLayer(aname: string) {
    const g = this.getLayer(aname);
    if (g !== undefined) {
      this.currentLayer = g;
      // By default sets the current undefined so will draw directly on the layer
      this.currentGroup = undefined;
    }
    return g;
  }


  /** Clear the drawing by clearing all the layers except the Axis one. 
    * Defs, Styles and other stuff will remain */
  clearAllLayers() {
    this.layers.forEach((_layer, key) => {
      if (key != eApgCadDftLayers.CARTESIANS) {
        this.clearLayer(key);
      }
    });
  }


  /** Creates a new group on the current layer, sets it as the current group
   * and adds it to the groups library */
  newGroup(aname: string, astyleOptions: IApgCadStyleOptions) {
    const g = this.svg.group("GROUP_" + aname.toUpperCase())
      .childOf(this.currentLayer);

    if (astyleOptions.strokeName) {
      const strokeStyle = this.strokeStyles.get(astyleOptions.strokeName);
      if (strokeStyle) {
        g.stroke(strokeStyle.color, strokeStyle.width);
      }
    }

    if (astyleOptions.fillName) {
      const fillStyle = this.fillStyles.get(astyleOptions.fillName);
      if (fillStyle) {
        g.fill(fillStyle.color);
      }
    }

    if (astyleOptions.textName) {
      const textStyle = this.textStyles.get(astyleOptions.textName);
      if (textStyle) {
        if (textStyle.fill) g.fill(textStyle.fill.color)
        if (textStyle.stroke) g.stroke(textStyle.stroke.color, textStyle.stroke.width)
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


  setCurrentGroup(aname: string) {
    const g = this.getGroup(aname);
    if (g !== undefined) {
      this.currentGroup = g;
    }
    return g;
  }
  unSetCurrentGroup() {
    this.currentGroup = undefined;
  }


  newStrokeStyle(aname: string, adata: Svg.IApgSvgStrokeStyle) {
    this.strokeStyles.set(aname, adata);
  }
  getStrokeStyle(aname: string) {
    const r = this.strokeStyles.get(aname);
    return r;
  }


  newFillStyle(aname: string, adata: Svg.IApgSvgFillStyle) {
    this.fillStyles.set(aname, adata);
  }
  getFillStyle(aname: string) {
    const r = this.fillStyles.get(aname);
    return r;
  }


  newTextStyle(aname: string, atextStyle: Svg.IApgSvgTextStyle) {
    this.textStyles.set(aname, atextStyle);
  }
  getTextStyle(aname: string): Svg.IApgSvgTextStyle | undefined {
    const r: Svg.IApgSvgTextStyle | undefined = this.textStyles.get(aname);
    return r;
  }


  newBlock(anode: Svg.ApgSvgNode) {
    this.blocks.set(anode.ID, anode)
    this.blockDefs.push(anode.ID);
    this.svg.addToDefs(anode.ID, anode);
  }
  getBlock(ablockId: string) {
    return this.svg.getFromDef(ablockId);
  }


  newPattern(apattern: Svg.ApgSvgNode) {
    this.patterns.set(apattern.ID, apattern);
    this.patternsDefs.push(apattern.ID);
    this.svg.addToDefs(apattern.ID, apattern);
  }
  getPattern(aname: string) {
    return this.patterns.get(aname);
  }


  newTexture(atexture: Svg.ApgSvgNode) {
    this.textures.set(atexture.ID, atexture);
    this.textureDefs.push(atexture.ID);
    this.svg.addToDefs(atexture.ID, atexture);
  }
  getTexture(aname: string) {
    return this.textures.get(aname);
  }


  newGradient(agradient: Svg.ApgSvgNode) {
    this.gradients.set(agradient.ID, agradient);
    this.gradientsDefs.push(agradient.ID);
    this.svg.addToDefs(agradient.ID, agradient);
  }
  getGradient(aname: string) {
    return this.gradients.get(aname);
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


  getStateAsJson() {
    const r: any = {};
    r.settings = this.settings;
    r.strokeStyles = Array.from(this.strokeStyles.keys());
    r.fillStyles = Array.from(this.fillStyles.keys());
    r.textStyles = Array.from(this.textStyles.keys());
    r.gradients = Array.from(this.gradients.keys());
    r.patterns = Array.from(this.patterns.keys());
    r.textures = Array.from(this.textures.keys());
    r.blocks = Array.from(this.blocks.keys());
    r.layers = Array.from(this.layers.keys());
    r.groups = Array.from(this.groupsDefs.keys());
    return JSON.stringify(r, undefined, "  ");
  }


}
