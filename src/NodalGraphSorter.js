class NodalGraphSorter
{
  constructor()
  {
    this._simulatePhysics = false;
  }

  sort()
  {
    this._simulatePhysics = true;
  }

  update(dt, graph)
  {
    //Simulate physics
    if (this._simulatePhysics)
    {
      let flag = false;
      for(const node of graph.nodes)
      {
        for(const other of graph.nodes)
        {
          if (node == other) continue;
          const dx = node.nextX - other.nextX;
          const dy = node.nextY - other.nextY;
          if (dx * dx + dy * dy < PADDING_RADIUS_SQU)
          {
            node.nextX += dx * 0.5;
            node.nextY += dy * 0.5;
            flag = true;
          }
        }
      }
      this._simulatePhysics = flag;
    }
  }
}

export default new NodalGraphSorter();
