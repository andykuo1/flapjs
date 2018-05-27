import NodalGraphRenderer from 'NodalGraphRenderer.js';

class HoverController
{
  constructor(graph, cursor)
  {
    this.graph = graph;
    this.cursor = cursor;
  }

  draw(ctx, dt)
  {
    const mx = this.cursor.mouse.x;
    const my = this.cursor.mouse.y;

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
}

export default HoverController;
