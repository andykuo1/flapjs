const RADIUS = 16;
const RADIUS_INNER = 12;
const PI2 = Math.PI * 2;

export class NodalGraph
{
  constructor()
  {
    this.nodes = [];
    this.edges = [];
  }

  createNewNode()
  {
    const result = new Node();
    this.nodes.push(result);
    return result;
  }

  createNewEdge(from, to)
  {
    const result = new Edge(from, to);
    this.edges.push(result);
    return result;
  }

  draw(ctx)
  {
    //Draw initial node
    if (this.nodes.length > 0)
    {
      const initial = this.nodes[0];
      const x = initial.x;
      const y = initial.y;
      ctx.beginPath();
      ctx.moveTo(x - RADIUS, y);
      ctx.lineTo(x - RADIUS * 2, y - RADIUS);
      ctx.lineTo(x - RADIUS * 2, y + RADIUS);
      ctx.closePath();
      ctx.stroke();
    }

    //Draw other nodes
    for(let node of this.nodes)
    {
      node.draw(ctx);
    }

    //Draw edges
    for(let edge of this.edges)
    {
      edge.draw(ctx);
    }
  }

  setInitialState(node)
  {
    if (this.nodes.length <= 1) return;

    this.nodes.splice(this.nodes.indexOf(node), 1);
    this.nodes.unshift(node);
  }

  toggleAcceptState(node)
  {
    node.accept = !node.accept;
  }

  getInitialState()
  {
    return this.nodes.length > 0 ? this.nodes[0] : null;
  }
}

export class Node
{
  constructor(x=0, y=0, label="q")
  {
    this.label = label;
    this.x = x;
    this.y = y;
    this.accept = false;
  }

  draw(ctx)
  {
    ctx.font = "12px Arial";
    ctx.textAlign= "center";
    ctx.fillStyle = "yellow";

    ctx.beginPath();
    ctx.arc(this.x, this.y, RADIUS, 0, PI2);
    ctx.fill();
    ctx.stroke();

    if (this.accept)
    {
      ctx.beginPath();
      ctx.arc(this.x, this.y, RADIUS_INNER, 0, PI2);
      ctx.stroke();
    }

    ctx.fillStyle = "black";
    ctx.fillText(this.label, this.x, this.y + 4);
  }
}

export class Edge
{
  constructor(from, to, label="#")
  {
    this.label = label;
    this.from = from;
    this.to = to;

    this.quad = null;
  }

  draw(ctx)
  {
    ctx.font = "12px Arial";
    ctx.textAlign= "center";
    ctx.fillStyle = "black";

    const SIXTH_PI = Math.PI / 6.0;
    const startX = this.from.x;
    const startY = this.from.y;
    const endX = this.to.x;
    const endY = this.to.y;
    const arrowWidth = 8;
    let arrowAngle = 0;

    ctx.beginPath();
    ctx.moveTo(startX, startY);

    if (this.quad == null)
    {
      arrowAngle = Math.atan2(startX - endX, startY - endY) + Math.PI;
      ctx.lineTo(endX, endY);
    }
    else
    {
      const quadX = this.quad.x;
      const quadY = this.quad.y;
      arrowAngle = Math.atan2(quadX - endX, quadY - endY) + Math.PI;
      ctx.quadraticCurveTo(quadX, quadY, endX, endY);
    }

    ctx.moveTo(
      endX - (arrowWidth * Math.sin(arrowAngle - SIXTH_PI)),
      endY - (arrowWidth * Math.cos(arrowAngle - SIXTH_PI)));
    ctx.lineTo(endX, endY);
    ctx.lineTo(
      endX - (arrowWidth * Math.sin(arrowAngle + SIXTH_PI)),
      endY - (arrowWidth * Math.cos(arrowAngle + SIXTH_PI)));
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = "black";
    ctx.fillText(this.label, this.x, this.y);
  }
}
