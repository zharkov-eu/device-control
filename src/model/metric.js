"use strict";

class Metric {
  constructor(metric) {
    this.name = metric.name;
    this.value = metric.value;
    this.description = metric.description;
    this.measureUnit = metric.measureUnit;
    this.relations = metric.relations || [];
    this.access = metric.access;
    this.level = metric.level;
  }
}

module.exports = Metric;
