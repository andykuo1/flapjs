import { Edge } from 'NodalGraph.js';
import NodalGraphRenderer from 'NodalGraphRenderer.js';
import NodalGraphSorter from 'NodalGraphSorter.js';

class NodalGraphController
{
  constructor(canvas, mouse, graph)
  {
    this.canvas = canvas;
    this.mouse = mouse;
    this.graph = graph;

    this.moveMode = false;
    this.targetMode = null;
    this.targetSource = null;
    this.targetDestination = null;
    this.proxyEdge = new Edge(null, null, "");

    this.prevMouse = { x: 0, y: 0 };
    this.prevEdgeQuad = null;
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
    //Get hovered states
    this.targetDestination = this.getStateByPosition(this.mouse.x, this.mouse.y);

    //If clicked on state...
    if (this.targetMode == "state")
    {
      //Start creating edges if cursor leaves state...
      if (this.targetSource != this.targetDestination)
      {
        this.targetMode = "edge";
        this.proxyEdge.from = this.targetSource;
      }
    }

    //If is creating edges and NOT toggling accept state...
    if (this.targetMode == "edge")
    {
      this.resolveEdge(this.proxyEdge);

      //Draw the proxy edge
      NodalGraphRenderer.drawEdges(ctx, this.proxyEdge);
    }

    //Update the moving target if dragging object...
    if (this.targetMode && this.targetMode.startsWith("move"))
    {
      this.resolveMove(false);
    }

    //Hover information...
    let targetSelect = null;
    let selectMode = null;

    if (targetSelect = this.targetDestination)
    {
      selectMode = "state";
    }
    else if (targetSelect = this.getEdgeByPosition(this.mouse.x, this.mouse.y))
    {
      selectMode = "edge";
    }
    else if (targetSelect = this.getEdgeEndPointByPosition(this.mouse.x, this.mouse.y))
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
          x = this.mouse.x;
          y = this.mouse.y;
      }
      NodalGraphRenderer.drawHoverCircle(ctx, x, y, r + HOVER_RADIUS_OFFSET);
    }
  }

  createNewState()
  {
    const x = (Math.random() * SPAWN_RADIUS * 2) - SPAWN_RADIUS;
    const y = (Math.random() * SPAWN_RADIUS * 2) - SPAWN_RADIUS;
    const node = this.graph.createNewNode();
    node.x = x;
    node.y = y;
    node.accept = false;
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
    if (this.moveMode)
    {
      if (this.targetSource = this.getEdgeByPosition(x, y))
      {
        this.targetMode = "move-edge";
      }
      else if (this.targetSource = this.getStateByPosition(x, y))
      {
        this.targetMode = "move-state";
      }
      else if (this.targetSource = this.getEdgeEndPointByPosition(x, y))
      {
        this.targetMode = "move-endpoint";
        const quad = this.targetSource.quad;
        if (quad != null)
        {
          this.prevEdgeQuad = { x: quad.x, y: quad.y};
        }
        else
        {
          this.prevEdgeQuad = null;
        }
      }
      else
      {
        this.targetSource = { x: this.mouse.x, y: this.mouse.y };
        this.targetMode = "move-graph";
      }
    }
    else
    {
      if (this.targetSource = this.getEdgeByPosition(x, y))
      {
        this.targetMode = "edge";
      }
      else if (this.targetSource = this.getStateByPosition(x, y))
      {
        this.targetMode = "state";
      }
      else if (this.targetSource = this.getEdgeEndPointByPosition(x, y))
      {
        this.targetMode = "endpoint";
      }
      else
      {
        this.targetSource = null;
        this.targetMode = null;
      }
    }
  }

  releaseTarget(x, y)
  {
    if (this.moveMode)
    {
      //Moved something...
      this.resolveMove(true);
    }
    else
    {
      if (this.targetMode == "state")
      {
        this.graph.toggleAcceptState(this.targetSource);
      }
      else if (this.targetMode == "edge")
      {
        if (this.targetDestination != null)
        {
          const transition = this.createNewTransition(this.targetSource, this.targetDestination);
          if (this.proxyEdge.quad != null)
          {
            transition.x = this.proxyEdge.x;
            transition.y = this.proxyEdge.y;
          }
        }
      }
      else if (this.targetMode == "endpoint")
      {
        //Left click endpoint?
      }

      //If did not click on anything...
      else if (this.targetSource == null)
      {
        //If click, create node at mouse position...
        const dx = x - this.prevMouse.x;
        const dy = y - this.prevMouse.y;

        //Check if it is a click, not a drag...
        if (dx * dx + dy * dy < CURSOR_RADIUS_SQU)
        {
          const node = this.graph.createNewNode();
          node.x = x - this.graph.centerX;
          node.y = y - this.graph.centerY;
          node.accept = false;
        }
      }
    }

    this.targetSource = null;
    this.targetMode = null;
  }

  resolveEdge(edge)
  {
    edge.to = this.targetDestination || this.mouse;

    //If the cursor returns to the state after leaving it...
    if (edge.isSelfLoop())
    {
      //Make it a self loop
      const dx = edge.from.x - this.mouse.x;
      const dy = edge.from.y - this.mouse.y;
      const angle = Math.atan2(dy, dx);
      edge.x = edge.from.x - Math.cos(angle) * SELF_LOOP_HEIGHT;
      edge.y = edge.from.y - Math.sin(angle) * SELF_LOOP_HEIGHT;
    }
    else
    {
      if (this.prevEdgeQuad != null)
      {
        if (edge.quad == null) edge.quad = { x: 0, y: 0 };
        edge.quad.x = this.prevEdgeQuad.x;
        edge.quad.y = this.prevEdgeQuad.y;
      }
      else
      {
        edge.quad = null;
      }
    }
  }

  resolveMove(final)
  {
    if (this.targetSource == null) return;

    //Readjust render position for graph offset
    if (this.targetMode == "move-edge")
    {
      this.targetSource.x = this.mouse.x;
      this.targetSource.y = this.mouse.y;
    }
    else if (this.targetMode == "move-endpoint")
    {
      this.resolveEdge(this.targetSource);

      if (this.targetDestination == null)
      {
        if (final)
        {
          //Delete it...
          this.graph.destroyEdge(this.targetSource);
        }
      }

      if (final)
      {
        this.prevEdgeQuad = null;
      }
    }
    else if (this.targetMode == "move-state")
    {
      this.targetSource.x = this.mouse.x - this.graph.centerX;
      this.targetSource.y = this.mouse.y - this.graph.centerY;
    }
    else if (this.targetMode == "move-graph")
    {
      //Move the graph if draggin empty...
      this.graph.offsetX = this.mouse.x - this.targetSource.x;
      this.graph.offsetY = this.mouse.y - this.targetSource.y;
    }
  }

  getStateByPosition(x, y)
  {
    for(const node of this.graph.nodes)
    {
      const dx = x - node.x;
      const dy = y - node.y;
      if (dx * dx + dy * dy < NODE_RADIUS_SQU)
      {
        return node;
      }
    }

    return null;
  }

  getEdgeByPosition(x, y)
  {
    for(const edge of this.graph.edges)
    {
      const dx = x - edge.x;
      const dy = y - edge.y;
      if (dx * dx + dy * dy < EDGE_RADIUS_SQU)
      {
        return edge;
      }
    }

    return null;
  }

  getEdgeEndPointByPosition(x, y)
  {
    for(const edge of this.graph.edges)
    {
      const point = edge.getEndPoint();
      const dx = x - point[0];
      const dy = y - point[1];
      if (dx * dx + dy * dy < ENDPOINT_RADIUS_SQU)
      {
        return edge;
      }
    }

    return null;
  }
}

export default NodalGraphController;
