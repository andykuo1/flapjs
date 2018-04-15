import Mouse from 'Mouse.js';

const HALF_PI = Math.PI / 2.0;
const PI2 = Math.PI * 2.0;

const STATE_RADIUS = 16;
const STATE_RADIUS_INNER = 12;
const STATE_RADIUS_SQU = STATE_RADIUS * STATE_RADIUS;

const canvas = document.getElementById("content");
const ctx = canvas.getContext("2d");
const mouse = new Mouse(canvas, document);

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
  machine.onUpdate(time);
  machine.onRender(ctx, time);
  window.requestAnimationFrame(onAnimationFrame);
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
    const state = {
      x: x,
      y: y,
      nextX: x,
      nextY: y,
      id: this.nextAvailableStateID++,
      accept: false
    };
    this.states.push(state);
    return state;
  }

  createNewTransition(src, dst)
  {
    const transition = {
      source: src,
      destination: dst
    };
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
      ctx.fill();
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
    //TODO: Try bezierCurveTo
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
  const headLength = 8;
  const angle = Math.atan2(toy - fromy, tox - fromx);

  ctx.beginPath();
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  pathArrowHead(ctx, tox, toy, headLength, angle);
  ctx.stroke();
}

function pathArrowHead(ctx, x, y, headLength, angle)
{
  ctx.moveTo(x, y);
  ctx.lineTo(x - headLength * Math.cos(angle - Math.PI / 6.0), y - headLength * Math.sin(angle - Math.PI /  6.0));
  ctx.moveTo(x, y);
  ctx.lineTo(x - headLength * Math.cos(angle + Math.PI / 6.0), y - headLength * Math.sin(angle + Math.PI /  6.0));
}
