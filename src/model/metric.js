"use strict";

class Metric {
  constructor(metric) {
    this.name = metric.name;
    this.value = metric.value;
    this.measureUnit = metric.measureUnit;
    this.description = metric.description;
  }
}

module.exports = Metric;
