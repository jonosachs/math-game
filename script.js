const CONFIG = {
  maxRounds: 10,
  timeLimit: 5,
  operandMin: 2,
  operandMax: 12,
  operations: "x",
};

const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const streakEl = document.getElementById("streak");
const questionEl = document.getElementById("question");
const questionEyebrowEl = document.getElementById("question__eyebrow");
const formEl = document.getElementById("form");
const inputEl = document.getElementById("input");
const restartBtn = document.getElementById("restart-btn");

const state = {
  round: 0,
  score: 0,
  timeLeft: CONFIG.timeLimit,
  streak: 0,
  timer: null,
  question: null,
  answer: null,
  gameOver: false,
  errors: new Map(),
};

formEl?.addEventListener("submit", handleSubmit);
restartBtn?.addEventListener("click", start);

start();

function start() {
  setQuestionEyebrow("QUESTION");
  stopTimer();
  enableInput();
  focusInput();

  state.gameOver = false;
  state.round = 0;

  startRound();
}

function startRound() {
  updateStats();
  enableInput();

  if (state.round >= CONFIG.maxRounds) {
    endGame();
    return;
  }

  focusInput();

  const { question, answer } = buildQuestion();
  state.question = question;
  state.answer = answer;
  show(question, "large");

  state.timeLeft = CONFIG.timeLimit;
  runTimer();
}

function runTimer() {
  state.timer = setInterval(() => {
    updateTime();
    focusInput();
    if (state.timeLeft <= 0) {
      handleAnswer(false);
      return;
    }
    state.timeLeft -= 1;
  }, 1000);
}

function handleSubmit(event) {
  event.preventDefault();

  if (!inputEl.value.trim() || state.gameOver) {
    clearInput();
    return;
  }

  const answer = inputEl.value;
  clearInput();

  if (!Number.isFinite(Number(answer))) {
    console.log("invalid entry:", answer);
    return;
  }

  handleAnswer(answer == state.answer);
}

function handleAnswer(isCorrect) {
  stopTimer();
  disableInput();

  if (isCorrect) {
    state.score += 1;
    state.streak += 1;
    show("✓", "correct");
  } else {
    state.streak = 0;
    updateErrors();
    show(`❌ ${state.answer}`, "incorrect");
  }

  state.round += 1;
  setTimeout(startRound, 500);
}

function buildQuestion() {
  const a = randIncl(CONFIG.operandMin, CONFIG.operandMax);
  const b = randIncl(CONFIG.operandMin, CONFIG.operandMax);

  const randIdx = randIncl(0, CONFIG.operations.length - 1);
  const operator = CONFIG.operations.charAt(randIdx);

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
      if (a % b != 0) {
        buildQuestion();
        break;
      }
      result = a / b;
      break;
  }

  const question = `${a} ${operator} ${b}`;
  const answer = Math.round(result);

  return { question, answer };
}

function show(text, style) {
  questionEl.classList.remove("small", "correct", "incorrect", "gameOver");

  if (style == "small") questionEl.classList.add("small");
  if (style == "correct") questionEl.classList.add("correct");
  if (style == "incorrect") questionEl.classList.add("incorrect");
  if (style == "gameOver") questionEl.classList.add("gameOver");

  questionEl.textContent = text;
}

function endGame() {
  state.gameOver = true;
  disableInput();
  show("Game Over", "correct");
  setTimeout(showErrors, 1000);
}

function showErrors() {
  const result = [...state.errors.entries()]
    .map(([key, value]) => `${key} x table => errors: ${value}\n`)
    .join("\n");

  setQuestionEyebrow("ERRORS");

  if (result == "") {
    show("No errors, nice!", "small");
    return;
  }

  show(result, "small");
}

function updateStats() {
  scoreEl.textContent = `${state.score} / ${state.round}`;
  streakEl.textContent = state.streak;
}

function stopTimer() {
  clearInterval(state.timer);
  state.timer = null;
  state.timeLeft = "-";
  updateTime();
}

function updateErrors() {
  const question = questionEl.textContent;
  const [a, b] = question.split("x").map((op) => op.trim());

  for (const value of [a, b]) {
    let existing = state.errors.get(value) ?? 0;
    state.errors.set(value, existing + 1);
  }
}

function randIncl(min, max) {
  return Math.floor(Math.floor(Math.random() * (max - min + 1)) + min);
}

function disableInput() {
  inputEl.disabled = true;
}

function enableInput() {
  inputEl.disabled = false;
}

function focusInput() {
  inputEl.focus();
}

function updateTime() {
  timerEl.textContent = state.timeLeft;
}

function clearInput() {
  inputEl.value = "";
}

function setQuestionEyebrow(text) {
  questionEyebrowEl.innerHTML = text;
}
