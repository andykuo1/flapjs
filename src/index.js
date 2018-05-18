const canvas = document.getElementById("content");
const ctx = canvas.getContext("2d");
import Mouse from 'Mouse.js';
const mouse = new Mouse(canvas, document);

//Setup canvas
window.addEventListener('load', onWindowResize);
window.addEventListener('resize', onWindowResize);
function onWindowResize(event)
{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

//Setup render loop
window.onload = onCanvasLoad;
window.requestAnimationFrame(onAnimationFrame);
function onAnimationFrame(time)
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  onCanvasDraw(ctx, time);
  window.requestAnimationFrame(onAnimationFrame);
}

import NodalGraphController from 'NodalGraphController.js';
import { NodalGraph } from 'NodalGraph.js';
const graph = new NodalGraph();
const controller = new NodalGraphController(canvas, mouse, graph);

function onCanvasLoad()
{
  controller.load();
}

function onCanvasDraw(ctx, time)
{
  graph.draw(ctx);
  controller.draw(ctx, time);
}
