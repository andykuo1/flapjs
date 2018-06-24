import DFA from 'machine/DFA.js';
import { EMPTY } from 'machine/Symbols.js';

export function convertToDFA(nfa)
{
  const result = new DFA();

  const alphabet = nfa.getAlphabet();
  const startState = nfa.getStartState();

  //Make new DFA start state
  let nextStates = nfa.doClosureTransition(startState);
  const newStartState = result.newState(fromSetToString(nextStates));

  //Start expansion with the start state
  const states = [];
  states.push(newStartState);

  //While there are still more states to expand from...
  while(states.length > 0)
  {
    const nextState = states.shift();
    nextStates = expandState(nextState, nfa, dfa);

    //Push all nextStates to end of states
    for(const s of nextStates)
    {
      states.push(s);
    }
  }

  return result;
}

function expandState(state, nfa, dfa)
{
  const result = [];
  const alphabet = nfa.getAlphabet();

  let terminals = [];
  let nfaStates = null;
  let dfaState = null;

  for(const symbol of alphabet)
  {
    //Get all closed reachable states...
    nfaStates = fromStringToSet(state);
    for(const s of nfaStates)
    {
      nfa.doTerminalTransition(s, symbol, terminals);
    }

    //If has reachable states...
    if (terminals.length > 0)
    {
      dfaState = fromSetToString(terminals);

      //Create state if it does not exist...
      if (!result.includes(dfaState))
      {
        dfa.newState(dfaState);
        result.push(dfaState);
      }

      //Create transition for reachable state
      dfa.newTransition(state, dfaState, symbol);
    }

    //Reset list
    terminals.length = 0;
  }

  return result;
}

function fromSetToString(set)
{
  set.sort();
  return "{" + set.join(",") + "}";
}

function fromStringToSet(string)
{
  return string.substring(1, string.length - 1).split(",");
}
