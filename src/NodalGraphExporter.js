class NodalGraphExporter
{
  constructor(graph)
  {
    this.graph = graph;

    this.graphLabelStates = document.getElementById("graph-states");

    this.graph.on("nodeCreate", this.onNodeCreate.bind(this));
    this.graph.on("nodeDestroy", this.onNodeDestroy.bind(this));
  }

  onNodeCreate(node)
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

  onNodeDestroy(node)
  {
    this.graphLabelStates.removeChild(node._element);
  }
}

export default NodalGraphExporter;
