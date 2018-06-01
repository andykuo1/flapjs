import { Node } from 'NodalGraph.js';

//TODO: must get rid of all canvas references...
var hoverAngle = 0;
class SVGRenderer
{
  constructor(svg, viewport, graph, controller)
  {
    this.svg = svg;
    this.viewport = viewport;
    this.graph = graph;
    this.controller = controller;

    this.nodeElements = new Map();

    /*
    this.edgeElements = new Map();
    this.selectElements = new Map();

    this.initialMarkerElement = new InitialMarkerElement(this.graph);
    this.initialMarkerElement.onCreate(this.svg, this.viewport);

    this.selectionBoxElement = new SelectionBoxElement(this.controller.cursors.selectCursor.selectBox);
    this.selectionBoxElement.onCreate(this.svg, this.viewport);

    this.hoverElement = new HoverElement(this.controller);
    this.hoverElement.onCreate(this.svg, this.viewport);

    this.trashAreaElement = new TrashAreaElement(this.controller.cursors.trashArea);
    this.trashAreaElement.onCreate(this.svg, this.viewport);
    */

    this.graph.on("nodeCreate", (node) => {
      const result = new NodeElement(node);
      result.onCreate(this.svg, this.viewport);
      this.nodeElements.set(node, result);
    });
    this.graph.on("nodeDestroy", (node) => {
      const result = this.nodeElements.get(node);
      result.onDestroy(this.svg, this.viewport);
      this.nodeElements.delete(node);
    });

    /*
    this.graph.on("edgeCreate", (edge) => {
      const result = new EdgeElement(edge);
      result.onCreate(this.svg, this.viewport);
      this.edgeElements.set(edge, result);
    });
    this.graph.on("edgeDestroy", (edge) => {
      const result = this.edgeElements.get(edge);
      result.onDestroy(this.svg, this.viewport);
      this.edgeElements.delete(edge);
    });
    */
  }

  render(svg)
  {
    /*
    svg.save();
    {
      //Default edge styles
      svg.font = EDGE_FONT;
      svg.textAlign = EDGE_TEXT_ALIGN;
      svg.strokeStyle = EDGE_STROKE_STYLE;

      //Draw edges
      for(const [edge, element] of this.edgeElements)
      {
        element.onRender(svg);
      }
    }
    svg.restore();

    svg.save();
    {
      //Draw initial marker
      this.initialMarkerElement.onRender(svg);
    }
    svg.restore();
    */

    //Draw nodes
    for(const [node, element] of this.nodeElements)
    {
      element.onRender(svg);
    }

    /*
    svg.save();
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
            element.onRender(svg);
          }
          else
          {
            dead.push(target);
          }
        }

        for(const target of dead)
        {
          const element = this.selectElements.get(target);
          element.onDestroy(this.svg, this.viewport);
          this.selectElements.delete(element);
        }
      }
    }
    svg.restore();

    svg.save();
    {
      if (this.controller.cursors.selectCursor.isSelecting)
      {
        this.selectionBoxElement.onRender(svg);
      }

      this.hoverElement.onRender(svg);
    }
    svg.restore();

    svg.save();
    {
      this.trashAreaElement.onRender(svg);
    }
    svg.restore();

    hoverAngle = (hoverAngle + HOVER_ANGLE_SPEED) % PI2;
    */
  }
}

class ViewportElement
{
  onCreate(svg, viewport)
  {

  }

  onDestroy(svg, viewport)
  {

  }

  onRender(svg)
  {

  }
}

class NodeElement extends ViewportElement
{
  constructor(node)
  {
    super();
    this.node = node;
    this.accept = false;
    this.element = null;
  }

  onCreate(svg, viewport)
  {
    const group = document.createElementNS(svg, "g");
    group.setAttributeNS(null, "transform", "translate(" + this.node.x + ", " + this.node.y + ")");
    const outer = document.createElementNS(svg, "circle");
    outer.setAttributeNS(null, "cx", 0);
    outer.setAttributeNS(null, "cy", 0);
    outer.setAttributeNS(null, "r", NODE_RADIUS);
    outer.setAttributeNS(null, "stroke", NODE_STROKE_STYLE);
    outer.setAttributeNS(null, "fill", NODE_FILL_STYLE);
    const inner = document.createElementNS(svg, "circle");
    inner.setAttributeNS(null, "cx", 0);
    inner.setAttributeNS(null, "cy", 0);
    inner.setAttributeNS(null, "r", NODE_RADIUS_INNER);
    inner.setAttributeNS(null, "stroke", NODE_STROKE_STYLE);
    inner.setAttributeNS(null, "fill", NODE_FILL_STYLE);
    inner.setAttributeNS(null, "visibility", this.node.accept ? "visible" : "hidden");
    const label = document.createElementNS(svg, "text");
    label.setAttributeNS(null, "x", 0);
    label.setAttributeNS(null, "y", 4);
    label.setAttributeNS(null, "text-anchor", "middle");
    label.setAttributeNS(null, "style", "fill: " + NODE_TEXT_FILL_STYLE);
    label.textContent = this.node.label;

    //Default node styles
    //svg.font = NODE_FONT;
    //svg.textAlign = NODE_TEXT_ALIGN;

    group.appendChild(outer);
    group.appendChild(inner);
    viewport.appendChild(group);

    this.element = group;
  }

  onDestroy(svg, viewport)
  {
    viewport.removeChild(this.element);
  }

  onRender(svg)
  {
    super.onRender(svg);

    const label = this.node.label;
    const accept = this.node.accept;

    //Update position
    this.element.setAttributeNS(null, "transform", "translate(" + this.node.x + ", " + this.node.y + ")");

    //Update accept
    if (this.node.accept != this.accept)
    {
      this.accept = this.node.accept;
      this.element.childNodes[1].setAttributeNS(null, "visibility", this.accept ? "visible" : "hidden");
    }

    //Update text
    this.element.childNodes[2].textContent = this.node.label;
  }
}

class EdgeElement extends ViewportElement
{
  constructor(edge)
  {
    super();
    this.edge = edge;
  }

  onRender(svg)
  {
    super.onRender(svg);

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

    svg.beginPath();
    svg.moveTo(start[0], start[1]);

    if (quad == null)
    {
      arrowAngle = Math.atan2(start[0] - end[0], start[1] - end[1]) + Math.PI;
      svg.lineTo(end[0], end[1]);
    }
    else
    {
      const centerQuad = this.edge.getCenterPoint();
      centerQuad[0] += quad.x;
      centerQuad[1] += quad.y;
      arrowAngle = Math.atan2(centerQuad[0] - end[0], centerQuad[1] - end[1]) + Math.PI;
      svg.quadraticCurveTo(centerQuad[0], centerQuad[1], end[0], end[1]);
    }

    svg.moveTo(
      endX - (ARROW_WIDTH * Math.sin(arrowAngle - SIXTH_PI)),
      endY - (ARROW_WIDTH * Math.cos(arrowAngle - SIXTH_PI)));
    svg.lineTo(endX, endY);
    svg.lineTo(
      endX - (ARROW_WIDTH * Math.sin(arrowAngle + SIXTH_PI)),
      endY - (ARROW_WIDTH * Math.cos(arrowAngle + SIXTH_PI)));
    svg.stroke();
    svg.closePath();

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
        svg.clearRect(xx - cx - 2, yy - 5, (cx * 2) + 4, 10);
        svg.fillText(str, xx, yy + 4);
        dy -= 12;
      }
    }
  }
}

class InitialMarkerElement extends ViewportElement
{
  constructor(graph)
  {
    super();
    this.graph = graph;
  }

  onRender(svg)
  {
    super.onRender(svg);

    const initialNode = this.graph.getInitialState();
    if (!initialNode) return;
    const x = initialNode.x;
    const y = initialNode.y;

    svg.strokeStyle = EDGE_STROKE_STYLE;
    svg.beginPath();
    svg.moveTo(x - NODE_RADIUS, y);
    svg.lineTo(x - NODE_DIAMETER, y - NODE_RADIUS);
    svg.lineTo(x - NODE_DIAMETER, y + NODE_RADIUS);
    svg.closePath();
    svg.stroke();
  }
}

class SelectionBoxElement extends ViewportElement
{
  constructor(selectBox)
  {
    super();
    this.selectBox = selectBox;
  }

  onRender(svg)
  {
    super.onRender(svg);

    const dx = this.selectBox.mx - this.selectBox.x;
    const dy = this.selectBox.my - this.selectBox.y;
    svg.save();
    {
      svg.shadowColor = SELECTION_BOX_SHADOW_COLOR;
      svg.shadowBlur = SELECTION_BOX_SHADOW_SIZE;
      svg.shadowOffsetX = SELECTION_BOX_SHADOW_OFFSETX;
      svg.shadowOffsetY = SELECTION_BOX_SHADOW_OFFSETY;
      svg.fillStyle = SELECTION_BOX_FILL_STYLE;
      svg.strokeStyle = SELECTION_BOX_STROKE_STYLE;
      svg.fillRect(this.selectBox.x, this.selectBox.y, dx, dy);
      svg.strokeRect(this.selectBox.x, this.selectBox.y, dx, dy);
    }
    svg.restore();
  }
}

class HoverElement extends ViewportElement
{
  constructor(controller)
  {
    super();
    this.controller = controller;
  }

  onRender(svg)
  {
    super.onRender(svg);

    const target = this.controller.cursors.hoverTarget;
    const type = this.controller.cursors.hoverType;

    if (target == null) return;
    //Don't draw hover info for already selected targets...
    if (this.controller.cursors.selectCursor.selectBox.targets.includes(target)) return;

    let x = 0;
    let y = 0;
    let r = CURSOR_RADIUS;
    switch(type)
    {
      case "node":
        x = target.x;
        y = target.y;
        r = NODE_RADIUS;
        break;
      case "edge":
        x = target.x;
        y = target.y;
        r = EDGE_RADIUS;
        break;
      case "endpoint":
        const endpoint = target.getEndPoint();
        x = endpoint[0];
        y = endpoint[1];
        r = ENDPOINT_RADIUS;
        break;
      default:
        x = x;
        y = y;
    }

    svg.save();
    {
      const angle = hoverAngle;
      svg.strokeStyle = HOVER_STROKE_STYLE;
      svg.lineWidth = HOVER_LINE_WIDTH;
      svg.beginPath();
      svg.setLineDash(HOVER_LINE_DASH);
      svg.arc(x, y, r + HOVER_RADIUS_OFFSET, 0 + angle, PI2 + angle);
      svg.stroke();
    }
    svg.restore();

    hoverAngle = (hoverAngle + HOVER_ANGLE_SPEED) % PI2;
  }
}

class SelectElement extends ViewportElement
{
  constructor(target, type)
  {
    super();
    this.target = target;
    this.type = type;
  }

  onRender(svg)
  {
    super.onRender(svg);

    const target = this.target;
    const type = this.type;

    let x = 0;
    let y = 0;
    let r = CURSOR_RADIUS;
    switch(type)
    {
      case "node":
        x = target.x;
        y = target.y;
        r = NODE_RADIUS;
        break;
      case "edge":
        x = target.x;
        y = target.y;
        r = EDGE_RADIUS;
        break;
      case "endpoint":
        const endpoint = target.getEndPoint();
        x = endpoint[0];
        y = endpoint[1];
        r = ENDPOINT_RADIUS;
        break;
      default:
        x = x;
        y = y;
    }

    svg.save();
    {
      const angle = hoverAngle;
      svg.strokeStyle = HOVER_STROKE_STYLE;
      svg.lineWidth = HOVER_LINE_WIDTH;
      svg.beginPath();
      svg.setLineDash(HOVER_LINE_DASH);
      svg.arc(x, y, r + HOVER_RADIUS_OFFSET, 0 + angle, PI2 + angle);
      svg.stroke();
    }
    svg.restore();
  }
}

class TrashAreaElement extends ViewportElement
{
  constructor(trashArea)
  {
    super();
    this.trashArea = trashArea;
  }

  onRender(svg)
  {
    super.onRender(svg);

    svg.shadowColor = TRASH_AREA_SHADOW_COLOR;
    svg.shadowBlur = TRASH_AREA_SHADOW_SIZE;
    svg.shadowOffsetX = TRASH_AREA_SHADOW_OFFSETX;
    svg.shadowOffsetY = TRASH_AREA_SHADOW_OFFSETY;
    svg.fillStyle = TRASH_AREA_FILL_STYLE;
    svg.strokeStyle = TRASH_AREA_STROKE_STYLE;
    svg.fillRect(this.trashArea.x, this.trashArea.y, this.trashArea.width, this.trashArea.height);
    svg.strokeRect(this.trashArea.x, this.trashArea.y, this.trashArea.width, this.trashArea.height);
  }
}

export default SVGRenderer;
