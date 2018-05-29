import LabelEditor from 'controller/LabelEditor.js';
import GraphCursor from 'GraphCursor.js';
import NodalGraphRenderer from 'NodalGraphRenderer.js';

import EditCursorController from 'controller/cursor/EditCursorController.js';
import MoveCursorController from 'controller/cursor/MoveCursorController.js';

class MainController
{
  constructor(graph, mouse)
  {
    this.graph = graph;
    this.mouse = mouse;

    this.cursor = new GraphCursor(graph, mouse);
    this.labelEditor = new LabelEditor();

    this.editCursor = new EditCursorController(this, this.graph);
    this.moveCursor = new MoveCursorController(this, this.graph);

    this.moveMode = false;

    this.tap = {
      x: 0,
      y: 0
    };
    this.doubleTapTicks = 0;
    this.isDown = false;
    this.isDragging = false;

    this.target = null;
    this.targetType = null;
  }

  load()
  {
    this.mouse.on('mousedown', this.onMouseDown.bind(this));
    this.mouse.on('mouseup', this.onMouseUp.bind(this));
    this.mouse.on('mouseexit', this.onMouseExit.bind(this));
    this.mouse.on('mousemove', this.onMouseMove.bind(this));
  }

  onMouseDown(mouse, button)
  {
    this.moveMode = (button == 3);

    const mx = this.tap.x = mouse.x;
    const my = this.tap.y = mouse.y;
    this.isDown = true;
    this.isDragging = false;

    if (this.target = this.cursor.getNodeAt(mx, my))
    {
      this.targetType = "node";
    }
    else if (this.target = this.cursor.getEdgeAt(mx, my))
    {
      this.targetType = "edge";
    }
    else if (this.target = this.cursor.getEdgeByEndPointAt(mx, my))
    {
      this.targetType = "endpoint";
    }
    else
    {
      this.target = null;
      this.targetType = null;
    }
  }

  onMouseUp(mouse, button)
  {
    const mx = mouse.x;
    const my = mouse.y;
    this.isDown = false;
    if (this.isDragging)
    {
      this.doStopDragging(mx, my);
      this.isDragging = false;
      this.target = null;
      this.targetType = null;
      return;
    }

    if (this.doubleTapTicks > 0)
    {
      if (!this.doDoubleTap(mx, my))
      {
        this.doSingleTap(mx, my);
      }
    }
    else
    {
      this.doSingleTap(mx, my);
      this.doubleTapTicks = DOUBLE_TAP_TICKS;
    }

    this.target = null;
    this.targetType = null;
  }

  onMouseMove(mouse, x, y)
  {
    if (this.isDragging)
    {
      if (this.moveMode && this.target != null)
      {
        this.moveCursor.moveTarget(this.cursor, this.target, this.targetType, x, y);
      }
      return;
    }
    if (!this.isDown) return;

    let dx = this.tap.x;
    let dy = this.tap.y;
    let radiusSqu = CURSOR_RADIUS_SQU;

    if (this.target != null)
    {
      if (this.targetType == "node")
      {
        dx = this.target.x;
        dy = this.target.y;
        radiusSqu = NODE_RADIUS_SQU;
      }
      else if (this.targetType == "edge")
      {
        dx = this.target.x;
        dy = this.target.y;
        radiusSqu = EDGE_RADIUS_SQU;
      }
      else if (this.targetType == "endpoint")
      {
        const endpoint = this.target.getEndPoint();
        dx = endpoint[0];
        dy = endpoint[1];
        radiusSqu = ENDPOINT_RADIUS_SQU;
      }
    }

    dx -= x;
    dy -= y;
    if (dx * dx + dy * dy >= radiusSqu)
    {
      this.isDragging = true;
      this.doStartDragging(x, y);
    }
  }

  onMouseExit(mouse)
  {
    const mx = mouse.x;
    const my = mouse.y;

    if (this.isDragging)
    {
      this.doStopDragging(mx, my);
      this.isDragging = false;
    }

    if (this.isDown)
    {
      this.onMouseUp(mouse, 0);
      this.isDown = false;
    }
  }

  update(dt)
  {
    if (this.doubleTapTicks > 0)
    {
      --this.doubleTapTicks;
    }
  }

  draw(ctx)
  {
    const mx = this.mouse.x;
    const my = this.mouse.y;

    //Hover information...
    let selectTarget = null;
    let selectType = null;

    if (selectTarget = this.target)
    {
      selectTarget = this.target;
      selectType = this.targetType;
    }
    else if (selectTarget = this.cursor.getNodeAt(mx, my))
    {
      selectType = "node";
    }
    else if (selectTarget = this.cursor.getEdgeAt(mx, my))
    {
      selectType = "edge";
    }
    else if (selectTarget = this.cursor.getEdgeByEndPointAt(mx, my))
    {
      selectType = "endpoint";
    }

    if (selectTarget != null)
    {
      let x = 0;
      let y = 0;
      let r = CURSOR_RADIUS;
      switch(selectType)
      {
        case "node":
          x = selectTarget.x;
          y = selectTarget.y;
          r = NODE_RADIUS;
          break;
        case "edge":
          x = selectTarget.x;
          y = selectTarget.y;
          r = EDGE_RADIUS;
          break;
        case "endpoint":
          const endpoint = selectTarget.getEndPoint();
          x = endpoint[0];
          y = endpoint[1];
          r = ENDPOINT_RADIUS;
          break;
        default:
          x = mx;
          y = my;
      }
      NodalGraphRenderer.drawHoverCircle(ctx, x, y, r + HOVER_RADIUS_OFFSET);
    }
  }

  doSingleTap(x, y)
  {
    if (this.moveMode)
    {
      return this.moveCursor.onSingleTap(this.cursor, x, y, this.target, this.targetType);
    }
    else
    {
      return this.editCursor.onSingleTap(this.cursor, x, y, this.target, this.targetType);
    }
  }

  doDoubleTap(x, y)
  {
    if (this.moveMode)
    {
      return this.moveCursor.onDoubleTap(this.cursor, x, y, this.target, this.targetType);
    }
    else
    {
      return this.editCursor.onDoubleTap(this.cursor, x, y, this.target, this.targetType);
    }
  }

  doStartDragging(x, y)
  {
    if (this.moveMode)
    {
      return this.moveCursor.onStartDragging(this.cursor, x, y, this.target, this.targetType);
    }
    else
    {
      return this.editCursor.onStartDragging(this.cursor, x, y, this.target, this.targetType);
    }
  }

  doStopDragging(x, y)
  {
    if (this.moveMode)
    {
      return this.moveCursor.onStopDragging(this.cursor, x, y, this.target, this.targetType);
    }
    else
    {
      return this.editCursor.onStopDragging(this.cursor, x, y, this.target, this.targetType);
    }
  }

  createNewState(x, y)
  {
    const node = this.graph.createNewNode();
    node.label = STR_STATE_LABEL + (this.graph.nodes.length - 1);
    node.x = x || (Math.random() * SPAWN_RADIUS * 2) - SPAWN_RADIUS;
    node.y = y || (Math.random() * SPAWN_RADIUS * 2) - SPAWN_RADIUS;
    return node;
  }

  createNewTransition(src, dst, label=STR_TRANSITION_DEFAULT_LABEL)
  {
    const edge = this.graph.createNewEdge(src, dst);
    edge.label = label;
    return edge;
  }

  openLabelEditor(target, placeholder=null)
  {
    this.labelEditor.open(target, placeholder);
  }

  startMove(target, targetType)
  {
    this.moveMode = true;

    this.target = target;
    this.targetType = targetType;

    //TODO: this should really be in moveCursor, but moveMode needs to be here...
    if (this.targetType == "endpoint")
    {
      const quad = this.target.quad;
      if (quad != null)
      {
        this.moveCursor.quadTarget.x = quad.x;
        this.moveCursor.quadTarget.y = quad.y;
      }
      else
      {
        this.moveCursor.quadTarget.x = 0;
        this.moveCursor.quadTarget.y = 0;
      }
    }

    this.moveCursor.moveTarget(this.cursor, this.target, this.targetType, this.mouse.x, this.mouse.y);
  }
}

export default MainController;
