/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */
import { eApgCadDftFillStyles } from "../../enums/eApgCadDftFillStyles.ts";
import { eApgCadDftLayers } from "../../enums/eApgCadDftLayers.ts";
import { eApgCadDftStrokeStyles } from "../../enums/eApgCadDftStrokeStyles.ts";
import { eApgCadDftTextStyles } from "../../enums/eApgCadDftTextStyles.ts";
import { ApgCadSvgBaseInitializer } from "./ApgCadSvgBaseInitializer.ts";


/** 
 * Default Layers
 */
export class ApgCadSvgLayersInitializer extends ApgCadSvgBaseInitializer {

    override build() {
        this._cad.newLayer(
            eApgCadDftLayers.BACKGROUND,
            eApgCadDftStrokeStyles.BACKGROUND,
            eApgCadDftFillStyles.BACKGROUND,
            eApgCadDftTextStyles.MONO
        );

        this._cad.newLayer(
            eApgCadDftLayers.GRIDS,
            eApgCadDftStrokeStyles.GRIDS,
            eApgCadDftFillStyles.NONE,
            eApgCadDftTextStyles.MONO
        );

        this._cad.newLayer(
            eApgCadDftLayers.CARTESIANS,
            eApgCadDftStrokeStyles.CARTESIAN,
            eApgCadDftFillStyles.NONE,
            eApgCadDftTextStyles.CARTESIAN_LABEL
        );

        this._cad.newLayer(
            eApgCadDftLayers.ANNOTATIONS,
            eApgCadDftStrokeStyles.ANNOTATIONS,
            eApgCadDftFillStyles.ANNOTATIONS,
            eApgCadDftTextStyles.ANNOTATIONS
        );

        this._cad.newLayer(
            eApgCadDftLayers.DIMENSIONS,
            eApgCadDftStrokeStyles.DIMENSIONS,
            eApgCadDftFillStyles.DIMENSIONS,
            eApgCadDftTextStyles.DIMENSIONS
        );

        this._cad.newLayer(
            eApgCadDftLayers.DEBUG,
            eApgCadDftStrokeStyles.DEBUG,
            eApgCadDftFillStyles.DEBUG,
            eApgCadDftTextStyles.DEBUG
        );

        this._cad.newLayer(
            eApgCadDftLayers.HIDDEN,
            eApgCadDftStrokeStyles.HIDDEN,
            eApgCadDftFillStyles.HIDDEN,
            eApgCadDftTextStyles.MONO
        );

        this._cad.newLayer(
            eApgCadDftLayers.ZERO,
            eApgCadDftStrokeStyles.FOREGROUND,
            eApgCadDftFillStyles.NONE,
            eApgCadDftTextStyles.DEFAULT
        );

        this._cad.newLayer(
            eApgCadDftLayers.CARTOUCHE,
            eApgCadDftStrokeStyles.CARTOUCHE,
            eApgCadDftFillStyles.CARTOUCHE,
            eApgCadDftTextStyles.TITLE
        );

    }
}