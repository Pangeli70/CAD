/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */
import { eApgCadDftFillStyles } from "../../enums/eApgCadDftFillStyles.ts";
import { eApgCadDftLayers } from "../../enums/eApgCadDftLayers.ts";
import { eApgCadDftStrokeStyles } from "../../enums/eApgCadDftStrokeStyles.ts";
import { ApgCadSvgBaseInitializer } from "./ApgCadSvgBaseInitializer.ts";


/** 
 * Default Layers
 */
export class ApgCadSvgLayersInitializer extends ApgCadSvgBaseInitializer {

    override build() {
        this._cad.newLayer(
            eApgCadDftLayers.BACKGROUND,
            eApgCadDftStrokeStyles.BACKGROUND,
            eApgCadDftFillStyles.BACKGROUND
        );

        this._cad.newLayer(
            eApgCadDftLayers.AXISES,
            eApgCadDftStrokeStyles.AXIS
        );

        this._cad.newLayer(
            eApgCadDftLayers.DIMENSIONS,
            eApgCadDftStrokeStyles.DIMENSIONS,
            eApgCadDftFillStyles.DIMENSIONS
        );

        this._cad.newLayer(
            eApgCadDftLayers.DEBUG,
            eApgCadDftStrokeStyles.DEBUG,
            eApgCadDftFillStyles.DEBUG
        );

        this._cad.newLayer(
            eApgCadDftLayers.HIDDEN,
            eApgCadDftStrokeStyles.HIDDEN,
            eApgCadDftFillStyles.HIDDEN
        );

        this._cad.newLayer(
            eApgCadDftLayers.ZERO,
            eApgCadDftStrokeStyles.MARKED_BLUE,
            eApgCadDftFillStyles.NONE
        );

    }
}