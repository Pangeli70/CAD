/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */

/**
 *  Test Cad Factories
 */
export enum eApgCadTestFactories {

    BASIC_SHAPES = "BasicShapes",

    ANNOTATIONS = `Annotations`,

    HORIZONTAL_LIN_DIMS = `HorizontalDims`,
    VERTICAL_LIN_DIMS = `VerticalDims`,
    ALIGNED_LIN_DIMS = `AlignedDims`,

    IN_DIAMETER_ARC_DIMS = `InnerDiameterDims`,
    IN_RADIOUS_ARC_DIMS = `InnerRadiousDims`,
    OUT_DIAMETER_DIMS = `OuterDiameterDims`,
    OUT_RADIOUS_ARC_DIMS = `OuterRadiousDims`,
    HORIZONTAL_ARC_DIMS = `ArcHorizontalDims`,
    VERTICAL_ARC_DIMS = `ArcVerticalDims`,

    ANGULAR_DIMS = 'AngularDims',

}