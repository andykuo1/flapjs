import { Edge } from 'NodalGraph.js';
import NodalGraphRenderer from 'NodalGraphRenderer.js';

class EditController
{
  constructor(graph, cursor, labelEditor, moveController)
  {
    this.graph = graph;
    this.cursor = cursor;
    this.labelEditor = labelEditor;
    this.moveController = moveController;

    this.proxyEdge = new Edge(null, null, "");
    this.prevMouse = { x: 0, y: 0 };
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

  beginEdit(x, y)
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

    this.prevMouse.x = x;
    this.prevMouse.y = y;
  }

  updateEdit(ctx, x, y)
  {
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
      this.moveController.resolveEdge(x, y, this.proxyEdge);

      //Draw the proxy edge
      NodalGraphRenderer.drawEdges(ctx, this.proxyEdge);
    }
  }

  endEdit(x, y)
  {
    if (this.cursor.targetMode == "state")
    {
      this.graph.toggleAcceptState(this.cursor.targetSource);
    }
    else if (this.cursor.targetMode == "edge")
    {
      this.labelEditor.open(this.cursor.targetSource);
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
        this.labelEditor.open(transition);
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
}

export default EditController;
