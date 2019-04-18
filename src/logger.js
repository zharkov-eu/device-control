"use strict";

const pino = require("pino");

const logger = pino({
  level: process.env["LOG_LEVEL"] || "debug",
  serializers: { err: pino.stdSerializers.err },
});

module.exports = logger;
