class MoveController
{
  constructor(graph, cursor)
  {
    this.graph = graph;
    this.cursor = cursor;

    this.target = null;
    this.targetMode = null;

    this.targetQuad = null;
    this.targetGraphX = 0;
    this.targetGraphY = 0;
  }

  moveNode(node)
  {
    this.target = node;
    this.targetMode = "node";
  }

  moveEdge(edge)
  {
    this.target = edge;
    this.targetMode = "edge";
  }

  moveEndPoint(edge)
  {
    this.target = edge;
    this.targetMode = "endpoint";
    const quad = this.target.quad;
    if (quad != null)
    {
      this.targetQuad = { x: quad.x, y: quad.y};
    }
    else
    {
      this.targetQuad = null;
    }

    this.cursor.targetMode = "nodeOnly";
  }

  moveGraph(fromX, fromY)
  {
    this.target = null;
    this.targetGraphX = fromX;
    this.targetGraphY = fromY;
    this.targetMode = "graph";
  }

  beginMove(x, y)
  {
    let target = null;
    if (target = this.cursor.getNodeAt(x, y))
    {
      this.moveNode(target);
      return true;
    }
    else if (target = this.cursor.getEdgeAt(x, y))
    {
      this.moveEdge(target);
      return true;
    }
    else if (target = this.cursor.getEdgeByEndPointAt(x, y))
    {
      this.moveEndPoint(target);
      return true;
    }
    else
    {
      this.moveGraph(x, y);
      return true;
    }

    return false;
  }

  updateMove(x, y)
  {
    if (this.targetMode == null) return false;

    //Readjust render position for graph offset
    if (this.targetMode == "edge")
    {
      if (this.target == null)
      {
        throw new Error("Trying to resolve target mode \'" + this.targetMode + "\' with missing source");
      }

      this.target.x = x;
      this.target.y = y;
    }
    else if (this.targetMode == "endpoint")
    {
      if (this.target == null)
      {
        throw new Error("Trying to resolve target mode \'" + this.targetMode + "\' with missing source");
      }

      this.resolveEdge(x, y, this.target);
    }
    else if (this.targetMode == "node")
    {
      if (this.target == null)
      {
        throw new Error("Trying to resolve target mode \'" + this.targetMode + "\' with missing source");
      }

      this.target.x = x - this.graph.centerX;
      this.target.y = y - this.graph.centerY;
    }
    else if (this.targetMode == "graph")
    {
      //Move the graph if draggin empty...
      this.graph.offsetX = x - this.targetGraphX;
      this.graph.offsetY = y - this.targetGraphY;
    }

    return true;
  }

  endMove(x, y)
  {
    if (this.targetMode == null) return;

    this.updateMove(x, y);

    if (this.targetMode == "endpoint")
    {
      if (this.target == null)
      {
        throw new Error("Trying to resolve target mode \'" + this.targetMode + "\' with missing source");
      }

      if (this.cursor.targetDestination == null)
      {
        //Delete it...
        this.graph.destroyEdge(this.target);
        return false;
      }

      this.targetQuad = null;

      this.cursor.targetMode = null;
    }

    this.target = null;
    this.targetMode = null;

    return true;
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
      if (this.targetQuad != null)
      {
        if (edge.quad == null) edge.quad = { x: 0, y: 0 };
        edge.quad.x = this.targetQuad.x;
        edge.quad.y = this.targetQuad.y;
      }
      else
      {
        edge.quad = null;
      }
    }
  }

  isMoving()
  {
    return this.targetMode != null;
  }
}

export default MoveController;
