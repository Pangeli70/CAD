/** -----------------------------------------------------------------------
 * @module [Cad/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/12/04] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { Drash, Tng } from "../../deps.ts";
import { ApgCadSvgTesterService } from "../../src/classes/ApgCadSvgTesterService.ts";
import { eApgCadTestNames } from "../../src/enums/eApgCadTestNames.ts";

export class ApgCadSvgViewerResource extends Drash.Resource {

    public override paths = ["/svg/viewer/:test"];

    public async GET(request: Drash.Request, response: Drash.Response) {

        const testName = request.pathParam("test") as eApgCadTestNames;

        const svgContent = ApgCadSvgTesterService.RunTest(testName);

        const templateData = {
            site: { 
                name: "Apg-Cad",
                title: "Apg Cad Tests"
            },
            page: {
                title: "Viewer",
                toolbar: "",
                released: "2022/12/04"
            },
            menu: [
                {
                    href: "https://apg-cdn.deno.dev/",
                    caption: "Cdn",
                    description: "A personal content delivery network on deno deploy with simple cache management."
                }
            ],
            svgContent
        };

        const html = await Tng.ApgTngService.Render("/svg_viewer.html", templateData) as string;

        response.html(html);

    }


}
