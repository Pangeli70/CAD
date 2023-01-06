/** -----------------------------------------------------------------------
 * @module [CAD-svg]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * @version 0.9.4 [APG 2023/01/06] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { Svg } from "../../../deps.ts";
import { eApgCadDftDimArrowStyles } from "../../enums/eApgCadDftDimArrowStyles.ts";
import { eApgCadPrimitiveFactoryTypes } from "../../enums/eApgCadPrimitiveFactoryTypes.ts";
import { ApgCadSvg } from "../ApgCadSvg.ts";
import { ApgCadSvgPrimitivesFactory } from "./ApgCadSvgPrimitivesFactory.ts";


/** Apg Svg : Base Factory for CAD dimensions with arrows and ladders
 */
export class ApgCadSvgBaseDimensionsFactory extends ApgCadSvgPrimitivesFactory {

  /** Dimension digits */
  protected digits: number;

  /** text style */
  protected textStyle: Svg.IApgSvgTextStyle;
  /** Arrow Block name*/
  protected arrowStyle: string = eApgCadDftDimArrowStyles.UNDEFINED;
  /** Additional class for the annotations */
  protected cssClass = "";


  public constructor(
    acad: ApgCadSvg,
    atextStyle: Svg.IApgSvgTextStyle,
    aarrowStyle: string,
    adigits: number,
    acssClass = ''
  ) {
    super(acad, eApgCadPrimitiveFactoryTypes.LINEAR_DIMS);
    this.textStyle = atextStyle;
    this.arrowStyle = aarrowStyle;
    this.digits = adigits;
    this.cssClass = acssClass;
    this.ready = true;
  }


}
