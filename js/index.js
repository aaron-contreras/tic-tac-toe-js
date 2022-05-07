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

const player = (name, marker) => {
  return {
    name,
    marker
  };
}

const aaron = player('Aaron', 'X');
console.log(aaron.name, aaron.marker);
console.log(gameBoard.grid);
