/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.1 [APG 2019/01/16]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * -----------------------------------------------------------------------
 */

import { eApgCadInstructionTypes } from '../enums/eApgCadInstructionTypes.ts';


export interface IApgCadInstruction {
  id: number;
  type: eApgCadInstructionTypes;
  name?: string;
  x?: number;
  y?: number;
  origin?: string;
  radious?: number;
  pivot: string;
  angle?: number;
  points?: string[];
  text?: string[];
  stroke?: string;
  fill?: string;
  font?: string;
  payload: any;
}
