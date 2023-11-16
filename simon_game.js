// Variables
const buttons = document.querySelectorAll('.simon-button');
const startButton = document.getElementById('start-button');
const levelDisplay = document.getElementById('level');
const highScoreDisplay = document.getElementById('score');
const pattern = [];
let playerPattern = [];
let level = 1;
let highScore = parseInt(localStorage.getItem('highScore')) || 0;

highScoreDisplay.textContent = `High Score: ${highScore}`;

// Sound Effects
const audio1 = document.getElementById('audio-1');
const audio2 = document.getElementById('audio-2');
const audio3 = document.getElementById('audio-3');
const audio4 = document.getElementById('audio-4');
const audioWrong = document.getElementById('audio-wrong');

// Functions
function playPattern() {
    let i = 0;

    function activateNextButton() {
        if (i < pattern.length) {
            activateButton(pattern[i]);
            i++;
            setTimeout(() => {
                deactivateButton();
            }, 500); // Adjust the time the button stays active
            setTimeout(activateNextButton, 1000); // Adjust the time between button activations
        }
    }

    activateNextButton();
    playerPattern = [];
    levelDisplay.textContent = `Level ${level}`;
}

function activateButton(buttonNumber) {
    const button = buttons[buttonNumber - 1];
    const audio = document.getElementById(`audio-${buttonNumber}`);

    button.classList.add('active');
    audio.currentTime = 0;
    audio.play();
}

function deactivateButton() {
    buttons.forEach((button) => {
        button.classList.remove('active');
    });
}

function checkPlayerInput() {
    if (playerPattern.length === pattern.length) {
        if (JSON.stringify(playerPattern) === JSON.stringify(pattern)) {
            level++;
            levelDisplay.textContent = `Level ${level}`;
            
            if (level > highScore) {
                highScore = level;
                highScoreDisplay.textContent = `High Score: ${highScore}`;
                localStorage.setItem('highScore', highScore);
            }

            setTimeout(() => {
                playPattern();
                pattern.push(Math.floor(Math.random() * 4) + 1);
            }, 1000);
        } else {
            gameOver();
        }
    }
}

function gameOver() {
    levelDisplay.textContent = 'Game Over. Press Start to play again.';
    level = 1;
    pattern.length = 0;
    document.getElementById('audio-wrong').play();
}

// Event listeners
buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        // Check if the game is in progress
        if (levelDisplay.textContent !== 'Game Over. Press Start to play again.') {
            const expectedColor = pattern[playerPattern.length];

            if (index + 1 === expectedColor) {
                // Correct color clicked
                playerPattern.push(index + 1);
                activateButton(index + 1);
                checkPlayerInput();
            } else {
                // Incorrect color clicked
                document.getElementById('audio-wrong').play();
                gameOver();
            }
        }
    });
});

startButton.addEventListener('click', () => {
    if (pattern.length === 0) {
        playPattern();
        pattern.push(Math.floor(Math.random() * 4) + 1);
    }
});
