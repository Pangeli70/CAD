/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * @version 0.9.4 [APG 2023/01/21] Deno Deploy beta
 * -----------------------------------------------------------------------
*/

import { Lgr } from "../../../deps.ts";
import { ApgCadInstructionsSet } from "../../../src/classes/ApgCadInstructionsSet.ts";
import { ApgCadSvg } from "../../../src/classes/ApgCadSvg.ts";
import { ApgCadInsSetTest_01 } from "../../data/ApgCadInsSetTest_01.ts";
import { ApgCadInsSetTest_02 } from "../../data/ApgCadInsSetTest_02.ts";
import { ApgCadInsSetTest_03 } from "../../data/ApgCadInsSetTest_03.ts";
import { ApgCadInsSetTest_04 } from "../../data/ApgCadInsSetTest_04.ts";
import { ApgCadInsSetTest_05 } from "../../data/ApgCadInsSetTest_05.ts";
import { eApgCadTestGridMode } from "../enums/eApgCadTestGridMode.ts";
import { IApgCadInsSetTest } from "../interfaces/IApgCadInsSetTest.ts";
import { ApgCadBaseTester } from "./ApgCadBaseTester.ts";

export class ApgCadInsSetsTester extends ApgCadBaseTester {

    protected static _ready = false;
    protected static _tests: Map<string, IApgCadInsSetTest> = new Map();

    protected static init() {

        this._tests.set(ApgCadInsSetTest_01.name, ApgCadInsSetTest_01);
        this._tests.set(ApgCadInsSetTest_02.name, ApgCadInsSetTest_02);
        this._tests.set(ApgCadInsSetTest_03.name, ApgCadInsSetTest_03);
        this._tests.set(ApgCadInsSetTest_04.name, ApgCadInsSetTest_04);
        this._tests.set(ApgCadInsSetTest_05.name, ApgCadInsSetTest_05);
        this._ready = true;
    }


    static GetTest(atestName: string) {

        if (!this._ready) this.init();

        return this._tests.get(atestName);
    }


    static RunTest(
        aname: string,
        isBlackBack = false,
        agridMode = eApgCadTestGridMode.LINES,
        aisDebug = false,
    ) {

        if (!this._ready) this.init();

        const isDotGrid = agridMode == eApgCadTestGridMode.DOTS;
        const cad = new ApgCadSvg(isBlackBack, isDotGrid, aisDebug);
        cad.svg.title = `Test instructions set`;
        cad.svg.description = "Apg Svg Cad";

        const logger = new Lgr.ApgLgr('Instructions set');
        const test = this.GetTest(aname);
        // TODO @4 APG 20221228 Test here for undefined
        const insSet = new ApgCadInstructionsSet(logger, cad, test!.instructions);
        insSet.build();
        this.DrawCartouche(cad);
        this.Gui(cad);

        const svg = cad.svg.render();
        return { svg, logger }
    }


}