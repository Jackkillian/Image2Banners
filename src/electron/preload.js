const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

contextBridge.exposeInMainWorld("api", {
  getResourcePath: (relativePath) =>
    ipcRenderer.invoke("get-resource-path", relativePath),
  asset: (filename) => {
    return `file://${path.join(__dirname, "../resources/assets", filename)}`;
  },

  readFile: (filePath) => fs.readFileSync(filePath, "utf8"),
  writeFile: (filePath, data) => fs.writeFileSync(filePath, data, "utf8"),
  exists: (filePath) => fs.existsSync(filePath),
  readDir: (dirPath) => fs.readdirSync(dirPath),

  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  on: (channel, listener) =>
    ipcRenderer.on(channel, (_event, ...args) => {
      try {
        listener(_event, ...args);
      } catch (err) {
        console.error(`Error in IPC listener "${channel}":`, err);
      }
    }),
});
