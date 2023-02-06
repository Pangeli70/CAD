/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * @version 0.9.4 [APG 2023/01/22] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { Svg } from "../../../deps.ts";
import { eApgCadDftPatterns } from "../../enums/eApgCadDftPatterns.ts";
import { eApgCadDftStrokeStyles } from "../../enums/eApgCadDftStrokeStyles.ts";
import { ApgCadSvgBaseInitializer } from "./ApgCadSvgBaseInitializer.ts";


/** 
 * Default Patterns
 */
export class ApgCadSvgPatternsInitializer extends ApgCadSvgBaseInitializer {

    override build() {

        const dftGridPattern = this.#gridPattern(eApgCadDftPatterns.BACK_GRID_LINES, false);
        this._cad.newPattern(dftGridPattern);

        const dotsGridPattern = this.#gridPattern(eApgCadDftPatterns.BACK_GRID_LINES_AS_DOTS, true);
        this._cad.newPattern(dotsGridPattern);

        const hatchBuilder = new Svg.ApgSvgHatchBuilder(this._cad.svg);
        const stroke1 = this._cad.getStrokeStyle(eApgCadDftStrokeStyles.HATCH_BROWN);
        const stroke2 = this._cad.getStrokeStyle(eApgCadDftStrokeStyles.HATCH_GREEN);

        // Cross patterns

        let p = hatchBuilder.cross(eApgCadDftPatterns.CROSS1, 100, 100, stroke1);
        this._cad.newPattern(p);

        p = hatchBuilder.cross(eApgCadDftPatterns.CROSS2, 250, 250, stroke2);
        this._cad.newPattern(p);


        // Saltire patterns

        p = hatchBuilder.saltire(eApgCadDftPatterns.SALTIRE1, 100, 100, stroke1);
        this._cad.newPattern(p);

        p = hatchBuilder.saltire(eApgCadDftPatterns.SALTIRE2, 200, 200, stroke2);
        this._cad.newPattern(p);


        // Diagonal patterns

        p = hatchBuilder.diagonal(eApgCadDftPatterns.DIAGONAL1, 100, 100, stroke1);
        this._cad.newPattern(p);

        p = hatchBuilder.diagonal(eApgCadDftPatterns.DIAGONAL2, 250, 250, stroke2);
        this._cad.newPattern(p);


        // Floor patterns

        p = hatchBuilder.floor(eApgCadDftPatterns.FLOOR1, 100, 100, stroke1);
        this._cad.newPattern(p);

        p = hatchBuilder.floor(eApgCadDftPatterns.FLOOR2, 300, 200, stroke2);
        this._cad.newPattern(p);

        // Brick patterns

        p = hatchBuilder.bricks(eApgCadDftPatterns.BRICK1, 100, 100, stroke1);
        this._cad.newPattern(p);

        p = hatchBuilder.bricks(eApgCadDftPatterns.BRICK2, 250, 200, stroke2);
        this._cad.newPattern(p);


        // Roof patterns

        p = hatchBuilder.roof(eApgCadDftPatterns.ROOF1, 100, 100, stroke1);
        this._cad.newPattern(p);

        p = hatchBuilder.roof(eApgCadDftPatterns.ROOF2, 150, 200, stroke2);
        this._cad.newPattern(p);

        // Roof tile patterns

        p = hatchBuilder.roofTiles(eApgCadDftPatterns.ROOF_TILES1, 100, 100, stroke1);
        this._cad.newPattern(p);

        p = hatchBuilder.roofTiles(eApgCadDftPatterns.ROOF_TILES2, 150, 200, stroke2);
        this._cad.newPattern(p);



        // TODO @4 APG 20221229 -- Implement this
        /* 
                <pattern id="imgpattern" x="0" y="0" width="1" height="1"
               viewBox="0 0 1024 576" preserveAspectRatio="xMidYMid slice">
        <image width="1024" height="576" xlink:href="http://calciodanese.altervista.org/alterpages/hbkgepage.jpg"/>
      </pattern>
         */
    }




    #gridPattern(aname: string, aasDots: boolean) {
        const stroke = this._cad.settings.grid.gridStroke;
        const strokeMajor = this._cad.settings.grid.majorGridStroke;
        const patternSize = this._cad.settings.grid.majorEvery;

        const num = patternSize / this._cad.settings.grid.gridStep;
        const r = this._cad.svg
            .pattern(patternSize, patternSize, aname);
        for (let i = 0; i < num; i++) {
            const gridPosition = i * this._cad.settings.grid.gridStep;
            const l1 = this._cad.svg
                .line(0, gridPosition, patternSize, gridPosition)
                .stroke(i == 0 ? strokeMajor.color : stroke.color, i == 0 ? strokeMajor.width : stroke.width)
                .childOf(r);
            const l2 = this._cad.svg
                .line(gridPosition, 0, gridPosition, patternSize)
                .stroke(i == 0 ? strokeMajor.color : stroke.color, i == 0 ? strokeMajor.width : stroke.width)
                .childOf(r);

            if (aasDots) {
                l1.strokeDashPattern(stroke.dashPattern!, stroke.dashOffset!);
                l2.strokeDashPattern(stroke.dashPattern!, stroke.dashOffset!);
            }
        }
        return r;
    }
}