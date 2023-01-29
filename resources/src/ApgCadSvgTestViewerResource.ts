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
import { eApgCadTestGridMode } from "../../test/src/enums/eApgCadTestGridMode.ts";
import { eApgCadTestCartesianMode } from "../../test/src/enums/eApgCadTestCartesianMode.ts";

enum eResParams {
    pTYPE = 'type',
    pTEST = 'test',
    qBLACK = 'black',
    qGRID = 'grid',
    qCART = 'cartesian',
    qRANDOM = 'random',
    qDEBUG = 'debug'
}

export class ApgCadSvgTestViewerResource extends Drash.Resource {

    public override paths = [`/test/:${eResParams.pTYPE}/:${eResParams.pTEST}`];

    public async GET(request: Drash.Request, response: Drash.Response) {

        const testType = request.pathParam(eResParams.pTYPE) as eApgCadTestTypes;
        const testName = request.pathParam(eResParams.pTEST);

        const rawBlackBack = request.queryParam(eResParams.qBLACK);
        const blackBack = Uts.ApgUtsIs.IsTrueish(rawBlackBack);

        const rawGridMode = request.queryParam(eResParams.qGRID) as eApgCadTestGridMode;
        const gridMode = (Uts.ApgUtsEnum.StringContains(eApgCadTestGridMode, rawGridMode)) ?
            rawGridMode :
            eApgCadTestGridMode.LINES;

        const rawCartesianMode = request.queryParam(eResParams.qCART) as eApgCadTestCartesianMode;
        const cartesianMode = (Uts.ApgUtsEnum.StringContains(eApgCadTestCartesianMode, rawCartesianMode)) ?
            rawCartesianMode :
            eApgCadTestCartesianMode.NORMAL;

        const rawRandom = request.queryParam(eResParams.qRANDOM);
        const random = Uts.ApgUtsIs.IsTrueish(rawRandom);

        const rawDebug = request.queryParam(eResParams.qDEBUG);
        const debug = Uts.ApgUtsIs.IsTrueish(rawDebug);

        let pageMenu: { href: string, caption: string }[] = []
        pageMenu = this.#buildMenu(testType, testName, blackBack, gridMode, cartesianMode, random, debug, pageMenu);

        let svgContent = "";
        let testLogger: any = { hasErrors: false };

        switch (testType) {
            case eApgCadTestTypes.DIRECT_SVG:
                svgContent = ApgCadSvgTester.RunTest(testName as eApgCadTestSvg, blackBack);
                break;
            case eApgCadTestTypes.FACTORIES:
                svgContent = ApgCadFactoriesTester.RunTest(testName as eApgCadTestFactories, blackBack, gridMode, random, debug);
                break;
            case eApgCadTestTypes.FEATURES:
                svgContent = ApgCadFeaturesTester.RunTest(testName as eApgCadTestFeatures, blackBack);
                break;
            case eApgCadTestTypes.DEFAULTS:
                svgContent = ApgCadDefaultsTester.RunTest(testName as eApgCadTestDefaults, blackBack);
                break;
            case eApgCadTestTypes.INS_SETS:
                {
                    const { svg, logger } = ApgCadInsSetsTester.RunTest(testName as unknown as eApgCadTestInsSets, blackBack, gridMode, debug);
                    svgContent = svg;
                    testLogger = logger;
                } break;
        }

        await Deno.writeTextFile(Deno.cwd() + "/test/output/" + testType + "_" + testName + ".svg", svgContent);

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



    #buildMenu(
        atestType: eApgCadTestTypes,
        atestName: string | undefined,
        ablackBack: boolean,
        agridMode: eApgCadTestGridMode,
        acartesianMode: eApgCadTestCartesianMode,
        arandom: boolean,
        adebug: boolean,
        apageMenu: { href: string; caption: string; }[]
    ) {

        const root = `/test/${atestType}/${atestName}`;
        const blackFlag = `black=${ablackBack}`;
        const blackFlagInv = `black=${!ablackBack}`;
        const debugFlag = `debug=${adebug}`;
        const debugFlagInv = `debug=${!adebug}`;
        const randomFlag = `random=${arandom}`;
        const randomFlagInv = `random=${!arandom}`;
        const gridFlag = `grid=${agridMode}`;
        const gridFlagInv = `grid=${agridMode == eApgCadTestGridMode.LINES ? eApgCadTestGridMode.DOTS : eApgCadTestGridMode.LINES}`;
        const cartesianFlag = `axis=${acartesianMode}`;
        const cartesianFlagInv = `axis=${acartesianMode == eApgCadTestCartesianMode.NORMAL ? eApgCadTestCartesianMode.NONE : eApgCadTestCartesianMode.NORMAL}`;


        const fullMenu = [
            {
                href: `${root}?${blackFlagInv}&${gridFlag}&${cartesianFlag}&${randomFlag}&${debugFlag}`,
                caption: (ablackBack) ? "White" : "Black"
            },
            {
                href: `${root}?${blackFlag}&${gridFlagInv}&${cartesianFlag}&${randomFlag}&${debugFlag}`,
                caption: agridMode == eApgCadTestGridMode.LINES ? eApgCadTestGridMode.DOTS : eApgCadTestGridMode.LINES
            },
            {
                href: `${root}?${blackFlag}&${gridFlagInv}&${cartesianFlag}&${randomFlag}&${debugFlag}`,
                caption: acartesianMode == eApgCadTestCartesianMode.NORMAL ? eApgCadTestCartesianMode.NONE : eApgCadTestCartesianMode.NORMAL
            },
            {
                href: `${root}?${blackFlag}&${gridFlag}&${cartesianFlag}&${randomFlagInv}&${debugFlag}`,
                caption: (arandom) ? "Determ." : "Random"
            },
            {
                href: `${root}?${blackFlag}&${gridFlag}&${cartesianFlag}&${randomFlag}&${debugFlagInv}`,
                caption: (adebug) ? "Standard" : "Debug"
            }
        ];

        const baseMenu = [
            {
                href: `${root}?black=${!ablackBack}`,
                caption: (ablackBack) ? "White" : "Black"
            }
        ];

        const noRandomlMenu = [
            {
                href: `${root}?${blackFlagInv}&${gridFlag}&${debugFlag}`,
                caption: (ablackBack) ? "White" : "Black"
            },
            {
                href: `${root}?${blackFlag}&${gridFlagInv}&${randomFlag}&${debugFlag}`,
                caption: agridMode == eApgCadTestGridMode.LINES ? eApgCadTestGridMode.DOTS : eApgCadTestGridMode.LINES
            },
            {
                href: `${root}?${blackFlag}&${gridFlag}&${debugFlagInv}`,
                caption: (adebug) ? "Standard" : "Debug"
            }
        ];

        switch (atestType) {
            case eApgCadTestTypes.DIRECT_SVG:
            case eApgCadTestTypes.FEATURES:
            case eApgCadTestTypes.DEFAULTS:
                {
                    apageMenu = [...baseMenu];
                }
                break;
            case eApgCadTestTypes.FACTORIES:
                {
                    apageMenu = [...fullMenu];
                } break;
            case eApgCadTestTypes.INS_SETS:
                {
                    apageMenu = [...noRandomlMenu];
                } break;
        }
        return apageMenu;
    }
}
