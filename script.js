
var board = document.getElementById("board");
var info = document.getElementById("info");
var score = document.getElementById("score");
var currentPlayer = "red";
var selected = null;
var pieces = [];
var points = { red: 0, black: 0 };

function createSquare(x, y) {
  var sq = document.createElement("div");
  sq.className = "square " + (((x + y) % 2 === 0) ? "light" : "dark");
  sq.setAttribute("data-x", x);
  sq.setAttribute("data-y", y);
  sq.onclick = handleClick;
  board.appendChild(sq);
}

function createPiece(x, y, color) {
  var sq = getSquare(x, y);
  var p = document.createElement("div");
  p.className = "piece " + color;
  p.setAttribute("data-color", color);
  p.setAttribute("data-king", "false");
  sq.appendChild(p);
  pieces.push({ x: x, y: y, color: color, king: false, el: p });
}

function getSquare(x, y) {
  return document.querySelector('.square[data-x="' + x + '"][data-y="' + y + '"]');
}

function getPiece(x, y) {
  for (var i = 0; i < pieces.length; i++) {
    if (pieces[i].x == x && pieces[i].y == y) return pieces[i];
  }
  return null;
}

function removePiece(p) {
  p.el.parentNode.removeChild(p.el);
  var i = pieces.indexOf(p);
  if (i !== -1) pieces.splice(i, 1);
  points[currentPlayer]++;
  updateScore();
}

function movePiece(p, x, y) {
  p.x = x;
  p.y = y;
  getSquare(x, y).appendChild(p.el);
  if ((p.color === "red" && y === 0) || (p.color === "black" && y === 7)) {
    p.king = true;
    p.el.className += " king";
  }
}

function updateInfo(txt) {
  info.innerHTML = txt || "Tura gracza: " + (currentPlayer === "red" ? "Czerwony" : "Czarny");
}

function updateScore() {
  score.innerHTML = "Czerwony: " + points.red + " | Czarny: " + points.black;
}

function getMoves(p) {
  var dirs = p.king ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] :
    (p.color === "red" ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]]);
  var list = [];

  for (var i = 0; i < dirs.length; i++) {
    var dx = dirs[i][1], dy = dirs[i][0];
    var nx = p.x + dx, ny = p.y + dy;

    while (nx >= 0 && nx <= 7 && ny >= 0 && ny <= 7) {
      var mid = getPiece(nx, ny);
      if (!mid) {
        list.push({ x: nx, y: ny, capture: null });
      } else {
        if (mid.color !== p.color) {
          var jx = nx + dx, jy = ny + dy;
          if (jx >= 0 && jx <= 7 && jy >= 0 && jy <= 7 && !getPiece(jx, jy)) {
            list.push({ x: jx, y: jy, capture: mid });
          }
        }
        break;
      }
      if (!p.king) break;
      nx += dx;
      ny += dy;
    }
  }
  return list;
}

function handleClick(e) {
  var x = parseInt(this.getAttribute("data-x"));
  var y = parseInt(this.getAttribute("data-y"));
  var clicked = getPiece(x, y);

  if (clicked && clicked.color === currentPlayer) {
    if (selected) selected.el.classList.remove("selected");
    selected = clicked;
    selected.el.classList.add("selected");
  } else if (selected) {
    var moves = getMoves(selected);
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].x == x && moves[i].y == y) {
        if (moves[i].capture) removePiece(moves[i].capture);
        movePiece(selected, x, y);
        selected.el.classList.remove("selected");
        selected = null;
        currentPlayer = currentPlayer === "red" ? "black" : "red";
        updateInfo();
        return;
      }
    }
  }
}

function init() {
  board.innerHTML = "";
  pieces = [];
  for (var y = 0; y < 8; y++) {
    for (var x = 0; x < 8; x++) {
      createSquare(x, y);
      if ((x + y) % 2 === 1) {
        if (y < 3) createPiece(x, y, "black");
        else if (y > 4) createPiece(x, y, "red");
      }
    }
  }
  updateInfo();
  updateScore();
}

init();
