const RADIUS = 16;
const RADIUS_SQU = 256;
const PI2 = Math.PI * 2;

const STROKE = "black";
const DASHSPACE = [6, 4];
const ROTFACTOR = 1000;

class NodalGraphController
{
  constructor(canvas, mouse, graph)
  {
    this.canvas = canvas;
    this.mouse = mouse;
    this.graph = graph;

    this.targetSource = null;
    this.targetDestination = null;

    this.moveTarget = null;
  }

  load()
  {
    this.mouse.events.on('mousedown', (mouse, button) => {
      if (button == 3)
      {
        //Move target?
        this.startMove(mouse.x, mouse.y);
      }
      else
      {
        this.markTarget(mouse.x, mouse.y);
      }
    });
    this.mouse.events.on('mouseup', (mouse, button) => {
      if (button == 3)
      {
        //Finish moving target?
        this.endMove(mouse.x, mouse.y);
      }
      else
      {
        this.releaseTarget(mouse.x, mouse.y);
      }
    });

    //Setup button
    const buttonNewState = document.getElementById("newstate");
    buttonNewState.addEventListener('click', (event) => {
      //Create new state
      this.createNewState();
    });
  }

  draw(ctx, time)
  {
    if (this.targetSource !== null)
    {
      const state = this.getStateByPosition(this.mouse.x, this.mouse.y);
      if (this.isSelfMode && state !== this.targetSource)
      {
        this.isSelfMode = false;
      }

      if (!this.isSelfMode)
      {
        this.targetDestination = state;
      }
    }

    /*
    for(const node of this.graph.nodes)
    {
      node.x += (node.nextX - node.x) * 0.06;
      node.y += (node.nextY - node.y) * 0.06;
      if (Math.abs(node.x - node.nextX) < 0.001) node.nextX = node.x;
      if (Math.abs(node.y - node.nextY) < 0.001) node.nextY = node.y;
    }
    */

    if (this.moveTarget !== null)
    {
      ctx.strokeStyle = "black";
      const angle = (time / ROTFACTOR) % PI2;
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash(DASHSPACE);
      ctx.arc(this.mouse.x, this.mouse.y, RADIUS, 0 + angle, PI2 + angle);
      ctx.stroke();
      ctx.restore();
    }
  }

  createNewState()
  {
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height;
    const node = this.graph.createNewNode();
    node.x = x;
    node.y = y;
    //node.nextX = x;
    //node.nextY = y;
    node.accept = false;
    return node;
  }

  createNewTransition(src, dst)
  {
    const edge = this.graph.createNewEdge(src, dst);
    edge.label = "0";
    return edge;
  }

  markTarget(x, y)
  {
    this.targetSource = this.getStateByPosition(x, y);
    this.isSelfMode = true;
  }

  releaseTarget(x, y)
  {
    if (this.targetSource === null) return;

    const target = this.getStateByPosition(x, y);
    if (!this.isSelfMode && this.targetDestination !== null)
    {
      this.createNewTransition(this.targetSource, this.targetDestination);
    }
    else if (target === this.targetSource)
    {
      this.graph.toggleAcceptState(target);
    }

    this.targetSource = null;
    this.targetDestination = null;
  }

  startMove(x, y)
  {
    this.moveTarget = this.getStateByPosition(x, y);
  }

  endMove(x, y)
  {
    if (this.moveTarget !== null)
    {
      this.moveTarget.x = x;
      this.moveTarget.y = y;
      //this.moveTarget.nextX = x;
      //this.moveTarget.nextY = y;
    }
    this.moveTarget = null;
  }

  getStateByPosition(x, y)
  {
    for(const node of this.graph.nodes)
    {
      const dx = x - node.x;
      const dy = y - node.y;
      if (dx * dx + dy * dy < RADIUS_SQU)
      {
        return node;
      }
    }

    return null;
  }
}

export default NodalGraphController;
