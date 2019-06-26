// VARS---------------------------------------------------------
// array with submited fields
let currentMap = [];
//order of clicks
let clickQueue = [];
// currently selected items
let currentSelect = [];
// screen vars
const screenLength = 90;
const screenHeight = 90;
// how big 1 div shoudl be, for example: 3x3
const pixRatio = 1;
//  currently selected map item
let selectedItem = "";

// HTML elements set up
document.querySelector("table").style.width = screenLength * 20 + "px";
function generateMapCreator() {
  const table = document.getElementById("main-table");
  const screenLengthCells = screenLength / pixRatio;
  const screenHeightCells = screenHeight / pixRatio;

  for (let i = 0; i < screenHeightCells; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < screenLengthCells; j++) {
      let td = document.createElement("td");
      td.id = j + " " + i;
      td.className = "box";
      let div = document.createElement("div");
      div.className = "fill";
      td.height = 20;
      td.width = 20;
      td.appendChild(div);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}
generateMapCreator();

// TODO - clean up fields init
const fixedFieldSpritesNumber = 16;
const spritesDiv = document.querySelector(".sprites .map_fields");
const title = document.createElement("h5");
title.innerHTML = "Pola Fixed";
spritesDiv.appendChild(title);
for (let i = 1; i <= fixedFieldSpritesNumber; i++) {
  const newImg = document.createElement("img");
  newImg.src = "../sprites/fixed/" + i + ".png";
  newImg.id = "sprites-fixed-" + i;
  spritesDiv.appendChild(newImg);
}

// METHODS----------------------------------------------------------
function convertIdIntoPos(number) {
  let y = number.split(" ")[1];
  let x = number.split(" ")[0];
  let pos = { x, y };
  return pos;
}
function handleBoxClick(event) {
  if (event.target.className.indexOf("box") > -1) {
    let element = event.target;
    let number = element.id;
    // Generate obj of positions for clicked element
    let currentClick = { pos: convertIdIntoPos(number), id: number };
    // Add current click to click queue
    clickQueue.push(event.target);
    //Add color to prev selected items
    if (currentSelect.length) {
      let adress = document.getElementById(currentSelect[0].id);
      adress.classList.remove("current-select");
      adress.classList.add("prev-select");
    }
    currentSelect.unshift(currentClick);
    element.classList.add("current-select");
  }
}
function keyDrawing(dir) {
  const last = currentSelect[0];
  const x = parseInt(last.pos.x);
  const y = parseInt(last.pos.y);
  if (dir === "N") {
    const aimedNode = document.getElementById(`${x} ${y - 1}`);
    aimedNode.click();
  } else if (dir === "S") {
    const aimedNode = document.getElementById(`${x} ${y + 1}`);
    aimedNode.click();
  } else if (dir === "E") {
    const aimedNode = document.getElementById(`${x + 1} ${y}`);
    aimedNode.click();
  } else {
    const aimedNode = document.getElementById(`${x - 1} ${y}`);
    aimedNode.click();
  }
}

function drawMapIntoTable(map) {
  map.forEach(field => {
    let cell = document.getElementById(field.id);
    cell.className = "";
    cell.innerHTML = "";
    cell.classList.add("box");
    const newImg = document.createElement("img");
    const path = field.type.replace(/-/g, "/");
    newImg.src = "../" + path + ".png";
    cell.appendChild(newImg);
  });
  cleanCurrentMap("type", "-empty");
}
function cleanCurrentMap(target, value) {
  currentMap = currentMap.filter(ele => {
    return ele[target] !== value;
  });
}
function convertMap(world) {
  const finalMap = {
    x: screenLength,
    y: screenHeight
  };
  const map = [];
  world.forEach(ele => {
    const baseX = parseInt(ele.pos.x);
    const baseY = parseInt(ele.pos.y);
    for (let i = 0; i < pixRatio; i++) {
      for (let j = 0; j < pixRatio; j++) {
        let obj = {
          type: ele.type,
          pos: {
            x: baseX * pixRatio + i,
            y: baseY * pixRatio + j
          }
        };
        map.push(obj);
      }
    }
  });
  finalMap.map = map;
  return finalMap;
}
function downloadMap(obj) {
  let dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
  let dlAnchorElem = document.getElementById("downloadAnchorElem");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "scene.json");
  dlAnchorElem.click();
}
function convertGameMapToEditMap(gameMap) {
  const map = gameMap.map;
  return map.map(ele => {
    const { type, pos } = ele;
    id = pos.x + " " + pos.y;
    return {
      type,
      pos,
      id
    };
  });
}
// Handlers----------------------------------------------------------------------------
//add map to edit
document.querySelector("form").addEventListener("submit", e => {
  e.preventDefault();
  const file = e.target[0].files[0];
  const fileReader = new FileReader();
  fileReader.onload = e => {
    let lines = e.target.result;
    const newArr = JSON.parse(lines);
    currentMap = convertGameMapToEditMap(newArr);
    drawMapIntoTable(currentMap);
  };
  fileReader.readAsText(file);
});

// set currently checked element
const allSpirtes = document.querySelectorAll(".map_fields img");
allSpirtes.forEach(sprite => {
  sprite.addEventListener("click", e => {
    allSpirtes.forEach(ele => {
      ele.style.border = "none";
    });
    e.target.style.border = "2px dashed brown";
    selectedItem = e.target.id;
  });
});

// handle clicking on map
document.querySelector("element").addEventListener("click", event => {
  handleBoxClick(event);
});

//handle adding filed
document.getElementById("add-fields").addEventListener("click", () => {
  let fieldType = selectedItem;
  if (fieldType) {
    currentSelect.forEach(field => {
      currentMap.forEach((ele, index) => {
        if (ele.id === field.id) {
          currentMap.splice(index, 1);
        }
      });
      field.type = fieldType;
      currentMap.push(field);
    });
    currentSelect = [];
    drawMapIntoTable(currentMap);
  }
});

// handle removing fields
document.querySelector("#remove-select").addEventListener("click", () => {
  if (currentSelect.length) {
    const ids = currentSelect.map(ele => ele.id);
    ids.forEach(id => {
      document.getElementById(id).classList.remove("prev-select");
      document.getElementById(id).classList.remove("current-select");
      document.getElementById(id).innerHTML = "";
    });
    currentMap = currentMap.filter(ele => ids.indexOf(ele.id) === -1);
    currentSelect = [];
    drawMapIntoTable(currentMap);
  }
});

//helper keys
document.addEventListener("keydown", () => {
  if (event.key === "Enter") {
    document.getElementById("add-fields").click();
  } else if (event.key === "Delete") {
    document.querySelector("#remove-select").click();
  } else if (event.key === "Escape") {
    if (currentSelect.length) {
      const ids = currentSelect.map(ele => ele.id);
      ids.forEach(id => {
        document.getElementById(id).classList.remove("prev-select");
        document.getElementById(id).classList.remove("current-select");
      });
      currentSelect = [];
    }
  }
});

document.getElementById("generate-json").addEventListener("click", () => {
  downloadMap(convertMap(currentMap));
});
document.addEventListener("keydown", event => {
  event.preventDefault();
  console.log(event);
  if (event.key === "ArrowRight") {
    keyDrawing("E");
  } else if (event.key === "ArrowLeft") {
    keyDrawing("W");
  } else if (event.key === "ArrowUp") {
    keyDrawing("N");
  } else if (event.key === "ArrowDown") {
    keyDrawing("S");
  }
});
