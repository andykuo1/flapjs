class GraphParser
{
  constructor(graph)
  {
    this.graph = graph;

    this.statesElement = document.getElementById("states");
    this.symbolsElement = document.getElementById("symbols");
    this.transitionsElement = document.getElementById("transitions");
    this.startStateElement = document.getElementById("startState");
    this.finalStatesElement = document.getElementById("finalStates");

    this.states = [];
    this.symbols = [];

    this.graph.on("nodeCreate", this.evaluateNode.bind(this));
    this.graph.on("nodeDestroy", this.evaluateNode.bind(this));
    this.graph.on("edgeCreate", this.evaluateEdge.bind(this));
    this.graph.on("edgeDestroy", this.evaluateEdge.bind(this));
    this.graph.on("nodeLabel", this.evaluateNodeLabel.bind(this));
    this.graph.on("edgeLabel", this.evaluateEdgeLabel.bind(this));

    this.graph.on("newInitial", this.evaluateInitialNode.bind(this));
  }

  evaluateInitialNode(node, oldNode)
  {
    if (!node) return;

    this.startStateElement.innerText = node.label;
  }

  evaluateNode(node)
  {
    this.evaluateNodeLabel(node, node.label);
  }

  evaluateEdge(edge)
  {
    this.evaluateEdgeLabel(edge, edge.label);
  }

  evaluateNodeLabel(node, newLabel, oldLabel)
  {
    if (this.graph.getInitialState() == node)
    {
      this.evaluateInitialNode(node, null);
    }

    let stateLabels = [];
    for(const node of this.graph.nodes)
    {
      if (!node.label) continue;

      stateLabels.push(node.label);
    }
    stateLabels.sort();

    this.statesElement.innerText = stateLabels.join(", ");
  }

  evaluateEdgeLabel(edge, newLabel, oldLabel)
  {
    let edgeLabels = [];
    for(const edge of this.graph.edges)
    {
      if (!edge.label) continue;

      const labels = edge.label.split(" ");
      for(const label of labels)
      {
        if (!edgeLabels.includes(label))
        {
          edgeLabels.push(label);
        }
      }
    }
    edgeLabels.sort();

    this.symbolsElement.innerText = edgeLabels.join(", ");
  }

  parse()
  {
  }
}

export default GraphParser;
