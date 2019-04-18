"use strict";

const HttpServer = require("./src/httpServer");
const WsServer = require("./src/wsServer");

const httpPort = parseInt(process.env["NODE_HTTP_PORT"]) || 8080;
const httpServer = new HttpServer({ port: httpPort });
const wsServer = new WsServer({ server: httpServer.server });

(async () => {
  httpServer.start();
  await wsServer.start();
})();
