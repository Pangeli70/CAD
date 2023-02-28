/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/21] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * @version 0.9.4 [APG 2023/01/22] Deno Deploy Beta
 * @version 0.9.5 [APG 2023/02/27] Renaming
 * -----------------------------------------------------------------------
 */

/**
 * Default layers
 */
export enum eApgCadDftLayers {
  BACKGROUND = 'Layer_Background',
  GRIDS = 'Layer_Grids',
  CARTESIANS = 'Layer_Cartesians',
  ANNOTATIONS = 'Layer_Annotations',
  DIMENSIONS = 'Layer_Dimensions',
  DEBUG = 'Layer_Debug',
  HIDDEN = 'Layer_Hidden',
  ZERO = 'Layer_Zero',
  CARTOUCHE = "Layer_Cartouche",
}
