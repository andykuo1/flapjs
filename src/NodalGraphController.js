import { Edge } from 'NodalGraph.js';
import NodalGraphRenderer from 'NodalGraphRenderer.js';
import NodalGraphSorter from 'NodalGraphSorter.js';
import MoveController from 'MoveController.js';
import LabelController from 'LabelController.js';
import HoverController from 'HoverController.js';
import GraphCursor from 'GraphCursor.js';

class NodalGraphController
{
  constructor(canvas, mouse, graph)
  {
    this.canvas = canvas;
    this.mouse = mouse;
    this.graph = graph;

    this.cursor = new GraphCursor(graph, mouse);
    this.moveController = new MoveController(graph, this.cursor);
    this.labelController = new LabelController(graph);
    this.hoverController = new HoverController(graph, this.cursor);

    this.moveMode = false;
    this.proxyEdge = new Edge(null, null, "");

    this.prevMouse = { x: 0, y: 0 };
  }

  load()
  {
    this.mouse.on('mousedown', (mouse, button) => {
      this.moveMode = (button == 3);
      this.markTarget(mouse.x, mouse.y);
      this.prevMouse.x = mouse.x;
      this.prevMouse.y = mouse.y;
    });
    this.mouse.on('mouseup', (mouse, button) => {
      this.moveMode = (button == 3);
      this.releaseTarget(mouse.x, mouse.y);
      this.prevMouse.x = mouse.x;
      this.prevMouse.y = mouse.y;
    });

    //Setup buttons
    const buttonNewState = document.getElementById("new_state");
    buttonNewState.addEventListener('click', (event) => {
      //Create new state
      this.createNewState();
    });
    const buttonClearGraph = document.getElementById("clear_graph");
    buttonClearGraph.addEventListener('click', (event) => {
      //Clear graph
      this.graph.clear();
    });
    const buttonSimulatePhysics = document.getElementById("simulate_physics");
    buttonSimulatePhysics.addEventListener('click', (event) => {
      //Begin to simulate physics for graph...
      NodalGraphSorter.sort();
    });
    const buttonExportImage = document.getElementById("export_image");
    buttonExportImage.addEventListener('click', (event) => {
      //Export canvas to png image
      const dataURL = this.canvas.toDataURL("image/png");
      download(dataURL, EXPORT_FILE_NAME, "image/png");
    });
  }

  draw(ctx, dt)
  {
    const mx = this.mouse.x;
    const my = this.mouse.y;

    //Get hovered states
    this.cursor.targetDestination = this.cursor.getNodeAt(mx, my);

    //If clicked on state...
    if (this.cursor.targetMode == "state")
    {
      //Start creating edges if cursor leaves state...
      if (this.cursor.targetSource != this.cursor.targetDestination)
      {
        this.cursor.targetMode = "create-edge";
        this.proxyEdge.from = this.cursor.targetSource;
      }
    }

    //If is creating edges and NOT toggling accept state...
    if (this.cursor.targetMode == "create-edge")
    {
      this.moveController.resolveEdge(mx, my, this.proxyEdge);

      //Draw the proxy edge
      NodalGraphRenderer.drawEdges(ctx, this.proxyEdge);
    }

    //Update the moving target if dragging object...
    if (this.cursor.targetMode && this.cursor.targetMode.startsWith("move"))
    {
      this.moveController.updateMove(mx, my);
    }

    //Draw hover
    this.hoverController.draw(ctx, dt);
  }

  createNewState(x, y)
  {
    const node = this.graph.createNewNode();
    node.label = "q" + (this.graph.nodes.length - 1);
    node.x = x || (Math.random() * SPAWN_RADIUS * 2) - SPAWN_RADIUS;
    node.y = y || (Math.random() * SPAWN_RADIUS * 2) - SPAWN_RADIUS;
    return node;
  }

  createNewTransition(src, dst)
  {
    const edge = this.graph.createNewEdge(src, dst);
    edge.label = "0";
    return edge;
  }

  markTarget(x, y)
  {
    if (this.labelController.closeLabelEditor(false))
    {
      this.cursor.targetSource = null;
      this.cursor.targetDestination = null;
      this.cursor.targetMode = "label-edit";
      return;
    }

    if (this.moveMode)
    {
      this.moveController.beginMove(x, y);
    }
    else
    {
      if (this.cursor.targetSource = this.cursor.getEdgeAt(x, y))
      {
        this.cursor.targetMode = "edge";
      }
      else if (this.cursor.targetSource = this.cursor.getNodeAt(x, y))
      {
        this.cursor.targetMode = "state";
      }
      else if (this.cursor.targetSource = this.cursor.getEdgeByEndPointAt(x, y))
      {
        this.cursor.targetMode = "endpoint";
      }
      else
      {
        this.cursor.targetSource = null;
        this.cursor.targetMode = null;
      }
    }
  }

  releaseTarget(x, y)
  {
    if (this.moveMode)
    {
      this.moveController.endMove(x, y);
    }
    else
    {
      if (this.cursor.targetMode == "state")
      {
        this.graph.toggleAcceptState(this.cursor.targetSource);
      }
      else if (this.cursor.targetMode == "edge")
      {
        this.labelController.openLabelEditor(this.cursor.targetSource);
      }
      else if (this.cursor.targetMode == "create-edge")
      {
        if (this.cursor.targetDestination != null)
        {
          const transition = this.createNewTransition(this.cursor.targetSource, this.cursor.targetDestination);
          if (this.proxyEdge.quad != null)
          {
            transition.x = this.proxyEdge.x;
            transition.y = this.proxyEdge.y;
          }
          this.labelController.openLabelEditor(transition);
        }
      }
      else if (this.cursor.targetMode == "endpoint")
      {
        //Left click endpoint?
      }
      //If did not click on anything...
      else if (this.cursor.targetMode == null && this.cursor.targetSource == null)
      {
        //If click, create node at mouse position...
        const dx = x - this.prevMouse.x;
        const dy = y - this.prevMouse.y;

        //Check if it is a click, not a drag...
        if (dx * dx + dy * dy < CURSOR_RADIUS_SQU)
        {
          this.createNewState(x - this.graph.centerX, y - this.graph.centerY);
        }
      }
    }

    this.cursor.targetSource = null;
    this.cursor.targetMode = null;
  }
}

export default NodalGraphController;
