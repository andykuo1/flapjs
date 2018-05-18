import { Edge } from 'NodalGraph.js';

const RADIUS = 16;
const RADIUS_SQU = RADIUS * RADIUS;
const PI2 = Math.PI * 2;
const EDGE_RADIUS = 16;
const EDGE_RADIUS_SQU = EDGE_RADIUS * EDGE_RADIUS;

const STROKE = "black";
const DASHSPACE = [6, 4];
const ROTFACTOR = 0.01;

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
    this.selectorAngle = 0;
    this.selectEdge = new Edge(null, null, "");
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

  draw(ctx, dt)
  {
    let selectState = this.getStateByPosition(this.mouse.x, this.mouse.y);

    if (this.targetSource != null)
    {
      if (this.isSelfMode && selectState != this.targetSource)
      {
        this.isSelfMode = false;
      }

      if (!this.isSelfMode)
      {
        this.targetDestination = selectState;
      }
    }

    if (this.targetSource != null && !this.isSelfMode)
    {
      this.selectEdge.from = this.targetSource;
      this.selectEdge.to = this.targetDestination || this.mouse;
      if (this.targetSource == this.targetDestination)
      {
        this.selectEdge.y = this.selectEdge.from.y - 32;
      }
      else
      {
        this.selectEdge.quad = null;
      }
      this.selectEdge.draw(ctx);
    }

    if (this.moveTarget != null)
    {
      this.moveTarget.x = this.mouse.x;
      this.moveTarget.y = this.mouse.y;
      selectState = this.moveTarget;
    }

    if (selectState == null) selectState = this.getEdgeByPosition(this.mouse.x, this.mouse.y);
    if (selectState != null)
    {
      const angle = this.selectorAngle = (this.selectorAngle + (dt * ROTFACTOR)) % PI2;
      const prevLineWidth = ctx.lineWidth;
      ctx.strokeStyle = "rgba(0,0,0,0.6)";
      ctx.lineWidth = 2;
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash(DASHSPACE);
      ctx.arc(selectState.x, selectState.y, RADIUS + 4, 0 + angle, PI2 + angle);
      ctx.stroke();
      ctx.restore();
      ctx.lineWidth = prevLineWidth;
    }
  }

  createNewState()
  {
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height;
    const node = this.graph.createNewNode();
    node.x = x;
    node.y = y;
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
    if (this.targetSource == null) return;

    const target = this.getStateByPosition(x, y);
    if (!this.isSelfMode && this.targetDestination != null)
    {
      this.createNewTransition(this.targetSource, this.targetDestination);
    }
    else if (target == this.targetSource)
    {
      this.graph.toggleAcceptState(target);
    }

    this.targetSource = null;
    this.targetDestination = null;
  }

  startMove(x, y)
  {
    this.moveTarget = this.getEdgeByPosition(x, y) || this.getStateByPosition(x, y);
  }

  endMove(x, y)
  {
    if (this.moveTarget != null)
    {
      this.moveTarget.x = x;
      this.moveTarget.y = y;
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

  getEdgeByPosition(x, y)
  {
    for(const edge of this.graph.edges)
    {
      const dx = x - edge.x;
      const dy = y - edge.y;
      if (dx * dx + dy * dy < EDGE_RADIUS_SQU)
      {
        return edge;
      }
    }

    return null;
  }
}

export default NodalGraphController;
