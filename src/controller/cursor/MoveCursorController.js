import CursorController from 'controller/cursor/CursorController.js';

class MoveCursorConstroller extends CursorController
{
  constructor(mainController, graph)
  {
    super(graph);

    this.mainController = mainController;
    this.graphTarget = { x: 0, y: 0 };
    this.quadTarget = { x: 0, y: 0 };
  }

  onStartDragging(cursor, x, y, target, targetType)
  {
    if (target != null)
    {
      this.mainController.startMove(target, targetType);
    }
    else
    {
      this.graphTarget.x = x;
      this.graphTarget.y = y;
      this.mainController.startMove(this.graphTarget, "graph");
    }

    return true;
  }

  onStopDragging(cursor, x, y, target, targetType)
  {
    let result = false;
    if (target != null)
    {
      result = this.moveTarget(cursor, target, targetType, x, y);
      if (targetType == "endpoint")
      {
        if (!result)
        {
          this.graph.destroyEdge(target);
        }
        else
        {
          if (target.label == STR_TRANSITION_PROXY_LABEL)
          {
            target.label = STR_TRANSITION_DEFAULT_LABEL;
            this.mainController.openLabelEditor(target);
          }
        }

        return true;
      }
    }
    else
    {
      result = this.moveTarget(cursor, this.graphTarget, "graph", x, y);
    }

    return result;
  }

  moveTarget(cursor, target, targetType, x, y)
  {
    if (target == null)
    {
      throw new Error("Trying to resolve target mode \'" + targetType + "\' with missing target source");
    }

    if (targetType == "node")
    {
      //If cursor.hasSelectedStates : move them all!!!
      //Otherwise:
      target.x = x - this.graph.centerX;
      target.y = y - this.graph.centerY;
      return true;
    }
    else if (targetType == "edge")
    {
      target.x = x;
      target.y = y;
      return true;
    }
    else if (targetType == "endpoint")
    {
      let result = true;
      const dst = cursor.getNodeAt(x, y);
      if (dst)
      {
        target.to = dst;
        result = true;
      }
      else
      {
        target.to = cursor.mouse;
        result = false;
      }

      //If the cursor returns to the state after leaving it...
      if (target.isSelfLoop())
      {
        //Make it a self loop
        const dx = target.from.x - x;
        const dy = target.from.y - y;
        const angle = Math.atan2(dy, dx);
        target.x = target.from.x - Math.cos(angle) * SELF_LOOP_HEIGHT;
        target.y = target.from.y - Math.sin(angle) * SELF_LOOP_HEIGHT;
      }
      else
      {
        if (this.quadTarget.x != 0 || this.quadTarget.y != 0)
        {
          target.x = target.y = 1;
          target.quad.x = this.quadTarget.x;
          target.quad.y = this.quadTarget.y;
        }
        else
        {
          target.quad = null;
        }
      }

      return result;
    }
    else if (targetType == "graph")
    {
      //Move the graph if draggin empty...
      this.graph.offsetX = x - target.x;
      this.graph.offsetY = y - target.y;
      return true;
    }

    return false;
  }
}

export default MoveCursorConstroller;
