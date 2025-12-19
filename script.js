const ROUNDS_PER_GAME = 10;
const TIME_LIMIT = 5;
const OPERAND_LOWERLIM = 2;
const OPERAND_UPPERLIM = 12;
const ONE_EPOCH = 1000;
const OPERATIONS = "x";

const display = document.getElementById("screen");
const timer = document.getElementById("timer");
const input = document.getElementById("player");
const score = document.getElementById("score");

const state = {
  correctGuess: false,
  gameOver: false,
  round: 0,
  wins: 0,
};

let errors = {};

for (let i = OPERAND_LOWERLIM; i <= OPERAND_UPPERLIM; i++) {
  errors[i] = 0;
}

let question = "";
let answer = "";

document.addEventListener("DOMContentLoaded", async () => {
  submitGuessOnEnter();
  refreshScoreBoard();
  runGameLoop();
});

async function runGameLoop() {
  clearDisplay();
  clearPlayer();

  setQuestionAndAnswer();
  show(question);

  await countDownTimer();

  showFormattedAnswer(answer);

  state.round++;
  input.disabled = true;

  refreshScoreBoard();

  if (!state.correctGuess) {
    let lhs = question.split(" ")[0];
    let rhs = question.split(" ")[2];
    errors[lhs] += 1;
    errors[rhs] += 1;
  }

  setTimeout(() => {
    if (state.round == ROUNDS_PER_GAME) {
      endGame();
      return;
    }

    state.correctGuess = false;
    runGameLoop();
  }, ONE_EPOCH);
}

async function countDownTimer() {
  let timeRemaining = TIME_LIMIT;

  while (timeRemaining > 0) {
    showTime(timeRemaining--);
    input.focus();

    //delay 1 second (1000 ms)
    for (let ms = 0; ms < ONE_EPOCH; ms += 100) {
      if (state.correctGuess) break;
      await sleep(100);
    }
  }

  showTime("-");
}

function submitGuessOnEnter() {
  if (input)
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        let guess = input.value;
        if (guess) evaluateGuess(guess);
      }
      if (event.key === "Escape") input.value = "";
    });
}

function evaluateGuess(guess) {
  input.disabled = true;

  if (guess.toString() === answer.toString()) {
    state.correctGuess = true;
    input.value = "✅";
    state.wins++;
  } else {
    input.value = "❌";
    setTimeout(clearPlayer, ONE_EPOCH);
  }
}

function show(text) {
  if (display == null) return;
  display.textContent = text;
}

function showTime(time) {
  if (timer == null) return;
  timer.textContent = time;
}

function clearPlayer() {
  input.value = "";
  input.disabled = false;
  input.focus();
}

function clearDisplay() {
  show("");
  display.classList.remove("answer");
  if (!display.classList.contains("text-danger")) display.classList.add("text-danger");
}

function clearTimer() {
  showTime(0);
  timer.disabled = false;
}

function setQuestionAndAnswer() {
  const a = randIncl(OPERAND_LOWERLIM, OPERAND_UPPERLIM);
  const b = randIncl(OPERAND_LOWERLIM, OPERAND_UPPERLIM);

  const randIdx = randIncl(0, OPERATIONS.length - 1);
  const operator = OPERATIONS.charAt(randIdx);

  let result;
  switch (operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "x":
      result = a * b;
      break;
    case "/":
      result = a / b;
      break;
  }

  question = `${a} ${operator} ${b}`;
  answer = Math.round(result);
}

function randIncl(min, max) {
  return Math.floor(Math.floor(Math.random() * (max - min + 1)) + min);
}

function showFormattedAnswer(answer) {
  if (!screen) return;
  display.classList.remove("text-danger");
  display.classList.add("answer");
  show(answer);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function refreshScoreBoard() {
  score.textContent = `${state.wins} / ${state.round}`;
}

function endGame() {
  let statsText = Object.entries(errors)
    .filter(([_, value]) => value != 0)
    .map(([key, value]) => `${key} x table (${value} errors)`)
    .join("\n");

  if (!statsText || statsText == "") statsText += "Well done you had 0 errors!";

  show("GAME OVER");
  document.getElementById("errors").textContent = statsText;

  input.disabled = true;
  timer.disabled = true;
}
