import { Node } from 'NodalGraph.js';

import * as Config from 'config.js';

var hoverAngle = 0;
class CanvasRenderer
{
  constructor(viewport, graph, controller)
  {
    this.viewport = viewport;
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.graph = graph;
    this.controller = controller;

    //Setup canvas
    window.addEventListener('load', (event) => {
      //For canvas only...
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
    window.addEventListener('resize', (event) => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });

    this.nodeElements = new Map();
    this.edgeElements = new Map();
    this.selectElements = new Map();

    this.initialMarkerElement = new InitialMarkerElement(this.graph);
    this.initialMarkerElement.onCreate(this.ctx, this.canvas);

    this.selectionBoxElement = new SelectionBoxElement(this.controller.cursors.selectCursor.selectBox);
    this.selectionBoxElement.onCreate(this.ctx, this.canvas);

    this.hoverElement = new HoverElement(this.controller);
    this.hoverElement.onCreate(this.ctx, this.canvas);

    this.trashAreaElement = new TrashAreaElement(this.controller.cursors.trashArea);
    this.trashAreaElement.onCreate(this.ctx, this.canvas);

    this.graph.on("nodeCreate", (node) => {
      const result = new NodeElement(node);
      result.onCreate(this.ctx, this.canvas);
      this.nodeElements.set(node, result);
    });
    this.graph.on("nodeDestroy", (node) => {
      const result = this.nodeElements.get(node);
      result.onDestroy(this.ctx, this.canvas);
      this.nodeElements.delete(node);
    });

    this.graph.on("edgeCreate", (edge) => {
      const result = new EdgeElement(edge);
      result.onCreate(this.ctx, this.canvas);
      this.edgeElements.set(edge, result);
    });
    this.graph.on("edgeDestroy", (edge) => {
      const result = this.edgeElements.get(edge);
      result.onDestroy(this.ctx, this.canvas);
      this.edgeElements.delete(edge);
    });
  }

  render()
  {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    {
      //Default edge styles
      ctx.font = Config.EDGE_FONT;
      ctx.textAlign = Config.EDGE_TEXT_ALIGN;
      ctx.strokeStyle = Config.EDGE_STROKE_STYLE;

      //Draw edges
      for(const [edge, element] of this.edgeElements)
      {
        element.onRender(ctx);
      }
    }
    ctx.restore();

    ctx.save();
    {
      //Draw initial marker
      this.initialMarkerElement.onRender(ctx);
    }
    ctx.restore();

    ctx.save();
    {
      //Default node styles
      ctx.font = Config.NODE_FONT;
      ctx.textAlign = Config.NODE_TEXT_ALIGN;
      ctx.strokeStyle = Config.NODE_STROKE_STYLE;
      ctx.fillStyle = Config.NODE_FILL_STYLE;

      //Draw nodes
      for(const [node, element] of this.nodeElements)
      {
        element.onRender(ctx);
      }
    }
    ctx.restore();

    ctx.save();
    {
      if (this.controller.cursors.selectCursor.hasSelection())
      {
        let targets = this.controller.cursors.selectCursor.getSelection(this.controller.cursors.cursor);
        for(const target of targets)
        {
          if (!this.selectElements.has(target))
          {
            this.selectElements.set(target, new SelectElement(target, "node"));
          }
        }

        let dead = [];
        for(const [target, element] of this.selectElements)
        {
          if (targets.includes(target))
          {
            element.onRender(ctx);
          }
          else
          {
            dead.push(target);
          }
        }

        for(const target of dead)
        {
          const element = this.selectElements.get(target);
          element.onDestroy(this.ctx, this.canvas);
          this.selectElements.delete(element);
        }
      }
    }
    ctx.restore();

    ctx.save();
    {
      if (this.controller.cursors.selectCursor.isSelecting)
      {
        this.selectionBoxElement.onRender(ctx);
      }

      this.hoverElement.onRender(ctx);
    }
    ctx.restore();

    ctx.save();
    {
      this.trashAreaElement.onRender(ctx);
    }
    ctx.restore();

    hoverAngle = (hoverAngle + Config.HOVER_ANGLE_SPEED) % Config.PI2;
  }
}

class CanvasElement
{
  onCreate(ctx, canvas)
  {

  }

  onDestroy(ctx, canvas)
  {

  }

  onRender(ctx)
  {

  }
}

class NodeElement extends CanvasElement
{
  constructor(node)
  {
    super();
    this.node = node;
  }

  onRender(ctx)
  {
    super.onRender(ctx);

    const x = this.node.x;
    const y = this.node.y;
    const label = this.node.label;
    const accept = this.node.accept;

    ctx.fillStyle = Config.NODE_FILL_STYLE;
    ctx.beginPath();
    ctx.arc(x, y, Config.NODE_RADIUS, 0, Config.PI2);
    ctx.fill();
    ctx.stroke();

    if (accept)
    {
      ctx.beginPath();
      ctx.arc(x, y, Config.NODE_RADIUS_INNER, 0, Config.PI2);
      ctx.stroke();
    }

    ctx.fillStyle = Config.NODE_TEXT_FILL_STYLE;
    ctx.fillText(label, x, y + 4);
  }
}

class EdgeElement extends CanvasElement
{
  constructor(edge)
  {
    super();
    this.edge = edge;
  }

  onRender(ctx)
  {
    super.onRender(ctx);

    const from = this.edge.from;
    const to = this.edge.to;
    const x = this.edge.x;
    const y = this.edge.y;
    const midpoint = this.edge.getMidPoint();
    const centerX = midpoint[0];
    const centerY = midpoint[1];
    const quad = this.edge.quad;
    const label = this.edge.label;

    let endX = 0;
    let endY = 0;
    let arrowAngle = 0;

    const start = this.edge.getStartPoint();
    const end = (this.edge.to instanceof Node) ? this.edge.getEndPoint() : [this.edge.to.x, this.edge.to.y];
    endX = end[0];
    endY = end[1];

    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);

    if (quad == null)
    {
      arrowAngle = Math.atan2(start[0] - end[0], start[1] - end[1]) + Math.PI;
      ctx.lineTo(end[0], end[1]);
    }
    else
    {
      const centerQuad = this.edge.getCenterPoint();
      centerQuad[0] += quad.x;
      centerQuad[1] += quad.y;
      arrowAngle = Math.atan2(centerQuad[0] - end[0], centerQuad[1] - end[1]) + Math.PI;
      ctx.quadraticCurveTo(centerQuad[0], centerQuad[1], end[0], end[1]);
    }

    ctx.moveTo(
      endX - (Config.ARROW_WIDTH * Math.sin(arrowAngle - Config.SIXTH_PI)),
      endY - (Config.ARROW_WIDTH * Math.cos(arrowAngle - Config.SIXTH_PI)));
    ctx.lineTo(endX, endY);
    ctx.lineTo(
      endX - (Config.ARROW_WIDTH * Math.sin(arrowAngle + Config.SIXTH_PI)),
      endY - (Config.ARROW_WIDTH * Math.cos(arrowAngle + Config.SIXTH_PI)));
    ctx.stroke();
    ctx.closePath();

    //Draw multiple labels
    if (label.length > 0)
    {
      const labels = label.split(" ");
      let dy = 0;
      for(let str of labels)
      {
        let xx = 0;
        let yy = 0;
        let cx = str.length * 3;
        let sign = 0;

        if (quad == null)
        {
          xx = centerX;
          yy = centerY;
        }
        else
        {
          sign = Math.sign(quad.y);
          xx = x;
          yy = y + (8 * sign);
        }

        yy += dy * (-sign || 1);
        ctx.clearRect(xx - cx - 2, yy - 5, (cx * 2) + 4, 10);
        ctx.fillText(str, xx, yy + 4);
        dy -= 12;
      }
    }
  }
}

class InitialMarkerElement extends CanvasElement
{
  constructor(graph)
  {
    super();
    this.graph = graph;
  }

  onRender(ctx)
  {
    super.onRender(ctx);

    const initialNode = this.graph.getInitialState();
    if (!initialNode) return;
    const x = initialNode.x;
    const y = initialNode.y;

    ctx.strokeStyle = Config.EDGE_STROKE_STYLE;
    ctx.beginPath();
    ctx.moveTo(x - Config.NODE_RADIUS, y);
    ctx.lineTo(x - Config.NODE_DIAMETER, y - Config.NODE_RADIUS);
    ctx.lineTo(x - Config.NODE_DIAMETER, y + Config.NODE_RADIUS);
    ctx.closePath();
    ctx.stroke();
  }
}

class SelectionBoxElement extends CanvasElement
{
  constructor(selectBox)
  {
    super();
    this.selectBox = selectBox;
  }

  onRender(ctx)
  {
    super.onRender(ctx);

    const dx = this.selectBox.mx - this.selectBox.x;
    const dy = this.selectBox.my - this.selectBox.y;
    ctx.save();
    {
      ctx.shadowColor = Config.SELECTION_BOX_SHADOW_COLOR;
      ctx.shadowBlur = Config.SELECTION_BOX_SHADOW_SIZE;
      ctx.shadowOffsetX = Config.SELECTION_BOX_SHADOW_OFFSETX;
      ctx.shadowOffsetY = Config.SELECTION_BOX_SHADOW_OFFSETY;
      ctx.fillStyle = Config.SELECTION_BOX_FILL_STYLE;
      ctx.strokeStyle = Config.SELECTION_BOX_STROKE_STYLE;
      ctx.fillRect(this.selectBox.x, this.selectBox.y, dx, dy);
      ctx.strokeRect(this.selectBox.x, this.selectBox.y, dx, dy);
    }
    ctx.restore();
  }
}

class HoverElement extends CanvasElement
{
  constructor(controller)
  {
    super();
    this.controller = controller;
  }

  onRender(ctx)
  {
    super.onRender(ctx);

    const target = this.controller.cursors.hoverTarget;
    const type = this.controller.cursors.hoverType;

    if (target == null) return;
    //Don't draw hover info for already selected targets...
    if (this.controller.cursors.selectCursor.selectBox.targets.includes(target)) return;

    let x = 0;
    let y = 0;
    let r = Config.CURSOR_RADIUS;
    switch(type)
    {
      case "node":
        x = target.x;
        y = target.y;
        r = Config.NODE_RADIUS;
        break;
      case "edge":
        x = target.x;
        y = target.y;
        r = Config.EDGE_RADIUS;
        break;
      case "endpoint":
        const endpoint = target.getEndPoint();
        x = endpoint[0];
        y = endpoint[1];
        r = Config.ENDPOINT_RADIUS;
        break;
      default:
        x = x;
        y = y;
    }

    ctx.save();
    {
      const angle = hoverAngle;
      ctx.strokeStyle = Config.HOVER_STROKE_STYLE;
      ctx.lineWidth = Config.HOVER_LINE_WIDTH;
      ctx.beginPath();
      ctx.setLineDash(Config.HOVER_LINE_DASH);
      ctx.arc(x, y, r + Config.HOVER_RADIUS_OFFSET, 0 + angle, Config.PI2 + angle);
      ctx.stroke();
    }
    ctx.restore();

    hoverAngle = (hoverAngle + Config.HOVER_ANGLE_SPEED) % Config.PI2;
  }
}

class SelectElement extends CanvasElement
{
  constructor(target, type)
  {
    super();
    this.target = target;
    this.type = type;
  }

  onRender(ctx)
  {
    super.onRender(ctx);

    const target = this.target;
    const type = this.type;

    let x = 0;
    let y = 0;
    let r = Config.CURSOR_RADIUS;
    switch(type)
    {
      case "node":
        x = target.x;
        y = target.y;
        r = Config.NODE_RADIUS;
        break;
      case "edge":
        x = target.x;
        y = target.y;
        r = Config.EDGE_RADIUS;
        break;
      case "endpoint":
        const endpoint = target.getEndPoint();
        x = endpoint[0];
        y = endpoint[1];
        r = Config.ENDPOINT_RADIUS;
        break;
      default:
        x = x;
        y = y;
    }

    ctx.save();
    {
      const angle = hoverAngle;
      ctx.strokeStyle = Config.HOVER_STROKE_STYLE;
      ctx.lineWidth = Config.HOVER_LINE_WIDTH;
      ctx.beginPath();
      ctx.setLineDash(Config.HOVER_LINE_DASH);
      ctx.arc(x, y, r + Config.HOVER_RADIUS_OFFSET, 0 + angle, Config.PI2 + angle);
      ctx.stroke();
    }
    ctx.restore();
  }
}

class TrashAreaElement extends CanvasElement
{
  constructor(trashArea)
  {
    super();
    this.trashArea = trashArea;
  }

  onRender(ctx)
  {
    super.onRender(ctx);

    ctx.shadowColor = Config.TRASH_AREA_SHADOW_COLOR;
    ctx.shadowBlur = Config.TRASH_AREA_SHADOW_SIZE;
    ctx.shadowOffsetX = Config.TRASH_AREA_SHADOW_OFFSETX;
    ctx.shadowOffsetY = Config.TRASH_AREA_SHADOW_OFFSETY;
    ctx.fillStyle = Config.TRASH_AREA_FILL_STYLE;
    ctx.strokeStyle = Config.TRASH_AREA_STROKE_STYLE;
    ctx.fillRect(this.trashArea.x, this.trashArea.y, this.trashArea.width, this.trashArea.height);
    ctx.strokeRect(this.trashArea.x, this.trashArea.y, this.trashArea.width, this.trashArea.height);
  }
}

export default CanvasRenderer;
