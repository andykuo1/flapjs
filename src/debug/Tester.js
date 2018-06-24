const TEST_DIR = './src/debug/test/';
const fs = require('fs');

console.error("Loading tests...");
const files = fs.readdirSync(TEST_DIR);
console.error("- - - - - - - - - - - -");
console.error("Starting " + files.length + " test(s)...");
console.error("- - - - - - - - - - - -\n");

let failure = 0;
const length = files.length;
for(let i = 0; i < length; ++i)
{
  const file = files[i];
  let error = false;
  console.error("Test (" + i + "/" + length + ") - \'" + file + "\':");
  try
  {
    require("./test/" + file);
  }
  catch(e)
  {
    console.error("Exception thrown", e.stack);
    error = true;
    ++failure;
  }
  console.error(error ? "...TEST FAILURE!\n" : "...TEST SUCCESS!\n");
}
console.error("- - - - - - - - - - - -");
if (failure == 0)
{
  console.error("(" + length + "/" + length + ") tests SUCCEEDED!");
}
else
{
  console.error("(" + failure + "/" + length + ") tests FAILED!");
}
console.error("- - - - - - - - - - - -\n");

export function assertNotNull(value, msg=null)
{
  if (!value)
  {
    console.error("= = Failed: Value is null" + (msg ? " - " + msg : "."));
  }
  else
  {
    console.error("= Passed!" + (msg ? " - " + msg : ""));
  }
}

export function assertEquals(expected, value, msg=null)
{
  if (expected != value)
  {
    console.error("= = Failed: Expected \'" + expected + ", but found \'" + value + "\'" + (msg ? " - " + msg : "."));
  }
  else
  {
    console.error("= Passed!" + (msg ? " - " + msg : ""));
  }
}

export function assert(condition, msg=null)
{
  if (!condition)
  {
    console.error("= = Failed" + (msg ? " - " + msg : "."));
  }
  else
  {
    console.error("= Passed!" + (msg ? " - " + msg : ""));
  }
}
