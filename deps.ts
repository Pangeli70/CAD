/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * ------------------------------------------------------------------------
 */



// https://deno.land/std
export * as StdFs from "https://deno.land/std@0.153.0/fs/mod.ts";
export * as StdPath from "https://deno.land/std@0.153.0/path/mod.ts";

// https://deno.land/x/drash
export * as  Drash from "https://deno.land/x/drash@v2.5.4/mod.ts";

// https://deno.land/x/drash_middleware
export { CORSService as DrashCorsService } from "https://deno.land/x/drash@v2.5.4/src/services/cors/cors.ts";

// https://github
export * as A2D from "https://raw.githubusercontent.com/Pangeli70/apg-2d/master/mod.ts";
export * as Rst from "https://raw.githubusercontent.com/Pangeli70/apg-rst/master/mod.ts";
//export * as Svg from "https://raw.githubusercontent.com/Pangeli70/apg-svg/master/mod.ts";
export * as Svg from "../SVG/mod.ts";
export * as Uts from "https://raw.githubusercontent.com/Pangeli70/apg-uts/master/mod.ts";
export * as Lgr from "https://raw.githubusercontent.com/Pangeli70/apg-lgr/master/mod.ts";
//export * as Jsv from "https://raw.githubusercontent.com/Pangeli70/apg-jsv/master/mod.ts";
export * as Jsv from "../JSV/mod.ts";

export * as Edr from "https://raw.githubusercontent.com/Pangeli70/apg-edr/master/mod.ts";
// export * as Tng from "https://raw.githubusercontent.com/Pangeli70/apg-tng/master/mod.ts";
export * as Tng from "../TNG/mod.ts";


