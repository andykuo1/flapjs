
//node --experimental-modules ./src/DFA.mjs

let machine;

machine = new DFA(
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

//node --experimental-modules ./src/NFA.mjs

console.log("Machine 1");
machine = new NFA(
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
console.log("");

console.log("Machine 2");
machine = new NFA(
  [["0", "0", "1"],
  ["0", "1", "2"],
  ["1", "#", "2"],
  ["1", "#", "0"],
  ["1", "0", "1"],
  ["1", "1", "1"]],
  "0", ["2"]);

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
