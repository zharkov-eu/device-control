"use strict";

const logger = require("../logger");

class MetricController {
  constructor(ws, metricService) {
    this.socket = ws;
    this.state = { expanded: [] };
    this.metricService = metricService;
    this.onLoad = () => this.getMetrics(this.state);
    this.socket.on("message", this.handleMessage.bind(this));

    this.metricService.on("load", this.onLoad);
    this.socket.on("close", this.close.bind(this));
  }

  handleMessage(message) {
    try {
      message = JSON.parse(message);
      switch (message.target) {
        case "query":
          return this.getMetrics(message.payload);
        case "update":
          return this.update(message.payload);
        default:
          throw new Error("Target {" + message.target + "} not recognized");
      }
    } catch (e) {
      logger.error({ msg: "MetricController[handleMessage]: " + e.message, stack: e.stack });
    }
  }

  getMetrics(query) {
    const { expanded } = this.state;
    this.state = { expanded: [...expanded, ...(query.expanded || [])] };
    const { state, metrics } = this.metricService.getMetrics(query);
    try {
      this.socket.send(JSON.stringify({ metrics, state }));
    } catch (e) {
      this.close();
    }
  }

  update({ name, value }) {
    const { state } = this.metricService.updateMetric({ name, value });
    try {
      this.socket.send(JSON.stringify({ metrics: [], state }));
    } catch (e) {
      this.close();
    }
  }

  close() {
    this.metricService.removeListener("load", this.onLoad);
  }
}

module.exports = MetricController;
