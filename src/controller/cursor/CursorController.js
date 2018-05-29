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

  onDragging(cursor, x, y, target, targetType)
  {
    return false;
  }

  onStopDragging(cursor, x, y, target, targetType)
  {
    return false;
  }
}

export default CursorController;
