import CursorController from 'controller/cursor/CursorController.js';

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
      this.graph.toggleAcceptState(target);
      return true;
    }
    else if (targetType == "edge")
    {
      this.mainController.openLabelEditor(target);
      return true;
    }

    return false;
  }

  onDoubleTap(cursor, x, y, target, targetType)
  {
    if (target == null)
    {
      this.mainController.createNewState(x - this.graph.centerX, y - this.graph.centerY);
      return true;
    }

    return false;
  }

  onStartDragging(cursor, x, y, target, targetType)
  {
    if (targetType == "node")
    {
      const edge = this.mainController.createNewTransition(target, null, STR_TRANSITION_PROXY_LABEL);
      this.mainController.startMove(edge, "endpoint");
      return true;
    }
    else if (target == null)
    {
      //Begin selection box...
    }

    return false;
  }

  onStopDragging(cursor, x, y, target, targetType)
  {
    //If making selection box...
    //Mark all selected targets and return true
    return false;
  }
}

export default EditCursorController;
