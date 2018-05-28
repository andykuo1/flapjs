import { Node } from 'NodalGraph.js';

class NodalGraphRenderer
{
  constructor()
  {
    this.hoverAngle = 0;
  }

  render(ctx, dt, graph)
  {
    ctx.save();
    this.drawNodes(ctx, graph.nodes);

    //Draw initial node
    if (graph.nodes.length > 0)
    {
      const initial = graph.getInitialState();
      ctx.save();
      {
        drawInitialMarker(ctx, initial);
      }
      ctx.restore();
    }

    //Draw edges
    this.drawEdges(ctx, graph.edges);

    //Update hover angles
    this.hoverAngle = (this.hoverAngle + HOVER_ANGLE_SPEED) % PI2;
    ctx.restore();
  }

  drawNodes(ctx, nodes)
  {
    ctx.save();
    {
      //Default node styles
      ctx.font = NODE_FONT;
      ctx.textAlign = NODE_TEXT_ALIGN;
      ctx.strokeStyle = NODE_STROKE_STYLE;
      ctx.fillStyle = NODE_FILL_STYLE;

      //Draw nodes
      if (Array.isArray(nodes))
      {
        for(let node of nodes)
        {
          drawNode(ctx, node);
        }
      }
      else
      {
        drawNode(ctx, nodes);
      }
    }
    ctx.restore();
  }

  drawEdges(ctx, edges)
  {
    //Draw edges
    ctx.save();
    {
      //Default edge styles
      ctx.font = EDGE_FONT;
      ctx.textAlign = EDGE_TEXT_ALIGN;
      ctx.strokeStyle = EDGE_STROKE_STYLE;

      if (Array.isArray(edges))
      {
        for(let edge of edges)
        {
          drawEdge(ctx, edge);
        }
      }
      else
      {
        drawEdge(ctx, edges);
      }
    }
    ctx.restore();
  }

  drawHoverCircle(ctx, x, y, radius)
  {
    ctx.save();
    {
      const angle = this.hoverAngle;
      ctx.strokeStyle = HOVER_STROKE_STYLE;
      ctx.lineWidth = HOVER_LINE_WIDTH;
      ctx.beginPath();
      ctx.setLineDash(HOVER_LINE_DASH);
      ctx.arc(x, y, radius, 0 + angle, PI2 + angle);
      ctx.stroke();
    }
    ctx.restore();
  }
}

/* Draw Functions */

function drawNode(ctx, node)
{
  const x = node.x;
  const y = node.y;
  const label = node.label;
  const accept = node.accept;

  ctx.fillStyle = NODE_FILL_STYLE;
  ctx.beginPath();
  ctx.arc(x, y, NODE_RADIUS, 0, PI2);
  ctx.fill();
  ctx.stroke();

  if (accept)
  {
    ctx.beginPath();
    ctx.arc(x, y, NODE_RADIUS_INNER, 0, PI2);
    ctx.stroke();
  }

  ctx.fillStyle = NODE_TEXT_FILL_STYLE;
  ctx.fillText(label, x, y + 4);
}

function drawEdge(ctx, edge)
{
  const from = edge.from;
  const to = edge.to;
  const x = edge.x;
  const y = edge.y;
  const midpoint = edge.getMidPoint();
  const centerX = midpoint[0];
  const centerY = midpoint[1];
  const quad = edge.quad;
  const label = edge.label;

  let endX = 0;
  let endY = 0;
  let arrowAngle = 0;

  const start = edge.getStartPoint();
  const end = (edge.to instanceof Node) ? edge.getEndPoint() : [edge.to.x, edge.to.y];
  endX = end[0];
  endY = end[1];

  ctx.beginPath();
  ctx.moveTo(start[0], start[1]);

  if (quad == null)
  {
    arrowAngle = Math.atan2(start[0] - end[0], start[1] - end[1]) + Math.PI;
    ctx.lineTo(end[0], end[1]);
  }
  else
  {
    const centerQuad = edge.getCenterPoint();
    centerQuad[0] += edge.quad.x;
    centerQuad[1] += edge.quad.y;
    arrowAngle = Math.atan2(centerQuad[0] - end[0], centerQuad[1] - end[1]) + Math.PI;
    ctx.quadraticCurveTo(centerQuad[0], centerQuad[1], end[0], end[1]);
  }

  ctx.moveTo(
    endX - (ARROW_WIDTH * Math.sin(arrowAngle - SIXTH_PI)),
    endY - (ARROW_WIDTH * Math.cos(arrowAngle - SIXTH_PI)));
  ctx.lineTo(endX, endY);
  ctx.lineTo(
    endX - (ARROW_WIDTH * Math.sin(arrowAngle + SIXTH_PI)),
    endY - (ARROW_WIDTH * Math.cos(arrowAngle + SIXTH_PI)));
  ctx.stroke();
  ctx.closePath();

  //Draw multiple labels
  if (label.length > 0)
  {
    const labels = label.split(" ");
    let dy = 0;
    for(let str of labels)
    {
      let xx = 0;
      let yy = 0;
      let cx = str.length * 3;
      let sign = 0;

      if (quad == null)
      {
        xx = centerX;
        yy = centerY;
      }
      else
      {
        sign = Math.sign(quad.y);
        xx = x;
        yy = y + (8 * sign);
      }

      yy += dy * (-sign || 1);
      ctx.clearRect(xx - cx - 2, yy - 5, (cx * 2) + 4, 10);
      ctx.fillText(str, xx, yy + 4);
      dy -= 12;
    }
  }
}

function drawInitialMarker(ctx, initialNode)
{
  const x = initialNode.x;
  const y = initialNode.y;

  ctx.strokeStyle = EDGE_STROKE_STYLE;
  ctx.beginPath();
  ctx.moveTo(x - NODE_RADIUS, y);
  ctx.lineTo(x - NODE_DIAMETER, y - NODE_RADIUS);
  ctx.lineTo(x - NODE_DIAMETER, y + NODE_RADIUS);
  ctx.closePath();
  ctx.stroke();
}

export default new NodalGraphRenderer();
