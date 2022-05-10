console.log('Hello world🌊');

const gameBoard = (() => {
  const _emptyCell = ' ';
  /*
    Holds a one-dimensional list of markers on each gameboard grid cell.

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
  const _grid = [
    _emptyCell, _emptyCell, _emptyCell,
    _emptyCell, _emptyCell, _emptyCell,
    _emptyCell, _emptyCell, _emptyCell,
  ];

  const placeMarkerAt = function(marker, cellIndex) {
    _grid[cellIndex] = marker;
  };

  const isCellTaken = function(cellIndex) {
    return _grid[cellIndex] !== _emptyCell;
  };

  const markerAt = function(cellIndex) {
    return _grid[cellIndex];
  };

  const isFull = function() {
    return !_grid.some(cell => {
      return cell === _emptyCell;
    });
  };

  const clear = function() {
    _grid.forEach((_cell, cellIndex) => {
      _grid[cellIndex] = _emptyCell;
    });
  };

  return {
    markerAt,
    placeMarkerAt,
    isCellTaken,
    isFull,
    clear
  };
})();

const createPlayer = function(name, marker) {
  return {
    name,
    marker
  };
};

const gameplayController = function(board, players) {

  // Player one starts off the game
  let activePlayer = players[0]; 

  const _winningCellCombinations = [
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

  const _gameStates = {
    ready: 'ready',
    playing: 'playing',
    tie: 'tie',
    win: 'win'
  };

  let gameStatus = _gameStates['playing'];

  const getActivePlayer = function() {
    return activePlayer;
  };

  const _getNextPlayer = () => {
    if (activePlayer === players[0]) {
      return players[1];
    }

    return players[0];
  };

  const _switchTurns = function() {
    activePlayer = _getNextPlayer();
  };

  const isTie = function() {
    return board.isFull();
  };

  const isWin = function() {
    return _winningCellCombinations.some(comboIndexes => {
      return comboIndexes.every(index => {
        return board.markerAt(index) === activePlayer.marker;
      });
    });
  };

  const isGameOver = function() {
    if (isTie() || isWin()) return true;

    return false;
  };

  const getGameStatus = function() {
    return gameStatus;
  }

  const isGameStatePlaying = function() {
    return gameStatus === _gameStates['playing'];
  };

  const _updateGameStatus = function() {
    if (isTie()) {
      gameStatus = _gameStates['tie'];
      return;
    }

    gameStatus = _gameStates['win'];
  }

  const playTurn = function(cellIndex) {
    // Don't allow playing a turn on a cell that's already been played on.
    if (board.isCellTaken(cellIndex)) return;

    const marker = activePlayer.marker;
    board.placeMarkerAt(marker, cellIndex);

    // Set the game over state to gameStatus and ends the turn playing.
    if (isGameOver()) {
      _updateGameStatus();
      return;
    }

    _switchTurns();
  };

  const reset = function() {
    gameStatus = _gameStates['ready'];
    board.clear();
  }

  return {
    board,
    getGameStatus,
    isGameStatePlaying,
    isWin,
    getActivePlayer,
    playTurn,
    reset
  };
};

const displayController = (function() {
  let _activeGame;

  const _getCells = function() {
    const rootContainer = document.querySelector('#game-board');
    return [...rootContainer.children];
  };

  const _getGameBoard = function() {
    return _activeGame.board;
  };

  const render = function() {
    const cells = _getCells();

    cells.forEach((cell, cellIndex) => {
      cell.textContent = _getGameBoard().markerAt(cellIndex);
    });

    _updateGameStatus();
    _displayWinStatus();
    _disableBoard();
  };

  const _displayWinStatus = function() {
    if (_activeGame.isWin()) {
      const winnerElement = document.querySelector('#winner');

      winnerElement.textContent = _activeGame.getActivePlayer().name;
    }
  };

  const _getPlayerNames = function() {
    const playerOneName = document.querySelector('#player-one-name').value;
    const playerTwoName = document.querySelector('#player-two-name').value;

    return [playerOneName, playerTwoName];
  }

  const _getPlayerList = function() {
    const playerNames = _getPlayerNames();
    const playerOne = createPlayer(playerNames[0], 'X');
    const playerTwo = createPlayer(playerNames[1], 'O');

    return [playerOne, playerTwo];
  }

  const _resetCellStates = function() {
    const cells = _getCells(); 
    
    cells.forEach(cell => {
      cell.removeAttribute('disabled');
    });
  };

  const _toggleStartButtonText = function() {
    const startButton = document.querySelector('#start-game');
    startButton.textContent = 'Restart';
  };

  const _startGame = function() {
    _toggleStartButtonText();
    // Get new player list
    const playerList = _getPlayerList();

    // Create a new game
    _activeGame = gameplayController(gameBoard, playerList);

    // Clear out board
    _getGameBoard().clear();
    _resetCellStates();

    render();
  };

  const _markCellAsPlayed = function(cellIndex) {
    const cells = _getCells(); 
    
    cells[cellIndex].setAttribute('disabled', true);
  };

  const _updateGameStatus = function() {
    const gameStatusElement = document.querySelector('#game-status');
    gameStatusElement.textContent = _activeGame.getGameStatus();
  };

  const _disableBoard = function() {
    if (_activeGame.isGameStatePlaying()) return;

    const cells = _getCells(); 

    cells.forEach((cell, cellIndex) => _markCellAsPlayed(cellIndex));
  };

  const _playTurn = function(cellIndex) {
    _activeGame.playTurn(cellIndex);
    _markCellAsPlayed(cellIndex);
    render();
  };

  // IIFE to generate event listeners only once at time of initial load.
  const _tieCellsToClickActions = (function() {
    const cells = _getCells(); 

    cells.forEach((cell, index) => {
      cell.addEventListener('click', _playTurn.bind(this, index));
    });
  })();

  const _tieStartButtonToGameplay = (function() {
    const startButton = document.querySelector('#start-game');

    startButton.addEventListener('click', _startGame);
  })();

  return {
    render
  };
})();

// const cc = displayController();
// cc.render();

// console.log(gameplayController.board);
// console.log(gameplayController.getActivePlayer());
// console.log(gameplayController.switchTurns());
// console.log(gameplayController.getActivePlayer());
