/** -----------------------------------------------------------------------
 * @module [CAD/Test]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.5 [APG 2023/02/12] Improving Beta
 * -----------------------------------------------------------------------
 */

import { eApgCadCartesianMode } from "../../../src/enums/eApgCadCartesianMode.ts";
import { eApgCadGridMode } from "../../../src/enums/eApgCadGridMode.ts";
import { eApgCadTestTypes } from "../enums/eApgCadTestTypes.ts";

/** 
 * Test parameters
 */
export interface IApgCadTestParameters {

    type: eApgCadTestTypes | string;
    name: string;
    blackBack: boolean;
    gridMode: eApgCadGridMode;
    cartesianMode: eApgCadCartesianMode;
    random: boolean;
    debug: boolean;
}

