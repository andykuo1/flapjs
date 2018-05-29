import NodalGraphRenderer from 'NodalGraphRenderer.js';

class HoverCursorController
{
  constructor(mainController)
  {
    this.mainController = mainController;
  }

  drawHoverInformation(ctx, cursor, x, y)
  {
    let selectTarget = null;
    let selectType = null;

    if (selectTarget = this.mainController.target)
    {
      selectTarget = this.mainController.target;
      selectType = this.mainController.targetType;
    }
    else if (selectTarget = cursor.getNodeAt(x, y))
    {
      selectType = "node";
    }
    else if (selectTarget = cursor.getEdgeAt(x, y))
    {
      selectType = "edge";
    }
    else if (selectTarget = cursor.getEdgeByEndPointAt(x, y))
    {
      selectType = "endpoint";
    }

    if (selectTarget != null)
    {
      //Don't draw hover info for already selected targets...
      if (this.mainController.editCursor.selectBox.targets.includes(selectTarget))
      {
        return;
      }

      let x = 0;
      let y = 0;
      let r = CURSOR_RADIUS;
      switch(selectType)
      {
        case "node":
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
          x = x;
          y = y;
      }
      NodalGraphRenderer.drawHoverCircle(ctx, x, y, r + HOVER_RADIUS_OFFSET);
    }
  }
}

export default HoverCursorController;
