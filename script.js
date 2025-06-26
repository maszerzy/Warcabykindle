const board = document.getElementById('board');
const score = document.getElementById('scoreboard');
const restartBtn = document.getElementById('restart');
let cells = [];
let pieces = [];
let selected = null;
let currentPlayer = 1;
let scores = {1: 0, 2: 0};

function createBoard() {
    board.innerHTML = '';
    cells = [];
    for (let i = 0; i < 64; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        const row = Math.floor(i / 8);
        const col = i % 8;
        if ((row + col) % 2 === 1) {
            cell.classList.add('black');
            if (row < 3) addPiece(cell, 2);
            if (row > 4) addPiece(cell, 1);
        } else {
            cell.classList.add('white');
        }
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleClick(cell));
        board.appendChild(cell);
        cells.push(cell);
    }
    updateScore();
}

function addPiece(cell, player) {
    const piece = document.createElement('div');
    piece.classList.add('piece', 'p' + player);
    cell.appendChild(piece);
}

function handleClick(cell) {
    const piece = cell.querySelector('.piece');
    if (selected) {
        if (!piece && validMove(selected.cell, cell)) {
            movePiece(selected.cell, cell);
            currentPlayer = 3 - currentPlayer;
        }
        selected.cell.classList.remove('selected');
        selected = null;
    } else if (piece && piece.classList.contains('p' + currentPlayer)) {
        selected = {cell};
        cell.classList.add('selected');
    }
}

function validMove(fromCell, toCell) {
    const fromIdx = parseInt(fromCell.dataset.index);
    const toIdx = parseInt(toCell.dataset.index);
    const diff = toIdx - fromIdx;
    const dir = currentPlayer === 1 ? -1 : 1;
    const rowFrom = Math.floor(fromIdx / 8);
    const rowTo = Math.floor(toIdx / 8);
    const colFrom = fromIdx % 8;
    const colTo = toIdx % 8;
    const dx = Math.abs(colTo - colFrom);
    const dy = Math.abs(rowTo - rowFrom);

    if (dx !== dy || dx === 0) return false;
    if (dx === 1 && dy === 1) return true; // simple move
    if (dx === 2) { // capture
        const mid = (fromIdx + toIdx) / 2;
        const midPiece = cells[mid].querySelector('.piece');
        if (midPiece && !midPiece.classList.contains('p' + currentPlayer)) {
            cells[mid].innerHTML = '';
            scores[currentPlayer]++;
            updateScore();
            return true;
        }
    }
    return false;
}

function movePiece(fromCell, toCell) {
    const piece = fromCell.querySelector('.piece');
    fromCell.innerHTML = '';
    toCell.appendChild(piece);
    maybeKing(piece, toCell);
}

function maybeKing(piece, cell) {
    const idx = parseInt(cell.dataset.index);
    const row = Math.floor(idx / 8);
    if ((currentPlayer === 1 && row === 0) || (currentPlayer === 2 && row === 7)) {
        piece.classList.add('king');
    }
}

function updateScore() {
    score.textContent = `Gracz 1: ${scores[1]} | Gracz 2: ${scores[2]}`;
}

restartBtn.addEventListener('click', () => {
    scores = {1: 0, 2: 0};
    currentPlayer = 1;
    createBoard();
});

createBoard();
