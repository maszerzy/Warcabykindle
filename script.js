var board = document.getElementById("board");
var rows = 8, cols = 8;
var selectedPiece = null;
var currentPlayer = "white";

function createCell(row, col) {
    var cell = document.createElement("div");
    cell.className = "cell";
    cell.setAttribute("data-row", row);
    cell.setAttribute("data-col", col);
    var isBlack = (row + col) % 2 === 1;
    cell.className += isBlack ? " black" : " white";

    if (isBlack && row < 3) {
        var piece = document.createElement("div");
        piece.className = "piece black-piece";
        cell.appendChild(piece);
    } else if (isBlack && row > 4) {
        var piece = document.createElement("div");
        piece.className = "piece white-piece";
        cell.appendChild(piece);
    }

    cell.onclick = function() {
        onCellClick(cell);
    };
    board.appendChild(cell);
}

function onCellClick(cell) {
    var piece = cell.getElementsByClassName("piece")[0];
    if (selectedPiece) {
        if (!piece && isValidMove(selectedPiece.parentNode, cell)) {
            movePiece(selectedPiece.parentNode, cell);
            selectedPiece = null;
        } else {
            selectedPiece.className = selectedPiece.className.replace(" selected", "");
            selectedPiece = null;
        }
    } else if (piece && piece.className.indexOf(currentPlayer + "-piece") !== -1) {
        selectedPiece = piece;
        piece.className += " selected";
    }
}

function isValidMove(fromCell, toCell) {
    var fromRow = parseInt(fromCell.getAttribute("data-row"));
    var fromCol = parseInt(fromCell.getAttribute("data-col"));
    var toRow = parseInt(toCell.getAttribute("data-row"));
    var toCol = parseInt(toCell.getAttribute("data-col"));
    var piece = fromCell.getElementsByClassName("piece")[0];

    var direction = piece.className.indexOf("white-piece") !== -1 ? -1 : 1;

    if (Math.abs(toCol - fromCol) === 1 && toRow - fromRow === direction) {
        return true;
    }

    if (Math.abs(toCol - fromCol) === 2 && toRow - fromRow === 2 * direction) {
        var midRow = (fromRow + toRow) / 2;
        var midCol = (fromCol + toCol) / 2;
        var midCell = getCell(midRow, midCol);
        if (!midCell) return false;
        var midPiece = midCell.getElementsByClassName("piece")[0];
        if (midPiece && midPiece.className.indexOf(currentPlayer + "-piece") === -1) {
            midCell.removeChild(midPiece);
            return true;
        }
    }
    return false;
}

function movePiece(fromCell, toCell) {
    var piece = fromCell.getElementsByClassName("piece")[0];
    fromCell.removeChild(piece);
    toCell.appendChild(piece);
    piece.className = piece.className.replace(" selected", "");
    currentPlayer = currentPlayer === "white" ? "black" : "white";
}

function getCell(row, col) {
    return document.querySelector(".cell[data-row='" + row + "'][data-col='" + col + "']");
}

for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
        createCell(row, col);
    }
}