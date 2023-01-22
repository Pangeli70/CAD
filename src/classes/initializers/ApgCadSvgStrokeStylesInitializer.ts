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
        const none: Svg.IApgSvgStrokeStyle = {
            color: eApgCadStdColors.NONE,
            width: eApgCadDftStrokeWidths.NONE_0,
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.NONE, none);

        const bkg: Svg.IApgSvgStrokeStyle = {
            color: this._cad.settings.background.strokeColor,
            width: this._cad.settings.background.strokeWidth,
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.BACKGROUND, bkg);

        const fgd: Svg.IApgSvgStrokeStyle = {
            color: this._cad.settings.foreGround.strokeColor,
            width: this._cad.settings.foreGround.strokeWidth,
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.FOREGROUND, fgd);

        const grids: Svg.IApgSvgStrokeStyle = {
            color: this._cad.settings.grid.gridStroke.color,
            width: this._cad.settings.grid.gridStroke.width,
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.GRIDS, grids);

        const cartesian: Svg.IApgSvgStrokeStyle = {
            color: this._cad.settings.cartesians.axisStroke.color,
            width: this._cad.settings.cartesians.axisStroke.width,
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.CARTESIAN, cartesian);

        const dbg: Svg.IApgSvgStrokeStyle = {
            color: eApgCadStdColors.MAGENTA,
            width: eApgCadDftStrokeWidths.MARKED_6,
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.DEBUG, dbg);

        const annots: Svg.IApgSvgStrokeStyle = {
            color: eApgCadStdColors.ORANGE,
            width: eApgCadDftStrokeWidths.THIN_2,
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.ANNOTATIONS, annots);

        const dims: Svg.IApgSvgStrokeStyle = {
            color: eApgCadStdColors.RED,
            width: eApgCadDftStrokeWidths.MILD_4,
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.DIMENSIONS, dims);


        const sym: Svg.IApgSvgStrokeStyle = {
            color: eApgCadStdColors.GRAY,
            width: eApgCadDftStrokeWidths.THIN_2,
            dashPattern: [this._cad.standardSize / 20, this._cad.standardSize / 5, this._cad.standardSize, this._cad.standardSize / 5]
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.SYMMETRY, sym);

        const symLrg: Svg.IApgSvgStrokeStyle = {
            color: eApgCadStdColors.GRAY,
            width: eApgCadDftStrokeWidths.MILD_4,
            dashPattern: [this._cad.standardSize / 10, this._cad.standardSize / 2, this._cad.standardSize * 2, this._cad.standardSize / 2]
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.SYMMETRY_LARGE, symLrg);

        const dot: Svg.IApgSvgStrokeStyle = {
            color: eApgCadStdColors.GRAY,
            width: eApgCadDftStrokeWidths.THIN_2,
            dashPattern: [this._cad.standardSize /20, this._cad.standardSize / 20]
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.DOTTED, dot);

        const dotLrg: Svg.IApgSvgStrokeStyle = {
            color: eApgCadStdColors.GRAY,
            width: eApgCadDftStrokeWidths.MILD_4,
            dashPattern: [this._cad.standardSize / 10, this._cad.standardSize / 10]
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.DOTTED_LARGE, dotLrg);

        const hdn: Svg.IApgSvgStrokeStyle = {
            color: eApgCadStdColors.GRAY,
            width: eApgCadDftStrokeWidths.MILD_4,
            dashPattern: [this._cad.standardSize / 2, this._cad.standardSize / 2]
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.HIDDEN, hdn);

        const hdnLrg: Svg.IApgSvgStrokeStyle = {
            color: eApgCadStdColors.GRAY,
            width: eApgCadDftStrokeWidths.MARKED_6,
            dashPattern: [this._cad.standardSize , this._cad.standardSize]
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.HIDDEN_LARGE, hdnLrg);

        const cart: Svg.IApgSvgStrokeStyle = {
            color: this._cad.settings.foreGround.strokeColor, 
            width: this._cad.settings.foreGround.strokeWidth,
        };
        this._cad.newStrokeStyle(eApgCadDftStrokeStyles.CARTOUCHE, cart);

    }
}