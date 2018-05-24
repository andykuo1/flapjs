const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
import Mouse from 'Mouse.js';
const mouse = new Mouse(canvas, canvas);

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
import NodalGraphRenderer from 'NodalGraphRenderer.js';
import { NodalGraph } from 'NodalGraph.js';
const graph = new NodalGraph(canvas);
const controller = new NodalGraphController(canvas, mouse, graph);
const renderer = new NodalGraphRenderer(graph);

function onCanvasLoad()
{
  let node = null;
  let node2 = null;
  let edge = null;

  node = graph.createNewNode();
  node.x = -64;
  node.y = 0;
  node.label = "q0";
  node2 = graph.createNewNode();
  node2.x = 64;
  node2.y = 0;
  node2.label = "q1";
  edge = graph.createNewEdge(node, node2);
  edge.label = "abc";

  controller.load();
}

let avgFramesPerSecond = 60;
let prevTime = 0;
function onCanvasDraw(ctx, time)
{
  const dt = (time - prevTime) / avgFramesPerSecond;
  graph.update(dt);
  renderer.render(ctx, dt);
  controller.draw(ctx, dt, renderer);
  prevTime = time;
}
