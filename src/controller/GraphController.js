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
  }

  initialize()
  {
    this.cursors.load();
    this.buttons.load();
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

export default GraphController;
