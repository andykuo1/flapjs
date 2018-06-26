import DFA from 'machine/DFA.js';
import NFA from 'machine/NFA.js';

export function parseGraphToFSA(graph, dst)
{
  const result = dst;

  for(const node of graph.nodes)
  {
    const state = node.label;
    result.newState(state);
    if (node.accept)
    {
      result.setFinalState(state);
    }
  }
  result.setStartState(graph.getInitialState().label);

  for(const edge of graph.edges)
  {
    result.newTransition(edge.from.label, edge.to.label, edge.label);
  }

  return result;
}
