import Eventable from 'util/Eventable.js';

class GraphCursor //mixin Eventable
{
  constructor(graph, mouse)
  {
    this.graph = graph;
    this.mouse = mouse;

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
