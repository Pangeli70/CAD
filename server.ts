/** -----------------------------------------------------------------------
 * @module [CAD/Application]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/12/04] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { Drash, Uts, Tng } from "./deps.ts";
import { resources } from "./res.ts";
import { services } from "./svcs.ts";

const SERVER_INFO: Uts.IApgUtsServerInfo = {
  name: 'Apg-Cad',
  title: 'Directory of Apg Cad',
  subtitle: 'Apg Cad tests',
  localPort: 49604
}

Tng.ApgTngService.Init("./templates", {
  useCache: false,
  cacheChunksLongerThan: 100,
  consoleLog: true
});

const server = new Drash.Server({
  hostname: '0.0.0.0',
  port: SERVER_INFO.localPort,
  resources: resources,
  services: services,
  protocol: "http"
});

server.run();

Uts.ApgUtsServer.StartupResume(SERVER_INFO);
