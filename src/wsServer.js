"use strict";

const WebSocket = require("ws");
const MetricService = require("./service/metricService");
const MetricController = require("./controller/metricController");
const logger = require("./logger");

class WsServer {
  constructor({ server }) {
    this.server = server;
    this.metricService = new MetricService({ dataPath: "data/params.json" });
  }

  async start() {
    await this.metricService.load();
    this.wss = new WebSocket.Server({ server: this.server, path: "/ws" });
    this.wss.on("connection", (ws) => new MetricController(ws, this.metricService));
    this.wss.on("error", (err) => logger.error({ msg: err.message, stack: err.stack }));
  }
}

module.exports = WsServer;
