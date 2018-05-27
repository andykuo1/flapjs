import Eventable from 'util/Eventable.js';

class GraphCursor //mixin Eventable
{
  constructor(graph, mouse)
  {
    this.graph = graph;
    this.mouse = mouse;

    this.prevTargetX = 0;
    this.prevTargetY = 0;
    this.prevTargetNode = null;
    this.prevTargetEdge = null;
    this.prevTargetEndPoint = null;

    this.targetSource = null;
    this.targetDestination = null;
    this.targetMode = null;
  }

  getNodeAt(x, y)
  {
    for(const node of this.graph.nodes)
    {
      const dx = x - node.x;
      const dy = y - node.y;
      if (dx * dx + dy * dy < NODE_RADIUS_SQU)
      {
        return node;
      }
    }

    return null;
  }

  getEdgeAt(x, y)
  {
    //if (this.prevTargetX == x && this.prevTargetY == y) return this.prevTargetEdge;

    for(const edge of this.graph.edges)
    {
      const dx = x - edge.x;
      const dy = y - edge.y;
      if (dx * dx + dy * dy < EDGE_RADIUS_SQU)
      {
        return edge;
      }
    }

    return null;
  }

  getEdgeByEndPointAt(x, y)
  {
    //if (this.prevTargetX == x && this.prevTargetY == y) return this.prevTargetEndPoint;

    for(const edge of this.graph.edges)
    {
      const point = edge.getEndPoint();
      const dx = x - point[0];
      const dy = y - point[1];
      if (dx * dx + dy * dy < ENDPOINT_RADIUS_SQU)
      {
        return edge;
      }
    }

    return null;
  }
}
Object.assign(GraphCursor.prototype, Eventable);

export default GraphCursor;
