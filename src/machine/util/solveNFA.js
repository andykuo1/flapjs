import { EMPTY } from 'machine/Symbols.js';

export function solveNFA(nfa, input)
{
  if (typeof input == 'string') input = input[Symbol.iterator]();

  let cachedStates = [];
  let cachedSymbols = [];
  cachedStates.push({state: nfa.getStartState(), index: 0});
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
        for(let nextState of nfa.doTransition(state, symbol))
        {
          nextStates.push({state: nextState, index: nextIndex});
        }
      }
      else
      {
        if (nfa.isFinalState(state)) return true;
        checkedStates.push(state);
      }

      //Read none to next state...
      nextIndex = cstate.index;
      for(let nextState of nfa.doTransition(state, EMPTY))
      {
        if (checkedStates.includes(nextState)) continue;
        if (symbol == null && nfa.isFinalState(nextState)) return true;

        nextStates.push({state: nextState, index: nextIndex});
      }
    }
    cachedStates.length = 0;
    cachedStates.push(...nextStates);
    nextStates.length = 0;
  }

  return false;
};
