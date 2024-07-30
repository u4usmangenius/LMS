const globalShortcut = require("electron").globalShortcut;

const { app, session, BrowserWindow, Menu } = require("electron");
const path = require("path");
const fs = require("fs");
const fs_Promises = require("fs").promises;
const url = require("url");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { dialog } = require("electron");

let db; // Global variable for the database connection

const {
  startServer,
  stopServer,
  isServerRunning,
  expressApp,
} = require("./server.js");

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

// Start of the else block

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    minHeight: 671,
    height: 671,
    minWidth: 1200,
    title: "Library Management System",
    icon: path.join(__dirname, "icon.ico"),
    webPreferences: {
      devTools: false,
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
async function prepareDatabase() {
  // Use app.getPath('exe') to get the executable path and then derive the desired storage paths
  const exePath = app.getPath('exe');
  const baseDir = path.dirname(exePath);

  // Correctly adjust the paths
  const sourceDatabasePath = path.join(baseDir, "Library.sqlite");
  const backupDatabasePath = path.join(baseDir, "backup.sqlite");

  console.log("main.js sourceDatabasePath=", sourceDatabasePath);
  console.log("main.js backupDatabasePath=", backupDatabasePath);

  try {
    // Check if the backup database file exists
    // await fs_Promises.access(backupDatabasePath, fs.constants.F_OK);
    await fs_Promises.rename(backupDatabasePath, sourceDatabasePath);
    console.log("backup.sqlite renamed to Library.sqlite");
    dialog.showMessageBox({
      type: "info",
      title: "Database Update",
      message: "Successfully updated the database.",
      buttons: ["OK"],
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(
        "Usman catch error Backup file does not exist, skipping update."
      );
      return; // Early exit if file does not exist
    } else {
      console.error("error usman catch error Error preparing database:", error);
    }
  } finally {
    return true;
  }
}



function setupRoutes() {
  // import other modules here
  const BookModel = require("./backend/Models/BookModel.js");
  const LoginModel = require("./backend/Models/LoginModel.js");
  const CategoryModel = require("./backend/Models/CategoryModel.js");
  const DepartmentModel = require("./backend/Models/DepartmentModel.js");
  const StudentModel = require("./backend/Models/StudentModel.js");
  const TransectionModel = require("./backend/Models/TransectionModel.js");
  const HistoryModel = require("./backend/Models/HistoryModel.js");
  const DashboardModel = require("./backend/Models/DashboardModel.js");
  const fileModel = require("./backend/Models/FilesModel.js");
  require("./backend/Models/TaskScheduler.js");

  expressApp.use("/", LoginModel);
  expressApp.use("/", BookModel);
  expressApp.use("/", CategoryModel);
  expressApp.use("/", DepartmentModel);
  expressApp.use("/", StudentModel);
  expressApp.use("/", TransectionModel);
  expressApp.use("/", HistoryModel);
  expressApp.use("/", DashboardModel);
  expressApp.use("/", fileModel);
}

Promise.all([prepareDatabase(), setupRoutes()])
  .then(() => {
    db = require("./backend/db/Sqlite.js").db;
    setupAppListeners();
  })
  .catch((error) => {
    console.error("Error during initialization:", error);
  });
function setupAppListeners() {
  app.on("ready", () => {
    console.log("App is ready");
    createWindow();
  });
}

Menu.setApplicationMenu(null);

// Create a custom menu
const customMenu = Menu.buildFromTemplate([
  {
    label: "File",
    submenu: [
      {
        label: "Reload",
        role: "reload", // Use the role property for the predefined reload action
      },
      { role: "quit" }, // Add a quit option to close the app
    ],
  },
]);

// Set the custom menu
Menu.setApplicationMenu(customMenu);

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
startServer();

// app.on("ready", createWindow);
// app.on("ready", () => {
// });

// setupAppListeners();
