const COLORS = ["🔴", "🟡", "🟢", "🔵", "🟣", "⚪", "🟤", "🟠"];

const timeEl = document.getElementById("time");
const tasksEl = document.getElementById("tasks");
const votesEl = document.getElementById("votes");
const boardEl = document.getElementById("gameBoard");
const messageEl = document.getElementById("message");
const taskBtn = document.getElementById("taskBtn");
const restartBtn = document.getElementById("restartBtn");

let state = {};
let timerId = null;

function randomName(idx) {
  return `Crewmate ${idx + 1}`;
}

function setupGame() {
  const impostorIndex = Math.floor(Math.random() * 8);
  state = {
    time: 60,
    tasks: 0,
    votes: 3,
    gameOver: false,
    crew: COLORS.map((emoji, idx) => ({
      emoji,
      name: randomName(idx),
      isImpostor: idx === impostorIndex,
      out: false,
    })),
  };

  messageEl.textContent = "Tip: Click a crewmate to vote them out.";
  messageEl.className = "message";
  draw();
  startTimer();
}

function draw() {
  timeEl.textContent = state.time;
  tasksEl.textContent = state.tasks;
  votesEl.textContent = state.votes;

  boardEl.innerHTML = "";
  state.crew.forEach((mate, index) => {
    const card = document.createElement("button");
    card.className = `crewmate ${mate.out ? "out" : ""}`;
    card.disabled = mate.out || state.gameOver;
    card.innerHTML = `<div style="font-size:2rem">${mate.emoji}</div><div>${mate.name}</div>`;
    card.addEventListener("click", () => vote(index));
    boardEl.appendChild(card);
  });
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    if (state.gameOver) return;
    state.time -= 1;
    if (state.time <= 0) {
      state.time = 0;
      lose("Time is up. The impostor escaped!");
    }
    draw();
  }, 1000);
}

function vote(index) {
  if (state.gameOver || state.votes <= 0) return;
  const mate = state.crew[index];
  if (mate.out) return;

  mate.out = true;
  state.votes -= 1;

  if (mate.isImpostor) {
    win(`You ejected ${mate.name}. Impostor defeated!`);
  } else if (state.votes === 0) {
    lose("You ran out of votes. The impostor wins.");
  } else {
    messageEl.textContent = `${mate.name} was not the impostor.`;
  }

  draw();
}

function doTask() {
  if (state.gameOver) return;
  if (state.tasks < 5) {
    state.tasks += 1;
    state.time = Math.min(75, state.time + 3);
    messageEl.textContent = "Task complete! +3 seconds.";
    if (state.tasks >= 5) {
      win("All tasks complete. Crewmates win!");
    }
    draw();
  }
}

function win(text) {
  state.gameOver = true;
  messageEl.textContent = text;
  messageEl.className = "message win";
  clearInterval(timerId);
}

function lose(text) {
  state.gameOver = true;
  messageEl.textContent = text;
  messageEl.className = "message lose";
  clearInterval(timerId);
}

taskBtn.addEventListener("click", doTask);
restartBtn.addEventListener("click", setupGame);

setupGame();
