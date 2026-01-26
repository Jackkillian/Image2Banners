window.api.send("resize-window-gen", 1, 1);

window.addEventListener("resize", () => {
  let buttonHeight;
  if (document.querySelectorAll(".imageSelector")[0].style.display != "none") {
    buttonHeight = document.querySelectorAll(".imageSelector")[0].clientHeight;
  } else if (
    document.querySelectorAll(".progressBar")[0].style.display != "none"
  ) {
    buttonHeight = document.querySelectorAll(".progressBar")[0].clientHeight;
  } else {
    buttonHeight = document.querySelectorAll(".saveButtons")[0].clientHeight;
  }
  document.querySelectorAll(".imgDiv")[0].style.height =
    `calc(100vh - ${buttonHeight}px - 91px)`;

  let imgWidth = document.getElementById("imagePreview").clientWidth;
  document.getElementById("images").style.width = imgWidth + "px";
});

const threadsCount = navigator.hardwareConcurrency;
document.getElementById("threadsRange").max = threadsCount;
document.getElementById("threadsRange").value = threadsCount;
document.getElementById("threadsNumber").max = threadsCount;
document.getElementById("threadsNumber").value = threadsCount;
document.getElementById("maxThreadsRange").textContent = threadsCount;

let filePath = "none";
const BLOCK_ASSET = window.api.asset("block.png");

document
  .getElementById("selectFileButton")
  .addEventListener("click", async () => {
    const data = await window.api.invoke("select-file");
    const fileFormat = data[0];
    filePath = data[1];
    if (fileFormat == "json") {
      window.api.send("resize-window-gen", 1, 1);
      document.getElementById("imagePreview").src = BLOCK_ASSET;
      document.querySelectorAll(".json-div")[0].style.display = "flex";
      document.querySelectorAll(".settingCheckbox").forEach((element) => {
        element.style.display = "none";
      });
      document.querySelectorAll(".settingRange").forEach((element, index) => {
        if (index !== 0) {
          element.style.display = "none";
        }
      });
      document.querySelectorAll(".resolution")[0].style.display = "none";
    } else {
      document.querySelectorAll(".json-div")[0].style.display = "none";
      document.getElementById("imagePreview").src = filePath;
      document.querySelectorAll(".settingCheckbox").forEach((element) => {
        element.style.display = "flex";
      });
      document.querySelectorAll(".resolution")[0].style.display = "flex";
    }
  });

document.getElementById("saveAsImg").addEventListener("click", async () => {
  const operation = "save_as_image";
  const resolutionInputs = document.querySelectorAll(".resolution input");
  const resolutionWidth = resolutionInputs[0].value;
  const resolutionHeight = resolutionInputs[1].value;

  const data = {
    operation,
    resolution: [resolutionWidth, resolutionHeight],
  };

  window.api.send("send_data", data);
});

document.getElementById("saveAsJSON").addEventListener("click", async () => {
  const operation = "save_as_json";
  const resolutionInputs = document.querySelectorAll(".resolution input");
  const resolutionWidth = resolutionInputs[0].value;
  const resolutionHeight = resolutionInputs[1].value;

  const data = {
    operation,
    resolution: [resolutionWidth, resolutionHeight],
  };

  window.api.send("send_data", data);
});

document.getElementById("saveAsNBT").addEventListener("click", async () => {
  const operation = "save_as_nbt";
  const resolutionInputs = document.querySelectorAll(".resolution input");
  const resolutionWidth = resolutionInputs[0].value;
  const resolutionHeight = resolutionInputs[1].value;

  const data = {
    operation,
    resolution: [resolutionWidth, resolutionHeight],
  };

  window.api.send("send_data", data);
});

document
  .getElementById("generateBanners")
  .addEventListener("click", async () => {
    if (filePath != BLOCK_ASSET) {
      const resolutionInputs = document.querySelectorAll(".resolution input");
      const resolutionWidth = resolutionInputs[0].value;
      const resolutionHeight = resolutionInputs[1].value;

      const checkboxes = document.querySelectorAll(
        '.settingCheckbox input[type="checkbox"]',
      );
      const generateBlocks = checkboxes[0].checked;
      const generateLayeredBanners = checkboxes[1].checked;
      const generateBigBanners = checkboxes[2].checked;
      const usePatternItems = checkboxes[3].checked;

      const rangeInputs = document.querySelectorAll(
        '.settingRange input[type="range"]',
      );
      const threadsCount = rangeInputs[0].value;
      const compareMethod = rangeInputs[1].value;

      document.querySelectorAll(".settingCheckbox").forEach((element) => {
        element.style.display = "none";
      });
      document.querySelectorAll(".settingRange").forEach((element) => {
        element.style.display = "none";
      });
      document.querySelectorAll(".resolution")[0].style.display = "none";
      document.querySelectorAll("#selectFileButton")[0].style.display = "none";
      document.getElementById("generateBanners").style.display = "none";
      document.querySelectorAll(".progressBar")[0].style.display = "block";
      document.querySelectorAll(".right-side")[0].style.display = "none";
      document.querySelectorAll(".imageSelector")[0].style.display = "none";
      document.querySelectorAll(".left-side")[0].style.width = "100%";
      document.querySelectorAll(".json-div")[0].style.display = "none";
      document.querySelectorAll(".links")[0].style.display = "none";

      window.api.send("resize-window", resolutionWidth, resolutionHeight);

      const operation = "generate";

      const data = {
        operation,
        filePath: encodeURI(filePath),
        resolution: [resolutionWidth, resolutionHeight],
        generateBlocks,
        generateLayeredBanners,
        generateBigBanners,
        usePatternItems,
        threadsCount,
        compareMethod,
      };

      window.api.send("send_data", data);

      for (
        let i = 0;
        i < (resolutionWidth * 2 * Math.round(resolutionHeight / 2)) / 2;
        i++
      ) {
        var ban = document.createElement("img");
        ban.id = i;
        ban.src = window.api.asset("banner.png");
        ban.classList.add("banner");
        ban.style.bottom =
          (6 + 6.5 * Math.floor(i / resolutionWidth)).toString() + "%";
        var src = document.getElementById("images");
        src.style.gridTemplateColumns = "auto ".repeat(resolutionWidth);
        src.appendChild(ban);
      }
    }
  });

window.api.on("update-progress-bar", (event, text) => {
  const unLoaded = document.querySelectorAll(".unLoaded")[0];
  unLoaded.textContent = text;

  const loaded = document.querySelectorAll(".loaded")[0];
  loaded.textContent = text;
  loaded.style.clipPath =
    "inset(0 " +
    (
      100 -
      (parseInt(text.split("/")[0]) / parseInt(text.split("/")[1])) * 100
    ).toString() +
    "% 0 0)";

  let imgHeight = document.getElementById("imagePreview").offsetHeight;
  let bannersHeight = document.getElementById("images").offsetHeight;

  let imgWidth = document.getElementById("imagePreview").clientWidth;
  document.getElementById("images").style.width = imgWidth + "px";

  let clip = bannersHeight - imgHeight;
  document.getElementById("images").style.clipPath = `inset(0 0 ${clip}px 0)`;
});

window.api.on("update-on-generated", (event) => {
  document.querySelectorAll(".progressBar")[0].style.display = "none";
  document.querySelectorAll(".saveButtons")[0].style.display = "flex";
  document.querySelectorAll(".bannerAndBlock")[0].style.display = "flex";
  document.querySelectorAll(".craftBannersCoords")[0].style.display = "flex";
  document.querySelectorAll(".right-side")[0].style.display = "block";
  document.querySelectorAll(".giveCommand")[0].style.display = "flex";
  document.querySelectorAll(".left-side")[0].style.width = "calc(100% - 400px)";
  document.querySelectorAll(".banner").forEach(function (a) {
    a.remove();
  });
  document.querySelectorAll(".links")[0].style.display = "flex";

  const resolutionInputs = document.querySelectorAll(".resolution input");
  const resolutionWidth = resolutionInputs[0].value;
  const resolutionHeight = resolutionInputs[1].value;

  window.api.send("resize-window-gen", resolutionWidth, resolutionHeight);

  const operation = "steps";
  const id = "(0,0)";

  const data = {
    operation,
    id,
  };

  window.api.send("send_data", data);
});

window.api.on("update-banner", (event, lst) => {
  const banner = document.getElementById(lst[0]);
  banner.src = lst[1];
});

window.api.on("update-image-preview", (event, text) => {
  const image = document.getElementById("imagePreview");
  image.src = text;
});

window.api.on("update-default-resolution", (event, lst) => {
  const width = document.querySelector(".width");
  const height = document.querySelector(".height");
  width.value = lst[0];
  height.value = lst[1];
});

window.api.on("remove-steps", (event) => {
  const old = document.querySelectorAll(".craftStep");
  old.forEach((element) => {
    if (element.id != "craftStepSample") {
      element.remove();
    }
  });
});

window.api.on("create-steps", (event, data) => {
  const id = data[1];
  const old = document.getElementById(id);
  if (!old) {
    const original = document.getElementById("craftStepSample");
    const clone = original.cloneNode(true);
    clone.id = id;
    document.querySelectorAll(".craftBanners")[0].appendChild(clone);
  }
});

window.api.on("update-steps", (event, data) => {
  const id = data[1];
  const img = data[2];
  const pattern = data[3];
  const pattern_name = data[4];
  const step = document.getElementById(id);
  step.style.display = "flex";
  const bannerInfo = step.querySelectorAll(".BannerInfo");
  bannerInfo[0].querySelectorAll("img")[0].src = img;
  bannerInfo[1].querySelectorAll("img")[0].src = pattern;
  const p = step.querySelectorAll("p");
  p[0].textContent = "Step - " + id;
  p[1].textContent = pattern_name;
});

window.api.on("update-resolution", (event, data) => {
  const width = data[0];
  const height = data[1];
  const resolutionInputs = document.querySelectorAll(".resolution input");
  resolutionInputs[0].value = width;
  resolutionInputs[1].value = height;
});

window.api.on("final-result", (event, data) => {
  const banner_img = data[1];
  const block = data[2];
  const block_img = data[3];
  const command = data[4];
  const result = document.querySelectorAll(".bannerAndBlock")[0];
  const bannerInfo = result.querySelectorAll(".BannerInfo")[0];
  const blockInfo = result.querySelectorAll(".BlockInfo")[0];
  bannerInfo.querySelectorAll("img")[0].src = banner_img;
  blockInfo.querySelectorAll("img")[0].src = block_img;
  blockInfo.querySelectorAll("p")[0].textContent = block;
  const giveCommand = document.querySelectorAll(".giveCommand")[0];
  giveCommand.querySelectorAll("small")[0].innerText = command;
  let commandHeight = document.querySelectorAll(".giveCommand")[0].clientHeight;
  document.querySelectorAll(".settings")[0].style.height =
    `calc(100vh - 166px - ${commandHeight}px)`;
  document.querySelectorAll(".settings-sub")[0].style.height =
    `calc(100vh - 166px - ${commandHeight}px)`;
});

document.getElementById("x_coord").addEventListener("change", async () => {
  const operation = "steps";
  const id =
    "(" +
    document.getElementById("x_coord").value +
    "," +
    document.getElementById("y_coord").value +
    ")";

  const data = {
    operation,
    id,
  };

  window.api.send("send_data", data);
});

document.getElementById("y_coord").addEventListener("change", async () => {
  const operation = "steps";
  const id =
    "(" +
    document.getElementById("x_coord").value +
    "," +
    document.getElementById("y_coord").value +
    ")";

  const data = {
    operation,
    id,
  };

  window.api.send("send_data", data);
});
