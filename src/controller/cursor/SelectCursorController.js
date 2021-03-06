import CursorController from 'controller/cursor/CursorController.js';

class SelectCursorController extends CursorController
{
  constructor(mainController, graph)
  {
    super(graph);

    this.mainController = mainController;

    this.selectBox = { x:0, y: 0, mx: 0, my: 0, targets: [] };
    this.isSelecting = false;
  }

  onStartDragging(cursor, x, y, target, targetType)
  {
    if (target == null)
    {
      //Begin selection box...
      this.isSelecting = true;
      this.selectBox.x = x;
      this.selectBox.y = y;
      this.selectBox.mx = x;
      this.selectBox.my = y;
      this.clearSelection();
      return true;
    }

    return false;
  }

  onDragging(cursor, x, y, target, targetType)
  {
    if (this.isSelecting)
    {
      this.selectBox.mx = x;
      this.selectBox.my = y;
      this.getSelection(cursor);
      return true;
    }

    return false;
  }

  onStopDragging(cursor, x, y, target, targetType)
  {
    if (this.isSelecting)
    {
      this.selectBox.mx = x;
      this.selectBox.my = y;
      this.getSelection(cursor);
      this.isSelecting = false;
      return true;
    }

    return false;
  }

  getSelection(cursor)
  {
    if (this.isSelecting)
    {
      const mx = Math.max(this.selectBox.mx, this.selectBox.x);
      const my = Math.max(this.selectBox.my, this.selectBox.y);
      const lx = Math.min(this.selectBox.mx, this.selectBox.x);
      const ly = Math.min(this.selectBox.my, this.selectBox.y);
      this.clearSelection();
      cursor.getNodesWithin(lx, ly, mx, my, this.selectBox.targets);
    }

    return this.selectBox.targets;
  }

  hasSelection()
  {
    return this.selectBox.targets.length > 0;
  }

  clearSelection()
  {
    this.selectBox.targets.length = 0;
  }
}

export default SelectCursorController;
