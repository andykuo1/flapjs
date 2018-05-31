class DFA
{
  constructor(transitions, startState, finalStates)
  {
    this.transitions = transitions;
    this.startState = startState;
    this.finalStates = finalStates;
  }

  transition(state, symbol)
  {
    for(let transition of this.transitions)
    {
      if (transition[0] == state && transition[1] == symbol)
      {
        return transition[2];
      }
    }
    return null;
  }

  solve(input)
  {
    let state = this.startState;
    let symbol = null;
    while((symbol = input.next().value) != null)
    {
      state = this.transition(state, symbol);
    }
    return this.finalStates.includes(state);
  }
}

export default DFA;
