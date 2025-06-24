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

    const direction = piece.classList.contains("white-piece") ? -1 : 1;

    // Normalny ruch o jedno pole
    if (Math.abs(toCol - fromCol) === 1 && toRow - fromRow === direction) {
        return true;
    }

    // Bicie
    if (Math.abs(toCol - fromCol) === 2 && toRow - fromRow === 2 * direction) {
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;
        const midCell = getCell(midRow, midCol);
        const midPiece = midCell?.querySelector(".piece");
        if (midPiece && !midPiece.classList.contains(currentPlayer + "-piece")) {
            midCell.removeChild(midPiece);
            return true;
        }
    }
    return false;
}

function movePiece(fromCell, toCell) {
    const piece = fromCell.querySelector(".piece");
    fromCell.removeChild(piece);
    toCell.appendChild(piece);
    piece.classList.remove("selected");
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