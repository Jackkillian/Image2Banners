const fs = {
  readFileSync: window.api.readFile,
  writeFileSync: window.api.writeFile,
  existsSync: window.api.exists,
  readdirSync: window.api.readDir,
};

const REMOTE_INDEX_URL =
  "https://raw.githubusercontent.com/MARSTeamMC/Image2Banners/main/lang/index.json";

async function updateLanguages(lang_dir, package_file) {
  try {
    const res = await fetch(REMOTE_INDEX_URL);
    if (!res.ok) throw new Error(res.statusText);
    remoteIndex = await res.json();
  } catch (err) {
    console.log("No remote translation index found or network offline.");
    return;
  }

  for (const [langCode, remoteUrl] of Object.entries(remoteIndex)) {
    let localData = null;
    if (fs.existsSync(`${lang_dir}/${langCode}.json`)) {
      const response = await fetch(`${lang_dir}/${langCode}.json`);
      localData = await response.json();
    }

    let remoteData;
    try {
      const res = await fetch(remoteUrl);
      if (!res.ok) continue;
      remoteData = await res.json();
    } catch {
      continue;
    }

    let localAppVersion = "0.0.0";
    let localLangVersion = 0;
    if (localData != null) {
      localAppVersion = localData["appVersion"];
      localLangVersion = localData["langVersion"];
    }

    remoteAppVersion = remoteData["appVersion"];
    remoteLangVersion = remoteData["langVersion"];

    const app_response = await fetch(package_file);
    package = await app_response.json();

    if (
      (remoteLangVersion > localLangVersion &&
        remoteAppVersion == localAppVersion) ||
      (localData == null && remoteAppVersion == package["version"])
    ) {
      fs.writeFileSync(
        `${lang_dir}/${langCode}.json`,
        JSON.stringify(remoteData, null, 2),
      );
    }
  }
}

async function loadLanguages(config_file, lang_dir) {
  const files = fs.readdirSync(lang_dir);
  for (const file of files) {
    if (file.endsWith(".json") && file != "index.json") {
      const response = await fetch(`${lang_dir}/${file}`);
      const translation = await response.json();
      const languageName = translation["languageName"];
      const translators = translation["translators"].join(", ");

      let div = document.querySelectorAll(".dropdown-content")[0];
      let button = document.createElement("button");
      button.classList.add("button");
      button.style.marginTop = "8px";
      button.dataset.lang = file.split(".")[0];
      button.onclick = function () {
        setLanguage(config_file, lang_dir, this.dataset.lang);
      };
      button.innerHTML = `${languageName} <br> (by ${translators})`;
      div.appendChild(button);
    }
  }
}

async function setLanguage(config_file, lang_dir, locale) {
  const response = await fetch(`${lang_dir}/${locale}.json`);
  const translation = await response.json();
  const translationKeys = Object.keys(translation);
  for (const translationKey of translationKeys) {
    try {
      document.getElementById(translationKey).textContent =
        translation[translationKey];
    } catch (e) {
      console.log("Caught error:", e.message);
    }
  }

  fs.writeFileSync(config_file, JSON.stringify({ locale }, null, 2), "utf8");
}

async function getResourcePath(relativePath) {
  return await window.api.getResourcePath(relativePath);
}

(async () => {
  if (document.readyState === "loading") {
    await new Promise((resolve) =>
      document.addEventListener("DOMContentLoaded", resolve),
    );
  }
  const DEFAULT_LOCALE = "en-US";
  const LANG_DIR = await getResourcePath("lang");
  const CONFIG_FILE = await getResourcePath("config.json");
  const PACKAGE_FILE = await getResourcePath("../../package.json");

  let currentLocale = DEFAULT_LOCALE;
  if (fs.existsSync(CONFIG_FILE)) {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
    if (config.locale) currentLocale = config.locale;
  }

  updateLanguages(LANG_DIR, PACKAGE_FILE).then(() => {
    loadLanguages(CONFIG_FILE, LANG_DIR);
    setLanguage(CONFIG_FILE, LANG_DIR, currentLocale);
  });
})();
