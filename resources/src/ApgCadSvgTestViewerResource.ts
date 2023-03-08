/** -----------------------------------------------------------------------
 * @module [Cad/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.4 [APG 2023/01/04] Deno Deploy Beta
 * @version 0.9.5 [APG 2023/02/12] Improving Beta
 * -----------------------------------------------------------------------
 */
import { Drash, Tng, Uts, StdCookie, Rst, Lgr } from "../../deps.ts";
import { ApgCadSvgTester } from "../../test/src/classes/ApgCadSvgTester.ts";
import { ApgCadDefaultsTester } from "../../test/src/classes/ApgCadDefaultsTester.ts";
import { ApgCadFactoriesTester } from "../../test/src/classes/ApgCadFactoriesTester.ts";
import { ApgCadFeaturesTester } from "../../test/src/classes/ApgCadFeaturesTester.ts";
import { eApgCadTestTypes } from "../../test/src/enums/eApgCadTestTypes.ts";
import { ApgCadSvg } from "../../src/classes/ApgCadSvg.ts";
import { IApgCadTestParameters } from "../../test/src/interfaces/IApgCadTestParameters.ts";
import { eApgCadGridMode } from "../../src/enums/eApgCadGridMode.ts";
import { eApgCadCartesianMode } from "../../src/enums/eApgCadCartesianMode.ts";
import { IApgCadSvgOptions } from "../../src/interfaces/IApgCadSvgOptions.ts";

enum eResParams {
    PATH_TYPE = 'type',
    PATH_TEST = 'test',
    QUERY_BLACK = 'black',
    QUERY_GRID = 'grid',
    QUERY_CART = 'cart',
    QUERY_RANDOM = 'random',
    QUERY_DEBUG = 'debug',
    COOKIE = 'params'
}



export class ApgCadSvgTestViewerResource extends Drash.Resource {

    public override paths = [`/test/:${eResParams.PATH_TYPE}/:${eResParams.PATH_TEST}`];

    public async GET(request: Drash.Request, response: Drash.Response) {

        const params = this.#getParameters(request);

        const options: IApgCadSvgOptions = {
            name: params.name,
            blackBack: params.blackBack,
            gridMode: params.gridMode,
            cartesiansMode: params.cartesianMode,
            debug: params.debug
        }

        const cad: ApgCadSvg | undefined = await this.#getCadTestResult(params);

        let svgContent = "";
        let cadState: any = {};

        if (cad) {
            svgContent = cad.svg.render();
            cadState = cad.getState();
        }

        await this.#saveSvgIfNotIsDeploy(params, svgContent);

        const templateData = {
            site: {
                name: "Apg-Cad",
                title: "Apg Cad Tests"
            },
            page: {
                title: "Viewer",
                menu: [],
                toolbar: "",
                released: "2022/12/04"
            },
            svgContent,
            cadState,
            params,
        };

        const html = await Tng.ApgTngService.Render("/svg_viewer.html", templateData, false, false) as string;

        const cookie: StdCookie = {
            name: eResParams.COOKIE,
            value: this.#encodeCookieObject(params),
            path: '/'
        };

        response.setCookie(cookie);
        response.html(html);

    }


    #encodeCookieObject(aobject: unknown) {
        const json = JSON.stringify(aobject)

        const r = json
            .replaceAll('"', "'")
            .replaceAll(' ', "SPC")
            .replaceAll(',', "CMM")
            .replaceAll(';', "SMC")
            .replaceAll('/', "SLH")
        return r;
    }

    #decodeCookieObject(aencoded: string) {

        const json = aencoded
            .replaceAll("'", '"')
            .replaceAll("SPC", ' ')
            .replaceAll("CMM", ',')
            .replaceAll("SMC", ';')
            .replaceAll("SLH", '/')
        try {
            const r = JSON.parse(json)
            return r;
        }
        catch (err) {
            return err;
        }
    }

    async #getCadTestResult(params: IApgCadTestParameters) {

        let cad: ApgCadSvg | undefined;

        switch (params.type) {
            case eApgCadTestTypes.DIRECT_SVG:
                cad = await ApgCadSvgTester.RunTest(params);
                break;
            case eApgCadTestTypes.DEFAULTS:
                cad = await ApgCadDefaultsTester.RunTest(params);
                break;
            case eApgCadTestTypes.FACTORIES:
                cad = await ApgCadFactoriesTester.RunTest(params);
                break;
            case eApgCadTestTypes.FEATURES:
                cad = await ApgCadFeaturesTester.RunTest(params);
                break;
        }
        return cad;
    }

    async #saveSvgIfNotIsDeploy(params: IApgCadTestParameters, svgContent: string) {
        const isDenoDeploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
        if (!isDenoDeploy) {
            await Deno.writeTextFile(Deno.cwd() + "/test/output/" + params.type + "_" + params.name + ".svg", svgContent);
        }
    }

    #getParameters(request: Drash.Request) {

        let paramsCookie = {} as IApgCadTestParameters;
        const rawParamsCookie = request.getCookie(eResParams.COOKIE);
        if (rawParamsCookie) {
            paramsCookie = this.#decodeCookieObject(rawParamsCookie) as IApgCadTestParameters
            console.log(paramsCookie);
        }

        const rawTestType = request.pathParam(eResParams.PATH_TYPE) as eApgCadTestTypes;
        const rawTestName = request.pathParam(eResParams.PATH_TEST)!;

        const rawBlackBack = request.queryParam(eResParams.QUERY_BLACK);
        let blackBack = false;
        if (rawBlackBack == undefined) {
            if (paramsCookie.blackBack != undefined) {
                blackBack = paramsCookie.blackBack;
            }
        }
        else {
            blackBack = Uts.ApgUtsIs.IsTrueish(rawBlackBack)
        }

        const rawRandom = request.queryParam(eResParams.QUERY_RANDOM);
        let random = false;
        if (rawRandom == undefined) {
            if (paramsCookie.random != undefined) {
                random = paramsCookie.random;
            }
        }
        else {
            random = Uts.ApgUtsIs.IsTrueish(rawRandom)
        }

        const rawDebug = request.queryParam(eResParams.QUERY_DEBUG);
        let debug = false;
        if (rawDebug == undefined) {
            if (paramsCookie.debug != undefined) {
                debug = paramsCookie.debug;
            }
        }
        else {
            debug = Uts.ApgUtsIs.IsTrueish(rawDebug)
        }

        const rawGridMode = request.queryParam(eResParams.QUERY_GRID) as eApgCadGridMode;
        let gridMode = eApgCadGridMode.LINES;
        if (rawGridMode == undefined) {
            if (paramsCookie.gridMode != undefined) {
                gridMode = paramsCookie.gridMode;
            }
        }
        else {
            if (Uts.ApgUtsEnum.StringContains(eApgCadGridMode, rawGridMode)) {
                gridMode = rawGridMode
            }
        }

        const rawCartesianMode = request.queryParam(eResParams.QUERY_CART) as eApgCadCartesianMode;
        let cartesianMode = eApgCadCartesianMode.NORMAL;
        if (rawCartesianMode == undefined) {
            if (paramsCookie.gridMode != undefined) {
                cartesianMode = paramsCookie.cartesianMode;
            }
        }
        else {
            if (Uts.ApgUtsEnum.StringContains(eApgCadCartesianMode, rawCartesianMode)) {
                cartesianMode = rawCartesianMode
            }
        }

        const r: IApgCadTestParameters = {
            type: rawTestType,
            name: rawTestName,
            blackBack,
            random,
            debug,
            gridMode,
            cartesianMode
        };
        console.log(r);
        return r;
    }

}
