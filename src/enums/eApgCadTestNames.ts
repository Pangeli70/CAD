/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * -----------------------------------------------------------------------
 */

/** 
 * Default Line styles 
 */
export enum eApgCadTestNames {
    POINTS = "Points",
    LINES = "Lines",
    POLYLINES = "PolyLines",
    CIRCLES = "Circles",
    ARCS = "Arcs",
    LABELS = "Lables",

    LAYERS = "Layers",
    STROKE_STYLES = "StrokeStyles",

    BASIC_SHAPES = "BasicShapes",
    
    HORIZONTAL_DIMS = `HorizontalDims`,
    VERTICAL_DIMS = `VerticalDims`,
    ALIGNED_DIMS = `AlignedDims`,

    DIAMETER_DIMS = `DiameterDims`,
    RADIOUS_DIMS = `RadiousDims`,

    ANGULAR_DIMS = 'AngularDims',

    DIM_STYLES = `DimStyles`,

    INSTRUCTIONS_SETS = `InstructionsSets`
}