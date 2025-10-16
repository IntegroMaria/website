// --- CONFIGURATION ---
const CANVAS_SIZE = 400;
const GRID_SIZE = 20; // 20x20 grid
const TILE_SIZE = CANVAS_SIZE / GRID_SIZE; // 20 pixels per tile
const GAME_SPEED = 150; // Milliseconds per update

// --- GAME SETUP ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreDisplay = document.getElementById('final-score');

let snake;
let food;
let dx, dy; // Direction vectors (dx=1, dy=0 means moving right)
let score;
let gameLoopInterval;
let isGameOver = false;

// Variables for Mobile Touch Control
let touchStartX = 0;
let touchStartY = 0;

// --- INITIALIZATION ---

function initGame() {
    snake = [
        { x: 10, y: 10 }, // Head
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    dx = 1; // Start moving right
    dy = 0;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    isGameOver = false;
    
    clearInterval(gameLoopInterval); 
    gameOverScreen.classList.add('hidden');

    placeFood();
    gameLoopInterval = setInterval(gameLoop, GAME_SPEED);
}

// --- GAME LOGIC ---

function placeFood() {
    let newFoodX, newFoodY;
    let isOnSnake;

    do {
        newFoodX = Math.floor(Math.random() * GRID_SIZE);
        newFoodY = Math.floor(Math.random() * GRID_SIZE);
        
        isOnSnake = snake.some(segment => segment.x === newFoodX && segment.y === newFoodY);
    } while (isOnSnake);

    food = { x: newFoodX, y: newFoodY };
}

function updateGame() {
    // 1. Move the snake: Create a new head
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // 2. Check for Game Over conditions
    if (head.x < 0 || head.x >= GRID_SIZE || 
        head.y < 0 || head.y >= GRID_SIZE || 
        checkSelfCollision(head)) {
        
        endGame();
        return;
    }

    // Add the new head to the beginning of the snake
    snake.unshift(head);

    // 3. Check for eating food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
        placeFood(); // Place new food
        // Snake grows because tail is NOT removed
    } else {
        // Remove the tail only if no food was eaten
        snake.pop();
    }
}

function checkSelfCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function endGame() {
    isGameOver = true;
    clearInterval(gameLoopInterval);
    finalScoreDisplay.textContent = `Your final score is: ${score}`;
    gameOverScreen.classList.remove('hidden');
}

// --- RENDERING ---

function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctx.strokeStyle = '#333';
    ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function drawGame() {
    // Clear the canvas
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw Food (Apple)
    drawRect(food.x, food.y, 'red');

    // Draw Snake
    snake.forEach((segment, index) => {
        // Head is a slightly different color
        const color = index === 0 ? '#00FF00' : '#00AA00'; 
        drawRect(segment.x, segment.y, color);
    });
}

// --- GAME LOOP ---

function gameLoop() {
    if (isGameOver) return;
    updateGame();
    drawGame();
}

// --- INPUT HANDLING (Keyboard and Touch) ---

document.addEventListener('keydown', changeDirection);
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);

function changeDirection(event) {
    const keyPressed = event.key;
    const LEFT = 'ArrowLeft';
    const UP = 'ArrowUp';
    const RIGHT = 'ArrowRight';
    const DOWN = 'ArrowDown';

    // Prevent turning 180 degrees instantly
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT && !goingRight) {
        dx = -1; dy = 0;
    } else if (keyPressed === UP && !goingDown) {
        dx = 0; dy = -1;
    } else if (keyPressed === RIGHT && !goingLeft) {
        dx = 1; dy = 0;
    } else if (keyPressed === DOWN && !goingUp) {
        dx = 0; dy = 1;
    }
}

// --- MOBILE TOUCH SWIPE LOGIC ---

function handleTouchStart(event) {
    // Prevent scrolling/zooming while touching the canvas
    event.preventDefault(); 
    
    // Get the starting position of the touch
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

function handleTouchMove(event) {
    // Prevent the default scrolling behavior
    event.preventDefault(); 
}

function handleTouchEnd(event) {
    // Check if the game is over before processing touch
    if (isGameOver) return;
    
    // Get the ending position of the touch
    const touch = event.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    // Calculate the distance moved
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    // Determine if it's a horizontal or vertical swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 10 && dx !== -1) { // Swipe Right and not currently going Left
            dx = 1; dy = 0;
        } else if (diffX < -10 && dx !== 1) { // Swipe Left and not currently going Right
            dx = -1; dy = 0;
        }
    } else {
        // Vertical swipe
        if (diffY > 10 && dy !== -1) { // Swipe Down and not currently going Up
            dx = 0; dy = 1;
        } else if (diffY < -10 && dy !== 1) { // Swipe Up and not currently going Down
            dx = 0; dy = -1;
        }
    }
}

// Attach the 'touchend' event listener to the canvas
canvas.addEventListener('touchend', handleTouchEnd, false);


// Start the game!
initGame();