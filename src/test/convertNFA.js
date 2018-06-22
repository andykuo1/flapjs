import DFA from 'machine/DFA.js';

function convertToDFA(nfa)
{
  const result = new DFA();

  const alphabet = nfa.getAlphabet();
  const transitionTable = new Map();
  const startState = nfa.getStartState();
  const newStartState = result.newState("{" + startState + "}");

  const queue = [];
  queue.push(newStartState);

  //Until the queue is empty...
  while(queue.length > 0)
  {
    //Get a DFA state p from the queue...
    const newState = queue.shift();

    //For each input symbol a in alphabet...
    for(const a of alphabet)
    {
      //Find the set of successor states...
      const successors = [];

      //For every NFA state in p...
      const states = newState.substring(1, newState.length - 1).split(",");
      for(const state of states)
      {
        //Get the destination states for transition...
        for(const nextState of nfa.doTransition(state, a))
        {
          successors.push(nextState);
        }
      }
      successors.sort();

      //If r is the empty set, then it will be a dead state
      if (successors.length <= 0)
      {
        const successorState = "{}";
        if (!result.hasState(successorState))
        {
          result.newState(successorState);

          //All exiting transitions will only lead back to itself
          for(const a of alphabet)
          {
            result.newTransition(successorState, a, successorState);
          }
        }
      }
      //Otherwise, if not already a state in D, add it to the queue
      else
      {
        const successorState = "{" + successors.join(",") + "}";
        if (!result.hasState(successorState))
        {
          queue.push(successorState);
        }
      }

      //Add states r as an entry to transition table for input a from state p
      transitionTable.set(newState + ":" + a, successors);
    }
  }

  //Set of states Q in D equals the set of row headers in transition table

  //Scan through Q and add any state containing at least one accepting state of N to final

  return result;
}
