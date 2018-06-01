import Eventable from 'util/Eventable.js';

//nodeCreate(node) - Whenever a new node is created
//nodeDestroy(node) - Whenever a node is destroyed (even on clear)
//nodeLabel(node, newLabel, oldLabel) - Whenever a node label changes
//edgeCreate(edge) - Whenever a new edge is created
//edgeDestroy(edge) - Whenever an edge is destroyed (even on clear)
//edgeLabel(edge, newLabel, oldLabel) - Whenever a node label changes
//edgeDestination(edge, newDestination, oldDestination) - Whenever a node changes destination
//toggleAccept(node) - Whenever a node changes to an accept state, or vice versa
//newInitial(node, oldNode) - Whenever a node becomes the initial state; oldNode could be null
export class NodalGraph
{
  constructor(viewport)
  {
    this.nodes = [];
    this.edges = [];

    this.viewport = viewport;
    this._offsetX = 0;
    this._offsetY = 0;
    this.nextOffsetX = 0;
    this.nextOffsetY = 0;
  }

  get centerX() { return this.viewport.width / 2 + this._offsetX; }
  get centerY() { return this.viewport.height / 2 + this._offsetY; }

  get offsetX() { return this._offsetX; }
  get offsetY() { return this._offsetY; }

  set offsetX(value) { this.nextOffsetX = value; }
  set offsetY(value) { this.nextOffsetY = value; }

  createNewNode(x, y, label)
  {
    const result = new Node(this, x, y, label);
    if (this.nodes.length == 0)
    {
      this.emit("newInitial", result, null);
    }
    this.nodes.push(result);
    this.emit("nodeCreate", result);
    return result;
  }

  destroyNode(node)
  {
    //Make sure that any connections to this node are resolved before removal
    let edge = null;
    for(let i = this.edges.length - 1; i >= 0; --i)
    {
      edge = this.edges[i];
      if (edge.from == node)
      {
        //Delete any edges that have this node as a source
        this.edges.splice(i, 1);
        this.emit("edgeDestroy", edge);
      }
      else if (edge.to == node)
      {
        //Return any edges that have this node as a destination
        edge.makePlaceholder();
      }
    }
    let nodeIndex = this.nodes.indexOf(node);
    this.nodes.splice(nodeIndex, 1);
    if (nodeIndex == 0)
    {
      this.emit("newInitial", this.getInitialState(), node);
    }
    this.emit("nodeDestroy", node);
  }

  createNewEdge(from, to, label)
  {
    const result = new Edge(this, from, to, label);
    if (result.isSelfLoop()) result.y = from.y - SELF_LOOP_HEIGHT;
    this.edges.push(result);
    this.emit("edgeCreate", result);
    return result;
  }

  destroyEdge(edge)
  {
    this.edges.splice(this.edges.indexOf(edge), 1);
    this.emit("edgeDestroy", edge);
  }

  clear()
  {
    for(let node of this.nodes)
    {
      this.emit("nodeDestroy", node);
    }
    this.nodes.length = 0;

    for(let edge of this.edges)
    {
      this.emit("edgeDestroy", edge);
    }
    this.edges.length = 0;
  }

  update(dt)
  {
    this._offsetX = lerp(this._offsetX, this.nextOffsetX, dt);
    this._offsetY = lerp(this._offsetY, this.nextOffsetY, dt);

    for(const node of this.nodes)
    {
      node.update(dt);
    }
  }

  setInitialState(node)
  {
    if (this.nodes.length <= 1) return;

    this.nodes.splice(this.nodes.indexOf(node), 1);
    const prevNode = this.nodes[0];
    this.nodes.unshift(node);
    this.emit("newInitial", node, prevNode);
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
    this._x = x;
    this._y = y;
    this.nextX = x;
    this.nextY = y;

    this._label = label;
    this._accept = false;
  }

  get x() { return this._x + this.graph.centerX; }
  get y() { return this._y + this.graph.centerY; }

  set x(value) { this.nextX = value; }
  set y(value) { this.nextY = value; }

  get label() { return this._label; }
  set label(value) {
    let prevLabel = this._label;
    this._label = value;
    this.graph.emit("nodeLabel", this, this._label, prevLabel);
  }

  get accept() { return this._accept; }
  set accept(value) {
    let prevAccept = this._accept;
    this._accept = value;
    this.graph.emit("toggleAccept", this, this._accept, prevAccept);
  }

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
    this._label = label;
    this._from = from;
    this._to = to;

    this.quad = null;
  }

  /**
  * Returns the starting point of the edge on state from
  */
  getStartPoint()
  {
    if (this.quad == null)
    {
      const dx = this.from.x - this.to.x;
      const dy = this.from.y - this.to.y;
      const angle = -Math.atan2(dy, dx) - HALF_PI;
      const xx = NODE_RADIUS * Math.sin(angle);
      const yy = NODE_RADIUS * Math.cos(angle);

      const startX = this.from.x + xx;
      const startY = this.from.y + yy;
      return [startX, startY];
    }
    else
    {
      const midpoint = this.getMidPoint();
      const quadX = midpoint[0] + (this.quad.x * 2);
      const quadY = midpoint[1] + (this.quad.y * 2);

      const dx = this.from.x - quadX;
      const dy = this.from.y - quadY;
      const angle = -Math.atan2(dy, dx) - HALF_PI + (this.isSelfLoop() ? FOURTH_PI : 0);
      const xx = NODE_RADIUS * Math.sin(angle);
      const yy = NODE_RADIUS * Math.cos(angle);

      const result = midpoint;
      result[0] = this.from.x + xx;
      result[1] = this.from.y + yy;
      return result;
    }
  }

  /**
  * Returns the point on the curve between start and end points
  */
  getCenterPoint()
  {
    const midpoint = this.getMidPoint();
    if (this.quad != null)
    {
      midpoint[0] += this.quad.x;
      midpoint[1] += this.quad.y;
    }
    return midpoint;
  }

  /**
  * Returns the ending point of the edge on state to
  */
  getEndPoint()
  {
    //Get end point for straight edges...
    if (this.quad == null)
    {
      const radius = this.isPlaceholder() ? 1 : NODE_RADIUS;
      const dx = this.from.x - this.to.x;
      const dy = this.from.y - this.to.y;
      const angle = -Math.atan2(dy, dx) - HALF_PI;
      const xx = radius * Math.sin(angle);
      const yy = radius * Math.cos(angle);

      const endX = this.to.x - xx;
      const endY = this.to.y - yy;
      return [endX, endY];
    }
    //Get end point for quadratics...
    else
    {
      //Placeholder edges are should always be straight...
      //const radius = this.isPlaceholder() ? 1 : NODE_RADIUS;
      const midpoint = this.getMidPoint();
      const quadX = midpoint[0] + (this.quad.x * 2);
      const quadY = midpoint[1] + (this.quad.y * 2);

      const dx = quadX - this.to.x;
      const dy = quadY - this.to.y;
      const angle = -Math.atan2(dy, dx) - HALF_PI + (this.isSelfLoop() ? -FOURTH_PI : 0);
      const xx = NODE_RADIUS * Math.sin(angle);
      const yy = NODE_RADIUS * Math.cos(angle);

      const result = midpoint;
      result[0] = this.to.x - xx;
      result[1] = this.to.y - yy;
      return result;
    }
  }

  /**
  * Returns the midpoint between states from and to, which may not be on the curve
  */
  getMidPoint()
  {
    const mx = this.from.x + (this.to.x - this.from.x) / 2;
    const my = this.from.y + (this.to.y - this.from.y) / 2;
    return [mx, my];
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

  get label() { return this._label; }
  set label(value) {
    let prevLabel = this._label;
    this._label = value;
    this.graph.emit("edgeLabel", this, this._label, prevLabel);
  }

  get from() { return this._from; }
  get to() { return this._to; }
  set to(value) {
    let prevDst = this._to;
    this._to = value;
    this.graph.emit("edgeDestination", this, this._to, prevDst);
  }

  makePlaceholder()
  {
    if (!this.to) this.to = { x: this.from.x + 1, y: this.from.y };
    const dx = this.from.x - this.to.x;
    const dy = this.from.y - this.to.y;
    const angle = -Math.atan2(dx, dy) - HALF_PI;
    this.to = {
      from: this.from,
      dx: Math.cos(angle),
      dy: Math.sin(angle),
      get x() { return this.from.x + PLACEHOLDER_LENGTH * this.dx; },
      get y() { return this.from.y + PLACEHOLDER_LENGTH * this.dy; }
    };
    this.quad = null;
  }

  isSelfLoop()
  {
    return this.from == this.to;
  }

  isPlaceholder()
  {
    return !(this.to instanceof Node);
  }
}

function lerp(a, b, dt)
{
  return a * (1 - dt) + b * dt;
}
