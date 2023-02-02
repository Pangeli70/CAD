/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * @version 0.9.4 [APG 2023/01/04] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { eApgCadDftDimArrowStyles } from "../../enums/eApgCadDftDimArrowStyles.ts";
import { eApgCadDftTextStyles } from "../../enums/eApgCadDftTextStyles.ts";
import { eApgCadFactories } from "../../enums/eApgCadFactories.ts";
import { ApgCadSvgAnnotationsFactory } from "../factories/ApgCadSvgAnnotationsFactory.ts";
import { ApgCadSvgLinearDimensionsFactory } from "../factories/ApgCadSvgLinearDimensionsFactory.ts";
import { ApgCadSvgAngularDimensionsFactory } from "../factories/ApgCadSvgAngularDimensionsFactory.ts";
import { ApgCadSvgCartesiansFactory } from "../factories/ApgCadSvgCartesiansFactory.ts";
import { ApgCadSvgBasicShapesFactory } from "../factories/ApgCadSvgBasicShapesFactory.ts";
import { ApgCadSvgBaseInitializer } from "./ApgCadSvgBaseInitializer.ts";
import { ApgCadSvgGridFactory } from "../factories/ApgCadSvgGridFactory.ts";
import { ApgCadSvgArcDimensionsFactory } from "../factories/ApgCadSvgArcDimensionsFactory.ts";


/** 
 * Primitives Factories
 */
export class ApgCadSvgPrimitivesFactoriesInitializer extends ApgCadSvgBaseInitializer {

    override build() {


        const basicShapes = new ApgCadSvgBasicShapesFactory(this._cad);
        this._cad.primitiveFactories.set(eApgCadFactories.BASIC_SHAPES, basicShapes,);

        const grid = new ApgCadSvgGridFactory(this._cad);
        this._cad.primitiveFactories.set(eApgCadFactories.GRIDS, grid,);

        const cartesians = new ApgCadSvgCartesiansFactory(this._cad);
        this._cad.primitiveFactories.set(eApgCadFactories.CARTESIANS, cartesians,);

        const annotationsTextStyle = this._cad.getTextStyle(eApgCadDftTextStyles.ANNOTATIONS);
        const annotations = new ApgCadSvgAnnotationsFactory(
            this._cad,
            annotationsTextStyle!,
            eApgCadDftDimArrowStyles.MECHANICAL
        );
        this._cad.primitiveFactories.set(eApgCadFactories.ANNOTATIONS, annotations,);

        const dimensionsTextStyle = this._cad.getTextStyle(eApgCadDftTextStyles.DIMENSIONS);
        const linearDims = new ApgCadSvgLinearDimensionsFactory(
            this._cad,
            dimensionsTextStyle!,
            eApgCadDftDimArrowStyles.MECHANICAL,
            4
        )
        this._cad.primitiveFactories.set(eApgCadFactories.LINEAR_DIMS, linearDims,);

        const arcDims = new ApgCadSvgArcDimensionsFactory(
            this._cad,
            dimensionsTextStyle!,
            eApgCadDftDimArrowStyles.MECHANICAL,
            4
        )
        this._cad.primitiveFactories.set(eApgCadFactories.ARC_DIMS, arcDims,);

        const angulardDims = new ApgCadSvgAngularDimensionsFactory(
            this._cad,
            dimensionsTextStyle!,
            eApgCadDftDimArrowStyles.MECHANICAL
        );
        this._cad.primitiveFactories.set(eApgCadFactories.ANGULAR_DIMS, angulardDims,);

    }
}