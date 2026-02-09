const http = require("node:http");
let app;

function startAppServer(port) {
  return new Promise((resolve, reject) => {
    app = require("../../../src/app.js");
    const server = http.createServer(app);
    server.on("error", (err) => {
      console.error(`API Server failed to start on port ${port}:`, err);
      reject(err);
    });
    server.listen(port, "0.0.0.0");
    server.on("listening", async () => {
      console.log(`API Server started on port ${port}`);
      resolve(server);
    });
  });
}

function stopAppServer(appServer) {
  return new Promise((resolve, reject) => {
    appServer.close((err) => {
      if (err) {
        console.error(`Stopping API Server failed with ${err}`);
        reject();
      } else {
        console.log("API Server stopped successfully");
        resolve();
      }
    });
  });
}

function getApp() {
  return app;
}

module.exports = { getApp, startAppServer, stopAppServer };
