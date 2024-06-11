const globalShortcut = require("electron").globalShortcut;

const { app, session, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./backend/db/Sqlite.js").db;

const expressApp = require("./server");

expressApp.use(cors());
expressApp.use(
  cors({
    allowedHeaders: "Authorization, Content-Type", // Add other headers if needed
  })
);
expressApp.use(
  cors({
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  })
);

expressApp.use(bodyParser.json());
expressApp.use(express.static(path.join(__dirname, "frontend/build")));

const port = 8080;

// import other modules here
const BookModel = require("./backend/Models/BookModel.js");
const LoginModel = require("./backend/Models/LoginModel.js");
const CategoryModel = require("./backend/Models/CategoryModel.js");
const DepartmentModel = require("./backend/Models/DepartmentModel.js");
const StudentModel = require("./backend/Models/StudentModel.js");
const TransectionModel = require("./backend/Models/TransectionModel.js");
const HistoryModel = require("./backend/Models/HistoryModel.js");
require("./backend/Models/TaskScheduler.js");

expressApp.use("/", LoginModel);
expressApp.use("/", BookModel);
expressApp.use("/", CategoryModel);
expressApp.use("/", DepartmentModel);
expressApp.use("/", StudentModel);
expressApp.use("/", TransectionModel);
expressApp.use("/", HistoryModel);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1060,
    minHeight: 671,
    height: 671,
    minWidth: 1060,
    title: "Library Management System",
    icon: path.join(__dirname, "icon.ico"),
    webPreferences: {
      devTools: true,
      OS: "Windows",
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  mainWindow.webContents.setVisualZoomLevelLimits(1, 1);

  const contents = mainWindow.webContents;
  contents.on("before-input-event", (event, input) => {
    if (input.type === "keyDown") {
      if (
        (input.control || input.meta) &&
        (input.key === "Add" || input.key === "Subtract")
      ) {
        // Ignore Ctrl+ or Cmd+ with + or - keys
        event.preventDefault();
      }
    }
  });

  // Disable the Ctrl+ and Cmd+ keyboard shortcuts
  globalShortcut.unregister("CommandOrControl+=");
  globalShortcut.unregister("CommandOrControl+-");
  globalShortcut.unregister("CommandOrControl+_");

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "frontend/build/index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // Prevent zooming via keyboard shortcuts

  // Open the DevTools during development
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.closeDevTools();
  }

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  const appSession = session.defaultSession; // Get the default session

  // Clear cache
  appSession.clearCache(() => {
    // Cache cleared
    console.log("Cache cleared.");
  });
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  url;
  if (mainWindow === null) {
    createWindow();
  }
});
// start express
expressApp.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// app.on("ready", createWindow);
// app.on("ready", () => {
// });

function setupAppListeners() {
  app.on("ready", () => {
    console.log("App is ready");
    createWindow();
  });
}

setupAppListeners();
