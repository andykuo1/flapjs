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

    this.target = null;
    this.targetMode = null;
    this.targetEdge = null;
    
    this.prevMouse = { x: 0, y: 0 };
  }

  createNewState(x, y)
  {
    const node = this.graph.createNewNode();
    node.label = STR_STATE_LABEL + (this.graph.nodes.length - 1);
    node.x = x || (Math.random() * SPAWN_RADIUS * 2) - SPAWN_RADIUS;
    node.y = y || (Math.random() * SPAWN_RADIUS * 2) - SPAWN_RADIUS;
    return node;
  }

  createNewTransition(src, dst)
  {
    const edge = this.graph.createNewEdge(src, dst);
    edge.label = STR_TRANSITION_DEFAULT_LABEL;
    return edge;
  }

  beginEdit(x, y)
  {
    if (this.target = this.cursor.getEdgeAt(x, y))
    {
      this.targetMode = "edge";
    }
    else if (this.target = this.cursor.getNodeAt(x, y))
    {
      this.targetMode = "state";
    }
    else if (this.target = this.cursor.getEdgeByEndPointAt(x, y))
    {
      this.targetMode = "endpoint";
    }
    else
    {
      this.target = null;
      this.targetMode = null;
    }

    this.prevMouse.x = x;
    this.prevMouse.y = y;
  }

  updateEdit(ctx, x, y)
  {
    //If clicked on state...
    if (this.targetMode == "state")
    {
      //Start creating edges if cursor leaves state...
      if (this.target != this.cursor.targetDestination)
      {
        this.targetMode = "create-edge";
        this.targetEdge = this.graph.createNewEdge(this.target, null);
        this.targetEdge.label = STR_TRANSITION_PROXY_LABEL;

        this.moveController.moveEndPoint(this.targetEdge);
      }
    }
  }

  endEdit(x, y)
  {
    if (this.targetMode == "state")
    {
      this.graph.toggleAcceptState(this.target);
    }
    else if (this.targetMode == "edge")
    {
      this.labelEditor.open(this.target);
    }
    else if (this.targetMode == "create-edge")
    {
      if (this.moveController.endMove(x, y))
      {
        this.labelEditor.open(this.targetEdge, STR_TRANSITION_DEFAULT_LABEL);
      }

      this.targetEdge = null;
    }
    else if (this.targetMode == "endpoint")
    {
      //Left click endpoint?
    }
    //If did not click on anything...
    else if (this.targetMode == null && this.target == null)
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

    this.target = null;
    this.targetMode = null;
  }
}

export default EditController;
