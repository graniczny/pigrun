fetch("./scene.json")
  .then(res => {
    return res.json();
  })
  .then(theMap => {
    game(theMap);
  });
const canvas = document.getElementById("pig");
const context = canvas.getContext("2d");
context.scale(25, 25);
// TODO screen size depending on viewport dims

function game(map) {
  const uploadedMap = map;

  const arenaVars = {
    dimensions: {
      x: uploadedMap.x,
      y: uploadedMap.y
    },
    screenSize: {
      x: 32,
      y: 18
    },
    gravity: 1,

    dropCounter: 0,
    dropInterval: 47,
    lastTime: 0
  };

  const arenaMethods = {
    playground(w, h) {
      const matrix = [];
      while (h--) {
        matrix.push(new Array(w).fill(""));
      }
      return matrix;
    },
    insertMatrix(x, y, value) {
      globalWorld[y][x] = value;
    },
    worldCreation(arena, injectMap = uploadedMap.map) {
      let world = arena;
      injectMap.forEach(ele => {
        arenaMethods.insertMatrix(ele.pos.x, ele.pos.y, ele.type);
      });
      return world;
    },
    collidePositions(world, collideObjects) {
      let arrOfPositions = [];
      for (let y = 0; y < world.length; y++) {
        for (let x = 0; x < world[y].length; x++) {
          if (
            collideObjects.indexOf(world[y][x]) > -1 ||
            world[y][x].indexOf("sprites") > -1
          ) {
            arrOfPositions.push({ x, y });
          }
        }
      }
      return arrOfPositions;
    },
    renderView(map = globalWorld) {
      const corners = {
        SW: {
          x: pigVars.pigPosition.x - pigVars.pigHorizonDist.left,
          y: pigVars.pigPosition.y + pigVars.pigHorizonDist.bottom
        },
        NE: {
          x: pigVars.pigPosition.x + pigVars.pigHorizonDist.right,
          y: pigVars.pigPosition.y - pigVars.pigHorizonDist.top
        }
      };
      const pigLocalPos = {
        x: pigVars.pigHorizonDist.right - 1,
        y: pigVars.pigHorizonDist.top
      };
      const pairs = [
        ["SW", "NE", "x"],
        ["NE", "SW", "x"],
        ["SW", "NE", "y"],
        ["NE", "SW", "y"]
      ];
      pairs.forEach(ele => {
        if (corners[ele[0]][ele[2]] < 0) {
          let diff = -corners[ele[0]][ele[2]];
          corners[ele[0]][ele[2]] = 0;
          corners[ele[1]][ele[2]] = corners[ele[1]][ele[2]] + diff;
          pigLocalPos[ele[2]] -= diff;
        } else if (corners[ele[0]][ele[2]] > arenaVars.dimensions[ele[2]] - 1) {
          let diff =
            corners[ele[0]][ele[2]] - (arenaVars.dimensions[ele[2]] - 1);
          corners[ele[0]][ele[2]] = arenaVars.dimensions[ele[2]] - 1;
          corners[ele[1]][ele[2]] = corners[ele[1]][ele[2]] - diff;
          // pigpos change
          pigLocalPos[ele[2]] += diff;
        }
      });

      const roof = corners.NE.y;
      const side = corners.SW.x;
      const renderedView = [];
      for (let i = roof; i < roof + arenaVars.screenSize.y; i++) {
        renderedView.push([...map[i]].splice(side, arenaVars.screenSize.x));
      }
      //pigpos change
      pigVars.pigWindowPosition = pigLocalPos;
      return renderedView;
    },
    collideObjects: ["grass", "stone", "fixed"],
    interactObjects: ["apple", "cake"]
  };

  const pigVars = {
    pigPosition: {
      x: 5,
      y: arenaVars.dimensions.y - 8
    },
    pigDirection: {
      E: false,
      W: false
    },
    pigSize: {
      x: 2,
      y: 1.3
    },
    pigHorizonDist: {},
    pigWindowPosition: {},
    pigDir: "W",
    jumpHeight: 5,
    jumpSpeed: 1,
    currentJump: 0,
    speed: 1,
    state: {
      run: false,
      stand: true,
      sleep: false,
      eat: false,
      shit: false,
      flight: false,
      fall: false
    },
    strongStates: ["flight", "fall"]
  };
  // sprites positions
  const sprites = {
    pig: {
      W: {
        run: {
          frames: [
            // 3 frames
            [10, 102, 54, 34],
            [72, 102, 57, 34],
            [137, 103, 54, 33]
          ],
          lastFrame: -1
        },
        stand: {
          frames: [
            [7, 55, 53, 35],
            [68, 55, 54, 35],
            [129, 54, 54, 36],
            [191, 54, 54, 36],
            [252, 54, 55, 36],
            [314, 55, 54, 35]
          ],
          lastFrame: -1
        },
        flight: {
          frames: [[11, 560, 54, 33]],
          lastFrame: -1
        },
        fall: {
          frames: [[69, 375, 54, 34]],
          lastFrame: -1
        }
      },
      E: {
        run: {
          frames: [
            // 3 frames
            [497, 102, 54, 34],
            [432, 102, 57, 34],
            [370, 103, 54, 33]
          ],
          lastFrame: -1
        },
        stand: {
          frames: [
            [501, 55, 53, 35],
            [439, 55, 54, 35],
            [378, 54, 54, 36],
            [316, 54, 54, 36],
            [254, 54, 55, 36],
            [193, 55, 54, 35]
          ],
          lastFrame: -1
        },
        flight: {
          frames: [[496, 560, 54, 33]],
          lastFrame: -1
        },
        fall: {
          frames: [[438, 375, 54, 34]],
          lastFrame: -1
        }
      }
    },
    map: {}
  };
  const spritesMethods = {
    initSpirtesLoad(map) {
      map.forEach(ele => {
        const container = ele.type.split("-")[1];
        const spriteNumber = ele.type.split("-")[2];
        if (!sprites.map[container]) {
          sprites.map[container] = {};
        }
        if (!sprites.map[container][spriteNumber]) {
          const fieldImgSrc = "./" + ele.type.replace(/-/g, "/") + ".png";
          sprites.map[container][spriteNumber] = new Image();
          sprites.map[container][spriteNumber].src = fieldImgSrc;
        }
      });
    }
  };
  const globalMet = {
    animatedSpritesLoader(item, itemsState, dx, dy, dWidth, dHeight, itemsDir) {
      const image = itemsDir ? sprites[item][itemsDir] : sprites[item];
      const lastFrame = image[itemsState].lastFrame;
      const sx = image[itemsState].frames[lastFrame + 1][0];
      const sy = image[itemsState].frames[lastFrame + 1][1];
      const sWidth = image[itemsState].frames[lastFrame + 1][2];
      const sHeight = image[itemsState].frames[lastFrame + 1][3];
      context.drawImage(
        image.img,
        sx,
        sy,
        sWidth,
        sHeight,
        dx,
        dy,
        dWidth,
        dHeight
      );
      // change last frame
      if (lastFrame === image[itemsState].frames.length - 2) {
        image[itemsState].lastFrame = -1;
      } else {
        image[itemsState].lastFrame += 1;
      }
    },
    stateShifter(element, state, strongStates, changingForce) {
      const keyArr = Object.keys(element);

      keyArr.forEach(key => {
        if (element[key] === true && key !== state) {
          if (strongStates.indexOf(key) > -1) {
            if (changingForce) {
              element[key] = false;
            } else {
              return;
            }
          } else {
            element[key] = false;
          }
        }
      });
      element[state] = true;
    },
    stateWithdraw(element) {
      const keyArr = Object.keys(element);
      let retKey;
      keyArr.forEach(key => {
        if (element[key]) {
          retKey = key;
        }
      });
      return retKey;
    },
    draw() {
      // Drawing playground
      context.fillStyle = "#d84e17";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        gameBackground,
        0,
        0,
        arenaVars.screenSize.x,
        arenaVars.screenSize.y
      );

      //Drawing arena elements
      for (let y = 0; y < renderedView.length; y++) {
        for (let x = 0; x < renderedView[y].length; x++) {
          if (renderedView[y][x].indexOf("sprites") > -1) {
            const container = renderedView[y][x].split("-")[1];
            const name = renderedView[y][x].split("-")[2];
            context.drawImage(sprites.map[container][name], x, y, 1, 1);
          } else if (
            y === pigVars.pigWindowPosition.y &&
            x === pigVars.pigWindowPosition.x
          ) {
            const state = globalMet.stateWithdraw(pigVars.state);
            globalMet.animatedSpritesLoader(
              "pig",
              state,
              x,
              y - pigVars.pigSize.y + 1,
              pigVars.pigSize.x,
              pigVars.pigSize.y,
              pigVars.pigDir
            );
          }
        }
      }
    },
    update(time = 0) {
      window.requestAnimationFrame(globalMet.update);
      const deltaTime = time - arenaVars.lastTime;
      arenaVars.lastTime = time;
      arenaVars.dropCounter += deltaTime;
      if (arenaVars.dropCounter >= arenaVars.dropInterval) {
        arenaVars.dropCounter = 0;
        pigMoves.pigJump() || pigMoves.pigGravity();
        pigMoves.movePigX();
        renderedView = arenaMethods.renderView();
        globalMet.draw();
      }
    },

    // function that gets all positions taken by element
    getObjectPositions(pos, size) {
      const length = size.x;
      const height = size.y;
      const x = pos.x;
      const y = pos.y;

      let arr = [];
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < length; j++) [arr.push({ x: x + j, y: y - i })];
      }
      return arr;
    },
    possibleDist(
      dir,
      dist,
      objPos = pigVars.pigPosition,
      size = pigVars.pigSize,
      obstacles = globalObstacles
    ) {
      const dirMatrix = {
        N: { multiplier: -1, axis: "y", passiveAxis: "x" },
        S: { multiplier: 1, axis: "y", passiveAxis: "x" },
        E: { multiplier: 1, axis: "x", passiveAxis: "y" },
        W: { multiplier: -1, axis: "x", passiveAxis: "y" }
      };
      let objPositions = globalMet.getObjectPositions(objPos, size);
      let possibleDistance = dist;
      loop1: for (let s = 1; s <= dist; s++) {
        for (let point of objPositions) {
          let checkedPosition = {
            [dirMatrix[dir].axis]:
              point[dirMatrix[dir].axis] + s * dirMatrix[dir].multiplier,
            [dirMatrix[dir].passiveAxis]: point[dirMatrix[dir].passiveAxis]
          };
          for (let obstacle of obstacles) {
            if (
              obstacle.x === checkedPosition.x &&
              obstacle.y === checkedPosition.y
            ) {
              possibleDistance = s - 1;
              break loop1;
            }
          }
        }
      }
      return possibleDistance;
    }
  };

  const pigMoves = {
    movePigX() {
      if (pigVars.pigDirection.E === pigVars.pigDirection.W) {
        globalMet.stateShifter(pigVars.state, "stand", pigVars.strongStates);
        return;
      } else if (pigVars.pigDirection.E === true) {
        pigVars.pigPosition.x += globalMet.possibleDist(
          "E",
          pigVars.speed,
          pigVars.pigPosition
        );
        pigVars.pigDir = "E";
        globalMet.stateShifter(pigVars.state, "run", pigVars.strongStates);
      } else if (pigVars.pigDirection.W === true) {
        pigVars.pigPosition.x -= globalMet.possibleDist(
          "W",
          pigVars.speed,
          pigVars.pigPosition
        );
        pigVars.pigDir = "W";
        globalMet.stateShifter(pigVars.state, "run", pigVars.strongStates);
      }
    },
    pigJump() {
      if (pigVars.state.flight) {
        if (pigVars.currentJump === pigVars.jumpHeight) {
          //TODO prohibit pig from junping, when there is no above space avaiable
          globalMet.stateShifter(
            pigVars.state,
            "fall",
            pigVars.strongStates,
            true
          );
          pigVars.currentJump = 0;
          return false;
        } else {
          pigVars.currentJump += 1;
          pigVars.pigPosition.y -= globalMet.possibleDist(
            "N",
            pigVars.jumpSpeed,
            pigVars.pigPosition
          );
          return true;
        }
      } else {
        return false;
      }
    },
    pigGravity() {
      if (pigVars.pigPosition.y < arenaVars.dimensions.y) {
        const possibleDist = globalMet.possibleDist("S", arenaVars.gravity);
        if (possibleDist === 0 && pigVars.state.fall) {
          globalMet.stateShifter(
            pigVars.state,
            "stand",
            pigVars.strongStates,
            true
          );
        }
        pigVars.pigPosition.y += possibleDist;
      }
    }
  };
  // Listeners
  document.addEventListener("keypress", event => {
    if (event.key == " ") {
      //  check if there is a ground to jump
      const possibleDist = globalMet.possibleDist("S", 1);
      if (possibleDist === 0) {
        globalMet.stateShifter(
          pigVars.state,
          "flight",
          pigVars.strongStates,
          true
        );
      }
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key == "a") {
      pigVars.pigDirection.W = true;
    } else if (event.key == "d") {
      pigVars.pigDirection.E = true;
    }
  });
  document.addEventListener("keyup", event => {
    if (event.key == "a") {
      pigVars.pigDirection.W = false;
    } else if (event.key == "d") {
      pigVars.pigDirection.E = false;
    }
  });

  // initializators
  //TODO  clean initializators

  pigVars.pigHorizonDist.top = Math.ceil((arenaVars.screenSize.y - 1) / 2);
  pigVars.pigHorizonDist.bottom = Math.floor((arenaVars.screenSize.y - 1) / 2);
  pigVars.pigHorizonDist.right = Math.ceil((arenaVars.screenSize.x - 1) / 2);
  pigVars.pigHorizonDist.left = Math.floor((arenaVars.screenSize.x - 1) / 2);

  pigVars.pigWindowPosition.x = pigVars.pigHorizonDist.right;
  pigVars.pigWindowPosition.y = pigVars.pigHorizonDist.top;

  sprites.pig.E.img = new Image();
  sprites.pig.E.img.src = "./sprites/pigright.png";
  sprites.pig.W.img = new Image();
  sprites.pig.W.img.src = "./sprites/pigleft.png";

  const gameBackground = new Image();
  gameBackground.src = "./sprites/tropic_bg.png";

  let globalWorld = arenaMethods.playground(
    arenaVars.dimensions.x,
    arenaVars.dimensions.y
  );
  spritesMethods.initSpirtesLoad(uploadedMap.map);
  globalWorld = arenaMethods.worldCreation(globalWorld, uploadedMap.map);
  let globalObstacles = arenaMethods.collidePositions(
    globalWorld,
    arenaMethods.collideObjects
  );
  let renderedView = arenaMethods.renderView();

  globalMet.update();
}

/*
global todo:
- add background items that pig doesnt collide with
- add interactive objects (food etc)
- add time/score/bonuses (for jump, speed etc.)
- score system
- add user interface
- loading external maps
*/
