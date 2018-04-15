const canvas = document.getElementById("content");
const ctx = canvas.getContext("2d");

//Setup canvas
canvas.width = window.innerWidth;
canvas.height = window.innerWidth * 3.0 / 4.0;

//Setup Mouse
var mouse = {
  x: 0, y:0
};
function onMouseMove(event)
{
  mouse.x = event.clientX;
  mouse.y = event.clientY;
}
document.onmousemove = onMouseMove;

//Setup render loop
function onAnimationFrame(time)
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 10, 0, 2 * Math.PI);
  ctx.stroke();
  window.requestAnimationFrame(onAnimationFrame);
}
window.requestAnimationFrame(onAnimationFrame);
