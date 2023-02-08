/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * @version 0.9.4 [APG 2023/01/22] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */

import { ApgCadSvgBaseInitializer } from "./ApgCadSvgBaseInitializer.ts";


/** 
 * Default Textures
 */
export class ApgCadSvgTexturesInitializer extends ApgCadSvgBaseInitializer {

    override async build() {

        const PATH = "/public/img/jpg/textures/";

        for await (const dirEntry of Deno.readDir(Deno.cwd() + PATH)) {
            if (dirEntry.isFile) {
                const file = dirEntry.name;
                const fragments = file.split("_");
                if (fragments[0] === 'ApgCadTexture') {
                    const dims = fragments[3].split("x");
                    const width = parseInt(dims[0]);
                    const height = parseInt(dims[1]);
                    const texturePattern = this._cad.svg
                        .pattern(width, height, fragments[1] + "_" + fragments[2]);
                    this._cad.svg
                        .image(0, 0, width, height, PATH + file)
                        .childOf(texturePattern);
                    this._cad.newTexture(texturePattern);
                }
            }
        }

        /* 
        <pattern id="imgpattern" x="0" y="0" width="1" height="1"
                viewBox="0 0 1024 576" preserveAspectRatio="xMidYMid slice">
            <image width="1024" height="576" xlink:href="http://calciodanese.altervista.org/alterpages/hbkgepage.jpg"/>
        /pattern>
         */
    }

}

