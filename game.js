const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');

    const GRID_SIZE = 15;
    const CELL_SIZE = canvas.width / GRID_SIZE;

    let snake = [{x: 7, y: 7}];
    let direction = {x: 1, y: 0};
    let food = {x: 10, y: 10};
    let score = 0;
    let gameRunning = false;

    // Controles start and pause

    document.getElementById('btnStart').addEventListener('click', () => {
      gameRunning = true;
    });

    document.getElementById('btnPause').addEventListener('click', () => {
      gameRunning = false;
    });

    // Controles táctiles
    document.getElementById('btnUp').addEventListener('click', () => {
      if (direction.y === 0) direction = {x: 0, y: -1};
    });
    document.getElementById('btnDown').addEventListener('click', () => {
      if (direction.y === 0) direction = {x: 0, y: 1};
    });
    document.getElementById('btnLeft').addEventListener('click', () => {
      if (direction.x === 0) direction = {x: -1, y: 0};
    });
    document.getElementById('btnRight').addEventListener('click', () => {
      if (direction.x === 0) direction = {x: 1, y: 0};
    });

    // Controles de teclado
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp' && direction.y === 0) direction = {x: 0, y: -1};
      if (e.key === 'ArrowDown' && direction.y === 0) direction = {x: 0, y: 1};
      if (e.key === 'ArrowLeft' && direction.x === 0) direction = {x: -1, y: 0};
      if (e.key === 'ArrowRight' && direction.x === 0) direction = {x: 1, y: 0};
    });

    function generateFood() {
      food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Evitar generar comida sobre la serpiente
      if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood();
      }
    }

    function draw() {
      // Limpiar canvas
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar cuadrícula
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
      }

      // Dibujar serpiente
      snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#2E7D32' : '#4CAF50';
        ctx.fillRect(
          segment.x * CELL_SIZE + 1,
          segment.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        );
      });

      // Dibujar comida
      ctx.fillStyle = '#FF5252';
      ctx.beginPath();
      ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    function update() {
      if (!gameRunning) return;

      const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
      };

      // Verificar colisiones con paredes
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        gameOver();
        return;
      }

      // Verificar colisiones con el cuerpo
      if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
      }

      snake.unshift(head);

      // Verificar si comió
      if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = score;
        generateFood();
      } else {
        snake.pop();
      }
    }

    function gameOver() {
      gameRunning = false;
      alert(`Game Over! Puntaje final: ${score}`);
      // Reiniciar juego
      snake = [{x: 7, y: 7}];
      direction = {x: 1, y: 0};
      score = 0;
      scoreEl.textContent = score;
      generateFood();
      gameRunning = false;
    }

    function gameLoop() {
      update();
      draw();
      setTimeout(gameLoop, 150);
    }

    generateFood();
    gameLoop();

    // Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js');
    }