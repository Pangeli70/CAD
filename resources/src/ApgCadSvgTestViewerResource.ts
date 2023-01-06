/** -----------------------------------------------------------------------
 * @module [Cad/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/04] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { Drash, Tng, Uts } from "../../deps.ts";
import { ApgCadSvgTester } from "../../test/src/classes/ApgCadSvgTester.ts";
import { ApgCadDefaultsTester } from "../../test/src/classes/ApgCadDefaultsTester.ts";
import { ApgCadFactoriesTester } from "../../test/src/classes/ApgCadFactoriesTester.ts";
import { ApgCadFeaturesTester } from "../../test/src/classes/ApgCadFeaturesTester.ts";
import { ApgCadInsSetsTester } from "../../test/src/classes/ApgCadInsSetsTester.ts";
import { eApgCadTestSvg } from "../../test/src/enums/eApgCadTestSvg.ts";
import { eApgCadTestDefaults } from "../../test/src/enums/eApgCadTestDefaults.ts";
import { eApgCadTestFactories } from "../../test/src/enums/eApgCadTestFactories.ts";
import { eApgCadTestFeatures } from "../../test/src/enums/eApgCadTestFeatures.ts";
import { eApgCadTestInsSets } from "../../test/src/enums/eApgCadTestInsSets.ts";
import { eApgCadTestTypes } from "../../test/src/enums/eApgCadTestTypes.ts";


export class ApgCadSvgTestViewerResource extends Drash.Resource {

    public override paths = ["/test/:type/:test"];

    public async GET(request: Drash.Request, response: Drash.Response) {

        const rawBlackBack = request.queryParam("black") as eApgCadTestTypes;
        const blackBack = Uts.ApgUtsIs.IsTrueish(rawBlackBack);

        const testType = request.pathParam("type") as eApgCadTestTypes;
        let svgContent = "";
        let testLogger: any = { hasErrors: false };
        const testName = request.pathParam("test");
        switch (testType) {
            case eApgCadTestTypes.DIRECT_SVG:
                svgContent = ApgCadSvgTester.RunTest(testName as eApgCadTestSvg, blackBack);
                break;
            case eApgCadTestTypes.FACTORIES:
                svgContent = ApgCadFactoriesTester.RunTest(testName as eApgCadTestFactories, blackBack);
                break;
            case eApgCadTestTypes.FEATURES:
                svgContent = ApgCadFeaturesTester.RunTest(testName as eApgCadTestFeatures, blackBack);
                break;
            case eApgCadTestTypes.DEFAULTS:
                svgContent = ApgCadDefaultsTester.RunTest(testName as eApgCadTestDefaults, blackBack);
                break;
            case eApgCadTestTypes.INS_SETS:
                {
                    const { svg, logger } = ApgCadInsSetsTester.RunTest(testName as unknown as eApgCadTestInsSets, blackBack);
                    svgContent = svg;
                    testLogger = logger;
                } break;
        }

        const pageMenu = [
            {
                href: `/test/${testType}/${testName}/?black=${!blackBack}`,
                caption: (blackBack) ? "White" : "Black"
            }
        ]


        const templateData = {
            site: {
                name: "Apg-Cad",
                title: "Apg Cad Tests"
            },
            page: {
                title: "Viewer",
                menu: pageMenu,
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
            svgContent,
            testLogger
        };

        const html = await Tng.ApgTngService.Render("/svg_viewer.html", templateData) as string;

        response.html(html);

    }


}
