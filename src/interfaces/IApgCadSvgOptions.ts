/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.5 [APG 2023/02/11] Finalizing beta
 * -----------------------------------------------------------------------
 */

import { eApgCadCartesianMode } from "../enums/eApgCadCartesianMode.ts";
import { eApgCadGridMode } from "../enums/eApgCadGridMode.ts";

/**
 * Constructor options
 */
export interface IApgCadSvgOptions {
  /** Name of the SVG object */
  name: string;
  /** Background settings */
  blackBack: boolean;
  /** Axis settings */
  cartesiansMode: eApgCadCartesianMode;
  /** grids settings */
  gridMode: eApgCadGridMode;
  /** Debug */
  debug: boolean;
}
