import { Node } from 'NodalGraph.js';

class NodalGraphRenderer
{
  constructor(graph)
  {
    this.graph = graph;
    this.hoverAngle = 0;
  }

  render(ctx, dt)
  {
    this.drawNodes(ctx, this.graph.nodes);

    //Draw initial node
    if (this.graph.nodes.length > 0)
    {
      const initial = this.graph.getInitialState();
      ctx.save();
      {
        drawInitialMarker(ctx, initial);
      }
      ctx.restore();
    }

    //Draw edges
    this.drawEdges(ctx, this.graph.edges);

    //Update hover angles
    this.hoverAngle = (this.hoverAngle + HOVER_ANGLE_SPEED) % PI2;
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
  const centerX = edge.centerX;
  const centerY = edge.centerY;
  const quad = edge.quad;
  const label = edge.label;

  let endX = 0;
  let endY = 0;
  let arrowAngle = 0;

  if (quad == null)
  {
    const dx = from.x - to.x;//TODO: Apply quad to this
    const dy = from.y - to.y;
    const angle = -Math.atan2(dy, dx) - HALF_PI;
    const xx = NODE_RADIUS * Math.sin(angle);
    const yy = NODE_RADIUS * Math.cos(angle);

    const startX = from.x + xx;
    const startY = from.y + yy;
    endX = to.x - (to instanceof Node ? xx : 0);
    endY = to.y - (to instanceof Node ? yy : 0);
    arrowAngle = Math.atan2(startX - endX, startY - endY) + Math.PI;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
  }
  else
  {
    const quadX = centerX + (quad.x * 2);
    const quadY = centerY + (quad.y * 2);

    const sdx = from.x - quadX;
    const sdy = from.y - quadY;
    const sangle = -Math.atan2(sdy, sdx) - HALF_PI + (from == to ? FOURTH_PI : 0);
    const sx = NODE_RADIUS * Math.sin(sangle);
    const sy = NODE_RADIUS * Math.cos(sangle);

    const edx = quadX - to.x;
    const edy = quadY - to.y;
    const eangle = -Math.atan2(edy, edx) - HALF_PI + (from == to ? -FOURTH_PI : 0);
    const ex = NODE_RADIUS * Math.sin(eangle);
    const ey = NODE_RADIUS * Math.cos(eangle);

    const startX = from.x + sx;
    const startY = from.y + sy;
    endX = to.x - (to instanceof Node ? ex : 0);
    endY = to.y - (to instanceof Node ? ey : 0);
    arrowAngle = Math.atan2(quadX - endX, quadY - endY) + Math.PI;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(quadX, quadY, endX, endY);
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

  if (label.length > 0)
  {
    let xx = quad == null ? centerX : x;
    let yy = quad == null ? centerY : y + (8 * Math.sign(quad.y));
    const cx = label.length * 3;
    ctx.clearRect(xx - cx - 2, yy - 5, (cx * 2) + 4, 10);
    ctx.fillText(label, xx, yy + 4);
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

export default NodalGraphRenderer;
