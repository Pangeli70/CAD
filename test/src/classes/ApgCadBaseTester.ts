/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
*/

import { A2D, Svg } from "../../../deps.ts";
import { ApgCadSvg } from "../../../src/classes/ApgCadSvg.ts";
import { eApgCadStdColors } from "../../../src/enums/eApgCadStdColors.ts";
import { eApgCadTestLayers } from "../enums/eApgCadTestLayers.ts";

export abstract class ApgCadBaseTester {

    private static _minRange = 0;
    private static _maxRange = 4000;
    private static _minN = 3;
    private static _maxN = 20;


    static SetMinMaxN(amin: number, amax: number) {
        this._minN = amin;
        this._maxN = amax;
    }

    static SetMinMaxRange(amin: number, amax: number) {
        this._minRange = amin;
        this._maxRange = amax;
    }

    protected static randomInt(aminVal: number, amaxVal: number) {
        return Math.round(Math.random() * (amaxVal - aminVal)) + aminVal;
    }

    protected static randomInN() {
        return this.randomInt(this._minN, this._maxN);
    }

    protected static randomInRange() {
        return this.randomInt(this._maxRange, this._maxRange);
    }

    protected static randomLayer(alayers: Svg.ApgSvgNode[]) {
        return "T" + this.randomInt(1, alayers.length).toString();
    }

    protected static getLayerName(alayer: eApgCadTestLayers) {
        return "T" + (alayer + 1).toString();
    }

    protected static randomPoint(aminVal: number, maxVal: number) {
        const cx = this.randomInt(aminVal, maxVal);
        const cy = this.randomInt(aminVal, maxVal);
        const cp = new A2D.Apg2DPoint(cx, cy);
        return cp;
    }

    protected static randomPointInRange() {
        return this.randomPoint(this._minRange, this._maxRange);
    }

    protected static buildTestLayers(acad: ApgCadSvg) {

        const r: Svg.ApgSvgNode[] = [];

        acad.newStrokeStyle('GreenPen', {
            color: eApgCadStdColors.GREEN,
            width: 4
        });
        acad.newFillStyle('GreenBrush', {
            color: eApgCadStdColors.GREEN,
            opacity: 1
        });
        const layer1 = acad.newLayer('T1', 'GreenPen', 'GreenBrush');
        r.push(layer1);


        acad.newStrokeStyle('RedPen', {
            color: eApgCadStdColors.RED,
            width: 4
        });
        acad.newFillStyle('RedBrush', {
            color: eApgCadStdColors.RED,
            opacity: 1
        });
        const layer2 = acad.newLayer('T2', 'RedPen', 'RedBrush');
        r.push(layer2);


        acad.newStrokeStyle('BluePen', {
            color: eApgCadStdColors.BLUE,
            width: 4
        });
        acad.newFillStyle('BlueBrush', {
            color: eApgCadStdColors.BLUE,
            opacity: 1
        });
        const layer3 = acad.newLayer('T3', 'BluePen', 'BlueBrush');
        r.push(layer3);


        acad.newStrokeStyle('MagentaPen', {
            color: eApgCadStdColors.MAGENTA,
            width: 4
        });
        acad.newFillStyle('MagentaBrush', {
            color: eApgCadStdColors.MAGENTA,
            opacity: 1
        });
        const layer4 = acad.newLayer('T4', 'MagentaPen', 'MagentaBrush');
        r.push(layer4);

        acad.newStrokeStyle('YellowPen', {
            color: eApgCadStdColors.YELLOW,
            width: 4
        });
        acad.newFillStyle('YellowBrush', {
            color: eApgCadStdColors.YELLOW,
            opacity: 1
        });
        const layer5 = acad.newLayer('T5', 'YellowPen', 'YellowBrush');
        r.push(layer5);

        return r;
    }

    protected static notImplemented(acad: ApgCadSvg) {
        const mid = (this._maxRange - this._maxRange) / 2;
        acad.svg
            .text(mid, mid, 'NOT YET IMPLEMENTED')
            .childOf(acad.currentLayer);
    }

}