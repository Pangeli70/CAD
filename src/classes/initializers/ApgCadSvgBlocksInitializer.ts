/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */
import { A2D } from "../../../deps.ts";
import { eApgCadDftDimArrowStyles } from "../../enums/eApgCadDftDimArrowStyles.ts";
import { eApgCadStdColors } from "../../enums/eApgCadStdColors.ts";
import { ApgCadSvgBaseInitializer } from "./ApgCadSvgBaseInitializer.ts";


/** 
 * Default Blocks
 */
export class ApgCadSvgBlocksInitializer extends ApgCadSvgBaseInitializer {

    override build() {
        const size = this._cad.standardSize;
        const ratio = 1 / 4;

        const mechPts: A2D.Apg2DPoint[] = [
            new A2D.Apg2DPoint(0, 0),
            new A2D.Apg2DPoint(size, -size * ratio),
            new A2D.Apg2DPoint(size, size * ratio),
        ];
        const mechArrow = this._cad.svg
            .polygon(mechPts, eApgCadDftDimArrowStyles.MECHANICAL)
            .stroke(eApgCadStdColors.NONE, 0);
        this._cad.newBlock(mechArrow);

        const pts = [mechPts[1], mechPts[0], mechPts[2]]
        const simpleArrow = this._cad.svg
            .polyline(pts, eApgCadDftDimArrowStyles.SIMPLE)
            .fill(eApgCadStdColors.NONE)
        this._cad.newBlock(simpleArrow);

        const archPts: A2D.Apg2DPoint[] = [
            new A2D.Apg2DPoint(-size * ratio / 1, -size / 2),
            new A2D.Apg2DPoint(size * ratio / 1, size / 2),
        ];
        const archArrow = this._cad.svg
            .line(archPts[0].x, archPts[0].y, archPts[1].x, archPts[1].y, eApgCadDftDimArrowStyles.ARCHITECTURAL);
        this._cad.newBlock(archArrow);

        const dotArrow = this._cad.svg
            .circle(0, 0, size * ratio, eApgCadDftDimArrowStyles.DOT)
            .stroke(eApgCadStdColors.NONE, 0);
        this._cad.newBlock(dotArrow);

    }
}