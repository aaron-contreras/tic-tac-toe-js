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

console.log(gameBoard.grid);
