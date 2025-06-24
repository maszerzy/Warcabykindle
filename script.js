const board = document.getElementById("board");
const rows = 8, cols = 8;
let selectedPiece = null;
let currentPlayer = "white";

function createCell(row, col) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.row = row;
    cell.dataset.col = col;
    const isBlack = (row + col) % 2 === 1;
    cell.classList.add(isBlack ? "black" : "white");

    if (isBlack && row < 3) {
        const piece = document.createElement("div");
        piece.classList.add("piece", "black-piece");
        cell.appendChild(piece);
    } else if (isBlack && row > 4) {
        const piece = document.createElement("div");
        piece.classList.add("piece", "white-piece");
        cell.appendChild(piece);
    }

    cell.addEventListener("click", () => onCellClick(cell));
    board.appendChild(cell);
}

function onCellClick(cell) {
    const piece = cell.querySelector(".piece");
    if (selectedPiece) {
        if (!piece && isValidMove(selectedPiece.parentElement, cell)) {
            movePiece(selectedPiece.parentElement, cell);
            selectedPiece = null;
        } else {
            selectedPiece.classList.remove("selected");
            selectedPiece = null;
        }
    } else if (piece && piece.classList.contains(currentPlayer + "-piece")) {
        selectedPiece = piece;
        piece.classList.add("selected");
    }
}

function isValidMove(fromCell, toCell) {
    const fromRow = parseInt(fromCell.dataset.row);
    const fromCol = parseInt(fromCell.dataset.col);
    const toRow = parseInt(toCell.dataset.row);
    const toCol = parseInt(toCell.dataset.col);
    const piece = fromCell.querySelector(".piece");
    const isKing = piece.classList.contains("king");

    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;

    const direction = piece.classList.contains("white-piece") ? -1 : 1;

    // Normal pionek move
    if (!isKing) {
        if (Math.abs(colDiff) === 1 && rowDiff === direction) {
            return true;
        }
        if (Math.abs(colDiff) === 2 && rowDiff === 2 * direction) {
            const midRow = (fromRow + toRow) / 2;
            const midCol = (fromCol + toCol) / 2;
            const midCell = getCell(midRow, midCol);
            const midPiece = midCell?.querySelector(".piece");
            if (midPiece && !midPiece.classList.contains(currentPlayer + "-piece")) {
                midCell.removeChild(midPiece);
                return true;
            }
        }
    }

    // Ruch damki po przekątnych
    if (isKing && Math.abs(rowDiff) === Math.abs(colDiff)) {
        const steps = Math.abs(rowDiff);
        let stepRow = rowDiff / steps;
        let stepCol = colDiff / steps;
        let enemyFound = false;

        for (let i = 1; i < steps; i++) {
            const midCell = getCell(fromRow + i * stepRow, fromCol + i * stepCol);
            const midPiece = midCell?.querySelector(".piece");
            if (midPiece) {
                if (midPiece.classList.contains(currentPlayer + "-piece") || enemyFound) {
                    return false;
                }
                midCell.removeChild(midPiece);
                enemyFound = true;
            }
        }
        return true;
    }

    return false;
}

function movePiece(fromCell, toCell) {
    const piece = fromCell.querySelector(".piece");
    fromCell.removeChild(piece);
    toCell.appendChild(piece);
    piece.classList.remove("selected");

    // Promocja na damkę
    const toRow = parseInt(toCell.dataset.row);
    if (piece.classList.contains("white-piece") && toRow === 0) {
        piece.classList.add("king");
    } else if (piece.classList.contains("black-piece") && toRow === 7) {
        piece.classList.add("king");
    }

    currentPlayer = currentPlayer === "white" ? "black" : "white";
}

function getCell(row, col) {
    return document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
}

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        createCell(row, col);
    }
}