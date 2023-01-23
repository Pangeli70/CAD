/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * @version 0.9.4 [APG 2023/01/22] Deno Deploy beta
 * -----------------------------------------------------------------------
 */
import { eApgCadDftGradients } from "../../enums/eApgCadDftGradients.ts";
import { ApgCadSvgBaseInitializer } from "./ApgCadSvgBaseInitializer.ts";


/** 
 * Default Gradients
 */
export class ApgCadSvgGradientsInitializer extends ApgCadSvgBaseInitializer {

    override build() {

        const firstGradient = this._cad.svg
            .linearGradient(0, 0, 1, 0, eApgCadDftGradients.LINEAR_LEFT_TO_RIGHT_LIGHT_SHADOW)
            .addStop({ offset: 0, color: "gray", opacity: 1 })
            .addStop({ offset: 100, color: "gray", opacity: 0 })
        this._cad.newGradient(firstGradient)

        const secondGradient = this._cad.svg
            .linearGradient(0, 0, 1, 0, eApgCadDftGradients.LINEAR_LEFT_TO_RIGHT_DARK_SHADOW)
            .addStop({ offset: 0, color: "black", opacity: 1 })
            .addStop({ offset: 100, color: "black", opacity: 0 })
        this._cad.newGradient(secondGradient)

        const thirdGradient = this._cad.svg
            .linearGradient(0, 0, 0, 1, eApgCadDftGradients.LINEAR_TOP_TO_DOWN_LIGHT_SHADOW_)
            .addStop({ offset: 0, color: "gray", opacity: 1 })
            .addStop({ offset: 100, color: "gray", opacity: 0 })
        this._cad.newGradient(thirdGradient)

        const fourthGradient = this._cad.svg
            .linearGradient(0, 0, 0, 1, eApgCadDftGradients.LINEAR_TOP_TO_DOWN_DARK_SHADOW)
            .addStop({ offset: 0, color: "black", opacity: 1 })
            .addStop({ offset: 100, color: "black", opacity: 0 })
        this._cad.newGradient(fourthGradient)


    }
}