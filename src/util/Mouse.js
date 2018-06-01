import Eventable from 'util/Eventable.js';

const PREVENT_CONTEXT_MENU = true;

//EVENT: mouseup(mouse, button)
//EVENT: mousedown(mouse, button)
//EVENT: mouseclick(mouse, button)
//EVENT: mousewheel(mouse, dx, dy)
//EVENT: mouseenter(mouse)
//EVENT: mouseexit(mouse)

class Mouse
{
  /**
   * constructor - Creates and registers this with the element to listen for
   * mouse events
   *
   * @param {type} viewport The viewport to calculate appropriate mouse position
   * @param {type} element The element to listen for mouse events
   */
  constructor(viewport, element)
  {
    this.x = 0;
    this.y = 0;
    this.scrollX = 0;
    this.scrollY = 0;

    this._viewport = viewport;
    this._element = element;

    this._mouseup = this.onMouseUp.bind(this);
    this._mousedown = this.onMouseDown.bind(this);
    this._mouseclick = this.onMouseClick.bind(this);
    this._wheel = this.onMouseWheel.bind(this);
    this._mousemove = this.onMouseMove.bind(this);
    this._mouseenter = this.onMouseEnter.bind(this);
    this._mouseexit = this.onMouseExit.bind(this);
    this._touchstart = this.onTouchStart.bind(this);

    this._touchmove = this.onTouchMove.bind(this);
    this._touchstop = this.onTouchStop.bind(this);

    this._contextmenu = event => {
      if (PREVENT_CONTEXT_MENU)
      {
        event.preventDefault();
        return false;
      }
      return true;
    };

    this._viewport.addEventListener('contextmenu', this._contextmenu, false);
    this._viewport.addEventListener('mouseup', this._mouseup);
    this._viewport.addEventListener('mousedown', this._mousedown);
    this._viewport.addEventListener('click', this._mouseclick);
    this._viewport.addEventListener('wheel', this._wheel);
    this._element.addEventListener('mousemove', this._mousemove);
    this._viewport.addEventListener('mouseenter', this._mouseenter);
    this._viewport.addEventListener('mouseleave', this._mouseexit);
    this._viewport.addEventListener('touchstart', this._touchstart);
  }

  destroy()
  {
    this._viewport.removeEventListener('contextmenu', this._contextmenu);
    this._viewport.removeEventListener('mouseup', this._mouseup);
    this._viewport.removeEventListener('mousedown', this._mousedown);
    this._viewport.removeEventListener('click', this._mouseclick);
    this._viewport.removeEventListener('wheel', this._wheel);
    this._element.removeEventListener('mousemove', this._mousemove);
    this._viewport.removeEventListener('mouseenter', this._mouseenter);
    this._viewport.removeEventListener('mouseleave', this._mouseexit);
    this._viewport.removeEventListener('touchstart', this._touchstart);
  }

  onMouseUp(event)
  {
    this.onMouseMove(event);
    this.emit('mouseup', this, event.which);
  }

  onMouseDown(event)
  {
    this.onMouseMove(event);
    this.emit('mousedown', this, event.which);
  }

  onMouseClick(event)
  {
    this.onMouseMove(event);
    this.emit('mouseclick', this, event.which);
  }

  onMouseWheel(event)
  {
    this.scrollX += event.deltaX;
    this.scrollY += event.deltaY;
    this.emit('mousewheel', this, event.deltaX, event.deltaY);
  }

  onMouseMove(event)
  {
    const screen = this._viewport.getBoundingClientRect();
    this.x = event.clientX - screen.left;
    this.y = event.clientY - screen.top;
    this.emit('mousemove', this, this.x, this.y);
  }

  onMouseEnter(event)
  {
    this.emit('mouseenter', this);
  }

  onMouseExit(event)
  {
    this.emit('mouseexit', this);
  }

  onTouchStart(event)
  {
    const target = event.touches[0].target;
    target.addEventListener('touchmove', this._touchmove);
    target.addEventListener('touchend', this._touchstop);
    target.addEventListener('touchcancel', this._touchstop);
  }

  onTouchStop(event)
  {
    const target = event.touches[0].target;
    target.removeEventListener('touchmove', this._touchmove);
    target.removeEventListener('touchend', this._touchstop);
    target.removeEventListener('touchcancel', this._touchstop);
  }

  onTouchMove(event)
  {
    this.onMouseMove(event.touches[0]);
  }
}

Mouse.BUTTON_LEFT = 0;
Mouse.BUTTON_MIDDLE = 1;
Mouse.BUTTON_RIGHT = 2;

Object.assign(Mouse.prototype, Eventable);

export default Mouse;
