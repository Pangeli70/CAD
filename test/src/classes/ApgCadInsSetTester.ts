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
import { eApgCadTestInsSetGroups } from "../enums/eApgCadTestInsSetGroups.ts";
import { IApgCadInsSetTest } from "../interfaces/IApgCadInsSetTest.ts";

export class ApgCadInsSetTester {

    protected static _tests: Map<string, IApgCadInsSetTest> = new Map();


    constructor() {
        ApgCadInsSetTester.init();
    }

    static init() {

        this._tests.set(ApgCadInsSetTest_01.name, ApgCadInsSetTest_01);
    }

    static getTestNamesForGroup(agroup: eApgCadTestInsSetGroups) {
        const r: string[] = []
        this._tests.forEach((test) => {
            if (test.group == agroup) {
                r.push(test.name);
            }
        })
        r.sort();
        return r;
    }

    static getTest(atestName: string) {
        return this._tests.get(atestName);
    }


    static RunTest(aname: string) {
        const cad = new ApgCadSvg();
        cad.svg.title = `Test instructions set`;
        cad.svg.description = "Apg Svg Cad";

        const logger = new Lgr.ApgLgr('Instructions set');
        const test = this.getTest(aname);
        // TODO @4 APG 20221228 Test here for undefined
        const insSet = new ApgCadInstructionsSet(logger, cad, test!.instructions);
        const svg = insSet.build();
        return svg
    }


}