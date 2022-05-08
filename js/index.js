console.log('Hello world🌊');

const gameBoard = (() => {
  const grid = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  return {
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
  }

  return {
    board,
    getActivePlayer,
    getNextPlayer,
    switchTurns,
  };
})(gameBoard, playerList);

// console.log(gameplayController.board);
// console.log(gameplayController.getActivePlayer());
// console.log(gameplayController.switchTurns());
// console.log(gameplayController.getActivePlayer());
