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
import { NodalGraph } from 'NodalGraph.js';
import GraphController from 'controller/GraphController.js';
import CanvasRenderer from 'renderer/CanvasRenderer.js';

const graph = new NodalGraph(canvas);
const controller = new GraphController(canvas, graph, mouse);

const canvasRenderer = new CanvasRenderer(ctx, canvas, graph, controller);

function onCanvasLoad()
{
  //DEBUG: For testing...
  let node = null;
  let node2 = null;
  let edge = null;

  node = graph.createNewNode(-64, 0, "q0");
  node2 = graph.createNewNode(64, 0, "q1");
  node2.accept = true;
  edge = graph.createNewEdge(node, node2, "0 1");
  //END OF DEBUG CODE

  controller.initialize();
}

let avgFramesPerSecond = 60;
let prevTime = 0;
function onCanvasDraw(ctx, time)
{
  const dt = (time - prevTime) / avgFramesPerSecond;

  graph.update(dt);
  controller.update(dt);

  canvasRenderer.render(ctx);

  prevTime = time;
}
