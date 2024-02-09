import { player } from "./player.js";

let enemies = [];
let enemyImg;
const hurtFlash = document.getElementById("hurt");

function createEnemy(amount) {
  for (let i = 0; i < amount; i++) {
    let xPosition;
    if (Math.random() < 0.5) {
      xPosition = Math.random() < 0.5 ? -50 : 1250;
    } else {
      xPosition = Math.random() * canvas.width;
    }

    let yPosition;
    if (xPosition > -50 && xPosition < 1250) {
      yPosition = Math.random() < 0.5 ? -50 : 850;
    } else {
      yPosition = Math.random() * (canvas.height - 50);
    }

    const newEnemy = {
      x: xPosition,
      y: yPosition,
      width: 20,
      height: 20,
      speed: 50,
    };
    enemies.push(newEnemy);
  }
}

function drawEnemy(ctx) {
  // for (const enemy of enemies) {
  // draw emeny test
  enemyImg = new Image();
  enemyImg.src = "./pictures/Enemyimg.png";
  //ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

  // }
  ctx.fillStyle = "white";
  ctx.font = "30px serif";
  ctx.fillText("Score: " + player.scoreValue, 10, 60);

  ctx.font = "30px serif";
  ctx.fillText("Hp: " + player.hp, 10, 90);
}

function enemyMovement(deltaTime, ctx) {
  for (const enemy of enemies) {
    let directionX = player.x - enemy.x;
    let directionY = player.y - enemy.y;
    let distance = Math.sqrt(directionX * directionX + directionY * directionY);

    if (distance <= 3000) {
      directionX /= distance;
      directionY /= distance;

      enemy.x += directionX * enemy.speed * deltaTime;
      enemy.y += directionY * enemy.speed * deltaTime;

      let angle = Math.atan2(directionY, directionX);

      //Behvös denna? (raden nedanför)
      //let degrees = angle * (180/Math.PI);

      ctx.save();
      ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
      ctx.rotate(angle + 1.5 * Math.PI);
      ctx.drawImage(
        enemyImg,
        -enemy.width / 2,
        -enemy.height / 2,
        enemy.width,
        enemy.height
      );
      ctx.restore();
    }
  }
}

function checkCollision(ctx) {
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];

    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      enemies.splice(i, 1);

      let dmgSound = new Audio();
      dmgSound.src = "/Sound/damageSound.mp3";
      dmgSound.volume = 0.2;
      dmgSound.addEventListener("canplaythrough", function () {
        dmgSound.play();
      });

      /*setTimeout(() => {
        console.log("yes");
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        setTimeout(() => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 200);
      });*/

      player.hp -= 10;
      hurtFlash.style.display = "block";

      createEnemy(1);
    }

    for (let j = 0; j < enemies.length; j++) {
      const enemy2 = enemies[j];

      if (
        enemy.x < enemy2.x + enemy2.width &&
        enemy.x + enemy.width > enemy2.x &&
        enemy.y < enemy2.y + enemy2.height &&
        enemy.y + enemy.height > enemy2.y
      ) {
        resolveEnemyOverlap(enemy, enemy2);
      }
    }
    for (let l = 0; l < player.bullets.length; l++) {
      const playerBullet = player.bullets[l];

      if (
        playerBullet.x < enemy.x + enemy.width &&
        playerBullet.x + playerBullet.width > enemy.x &&
        playerBullet.y < enemy.y + enemy.height &&
        playerBullet.y + playerBullet.height > enemy.y
      ) {
        enemies.splice(i, 1);
        player.bullets.splice(l, 1);
        createEnemy(1);
        player.scoreValue++;
      }
    }
  }
}

function resolveEnemyOverlap(enemy, enemy2) {
  const overlapX = Math.max(
    0,
    Math.min(enemy.x + enemy.width, enemy2.x + enemy2.width) -
      Math.max(enemy.x, enemy2.x)
  );
  const overlapY = Math.max(
    0,
    Math.min(enemy.y + enemy.height, enemy2.y + enemy2.height) -
      Math.max(enemy.y, enemy2.y)
  );

  if (overlapX < overlapY) {
    const moveBy = overlapX / 2;

    enemy.x -= moveBy;
    enemy2.x += moveBy;
  } else {
    const moveBy = overlapY / 2;
    enemy.y -= moveBy;
    enemy2.y += moveBy;
  }
}

export {
  createEnemy,
  drawEnemy,
  enemyMovement,
  checkCollision,
  resolveEnemyOverlap,
  enemies,
  hurtFlash,
};
