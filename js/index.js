console.log('Hello world🌊');

const gameBoard = (() => {
  const grid = [
    'A', 'T', '',
    '',  '',  '',
    '',  '',  '',
  ];

  const addMarkerAt = function(marker, cellIndex) {
    grid[cellIndex] = marker;
  };

  return {
    placeMarkerAt: addMarkerAt,
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

  const playTurn = function(cellIndex) {
    const marker = activePlayer.marker;

    board.placeMarkerAt(marker, cellIndex);
  };

  return {
    board,
    getActivePlayer,
    getNextPlayer,
    switchTurns,
    playTurn,
  };
})(gameBoard, playerList);

/*
  Takes in a one-dimensional list of markers on each gameboard grid cell.

  e.g.
  ['X', 'O', '', '', '', '', '', 'X', 'O']
    0    1   2   3   4   5   6    7    8

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

  return {
    render
  };
};

const cc = displayController(gameBoard.grid);
cc.render();

// console.log(gameplayController.board);
// console.log(gameplayController.getActivePlayer());
// console.log(gameplayController.switchTurns());
// console.log(gameplayController.getActivePlayer());
