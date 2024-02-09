const player = {
  x: 475,
  y: 375,
  width: 40,
  height: 40,
  left: false,
  right: false,
  up: false,
  down: false,
  speed: 500,
  hp: 10,
  scoreValue: 0,
  bullets: [],
  shot: false,
  rotation: 0,
  gunOffsetX: 25,
  gunOffsetY: 6,
};
let playerImg;

let mouseX = 0;
let mouseY = 0;

// 1. player.rotation fick aldrig ett värde
// 2. + - ska bytas på cos+sin uträkning (när man räknar ut skott position)
// 3. gunOffset hade fel offset (det borde vara x = 25 och y = 6)
// 4. Skott ritas ut konstigt. Byt ut mot vector (se nedanför).
/*
    let velX = Math.sin(player.rotation);
    let velY = Math.cos(player.rotation);
    bullet.x += velX;
    bullet.y += velY;

    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
*/

function drawPlayer(ctx) {
  /*
  if (damageFlash) {
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  */

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //player Img
  playerImg = new Image();
  playerImg.src = "./pictures/Playerimg.png";

  // const angle = 0;
  const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
  player.rotation = angle;

  ctx.save();
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
  ctx.rotate(angle + 1.5 * Math.PI);
  ctx.drawImage(
    playerImg,
    -player.width / 2,
    -player.height / 2,
    player.width,
    player.height
  );
  ctx.restore();

  {
    let x = player.x + player.width / 2;
    let y = player.y + player.height / 2;

    const offsetX = player.gunOffsetX;
    const offsetY = player.gunOffsetY;

    // Beräkna roterade offset-värden
    const rotatedOffsetX =
      offsetX * Math.cos(player.rotation) - offsetY * Math.sin(player.rotation);
    const rotatedOffsetY =
      offsetX * Math.sin(player.rotation) + offsetY * Math.cos(player.rotation);

    const bulletX = x + rotatedOffsetX;
    const bulletY = y + rotatedOffsetY;
    ctx.font = "30px serif";

    //Visar rotation och position i canvas.
    /*ctx.fillText("Rot: " + (player.rotation * 180) / Math.PI, 10, 50);
    ctx.fillText("Pos: " + player.x + ", " + player.y, 10, 100);*/

    ctx.beginPath();
    //ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
    // ctx.arc(x + player.gunOffsetX, y + player.gunOffsetY, 5, 0, Math.PI * 2);
    //ctx.arc(bulletX, bulletY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}

function updateMousePosition(e) {
  mouseX = e.pageX - canvas.getBoundingClientRect().left;
  mouseY = e.pageY - canvas.getBoundingClientRect().top;
}

function updatePlayerPosition(deltaTime) {
  if (player.up && player.y > player.height / 2 - 20)
    player.y -= player.speed * deltaTime;
  if (player.down && player.y + player.height / 2 + 20 < canvas.height)
    player.y += player.speed * deltaTime;
  if (player.left && player.x > player.width / 2 - 20)
    player.x -= player.speed * deltaTime;
  if (player.right && player.x + player.width / 2 + 20 < canvas.width)
    player.x += player.speed * deltaTime;
}

function drawBullet(ctx, deltaTime) {
  player.bullets.forEach((bullet) => {
    const directionX = mouseX - player.x;
    const directionY = mouseY - player.y;
    const distance = Math.sqrt(
      directionX * directionX + directionY * directionY
    );
    // Justera varje kulas ritningsposition baserat på spelarobjektets rotation
    //  let velX = Math.sin(player.rotation + 5);
    //let velY = Math.cos(player.rotation - 5);
    const normalizedDirectionX = directionX / distance;
    const normalizedDirectionY = directionY / distance;

    bullet.x += normalizedDirectionX * bullet.speed * deltaTime;
    bullet.y += normalizedDirectionY * bullet.speed * deltaTime;

    ctx.fillStyle = "red";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
  // const rotatedBulletX =
  //   bullet.x * Math.cos(player.rotation) -
  //   bullet.y * Math.sin(player.rotation);
  // const rotatedBulletY =
  //   bullet.x * Math.sin(player.rotation) +
  //   bullet.y * Math.cos(player.rotation);
  //
  // bullet.x += velX;
  // bullet.y += velY;

  //ctx.fillStyle = bullet.color;
  // ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  //});
}

function shootbullet() {
  const bulletSpeed = 5;
  const bulletSize = 5;

  let x = player.x + player.width / 2;
  let y = player.y + player.height / 2;

  const offsetX = player.gunOffsetX;
  const offsetY = player.gunOffsetY;
  // Beräkna roterade offset-värden
  const rotatedOffsetX =
    offsetX * Math.cos(player.rotation) - offsetY * Math.sin(player.rotation);
  const rotatedOffsetY =
    offsetX * Math.sin(player.rotation) + offsetY * Math.cos(player.rotation);

  const bulletX = x + rotatedOffsetX;
  const bulletY = y + rotatedOffsetY;

  const newBullet = {
    x: bulletX,
    y: bulletY,
    // direction: Math.atan2(mouseY - player.y, mouseX - player.x),
    direction: player.rotation,
    speed: bulletSpeed,
    color: "black",
    width: bulletSize,
    height: bulletSize,
  };

  player.bullets.push(newBullet);
}

function updateBullets() {
  player.bullets.forEach((bullet) => {
    bullet.x += bullet.speed * Math.cos(bullet.direction);
    bullet.y += bullet.speed * Math.sin(bullet.direction);
  });

  player.bullets = player.bullets.filter(
    (bullet) =>
      bullet.x >= 0 &&
      bullet.x <= canvas.width &&
      bullet.y >= -25 &&
      bullet.y <= canvas.height
  );
}

export {
  player,
  drawPlayer,
  updateMousePosition,
  updatePlayerPosition,
  drawBullet,
  updateBullets,
  shootbullet,
};

/*
// I player.js eller liknande där du har din spelarinformation
const player = {
  x: 100,
  y: 200,
  width: 50,
  height: 50,
  gunOffsetX: 40, // Justera detta värde beroende på vapnets position och storlek
  gunOffsetY: 10, // Justera detta värde beroende på vapnets position och storlek
  gunDirection: "right", // Anta att spelaren börjar med vapnet riktat åt höger
};

// I bullet.js eller där du hanterar kulläget
function createBullet() {
  // Beräkna startpositionen baserat på vapnets riktning och offset
  let bulletX = player.x + player.gunOffsetX;
  let bulletY = player.y + player.gunOffsetY;

  // Skapa din kula med startpositionen
  const bullet = {
    x: bulletX,
    y: bulletY,
    // Övriga egenskaper för kulan...
  };

  // Lägg till kulan till din kullsarray eller hantera den på annat sätt
  bullets.push(bullet);
}*/
