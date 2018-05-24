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

    this.moveTarget = null;
    this.moveTargetType = null;
    this.moveGraph = null;
    this.selectorAngle = 0;
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
    //TODO: Drawing the graph info...

    //Get hover information...
    let selectTarget = this.targetDestination = this.getStateByPosition(this.mouse.x, this.mouse.y);
    let selectType = "state";

    this.targetDestination = selectTarget;

    //If clicked on state...
    if (this.targetMode == "state")
    {
      //Start creating edges if cursor leaves state...
      if (this.isSelfMode && this.targetDestination != this.targetSource)
      {
        this.isSelfMode = false;
      }

      //If is creating edges and NOT toggling accept state...
      if (!this.isSelfMode)
      {
        this.proxyEdge.from = this.targetSource;
        this.proxyEdge.to = this.targetDestination || this.mouse;

        //If the cursor returns to the state after leaving it...
        if (this.targetSource == this.targetDestination)
        {
          //Make it a self loop
          this.proxyEdge.y = this.proxyEdge.from.y - SELF_LOOP_HEIGHT;
        }
        //TODO: if (this.getEdgesByNodes(this.targetSource, this.targetDestination) != null)
        else
        {
          //Make sure it is not a self loop
          this.proxyEdge.quad = null;
        }

        //Draw the proxy edge
        NodalGraphRenderer.drawEdges(ctx, this.proxyEdge);
      }
    }

    //Whether or not cursor has left the node to signify edge drawing...
    if (this.targetSource != null)
    {
      if (this.isSelfMode && selectTarget != this.targetSource)
      {
        this.isSelfMode = false;
      }

      //Draw the edge if moving edge...
      if (!this.isSelfMode)
      {
        this.proxyEdge.from = this.targetSource;
        this.proxyEdge.to = this.targetDestination || this.mouse;
        if (this.targetSource == this.targetDestination)
        {
          this.proxyEdge.y = this.proxyEdge.from.y - SELF_LOOP_HEIGHT;
        }
        //TODO: if (this.getEdgesByNodes(this.targetSource, this.targetDestination) != null)
        else
        {
          this.proxyEdge.quad = null;
        }
        NodalGraphRenderer.drawEdges(ctx, this.proxyEdge);
      }
    }

    //Move the target if dragging object...
    if (this.moveTarget != null)
    {
      this.resolveMove();
      selectTarget = this.moveTarget;
    }

    //Move the graph if draggin empty...
    if (this.moveGraph != null)
    {
      this.graph.offsetX = this.mouse.x - this.moveGraph.x;
      this.graph.offsetY = this.mouse.y - this.moveGraph.y;
    }

    //Hover information...
    if (selectTarget == null)
    {
      selectTarget = this.getEdgeByPosition(this.mouse.x, this.mouse.y);
      selectType = "edge";
    }
    if (selectTarget == null)
    {
      selectTarget = this.getEdgeEndPointByPosition(this.mouse.x, this.mouse.y);
      selectType = "endpoint";
    }
    if (selectTarget != null)
    {
      let x = 0;
      let y = 0;
      let r = CURSOR_RADIUS;
      switch(selectType)
      {
        case "state":
          x = selectTarget.x;
          y = selectTarget.y;
          r = NODE_RADIUS;
          break;
        case "edge":
          x = selectTarget.x;
          y = selectTarget.y;
          r = EDGE_RADIUS;
          break;
        case "endpoint":
          const endpoint = selectTarget.getEndPoint();
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
      //TODO: Change over moveTarget to targetDestination
      //TODO: Change over moveTargetType to targetMode instead
      if (this.moveTarget = this.getEdgeByPosition(x, y))
      {
        this.moveTargetType = "edge";
      }
      else if (this.moveTarget = this.getStateByPosition(x, y))
      {
        this.moveTargetType = "state";
      }
      else if (this.moveTarget = this.getEdgeEndPointByPosition(x, y))
      {
        this.moveTargetType = "endpoint";
      }
      else
      {
        this.moveGraph = { x: this.mouse.x, y: this.mouse.y };
      }
    }
    else
    {
      this.targetSource = this.getStateByPosition(x, y);
      this.isSelfMode = true;
    }
  }

  releaseTarget(x, y)
  {
    if (this.moveMode)
    {
      if (this.moveTarget != null)
      {
        this.resolveMove();
        this.moveTarget = null;
      }

      if (this.moveGraph != null)
      {
        this.graph.offsetX = this.mouse.x - this.moveGraph.x;
        this.graph.offsetY = this.mouse.y - this.moveGraph.y;

        //TODO: Limit how far you can move the graph...

        this.moveGraph = null;
      }
    }
    else
    {
      //If did not click on anything...
      if (this.targetSource == null)
      {
        //If click, create node at mouse position...
        const dx = x - this.prevMouse.x;
        const dy = y - this.prevMouse.y;

        //Check if it is a click, not a drag...
        if (dx * dx + dy * dy < CLICK_RADIUS_SQU)
        {
          const node = this.graph.createNewNode();
          node.x = x - this.graph.centerX;
          node.y = y - this.graph.centerY;
          node.accept = false;
        }
        return;
      }

      const target = this.getStateByPosition(x, y);
      if (!this.isSelfMode && this.targetDestination != null)
      {
        this.createNewTransition(this.targetSource, this.targetDestination);
      }
      else if (target == this.targetSource)
      {
        this.graph.toggleAcceptState(target);
      }

      this.targetSource = null;
      this.targetDestination = null;
    }
  }

  resolveMove()
  {
    //Readjust render position for graph offset
    if (this.moveTarget instanceof Edge)
    {
      if (this.moveTargetType == "edge")
      {
        this.moveTarget.x = this.mouse.x;
        this.moveTarget.y = this.mouse.y;
      }
      else if (this.moveTargetType == "endpoint")
      {
        this.moveTarget.to = this.targetDestination || this.mouse;
      }
    }
    else
    {
      this.moveTarget.x = this.mouse.x - this.graph.centerX;
      this.moveTarget.y = this.mouse.y - this.graph.centerY;
    }
  }

  getStateByPosition(x, y)
  {
    for(const node of this.graph.nodes)
    {
      const dx = x - node.x;
      const dy = y - node.y;
      if (dx * dx + dy * dy < RADIUS_SQU)
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
      if (dx * dx + dy * dy < EDGE_RADIUS_SQU)
      {
        return edge;
      }
    }

    return null;
  }
}

export default NodalGraphController;
