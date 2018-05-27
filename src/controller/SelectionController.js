class SelectionController
{
  constructor(graph)
  {
    this.graph = graph;

    this.fromX = 0;
    this.fromY = 0;

    this.selectTargets = [];
  }

  beginSelection(x, y)
  {
    this.fromX = x;
    this.fromY = y;
    this.selectTargets.length = 0;
  }

  updateSelection(ctx, x, y)
  {
    const dx = x - this.fromX;
    const dy = y - this.fromY;
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.fillRect(this.fromX, this.fromY, dx, dy);
    ctx.strokeStyle = "black";
    ctx.rect(this.fromX, this.fromY, dx, dy);
    ctx.restore();
  }

  endSelection(x, y)
  {
    for(const node of this.graph.nodes)
    {
      if (node.x >= this.fromX && node.x < x &&
          node.y >= this.fromY && node.y < y)
      {
        this.selectTargets.push(node);
      }
    }
    return this.selectTargets.length > 0;
  }
}

export default SelectionController;
