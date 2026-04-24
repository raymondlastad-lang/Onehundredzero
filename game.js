const counterEl = document.getElementById("counter");
const titleEl = document.getElementById("levelTitle");
const textEl = document.getElementById("levelText");
const areaEl = document.getElementById("levelArea");
const resetBtn = document.getElementById("resetBtn");

let score = Number(localStorage.getItem("ohz-score")) || 100;
let level = Number(localStorage.getItem("ohz-level")) || 1;

function save() {
  localStorage.setItem("ohz-score", score);
  localStorage.setItem("ohz-level", level);
}

function updateScore(amount) {
  score = Math.max(0, score - amount);
  counterEl.textContent = score;
  document.body.classList.add("glitch");

  setTimeout(() => {
    document.body.classList.remove("glitch");
  }, 250);

  save();

  if (score <= 0) {
    win();
  }
}

function nextLevel() {
  level++;
  save();
  renderLevel();
}

function clearArea() {
  areaEl.innerHTML = "";
}

function makeButton(text, onClick, className = "") {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className = className;
  btn.onclick = onClick;
  return btn;
}

function renderLevel() {
  counterEl.textContent = score;
  clearArea();

  if (score <= 0) {
    win();
    return;
  }

  if (level === 1) levelOne();
  else if (level === 2) levelTwo();
  else if (level === 3) levelThree();
  else if (level === 4) levelFour();
  else if (level === 5) levelFive();
  else win();
}

function levelOne() {
  titleEl.textContent = "Level 1: Start";
  textEl.textContent = "Finn knappen som faktisk teller ned.";

  areaEl.append(
    makeButton("Ikke meg", () => updateScore(1), "fake"),
    makeButton("Start -20", () => {
      updateScore(20);
      nextLevel();
    }),
    makeButton("Feil knapp", () => updateScore(1), "fake")
  );
}

function levelTwo() {
  titleEl.textContent = "Level 2: Kode";
  textEl.textContent = "Skriv tallet som nettsiden handler om.";

  const input = document.createElement("input");
  input.className = "input";
  input.placeholder = "Kode...";
  input.maxLength = 3;

  const btn = makeButton("Submit", () => {
    if (input.value.trim() === "100") {
      updateScore(20);
      nextLevel();
    } else {
      updateScore(2);
      input.value = "";
      input.placeholder = "Nope.";
    }
  });

  areaEl.append(input, btn);
  input.focus();
}

function levelThree() {
  titleEl.textContent = "Level 3: Memory";
  textEl.textContent = "Trykk rutene i rekkefølge: 1, 0, 0.";

  const grid = document.createElement("div");
  grid.className = "grid";

  const values = ["0", "1", "7", "0", "3", "9", "5", "8", "2"];
  let progress = 0;
  const answer = ["1", "0", "0"];

  values.forEach((value) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.textContent = value;

    tile.onclick = () => {
      if (value === answer[progress]) {
        progress++;
        tile.style.opacity = ".25";

        if (progress === answer.length) {
          updateScore(20);
          nextLevel();
        }
      } else {
        progress = 0;
        updateScore(3);
      }
    };

    grid.appendChild(tile);
  });

  areaEl.appendChild(grid);
}

function levelFour() {
  titleEl.textContent = "Level 4: Reaction";
  textEl.textContent = "Vent til knappen sier ZERO.";

  const btn = makeButton("WAIT", () => updateScore(5));
  areaEl.appendChild(btn);

  const delay = 1200 + Math.random() * 2200;

  setTimeout(() => {
    btn.textContent = "ZERO";
    btn.onclick = () => {
      updateScore(20);
      nextLevel();
    };
  }, delay);
}

function levelFive() {
  titleEl.textContent = "Level 5: Boss";
  textEl.textContent = "Knus 100 før den knuser deg.";

  let bossHp = 5;
  const boss = makeButton("100 HP", () => {
    bossHp--;
    boss.textContent = `${bossHp * 20} HP`;

    if (bossHp <= 0) {
      updateScore(20);
      nextLevel();
    }
  });

  areaEl.appendChild(boss);
}

function win() {
  score = 0;
  save();

  counterEl.textContent = "0";
  titleEl.textContent = "You reached zero.";
  textEl.textContent = "One Hundred Zero unlocked.";
  clearArea();

  const secret = document.createElement("h2");
  secret.className = "win";
  secret.textContent = "WELCOME TO ZERO";

  const again = makeButton("Play again", resetGame);

  areaEl.append(secret, again);
}

function resetGame() {
  score = 100;
  level = 1;
  save();
  renderLevel();
}

resetBtn.onclick = resetGame;
renderLevel();
