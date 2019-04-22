"use strict";

const fs = require("fs");
const url = require("url");
const http = require("http");
const path = require("path");
const mime = require('mime-types');
const { promisify } = require("util");
const logger = require("./logger");

const readFileAsync = promisify(fs.readFile);
const htmlContentType = "text/html; charset=utf-8";

class HttpServer {
  constructor({ port = 8080, staticPath = "public/build", templatePath = "public" }) {
    this.port = port;
    this.server = http.createServer((req, res) => {
      const uri = url.parse(req.url);
      const contentType = mime.contentType(path.extname(uri.pathname)) || htmlContentType;
      let filePath = contentType === htmlContentType ? templatePath + uri.pathname : staticPath + uri.pathname;
      if (uri.pathname === "/")
        filePath = "public/index.html";

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
