/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
*/

import { Lgr } from "../../../deps.ts";
import { ApgCadInstructionsSet } from "../../../src/classes/ApgCadInstructionsSet.ts";
import { ApgCadSvg } from "../../../src/classes/ApgCadSvg.ts";
import { ApgCadInsSetTest_01 } from "../../data/ApgCadInsSetTest_01.ts";
import { eApgCadTestInsSets } from "../enums/eApgCadTestInsSets.ts";
import { IApgCadInsSetTest } from "../interfaces/IApgCadInsSetTest.ts";
import { ApgCadBaseTester } from "./ApgCadBaseTester.ts";

export class ApgCadInsSetsTester extends ApgCadBaseTester {

    protected static _ready = false;
    protected static _tests: Map<string, IApgCadInsSetTest> = new Map();

    protected static init() {

        this._tests.set(ApgCadInsSetTest_01.name, ApgCadInsSetTest_01);
        this._ready = true;
    }


    static GetTest(atestName: string) {

        if (!this._ready) this.init();

        return this._tests.get(atestName);
    }


    static RunTest(
        aname: string,
        isBlackBack = false,
        aisDotGrid = false,
        aisDebug = false,
    ) {

        if (!this._ready) this.init();

        const cad = new ApgCadSvg(isBlackBack, aisDotGrid, aisDebug);
        cad.svg.title = `Test instructions set`;
        cad.svg.description = "Apg Svg Cad";

        const logger = new Lgr.ApgLgr('Instructions set');
        const test = this.GetTest(aname);
        // TODO @4 APG 20221228 Test here for undefined
        const insSet = new ApgCadInstructionsSet(logger, cad, test!.instructions);
        insSet.build();
        this.cartouche(cad);

        const svg = cad.svg.render();
        return { svg, logger }
    }


}