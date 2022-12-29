/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */
import { ApgCadSvg } from "../ApgCadSvg.ts";

export abstract  class ApgCadSvgBaseInitializer {

    protected _cad: ApgCadSvg
    constructor(acad: ApgCadSvg) {
        this._cad = acad
    }

    abstract build(): void;
}

