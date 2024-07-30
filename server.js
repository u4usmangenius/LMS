// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const expressApp = express();
// expressApp.use(cors());
// expressApp.use(bodyParser.json());
// module.exports = expressApp;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const port = 8080;
const { app } = require("electron");

const expressApp = express();
expressApp.use(cors());
expressApp.use(bodyParser.json());
expressApp.use(express.static(path.join(__dirname, "backend", "Models")));
expressApp.use((req, res, next) => {
  req.electronApp = app;
  next();
});


let server;

function startServer() {
  server = expressApp.listen(port, () => {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    console.log(`Server is running on port ${port}`);
  });
}

function stopServer() {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close((err) => {
        if (err) {
          console.log("error while stopping the server")
          return reject(err);
        }
        console.log("Server has successfully stopped");
        server = null;
        resolve();
      });
    } else {
      resolve();
    }
  });
}

function isServerRunning() {
  return !!server;
}

module.exports = {
  startServer,
  stopServer,
  isServerRunning,
  expressApp,
};
