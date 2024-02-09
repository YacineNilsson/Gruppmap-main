// prettier-ignore
import { player, drawPlayer, updatePlayerPosition, updateMousePosition, updateBullets, drawBullet } from "./player.js";
// prettier-ignore
import {keyPressed, keyReleased, mousePressed, mouseReleased } from "./movement.js";
// prettier-ignore
import { enemies,createEnemy, drawEnemy, enemyMovement, checkCollision, hurtFlash } from "./enemy.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const Startmenu = document.getElementById("Startmenu");
const startKnapp = document.getElementById("startKnapp");

const gameOver = document.getElementById("game-over");
const restartBtn = document.getElementById("restart-btn");
const newGameBtn = document.getElementById("new-game-btn");

const normalButton = document.querySelector("#normal");
const hardButton = document.querySelector("#hard");
const extremeButton = document.querySelector("#extreme");
const playerNameField = document.querySelector("#player-name");

let animationId;

let normalLevel = false;
let hardLevel = false;
let extremeLevel = false;

//menuimage

let menuimg = new Image();
menuimg.src = "./pictures/Menubackgroundimage.jpeg";
menuimg.onload = function () {
  ctx.drawImage(menuimg, 0, 0, canvas.width, canvas.height);
  if (menuimg.onload) {
    return;
  }
};

// Background music
let backgroundMusic = new Audio("./Sound/music.mp3");
backgroundMusic.volume = 0.2;
let musicStartTime = 1.7;
backgroundMusic.currentTime = musicStartTime;

//Img overlay
let gradient = new Image();
gradient.src = "./pictures/BG2.png";
function gradientOverlay() {
  ctx.drawImage(gradient, 0, 0, canvas.width, canvas.height);
}

normalButton.addEventListener("click", () => {
  if (normalLevel == false) {
    normalButton.classList.add("normal-level");
    hardButton.classList.remove("hard-level");
    extremeButton.classList.remove("extreme-level");
    normalLevel = true;
    hardLevel = false;
    extremeLevel = false;
  } else if (normalLevel) {
    normalButton.classList.remove("normal-level");
    normalLevel = false;
  }

  hardLevel = false;
  extremeLevel = false;
});

hardButton.addEventListener("click", () => {
  if (hardLevel == false) {
    normalButton.classList.remove("normal-level");
    hardButton.classList.add("hard-level");
    extremeButton.classList.remove("extreme-level");
    hardLevel = true;
    normalLevel = false;
    extremeLevel = false;
  } else if (hardLevel) {
    hardButton.classList.remove("hard-level");
    hardLevel = false;
  }

  normalLevel = false;
  extremeLevel = false;
});

extremeButton.addEventListener("click", () => {
  if (extremeLevel == false) {
    normalButton.classList.remove("normal-level");
    hardButton.classList.remove("hard-level");
    extremeButton.classList.add("extreme-level");
    extremeLevel = true;
    normalLevel = false;
    hardLevel = false;
  } else if (extremeLevel) {
    extremeButton.classList.remove("extreme-level");
    extremeLevel = false;
  }

  normalLevel = false;
  hardLevel = false;
});

let lastTime;

function startingScreen() {
  /*
  ctx.fillStyle = "white";
  ctx.font = "50px sans-serif";
  ctx.fillText("¡Zombie Hunter!", canvas.width / 3 + 15, 150);
  ctx.font = "28px times-new-roman";
  ctx.fillText(
    "Use arrows or wasd to move your character, use the mouse to aim and shoot zombies",
    100,
    250
  );
  */

  startKnapp.addEventListener("click", () => {
    backgroundMusic.currentTime = musicStartTime;
    backgroundMusic.play();
    let playerName = playerNameField.value;

    if (playerName === "") {
      backgroundMusic.pause();
      alert("You must choose a name!");
      return;
    } else {
      if (normalLevel == false && hardLevel == false && extremeLevel == false) {
        backgroundMusic.pause();
        alert("Your must choose a difficulty");
        return;
      }
    }

    document.addEventListener("mousedown", mousePressed);
    document.addEventListener("mouseup", mouseReleased);
    document.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("keydown", keyPressed);
    document.addEventListener("keyup", keyReleased);

    Startmenu.style.display = "none";
    canvas.style.display = "block";

    if (normalLevel) {
      player.hp = 100;
    }
    if (hardLevel) {
      player.hp = 50;
    }
    if (extremeLevel) {
      player.hp = 10;
    }

    enemies.length = 0;

    initGame();
    createEnemy(15);
  });
}

function gameOverMenu() {
  backgroundMusic.pause();
  let playerName = playerNameField.value;

  document.removeEventListener("mousemove", updateMousePosition);
  document.removeEventListener("keydown", keyPressed);
  document.removeEventListener("keyup", keyReleased);
  document.removeEventListener("mousedown", mousePressed);
  document.removeEventListener("mouseup", mouseReleased);

  player.x = 475;
  player.y = 375;
  player.up = false;
  player.down = false;
  player.left = false;
  player.right = false;

  ctx.fillStyle = "white";

  ctx.fillText(
    "Game Over " + playerName + "!",
    canvas.width / 3,
    canvas.height / 3 - 130
  );
  ctx.fillText(
    "Your final score is: " + player.scoreValue + ".",
    canvas.width / 3,
    canvas.height / 3 - 100
  );
  ctx.fillText(
    "Press Restart Game to play again as " + playerName + ".",
    canvas.width / 3,
    canvas.height / 3 - 70
  );
  ctx.fillText(
    "Press New Game to start a new game",
    canvas.width / 3,
    canvas.height / 3 - 40
  );

  enemies.length = 0;
  player.bullets = [];
  gameOver.style.display = "flex";
  restartBtn.addEventListener("click", function () {
    backgroundMusic.currentTime = musicStartTime;
    backgroundMusic.play();

    document.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("keydown", keyPressed);
    document.addEventListener("keyup", keyReleased);
    document.addEventListener("mousedown", mousePressed);
    document.addEventListener("mouseup", mouseReleased);

    gameOver.style.display = "none";

    if (normalLevel) {
      player.hp = 100;
    }
    if (hardLevel) {
      player.hp = 50;
    }
    if (extremeLevel) {
      player.hp = 10;
    }
    player.scoreValue = 0;

    enemies.length = 0;

    initGame();
    createEnemy(5);
  });

  newGameBtn.addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(menuimg, 0, 0, canvas.width, canvas.height);
    gameOver.style.display = "none";

    Startmenu.style.display = "flex";

    if (normalLevel) {
      player.hp = 100;
    }
    if (hardLevel) {
      player.hp = 50;
    }
    if (extremeLevel) {
      player.hp = 10;
    }

    player.scoreValue = 0;
    playerNameField.value = "";
    enemies.length = 0;
    normalButton.classList.remove("normal-level");
    hardButton.classList.remove("hard-level");
    extremeButton.classList.remove("extreme-level");
    normalLevel = false;
    hardLevel = false;
    extremeLevel = false;
    startingScreen();
  });
}

function checkPoints() {
  for (const enemy of enemies) {
    if (player.scoreValue >= 5 && player.scoreValue < 10) {
      enemy.speed = 100;
    } else if (player.scoreValue > 10 && player.scoreValue < 20) {
      enemy.speed = 150;
    } else if (player.scoreValue > 20 && player.scoreValue < 30) {
      enemy.speed = 200;
    } else if (player.scoreValue >= 30 && normalLevel) {
      enemy.speed = 300;
    } else if (player.scoreValue >= 30 && hardLevel) {
      enemy.speed = 350;
    } else if (player.scoreValue >= 30 && extremeLevel) {
      enemy.speed = 400;
    }
  }
}

function spawnEnemyRandom() {
  function spawn() {
    createEnemy(1);
  }

  let randomNmber = Math.random() * 1000;

  if (randomNmber >= 995) {
    spawn();
  }
}

function initGame() {
  let now = Date.now();
  let deltaTime = (now - lastTime) / 1000;
  lastTime = now;

  hurtFlash.style.display = "none";

  updatePlayerPosition(deltaTime);
  drawPlayer(ctx);
  drawEnemy(ctx);
  enemyMovement(deltaTime, ctx);
  checkCollision(ctx);
  drawBullet(ctx, deltaTime);
  updateBullets();
  spawnEnemyRandom();
  gradientOverlay();
  checkPoints();
  cancelAnimationFrame(animationId);

  animationId = requestAnimationFrame(gameLoop);
}

function gameLoop() {
  if (player.hp <= 0) {
    player.hp = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px serif";
    ctx.fillText("Hp: " + player.hp, 10, 90);

    ctx.font = "30px serif";
    ctx.fillText("Score: " + player.scoreValue, 10, 60);

    hurtFlash.style.display = "none";
    gameOverMenu();
    return;
  }

  initGame();
}

startingScreen();
