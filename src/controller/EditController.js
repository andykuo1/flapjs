import NodalGraphRenderer from 'NodalGraphRenderer.js';

class EditController
{
  constructor(graph, cursor, labelEditor, moveController, selectionController)
  {
    this.graph = graph;
    this.cursor = cursor;
    this.labelEditor = labelEditor;
    this.moveController = moveController;
    this.selectionController = selectionController;

    this.doubleTapTicks = 0;
    this.tapX = 0;
    this.tapY = 0;

    this.target = null;
    this.targetMode = null;
    this.targetEdge = null;
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
      return true;
    }
    else if (this.target = this.cursor.getNodeAt(x, y))
    {
      this.targetMode = "state";
      return true;
    }
    else if (this.target = this.cursor.getEdgeByEndPointAt(x, y))
    {
      this.targetMode = "endpoint";
      return true;
    }
    else
    {
      this.target = null;
      this.targetMode = this.doubleTapTicks > 0 ? "doubleTap" : "singleTap";

      this.tapX = x;
      this.tapY = y;
    }

    return false;
  }

  updateEdit(ctx, x, y)
  {
    //If waiting for second tap...
    if (this.targetMode == null)
    {
      if (this.doubleTapTicks > 0) --this.doubleTapTicks;
      return false;
    }

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
    else if (this.targetMode == "singleTap")
    {
      console.log("UPDATING?");
      const dx = this.tapX - x;
      const dy = this.tapY - y;
      //Is dragging on single tap...
      if (dx * dx + dy * dy > CURSOR_RADIUS_SQU)
      {
        this.selectionController.beginSelection(x, y);
        this.targetMode = null;
        return false;
      }
    }
    else if (this.targetMode == "doubleTap")
    {
      const dx = this.tapX - x;
      const dy = this.tapY - y;
      //Is dragging on double tap...
      if (dx * dx + dy * dy > CURSOR_RADIUS_SQU)
      {
        this.selectionController.beginSelection(x, y);
        this.targetMode = null;
        return false;
      }
    }

    return true;
  }

  endEdit(x, y)
  {
    if (this.targetMode == null) return false;

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
      this.target = null;
      this.targetMode = null;
      return false;
    }
    else if (this.targetMode == "singleTap")
    {
      this.doubleTapTicks = DOUBLE_TAP_TICKS;
      this.target = null;
      this.targetMode = null;
      return false;
    }
    else if (this.targetMode == "doubleTap")
    {
      this.createNewState(x - this.graph.centerX, y - this.graph.centerY);
      this.doubleTapTicks = 0;
    }

    this.target = null;
    this.targetMode = null;
    return true;
  }

  isActive()
  {
    return this.targetMode != null;
  }
}

export default EditController;
