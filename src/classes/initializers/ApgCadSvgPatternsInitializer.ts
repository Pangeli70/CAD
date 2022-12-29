/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */
import { eApgCadDftPatterns } from "../../enums/eApgCadDftPatterns.ts";
import { ApgCadSvgBaseInitializer } from "./ApgCadSvgBaseInitializer.ts";


/** 
 * Default Patterns
 */
export class ApgCadSvgPatternsInitializer extends ApgCadSvgBaseInitializer {

    override build() {
        const aname1 = eApgCadDftPatterns.CHESSBOARD;
        const ptn1 = this._cad.svg.pattern(0, 0, 20, 20, aname1);
        this._cad.svg.rect(0, 0, 10, 10).fill("black").childOf(ptn1);
        this._cad.svg.rect(10, 10, 20, 20).fill("black").childOf(ptn1);
        this._cad.newPattern(aname1, ptn1);

        const aname2 = eApgCadDftPatterns.GRID1;
        const ptn2 = this._cad.svg.pattern(0, 0, 8, 10, aname2);
        this._cad.svg.line(0, 0, 8, 10).stroke("#444444", 2.5).childOf(ptn2);
        this._cad.svg.line(0, 10, 8, 0).stroke("#343434", 2.5).childOf(ptn2);
        this._cad.newPattern(aname2, ptn2);

        const aname3 = eApgCadDftPatterns.GRID2;
        const ptn3 = this._cad.svg.pattern(0, 0, 12, 16, aname3);
        this._cad.svg.line(0, 0, 12, 16).stroke("#444444", 2).childOf(ptn3);
        this._cad.svg.line(0, 16, 12, 0).stroke("#343434", 2).childOf(ptn3);
        this._cad.newPattern(aname3, ptn3);

        const aname4 = eApgCadDftPatterns.GRID3;
        const ptn4 = this._cad.svg.pattern(0, 0, 50, 50, aname4);
        this._cad.svg.line(0, 25, 50, 25).stroke("#0f0f0f", 3).childOf(ptn4);
        this._cad.svg.line(25, 0, 25, 50).stroke("#2f2f2f", 3).childOf(ptn4);
        this._cad.newPattern(aname4, ptn4);

        // TODO @4 APG 20221229 -- Implement this
        /* 
                <pattern id="imgpattern" x="0" y="0" width="1" height="1"
               viewBox="0 0 1024 576" preserveAspectRatio="xMidYMid slice">
        <image width="1024" height="576" xlink:href="http://calciodanese.altervista.org/alterpages/hbkgepage.jpg"/>
      </pattern>
         */
    }
}