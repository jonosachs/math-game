const questionBox = document.getElementById("question");
const countdownBox = document.getElementById("count-down");
const p1Submit = document.getElementById("player1-submit");
const p1Input = document.getElementById("player1-input");
const p2Input = document.getElementById("player2-input");
const p1Score = document.getElementById("player1-score");
const p2Score = document.getElementById("player2-score");

let guessInTime = false;
let equation = "";
let guess = "";
let answer = 0;
let p1Wins = 0;
let p2Wins = 0;
let numQuestions = 0;

// Wait for DOM to load and then enable start button
document.addEventListener("DOMContentLoaded", () => {
    pressToStart();
});

// Enable press to start button
function pressToStart() {
    questionBox.textContent = "PLAY";
    questionBox.classList.add("play");
    questionBox.addEventListener("click", startGame, { once: true });
}

// Run main game sequence
async function startGame() {
    clearUI();
    updateScoreBoard();
    setNewEquation();
    addPlayerListners(); // And handle inputs

    let timeUp = await countdownTimer();

    if (timeUp) {
        incorrectMsg();
        p2Wins++;
    } else {
        correctMsg();
        p1Wins++;
    }

    numQuestions++;
    updateScoreBoard();

    setTimeout(() => {
        clearUI();
        if (numQuestions < 10) {
            startGame();
        } else {
            endGame();
        }
    }, 750);
}

function addPlayerListners() {
    p1Input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            handlePlayerInput();
        }
    });

    p1Submit.addEventListener("click", () => {
        handlePlayerInput();
    });
}

function setNewEquation() {
    const a = Math.floor(Math.random() * 25) + 1;
    const b = Math.floor(Math.random() * 25) + 1;
    const operators = ["x", "+", "-"];

    if (a % b == 0) {
        operators.push("/");
    }

    const randomIndex = Math.floor(Math.random() * operators.length);
    const operator = operators[randomIndex];

    // operator = "x";

    equation = `${a} ${operator} ${b}`;
    questionBox.textContent = equation;

    switch (operator) {
        case "x":
            answer = a * b;
            break;
        case "/":
            answer = a / b;
            break;
        case "+":
            answer = a + b;
            break;
        case "-":
            answer = a - b;
            break;
    }
}

// Run countdown timer and break if user guesses correctly
async function countdownTimer() {
    countdownBox.className = "box medium-text count-down";
    guessInTime = false;
    let seconds = 5;

    while (seconds > 0 && !guessInTime) {
        countdownBox.textContent = seconds;
        for (let ms = 0; ms < 1000; ms += 100) {
            if (guessInTime) break;
            await sleep(100);
        }
        seconds--;
    }

    countdownBox.classList.add("correct");
    countdownBox.textContent = `=${answer}`;

    return !guessInTime; // Return time-up boolean signal
}

// Handle in-round input allowing multiple guesses
function handlePlayerInput() {
    if (p1Input.disabled) {
        return;
    }

    guess = parseInt(p1Input.value);
    if (guess === answer) {
        guessInTime = true;
        correctMsg();
    } else {
        incorrectMsg();
        setTimeout(clearUI, 250);
    }
}

function clearUI() {
    p1Input.value = "";
    p2Input.value = "";
    countdownBox.textContent = "";
    p1Input.className = "box large-text";
    p1Input.disabled = false;
    p1Submit.disabled = false;
    countdownBox.classList.remove("correct");
    questionBox.classList.remove("play");
    p1Input.focus();
}

function correctMsg() {
    p1Input.className = "box medium-text correct";
    p1Input.value = "CORRECT";
    p1Input.disabled = true;
}

function incorrectMsg() {
    p1Input.className = "box medium-text incorrect";
    p1Input.value = "INCORRECT";
    p1Input.disabled = true;
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function updateScoreBoard() {
    p1Score.textContent = `SCORE: ${p1Wins}/${numQuestions}`;
    p2Score.textContent = `SCORE: ${p2Wins}/${numQuestions}`;
}

function endGame() {
    clearUI();

    if (p1Wins > p2Wins) {
        p1Input.value = "WIN";
        p2Input.value = "LOSS";
    } else if (p2Wins === p1Wins) {
        p1Input.value = "DRAW";
        p2Input.value = "DRAW";
    } else {
        p1Input.value = "LOSS";
        p2Input.value = "WIN";
    }

    p1Input.disabled = true;
    p1Submit.disabled = true;

    p1Wins = 0;
    p2Wins = 0;
    numQuestions = 0;

    pressToStart();
}
