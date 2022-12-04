/** -----------------------------------------------------------------------
 * @module [CAD/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/12/04] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { Drash, StdPath, Tng, Uts } from "../../deps.ts";
import { eApgCadTestNames } from "../../src/enums/eApgCadTestNames.ts";

export class ApgCadHomeResource extends Drash.Resource {

    public override paths = ["/"];

    public async GET(_request: Drash.Request, response: Drash.Response) {

        const menu: { href: string, caption: string }[] = [];
        const tests = Uts.ApgUtsEnum.StringValues(eApgCadTestNames);

        for (const test of tests) {
            menu.push({
                href: "/svg/viewer/" + test,
                caption: test
            })
        }


        const templateData = {
            site: {
                name: "Apg-Cad",
                title: "Directory of the Apg Cad Tests"
            },
            page: {
                title: "Home",
                toolbar: "",
                released: "2022/12/04"
            },
            menu,
        };

        const html = await Tng.ApgTngService.Render("/home.html", templateData) as string;

        response.html(html);

    }


}
