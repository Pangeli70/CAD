/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/21] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * @version 0.9.4 [APG 2023/01/22] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */

/**
 * Default layers
 */
export enum eApgCadDftLayers {
  BACKGROUND = 'BackgroundLayer',
  GUI = "GuiLayer",
  GRIDS = 'GridsLayer',
  CARTESIANS = 'CartesianLayer',
  ANNOTATIONS = 'AnnotationsLayer',
  DIMENSIONS = 'DimensionsLayer',
  DEBUG = 'Debuglayer',
  HIDDEN = 'HiddenLayer',
  ZERO = '0Layer',
  CARTOUCHE = "CartoucheLayer",
}
