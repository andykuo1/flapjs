import Mouse from 'util/Mouse.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
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

//Setup application
import NodalGraphRenderer from 'NodalGraphRenderer.js';
import GraphParser from 'parser/GraphParser.js';

import MainCursorController from 'controller/cursor/MainCursorController.js';
import MainButtonController from 'controller/button/MainButtonController.js';

import { NodalGraph } from 'NodalGraph.js';

const graph = new NodalGraph(canvas);
const parser = new GraphParser(graph);
const cursorController = new MainCursorController(graph, mouse);
const buttonController = new MainButtonController(canvas, graph, cursorController);

function onCanvasLoad()
{
  //DEBUG: For testing...
  let node = null;
  let node2 = null;
  let edge = null;

  node = graph.createNewNode(-64, 0, "q0");
  node2 = graph.createNewNode(64, 0, "q1");
  edge = graph.createNewEdge(node, node2, "abc 0");
  //END OF DEBUG CODE

  cursorController.load();
  buttonController.load();
}

let avgFramesPerSecond = 60;
let prevTime = 0;
function onCanvasDraw(ctx, time)
{
  const dt = (time - prevTime) / avgFramesPerSecond;

  graph.update(dt);
  cursorController.update(dt);
  buttonController.update(dt);
  parser.parse(graph);

  NodalGraphRenderer.render(ctx, dt, graph);
  cursorController.draw(ctx);

  prevTime = time;
}
