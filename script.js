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

      // Set initial pieces
      if (isBlack && row < 3) board[row][col] = 1;
      else if (isBlack && row > 4) board[row][col] = 2;

      drawPiece(inner, row, col);
      inner.addEventListener("click", handleClick);
    }
  }
  updateScore();
}

function drawPiece(cell, row, col) {
  cell.innerHTML = "";
  const piece = board[row][col];
  if (!piece) return;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "50%");
  circle.setAttribute("cy", "50%");
  circle.setAttribute("r", "30%");
  circle.classList.add("outer");
  circle.setAttribute("fill", piece === 1 ? "black" : "white");
  if (piece === 2) {
    circle.setAttribute("stroke", "black");
    circle.setAttribute("stroke-width", "2");
  }
  svg.appendChild(circle);

  // Add selection ring if selected
  if (selected && selected.row == row && selected.col == col) {
    const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    ring.setAttribute("cx", "50%");
    ring.setAttribute("cy", "50%");
    ring.setAttribute("r", "12%");
    ring.classList.add("inner");
    ring.setAttribute("stroke", piece === 1 ? "white" : "black");
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
      const moreJumps = getAvailableJumpsForPiece(toRow, toCol, currentPlayer, piece.king);
if (moreJumps.length > 0 && move.jumped) {
  selected = { row: toRow, col: toCol };
  highlightJumps(moreJumps);
  return;
} else {
  clearHighlights();
  switchPlayer();
  updateTurnIndicator();
}
    } else {
      selected = null;
    }
  } else if (piece === currentPlayer) {
    selected = {row, col};
  }
  redrawBoard();
}

function movePiece(fromRow, fromCol, toRow, toCol) {
  const dx = toCol - fromCol;
  const dy = toRow - fromRow;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (board[toRow][toCol]) return false;

  if (absDx === 1 && absDy === 1) {
    board[toRow][toCol] = board[fromRow][fromCol];
    board[fromRow][fromCol] = null;
    return true;
  }

  if (absDx === 2 && absDy === 2) {
    const midRow = (fromRow + toRow) / 2;
    const midCol = (fromCol + toCol) / 2;
    if (board[midRow][midCol] && board[midRow][midCol] !== currentPlayer) {
      board[toRow][toCol] = board[fromRow][fromCol];
      board[fromRow][fromCol] = null;
      board[midRow][midCol] = null;
      score[currentPlayer]++;
      updateScore();
      return true;
    }
  }

  return false;
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
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

restartBtn.addEventListener("click", () => {
  selected = null;
  score = {1: 0, 2: 0};
  currentPlayer = 2;
  initBoard();
});

initBoard();


function updateTurnIndicator() {
  const top = document.getElementById("turn-indicator-top");
  const bottom = document.getElementById("turn-indicator-bottom");

  top.classList.remove("active");
  bottom.classList.remove("active");

  if (currentPlayer === 1) {
    bottom.classList.add("active");
  } else {
    top.classList.add("active");
  }
}
