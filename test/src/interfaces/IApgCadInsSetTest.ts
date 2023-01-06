/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { IApgCadInstruction } from "../../../src/interfaces/IApgCadInstruction.ts";
import { eApgCadTestInsSets } from "../enums/eApgCadTestInsSets.ts";

export interface IApgCadInsSetTest { 
    name: eApgCadTestInsSets;
    description: string;
    instructions: IApgCadInstruction[]
}