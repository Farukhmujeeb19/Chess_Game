console.log("JS Loaded");
const board = document.getElementById("board");
const game = new Chess(); // chess.js engine

let selectedSquare = null;

// Unicode pieces
const pieceMap = {
    wp: "♙", wr: "♖", wn: "♘", wb: "♗", wq: "♕", wk: "♔",
    bp: "♟", br: "♜", bn: "♞", bb: "♝", bq: "♛", bk: "♚"
};

// Draw board
function drawBoard() {
    board.innerHTML = "";

    const state = game.board();

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {

            const cell = document.createElement("div");
            cell.classList.add("cell");

            // color
            if ((row + col) % 2 === 0) {
                cell.classList.add("white");
            } else {
                cell.classList.add("black");
            }

            const square = String.fromCharCode(97 + col) + (8 - row);
            cell.dataset.square = square;

            const piece = state[row][col];
            if (piece) {
                const key = piece.color + piece.type; // e.g. "wp", "bk"
                cell.innerHTML = `<span>${pieceMap[key]}</span>`;
            }

            cell.addEventListener("click", handleClick);
            board.appendChild(cell);
        }
    }

    updateTurn();
}

// Handle click
function handleClick(e) {
    const square = e.currentTarget.dataset.square;

    if (!selectedSquare) {
        selectedSquare = square;
        highlightMoves(square);
    } else {
        const move = game.move({
            from: selectedSquare,
            to: square,
            promotion: "q" // auto queen
        });

        selectedSquare = null;
        clearHighlights();

        if (move === null) return; // illegal move

        drawBoard();

        // Check game state
        if (game.in_checkmate()) {
            setTimeout(() => alert("Checkmate! Game Over"), 100);
        } else if (game.in_check()) {
            setTimeout(() => alert("Check!"), 100);
        }
    }
}

// Highlight legal moves
function highlightMoves(square) {
    clearHighlights();

    const moves = game.moves({
        square: square,
        verbose: true
    });

    moves.forEach(move => {
        const cell = document.querySelector(`[data-square='${move.to}']`);
        if (cell) cell.classList.add("highlight");
    });

    document.querySelector(`[data-square='${square}']`).classList.add("selected");
}

// Clear highlights
function clearHighlights() {
    document.querySelectorAll(".cell").forEach(c => {
        c.classList.remove("highlight", "selected");
    });
}

// Update turn UI
function updateTurn() {
    const turn = game.turn() === "w" ? "White" : "Black";
    document.getElementById("turn").innerText = turn + "'s Turn";
}

// Init
drawBoard();