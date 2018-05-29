import CursorController from 'controller/cursor/CursorController.js';
import NodalGraphRenderer from 'NodalGraphRenderer.js';

class EditCursorController extends CursorController
{
  constructor(mainController, graph)
  {
    super(graph);

    this.mainController = mainController;

    this.selectBox = { x:0, y: 0, mx: 0, my: 0, targets: [] };
    this.isSelecting = false;
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
      const edge = this.mainController.createNewTransition(target, null, STR_TRANSITION_PROXY_LABEL);
      this.mainController.startMove(edge, "endpoint");
      return true;
    }
    else if (target == null)
    {
      //Begin selection box...
      this.isSelecting = true;
      this.selectBox.x = x;
      this.selectBox.y = y;
      this.selectBox.mx = x;
      this.selectBox.my = y;
      this.clearSelection();
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

  draw(ctx)
  {
    if (this.isSelecting)
    {
      const dx = this.selectBox.mx - this.selectBox.x;
      const dy = this.selectBox.my - this.selectBox.y;
      ctx.save();
      {
        ctx.shadowColor = SELECTION_BOX_SHADOW_COLOR;
        ctx.shadowBlur = SELECTION_BOX_SHADOW_SIZE;
        ctx.shadowOffsetX = SELECTION_BOX_SHADOW_OFFSETX;
        ctx.shadowOffsetY = SELECTION_BOX_SHADOW_OFFSETY;
        ctx.fillStyle = SELECTION_BOX_FILL_STYLE;
        ctx.strokeStyle = SELECTION_BOX_STROKE_STYLE;
        ctx.fillRect(this.selectBox.x, this.selectBox.y, dx, dy);
        ctx.strokeRect(this.selectBox.x, this.selectBox.y, dx, dy);
      }
      ctx.restore();
    }

    if (this.hasSelection())
    {
      for(const target of this.selectBox.targets)
      {
        NodalGraphRenderer.drawHoverCircle(ctx, target.x, target.y, NODE_RADIUS + HOVER_RADIUS_OFFSET);
      }
    }
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

export default EditCursorController;
