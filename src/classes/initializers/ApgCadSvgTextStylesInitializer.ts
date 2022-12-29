/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */
import { Svg } from "../../../deps.ts";

import { eApgCadDftTextStyles } from "../../enums/eApgCadDftTextStyles.ts";
import { eApgCadStdColors } from "../../enums/eApgCadStdColors.ts";
import { ApgCadSvgBaseInitializer } from "./ApgCadSvgBaseInitializer.ts";


/** 
 * Default Text Styles
 */
export class ApgCadSvgTextStylesInitializer extends ApgCadSvgBaseInitializer {

    override build() {
        const defautStyle = <Svg.IApgSvgTextStyle>{
            font: "Verdana",
            size: this._cad.standardHeight * 1,
            anchor: Svg.eApgSvgTextAnchor.start,
            italic: false,
            bold: false,
            fill: { color: eApgCadStdColors.BLACK },
            stroke: { color: "none", width: 0 },
            HWRatio: 0.51,
        };
        this._cad.newTextStyle(eApgCadDftTextStyles.DEFAULT, defautStyle);

        const debugStyle = <Svg.IApgSvgTextStyle>{
            font: "Calibri",
            size: this._cad.standardHeight * 1,
            anchor: Svg.eApgSvgTextAnchor.start,
            italic: false,
            bold: false,
            fill: { color: eApgCadStdColors.MAGENTA },
            stroke: { color: "none", width: 0 },
            HWRatio: 0.41,
        };
        this._cad.newTextStyle(eApgCadDftTextStyles.DEBUG, debugStyle);

        const monoStyle = <Svg.IApgSvgTextStyle>{
            font: "Lucida Console",
            size: this._cad.standardHeight * 1,
            anchor: Svg.eApgSvgTextAnchor.start,
            italic: false,
            bold: false,
            fill: { color: eApgCadStdColors.BLACK },
            stroke: { color: "none", width: 0 },
            HWRatio: 0.59,
        };
        this._cad.newTextStyle(eApgCadDftTextStyles.MONO, monoStyle);

        const titleStyle = <Svg.IApgSvgTextStyle>{
            font: "Arial",
            size: this._cad.standardHeight * 3,
            anchor: Svg.eApgSvgTextAnchor.middle,
            italic: false,
            bold: false,
            fill: { color: eApgCadStdColors.BLACK },
            stroke: { color: "none", width: 0 },
            HWRatio: 0.45,
        };
        this._cad.newTextStyle(eApgCadDftTextStyles.TITLE, titleStyle);

        const dimensionsType = <Svg.IApgSvgTextStyle>{
            font: "Lucida Sans Unicode",
            size: this._cad.standardHeight * 1,
            anchor: Svg.eApgSvgTextAnchor.middle,
            italic: false,
            bold: false,
            fill: { color: eApgCadStdColors.RED },
            stroke: { color: "none", width: 0 },
            HWRatio: 0.49,
        };
        this._cad.newTextStyle(eApgCadDftTextStyles.DIMENSIONS, dimensionsType);

        const axisLabelType = <Svg.IApgSvgTextStyle>{
            font: "Courier new",
            size: this._cad.standardHeight * 1,
            anchor: Svg.eApgSvgTextAnchor.middle,
            italic: false,
            bold: false,
            fill: { color: eApgCadStdColors.GRAY },
            stroke: { color: "none", width: 0 },
            HWRatio: 0.5,
        };
        this._cad.newTextStyle(eApgCadDftTextStyles.AXIS_LABEL, axisLabelType);
    }
}