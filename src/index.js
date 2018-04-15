import Mouse from 'Mouse.js';

const STATE_RADIUS = 16;
const STATE_RADIUS_INNER = 12;
const STATE_RADIUS_SQU = STATE_RADIUS * STATE_RADIUS;

const canvas = document.getElementById("content");
const ctx = canvas.getContext("2d");
const mouse = new Mouse(canvas, document);

const machine = new StateMachine();

//Setup input
mouse.events.on('mousedown', function(mouse) {
  machine.markTarget(mouse.x, mouse.y);
});
mouse.events.on('mouseup', function(mouse) {
  machine.releaseTarget(mouse.x, mouse.y);
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
  machine.onUpdate();
  machine.onRender();
  window.requestAnimationFrame(onAnimationFrame);
}

class StateMachine
{
  constructor()
  {
    this.targetSource = null;
    this.targetDestination = null;

    this.states = [];
    this.nextAvailableStateID = 0;
  }

  createNewState()
  {
    const state = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      id: this.nextAvailableStateID++,
      accept: false
    };
    this.states.push(state);
    return state;
  }

  toggleAcceptState(state)
  {
    state.accept = !state.accept;
  }

  makeInitialState(state)
  {
    this.states.splice(this.states.indexOf(state), 1);
    this.states.unshift(state);
  }

  markTarget(x, y)
  {
    this.targetSource = this.getStateByPosition(x, y);
    this.isSelfTargeting = true;
  }

  releaseTarget(x, y)
  {
    if (this.targetSource === null) return;

    const target = this.getStateByPosition(x, y);
    if (!this.isSelfTargeting && this.targetDestination !== null)
    {
      //Make a connection between source and destination
    }
    else if (target === this.targetSource)
    {
      this.toggleAcceptState(target);
    }

    this.targetSource = null;
    this.targetDestination = null;
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

  onUpdate()
  {
    if (this.targetSource !== null)
    {
      const state = this.getStateByPosition(mouse.x, mouse.y);
      if (this.isSelfTargeting && state !== this.targetSource)
      {
        this.isSelfTargeting = false;
      }

      if (!this.isSelfTargeting)
      {
        this.targetDestination = state;
      }
    }
  }

  onRender()
  {
    const FILL = ctx.fillStyle = "yellow";
    const STROKE = ctx.strokeStyle = "black";
    const FONT = ctx.font = "12px Arial";
    const TEXTALIGN = ctx.textAlign= "center";

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

    for(const state of this.states)
    {
      const x = state.x;
      const y = state.y;

      ctx.beginPath();
      ctx.arc(x, y, STATE_RADIUS, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      if (state.accept)
      {
        ctx.beginPath();
        ctx.arc(x, y, STATE_RADIUS_INNER, 0, 2 * Math.PI);
        ctx.stroke();
      }

      ctx.fillStyle = "black";
      ctx.fillText("q" + state.id, x, y + 4);
      ctx.fillStyle = FILL;
    }

    //Draw arrows
    if (this.targetSource !== null && !this.isSelfTargeting)
    {
      const fromx = this.targetSource.x;
      const fromy = this.targetSource.y;
      const tox = this.targetDestination === null ? mouse.x : this.targetDestination.x;
      const toy = this.targetDestination === null ? mouse.y : this.targetDestination.y;
      const headLength = 8;
      const angle = Math.atan2(toy - fromy, tox - fromx);

      ctx.beginPath();
      ctx.moveTo(fromx, fromy);
      ctx.lineTo(tox, toy);
      ctx.lineTo(tox - headLength * Math.cos(angle - Math.PI / 6.0), toy - headLength * Math.sin(angle - Math.PI /  6.0));
      ctx.moveTo(tox, toy);
      ctx.lineTo(tox - headLength * Math.cos(angle + Math.PI / 6.0), toy - headLength * Math.sin(angle + Math.PI /  6.0));
      ctx.stroke();
    }
  }
}
