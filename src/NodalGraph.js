import Eventable from 'util/Eventable.js';

export class NodalGraph
{
  constructor(canvas)
  {
    this.nodes = [];
    this.edges = [];

    this.graphLabelStates = document.getElementById("graph-states");

    this.canvas = canvas;
    this._offsetX = 0;
    this._offsetY = 0;
    this.nextOffsetX = 0;
    this.nextOffsetY = 0;

    this._simulatePhysics = false;
  }

  get centerX() { return this.canvas.width / 2 + this._offsetX; }
  get centerY() { return this.canvas.height / 2 + this._offsetY; }

  get offsetX() { return this._offsetX; }
  get offsetY() { return this._offsetY; }

  set offsetX(value) { this.nextOffsetX = value; }
  set offsetY(value) { this.nextOffsetY = value; }

  onCreateNode(node)
  {
    const element = document.createElement("label");
    element.setAttribute("contenteditable", "true");
    element.addEventListener('input', (event) => {
      node.label = element.textContent;
    });
    element.innerHTML = node.label;
    node._element = element;
    this.graphLabelStates.appendChild(element);
  }

  onDestroyNode(node)
  {
    this.graphLabelStates.removeChild(node._element);
  }

  onCreateEdge(edge)
  {

  }

  onDestroyEdge(edge)
  {

  }

  createNewNode()
  {
    const result = new Node(this, 0, 0);
    this.nodes.push(result);
    this.onCreateNode(result);
    return result;
  }

  destroyNode(node)
  {
    this.nodes.splice(this.nodes.indexOf(node), 1);
    this.onDestroyNode(node);
  }

  createNewEdge(from, to)
  {
    const result = new Edge(this, from, to);
    if (from == to) result.y = from.y - SELF_LOOP_HEIGHT;
    this.edges.push(result);
    this.onCreateEdge(result);
    return result;
  }

  destroyEdge(edge)
  {
    this.edges.splice(this.edges.indexOf(edge), 1);
    this.onDestroyEdge(edge);
  }

  clear()
  {
    for(let node of this.nodes)
    {
      this.onDestroyNode(node);
    }
    this.nodes.length = 0;

    for(let edge of this.edges)
    {
      this.onDestroyEdge(edge);
    }
    this.edges.length = 0;
  }

  update(dt)
  {
    this._offsetX = lerp(this._offsetX, this.nextOffsetX, dt);
    this._offsetY = lerp(this._offsetY, this.nextOffsetY, dt);

    //Simulate physics
    if (this._simulatePhysics)
    {
      let flag = false;
      for(const node of this.nodes)
      {
        for(const other of this.nodes)
        {
          if (node == other) continue;
          const dx = node.nextX - other.nextX;
          const dy = node.nextY - other.nextY;
          if (dx * dx + dy * dy < PADDING_RADIUS_SQU)
          {
            node.nextX += dx * 0.5;
            node.nextY += dy * 0.5;
            flag = true;
          }
        }
      }
      this._simulatePhysics = flag;
    }

    for(let node of this.nodes)
    {
      node.update(dt);
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
//Mixin Eventable
Object.assign(NodalGraph.prototype, Eventable);

export class Node
{
  constructor(graph, x=0, y=0, label="q")
  {
    this.graph = graph;
    this.label = label;
    this._x = x;
    this._y = y;
    this.nextX = x;
    this.nextY = y;
    this.accept = false;

    this._shouldPhysics = true;
    this._physicsTicks = 0;
  }

  get x() { return this._x + this.graph.centerX; }
  get y() { return this._y + this.graph.centerY; }

  set x(value) { this.nextX = value; }
  set y(value) { this.nextY = value; }

  update(dt)
  {
    this._x = lerp(this._x, this.nextX, dt);
    this._y = lerp(this._y, this.nextY, dt);
  }
}

export class Edge
{
  constructor(graph, from, to, label="#")
  {
    this.graph = graph;
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
}

function lerp(a, b, dt)
{
  return a * (1 - dt) + b * dt;
}
