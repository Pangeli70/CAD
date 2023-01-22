/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * @version 0.9.4 [APG 2023/01/21] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */

/**
 * Groups of instructions for testing
 */
export enum eApgCadTestInsSets { 
    BASIC = "Basic",
    DIMS_AND_ANNOTS = "Dims as annotations",
    TC_MEAS_ON_SITE_1 = "Measures taken on site side view",
    TC_PED_DOORS_1 = "Doors on side view",
    STRUCT_BEAMS = "Structural beams"
}