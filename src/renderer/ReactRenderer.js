import { Node } from 'graph/NodalGraph.js';

import React from 'react';
import ReactDOM from 'react-dom';

import App from 'app/App.js';

import * as Config from 'config.js';

var hoverAngle = 0;
class ReactRenderer
{
  constructor(viewport, graph, controller)
  {
    this.viewport = viewport;
    this.graph = graph;
    this.controller = controller;
    this.root = document.getElementById("root");

    //TODO: Unable to export to png for svg...
    const buttonExportImage = document.getElementById("export_image");
    buttonExportImage.disabled = true;
  }

  render()
  {
    //Render the app in <div id="root"></div>
    ReactDOM.render(React.createElement(App, {graph: this.graph, controller: this.controller}, null), this.root);
  }
}

export default ReactRenderer;
