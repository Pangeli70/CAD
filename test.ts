/** -----------------------------------------------------------------------
 * @module [CAD/Test]
 * @author [APG] ANGELI Paolo Giusto
 * ------------------------------------------------------------------------
 */
import { ApgCadSvgTester } from "./test/src/ApgSvgCadTester.ts";

const cadSvgTester = new ApgCadSvgTester(Deno.cwd() + "\\public\\img\\svg\\");
cadSvgTester.runAllTests(false);