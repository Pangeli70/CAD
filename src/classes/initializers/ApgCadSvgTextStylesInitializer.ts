/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */
import { Svg } from "../../../deps.ts";
import { eApgCadDftFillStyles } from "../../enums/eApgCadDftFillStyles.ts";
import { eApgCadDftStrokeStyles } from "../../enums/eApgCadDftStrokeStyles.ts";
import { eApgCadDftStrokeWidths } from "../../enums/eApgCadDftStrokeWidths.ts";

import { eApgCadDftTextStyles } from "../../enums/eApgCadDftTextStyles.ts";
import { eApgCadStdColors } from "../../enums/eApgCadStdColors.ts";
import { ApgCadSvgBaseInitializer } from "./ApgCadSvgBaseInitializer.ts";


/** 
 * Default Text Styles
 */
export class ApgCadSvgTextStylesInitializer extends ApgCadSvgBaseInitializer {

    override build() {

        const noneStroke = this._cad.strokeStyles.get(eApgCadDftStrokeStyles.NONE);

        const defaultFill = this._cad.fillStyles.get(eApgCadDftFillStyles.FOREGROUND);
        const defautStyle: Svg.IApgSvgTextStyle = {
            font: "Verdana, Geneva, sans-serif",
            size: this._cad.standardSize,
            anchor: Svg.eApgSvgTextAnchor.start,
            aspectRatio: 0.549,
            fill: defaultFill!,
        };
        this._cad.newTextStyle(eApgCadDftTextStyles.DEFAULT, defautStyle);

        const debugFill = this._cad.fillStyles.get(eApgCadDftFillStyles.DEBUG);
        const debugStyle: Svg.IApgSvgTextStyle = {
            font: "Tahoma, Geneva, sans- serif",
            size: this._cad.standardSize /2,
            anchor: Svg.eApgSvgTextAnchor.start,
            italic: true,
            aspectRatio: 0.475,
            fill: debugFill!,
            stroke: noneStroke
        };
        this._cad.newTextStyle(eApgCadDftTextStyles.DEBUG, debugStyle);

        const monoFill = this._cad.fillStyles.get(eApgCadDftFillStyles.FOREGROUND);
        const monoStyle: Svg.IApgSvgTextStyle = {
            font: "Courier New, Courier, monospace",
            size: this._cad.standardSize,
            anchor: Svg.eApgSvgTextAnchor.start,
            aspectRatio: 0.60,
            fill: monoFill!,
        };
        this._cad.newTextStyle(eApgCadDftTextStyles.MONO, monoStyle);

        const titleFill = this._cad.fillStyles.get(eApgCadDftFillStyles.FOREGROUND);
        const titleStyle: Svg.IApgSvgTextStyle = {
            font: "Arial, Helvetica, sans-serif",
            size: this._cad.standardSize * 2,
            bold: true,
            anchor: Svg.eApgSvgTextAnchor.middle,
            aspectRatio: 0.51,
            fill: titleFill!,
        };
        this._cad.newTextStyle(eApgCadDftTextStyles.TITLE, titleStyle);

        const dimensionsFill = this._cad.fillStyles.get(eApgCadDftFillStyles.DIMENSIONS);
        const dimensionsStyle: Svg.IApgSvgTextStyle = {
            font: "Lucida Console, Monaco, monospace",
            size: this._cad.standardSize,
            anchor: Svg.eApgSvgTextAnchor.middle,
            aspectRatio: 0.6,
            fill: dimensionsFill!,
        };
        this._cad.newTextStyle(eApgCadDftTextStyles.DIMENSIONS, dimensionsStyle);

        const annotationsFill = this._cad.fillStyles.get(eApgCadDftFillStyles.ANNOTATIONS);
        const annotationsStyle: Svg.IApgSvgTextStyle = {
            font: "Lucida Sans Unicode, Lucida Grande, sans-serif",
            size: this._cad.standardSize,
            italic: true,
            anchor: Svg.eApgSvgTextAnchor.start,
            aspectRatio: 0.515,
            fill: annotationsFill!
        };
        this._cad.newTextStyle(eApgCadDftTextStyles.ANNOTATIONS, annotationsStyle);

        const cartesianStroke = this._cad.strokeStyles.get(eApgCadDftStrokeStyles.CARTESIAN);
        const cartesianFill = { color: cartesianStroke!.color, opacity: 1 }
        const axisLabelStyle: Svg.IApgSvgTextStyle = {
            font: "Courier New, Courier, monospace",
            size: this._cad.standardSize,
            anchor: Svg.eApgSvgTextAnchor.middle,
            italic: true,
            aspectRatio: 0.6,
            fill: cartesianFill!,
        };
        this._cad.newTextStyle(eApgCadDftTextStyles.CARTESIAN_LABEL, axisLabelStyle);
    }
}