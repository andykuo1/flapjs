import { Edge } from 'NodalGraph.js';
import NodalGraphRenderer from 'NodalGraphRenderer.js';
import NodalGraphSorter from 'NodalGraphSorter.js';
import MoveController from 'MoveController.js';
import GraphCursor from 'GraphCursor.js';

class NodalGraphController
{
  constructor(canvas, mouse, graph)
  {
    this.canvas = canvas;
    this.mouse = mouse;
    this.graph = graph;

    this.labelEditor = document.getElementById("label-editor");
    this.labelEditorInput = document.getElementById("label-editor-input");
    this.labelEditorInput.addEventListener('keyup', (e) => {
      if (e.keyCode == 13)
      {
        this.closeLabelEditor(true);
      }
      else if (e.keyCode == 27)
      {
        this.closeLabelEditor(false);
      }
    });
    this.labelEditorInput.addEventListener('blur', (e) => {
      this.closeLabelEditor(false);
    })
    this.labelEditorSource = null;

    this.cursor = new GraphCursor(graph, mouse);
    this.moveController = new MoveController(graph, this.cursor);

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

    //Hover information...
    let targetSelect = null;
    let selectMode = null;

    if (targetSelect = this.cursor.targetDestination)
    {
      selectMode = "state";
    }
    else if (targetSelect = this.cursor.getEdgeAt(mx, my))
    {
      selectMode = "edge";
    }
    else if (targetSelect = this.cursor.getEdgeByEndPointAt(mx, my))
    {
      selectMode = "endpoint";
    }

    if (targetSelect != null)
    {
      let x = 0;
      let y = 0;
      let r = CURSOR_RADIUS;
      switch(selectMode)
      {
        case "state":
          x = targetSelect.x;
          y = targetSelect.y;
          r = NODE_RADIUS;
          break;
        case "edge":
          x = targetSelect.x;
          y = targetSelect.y;
          r = EDGE_RADIUS;
          break;
        case "endpoint":
          const endpoint = targetSelect.getEndPoint();
          x = endpoint[0];
          y = endpoint[1];
          r = ENDPOINT_RADIUS;
          break;
        default:
          x = mx;
          y = my;
      }
      NodalGraphRenderer.drawHoverCircle(ctx, x, y, r + HOVER_RADIUS_OFFSET);
    }
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
    if (this.closeLabelEditor(false))
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
        this.openLabelEditor(this.cursor.targetSource);
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
          this.openLabelEditor(transition);
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

  openLabelEditor(source)
  {
    if (this.labelEditorSource != source)
    {
      this.labelEditor.style.left = (source.x - this.labelEditor.offsetWidth / 2) + 'px';
      this.labelEditor.style.top = (source.y - this.labelEditor.offsetHeight / 2) + 'px';
      this.labelEditorInput.value = source.label;

      this.labelEditor.style.visibility = "visible";
      this.labelEditorSource = source;
      this.labelEditorInput.focus();
      this.labelEditorInput.select();
      return true;
    }
    return false;
  }

  closeLabelEditor(shouldSave)
  {
    if (this.labelEditorSource != null)
    {
      if (shouldSave)
      {
        this.labelEditorSource.label = this.labelEditorInput.value;
      }

      this.labelEditor.style.visibility = "hidden";
      this.labelEditorSource = null;
      return true;
    }
    return false;
  }
}

export default NodalGraphController;
