"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const mime = require('mime-types');
const { promisify } = require("util");
const logger = require("./logger");

const readFileAsync = promisify(fs.readFile);

class HttpServer {
  constructor({ port = 8080, staticPath = "public/build" }) {
    this.port = port;
    this.server = http.createServer((req, res) => {
      let filePath = staticPath + req.url;
      if (req.url === "/")
        filePath = "public/index.html";

      const contentType = mime.contentType(path.extname(filePath));
      readFileAsync(filePath).then(content => {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
      }).catch(err => {
        if (err.code === "ENOENT") {
          res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
          res.end("404 Not Found", "utf-8");
        } else {
          res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
          res.end("500 Internal Server Error", "utf-8");
        }
      });
    });
  }

  start() {
    this.server.listen(this.port, (err) => {
      if (err) throw err;
      logger.info(`HttpServer listen on ${this.port}`);
    });
  }
}

module.exports = HttpServer;
