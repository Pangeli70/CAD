/** -----------------------------------------------------------------------
 * @module [Cad/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/12/04] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { Drash, Tng } from "../../deps.ts";
import { ApgCadSvgTester } from "../../test/src/classes/ApgCadSvgTester.ts";
import { eApgCadTestSvg } from "../../test/src/enums/eApgCadTestSvg.ts";
import { eApgCadTestTypes } from "../../test/src/enums/eApgCadTestTypes.ts";


export class ApgCadSvgTestViewerResource extends Drash.Resource {

    public override paths = ["/test/:type/:test"];

    public async GET(request: Drash.Request, response: Drash.Response) {

        const testType = request.pathParam("type") as eApgCadTestTypes;
        let svgContent = "";
        switch (testType) {
            case eApgCadTestTypes.DIRECT_SVG: {
                const testName = request.pathParam("test") as eApgCadTestSvg;
                svgContent = ApgCadSvgTester.RunTest(testName);
            }
        }


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
