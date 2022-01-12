const WIDTH = 700;
const HEIGHT = WIDTH * 1.5;
const TILE_SIZE = 100;
const BACKGROUND_COLOR = "#eee";
const COLOR_MAP = [
  BACKGROUND_COLOR,
  "#87FFE5",
  "#F3D2FC",
  "#70BA5B",
  "#B559CF",
  "#C42145",
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
    Number(row < 6 && (Math.random() * (COLOR_MAP.length - 1) + 1) | 0),
  ),
);

ctx.fillStyle = BACKGROUND_COLOR;
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.font = "30px Arial";

draw();

canvas.addEventListener("click", async (e) => {
  const x = Math.floor(e.offsetX / TILE_SIZE);
  const y = Math.floor((HEIGHT - e.offsetY) / TILE_SIZE);
  if (board[y][x] === 0) return;
  removeTileGroupAround(y, x);
  updatePositions();
  draw();
  highlightTiles(await getThreesToRemove());
  await delay(1000);
  await removeThrees();
  updatePositions();
  draw();
});

async function getThreesToRemove() {
  let tilesToRemove: string[] = [];
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] === 0) continue;
      let offset1 = NEIGHBOR_OFFSETS[0];
      let offset2 = NEIGHBOR_OFFSETS[3];
      let [neighbor1Y, neighbor1X] = [y + offset1[0], x + offset1[1]];
      let [neighbor2Y, neighbor2X] = [y + offset2[0], x + offset2[1]];

      if (
        neighbor1X < 0 ||
        neighbor1Y < 0 ||
        neighbor2Y < 0 ||
        neighbor2Y < 0 ||
        board[neighbor1Y][neighbor1X] === 0 ||
        board[neighbor2Y][neighbor2X] === 0
      )
        continue;
      // highlightTiles([
      //   getTileHash(y, x),
      //   getTileHash(neighbor1Y, neighbor1X),
      //   getTileHash(neighbor2Y, neighbor2X),
      // ]);
      // console.log(
      //   `${y},${x}: neighbor1: ${neighbor1Y},${neighbor1X}: neighbor2: ${neighbor2Y},${neighbor2X}`,
      // );
      // await delay(1000);
      // draw();
      if (
        board[neighbor1Y][neighbor1X] === board[y][x] &&
        board[neighbor2Y][neighbor2X] === board[y][x]
      ) {
        tilesToRemove = [...tilesToRemove, ...getTilesToRemoveAround(y, x)];
      }

      offset1 = NEIGHBOR_OFFSETS[1];
      offset2 = NEIGHBOR_OFFSETS[2];
      [neighbor1Y, neighbor1X] = [y + offset1[0], x + offset1[1]];
      [neighbor2Y, neighbor2X] = [y + offset2[0], x + offset2[1]];

      highlightTiles([
        getTileHash(y, x),
        getTileHash(neighbor1Y, neighbor1X),
        getTileHash(neighbor2Y, neighbor2X),
      ]);
      console.log(
        `${y},${x}: neighbor1: ${neighbor1Y},${neighbor1X}: neighbor2: ${neighbor2Y},${neighbor2X}`,
      );
      await delay(1000);
      draw();
      if (
        neighbor1X < 0 ||
        neighbor1Y < 0 ||
        neighbor2Y < 0 ||
        neighbor2Y < 0 ||
        board[neighbor1Y][neighbor1X] === 0 ||
        board[neighbor2Y][neighbor2X] === 0
      )
        continue;
      if (
        board[neighbor1Y][neighbor1X] === board[y][x] &&
        board[neighbor2Y][neighbor2X] === board[y][x]
      ) {
        tilesToRemove = [...tilesToRemove, ...getTilesToRemoveAround(y, x)];
      }
    }
  }
  return tilesToRemove;
}

async function removeThrees() {
  removeTiles(await getThreesToRemove());
}

function removeTileGroupAround(y: number, x: number) {
  removeTiles(getTilesToRemoveAround(y, x));
}

function removeTiles(tileHashes: string[]) {
  tileHashes.forEach((hash) => {
    const [y, x] = getCoordsFromHash(hash);
    board[y][x] = 0;
  });
}

function getTilesToRemoveAround(y: number, x: number) {
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
  return tilesToRemove;
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
  if (!ctx) return;
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
      ctx.fillText(
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

function highlightTiles(tiles: string[]) {
  if (!ctx) return;
  tiles.forEach((hash) => {
    const [y, x] = getCoordsFromHash(hash);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeRect(
      x * TILE_SIZE,
      HEIGHT - (y + 1) * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE,
    );
  });
}

function delay(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
