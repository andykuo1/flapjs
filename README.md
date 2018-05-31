# FlapJS
> By the students. For the students.

---

## Purpose
To make a program that is more accessible and intuitive to use, so we can become a [JFLAP](http://www.jflap.org/)-free homework group for Professor Minnes’s class (CSE 105).

## Table of Contents
* [Features](#features)
* [Setting up the workspace](#setting-up-the-workspace)
* [Running the program](#running-the-program)
* [Design notes](#design-notes)

---

## Features
### 1.0.0
- [x] Deterministic Finite Automaton
- [x] Nondeterministic Finite Automaton
- [ ] Pushdown Automaton
- [ ] Turing Machine
- [x] Nodal Graphing
  - [x] Basic layout
  - [x] Component creation
  - [x] Component deletion
  - [x] Edge redirection
  - [x] Label editing
- [ ] Formal Definition summary
  - [x] States
  - [x] Symbols
  - [x] Transitions
  - [x] Start State
  - [x] Final States
  - [ ] Tape Symbols
  - [ ] q_acc
  - [ ] q_rej
- [ ] String testing
  - [ ] DFA
  - [x] NFA
- [ ] Tape testing
  - [ ] PDA
  - [ ] TM
- [x] Export to image

### Future Development
- Additional features:
  - [ ] Keyboard navigation
  - [ ] Drag-n-drop?
  - [ ] Save / Load from file
  - [ ] Formal Definition editing
  - [ ] Autosaving
  - [ ] Auto layout
- Possible features:
  - [ ] Export to JFLAP
  - [ ] Single string parsing
  - [ ] Regular Expressions
  - [ ] Context-Free Grammars
  - [ ] Machine conversions, unions, intersections, etc.
  - [ ] Peer to peer collaboration

---

## Setting up the workspace

### Installing [Node.js](https://nodejs.org/en/)
This is required to test the program. Just get the current version and install it.

### Installing [Git](https://git-scm.com/)
This is required to edit the program remotely. Just get the current version and install it. The repository is hosted at [GitHub](https://github.com/andykuo1/flapjs).

### Installing [Atom.io](https://nodejs.org/en/)
This is not required, but recommended. Just get the current version and install it.

Otherwise, you just need a text editor to write JavaScript, HTML, and CSS code.

*(Be sure to get the compatible versions for either Windows or MacOS.)*

#### Installing Recommended Atom Packages
* [Teletype](https://teletype.atom.io/)
  * A pair programming package for collaborative programming in real-time.
* [PlatformIO IDE Terminal](https://atom.io/packages/platformio-ide-terminal)
  * An integrated terminal for the Atom.io editor. Allows you easy access to run commands.

### Getting the remote repository
Open a command line or terminal and enter a directory to where to copy the project repository. This can be anywhere in your local file system (like your home directory). For example:

```
cd ~/
```

Then, clone the [repo](https://github.com/andykuo1/flapjs.git) to the directory.

```
git clone https://github.com/andykuo1/flapjs.git
```

Navigate into the directory of the repository.

```
cd flapjs
```

To ensure and verify the state of the repository enter the following command:

```
git status
```

### Installing dependencies
Open a command line or terminal and enter into the project directory. This should be where you've copied the remote repository. Following the previous example:

```
cd ~/flapjs
```

If you are to inspect the contents of this directory, it should contain the project files, such as 'package.json'.

Then run the following command:

```
npm install
```

This should automatically start installing the dependencies listed in 'package.json'. After it finishes, it should create a directory called 'node_modules', which contains all required dependencies.

*(The 'node_modules' directory sometimes contains files unique to each platform so this directory should not be committed to the repository.)*

After that, the project is ready to run. _Happy coding!_

---

## Running the program

After saving any changes to a file, open a command line or terminal and enter into the project directory.

*(If using the recommended atom package, the in-editor terminal is automatically opened at the project directory.)*

To "compile" the scripts:

```
npm run build
```

Then, open 'index.html' in your web browser. Either by just opening the file itself or running the command:

```
open index.html
```

Another way to quickly test the program:

```
npm test
```

This will run all appropriate commands to bundle and build the program, then will run it in your default web browser.

---

## Design notes

### Deterministic Finite Automaton
	DFA = {Q, SIGMA, DELTA, q0, F}

### Nondeterministic Finite Automaton
	NFA = {Q, SIGMA, DELTA, q0, F} (where empty string is a symbol)

### Pushdown Automaton
	PDA = {Q, SIGMA, GAMMA, DELTA, q0, F}

### Turing Machines
	TM = {Q, SIGMA, GAMMA, DELTA, q0, q_acc, q_rej}

### Regular Expressions
	REGEX = { EXPRESSIONS }

### Context-Free Grammars
	CFG = {V, SIGMA, R, A, S}

---

## Design Problems
Should touch-screens be supported? If so, how should the controls work?

More specifically, moving states and creating edges currently both use dragging, but one is for each button on the mouse. For touch, however, this would be the same action. What is the solution?

> Answer: Maybe a separate on-screen “move” button, where one can hold that button to move objects. Normal input behavior is then ignored until button is released. Can also be toggled, if tapped.
However, this is only the case if on mobile. Otherwise, right-clicks are considered to be “move” inputs when on computers.

Also, keyboards are annoying on phones. How can we minimize that?

> Possible Answer: Drag-and-drop predefined constants? Like 0, 1, EMPTY?

Also also, Turing Machines should automatically create q_acc and q_rej. However, this is problem for keyboard-users, since there is not a way to easily connect two existing states. (Right now, it connects an existing state to a new one.) How should this be implemented efficiently and intuitively?

Thirdly, formal definitions should reflect the graph’s contents. Should it also be editable and generate a graph from the changes?

The program should also autosave the previous graph, regardless if the person explicitly saves it. Should be able to be saved to cookies. This option should also be toggleable.

The program should also be able to export to JFLAP.

The program should also be able to export to image file.

The program should also be able to save / load graphs.

---

## Design Solutions

### **Nodal Graphing (Mouse only / Keyboard only)**
### *(Non) Deterministic Finite Automaton*
#### DFA = {Q, SIGMA, DELTA, q0, F}
##### Q: (Single-Click) to create state.
- [key=SPACE] to create state, connected to current state, then move to that state.
- [key=SHIFT-SPACE] to create state, connected to current state, then not move.
- [key=CTRL-SPACE] to create state, with no connections, then move to that state.
- [key=HOME / END] to move to start or cycle final states.
- [key=LEFT / RIGHT / UP / DOWN] to move to start if none selected, or move to left / right / up / down nearest state. If none found, move to nearest state.
- [key=SHIFT-LEFT / SHIFT-RIGHT / SHIFT-UP / SHIFT-DOWN] to select left / right / up / down connected state, then continue to cycle through connected states. When release [SHIFT], cursor will move to that state.


- To delete state:
  - (Click-Drag: “move”) the state to TRASH CAN.
  - [key=DELETE] to delete current state.
  - (Src edges will be deleted, but dst edges return.)


- To move the state around:
  - (Click-Drag: “move”) the state.


- (If on mobile: “move” inputs are ignored unless MOVESTATE is active. There should be a button that can be toggled on tap, or held down to activate MOVESTATE. This should resolve the conflict with creating edges.)
- (If DFA: Every state should already have edges for every SIGMA)
- (If DFA: Should create with initial values of 0)
- (If NFA: Should create with initial values as EMPTY_STRING)

##### SIGMA: Implied from DELTA.
- (If NFA: empty string is also a symbol)

##### DELTA: (Click-Drag) to create edge.
- To change read symbol:
  - (Single-Click) center, then it will open a text field.
  - [key=TAB] to cycle through labels from current state


- To change the destination:
  - (Click-Drag) endpoint to state.


- To delete edge:
  - (Click-Drag) endpoint to empty space.
  - [key=DELETE] to delete current edge.
  - (If DFA: you cannot delete; it will just return to src state)


- To bend arrow:
  - (Click-Drag: “move”) center

##### q0: Implied. The first state created.

##### F: (Single-Click) on state to toggle as final state.

### *Pushdown Automaton*
#### PDA = {Q, SIGMA, GAMMA, DELTA, q0, F}
##### Q: Same as DFA.
- (Should create with initial values as EMPTY_STRING)

##### SIGMA: Same as DFA.

##### GAMMA: Implied from DELTA.

##### DELTA: Same as DFA.
- To change read symbol: Same as DFA.


- To change pop symbol: Same as DFA for read symbols.


- To change push symbol: Same as DFA for read symbols.
  - [key=SPACE] while editing label to goto next symbol.

##### q0: Same as DFA.

##### F: Same as DFA.

### *Turing Machines*
#### TM = {Q, SIGMA, GAMMA, DELTA, q0, q_acc, q_rej}
##### Q: Same as DFA.
- (Should create with initial values as EMPTY_STRING)

##### SIGMA: Same as DFA.

##### GAMMA: Same as PDA.

##### DELTA: Same as DFA.

- To change read symbol: Same as DFA.


- To change write symbol: Same as DFA for read symbols.


- To change move symbol: Same as DFA for read symbols.
  - (this should be automatically capitalized)
  - [key=SPACE] while editing label to goto next symbol.

##### q0: Same as DFA.

##### q_acc: Implied. Created at beginning, not connected to anything.
- ??? (How to connect q_acc by keyboard?)

##### q_rej: Implied. Created at beginning.
- (Can be toggled in options, whether to be visible)
- (Can be toggled in options, whether to automatically connect all unspecified states to q_rej, as by convention)

## **Formal Definition (Keyboard only)**
### *Deterministic Finite Automaton*
#### DFA = {Q, SIGMA, DELTA, q0, F}
- Nothing so far.

### Nondeterministic Finite Automaton
#### NFA = {Q, SIGMA, DELTA, q0, F} (where empty string is a symbol)
- Nothing so far.

### Pushdown Automaton
#### PDA = {Q, SIGMA, GAMMA, DELTA, q0, F}
- Nothing so far.

### Turing Machines
#### TM = {Q, SIGMA, GAMMA, DELTA, q0, q_acc, q_rej}
- Nothing so far.

## String Parsing (Keyboard only)
- Nothing so far.

## String Testing / Tape Testing
- Input field and then run the string on the current graph.

## Auto-Layout
- Progression-Based Horizontal / Vertical
- Circular
- Outward
- Scatter


## Other Notes
Should dragging be allowed to exit and re-enter the canvas? Or should everything be cancelled on exit?
3v - 6 >= e
