/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */
import { eApgCadDftPatterns } from "../../enums/eApgCadDftPatterns.ts";
import { eApgCadDftStrokeStyles } from "../../enums/eApgCadDftStrokeStyles.ts";
import { ApgCadSvgBaseInitializer } from "./ApgCadSvgBaseInitializer.ts";


/** 
 * Default Patterns
 */
export class ApgCadSvgPatternsInitializer extends ApgCadSvgBaseInitializer {

    override build() {

        const stroke = this._cad.settings.grid.gridStroke;
        const strokeMajor = this._cad.settings.grid.majorGridStroke;
        const patternSize = this._cad.settings.grid.majorEvery;

        const num = patternSize / this._cad.settings.grid.gridStep;
        let ptn = this._cad.svg
            .pattern(patternSize, patternSize, eApgCadDftPatterns.BACK_GRID_LINES);
        for (let i = 0; i < num; i++) {
            const gridPosition = i * this._cad.settings.grid.gridStep;
            const l1 = this._cad.svg
                .line(0, gridPosition, patternSize, gridPosition)
                .stroke(i == 0 ? strokeMajor.color : stroke.color, i == 0 ? strokeMajor.width : stroke.width)
                .childOf(ptn);
            const l2 = this._cad.svg
                .line(gridPosition, 0, gridPosition, patternSize)
                .stroke(i == 0 ? strokeMajor.color : stroke.color, i == 0 ? strokeMajor.width : stroke.width)
                .childOf(ptn);
            
            if (this._cad.settings.grid.asDots) { 
                l1.strokeDashPattern(stroke.dashPattern!, stroke.dashOffset!);
                l2.strokeDashPattern(stroke.dashPattern!, stroke.dashOffset!);
            }
        }
        this._cad.newPattern(ptn);

        const aname1 = eApgCadDftPatterns.CHESSBOARD;
        const ptn1 = this._cad.svg
            .pattern(20, 20, aname1);
        this._cad.svg
            .rect(0, 0, 10, 10)
            .fill("black")
            .childOf(ptn1);
        this._cad.svg
            .rect(10, 10, 20, 20)
            .fill("black")
            .childOf(ptn1);
        this._cad.newPattern(ptn1);

        const aname2 = eApgCadDftPatterns.GRID1;
        const ptn2 = this._cad.svg.pattern(16, 20, aname2);
        this._cad.svg.line(0, 0, 16, 20).stroke("#444444", 5).childOf(ptn2);
        this._cad.svg.line(0, 20, 16, 0).stroke("#343434", 5).childOf(ptn2);
        this._cad.newPattern(ptn2);

        const aname3 = eApgCadDftPatterns.GRID2;
        const ptn3 = this._cad.svg.pattern(24, 32, aname3);
        this._cad.svg.line(0, 0, 24, 32).stroke("#444444", 4).childOf(ptn3);
        this._cad.svg.line(0, 24, 32, 0).stroke("#343434", 4).childOf(ptn3);
        this._cad.newPattern(ptn3);

        const aname4 = eApgCadDftPatterns.GRID3;
        const ptn4 = this._cad.svg.pattern(50, 50, aname4);
        this._cad.svg.line(0, 25, 50, 25).stroke("#0f0f0f", 5).childOf(ptn4);
        this._cad.svg.line(25, 0, 25, 50).stroke("#2f2f2f", 5).childOf(ptn4);
        this._cad.newPattern(ptn4);

        // TODO @4 APG 20221229 -- Implement this
        /* 
                <pattern id="imgpattern" x="0" y="0" width="1" height="1"
               viewBox="0 0 1024 576" preserveAspectRatio="xMidYMid slice">
        <image width="1024" height="576" xlink:href="http://calciodanese.altervista.org/alterpages/hbkgepage.jpg"/>
      </pattern>
         */
    }
}