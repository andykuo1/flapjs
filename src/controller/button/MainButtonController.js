import GraphSorter from 'GraphSorter.js';

class MainButtonController
{
  constructor(viewport, graph, cursorController)
  {
    this.viewport = viewport;
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
      GraphSorter.sort();
    });
    const buttonExportImage = document.getElementById("export_image");
    buttonExportImage.addEventListener('click', (event) => {
      if (this.viewport instanceof HTMLImageElement)
      {
        //Export canvas to png image
        const dataURL = this.viewport.toDataURL("image/png");
        download(dataURL, EXPORT_FILE_NAME, "image/png");
      }
    });
  }

  update(dt)
  {
    GraphSorter.update(dt, this.graph);
  }
}

export default MainButtonController;
