const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');

const startButton = document.createElement('button');
startButton.textContent = 'Start Game';
startButton.id = 'startButton';
startButton.addEventListener('click', startGame);

document.body.appendChild(startButton);

const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const gameOverDialog = document.getElementById('gameOverDialog');
const retryButton = document.getElementById('retryButton');

let isGameActive = false;
let score = 0;
let highScore = 0;

const bird = {
    x: 50,
    y: canvas.height / 2 - 15,
    width: 40,
    height: 30,
    velocity: 0,
    gravity: 0.5,
    jumpStrength: 8,
    image: new Image(),
};

bird.image.src = 'https://i.postimg.cc/44qNBQqV/Bird-png.png'; // Bird image

const pipes = [];
const pipeWidth = 60;
const pipeGap = 150;
const pipeSpeed = 2;

const background = {
    x: 0,
    speed: 1,
    image: new Image(),
};

background.image.src = 'https://i.postimg.cc/ZRDKk8Rk/Backgroud-png.jpg'; // Background image

function startGame() {
    isGameActive = true;
    startButton.style.display = 'none';
    canvas.style.display = 'block';
    score = 0;
    bird.y = canvas.height / 2 - 15;
    bird.velocity = 0;
    pipes.length = 0;

    document.addEventListener('keydown', jump);
    document.addEventListener('click', jump);

    gameOverDialog.style.display = 'none';

    gameLoop();
}

function restartGame() {
    isGameActive = true;
    startButton.style.display = 'none';
    canvas.style.display = 'block';
    score = 0;
    bird.y = canvas.height / 2 - 15;
    bird.velocity = 0;
    pipes.length = 0;

    document.addEventListener('keydown', jump);
    document.addEventListener('click', jump);

    gameOverDialog.style.display = 'none';

    gameLoop();
}

function gameLoop() {
    if (isGameActive) {
        update();
        render();
        requestAnimationFrame(gameLoop);
    }
}

function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y - bird.height / 2 < 0 || bird.y + bird.height / 2 > canvas.height) {
        endGame();
        return;
    }

    if (Math.random() < 0.02) {
        const gapPosition = Math.random() * (canvas.height - pipeGap - 50) + 20;

        if (pipes.length === 0 || canvas.width - pipes[pipes.length - 1].x >= 2 * pipeWidth) {
            const pipeImage = new Image();
            pipeImage.src = 'https://i.postimg.cc/zG1D1XJf/Pipe-png.png'; // Pipe image

            pipes.push({
                x: canvas.width,
                topHeight: gapPosition - pipeGap / 2,
                bottomHeight: canvas.height - gapPosition - pipeGap / 2,
                image: pipeImage,
            });
        }
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeSpeed;

        if (
            bird.x < pipes[i].x + pipeWidth &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y - bird.height / 2 < pipes[i].topHeight || bird.y + bird.height / 2 > pipes[i].topHeight + pipeGap)
        ) {
            endGame();
            return;
        }

        if (pipes[i].x + pipeWidth < bird.x - bird.width / 2 && i === pipes.length - 1) {
            score++;
        }

        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
    }

    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = `High Score: ${highScore}`;
    }
}

function render() {
    ctx.drawImage(background.image, background.x, 0, canvas.width, canvas.height);
    ctx.drawImage(background.image, background.x + canvas.width, 0, canvas.width, canvas.height);

    background.x -= background.speed;
    if (background.x <= -canvas.width) {
        background.x = 0;
    }

    ctx.drawImage(bird.image, bird.x - bird.width / 2, bird.y - bird.height / 2, bird.width, bird.height);

    for (const pipe of pipes) {
        ctx.drawImage(pipe.image, pipe.x, 0, pipeWidth, pipe.topHeight);
        const bottomPipeY = canvas.height - pipe.bottomHeight;
        ctx.drawImage(pipe.image, pipe.x, bottomPipeY, pipeWidth, pipe.bottomHeight);
    }

    scoreElement.textContent = `Score: ${score}`;
}

function jump() {
    if (isGameActive) {
        bird.velocity = -bird.jumpStrength;
    }
}

function endGame() {
    isGameActive = false;
    startButton.style.display = 'block';
    canvas.style.display = 'none';
    gameOverDialog.style.display = 'block';
    document.removeEventListener('keydown', jump);
    document.removeEventListener('click', jump);
    retryButton.addEventListener('click', restartGame);
    scoreElement.textContent = `Score: ${score}`;
    highScoreElement.textContent = `High Score: ${highScore}`;
}

highScoreElement.textContent = `High Score: ${highScore}`;
