const multer = require("multer");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { verifyToken } = require("./authMiddleware");
const {
  startServer,
  stopServer,
  isServerRunning,
  expressApp,
} = require("../../server.js");
const { dialog, BrowserWindow } = require("electron");
const mainWindow = BrowserWindow.getAllWindows()[0]; // Assuming there is only one main window

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const electronApp = req.electronApp;

    // Use app.getPath('exe') to get the executable path and then derive the desired storage path
    const exePath = electronApp.getPath('exe');
    const baseDir = path.dirname(exePath);

    cb(null, baseDir);
  },
  filename: (req, file, cb) => {
    cb(null, "backup.sqlite"); // Save the file as backup.sqlite
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== ".sqlite") {
      return cb(new Error("Only .sqlite files are allowed"));
    }
    cb(null, true);
  },
});

// Route to handle file import
router.post(
  "/api/import",
  verifyToken,
  upload.single("importedDB"),
  async (req, res) => {
    const electronApp = req.electronApp;

    // Use app.getPath('exe') to get the executable path and then derive the desired storage path
    const exePath = electronApp.getPath('exe');
    const baseDir = path.dirname(exePath);
    const backupDatabasePath = path.join(baseDir, "backup.sqlite");

    console.log(
      "api/import usman backup.sqlite path=electronpath(userData)= ",
      backupDatabasePath
    );

    try {
      console.log("Database imported and stored as backup.sqlite");
      res
        .status(200)
        .json({ message: "Database imported and stored as backup.sqlite" });

      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Success',
        message: 'Database imported successfully.',
        buttons: ['OK']
      }).then(() => {
        // After the dialog is closed, wait for a moment before running the remaining code
        setTimeout(() => {
          async function restartServer() {
            await stopServer();
            startServer();
          }

          restartServer();
          electronApp.quit();
          electronApp.relaunch();
        }, 3000); // Adjust the delay time as needed (e.g., 3000ms = 3 seconds)
      });


    } catch (error) {
      console.error("Error handling the imported database:", error);
      res.status(500).json({
        message: "Error handling the imported database",
        error: error.message,
      });
    }
  }
);
router.get("/api/export", verifyToken, (req, res) => {
  const electronApp = req.electronApp;

  // Use app.getPath('exe') to get the executable path and then derive the desired storage path
  const exePath = electronApp.getPath('exe');
  const baseDir = path.dirname(exePath);
  const sourceDatabasePath = path.join(baseDir, 'Library.sqlite');

  console.log(
    "router.get FilesModel export model usman, path showing sourceDatabasePath=",
    sourceDatabasePath
  );

  const fileName = "Library.sqlite"; // Set the desired file name

  res.download(sourceDatabasePath, fileName, (err) => {
    if (err) {
      console.error("Error exporting database:", err);
      res.status(500).send("Error exporting database");
    } else {
      console.log("Database exported successfully");
    }
  });
});


module.exports = router;
