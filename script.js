
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const size = 8;
const tileSize = canvas.width / size;

let board = [];
let selected = null;
let currentPlayer = 'white';
let score = { white: 0, black: 0 };

function resetBoard() {
    board = Array(size).fill(null).map(() => Array(size).fill(null));
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if ((x + y) % 2 === 1 && y < 3) board[y][x] = { color: 'black', king: false };
            if ((x + y) % 2 === 1 && y > 4) board[y][x] = { color: 'white', king: false };
        }
    }
    selected = null;
    currentPlayer = 'white';
    updateScore();
}

function updateScore() {
    let white = 0, black = 0;
    for (let row of board)
        for (let piece of row)
            if (piece)
                piece.color === 'white' ? white++ : black++;
    document.getElementById('scoreboard').textContent = `Białe: ${white} | Czarne: ${black}`;
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? '#eee' : '#444';
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

            const piece = board[y][x];
            if (piece) {
                ctx.beginPath();
                ctx.arc(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, tileSize / 2.5, 0, Math.PI * 2);
                ctx.fillStyle = piece.color === 'white' ? '#ccc' : '#222';
                ctx.fill();

                if (piece.king) {
                    ctx.strokeStyle = piece.color === 'white' ? '#000' : '#fff';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(x * tileSize + tileSize / 2 - 8, y * tileSize + tileSize / 2);
                    ctx.lineTo(x * tileSize + tileSize / 2 + 8, y * tileSize + tileSize / 2);
                    ctx.stroke();
                }
            }

            if (selected && selected.x === x && selected.y === y) {
                ctx.strokeStyle = '#0f0';
                ctx.lineWidth = 3;
                ctx.strokeRect(x * tileSize + 2, y * tileSize + 2, tileSize - 4, tileSize - 4);
            }
        }
    }
}

function getMoves(x, y, piece) {
    const dirs = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
    const moves = [];

    for (let [dx, dy] of dirs) {
        for (let i = 1; i < (piece.king ? size : 2); i++) {
            let nx = x + dx * i;
            let ny = y + dy * i;
            if (nx < 0 || ny < 0 || nx >= size || ny >= size) break;
            if (board[ny][nx]) {
                if (board[ny][nx].color !== piece.color) {
                    let jx = nx + dx;
                    let jy = ny + dy;
                    if (jx >= 0 && jy >= 0 && jx < size && jy < size && !board[jy][jx])
                        moves.push({ x: jx, y: jy, capture: { x: nx, y: ny } });
                }
                break;
            } else if (!piece.king && i === 1) {
                moves.push({ x: nx, y: ny });
            } else if (piece.king) {
                moves.push({ x: nx, y: ny });
            }
        }
    }
    return moves;
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / tileSize);
    const y = Math.floor((e.clientY - rect.top) / tileSize);

    if (selected) {
        const piece = board[selected.y][selected.x];
        const valid = getMoves(selected.x, selected.y, piece);
        const move = valid.find(m => m.x === x && m.y === y);
        if (move) {
            if (move.capture) board[move.capture.y][move.capture.x] = null;
            board[y][x] = piece;
            board[selected.y][selected.x] = null;

            if ((piece.color === 'white' && y === 0) || (piece.color === 'black' && y === size - 1))
                piece.king = true;

            currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
            selected = null;
            updateScore();
            drawBoard();
            return;
        }
    }

    const piece = board[y][x];
    if (piece && piece.color === currentPlayer) {
        selected = { x, y };
    } else {
        selected = null;
    }
    drawBoard();
});

document.getElementById('restart').addEventListener('click', () => {
    resetBoard();
    drawBoard();
});

resetBoard();
drawBoard();
