/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.5 [APG 2023/02/12]
 * ------------------------------------------------------------------------
 */

export { ApgCadSvg } from "./src/classes/ApgCadSvg.ts";
export { ApgCadSvgUtils } from "./src/classes/ApgCadSvgUtils.ts";

export { ApgCadSvgAngularDimensionsFactory } from "./src/classes/factories/ApgCadSvgAngularDimensionsFactory.ts";
export { ApgCadSvgAnnotationsFactory } from "./src/classes/factories/ApgCadSvgAnnotationsFactory.ts";
export { ApgCadSvgArcDimensionsFactory } from "./src/classes/factories/ApgCadSvgArcDimensionsFactory.ts";
export { ApgCadSvgBasicShapesFactory } from "./src/classes/factories/ApgCadSvgBasicShapesFactory.ts";
export { ApgCadSvgCartesiansFactory } from "./src/classes/factories/ApgCadSvgCartesiansFactory.ts";
export { ApgCadSvgDimensionsFactoryBase } from "./src/classes/factories/ApgCadSvgDimensionsFactoryBase.ts";
export { ApgCadSvgFactoryBase } from "./src/classes/factories/ApgCadSvgFactoryBase.ts";
export { ApgCadSvgGridFactory } from "./src/classes/factories/ApgCadSvgGridFactory.ts";
export { ApgCadSvgLinearDimensionsFactory } from "./src/classes/factories/ApgCadSvgLinearDimensionsFactory.ts";

export { eApgCadArcDimensionTypes } from "./src/enums/eApgCadArcDimensionTypes.ts";
export { eApgCadCartesianMode } from "./src/enums/eApgCadCartesianMode.ts"
export { eApgCadDftDimArrowStyles } from "./src/enums/eApgCadDftDimArrowStyles.ts";
export { eApgCadDftFillOpacities } from "./src/enums/eApgCadDftFillOpacities.ts";
export { eApgCadDftFillStyles } from "./src/enums/eApgCadDftFillStyles.ts";
export { eApgCadDftGradients } from "./src/enums/eApgCadDftGradients.ts";
export { eApgCadDftLayers } from "./src/enums/eApgCadDftLayers.ts";
export { eApgCadDftPatterns } from "./src/enums/eApgCadDftPatterns.ts";
export { eApgCadDftStrokeStyles } from "./src/enums/eApgCadDftStrokeStyles.ts";
export { eApgCadDftStrokeWidths } from "./src/enums/eApgCadDftStrokeWidths.ts";
export { eApgCadDftTextStyles } from "./src/enums/eApgCadDftTextStyles.ts";
export { eApgCadDftTextures } from "./src/enums/eApgCadDftTextures.ts";
export { eApgCadFactories } from "./src/enums/eApgCadFactories.ts";
export { eApgCadGridMode } from "./src/enums/eApgCadGridMode.ts"
export { eApgCadLinearDimensionTypes } from "./src/enums/eApgCadLinearDimensionTypes.ts";
export { eApgCadOrientations } from "./src/enums/eApgCadOrientations.ts";
export { eApgCadStdColors } from "./src/enums/eApgCadStdColors.ts";
export { eApgCadViews } from "./src/enums/eApgCadViews.ts";

export type { IApgCadDimension } from "./src/interfaces/IApgCadDimension.ts";
export type { IApgCadStyleOptions } from "./src/interfaces/IApgCadStyleOptions.ts";
export type { IApgCadSvgCartesians } from "./src/interfaces/IApgCadSvgCartesians.ts";
export type { IApgCadSvgGrid } from "./src/interfaces/IApgCadSvgGrid.ts";
export type { IApgCadSvgGround } from "./src/interfaces/IApgCadSvgGround.ts";
export type { IApgCadSvgLayerDef } from "./src/interfaces/IApgCadSvgLayerDef.ts";
export type { IApgCadSvgOptions } from "./src/interfaces/IApgCadSvgOptions.ts";
export type { IApgCadSvgSettings } from "./src/interfaces/IApgCadSvgSettings.ts";
export type { IApgCadSvgViewBox } from "./src/interfaces/IApgCadSvgViewBox.ts";

export * as Test from "./test.ts";