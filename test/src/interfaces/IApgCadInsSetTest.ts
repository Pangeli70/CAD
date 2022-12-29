/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { IApgCadInstruction } from "../../../src/interfaces/IApgCadInstruction.ts";
import { eApgCadTestInsSetGroups } from "../enums/eApgCadTestInsSetGroups.ts";

export interface IApgCadInsSetTest { 

    group: eApgCadTestInsSetGroups

    name: string;
    description: string;
    instructions: IApgCadInstruction[]
}