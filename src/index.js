import Mouse from 'Mouse.js';

const STATE_RADIUS = 16;
const STATE_RADIUS_INNER = 12;

const canvas = document.getElementById("content");
const ctx = canvas.getContext("2d");
const mouse = new Mouse(canvas, document);

const machine = new StateMachine();

//Setup input
mouse.events.on('mouseclick', function(mouse) {
  const state = machine.getStateByPosition(mouse.x, mouse.y);
  if (state !== null)
  {
    machine.toggleAcceptState(state);
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
  machine.onRender();
  window.requestAnimationFrame(onAnimationFrame);
}

class StateMachine
{
  constructor()
  {
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

  getStateByPosition(x, y)
  {
    for(const state of this.states)
    {
      const dx = x - state.x;
      const dy = y - state.y;
      if (dx * dx + dy * dy < STATE_RADIUS * STATE_RADIUS)
      {
        return state;
      }
    }
  }

  onUpdate()
  {

  }

  onRender()
  {
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

    for(const state of this.states)
    {
      const x = state.x;
      const y = state.y;

      ctx.beginPath();
      ctx.arc(x, y, STATE_RADIUS, 0, 2 * Math.PI);
      ctx.stroke();

      if (state.accept)
      {
        ctx.beginPath();
        ctx.arc(x, y, STATE_RADIUS_INNER, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  }
}
