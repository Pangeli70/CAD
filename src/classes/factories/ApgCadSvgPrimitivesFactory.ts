/** -----------------------------------------------------------------------
 * @module [CAD-svg]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * -----------------------------------------------------------------------
 */
import { Svg } from "../../../deps.ts";
import { eApgCadPrimitiveFactoryTypes } from "../../enums/eApgCadPrimitiveFactoryTypes.ts";


export class ApgCadSvgPrimitivesFactory {

  protected _ready = false;

  protected _error = '';

  protected _type = eApgCadPrimitiveFactoryTypes.UNDEFINED;

  protected _svgDoc: Svg.ApgSvgDoc;

  protected _parent!: Svg.ApgSvgNode;

  public constructor(adoc: Svg.ApgSvgDoc, aparent: Svg.ApgSvgNode, atype: eApgCadPrimitiveFactoryTypes) {
    this._svgDoc = adoc;
    this._type = atype;
    this.changeParent(aparent);
  }

  changeParent(aparent: Svg.ApgSvgNode) {
    if(aparent.type !== Svg.eApgSvgNodeTypes.Group) {
      throw new Error(
        `Trying to set an invalid Layer for the ApgSvgCad...Factory #${aparent.ID} type is "${aparent.type}" instead than "Group"`
      );
    }
    this._parent = aparent;
  }

  protected _setParent(anode: Svg.ApgSvgNode, aparent?: Svg.ApgSvgNode) {
    if (aparent && aparent.type === Svg.eApgSvgNodeTypes.Group) {
      anode.childOf(aparent);
    }
    else {
      anode.childOf(this._parent);
    }
  }

  
}
