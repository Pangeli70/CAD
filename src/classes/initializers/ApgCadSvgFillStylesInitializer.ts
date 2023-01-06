/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */
import { Svg } from "../../../deps.ts";
import { eApgCadDftFillOpacities } from "../../enums/eApgCadDftFillOpacities.ts";
import { eApgCadDftFillStyles } from "../../enums/eApgCadDftFillStyles.ts";
import { eApgCadStdColors } from "../../enums/eApgCadStdColors.ts";
import { ApgCadSvgBaseInitializer } from "./ApgCadSvgBaseInitializer.ts";


/** 
 * Default Fill Styles
 */
export class ApgCadSvgFillStylesInitializer extends ApgCadSvgBaseInitializer {

    override build() {
        const fillNone = <Svg.IApgSvgFillStyle>{
            color: eApgCadStdColors.NONE,
            opacity: eApgCadDftFillOpacities.TRANSPARENT,
        };
        this._cad.newFillStyle(eApgCadDftFillStyles.NONE, fillNone);

        const bkg = <Svg.IApgSvgFillStyle>{
            color: this._cad.settings.background.fillColor,
            opacity: eApgCadDftFillOpacities.OPAQUE,
        };
        this._cad.newFillStyle(eApgCadDftFillStyles.BACKGROUND, bkg);

        const fgd = <Svg.IApgSvgFillStyle>{
            color: this._cad.settings.foreGround.fillColor,
            opacity: eApgCadDftFillOpacities.OPAQUE,
        };
        this._cad.newFillStyle(eApgCadDftFillStyles.FOREGROUND, fgd);

        const dbg = <Svg.IApgSvgFillStyle>{
            color: eApgCadStdColors.MAGENTA,
            opacity: eApgCadDftFillOpacities.OPAQUE,
        };
        this._cad.newFillStyle(eApgCadDftFillStyles.DEBUG, dbg);

        const hdn = <Svg.IApgSvgFillStyle>{
            color: eApgCadStdColors.GRAY,
            opacity: eApgCadDftFillOpacities.SEMI,
        };
        this._cad.newFillStyle(eApgCadDftFillStyles.HIDDEN, hdn);

        const dim = <Svg.IApgSvgFillStyle>{
            color: eApgCadStdColors.RED,
            opacity: eApgCadDftFillOpacities.OPAQUE,
        };
        this._cad.newFillStyle(eApgCadDftFillStyles.DIMENSIONS, dim);

        const annot = <Svg.IApgSvgFillStyle>{
            color: eApgCadStdColors.ORANGE,
            opacity: eApgCadDftFillOpacities.OPAQUE,
        };
        this._cad.newFillStyle(eApgCadDftFillStyles.ANNOTATIONS, annot);
   
        const cart = <Svg.IApgSvgFillStyle>{
            color: this._cad.settings.foreGround.fillColor,
            opacity: eApgCadDftFillOpacities.OPAQUE,
        };
        this._cad.newFillStyle(eApgCadDftFillStyles.CARTOUCHE, cart);

    }
}