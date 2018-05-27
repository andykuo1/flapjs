import NodalGraphSorter from 'NodalGraphSorter.js';

import GraphCursor from 'GraphCursor.js';
import LabelEditor from 'controller/LabelEditor.js';

import MoveController from 'controller/MoveController.js';
import EditController from 'controller/EditController.js';
import HoverController from 'controller/HoverController.js';

class NodalGraphController
{
  constructor(canvas, mouse, graph)
  {
    this.canvas = canvas;
    this.mouse = mouse;
    this.graph = graph;

    this.cursor = new GraphCursor(graph, mouse);
    this.labelEditor = new LabelEditor();

    this.moveController = new MoveController(graph, this.cursor);
    this.editController = new EditController(graph, this.cursor, this.labelEditor, this.moveController);
    this.hoverController = new HoverController(graph, this.cursor);

    this.moveMode = false;
  }

  load()
  {
    this.mouse.on('mousedown', (mouse, button) => {
      this.moveMode = (button == 3);
      this.markTarget(mouse.x, mouse.y);
    });
    this.mouse.on('mouseup', (mouse, button) => {
      this.releaseTarget(mouse.x, mouse.y);
    });

    //Setup buttons
    const buttonNewState = document.getElementById("new_state");
    buttonNewState.addEventListener('click', (event) => {
      //Create new state
      this.editController.createNewState();
    });
    const buttonClearGraph = document.getElementById("clear_graph");
    buttonClearGraph.addEventListener('click', (event) => {
      //Clear graph
      this.graph.clear();
    });
    const buttonSimulatePhysics = document.getElementById("simulate_physics");
    buttonSimulatePhysics.addEventListener('click', (event) => {
      //Begin to simulate physics for graph...
      NodalGraphSorter.sort();
    });
    const buttonExportImage = document.getElementById("export_image");
    buttonExportImage.addEventListener('click', (event) => {
      //Export canvas to png image
      const dataURL = this.canvas.toDataURL("image/png");
      download(dataURL, EXPORT_FILE_NAME, "image/png");
    });
  }

  draw(ctx, dt)
  {
    const mx = this.mouse.x;
    const my = this.mouse.y;

    //Get hovered states
    this.cursor.targetDestination = this.cursor.getNodeAt(mx, my);

    this.editController.updateEdit(ctx, mx, my);

    //Update the moving target if dragging object...
    if (this.moveController.isMoving())
    {
      this.moveController.updateMove(mx, my);
    }

    //Draw hover
    this.hoverController.draw(ctx);
  }

  markTarget(x, y)
  {
    if (this.labelEditor.isOpen()) return;

    if (this.moveMode)
    {
      this.moveController.beginMove(x, y);
    }
    else
    {
      this.editController.beginEdit(x, y);
    }
  }

  releaseTarget(x, y)
  {
    if (this.labelEditor.isOpen())
    {
      this.labelEditor.close(false);
      return;
    }

    if (this.moveMode)
    {
      this.moveController.endMove(x, y);
    }
    else
    {
      this.editController.endEdit(x, y);
    }
  }
}

export default NodalGraphController;
