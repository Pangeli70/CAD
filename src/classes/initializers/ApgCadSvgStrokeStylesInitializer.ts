/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */
import { Svg } from "../../../deps.ts";
import { eApgCadDftStrokeStyles } from "../../enums/eApgCadDftStrokeStyles.ts";
import { eApgCadDftStrokeWidths } from "../../enums/eApgCadDftStrokeWidths.ts";
import { eApgCadStdColors } from "../../enums/eApgCadStdColors.ts";
import { ApgCadSvgBaseInitializer } from "./ApgCadSvgBaseInitializer.ts";


/** 
 * Default Stroke Styles
 */
export class ApgCadSvgStrokeStylesInitializer extends ApgCadSvgBaseInitializer {

    override build() {
        const none = <Svg.IApgSvgStrokeStyle>{
            color: eApgCadStdColors.NONE,
            width: eApgCadDftStrokeWidths.NONE,
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.NONE, none);

        const bkg = <Svg.IApgSvgStrokeStyle>{
            color: this._cad.settings.background.borderColor,
            width: this._cad.settings.background.borderWidth,
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.BACKGROUND, bkg);

        const axis = <Svg.IApgSvgStrokeStyle>{
            color: this._cad.settings.axis.axisStroke.color,
            width: this._cad.settings.axis.axisStroke.width,
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.AXIS, axis);

        const dbg = <Svg.IApgSvgStrokeStyle>{
            color: eApgCadStdColors.MAGENTA,
            width: eApgCadDftStrokeWidths.MARKED,
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.DEBUG, dbg);

        const dft = <Svg.IApgSvgStrokeStyle>{
            color: eApgCadStdColors.GRAY,
            width: eApgCadDftStrokeWidths.MILD,
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.DEFAULT, dft);

        const dims = <Svg.IApgSvgStrokeStyle>{
            color: eApgCadStdColors.RED,
            width: eApgCadDftStrokeWidths.THIN,
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.DIMENSIONS, dims);

        const hdn = <Svg.IApgSvgStrokeStyle>{
            color: eApgCadStdColors.GRAY,
            width: eApgCadDftStrokeWidths.THIN,
            dashPattern: [5, 5]
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.HIDDEN, hdn);

        const mkdBlue = <Svg.IApgSvgStrokeStyle>{
            color: eApgCadStdColors.BLUE,
            width: eApgCadDftStrokeWidths.MARKED,
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.MARKED_BLUE, mkdBlue);
    }
}