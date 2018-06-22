import React from 'react';
import { hot } from 'react-hot-loader';

import { Node } from 'NodalGraph.js';

import * as Config from 'config.js';

var hoverAngle = 0;
class App extends React.Component
{
  render()
  {
    const graph = this.props.graph;
    const controller = this.props.controller;

    //TODO: Not used to animate hovering circles...
    hoverAngle = (hoverAngle + Config.HOVER_ANGLE_SPEED) % Config.PI2;

    return (
      <g>
        //Edges
        { graph.edges.map((e, i) => <Edge key={i} edge={e} />) }

        //Initial marker
        { graph.getInitialState() != null &&
          <InitialMarker node={graph.getInitialState()} />}

        //States
        { graph.nodes.map((e, i) => <NodeElement key={i} node={e} />) }

        //Selected Elements
        { controller.cursors.selectCursor.hasSelection() &&
          controller.cursors.selectCursor.getSelection(controller.cursors.cursor).map((e, i) =>
            <Select key={i} target={e} type="node" />) }

        //SelectionBox
        { controller.cursors.selectCursor.isSelecting &&
          <SelectionBox selectBox={controller.cursors.selectCursor.selectBox} /> }

        //Hover Element
        { controller.cursors.hoverTarget != null &&
          !controller.cursors.selectCursor.selectBox.targets.includes(controller.cursors.hoverTarget) &&
          <Select key={-1} target={controller.cursors.hoverTarget} type={controller.cursors.hoverType} /> }

        //TrashArea
        <TrashArea trashArea={controller.cursors.trashArea} />
      </g>
    );
  }
}

function NodeElement(props)
{
  const node = props.node;
  return <g>
      //Outer circle
      <circle
        cx={node.x}
        cy={node.y}
        r={Config.NODE_RADIUS}
        stroke={Config.NODE_STROKE_STYLE}
        fill={Config.NODE_FILL_STYLE} />

      //Inner circle
      {node.accept &&
        <circle
          cx={node.x}
          cy={node.y}
          r={Config.NODE_RADIUS_INNER}
          stroke={Config.NODE_STROKE_STYLE}
          fill="none" />}

      //Label
      <text
        x={node.x} y={node.y + 4}
        textAnchor={Config.NODE_TEXT_ANCHOR}
        font={Config.NODE_FONT}
        stroke={Config.NODE_STROKE_STYLE}
        fill={Config.NODE_TEXT_FILL_STYLE}>
        {node.label}
      </text>
    </g>;
}

function Edge(props)
{
  const edge = props.edge;

  const from = edge.from;
  const to = edge.to;
  const x = edge.x;
  const y = edge.y;
  const midpoint = edge.getMidPoint();
  const centerX = midpoint[0];
  const centerY = midpoint[1];
  const quad = edge.quad;
  const label = edge.label;

  let endX = 0;
  let endY = 0;
  let arrowAngle = 0;

  const start = edge.getStartPoint();
  const end = (edge.to instanceof Node) ? edge.getEndPoint() : [edge.to.x, edge.to.y];
  endX = end[0];
  endY = end[1];

  //Calculate curved lines...
  let quadLine = null;
  if (quad == null)
  {
    //Straight line
    arrowAngle = Math.atan2(start[0] - end[0], start[1] - end[1]) + Math.PI;
    quadLine = "L " + end[0] + " " + end[1];
  }
  else
  {
    //Quadratic curve
    const centerQuad = edge.getCenterPoint();
    centerQuad[0] += quad.x;
    centerQuad[1] += quad.y;
    arrowAngle = Math.atan2(centerQuad[0] - end[0], centerQuad[1] - end[1]) + Math.PI;
    quadLine = "Q " + centerQuad[0] + " " + centerQuad[1] + " " + end[0] + " " + end[1];
  }

  //Draw multiple labels
  const labels = label.split(" ");
  let dy = 0;

  return <g>
    //Draw lines
    <path d={
      "M " + start[0] + " " + start[1] + " " +
      quadLine + " " +
      "M " +
        (endX - (Config.ARROW_WIDTH * Math.sin(arrowAngle - Config.SIXTH_PI))) + " " +
        (endY - (Config.ARROW_WIDTH * Math.cos(arrowAngle - Config.SIXTH_PI))) + " " +
      "L " + endX + " " + endY + " " +
      "L " +
        (endX - (Config.ARROW_WIDTH * Math.sin(arrowAngle + Config.SIXTH_PI))) + " " +
        (endY - (Config.ARROW_WIDTH * Math.cos(arrowAngle + Config.SIXTH_PI)))}
      stroke={Config.EDGE_STROKE_STYLE}
      fill="none" />

    //Draw labels
    { labels.length > 0 && labels.map((str, i) => {
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
        dy -= 12;

        //TODO: ctx.clearRect(xx - cx - 2, yy - 5, (cx * 2) + 4, 10);
        return <text
          key={i}
          x={xx} y={yy + 4}
          font={Config.EDGE_FONT}
          textAnchor={Config.EDGE_TEXT_ANCHOR}>
          {str}
        </text>;
    })}
  </g>;
}

function InitialMarker(props)
{
  const x = props.node.x;
  const y = props.node.y;
  return <g>
    <path d={
      "M" + (x - Config.NODE_RADIUS) + " " + (y) +
      " L" + (x - Config.NODE_DIAMETER) + " " + (y - Config.NODE_RADIUS) +
      " L" + (x - Config.NODE_DIAMETER) + " " + (y + Config.NODE_RADIUS) +
      " Z"}
      stroke={Config.EDGE_STROKE_STYLE}
      fill="none" />
  </g>;
}

function SelectionBox(props)
{
  const selectBox = props.selectBox;
  const dx = selectBox.mx - selectBox.x;
  const dy = selectBox.my - selectBox.y;
  /*
    //Shadows
    ctx.shadowColor = Config.SELECTION_BOX_SHADOW_COLOR;
    ctx.shadowBlur = Config.SELECTION_BOX_SHADOW_SIZE;
    ctx.shadowOffsetX = Config.SELECTION_BOX_SHADOW_OFFSETX;
    ctx.shadowOffsetY = Config.SELECTION_BOX_SHADOW_OFFSETY;
  */
  return <g>
    <rect
      x={dx < 0 ? selectBox.mx : selectBox.x} y={dy < 0 ? selectBox.my : selectBox.y}
      width={dx < 0 ? -dx : dx} height={dy < 0 ? -dy : dy}
      fill={Config.SELECTION_BOX_FILL_STYLE}
      stroke={Config.SELECTION_BOX_STROKE_STYLE} />
  </g>;
}

function Select(props)
{
  const target = props.target;
  const type = props.type;
  const angle = hoverAngle;

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

  return <g>
    <circle
      cx={x}
      cy={y}
      r={r + Config.HOVER_RADIUS_OFFSET}
      strokeDasharray={Config.HOVER_LINE_DASH}
      strokeWidth={Config.HOVER_LINE_WIDTH}
      stroke={Config.HOVER_STROKE_STYLE}
      fill="none" />
  </g>;

  /*
    const angle = hoverAngle;
    ctx.strokeStyle = Config.HOVER_STROKE_STYLE;
    ctx.lineWidth = Config.HOVER_LINE_WIDTH;
    ctx.beginPath();
    ctx.setLineDash(Config.HOVER_LINE_DASH);
    ctx.arc(x, y, r + Config.HOVER_RADIUS_OFFSET, 0 + angle, Config.PI2 + angle);
    ctx.stroke();
  */
}

function TrashArea(props)
{
  const trashArea = props.trashArea;
  /*
    //Shadows
    ctx.shadowColor = Config.TRASH_AREA_SHADOW_COLOR;
    ctx.shadowBlur = Config.TRASH_AREA_SHADOW_SIZE;
    ctx.shadowOffsetX = Config.TRASH_AREA_SHADOW_OFFSETX;
    ctx.shadowOffsetY = Config.TRASH_AREA_SHADOW_OFFSETY;
  */
  return <g>
    <rect
      x={trashArea.x} y={trashArea.y}
      width={trashArea.width} height={trashArea.height}
      fill={Config.TRASH_AREA_FILL_STYLE}
      stroke={Config.TRASH_AREA_STROKE_STYLE} />
  </g>;
}

export default hot(module)(App);
