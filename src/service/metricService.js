"use strict";

const fs = require("fs");
const chokidar = require('chokidar');
const { promisify } = require("util");
const EventEmitter = require("events");
const Metric = require("../model/metric");
const logger = require("../logger");

const readFileAsync = promisify(fs.readFile);
const GROUP_ID = 1;
const MAX_CANCEL_RETRY = 5;

class MetricService extends EventEmitter {
  constructor({ dataPath = "data/params.json" }) {
    super();
    this.store = new Map();
    this.storeStateId = 0;
    this.dataPath = dataPath;

    this.loadId = 0;
    this.cancelLoad = [];
    this.cancelCounter = 0;

    this.watcher = chokidar.watch("data/params.json");
    this.watcher.on('change', () => this.load({ cancellation: true }));
  }

  getMetrics({ expanded = [], upgrade }) {
    if (upgrade === this.storeStateId)
      return { state: this.storeStateId, metrics: [] };

    const relations = [];
    for (const name of expanded) {
      if (!this.store.has(name))
        throw new Error(`Expanded metric {${name}}not found`);
      relations.push(...this.store.get(name).relations);
    }

    const metrics = [];
    for (const metric of this.store.values()) {
      let marked = false;
      if (expanded.length)
        marked = relations.indexOf(metric.name) !== -1;
      if (upgrade || !expanded.length)
        marked = metric.level === 0;
      if (marked) metrics.push(metric);
    }
    return { state: this.storeStateId, metrics };
  }

  updateMetric({ name, value }) {
    if (!this.store.has(name))
      throw new Error(`Metric ${{ name }} not found`);
    const metric = this.store.get(name);
    this.store.set(name, { ...metric, value });
    return { state: ++this.storeStateId };
  }

  load({ cancellation = false } = {}) {
    const loadId = Math.ceil(Math.random() * 1000000);
    if (this.loadId) {
      if (cancellation) this.cancelLoad.push(this.loadId);
      else logger.debug(`Cancel load ${loadId}: another load in progress`);
    }

    this.loadId = loadId;
    return readFileAsync(this.dataPath).then(content => {
      /* Обработка отмены переиндексации */
      const cancelIdx = this.cancelLoad.indexOf(loadId);
      if (cancelIdx !== -1) {
        this.cancelLoad.splice(cancelIdx, 1);
        if (++this.cancelCounter < MAX_CANCEL_RETRY)
          return logger.debug(`Cancel load ${loadId}: receive cancellation signal`);
        else
          this.cancelCounter = 0;
      }

      /* Подготовка контента */
      const { params } = JSON.parse(content);
      const relations = new Set();

      /* Первый проход - сохранение метрик необходимой группы */
      for (const metric of params) {
        if ((metric.groupId || []).indexOf(GROUP_ID) === -1)
          continue;

        this.store.set(metric.name, new Metric({ ...metric, level: 0 }));
        for (const name of (metric.relations || []))
          relations.add(name);
      }

      /* Второй проход - сохранение метрик из relations */
      for (const metric of params) {
        if (relations.has(metric.name))
          this.store.set(metric.name, new Metric({ ...metric, level: 1 }));
      }

      this.loadId = 0;
      this.storeStateId = loadId;
      logger.debug(`Load ${loadId}: complete`);
      this.emit("load");
    }).catch(err => logger.error({ msg: `Load ${loadId}: ` + err.message, stack: err.stack }));
  }
}

module.exports = MetricService;
