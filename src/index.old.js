const canvas = document.getElementById("content");
const ctx = canvas.getContext("2d");
import Mouse from 'Mouse.js';
const mouse = new Mouse(canvas, document);

//Setup canvas
window.addEventListener('load', onWindowResize);
window.addEventListener('resize', onWindowResize);
function onWindowResize(event)
{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

//Setup render loop
window.requestAnimationFrame(onAnimationFrame);
function onAnimationFrame(time)
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  onCanvasDraw(ctx, time);
  window.requestAnimationFrame(onAnimationFrame);
}

const HALF_PI = Math.PI / 2.0;
const PI2 = Math.PI * 2.0;

const STATE_RADIUS = 16;
const STATE_RADIUS_INNER = 12;
const STATE_RADIUS_SQU = STATE_RADIUS * STATE_RADIUS;

const machine = new StateMachine();

//Setup input
mouse.events.on('mousedown', function(mouse, button) {
  if (button === 3)
  {
    //Move target?
    machine.startMove(mouse.x, mouse.y);
  }
  else
  {
    machine.markTarget(mouse.x, mouse.y);
  }
});
mouse.events.on('mouseup', function(mouse, button) {
  if (button === 3)
  {
    //Finish moving target?
    machine.endMove(mouse.x, mouse.y);
  }
  else
  {
    machine.releaseTarget(mouse.x, mouse.y);
  }
});

//Setup button
const buttonNewState = document.getElementById("newstate");
buttonNewState.addEventListener('click', onButtonClick)
function onButtonClick(event)
{
  //Create new state
  machine.createNewState();
}

function onCanvasDraw(ctx, time)
{
  machine.onUpdate(time);
  machine.onRender(ctx, time);
}

class StateMachine
{
  constructor()
  {
    this.targetSource = null;
    this.targetDestination = null;

    this.moveTarget = null;

    this.states = [];
    this.transitions = [];
    this.nextAvailableStateID = 0;
  }

  createNewState()
  {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const state = new Circle(x, y, STATE_RADIUS);
    state.nextX = x;
    state.nextY = y;
    state.id = this.nextAvailableStateID++;
    state.accept = false;
    this.states.push(state);
    return state;
  }

  createNewTransition(src, dst)
  {
    const transition = new Arrow(src, dst, "0");
    transition.source = src;
    transition.destination = dst;
    this.transitions.push(transition);
    return transition;
  }

  makeInitialState(state)
  {
    this.states.splice(this.states.indexOf(state), 1);
    this.states.unshift(state);
  }

  toggleAcceptState(state)
  {
    state.accept = !state.accept;
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
      this.toggleAcceptState(target);
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
      this.moveTarget.nextX = x;
      this.moveTarget.nextY = y;
    }
    this.moveTarget = null;
  }

  getStateByPosition(x, y)
  {
    for(const state of this.states)
    {
      const dx = x - state.x;
      const dy = y - state.y;
      if (dx * dx + dy * dy < STATE_RADIUS_SQU)
      {
        return state;
      }
    }

    return null;
  }

  getNearestState(src)
  {
    let nearest = null;
    let ndist = 0;
    for(const state of this.states)
    {
      if (src === state) continue;
      const dx = src.x - state.x;
      const dy = src.y - state.y;
      const dist = dx * dx + dy * dy;
      if (nearest === null || dist < ndist)
      {
        nearest = state;
        ndist = dist;
      }
    }

    return { state: nearest, length: ndist };
  }

  onUpdate(dt)
  {
    if (this.targetSource !== null)
    {
      const state = this.getStateByPosition(mouse.x, mouse.y);
      if (this.isSelfMode && state !== this.targetSource)
      {
        this.isSelfMode = false;
      }

      if (!this.isSelfMode)
      {
        this.targetDestination = state;
      }
    }

    for(const state of this.states)
    {
      state.x += (state.nextX - state.x) * 0.06;
      state.y += (state.nextY - state.y) * 0.06;
      if (Math.abs(state.x - state.nextX) < 0.001) state.nextX = state.x;
      if (Math.abs(state.y - state.nextY) < 0.001) state.nextY = state.y;
    }
  }

  onRender(ctx, dt)
  {
    const FILL = ctx.fillStyle = "yellow";
    const STROKE = ctx.strokeStyle = "black";
    const FONT = ctx.font = "12px Arial";
    const TEXTALIGN = ctx.textAlign= "center";
    const DASHSPACE = [6, 4];
    const ROTFACTOR = 1000;

    //Draw initial state marker
    if (this.states.length > 0)
    {
      const initState = this.states[0];
      const x = initState.x;
      const y = initState.y;
      ctx.beginPath();
      ctx.moveTo(x - STATE_RADIUS, y);
      ctx.lineTo(x - STATE_RADIUS * 2, y - STATE_RADIUS);
      ctx.lineTo(x - STATE_RADIUS * 2, y + STATE_RADIUS);
      ctx.closePath();
      ctx.stroke();
    }

    //Draw states
    for(const state of this.states)
    {
      const x = state.x;
      const y = state.y;

      ctx.beginPath();
      ctx.arc(x, y, STATE_RADIUS, 0, PI2);
      ctx.fill();
      ctx.stroke();

      if (state.accept)
      {
        ctx.beginPath();
        ctx.arc(x, y, STATE_RADIUS_INNER, 0, PI2);
        ctx.stroke();
      }

      ctx.fillStyle = "black";
      ctx.fillText("q" + state.id, x, y + 4);
      ctx.fillStyle = FILL;
    }

    //Draw transitions
    for(const transition of this.transitions)
    {
      drawTransition(ctx, transition.source, transition.destination);
    }

    //Draw user interactions
    if (this.targetSource !== null && !this.isSelfMode)
    {
      drawTransition(ctx, this.targetSource, this.targetDestination === null ? mouse : this.targetDestination);
    }
    if (this.moveTarget !== null)
    {
      const angle = (dt / ROTFACTOR) % PI2;
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash(DASHSPACE);
      ctx.arc(mouse.x, mouse.y, STATE_RADIUS, 0 + angle, PI2 + angle);
      ctx.stroke();
      ctx.restore();
    }
  }
}

function drawTransition(ctx, src, dst)
{
  const dx = src.x - dst.x;
  const dy = src.y - dst.y;
  const angle = -Math.atan2(dy, dx) - HALF_PI;
  const xx = STATE_RADIUS * Math.sin(angle);
  const yy = STATE_RADIUS * Math.cos(angle);
  if (dst instanceof Mouse)
  {
    drawArrow(ctx, src.x + xx, src.y + yy, dst.x, dst.y);
  }
  else if (src === dst)
  {
    ctx.beginPath();
    ctx.arc(src.x + STATE_RADIUS_INNER * 4.0 / 3.0, src.y - STATE_RADIUS_INNER * 4.0 / 3.0, STATE_RADIUS_INNER, Math.PI, Math.PI/2);
    //pathArrowHead(ctx, tox, toy, headLength, angle);
    ctx.stroke();
  }
  else
  {
    drawArrow(ctx, src.x + xx, src.y + yy, dst.x - xx, dst.y - yy);
  }
}

function drawArrow(ctx, fromx, fromy, tox, toy)
{
  const arrow = new Arrow({x: fromx, y: fromy}, {x: tox, y: toy}, "0");
  arrow.draw(ctx);

  //const headLength = 8;
  //const angle = Math.atan2(toy - fromy, tox - fromx);

  //ctx.beginPath();
  //ctx.moveTo(fromx, fromy);
  //ctx.lineTo(tox, toy);
  //pathArrowHead(ctx, tox, toy, headLength, angle);
  //ctx.stroke();
}

function pathArrowHead(ctx, x, y, headLength, angle)
{
  ctx.moveTo(x, y);
  ctx.lineTo(x - headLength * Math.cos(angle - Math.PI / 6.0), y - headLength * Math.sin(angle - Math.PI /  6.0));
  ctx.moveTo(x, y);
  ctx.lineTo(x - headLength * Math.cos(angle + Math.PI / 6.0), y - headLength * Math.sin(angle + Math.PI /  6.0));
}

class Arrow
{
  constructor(start, end, label)
  {
    this.start = start;
    this.end = end;
    this.label = label;

    this.quad = null;
  }

  get x() { return this.start.x + (this.end.x - this.start.x) / 2; }
  get y() { return this.start.y + (this.end.y - this.start.y) / 2; }

  draw(ctx)
  {
    const SIXTH_PI = Math.PI / 6.0;
    const startX = this.start.x;
    const startY = this.start.y;
    const endX = this.end.x;
    const endY = this.end.y;
    const arrowWidth = 8;
    let arrowAngle = 0;

    ctx.beginPath();
    ctx.moveTo(startX, startY);

    if (this.quad === null)
    {
      arrowAngle = Math.atan2(startX - endX, startY - endY) + Math.PI;
      ctx.lineTo(endX, endY);
    }
    else
    {
      const quadX = this.quad.x;
      const quadY = this.quad.y;
      arrowAngle = Math.atan2(quadX - endX, quadY - endY) + Math.PI;
      ctx.quadraticCurveTo(quadX, quadY, endX, endY);
    }

    ctx.moveTo(
      endX - (arrowWidth * Math.sin(arrowAngle - SIXTH_PI)),
      endY - (arrowWidth * Math.cos(arrowAngle - SIXTH_PI)));
    ctx.lineTo(endX, endY);
    ctx.lineTo(
      endX - (arrowWidth * Math.sin(arrowAngle + SIXTH_PI)),
      endY - (arrowWidth * Math.cos(arrowAngle + SIXTH_PI)));
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = "black";
    ctx.fillText(this.label, this.x, this.y);
  }
}

class Circle
{
  constructor(x = 0, y = 0, radius = 0)
  {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  draw(ctx)
  {

  }

  static checkCollision(circle1, circle2)
  {
    const minDist = circle1.radius + circle2.radius;
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    if (dx > -minDist
      && dx < minDist
      && dy > -minDist
      && dy < minDist
      && dx * dx + dy * dy < minDist * minDist)
    {
      return {
        x: ((circle1.x * circle2.radius) + (circle2.x * circle1.radius)) / minDist,
        y: ((circle1.y * circle2.radius) + (circle2.y * circle1.radius)) / minDist,
      };
    }

    return null;
  }
}
