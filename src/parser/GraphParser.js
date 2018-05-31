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

    this.graph.on("nodeCreate", this.onNode.bind(this));
    this.graph.on("nodeDestroy", this.onNode.bind(this));
    this.graph.on("nodeLabel", this.onNode.bind(this));
    this.graph.on("edgeCreate", this.onEdge.bind(this));
    this.graph.on("edgeDestroy", this.onEdge.bind(this));
    this.graph.on("edgeLabel", this.onEdge.bind(this));
    this.graph.on("edgeDestination", this.onEdgeDestination.bind(this))

    this.graph.on("newInitial", this.onNewInitial.bind(this));
    this.graph.on("toggleAccept", this.onToggleAccept.bind(this));
  }

  evaluateStates()
  {
    let result = [];
    for(const node of this.graph.nodes)
    {
      if (!node.label) continue;

      result.push(node.label);
    }
    result.sort();

    this.statesElement.innerText = result.join(", ");
  }

  evaluateSymbols()
  {
    let result = [];
    for(const edge of this.graph.edges)
    {
      if (!edge.label) continue;

      const labels = edge.label.split(" ");
      for(const label of labels)
      {
        if (!result.includes(label))
        {
          result.push(label);
        }
      }
    }
    result.sort();

    this.symbolsElement.innerText = result.join(", ");
  }

  evaluateTransitions()
  {
    let result = [];
    for(const edge of this.graph.edges)
    {
      if (!edge.label) continue;

      const labels = edge.label.split(" ");
      for(const label of labels)
      {
        const fromLabel = edge.from ? edge.from.label : "undefined";
        const toLabel = edge.to ? edge.to.label : "undefined";
        result.push("<li>(" + fromLabel + ", " + label + ") &rarr; " + toLabel);
      }
    }
    result.sort();

    this.transitionsElement.innerHTML = result.join(",</li>");
  }

  evaluateStartState()
  {
    const node = this.graph.getInitialState();
    this.startStateElement.innerText = node ? node.label : "";
  }

  evaluateFinalStates()
  {
    let result = [];
    for(const node of this.graph.nodes)
    {
      if (!node.label) continue;

      if (!node.accept) continue;
      result.push(node.label);
    }
    result.sort();

    this.finalStatesElement.innerText = result.join(", ");
  }

  onNode(node)
  {
    //Change label for initial if the label for it changed...
    if (this.graph.getInitialState() == node)
    {
      this.evaluateStartState();
    }

    //Change label for accepts if the label for it changed...
    if (node.accept)
    {
      this.evaluateFinalStates();
    }

    //Compute states
    this.evaluateStates();

    //Compute transitions
    this.evaluateTransitions();
  }

  onEdge(edge)
  {
    //Compute symbols
    this.evaluateSymbols();

    //Compute transitions
    this.evaluateTransitions();
  }

  onEdgeDestination(edge, newDestination, oldDestination)
  {
    //Compute transitions
    this.evaluateTransitions();
  }

  onNewInitial(node)
  {
    //Compute initial state
    this.evaluateStartState();
  }

  onToggleAccept(node)
  {
    //Compute final states
    this.evaluateFinalStates();
  }

  parse()
  {
  }
}

export default GraphParser;
