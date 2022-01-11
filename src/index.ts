const WIDTH = 700;
const HEIGHT = WIDTH * 1.5;

const canvas = document.getElementById("mainGame") as HTMLCanvasElement;
canvas.width = WIDTH;
canvas.height = HEIGHT;

const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Could not get context");
}
ctx.fillStyle = "green";
ctx.fillRect(0, 0, canvas.width, canvas.height);
