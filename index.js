"use strict";

const HttpServer = require("./src/httpServer");

const port = parseInt(process.env["NODE_PORT"]) || 8080;
const httpServer = new HttpServer({ port });

httpServer.start();
