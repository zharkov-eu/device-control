"use strict";

const logger = require("../logger");

class MetricController {
  constructor(ws, metricService) {
    this.socket = ws;
    this.state = { expanded: [] };
    this.metricService = metricService;
    this.socket.on("message", this.handleMessage.bind(this));

    const onLoad = () => this.getMetrics(this.state);
    this.metricService.on("load", onLoad);
    this.metricService.on("close", () => this.metricService.removeListener("load", onLoad));
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
    this.socket.send(JSON.stringify({ metrics, state }));
  }

  update({ name, value }) {
    const { state } = this.metricService.updateMetric({ name, value });
    this.socket.send(JSON.stringify({ metrics: [], state }));
  }
}

module.exports = MetricController;
