const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

let snake = [{ x: 150, y: 150 }];
let food = { x: 60, y: 60 };
let dx = 10;
let dy = 0;
let score = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar comida
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, 10, 10);

  // Dibujar serpiente
  ctx.fillStyle = "lime";
  snake.forEach(part => ctx.fillRect(part.x, part.y, 10, 10));

  // Mover serpiente
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  // Comer comida
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    food = {
      x: Math.floor(Math.random() * 30) * 10,
      y: Math.floor(Math.random() * 30) * 10
    };
  } else {
    snake.pop();
  }

  // Colisiones
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    snake.slice(1).some(p => p.x === head.x && p.y === head.y)
  ) {
    alert("Game Over");
    snake = [{ x: 150, y: 150 }];
    dx = 10;
    dy = 0;
    score = 0;
    scoreEl.textContent = score;
  }
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") { dx = 0; dy = -10; }
  if (e.key === "ArrowDown") { dx = 0; dy = 10; }
  if (e.key === "ArrowLeft") { dx = -10; dy = 0; }
  if (e.key === "ArrowRight") { dx = 10; dy = 0; }
});

setInterval(draw, 100);