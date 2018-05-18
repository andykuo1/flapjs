const RADIUS = 16;
const DIAMETER = RADIUS * 2;
const RADIUS_INNER = 12;
const PI2 = Math.PI * 2;
const HALF_PI = Math.PI / 2.0;
const SIXTH_PI = Math.PI / 6.0;
const ARROW_WIDTH = 8;

export class NodalGraph
{
  constructor(canvas)
  {
    this.nodes = [];
    this.edges = [];

    this.canvas = canvas;
  }

  get centerX() { return this.canvas.width / 2; }

  get centerY() { return this.canvas.height / 2; }

  createNewNode()
  {
    const result = new Node(this.centerX, this.centerY);
    this.nodes.push(result);
    return result;
  }

  createNewEdge(from, to)
  {
    const result = new Edge(from, to);
    this.edges.push(result);
    return result;
  }

  draw(ctx, dt)
  {
    //Draw initial node
    if (this.nodes.length > 0)
    {
      const initial = this.getInitialState();
      const x = initial.x;
      const y = initial.y;

      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(x - RADIUS, y);
      ctx.lineTo(x - DIAMETER, y - RADIUS);
      ctx.lineTo(x - DIAMETER, y + RADIUS);
      ctx.closePath();
      ctx.stroke();
    }

    //Draw other nodes
    for(let node of this.nodes)
    {
      node.update(dt);
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
    this._x = x;
    this._y = y;
    this.nextX = x;
    this.nextY = y;
    this.accept = false;
  }

  get x() { return this._x; }
  get y() { return this._y; }

  set x(value) { this.nextX = value; }
  set y(value) { this.nextY = value; }

  update(dt)
  {
    this._x = lerp(this._x, this.nextX, dt);
    this._y = lerp(this._y, this.nextY, dt);
  }

  draw(ctx)
  {
    ctx.font = "12px Arial";
    ctx.textAlign= "center";
    ctx.strokeStyle = "black";
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

  get centerX() { return this.from.x + (this.to.x - this.from.x) / 2; }
  get centerY() { return this.from.y + (this.to.y - this.from.y) / 2; }

  get x() {
    const cx = this.centerX;
    return this.quad != null ? this.quad.x + cx : cx;
  }
  get y() {
    const cy = this.centerY;
    return this.quad != null ? this.quad.y + cy : cy;
  }

  set x(value) {
    if (this.quad == null) this.quad = {x: 0, y: 0};
    this.quad.x = value - this.centerX;
    if (Math.abs(this.quad.x) < 8) this.quad.x = 0;
    if (this.quad.x == 0 && this.quad.y == 0) this.quad = null;
  }

  set y(value) {
    if (this.quad == null) this.quad = {x: 0, y: 0};
    this.quad.y = value - this.centerY;
    if (Math.abs(this.quad.y) < 8) this.quad.y = 0;
    if (this.quad.x == 0 && this.quad.y == 0) this.quad = null;
  }

  draw(ctx)
  {
    const dx = this.from.x - this.to.x;//TODO: Apply quad to this
    const dy = this.from.y - this.to.y;
    const angle = -Math.atan2(dy, dx) - HALF_PI;
    const xx = RADIUS * Math.sin(angle);
    const yy = RADIUS * Math.cos(angle);

    ctx.font = "12px Arial";
    ctx.textAlign= "center";
    ctx.strokeStyle = "black";

    const startX = this.from.x + xx;
    const startY = this.from.y + yy;
    const endX = this.to.x - xx;
    const endY = this.to.y - yy;
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
      const quadX = this.centerX + (this.quad.x * 2);
      const quadY = this.centerY + (this.quad.y * 2);
      arrowAngle = Math.atan2(quadX - endX, quadY - endY) + Math.PI;
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

    const cx = this.label.length * 3;
    ctx.clearRect(this.x - cx - 2, this.y - 6, (cx * 2) + 4, 12);
    ctx.fillStyle = "black";
    ctx.fillText(this.label, this.x, this.y + 4);
  }
}

function lerp(a, b, dt)
{
  return a * (1 - dt) + b * dt;
}
