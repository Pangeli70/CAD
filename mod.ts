/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * ------------------------------------------------------------------------
 */
export type { IApgCadSvgAxis } from "./src/interfaces/IApgCadSvgAxis.ts";
export type { IApgCadSvgBackground } from "./src/interfaces/IApgCadSvgBackground.ts";
export type { IApgCadSvgLayerDef } from "./src/interfaces/IApgCadSvgLayerDef.ts";
export type { IApgCadSvgSettings } from "./src/interfaces/IApgCadSvgSettings.ts";
export type { IApgCadSvgTextStyle } from "./src/interfaces/IApgCadSvgTextStyle.ts";
export type { IApgCadSvgViewBox } from "./src/interfaces/IApgCadSvgViewBox.ts";

export { eApgCadOrientations } from "./src/enums/eApgCadOrientations.ts";
export { eApgCadStdColors } from "./src/enums/eApgCadStdColors.ts";
export { eApgCadViews } from "./src/enums/eApgCadViews.ts";
export { eApgCadLinearDimensionTypes } from "./src/enums/eApgCadLinearDimensionTypes.ts";
export { eApgCadDftLayers } from "./src/enums/eApgCadDftLayers.ts";
export { eApgCadDftLineStyles } from "./src/enums/eApgCadDftLineStyles.ts";
export { eApgCadDftDimTerminatorStyles } from "./src/enums/eApgCadDftDimTerminatorStyles.ts";
export { eApgCadInstructionTypes } from "./src/enums/eApgCadInstructionTypes.ts";
export { eApgCadSvgPrimitiveFactoryTypes} from "./src/enums/eApgCadSvgPrimitiveFactoryTypes.ts";

// Warning!! Th fuck damn order matters!!!
export { ApgCadSvgPrimitivesFactory } from "./src/classes/ApgCadSvgPrimitivesFactory.ts";
export { ApgCadSvgBasicShapesFactory } from "./src/classes/ApgCadSvgBasicShapesFactory.ts";
export { ApgCadSvgAxisFactory } from "./src/classes/ApgCadSvgAxisFactory.ts";
export { ApgCadSvgLinearDimensionsFactory } from "./src/classes/ApgCadSvgLinearDimensionsFactory.ts";
export { ApgCadSvg } from "./src/classes/ApgCadSvg.ts";
