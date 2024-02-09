import { player, shootbullet } from "./player.js";

function keyPressed(e) {
  switch (e.key) {
    case "ArrowUp":
      player.up = true;
      break;
    case "ArrowDown":
      player.down = true;
      break;
    case "ArrowLeft":
      player.left = true;
      break;
    case "ArrowRight":
      player.right = true;
      break;
    case "w":
      player.up = true;
      break;
    case "s":
      player.down = true;
      break;
    case "a":
      player.left = true;
      break;
    case "d":
      player.right = true;
      break;
  }
}
function keyReleased(e) {
  switch (e.key) {
    case "ArrowUp":
      player.up = false;
      break;
    case "ArrowDown":
      player.down = false;
      break;
    case "ArrowLeft":
      player.left = false;
      break;
    case "ArrowRight":
      player.right = false;
      break;
    case "w":
      player.up = false;
      break;
    case "s":
      player.down = false;
      break;
    case "a":
      player.left = false;
      break;
    case "d":
      player.right = false;
      break;
  }
}

function mousePressed(e) {
  if (e.type === "mousedown") {
    player.shot = true;

    let gunSound = new Audio("Sound/gunSound.mp3");
    gunSound.volume = 0.1;
    gunSound.addEventListener("canplaythrough", function () {
      gunSound.play();
    });

    shootbullet();
  }
}

function mouseReleased(e) {
  if (e.type === "mouseup") {
    player.shot = false;
  }
}

export { keyPressed, keyReleased, mousePressed, mouseReleased };
