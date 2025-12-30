# Math-Game

Fast multiplication drills: answer before the timer runs out, track your streaks, and review tables that need work.

![Game screenshot](image.png)

## How to play

- Open `index.html` in any modern browser (no install or build step).
- Type the answer and press **Submit** (or hit Enter).
- You get 5 seconds per question; 10 rounds per game.
- Correct answers boost your score and streak; wrong/expired rounds reset the streak.
- After 10 rounds, the game shows which tables caused mistakes.

## Game rules and tuning

Adjust the knobs in `script.js` under `CONFIG`:

```js
const CONFIG = {
  maxRounds: 10, // total questions per game
  timeLimit: 5, // seconds per question
  operandMin: 2, // smallest factor
  operandMax: 12, // largest factor
  operations: "x", // allowed operators (e.g., "+-x/")
};
```

## Interface and behavior

- Compact card layout with Rubik/Space Grotesk typography (`index.html`, `style.css`).
- Stats bar for score, timer, and streak.
- Question area highlights correctness with ✓/✕ feedback.
- Restart button resets score, streak, timer, and error tracking.

## Files

- `index.html` – markup and font includes.
- `style.css` – layout, gradients, and interaction states.
- `script.js` – game loop, timer, scoring, streaks, error summary.
- `image.png` – reference screenshot.

\*README generated using Codex
