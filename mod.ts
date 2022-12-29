/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * ------------------------------------------------------------------------
 */
export type { IApgCadInstruction } from "./src/interfaces/IApgCadInstruction.ts";
export type { IApgCadSvgAxis } from "./src/interfaces/IApgCadSvgAxis.ts";
export type { IApgCadSvgBackground } from "./src/interfaces/IApgCadSvgBackground.ts";
export type { IApgCadSvgLayerDef } from "./src/interfaces/IApgCadSvgLayerDef.ts";
export type { IApgCadSvgSettings } from "./src/interfaces/IApgCadSvgSettings.ts";
export type { IApgCadSvgViewBox } from "./src/interfaces/IApgCadSvgViewBox.ts";

export { eApgCadOrientations } from "./src/enums/eApgCadOrientations.ts";
export { eApgCadStdColors } from "./src/enums/eApgCadStdColors.ts";
export { eApgCadViews } from "./src/enums/eApgCadViews.ts";
export { eApgCadLinearDimensionTypes } from "./src/enums/eApgCadLinearDimensionTypes.ts";
export { eApgCadDftLayers } from "./src/enums/eApgCadDftLayers.ts";
export { eApgCadDftLineStyles } from "./src/enums/eApgCadDftLineStyles.ts";
export { eApgCadDftTextStyles } from "./src/enums/eApgCadDftTextStyles.ts";
export { eApgCadDftDimArrowStyles } from "./src/enums/eApgCadDftDimArrowStyles.ts";
export { eApgCadInstructionTypes } from "./src/enums/eApgCadInstructionTypes.ts";
export { eApgCadPrimitiveFactoryTypes} from "./src/enums/eApgCadPrimitiveFactoryTypes.ts";

export { ApgCadSvg } from "./src/classes/ApgCadSvg.ts";
export { ApgCadSvgUtils } from "./src/classes/ApgCadSvgUtils.ts";
export { ApgCadInstructionsSet } from "./src/classes/ApgCadInstructionsSet.ts";

export { ApgCadSvgPrimitivesFactory } from "./src/classes/factories/ApgCadSvgPrimitivesFactory.ts";
export { ApgCadSvgBasicShapesFactory } from "./src/classes/factories/ApgCadSvgBasicShapesFactory.ts";
export { ApgCadSvgAxisFactory } from "./src/classes/factories/ApgCadSvgAxisFactory.ts";
export { ApgCadSvgLinearDimensionsFactory } from "./src/classes/factories/ApgCadSvgLinearDimensionsFactory.ts";
export { ApgCadSvgAngularDimensionsFactory } from "./src/classes/factories/ApgCadSvgAngularDimensionsFactory.ts";
export { ApgCadSvgAnnotationsFactory } from "./src/classes/factories/ApgCadSvgAnnotationsFactory.ts";