import * as TEST from '../Tester.js';
import DFA from 'machine/DFA.js';
import NFA from 'machine/NFA.js';
import Symbols from 'machine/Symbols.js';

import { convertToDFA } from 'machine/util/convertNFA.js';

let nfa = new NFA();
let result = convertToDFA(nfa);
TEST.assertNotNull(result);
