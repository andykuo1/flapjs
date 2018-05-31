import MainCursorController from 'controller/cursor/MainCursorController.js';
import MainButtonController from 'controller/button/MainButtonController.js';
import GraphParser from 'parser/GraphParser.js';

class GraphController
{
  constructor(canvas, graph, mouse)
  {
    this.graph = graph;
    this.mouse = mouse;
    this.canvas = canvas;

    this.cursors = new MainCursorController(this.graph, this.mouse);
    this.buttons = new MainButtonController(this.canvas, this.graph, this.cursors);

    this.parser = new GraphParser(this.graph);

    this.mode = new ModeNFA(this);
  }

  initialize()
  {
    this.cursors.load();
    this.buttons.load();

    this.mode.activate();
  }

  update(dt)
  {
    this.cursors.update(dt);
    this.buttons.update(dt);
  }

  render(ctx)
  {
    this.cursors.draw(ctx);
  }
}

class ModeDFA
{
  constructor(controller)
  {
    this.controller = controller;
    this._onEdgeCreate = this.onEdgeCreate.bind(this);
    this._onEdgeDestroy = this.onEdgeDestroy.bind(this);

    //TODO: create transitions (or symbols) in order to be deterministic
    //TODO: delete transitions (or symbols) if all are placeholders
  }

  onEdgeCreate(edge)
  {

  }

  onEdgeDestroy(edge)
  {

  }

  activate()
  {
    this.controller.cursors.shouldDestroyPointlessEdges = false;
    this.controller.graph.addListener("edgeCreate", this._onEdgeCreate);
    this.controller.graph.addListener("edgeDestroy", this._onEdgeDestroy);
  }

  deactivate()
  {
    this.controller.cursors.shouldDestroyPointlessEdges = DEFAULT_SHOULD_DESTROY_POINTLESS_EDGE;
    this.controller.graph.removeListener("edgeCreate", this._onEdgeCreate);
    this.controller.graph.removeListener("edgeDestroy", this._onEdgeDestroy);
  }
}

class ModeNFA
{
  constructor(controller)
  {
    this.controller = controller;
  }

  activate()
  {
    this.controller.cursors.shouldDestroyPointlessEdges = true;
  }

  deactivate()
  {
    this.controller.cursors.shouldDestroyPointlessEdges = DEFAULT_SHOULD_DESTROY_POINTLESS_EDGE;
  }
}

export default GraphController;
