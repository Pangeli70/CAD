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

import {
  eApgCadSvgPrimitiveFactoryTypes,
  IApgCadSvgTextStyle
} from "../../../mod.ts";

export class ApgCadSvgPrimitivesFactory {

  protected _ready = false;

  protected _error = '';

  type = eApgCadSvgPrimitiveFactoryTypes.undefined;

  svgDoc: Svg.ApgSvgDoc;

  layer!: Svg.ApgSvgNode;

  public constructor(adoc: Svg.ApgSvgDoc, alayer: Svg.ApgSvgNode) {
    this.svgDoc = adoc;
    this.setLayer(alayer);
  }

  setLayer(alayer: Svg.ApgSvgNode) {
    // TODO this is wrong we need an enumeration to check the type
    if (alayer.type !== "Group") {
      throw new Error(
        `Trying to set an invalid Layer for the ApgSvgCad...Factory #${alayer.ID} type is "${alayer.type}" instead than "Group"`,
      );
    }
    this.layer = alayer;
  }

  applyTextStyle(
    anode: Svg.ApgSvgNode,
    atextStyle: IApgCadSvgTextStyle,
  ) {
    const ALLOWED_TAGS = "text|textPath";
    anode.aheckTag("TextStyle", ALLOWED_TAGS);
    anode.attrib("font-family", `${atextStyle.font}`);
    anode.attrib("font-size", `${atextStyle.size}`);
    anode.attrib("text-anchor", `${atextStyle.anchor}`);
    if (atextStyle.italic) {
      anode.attrib("font-style", "italic");
    }
    if (atextStyle.bold) {
      anode.attrib("font-weight", "bold");
    }
    anode.fill(`${atextStyle.fill}`);
    anode.attrib("stroke", `${atextStyle.stroke}`);
    return anode;
  }
}
