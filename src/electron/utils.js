const { app } = require("electron");
const path = require("path");

function getSrcPath(relativePath) {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "app.asar", relativePath); // app.asar?
  } else {
    return path.join(__dirname, "..", relativePath);
  }
}

function getResourcePath(relativePath) {
  return getSrcPath(path.join("resources", relativePath));
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "app.asar", relativePath); // app.asar?
  } else {
    return path.join(__dirname, "resources", relativePath);
  }
}

function getPythonBackendPath() {
  return path.join(
    process.resourcesPath,
    "python",
    process.platform === "win32" ? "app.exe" : "app",
  );
}

module.exports = { getResourcePath, getSrcPath, getPythonBackendPath };
