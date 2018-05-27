class MoveController
{
  constructor(graph, cursor)
  {
    this.graph = graph;
    this.cursor = cursor;
    this.mouse = this.cursor.mouse;

    this.prevEdgeQuad = null;
  }

  beginMove(x, y)
  {
    if (this.cursor.targetSource = this.cursor.getEdgeAt(x, y))
    {
      this.cursor.targetMode = "move-edge";
    }
    else if (this.cursor.targetSource = this.cursor.getNodeAt(x, y))
    {
      this.cursor.targetMode = "move-state";
    }
    else if (this.cursor.targetSource = this.cursor.getEdgeByEndPointAt(x, y))
    {
      this.cursor.targetMode = "move-endpoint";
      const quad = this.cursor.targetSource.quad;
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
      this.cursor.targetSource = { x: x, y: y };
      this.cursor.targetMode = "move-graph";
    }
  }

  updateMove(x, y)
  {
    if (this.cursor.targetMode == null) return;
    if (this.cursor.targetSource == null)
    {
      throw new Error("Trying to resolve target mode \'" + this.cursor.targetMode + "\' with missing source");
    }

    //Readjust render position for graph offset
    if (this.cursor.targetMode == "move-edge")
    {
      this.cursor.targetSource.x = x;
      this.cursor.targetSource.y = y;
    }
    else if (this.cursor.targetMode == "move-endpoint")
    {
      this.resolveEdge(x, y, this.cursor.targetSource);
    }
    else if (this.cursor.targetMode == "move-state")
    {
      this.cursor.targetSource.x = x - this.graph.centerX;
      this.cursor.targetSource.y = y - this.graph.centerY;
    }
    else if (this.cursor.targetMode == "move-graph")
    {
      //Move the graph if draggin empty...
      this.graph.offsetX = x - this.cursor.targetSource.x;
      this.graph.offsetY = y - this.cursor.targetSource.y;
    }
  }

  endMove(x, y)
  {
    if (this.cursor.targetMode == null) return;
    if (this.cursor.targetSource == null)
    {
      throw new Error("Trying to resolve target mode \'" + this.cursor.targetMode + "\' with missing source");
    }

    this.updateMove(x, y);

    if (this.cursor.targetMode == "move-endpoint")
    {
      if (this.cursor.targetDestination == null)
      {
        //Delete it...
        this.graph.destroyEdge(this.cursor.targetSource);
      }

      this.prevEdgeQuad = null;
    }
  }

  resolveEdge(x, y, edge)
  {
    edge.to = this.cursor.targetDestination || this.cursor.mouse;

    //If the cursor returns to the state after leaving it...
    if (edge.isSelfLoop())
    {
      //Make it a self loop
      const dx = edge.from.x - x;
      const dy = edge.from.y - y;
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
}

export default MoveController;
