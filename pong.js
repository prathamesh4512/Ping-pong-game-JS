const canvas = document.getElementById("pong");
const draw_ = canvas.getContext("2d");

const user = {
  x: 0,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0,
  color: "WHITE",
};

const cpu = {
  x: canvas.width - 10,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0,
  color: "WHITE",
};

const sep = {
  x: (canvas.width - 2) / 2,
  y: 0,
  width: 2,
  height: 10,
  color: "WHITE",
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  color: "WHITE",
  velocityX: 5,
  velocityY: 5,
  speed: 7,
};

function drawRect(x, y, w, h, color) {
  draw_.fillStyle = color;
  draw_.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  draw_.fillStyle = color;
  draw_.beginPath();
  draw_.arc(x, y, r, 0, Math.PI * 2, true);
  draw_.closePath();
  draw_.fill();
}

function drawSep() {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(sep.x, sep.y + i, sep.width, sep.height, sep.color);
  }
}

function drawScore(text, x, y) {
  draw_.fillStyle = "WHITE";
  draw_.font = "75px fantasy";
  draw_.fillText(text, x, y);
}

function restartBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = 7;
  ball.velocityX = -ball.velocityX;
}

canvas.addEventListener("mousemove", userMov);

function userMov(evnt) {
  let rect = canvas.getBoundingClientRect();
  user.y = evnt.clientY - rect.top - user.height / 2;
}

function onRepeat() {
  drawRect(0, 0, 600, 400, "Black");
  drawScore(user.score, canvas.width / 4, canvas.height / 5);
  drawScore(cpu.score, (3 * canvas.width) / 4, canvas.height / 5);
  drawRect(user.x, user.y, user.width, user.height, "WHITE");
  drawRect(cpu.x, cpu.y, cpu.width, cpu.height, "WHITE");
  drawSep();
  drawCircle(ball.x, ball.y, ball.radius, "WHITE");
}

function collideDection(ball, player) {
  ball.top = ball.y - ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;
  ball.right = ball.x + ball.radius;

  player.top = player.y;
  player.bottom = player.y + player.height;
  player.left = player.x;
  player.right = player.x + player.width;

  return (
    ball.right > player.left &&
    ball.top < player.bottom &&
    ball.left < player.right &&
    ball.bottom > player.top
  );
}

function update() {
  if (ball.x + ball.radius > canvas.width) {
    user.score++;
    restartBall();
  } else if (ball.x - ball.radius < 0) {
    cpu.score++;
    restartBall();
  }

  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  cpu.y += (ball.y - (cpu.y + cpu.height / 2)) * 0.1;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }

  let player = ball.x > canvas.width / 2 ? cpu : user;

  if (collideDection(ball, player)) {
    let collidePoint = ball.y - (player.y + player.height / 2);
    collidePoint = collidePoint / (player.height / 2);

    let anglerad = (Math.PI / 4) * collidePoint;

    let direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * Math.cos(anglerad) * ball.speed;
    ball.velocityY = Math.sin(anglerad) * ball.speed;

    ball.speed += 0.5;
  }
}

function game() {
  update();
  onRepeat();
}

const fps = 50;

setInterval(game, 1000 / fps);
