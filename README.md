# FlapJS
> By the students. For the students.

---

## Purpose
To make a program that is more accessible and intuitive to use, so we can become a [JFLAP](http://www.jflap.org/)-free homework group for Professor Minnes’s class (CSE 105).

## Table of Contents
* [Features](#features)
* [Setting up the workspace](#setting-up-the-workspace)
* [Running the program](#running-the-program)

---

## Features
### 1.0.0
- Graph Representation:
  - [x] Deterministic Finite Automaton
  - [x] Nondeterministic Finite Automaton
  - [ ] Pushdown Automaton
  - [ ] Context-Free Grammar
  - [ ] Turing Machine
- Machine Testing:
  - [x] Deterministic Finite Automaton
  - [x] Nondeterministic Finite Automaton
  - [ ] Pushdown Automaton
  - [ ] Context-Free Grammar
  - [ ] Turing Machine
- Formal Definition Summary:
  - [x] Deterministic Finite Automaton
  - [x] Nondeterministic Finite Automaton
  - [ ] Pushdown Automaton
  - [ ] Context-Free Grammar
  - [ ] Turing Machine
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

## Notes

3v - 6 >= e
