/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */
import { eApgCadDftDimArrowStyles } from "../../enums/eApgCadDftDimArrowStyles.ts";
import { eApgCadDftTextStyles } from "../../enums/eApgCadDftTextStyles.ts";
import { eApgCadPrimitiveFactoryTypes } from "../../enums/eApgCadPrimitiveFactoryTypes.ts";
import { ApgCadSvgAnnotationsFactory } from "../factories/ApgCadSvgAnnotationsFactory.ts";
import { ApgCadSvgLinearDimensionsFactory } from "../factories/ApgCadSvgLinearDimensionsFactory.ts";
import { ApgCadSvgAngularDimensionsFactory } from "../factories/ApgCadSvgAngularDimensionsFactory.ts";
import { ApgCadSvgAxisFactory } from "../factories/ApgCadSvgAxisFactory.ts";
import { ApgCadSvgBasicShapesFactory } from "../factories/ApgCadSvgBasicShapesFactory.ts";
import { ApgCadSvgBaseInitializer } from "./ApgCadSvgBaseInitializer.ts";


/** 
 * Primitives Factories
 */
export class ApgCadSvgPrimitivesFactoriesInitializer extends ApgCadSvgBaseInitializer {

    override build() {


        const basicShapes = new ApgCadSvgBasicShapesFactory(
            this._cad.svg,
            this._cad.svg.getRoot(),
        );
        this._cad.primitiveFactories.set(
            eApgCadPrimitiveFactoryTypes.BASIC_SHAPES,
            basicShapes,
        );


        const axis = new ApgCadSvgAxisFactory(
            this._cad.svg,
            this._cad.svg.getRoot(),
        );
        this._cad.primitiveFactories.set(
            eApgCadPrimitiveFactoryTypes.AXISES,
            axis,
        );


        const textStyle = this._cad.getTextStyle(eApgCadDftTextStyles.DIMENSIONS);
        const annotations = new ApgCadSvgAnnotationsFactory(
            this._cad.svg,
            this._cad.svg.getRoot(),
            textStyle!,
            eApgCadDftDimArrowStyles.MECHANICAL
        );
        this._cad.primitiveFactories.set(
            eApgCadPrimitiveFactoryTypes.ANNOTATIONS,
            annotations,
        );


        const linearDims = new ApgCadSvgLinearDimensionsFactory(
            this._cad.svg,
            this._cad.svg.getRoot()
        );
        linearDims.setup(
            this._cad.svg.getRoot(),
            20,
            eApgCadDftDimArrowStyles.MECHANICAL
        )
        this._cad.primitiveFactories.set(
            eApgCadPrimitiveFactoryTypes.LINEAR_DIMS,
            linearDims,
        );
        

        const angulardDims = new ApgCadSvgAngularDimensionsFactory(
            this._cad.svg,
            this._cad.svg.getRoot(),
            textStyle!,
            eApgCadDftDimArrowStyles.MECHANICAL,
            20
        );
        this._cad.primitiveFactories.set(
            eApgCadPrimitiveFactoryTypes.ANGULAR_DIMS,
            angulardDims,
        );

    }
}