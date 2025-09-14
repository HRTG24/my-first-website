// Simple checkers game logic
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const newGameBtn = document.getElementById('new-game');

let board, currentPlayer, selectedPiece, selectedMoves, moves, gameOver;

// Initialize a new game
function init() {
  board = [
    [0,2,0,2,0,2,0,2],
    [2,0,2,0,2,0,2,0],
    [0,2,0,2,0,2,0,2],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0]
  ];
  currentPlayer = 'red';
  selectedPiece = null;
  selectedMoves = [];
  gameOver = false;
  moves = getAllMoves(currentPlayer);
  updateStatus();
  render();
}

// Render the board based on current state
function render() {
  boardEl.innerHTML = '';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const square = document.createElement('div');
      square.className = 'square ' + ((r + c) % 2 === 0 ? 'light' : 'dark');
      square.dataset.row = r;
      square.dataset.col = c;
      if (selectedPiece && selectedPiece.row === r && selectedPiece.col === c) {
        square.classList.add('selected');
      }
      if (selectedMoves.some(m => m.toRow === r && m.toCol === c)) {
        square.classList.add('move');
      }
      const piece = board[r][c];
      if (piece) {
        const pieceEl = document.createElement('div');
        pieceEl.classList.add('piece', pieceColor(piece));
        if (piece > 2) pieceEl.classList.add('king');
        square.appendChild(pieceEl);
      }
      boardEl.appendChild(square);
    }
  }
}

// Handle clicks on the board
boardEl.addEventListener('click', e => {
  if (gameOver) return;
  const square = e.target.closest('.square');
  if (!square) return;
  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);

  if (selectedMoves.length) {
    const move = selectedMoves.find(m => m.toRow === row && m.toCol === col);
    if (move) makeMove(move);
  } else {
    const piece = board[row][col];
    if (!isPlayerPiece(piece, currentPlayer)) return;
    const pieceMoves = moves.filter(m => m.fromRow === row && m.fromCol === col);
    if (!pieceMoves.length) return;
    selectedPiece = { row, col };
    selectedMoves = pieceMoves;
    render();
  }
});

// Execute a move
function makeMove(move) {
  const { fromRow, fromCol, toRow, toCol, captures } = move;
  const piece = board[fromRow][fromCol];
  board[fromRow][fromCol] = 0;
  board[toRow][toCol] = piece;
  captures.forEach(p => (board[p.row][p.col] = 0));

  // Handle kinging
  if (piece === 1 && toRow === 0) board[toRow][toCol] = 3;
  if (piece === 2 && toRow === 7) board[toRow][toCol] = 4;

  // Check for additional captures (multi-jump)
  const nextCaptures = getMovesForPiece(toRow, toCol, currentPlayer).filter(m => m.captures.length);
  if (captures.length && nextCaptures.length) {
    selectedPiece = { row: toRow, col: toCol };
    selectedMoves = nextCaptures;
    moves = nextCaptures;
    render();
    return;
  }

  // Switch player
  currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
  moves = getAllMoves(currentPlayer);
  selectedPiece = null;
  selectedMoves = [];
  render();

  if (!moves.length) {
    gameOver = true;
    updateStatus(`${capitalize(currentPlayer === 'red' ? 'Black' : 'Red')} wins!`);
  } else {
    updateStatus();
  }
}

newGameBtn.addEventListener('click', init);

// Get all legal moves for the current player
function getAllMoves(player) {
  let result = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (isPlayerPiece(board[r][c], player)) {
        result.push(...getMovesForPiece(r, c, player));
      }
    }
  }
  const captures = result.filter(m => m.captures.length);
  return captures.length ? captures : result;
}

// Get moves for a specific piece
function getMovesForPiece(r, c, player) {
  const piece = board[r][c];
  const dirs =
    piece > 2
      ? [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ]
      : player === 'red'
      ? [
          [-1, -1],
          [-1, 1],
        ]
      : [
          [1, -1],
          [1, 1],
        ];

  const moves = [];
  dirs.forEach(([dr, dc]) => {
    const nr = r + dr;
    const nc = c + dc;
    if (!inside(nr, nc)) return;
    const target = board[nr][nc];
    if (target === 0) {
      moves.push({ fromRow: r, fromCol: c, toRow: nr, toCol: nc, captures: [] });
    } else if (isOpponentPiece(target, player)) {
      const jr = r + dr * 2;
      const jc = c + dc * 2;
      if (inside(jr, jc) && board[jr][jc] === 0) {
        moves.push({
          fromRow: r,
          fromCol: c,
          toRow: jr,
          toCol: jc,
          captures: [{ row: nr, col: nc }],
        });
      }
    }
  });
  return moves;
}

function isPlayerPiece(piece, player) {
  return player === 'red' ? piece === 1 || piece === 3 : piece === 2 || piece === 4;
}
function isOpponentPiece(piece, player) {
  return player === 'red' ? piece === 2 || piece === 4 : piece === 1 || piece === 3;
}
function pieceColor(piece) {
  return piece === 1 || piece === 3 ? 'red' : 'black';
}
function inside(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function updateStatus(msg) {
  statusEl.textContent = msg || `${capitalize(currentPlayer)}'s turn`;
}

// Start the first game
init();
