console.log('Hello world🌊');

const gameBoard = (() => {
  const emptyCell = ' ';

  const grid = [
    emptyCell, emptyCell, emptyCell,
    emptyCell, emptyCell, emptyCell,
    emptyCell, emptyCell, emptyCell,
  ];

  const placeMarkerAt = function(marker, cellIndex) {
    grid[cellIndex] = marker;
  };

  const isCellTaken = function(cellIndex) {
    return grid[cellIndex] !== emptyCell;
  };

  const markerAt = function(cellIndex) {
    return grid[cellIndex];
  };

  const isFull = function() {
    return !grid.some(cell => {
      return cell === emptyCell;
    });
  }

  return {
    markerAt,
    placeMarkerAt,
    isCellTaken,
    grid
  };
})();

const createPlayer = function(name, marker) {
  return {
    name,
    marker
  };
};

const playerOne = createPlayer('Aaron', 'A');
const playerTwo = createPlayer('Thamara', 'T');

const playerList = [playerOne, playerTwo];

const gameplayController = (function(board, players) {

  // Player one starts off the game
  let activePlayer = players[0]; 

  const getActivePlayer = function() {
    return activePlayer;
  };

  const getNextPlayer = () => {
    if (activePlayer === players[0]) {
      return players[1];
    }

    return players[0];
  };

  const switchTurns = function() {
    activePlayer = getNextPlayer();
  };

  const winningCellCombinations = [
    // Horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Diagonal
    [0, 4, 8],
    [2, 4, 6]
  ];

  const isTie = function() {
    return board.isFull();
  };

  const isWin = function() {
    return winningCellCombinations.some(comboIndexes => {
      return comboIndexes.every(index => {
        return board.markerAt(index) === activePlayer.marker;
      });
    });
  };

  const isGameOver = function() {
    if (isTie() || isWin()) return true;

    return false;
  };

  const playTurn = function(cellIndex) {
    // Don't allow playing a turn on a cell that's already been played on.
    if (board.isCellTaken(cellIndex)) return;

    const marker = activePlayer.marker;
    board.placeMarkerAt(marker, cellIndex);
    console.log(
      isGameOver()
    );
    switchTurns();
  };

  return {
    board,
    getActivePlayer,
    getNextPlayer,
    playTurn,
  };
})(gameBoard, playerList);

/*
  Takes in a one-dimensional list of markers on each gameboard grid cell.

  e.g.
  ['X', 'O', ' ', ' ', ' ', ' ', ' ', 'X', 'O']
    0    1    2    3    4    5    6    7    8

  is equivalent to...

    X | O |
  -------------
      |   |
  -------------
      | X | O
*/
const displayController = function(gameBoard) {
  const render = function() {
    const rootContainer = document.querySelector('#game-board');
    const cells = [...rootContainer.children];

    cells.forEach((cell, index) => {
      cell.textContent = gameBoard[index];
    })
  };

  const markCellAsPlayed = function(cellIndex) {
    const rootContainer = document.querySelector('#game-board');
    const cells = [...rootContainer.children];
    
    cells[cellIndex].setAttribute('disabled', true);
  };

  const playTurn = function(cellIndex) {
    gameplayController.playTurn(cellIndex);
    render();
    markCellAsPlayed(cellIndex);
  }

  // IIFE to generate event listeners only once at time of initial load.
  const tieCellsToClickActions = (function() {
    const rootContainer = document.querySelector('#game-board');
    const cells = [...rootContainer.children];

    cells.forEach((cell, index) => {
      cell.addEventListener('click', playTurn.bind(this, index));
    });
  })();

  return {
    render
  };
};

const cc = displayController(gameplayController.board.grid);
cc.render();

// console.log(gameplayController.board);
// console.log(gameplayController.getActivePlayer());
// console.log(gameplayController.switchTurns());
// console.log(gameplayController.getActivePlayer());
