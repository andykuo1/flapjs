const EMPTY_STRING = '#';

class NFA
{
  constructor(transitions, startState, finalStates)
  {
    this.transitions = transitions;
    this.startState = startState;
    this.finalStates = finalStates;
  }

  transition(state, symbol)
  {
    let result = [];
    for(let transition of this.transitions)
    {
      if (transition[0] == state && transition[1] == symbol)
      {
        result.push(transition[2]);
      }
    }
    return result;
  }

  solve(input)
  {
    let cachedStates = [];
    let cachedSymbols = [];
    cachedStates.push({state: this.startState, index: 0});
    let checkedStates = [];

    let state = null;
    let symbol = null;
    let nextStates = [];
    let nextIndex = 0;
    while(cachedStates.length > 0)
    {
      symbol = input.next().value;
      if (symbol != null)
      {
        cachedSymbols.push(symbol);
      }

      for(let cstate of cachedStates)
      {
        state = cstate.state;
        symbol = cstate.index < cachedSymbols.length ? cachedSymbols[cstate.index] : null;

        if (symbol != null)
        {
          //Read to next state...
          nextIndex = cstate.index + 1;
          for(let nextState of this.transition(state, symbol))
          {
            nextStates.push({state: nextState, index: nextIndex});
          }
        }
        else
        {
          if (this.finalStates.includes(state)) return true;
          checkedStates.push(state);
        }

        //Read none to next state...
        nextIndex = cstate.index;
        for(let nextState of this.transition(state, EMPTY_STRING))
        {
          if (checkedStates.includes(nextState)) continue;
          if (symbol == null && this.finalStates.includes(nextState)) return true;

          nextStates.push({state: nextState, index: nextIndex});
        }
      }
      cachedStates.length = 0;
      cachedStates.push(...nextStates);
      nextStates.length = 0;
    }

    return false;
  }
}

export default NFA;
