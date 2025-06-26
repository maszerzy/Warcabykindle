

function logDebug(msg) {
    const log = document.getElementById("debug-message");
    log.textContent += "\n" + msg;
}


document.getElementById("debug-message").textContent = "JS załadowany: 19:58:39";

const originalSelectPiece = window.selectPiece;
window.selectPiece = function(row, col) {
    logDebug("Wybrano pionek: (" + row + "," + col + ")");
    return originalSelectPiece(row, col);
};

const originalTryMove = window.tryMove;
window.tryMove = function(row, col) {
    logDebug("Próba ruchu na: (" + row + "," + col + ")");
    return originalTryMove(row, col);
};

const originalSwitchPlayer = window.switchPlayer;
window.switchPlayer = function() {
    logDebug("SWITCH GRACZA!");
    return originalSwitchPlayer();
};

const originalMustContinueCapture = window.mustContinueCapture;
window.mustContinueCapture = function(piece) {
    const result = originalMustContinueCapture(piece);
    logDebug("mustContinueCapture: " + result);
    return result;
};
