import NodalGraphRenderer from 'NodalGraphRenderer.js';

class SelectionController
{
  constructor(graph)
  {
    this.graph = graph;

    this.fromX = 0;
    this.fromY = 0;
    this.selecting = false;
    this.selectionTargets = [];
  }

  beginSelection(x, y)
  {
    this.fromX = x;
    this.fromY = y;
    this.selecting = true;
    this.clearSelection();

    return true;
  }

  updateSelection(ctx, x, y)
  {
    //Get selection targets...
    const leastX = this.fromX > x ? x : this.fromX;
    const leastY = this.fromY > y ? y : this.fromY;
    const mostX = this.fromX < x ? x : this.fromX;
    const mostY = this.fromY < y ? y : this.fromY;
    this.selectionTargets.length = 0;
    for(const node of this.graph.nodes)
    {
      if (node.x >= leastX && node.x < mostX &&
          node.y >= leastY && node.y < mostY)
      {
        this.selectionTargets.push(node);
      }
    }

    const dx = x - this.fromX;
    const dy = y - this.fromY;
    ctx.save();
    {
      ctx.shadowColor = SELECTION_BOX_SHADOW_COLOR;
      ctx.shadowBlur = SELECTION_BOX_SHADOW_SIZE;
      ctx.shadowOffsetX = SELECTION_BOX_SHADOW_OFFSETX;
      ctx.shadowOffsetY = SELECTION_BOX_SHADOW_OFFSETY;
      ctx.fillStyle = SELECTION_BOX_FILL_STYLE;
      ctx.strokeStyle = SELECTION_BOX_STROKE_STYLE;
      ctx.fillRect(this.fromX, this.fromY, dx, dy);
      ctx.strokeRect(this.fromX, this.fromY, dx, dy);
    }
    ctx.restore();

    return true;
  }

  drawSelection(ctx)
  {
    //Draw selection target markers...
    for(let target of this.selectionTargets)
    {
      NodalGraphRenderer.drawHoverCircle(ctx, target.x, target.y, NODE_RADIUS + HOVER_RADIUS_OFFSET);
    }
  }

  endSelection(x, y)
  {
    this.selecting = false;
    return true;
  }

  clearSelection()
  {
    this.selectionTargets.length = 0;
  }

  hasSelection()
  {
    return this.selectionTargets.length > 0;
  }

  isSelecting()
  {
    return this.selecting;
  }
}

export default SelectionController;
