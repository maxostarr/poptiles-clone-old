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
const NEIGHBOR_OFFSETS = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
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
    Number(row < 3 && (Math.random() * (COLOR_MAP.length - 1) + 1) | 0),
  ),
);

ctx.fillStyle = BACKGROUND_COLOR;
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.font = "30px Arial";

draw();

canvas.addEventListener("click", (e) => {
  const x = Math.floor(e.offsetX / TILE_SIZE);
  const y = Math.floor((HEIGHT - e.offsetY) / TILE_SIZE);
  if (board[y][x] === 0) return;
  removeTile(y, x);
  updatePositions();
  draw();
});

function removeTile(y: number, x: number) {
  const tileQueue = [getTileHash(y, x)];
  const tilesToRemove = [getTileHash(y, x)];
  while (tileQueue.length > 0) {
    const [tileY, tileX] = getCoordsFromHash(tileQueue.pop()!);
    if (board[tileY][tileX] === 0) continue;
    for (const offset of NEIGHBOR_OFFSETS) {
      const [neighborY, neighborX] = [tileY + offset[0], tileX + offset[1]];

      if (neighborX < 0 || neighborY < 0 || board[neighborY][neighborX] === 0)
        continue;

      if (
        board[neighborY][neighborX] === board[y][x] &&
        !tilesToRemove.includes(getTileHash(neighborY, neighborX))
      ) {
        tilesToRemove.push(getTileHash(neighborY, neighborX));
        tileQueue.push(getTileHash(neighborY, neighborX));
      }
    }
  }

  tilesToRemove.forEach((hash) => {
    const [y, x] = getCoordsFromHash(hash);
    board[y][x] = 0;
  });
}

function updatePositions() {
  for (let y = board.length - 1; y >= 0; y--) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] !== 0) continue;
      for (let yAbove = y + 1; yAbove < board.length; yAbove++) {
        // if (board[yAbove][x] === 0) break;
        board[yAbove - 1][x] = board[yAbove][x];
      }
    }
  }
}

function draw() {
  for (let y = board.length - 1; y >= 0; y--) {
    for (let x = 0; x < board[y].length; x++) {
      ctx.fillStyle = COLOR_MAP[board[y][x]];
      ctx.fillRect(
        x * TILE_SIZE,
        HEIGHT - (y + 1) * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
      );
      ctx.fillStyle = "black";
      ctx?.fillText(
        `${x},${y}`,
        x * TILE_SIZE + TILE_SIZE / 2,
        HEIGHT - (y + 1) * TILE_SIZE + TILE_SIZE / 2,
        TILE_SIZE,
      );
    }
  }
}

function getTileHash(y: number, x: number) {
  return `${y}-${x}`;
}

function getCoordsFromHash(hash: string) {
  const [y, x] = hash.split("-").map((str) => Number(str));
  return [y, x];
}
