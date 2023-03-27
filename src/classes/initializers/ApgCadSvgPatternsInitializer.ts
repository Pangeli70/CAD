/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * @version 0.9.4 [APG 2023/01/22] Deno Deploy Beta
 * @version 0.9.6 [APG 2023/03/23] Rebuild Grid and Cartesians patterns
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

    rebuildGridPatterns() {
        this._cad.svg.removeNode(eApgCadDftPatterns.BACK_GRID_LINES);
        const gridPattern = this.#gridPattern(eApgCadDftPatterns.BACK_GRID_LINES, false);
        this._cad.newPattern(gridPattern);

        this._cad.svg.removeNode(eApgCadDftPatterns.BACK_GRID_LINES_AS_DOTS);
        const dotsGridPattern = this.#gridPattern(eApgCadDftPatterns.BACK_GRID_LINES_AS_DOTS, true);
        this._cad.newPattern(dotsGridPattern);
    }

    rebuildCartesianPatterns() {

        this._cad.svg.removeNode(eApgCadDftPatterns.CARTESIAN_HORIZONTAL);
        const horizontalCartesianPattern =
            this.#cartesianPattern(eApgCadDftPatterns.CARTESIAN_HORIZONTAL, true);
        this._cad.newPattern(horizontalCartesianPattern);

        this._cad.svg.removeNode(eApgCadDftPatterns.CARTESIAN_VERTICAL);
        const verticalCartesianPattern =
            this.#cartesianPattern(eApgCadDftPatterns.CARTESIAN_VERTICAL, false);
        this._cad.newPattern(verticalCartesianPattern);
    }

    override build() {

        this.rebuildGridPatterns();
        this.rebuildCartesianPatterns();

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

    }

    #gridPattern(aname: string, aasDots: boolean) {

        const stroke = this._cad.settings.grid.gridStroke;
        const strokeMajor = this._cad.settings.grid.majorGridStroke;
        const patternSize = this._cad.settings.grid.majorEvery;

        const num = patternSize / this._cad.settings.grid.gridStep;
        const r = this._cad.svg
            .pattern(patternSize, patternSize, aname);
        for (let i = 0; i <= num; i++) {
            const gridPosition = i * this._cad.settings.grid.gridStep;
            const isMajor = i % num == 0;
            const l1 = this._cad.svg
                .line(0, gridPosition, patternSize, gridPosition)
                .stroke(
                    isMajor ? strokeMajor.color : stroke.color,
                    isMajor ? strokeMajor.width : stroke.width
                )
                .childOf(r);
            const l2 = this._cad.svg
                .line(gridPosition, 0, gridPosition, patternSize)
                .stroke(
                    isMajor ? strokeMajor.color : stroke.color,
                    isMajor ? strokeMajor.width : stroke.width)
                .childOf(r);

            if (aasDots) {
                const pattern = stroke.dashPattern || [];
                const offset = stroke.dashOffset || 0;
                l1.strokeDashPattern(pattern, offset);
                l2.strokeDashPattern(pattern, offset);
            }
        }
        return r;
    }

    #cartesianPattern(aname: string, ahorizontal: boolean) {

        const stroke = this._cad.settings.cartesians.tickStroke;
        const patternWidth = ahorizontal ?
            this._cad.settings.cartesians.bigTicksEvery :
            this._cad.settings.cartesians.bigTicksSize
        const patternHeight = ahorizontal ?
            this._cad.settings.cartesians.bigTicksSize :
            this._cad.settings.cartesians.bigTicksEvery

        const num = this._cad.settings.cartesians.bigTicksEvery / this._cad.settings.cartesians.ticksStep;

        const r = this._cad.svg
            .pattern(patternWidth, patternHeight, aname);

        for (let i = 0; i <= num; i++) {
            const tickPosition = i * this._cad.settings.cartesians.ticksStep ;
            let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
            if (ahorizontal) {
                x1 = x2 = tickPosition;
                y1 = 0;
                y2 = (i % num ==  0) ?
                    this._cad.settings.cartesians.bigTicksSize :
                    this._cad.settings.cartesians.ticksSize
            }
            else {
                x1 = 0
                x2 = (i % num == 0) ?
                    this._cad.settings.cartesians.bigTicksSize :
                    this._cad.settings.cartesians.ticksSize
                y1 = y2 = tickPosition;
            }
            const _l = this._cad.svg
                .line(x1, y1, x2, y2)
                .stroke(stroke.color, stroke.width)
                .childOf(r);
        }
        return r;
    }
}