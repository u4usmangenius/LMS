const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // Define functions for Electron-React communication
  // For example, use IndexedDB for data storage and retrieval
});
// Disable the Ctrl+ and Cmd+ keyboard shortcuts
globalShortcut.unregister("CommandOrControl+=");
globalShortcut.unregister("CommandOrControl+-");
globalShortcut.unregister("CommandOrControl+_");

// Disable the Ctrl+ and Shift+ keyboard shortcuts
globalShortcut.unregister("Control+Shift+=");
globalShortcut.unregister("Control+Shift+-");
