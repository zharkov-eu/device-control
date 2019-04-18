"use strict";

class MetricController {
  constructor(ws, metricService) {
    this.socket = ws;
    this.metricService = metricService;
    this.socket.on("message", this.handleMessage.bind(this))
  }

  handleMessage(message) {
    this.socket.send("{}");
  }
}

module.exports = MetricController;
