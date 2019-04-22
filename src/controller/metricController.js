"use strict";

const logger = require("../logger");

class MetricController {
  constructor(ws, metricService) {
    this.socket = ws;
    this.metricService = metricService;
    this.socket.on("message", this.handleMessage.bind(this))
  }

  handleMessage(message) {
    try {
      message = JSON.parse(message);
      const metrics = this.metricService.getMetrics(message);
      this.socket.send(JSON.stringify(metrics));
    } catch (e) {
      logger.error({ msg: "MetricController[handleMessage]: " + e.message, stack: e.stack });
    }
  }
}

module.exports = MetricController;
