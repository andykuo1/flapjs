export class DFA
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

//node --experimental-modules ./src/DFA.mjs

let machine = new DFA(
  [["0", "0", "1"],
  ["0", "1", "0"],
  ["1", "0", "1"],
  ["1", "1", "1"]],
  "0", ["0"]);

test("", machine);
test("0", machine);
test("1", machine);
test("011111", machine);
test("11010101", machine);
test("1111", machine);

function test(string, machine)
{
  console.log(string + " > " + machine.solve(string[Symbol.iterator]()));
}
