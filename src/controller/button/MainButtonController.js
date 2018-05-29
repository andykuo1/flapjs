import NodalGraphSorter from 'NodalGraphSorter.js';

class MainButtonController
{
  constructor(canvas, graph, cursorController)
  {
    this.canvas = canvas;
    this.graph = graph;

    this.cursorController = cursorController;
  }

  load()
  {
    //Setup buttons
    const buttonNewState = document.getElementById("new_state");
    buttonNewState.addEventListener('click', (event) => {
      //Create new state
      this.cursorController.createNewState();
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

  update(dt)
  {
    NodalGraphSorter.update(dt, this.graph);
  }
}

export default MainButtonController;
