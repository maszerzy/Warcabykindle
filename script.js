const boardEl = document.getElementById("board");
const restartBtn = document.getElementById("restart");
const scoreEl = document.getElementById("scoreboard");

let board = [];
let currentPlayer = 2; // Biały zaczyna
let selected = null;
let score = {1: 0, 2: 0};

function initBoard() {
  board = [];
  boardEl.innerHTML = "";
  for (let row = 0; row < 8; row++) {
    board[row] = [];
    for (let col = 0; col < 8; col++) {
      const cell = document.createElement("div");
      const isBlack = (row + col) % 2 === 1;
      cell.className = "cell " + (isBlack ? "black" : "white");
      const inner = document.createElement("div");
      inner.className = "cell-inner";
      inner.dataset.row = row;
      inner.dataset.col = col;
      cell.appendChild(inner);
      boardEl.appendChild(cell);
      board[row][col] = null;

      if (isBlack && row < 3) board[row][col] = 1;
      else if (isBlack && row > 4) board[row][col] = 2;

      drawPiece(inner, row, col);
      inner.addEventListener("click", handleClick);
    }
  }
  updateScore();
  updateTurnDisplay();
}

function drawPiece(cell, row, col) {
  cell.innerHTML = "";
  const piece = board[row][col];
  if (!piece) return;

  const isQueen = piece > 10;
  const base = piece % 10;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "50%");
  circle.setAttribute("cy", "50%");
  circle.setAttribute("r", "30%");
  circle.classList.add("outer");
  circle.setAttribute("fill", base === 1 ? "black" : "white");
  if (base === 2) {
    circle.setAttribute("stroke", "black");
    circle.setAttribute("stroke-width", "2");
  }
  svg.appendChild(circle);

  if (isQueen) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "50%");
    text.setAttribute("y", "55%");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "60%");
    text.setAttribute("fill", base === 1 ? "white" : "black");
    text.textContent = "♛";
    svg.appendChild(text);
  }

  if (selected && selected.row == row && selected.col == col) {
    const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    ring.setAttribute("cx", "50%");
    ring.setAttribute("cy", "50%");
    ring.setAttribute("r", "12%");
    ring.classList.add("inner");
    ring.setAttribute("stroke", base === 1 ? "white" : "black");
    svg.appendChild(ring);
  }

  cell.appendChild(svg);
}

function handleClick(e) {
  const row = parseInt(e.currentTarget.dataset.row);
  const col = parseInt(e.currentTarget.dataset.col);
  const piece = board[row][col];

  if (selected) {
    if (movePiece(selected.row, selected.col, row, col)) {
      selected = null;
      switchPlayer();
    } else {
      selected = null;
    }
  } else if ((piece % 10) === currentPlayer) {
    selected = {row, col};
  }
  redrawBoard();
}

function movePiece(fromRow, fromCol, toRow, toCol) {
  const piece = board[fromRow][fromCol];
  const isQueen = piece > 10;
  const target = board[toRow][toCol];
  if (target) return false;

  const dx = toCol - fromCol;
  const dy = toRow - fromRow;

  if (Math.abs(dx) === Math.abs(dy)) {
    const stepX = dx > 0 ? 1 : -1;
    const stepY = dy > 0 ? 1 : -1;

    let i = 1;
    let captured = null;

    while (i < Math.abs(dx)) {
      const r = fromRow + i * stepY;
      const c = fromCol + i * stepX;
      const mid = board[r][c];
      if (mid) {
        if ((mid % 10) === currentPlayer || captured) return false;
        captured = {row: r, col: c};
      }
      i++;
    }

    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = null;
    if (captured) {
      board[captured.row][captured.col] = null;
      score[currentPlayer]++;
      updateScore();
    }

    // promocja do damki
    if ((currentPlayer === 1 && toRow === 7) || (currentPlayer === 2 && toRow === 0)) {
      board[toRow][toCol] += 10;
    }

    return true;
  }

  return false;
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateTurnDisplay();
}

function redrawBoard() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = document.querySelector(
        `.cell-inner[data-row="${row}"][data-col="${col}"]`
      );
      drawPiece(cell, row, col);
    }
  }
}

function updateScore() {
  scoreEl.textContent = `Gracz 1: ${score[1]} | Gracz 2: ${score[2]}`;
}

function updateTurnDisplay() {
  document.getElementById("turn-top").textContent = "Ruch: Gracz " + currentPlayer;
  document.getElementById("turn-bottom").textContent = "Ruch: Gracz " + currentPlayer;
}

restartBtn.addEventListener("click", () => {
  selected = null;
  score = {1: 0, 2: 0};
  currentPlayer = 2;
  initBoard();
});

initBoard();
