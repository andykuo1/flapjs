import LabelEditor from 'controller/LabelEditor.js';
import GraphCursor from 'controller/GraphCursor.js';

import EditCursorController from 'controller/cursor/EditCursorController.js';
import MoveCursorController from 'controller/cursor/MoveCursorController.js';
import SelectCursorController from 'controller/cursor/SelectCursorController.js';

import * as Config from 'config.js';


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

OnDragging
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

NOTES:
- Dragging does not start until cursor leaves the object it is dragging (or is in move mode?)
*/
class MainCursorController
{
  constructor(graph, mouse)
  {
    this.graph = graph;
    this.mouse = mouse;

    this.cursor = new GraphCursor(graph, mouse);
    this.labelEditor = new LabelEditor();

    this.editCursor = new EditCursorController(this, this.graph);
    this.moveCursor = new MoveCursorController(this, this.graph);
    this.selectCursor = new SelectCursorController(this, this.graph);

    this.moveMode = false;

    this.tap = { x: 0, y: 0 };
    this.doubleTapTicks = 0;
    this.isDown = false;
    this.isDragging = false;

    this.target = null;
    this.targetType = null;

    this.hoverTarget = null;
    this.hoverType = null;

    this.shouldDestroyPointlessEdges = Config.DEFAULT_SHOULD_DESTROY_POINTLESS_EDGE;
    //TODO: Trash area should NOT show up on exported image!
    this.trashArea = { x: Config.TRASH_AREA_POSX, y: Config.TRASH_AREA_POSY,
                        width: Config.TRASH_AREA_WIDTH, height: Config.TRASH_AREA_HEIGHT };
  }

  load()
  {
    this.mouse.on('mousedown', this.onMouseDown.bind(this));
    this.mouse.on('mouseup', this.onMouseUp.bind(this));
    this.mouse.on('mouseexit', this.onMouseExit.bind(this));
    this.mouse.on('mousemove', this.onMouseMove.bind(this));
  }

  update(dt)
  {
    if (this.doubleTapTicks > 0)
    {
      --this.doubleTapTicks;
    }

    const x = this.mouse.x;
    const y = this.mouse.y;

    //Get hover target
    this.hoverTarget = null;
    if (this.hoverTarget = this.target)
    {
      this.hoverTarget = this.target;
      this.hoverType = this.targetType;
    }
    else if (this.hoverTarget = this.cursor.getNodeAt(x, y))
    {
      this.hoverType = "node";
    }
    else if (this.hoverTarget = this.cursor.getEdgeAt(x, y))
    {
      this.hoverType = "edge";
    }
    else if (this.hoverTarget = this.cursor.getEdgeByEndPointAt(x, y))
    {
      this.hoverType = "endpoint";
    }
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

    //TODO: should be in selectCursor, but there is not onMouseDown event...
    if (this.selectCursor.hasSelection())
    {
      //Unselect everything is clicked on something other than nodes...
      if (this.targetType != "node" || !this.selectCursor.selectBox.targets.includes(this.target))
      {
        this.selectCursor.clearSelection();
      }
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
    }
    else if (this.doubleTapTicks > 0)
    {
      if (!this.doDoubleTap(mx, my))
      {
        this.doSingleTap(mx, my);
      }
    }
    else
    {
      this.doSingleTap(mx, my);
      this.doubleTapTicks = Config.DOUBLE_TAP_TICKS;
    }

    this.target = null;
    this.targetType = null;
  }

  onMouseMove(mouse, x, y)
  {
    if (this.isDragging)
    {
      this.doDragging(x, y);
      return;
    }
    if (!this.isDown) return;

    let dx = this.tap.x;
    let dy = this.tap.y;
    let radiusSqu = Config.CURSOR_RADIUS_SQU;

    if (this.target != null)
    {
      if (this.targetType == "node")
      {
        dx = this.target.x;
        dy = this.target.y;
        radiusSqu = Config.NODE_RADIUS_SQU;
      }
      else if (this.targetType == "edge")
      {
        dx = this.target.x;
        dy = this.target.y;
        radiusSqu = Config.EDGE_RADIUS_SQU;
      }
      else if (this.targetType == "endpoint")
      {
        const endpoint = this.target.getEndPoint();
        dx = endpoint[0];
        dy = endpoint[1];
        radiusSqu = Config.ENDPOINT_RADIUS_SQU;
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

  doSingleTap(x, y)
  {
    if (this.moveMode)
    {
      return this.moveCursor.onSingleTap(this.cursor, x, y, this.target, this.targetType);
    }
    else
    {
      return this.editCursor.onSingleTap(this.cursor, x, y, this.target, this.targetType) ||
              this.selectCursor.onSingleTap(this.cursor, x, y, this.target, this.targetType);
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
      return this.editCursor.onDoubleTap(this.cursor, x, y, this.target, this.targetType) ||
              this.selectCursor.onDoubleTap(this.cursor, x, y, this.target, this.targetType);
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
      return this.editCursor.onStartDragging(this.cursor, x, y, this.target, this.targetType) ||
              this.selectCursor.onStartDragging(this.cursor, x, y, this.target, this.targetType);
    }
  }

  doDragging(x, y)
  {
    if (this.moveMode)
    {
      return this.moveCursor.onDragging(this.cursor, x, y, this.target, this.targetType);
    }
    else
    {
      return this.editCursor.onDragging(this.cursor, x, y, this.target, this.targetType) ||
              this.selectCursor.onDragging(this.cursor, x, y, this.target, this.targetType);
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
      return this.editCursor.onStopDragging(this.cursor, x, y, this.target, this.targetType) ||
              this.selectCursor.onStopDragging(this.cursor, x, y, this.target, this.targetType);
    }
  }

  createNewState(x, y)
  {
    const node = this.graph.createNewNode(x, y, Config.STR_STATE_LABEL + (this.graph.nodes.length));
    node.x = x || (Math.random() * Config.SPAWN_RADIUS * 2) - Config.SPAWN_RADIUS;
    node.y = y || (Math.random() * Config.SPAWN_RADIUS * 2) - Config.SPAWN_RADIUS;
    return node;
  }

  createNewTransition(src, dst, label=Config.STR_TRANSITION_DEFAULT_LABEL)
  {
    const edge = this.graph.createNewEdge(src, dst, label);
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
      //TODO: Do not allow user to create quadratics on placeholder edges
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

  stopMove()
  {
    this.moveMode = false;
  }

  isWithinTrash(x, y)
  {
    const dx = x - this.trashArea.x;
    const dy = y - this.trashArea.y;
    return dx > 0 && dx < this.trashArea.width &&
            dy > 0 && dy < this.trashArea.height;
  }
}

export default MainCursorController;
