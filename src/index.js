import Mouse from 'util/Mouse.js';
import * as Config from 'config.js';

const viewport = document.getElementById("canvas");
const mouse = new Mouse(viewport, document);//Or viewport
const fps = 60.0;

//Setup viewport
window.addEventListener('load', (event) => {
  //For canvas only...
  viewport.width = window.innerWidth;
  viewport.height = window.innerHeight;

  loadApplication();
  window.requestAnimationFrame(updateApplication);
});

//For canvas only...
window.addEventListener('resize', (event) => {
  viewport.width = window.innerWidth;
  viewport.height = window.innerHeight;
});

//Setup application
import { NodalGraph } from 'NodalGraph.js';
import GraphController from 'controller/GraphController.js';
import CanvasRenderer from 'renderer/CanvasRenderer.js';

const graph = new NodalGraph(viewport);//Or viewport
const controller = new GraphController(viewport, graph, mouse);//Or viewport

const canvasRenderer = new CanvasRenderer(viewport, graph, controller);

function loadApplication()
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

let prevtime = 0;
function updateApplication(time)
{
  const dt = (time - prevtime) / fps;
  {
    graph.update(dt);
    controller.update(dt);
    canvasRenderer.render();
  }
  prevtime = time;
  window.requestAnimationFrame(updateApplication);
}
