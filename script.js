const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const SNAKE_SPEED = 150; // Milliseconds

// Snake
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let score = 0;

// Score display
const scoreDisplay = document.getElementById("score");

document.addEventListener("keydown", changeDirection);

// Game loop
setInterval(gameLoop, SNAKE_SPEED);

function gameLoop() {
  clearCanvas();
  moveSnake();
  drawSnake();
  drawFood();
  checkCollision();
}

function clearCanvas() {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function drawSnake() {
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#333" : "#666"; // Head color different from body
      ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
      
      // Add eyes and tongue to the head
      if (index === 0) {
        ctx.fillStyle = "white"; // Eyes
        ctx.fillRect((segment.x + 0.1) * GRID_SIZE, (segment.y + 0.2) * GRID_SIZE, GRID_SIZE / 5, GRID_SIZE / 5);
        ctx.fillRect((segment.x + 0.7) * GRID_SIZE, (segment.y + 0.2) * GRID_SIZE, GRID_SIZE / 5, GRID_SIZE / 5);
        
        ctx.fillStyle = "red"; // Tongue
        ctx.fillRect((segment.x + 0.2) * GRID_SIZE, (segment.y + 0.9) * GRID_SIZE, GRID_SIZE * 0.6, GRID_SIZE / 10);
      }
  
      // Make tail more snake-like
    if (index === snake.length - 1) {
        // Draw tail with a gradient effect
        const tailGradient = ctx.createLinearGradient(segment.x * GRID_SIZE, segment.y * GRID_SIZE, (segment.x + 1) * GRID_SIZE, (segment.y + 1) * GRID_SIZE);
        ctx.fillStyle = tailGradient;
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
      }
    });
  }

  

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  // Check if snake ate food
  if (head.x === food.x && head.y === food.y) {
    score++;
    generateFood();
  } else {
    snake.pop();
  }
  updateScore(); // Update the score after each move
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
    y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
  };

  // Check if food is inside the snake, regenerate if true
  if (snake.some((segment) => segment.x === food.x && segment.y === food.y)) {
    generateFood();
  }
}

function checkCollision() {
  // Check if snake hits itself
  if (snake.slice(1).some((segment) => segment.x === snake[0].x && segment.y === snake[0].y)) {
    gameOver();
  }

  // Check if snake hits walls
  if (
    snake[0].x < 0 ||
    snake[0].x >= CANVAS_SIZE / GRID_SIZE ||
    snake[0].y < 0 ||
    snake[0].y >= CANVAS_SIZE / GRID_SIZE
  ) {
    gameOver();
  }
}

function gameOver() {
  alert("Game Over! Your score: " + score);
  resetGame();
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  food = { x: 5, y: 5 };
  dx = 0;
  dy = 0;
  score = 0;
  updateScore(); // Update score when resetting the game
}

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;

  const goingUp = dy === -1;
  const goingDown = dy === 1;
  const goingRight = dx === 1;
  const goingLeft = dx === -1;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -1;
    dy = 0;
  }

  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -1;
  }

  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 1;
    dy = 0;
  }

  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 1;
  }
}

function updateScore() {
  scoreDisplay.innerText = "Score: " + score; // Update the score display
}
