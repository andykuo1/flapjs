import CursorController from 'controller/cursor/CursorController.js';

import * as Config from 'config.js';

class EditCursorController extends CursorController
{
  constructor(mainController, graph)
  {
    super(graph);

    this.mainController = mainController;
  }

  onSingleTap(cursor, x, y, target, targetType)
  {
    if (targetType == "node")
    {
      //Toggle accept for selected node
      this.graph.toggleAcceptState(target);
      return true;
    }
    else if (targetType == "edge")
    {
      //Edit label for selected edge
      this.mainController.openLabelEditor(target);
      return true;
    }

    return false;
  }

  onDoubleTap(cursor, x, y, target, targetType)
  {
    if (target == null)
    {
      //Create state at position
      this.mainController.createNewState(x - this.graph.centerX, y - this.graph.centerY);
      return true;
    }

    return false;
  }

  onStartDragging(cursor, x, y, target, targetType)
  {
    if (targetType == "node")
    {
      //Begin creating edge...
      const edge = this.mainController.createNewTransition(target, null, Config.STR_TRANSITION_PROXY_LABEL);
      this.mainController.startMove(edge, "endpoint");
      return true;
    }

    return false;
  }
}

export default EditCursorController;
