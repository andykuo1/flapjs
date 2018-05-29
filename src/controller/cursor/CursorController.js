//Dragging does not start until cursor leaves the object it is dragging (or is in move mode?)
/*
  onSingleTap
    Edit Mode
      OnState
        - Toggle target acceptState
      OnEdge
        - Edit label

  onDoubleTap
    Edit Mode
      OnEmpty
        - Create new state at position

  onStartDragging
    Edit Mode
      OnState
        - Create new edge, and move enter move mode for its endpoint
      OnEmpty
        - Begin selection box
    Move Mode
      OnState
        - Set drag target to state
      OnEdge
        - Set drag target to edge
      OnEdgeEndPoint
        - Set drag target to edge endpoint
      OnEmpty
        - Set drag target to graph

  OnDrag
    Draw drag targets
    Draw selection box

  onStopDragging
    Edit Mode
      - Mark all selected targets in selection box (save position to all targets)
    Move Mode
      OnState
        If is selected state:
          - Drag the marked targets to cursor, while maintaining interdistance
        Otherwise:
          - Drag the state to cursor
      OnEdge
        - Drag the edge to cursor
      OnEdgeEndPoint
        - Drag the endpoint of edge to cursor
      OnEmpty
        - Drag the graph to cursor
*/
class CursorController
{
  constructor(graph)
  {
    this.graph = graph;
  }

  onSingleTap(cursor, x, y, target, targetType)
  {
    return false;
  }

  onDoubleTap(cursor, x, y, target, targetType)
  {
    return false;
  }

  //onLongHold
  //onLongTap
  //onQuickTap

  onStartDragging(cursor, x, y, target, targetType)
  {
    return false;
  }

  onStopDragging(cursor, x, y, target, targetType)
  {
    return false;
  }
}

export default CursorController;
