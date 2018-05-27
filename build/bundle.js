!function(t){var e={};function s(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,s),o.l=!0,o.exports}s.m=t,s.c=e,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:i})},s.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=0)}([function(t,e,s){"use strict";s.r(e);var i={__events:new Map,addListener(t,e){this.__events.has(t)||this.__events.set(t,[]),this.__events.get(t).push(e)},removeListener(t,e){if(!this.__events.has(t))return;const s=this.__events.get(t);s.splice(s.indexOf(e),1)},clearListeners(t){if(!this.__events.has(t))return;this.__events.get(t).length=0},countListeners(t){return this.__events.has(t)?this.__events.get(t).length:0},getListeners(t){return this.__events.get(t)},emit(t){if(!this.__events.has(t))return;const e=Array.prototype.splice.call(arguments,1),s=this.__events.get(t),i=s.length;let o=0;for(;o<i;){s[o].apply(null,e)?(s.splice(o,1),--o):++o}this.onEventProcessed(t,e)},on(t,e){this.addListener(t,e)},once(t,e){this.addListener(t,()=>(e(),!0))},onEventProcessed(t,e){}};const o=!0;class r{constructor(t,e){this.x=0,this.y=0,this.scrollX=0,this.scrollY=0,this._canvas=t,this._element=e,this._mouseup=this.onMouseUp.bind(this),this._mousedown=this.onMouseDown.bind(this),this._mouseclick=this.onMouseClick.bind(this),this._mousemove=this.onMouseMove.bind(this),this._wheel=this.onMouseWheel.bind(this),this._touchstart=this.onTouchStart.bind(this),this._touchmove=this.onTouchMove.bind(this),this._touchstop=this.onTouchStop.bind(this),this._contextmenu=(t=>!o||(t.preventDefault(),!1)),this._element.addEventListener("contextmenu",this._contextmenu,!1),this._element.addEventListener("mouseup",this._mouseup),this._element.addEventListener("mousedown",this._mousedown),this._element.addEventListener("click",this._mouseclick),this._element.addEventListener("mousemove",this._mousemove),this._element.addEventListener("wheel",this._wheel),this._element.addEventListener("touchstart",this._touchstart)}destroy(){this._element.removeEventListener("contextmenu",this._contextmenu),this._element.removeEventListener("mouseup",this._mouseup),this._element.removeEventListener("mousedown",this._mousedown),this._element.removeEventListener("click",this._mouseclick),this._element.removeEventListener("mousemove",this._mousemove),this._element.removeEventListener("wheel",this._wheel),this._element.removeEventListener("touchstart",this._touchstart)}onMouseUp(t){this.onMouseMove(t),this.emit("mouseup",this,t.which)}onMouseDown(t){this.onMouseMove(t),this.emit("mousedown",this,t.which)}onMouseClick(t){this.onMouseMove(t),this.emit("mouseclick",this,t.which)}onMouseWheel(t){this.scrollX+=t.deltaX,this.scrollY+=t.deltaY,this.emit("mousewheel",this,t.deltaX,t.deltaY)}onMouseMove(t){const e=this._canvas.getBoundingClientRect();this.x=t.clientX-e.left,this.y=t.clientY-e.top}onTouchStart(t){const e=t.touches[0].target;e.addEventListener("touchmove",this._touchmove),e.addEventListener("touchend",this._touchstop),e.addEventListener("touchcancel",this._touchstop)}onTouchStop(t){const e=t.touches[0].target;e.removeEventListener("touchmove",this._touchmove),e.removeEventListener("touchend",this._touchstop),e.removeEventListener("touchcancel",this._touchstop)}onTouchMove(t){this.onMouseMove(t.touches[0])}}r.BUTTON_LEFT=0,r.BUTTON_MIDDLE=1,r.BUTTON_RIGHT=2,Object.assign(r.prototype,i);var n=r;class h{constructor(t){this.nodes=[],this.edges=[],this.canvas=t,this._offsetX=0,this._offsetY=0,this.nextOffsetX=0,this.nextOffsetY=0}get centerX(){return this.canvas.width/2+this._offsetX}get centerY(){return this.canvas.height/2+this._offsetY}get offsetX(){return this._offsetX}get offsetY(){return this._offsetY}set offsetX(t){this.nextOffsetX=t}set offsetY(t){this.nextOffsetY=t}createNewNode(){const t=new a(this,0,0);return 0==this.nodes.length&&this.emit("newInitial",t,null),this.nodes.push(t),this.emit("nodeCreate",t),t}destroyNode(t){this.nodes.splice(this.nodes.indexOf(t),1),this.emit("nodeDestroy",t)}createNewEdge(t,e){const s=new l(this,t,e);return s.isSelfLoop()&&(s.y=t.y-SELF_LOOP_HEIGHT),this.edges.push(s),this.emit("edgeCreate",s),s}destroyEdge(t){this.edges.splice(this.edges.indexOf(t),1),this.emit("edgeDestroy",t)}clear(){for(let t of this.nodes)this.emit("nodeDestroy",t);this.nodes.length=0;for(let t of this.edges)this.emit("edgeDestroy",t);this.edges.length=0}update(t){this._offsetX=u(this._offsetX,this.nextOffsetX,t),this._offsetY=u(this._offsetY,this.nextOffsetY,t);for(let e of this.nodes)e.update(t)}setInitialState(t){if(this.nodes.length<=1)return;this.nodes.splice(this.nodes.indexOf(t),1);const e=this.nodes[0];this.nodes.unshift(t),this.emit("newInitial",t,e)}toggleAcceptState(t){t.accept=!t.accept,this.emit("toggleAccept",t)}getInitialState(){return this.nodes.length>0?this.nodes[0]:null}}Object.assign(h.prototype,i);class a{constructor(t,e=0,s=0,i="q"){this.graph=t,this.label=i,this._x=e,this._y=s,this.nextX=e,this.nextY=s,this.accept=!1}get x(){return this._x+this.graph.centerX}get y(){return this._y+this.graph.centerY}set x(t){this.nextX=t}set y(t){this.nextY=t}update(t){this._x=u(this._x,this.nextX,t),this._y=u(this._y,this.nextY,t)}}class l{constructor(t,e,s,i="#"){this.graph=t,this.label=i,this.from=e,this.to=s,this.quad=null}getStartPoint(){if(null==this.quad){const t=this.from.x-this.to.x,e=this.from.y-this.to.y,s=-Math.atan2(e,t)-HALF_PI,i=NODE_RADIUS*Math.sin(s),o=NODE_RADIUS*Math.cos(s);return[this.from.x+i,this.from.y+o]}{const t=this.getMidPoint(),e=t[0]+2*this.quad.x,s=t[1]+2*this.quad.y,i=this.from.x-e,o=this.from.y-s,r=-Math.atan2(o,i)-HALF_PI+(this.isSelfLoop()?FOURTH_PI:0),n=NODE_RADIUS*Math.sin(r),h=NODE_RADIUS*Math.cos(r),a=t;return a[0]=this.from.x+n,a[1]=this.from.y+h,a}}getCenterPoint(){const t=this.getMidPoint();return null!=this.quad&&(t[0]+=this.quad.x,t[1]+=this.quad.y),t}getEndPoint(){if(null==this.quad){const t=this.from.x-this.to.x,e=this.from.y-this.to.y,s=-Math.atan2(e,t)-HALF_PI,i=NODE_RADIUS*Math.sin(s),o=NODE_RADIUS*Math.cos(s);return[this.to.x-i,this.to.y-o]}{const t=this.getMidPoint(),e=t[0]+2*this.quad.x,s=t[1]+2*this.quad.y,i=e-this.to.x,o=s-this.to.y,r=-Math.atan2(o,i)-HALF_PI+(this.isSelfLoop()?-FOURTH_PI:0),n=NODE_RADIUS*Math.sin(r),h=NODE_RADIUS*Math.cos(r),a=t;return a[0]=this.to.x-n,a[1]=this.to.y-h,a}}getMidPoint(){return[this.from.x+(this.to.x-this.from.x)/2,this.from.y+(this.to.y-this.from.y)/2]}get centerX(){return this.from.x+(this.to.x-this.from.x)/2}get centerY(){return this.from.y+(this.to.y-this.from.y)/2}get x(){const t=this.centerX;return null!=this.quad?this.quad.x+t:t}get y(){const t=this.centerY;return null!=this.quad?this.quad.y+t:t}set x(t){null==this.quad&&(this.quad={x:0,y:0}),this.quad.x=t-this.centerX,Math.abs(this.quad.x)<8&&(this.quad.x=0),0==this.quad.x&&0==this.quad.y&&(this.quad=null)}set y(t){null==this.quad&&(this.quad={x:0,y:0}),this.quad.y=t-this.centerY,Math.abs(this.quad.y)<8&&(this.quad.y=0),0==this.quad.x&&0==this.quad.y&&(this.quad=null)}isSelfLoop(){return this.from==this.to}}function u(t,e,s){return t*(1-s)+e*s}function d(t,e){const s=e.x,i=e.y,o=e.label,r=e.accept;t.fillStyle=NODE_FILL_STYLE,t.beginPath(),t.arc(s,i,NODE_RADIUS,0,PI2),t.fill(),t.stroke(),r&&(t.beginPath(),t.arc(s,i,NODE_RADIUS_INNER,0,PI2),t.stroke()),t.fillStyle=NODE_TEXT_FILL_STYLE,t.fillText(o,s,i+4)}function c(t,e){e.from,e.to;const s=e.x,i=e.y,o=e.getMidPoint(),r=o[0],n=o[1],h=e.quad,l=e.label;let u=0,d=0,c=0;const g=e.getStartPoint(),m=e.to instanceof a?e.getEndPoint():[e.to.x,e.to.y];if(u=m[0],d=m[1],t.beginPath(),t.moveTo(g[0],g[1]),null==h)c=Math.atan2(g[0]-m[0],g[1]-m[1])+Math.PI,t.lineTo(m[0],m[1]);else{const s=e.getCenterPoint();s[0]+=e.quad.x,s[1]+=e.quad.y,c=Math.atan2(s[0]-m[0],s[1]-m[1])+Math.PI,t.quadraticCurveTo(s[0],s[1],m[0],m[1])}if(t.moveTo(u-ARROW_WIDTH*Math.sin(c-SIXTH_PI),d-ARROW_WIDTH*Math.cos(c-SIXTH_PI)),t.lineTo(u,d),t.lineTo(u-ARROW_WIDTH*Math.sin(c+SIXTH_PI),d-ARROW_WIDTH*Math.cos(c+SIXTH_PI)),t.stroke(),t.closePath(),l.length>0){const e=l.split(" ");let o=0;for(let a of e){let e=0,l=0,u=3*a.length,d=0;null==h?(e=r,l=n):(d=Math.sign(h.y),e=s,l=i+8*d),l+=o*(-d||1),t.clearRect(e-u-2,l-5,2*u+4,10),t.fillText(a,e,l+4),o-=12}}}var g=new class{constructor(){this.hoverAngle=0}render(t,e,s){if(this.drawNodes(t,s.nodes),s.nodes.length>0){const e=s.getInitialState();t.save(),function(t,e){const s=e.x,i=e.y;t.strokeStyle=EDGE_STROKE_STYLE,t.beginPath(),t.moveTo(s-NODE_RADIUS,i),t.lineTo(s-NODE_DIAMETER,i-NODE_RADIUS),t.lineTo(s-NODE_DIAMETER,i+NODE_RADIUS),t.closePath(),t.stroke()}(t,e),t.restore()}this.drawEdges(t,s.edges),this.hoverAngle=(this.hoverAngle+HOVER_ANGLE_SPEED)%PI2}drawNodes(t,e){if(t.save(),t.font=NODE_FONT,t.textAlign=NODE_TEXT_ALIGN,t.strokeStyle=NODE_STROKE_STYLE,t.fillStyle=NODE_FILL_STYLE,Array.isArray(e))for(let s of e)d(t,s);else d(t,e);t.restore()}drawEdges(t,e){if(t.save(),t.font=EDGE_FONT,t.textAlign=EDGE_TEXT_ALIGN,t.strokeStyle=EDGE_STROKE_STYLE,Array.isArray(e))for(let s of e)c(t,s);else c(t,e);t.restore()}drawHoverCircle(t,e,s,i){t.save();{const o=this.hoverAngle;t.strokeStyle=HOVER_STROKE_STYLE,t.lineWidth=HOVER_LINE_WIDTH,t.beginPath(),t.setLineDash(HOVER_LINE_DASH),t.arc(e,s,i,0+o,PI2+o),t.stroke()}t.restore()}};var m=new class{constructor(){this._simulatePhysics=!1}sort(){this._simulatePhysics=!0}update(t,e){if(this._simulatePhysics){let t=!1;for(const s of e.nodes)for(const i of e.nodes){if(s==i)continue;const e=s.nextX-i.nextX,o=s.nextY-i.nextY;e*e+o*o<PADDING_RADIUS_SQU&&(s.nextX+=.5*e,s.nextY+=.5*o,t=!0)}this._simulatePhysics=t}}};class _{constructor(t,e){this.graph=t,this.mouse=e,this.prevTargetX=0,this.prevTargetY=0,this.prevTargetNode=null,this.prevTargetEdge=null,this.prevTargetEndPoint=null,this.targetSource=null,this.targetDestination=null,this.targetMode=null}getNodeAt(t,e){for(const s of this.graph.nodes){const i=t-s.x,o=e-s.y;if(i*i+o*o<NODE_RADIUS_SQU)return s}return null}getEdgeAt(t,e){for(const s of this.graph.edges){const i=t-s.x,o=e-s.y;if(i*i+o*o<EDGE_RADIUS_SQU)return s}return null}getEdgeByEndPointAt(t,e){for(const s of this.graph.edges){const i=s.getEndPoint(),o=t-i[0],r=e-i[1];if(o*o+r*r<ENDPOINT_RADIUS_SQU)return s}return null}}Object.assign(_.prototype,i);var E=_;var f=class{constructor(){this.element=document.getElementById("label-editor"),this.inputElement=document.getElementById("label-editor-input"),this.inputElement.addEventListener("keyup",t=>{t.keyCode==SUBMIT_KEY?this.close(!0):t.keyCode==CLEAR_KEY&&this.close(!1)}),this.inputElement.addEventListener("blur",t=>{this.close(!1)}),this.target=null}open(t){return this.target!=t&&(this.target=t,this.element.style.left=this.target.x-this.element.offsetWidth/2+"px",this.element.style.top=this.target.y-this.element.offsetHeight/2+"px",this.inputElement.value=this.target.label,this.element.style.visibility="visible",this.inputElement.focus(),this.inputElement.select(),!0)}close(t=!1){return null!=this.target&&(t&&(this.target.label=this.inputElement.value),this.target=null,this.element.style.visibility="hidden",!0)}isOpen(){return null!=this.target}isEditting(t){return this.target==t}};var v=class{constructor(t,e){this.graph=t,this.cursor=e,this.target=null,this.targetMode=null,this.targetQuad=null,this.targetGraphX=0,this.targetGraphY=0}moveNode(t){this.target=t,this.targetMode="node"}moveEdge(t){this.target=t,this.targetMode="edge"}moveEndPoint(t){this.target=t,this.targetMode="endpoint";const e=this.target.quad;this.targetQuad=null!=e?{x:e.x,y:e.y}:null,this.cursor.targetMode="nodeOnly"}moveGraph(t,e){this.target=null,this.targetGraphX=t,this.targetGraphY=e,this.targetMode="graph"}beginMove(t,e){let s=null;(s=this.cursor.getNodeAt(t,e))?this.moveNode(s):(s=this.cursor.getEdgeAt(t,e))?this.moveEdge(s):(s=this.cursor.getEdgeByEndPointAt(t,e))?this.moveEndPoint(s):this.moveGraph(t,e)}updateMove(t,e){if(null!=this.targetMode)if("edge"==this.targetMode){if(null==this.target)throw new Error("Trying to resolve target mode '"+this.targetMode+"' with missing source");this.target.x=t,this.target.y=e}else if("endpoint"==this.targetMode){if(null==this.target)throw new Error("Trying to resolve target mode '"+this.targetMode+"' with missing source");this.resolveEdge(t,e,this.target)}else if("node"==this.targetMode){if(null==this.target)throw new Error("Trying to resolve target mode '"+this.targetMode+"' with missing source");this.target.x=t-this.graph.centerX,this.target.y=e-this.graph.centerY}else"graph"==this.targetMode&&(this.graph.offsetX=t-this.targetGraphX,this.graph.offsetY=e-this.targetGraphY)}endMove(t,e){if(null!=this.targetMode){if(this.updateMove(t,e),"endpoint"==this.targetMode){if(null==this.target)throw new Error("Trying to resolve target mode '"+this.targetMode+"' with missing source");null==this.cursor.targetDestination&&this.graph.destroyEdge(this.target),this.targetQuad=null,this.cursor.targetMode=null}this.target=null,this.targetMode=null}}resolveEdge(t,e,s){if(s.to=this.cursor.targetDestination||this.cursor.mouse,s.isSelfLoop()){const i=s.from.x-t,o=s.from.y-e,r=Math.atan2(o,i);s.x=s.from.x-Math.cos(r)*SELF_LOOP_HEIGHT,s.y=s.from.y-Math.sin(r)*SELF_LOOP_HEIGHT}else null!=this.targetQuad?(null==s.quad&&(s.quad={x:0,y:0}),s.quad.x=this.targetQuad.x,s.quad.y=this.targetQuad.y):s.quad=null}isMoving(){return null!=this.targetMode}};var p=class{constructor(t,e,s,i){this.graph=t,this.cursor=e,this.labelEditor=s,this.moveController=i,this.proxyEdge=new l(null,null,""),this.prevMouse={x:0,y:0}}createNewState(t,e){const s=this.graph.createNewNode();return s.label="q"+(this.graph.nodes.length-1),s.x=t||Math.random()*SPAWN_RADIUS*2-SPAWN_RADIUS,s.y=e||Math.random()*SPAWN_RADIUS*2-SPAWN_RADIUS,s}createNewTransition(t,e){const s=this.graph.createNewEdge(t,e);return s.label="0",s}beginEdit(t,e){(this.cursor.targetSource=this.cursor.getEdgeAt(t,e))?this.cursor.targetMode="edge":(this.cursor.targetSource=this.cursor.getNodeAt(t,e))?this.cursor.targetMode="state":(this.cursor.targetSource=this.cursor.getEdgeByEndPointAt(t,e))?this.cursor.targetMode="endpoint":(this.cursor.targetSource=null,this.cursor.targetMode=null),this.prevMouse.x=t,this.prevMouse.y=e}updateEdit(t,e,s){"state"==this.cursor.targetMode&&this.cursor.targetSource!=this.cursor.targetDestination&&(this.cursor.targetMode="create-edge",this.proxyEdge.from=this.cursor.targetSource),"create-edge"==this.cursor.targetMode&&(this.moveController.resolveEdge(e,s,this.proxyEdge),g.drawEdges(t,this.proxyEdge))}endEdit(t,e){if("state"==this.cursor.targetMode)this.graph.toggleAcceptState(this.cursor.targetSource);else if("edge"==this.cursor.targetMode)this.labelEditor.open(this.cursor.targetSource);else if("create-edge"==this.cursor.targetMode){if(null!=this.cursor.targetDestination){const t=this.createNewTransition(this.cursor.targetSource,this.cursor.targetDestination);null!=this.proxyEdge.quad&&(t.x=this.proxyEdge.x,t.y=this.proxyEdge.y),this.labelEditor.open(t)}}else if("endpoint"==this.cursor.targetMode);else if(null==this.cursor.targetMode&&null==this.cursor.targetSource){const s=t-this.prevMouse.x,i=e-this.prevMouse.y;s*s+i*i<CURSOR_RADIUS_SQU&&this.createNewState(t-this.graph.centerX,e-this.graph.centerY)}}};var y=class{constructor(t,e){this.graph=t,this.cursor=e}draw(t){const e=this.cursor.mouse.x,s=this.cursor.mouse.y;let i=null,o=null;if((i=this.cursor.targetDestination)?o="state":(i=this.cursor.getEdgeAt(e,s))?o="edge":(i=this.cursor.getEdgeByEndPointAt(e,s))&&(o="endpoint"),null!=i){let r=0,n=0,h=CURSOR_RADIUS;switch(o){case"state":r=i.x,n=i.y,h=NODE_RADIUS;break;case"edge":r=i.x,n=i.y,h=EDGE_RADIUS;break;case"endpoint":const t=i.getEndPoint();r=t[0],n=t[1],h=ENDPOINT_RADIUS;break;default:r=e,n=s}g.drawHoverCircle(t,r,n,h+HOVER_RADIUS_OFFSET)}}};var M=class{constructor(t,e,s){this.canvas=t,this.mouse=e,this.graph=s,this.cursor=new E(s,e),this.labelEditor=new f,this.moveController=new v(s,this.cursor),this.editController=new p(s,this.cursor,this.labelEditor,this.moveController),this.hoverController=new y(s,this.cursor),this.moveMode=!1}load(){this.mouse.on("mousedown",(t,e)=>{this.moveMode=3==e,this.markTarget(t.x,t.y)}),this.mouse.on("mouseup",(t,e)=>{this.moveMode=3==e,this.releaseTarget(t.x,t.y)}),document.getElementById("new_state").addEventListener("click",t=>{this.editController.createNewState()}),document.getElementById("clear_graph").addEventListener("click",t=>{this.graph.clear()}),document.getElementById("simulate_physics").addEventListener("click",t=>{m.sort()}),document.getElementById("export_image").addEventListener("click",t=>{const e=this.canvas.toDataURL("image/png");download(e,EXPORT_FILE_NAME,"image/png")})}draw(t,e){const s=this.mouse.x,i=this.mouse.y;this.cursor.targetDestination=this.cursor.getNodeAt(s,i),this.editController.updateEdit(t,s,i),this.moveController.isMoving()&&this.moveController.updateMove(s,i),this.hoverController.draw(t)}markTarget(t,e){if(this.labelEditor.isOpen())return this.labelEditor.close(!1),this.cursor.targetSource=null,this.cursor.targetDestination=null,void(this.cursor.targetMode="label-edit");this.moveMode?(this.moveController.beginMove(t,e),this.cursor.targetMode="move"):this.editController.beginEdit(t,e)}releaseTarget(t,e){this.moveMode?this.moveController.endMove(t,e):this.editController.endEdit(t,e),this.cursor.targetSource=null,this.cursor.targetMode=null}};var x=class{constructor(t){this.graph=t,this.graphLabelStates=document.getElementById("graph-states"),this.graph.on("nodeCreate",this.onNodeCreate.bind(this)),this.graph.on("nodeDestroy",this.onNodeDestroy.bind(this))}onNodeCreate(t){const e=document.createElement("label");e.setAttribute("contenteditable","true"),e.addEventListener("input",s=>{t.label=e.textContent}),e.innerHTML=t.label,t._element=e,this.graphLabelStates.appendChild(e)}onNodeDestroy(t){this.graphLabelStates.removeChild(t._element)}};const S=document.getElementById("canvas"),D=S.getContext("2d"),w=new n(S,S);function I(t){S.width=window.innerWidth,S.height=window.innerHeight}window.addEventListener("load",I),window.addEventListener("resize",I),window.onload=function(){let t=null,e=null,s=null;(t=T.createNewNode()).x=-64,t.y=0,t.label="q0",(e=T.createNewNode()).x=64,e.y=0,e.label="q1",(s=T.createNewEdge(t,e)).label="abc 0",L.load()},window.requestAnimationFrame(function t(e){D.clearRect(0,0,S.width,S.height);!function(t,e){const s=(e-N)/A;T.update(s),m.update(s,T),g.render(t,s,T),L.draw(t,s),N=e}(D,e);window.requestAnimationFrame(t)});const T=new h(S),L=new M(S,w,T);new x(T);let A=60,N=0}]);