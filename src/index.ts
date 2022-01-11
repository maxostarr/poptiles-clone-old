const WIDTH = 700;
const HEIGHT = WIDTH * 1.5;
const TILE_SIZE = 100;
const BACKGROUND_COLOR = "#eee";
const COLOR_MAP = [
  BACKGROUND_COLOR,
  "#ff0000",
  "#ff8000",
  "#ffff00",
  "#80ff00",
  "#00ff00",
  "#00ff80",
];

const canvas = document.getElementById("mainGame") as HTMLCanvasElement;
canvas.width = WIDTH;
canvas.height = HEIGHT;

const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Could not get context");
}

const board = Array.from({ length: HEIGHT / TILE_SIZE }, (_, row) =>
  Array.from({ length: WIDTH / TILE_SIZE }, () =>
    Number(row < 3 && (Math.random() * 6 + 1) | 0),
  ),
);
console.log("🚀 ~ file: index.ts ~ line 24 ~ board", board);

ctx.fillStyle = BACKGROUND_COLOR;
ctx.fillRect(0, 0, canvas.width, canvas.height);

for (let y = 0; y < board.length; y++) {
  for (let x = 0; x < board[y].length; x++) {
    ctx.fillStyle = COLOR_MAP[board[y][x]];
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
}
