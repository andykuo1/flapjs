!function(t){var e={};function s(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,s),o.l=!0,o.exports}s.m=t,s.c=e,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:i})},s.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=0)}([function(t,e,s){"use strict";s.r(e);var i={__events:new Map,addListener(t,e){this.__events.has(t)||this.__events.set(t,[]),this.__events.get(t).push(e)},removeListener(t,e){if(!this.__events.has(t))return;const s=this.__events.get(t);s.splice(s.indexOf(e),1)},clearListeners(t){if(!this.__events.has(t))return;this.__events.get(t).length=0},countListeners(t){return this.__events.has(t)?this.__events.get(t).length:0},getListeners(t){return this.__events.get(t)},emit(t){if(!this.__events.has(t))return;const e=Array.prototype.splice.call(arguments,1),s=this.__events.get(t),i=s.length;let o=0;for(;o<i;){s[o].apply(null,e)?(s.splice(o,1),--o):++o}this.onEventProcessed(t,e)},on(t,e){this.addListener(t,e)},once(t,e){this.addListener(t,()=>(e(),!0))},onEventProcessed(t,e){}};const o=!0;class r{constructor(t,e){this.x=0,this.y=0,this.scrollX=0,this.scrollY=0,this._canvas=t,this._element=e,this._mouseup=this.onMouseUp.bind(this),this._mousedown=this.onMouseDown.bind(this),this._mouseclick=this.onMouseClick.bind(this),this._wheel=this.onMouseWheel.bind(this),this._mousemove=this.onMouseMove.bind(this),this._mouseenter=this.onMouseEnter.bind(this),this._mouseexit=this.onMouseExit.bind(this),this._touchstart=this.onTouchStart.bind(this),this._touchmove=this.onTouchMove.bind(this),this._touchstop=this.onTouchStop.bind(this),this._contextmenu=(t=>!o||(t.preventDefault(),!1)),this._element.addEventListener("contextmenu",this._contextmenu,!1),this._element.addEventListener("mouseup",this._mouseup),this._element.addEventListener("mousedown",this._mousedown),this._element.addEventListener("click",this._mouseclick),this._element.addEventListener("wheel",this._wheel),this._element.addEventListener("mousemove",this._mousemove),this._element.addEventListener("mouseenter",this._mouseenter),this._element.addEventListener("mouseleave",this._mouseexit),this._element.addEventListener("touchstart",this._touchstart)}destroy(){this._element.removeEventListener("contextmenu",this._contextmenu),this._element.removeEventListener("mouseup",this._mouseup),this._element.removeEventListener("mousedown",this._mousedown),this._element.removeEventListener("click",this._mouseclick),this._element.removeEventListener("wheel",this._wheel),this._element.removeEventListener("mousemove",this._mousemove),this._element.removeEventListener("mouseenter",this._mouseenter),this._element.removeEventListener("mouseleave",this._mouseexit),this._element.removeEventListener("touchstart",this._touchstart)}onMouseUp(t){this.onMouseMove(t),this.emit("mouseup",this,t.which)}onMouseDown(t){this.onMouseMove(t),this.emit("mousedown",this,t.which)}onMouseClick(t){this.onMouseMove(t),this.emit("mouseclick",this,t.which)}onMouseWheel(t){this.scrollX+=t.deltaX,this.scrollY+=t.deltaY,this.emit("mousewheel",this,t.deltaX,t.deltaY)}onMouseMove(t){const e=this._canvas.getBoundingClientRect();this.x=t.clientX-e.left,this.y=t.clientY-e.top,this.emit("mousemove",this,this.x,this.y)}onMouseEnter(t){this.emit("mouseenter",this)}onMouseExit(t){this.emit("mouseexit",this)}onTouchStart(t){const e=t.touches[0].target;e.addEventListener("touchmove",this._touchmove),e.addEventListener("touchend",this._touchstop),e.addEventListener("touchcancel",this._touchstop)}onTouchStop(t){const e=t.touches[0].target;e.removeEventListener("touchmove",this._touchmove),e.removeEventListener("touchend",this._touchstop),e.removeEventListener("touchcancel",this._touchstop)}onTouchMove(t){this.onMouseMove(t.touches[0])}}r.BUTTON_LEFT=0,r.BUTTON_MIDDLE=1,r.BUTTON_RIGHT=2,Object.assign(r.prototype,i);var n=r;class h{constructor(t){this.nodes=[],this.edges=[],this.canvas=t,this._offsetX=0,this._offsetY=0,this.nextOffsetX=0,this.nextOffsetY=0}get centerX(){return this.canvas.width/2+this._offsetX}get centerY(){return this.canvas.height/2+this._offsetY}get offsetX(){return this._offsetX}get offsetY(){return this._offsetY}set offsetX(t){this.nextOffsetX=t}set offsetY(t){this.nextOffsetY=t}createNewNode(){const t=new a(this,0,0);return 0==this.nodes.length&&this.emit("newInitial",t,null),this.nodes.push(t),this.emit("nodeCreate",t),t}destroyNode(t){let e=null;for(let s=this.edges.length-1;s>=0;--s)(e=this.edges[s]).from==t?(this.edges.splice(s,1),this.emit("edgeDestroy",e)):e.to==t&&e.makePlaceholder();this.nodes.splice(this.nodes.indexOf(t),1),this.emit("nodeDestroy",t)}createNewEdge(t,e){const s=new l(this,t,e);return s.isSelfLoop()&&(s.y=t.y-SELF_LOOP_HEIGHT),this.edges.push(s),this.emit("edgeCreate",s),s}destroyEdge(t){this.edges.splice(this.edges.indexOf(t),1),this.emit("edgeDestroy",t)}clear(){for(let t of this.nodes)this.emit("nodeDestroy",t);this.nodes.length=0;for(let t of this.edges)this.emit("edgeDestroy",t);this.edges.length=0}update(t){this._offsetX=u(this._offsetX,this.nextOffsetX,t),this._offsetY=u(this._offsetY,this.nextOffsetY,t);for(const e of this.nodes)e.update(t)}setInitialState(t){if(this.nodes.length<=1)return;this.nodes.splice(this.nodes.indexOf(t),1);const e=this.nodes[0];this.nodes.unshift(t),this.emit("newInitial",t,e)}toggleAcceptState(t){t.accept=!t.accept,this.emit("toggleAccept",t)}getInitialState(){return this.nodes.length>0?this.nodes[0]:null}}Object.assign(h.prototype,i);class a{constructor(t,e=0,s=0,i="q"){this.graph=t,this.label=i,this._x=e,this._y=s,this.nextX=e,this.nextY=s,this.accept=!1}get x(){return this._x+this.graph.centerX}get y(){return this._y+this.graph.centerY}set x(t){this.nextX=t}set y(t){this.nextY=t}update(t){this._x=u(this._x,this.nextX,t),this._y=u(this._y,this.nextY,t)}}class l{constructor(t,e,s,i="#"){this.graph=t,this.label=i,this.from=e,this.to=s,this.quad=null}getStartPoint(){if(null==this.quad){const t=this.from.x-this.to.x,e=this.from.y-this.to.y,s=-Math.atan2(e,t)-HALF_PI,i=NODE_RADIUS*Math.sin(s),o=NODE_RADIUS*Math.cos(s);return[this.from.x+i,this.from.y+o]}{const t=this.getMidPoint(),e=t[0]+2*this.quad.x,s=t[1]+2*this.quad.y,i=this.from.x-e,o=this.from.y-s,r=-Math.atan2(o,i)-HALF_PI+(this.isSelfLoop()?FOURTH_PI:0),n=NODE_RADIUS*Math.sin(r),h=NODE_RADIUS*Math.cos(r),a=t;return a[0]=this.from.x+n,a[1]=this.from.y+h,a}}getCenterPoint(){const t=this.getMidPoint();return null!=this.quad&&(t[0]+=this.quad.x,t[1]+=this.quad.y),t}getEndPoint(){if(null==this.quad){const t=this.isPlaceholder()?1:NODE_RADIUS,e=this.from.x-this.to.x,s=this.from.y-this.to.y,i=-Math.atan2(s,e)-HALF_PI,o=t*Math.sin(i),r=t*Math.cos(i);return[this.to.x-o,this.to.y-r]}{const t=this.getMidPoint(),e=t[0]+2*this.quad.x,s=t[1]+2*this.quad.y,i=e-this.to.x,o=s-this.to.y,r=-Math.atan2(o,i)-HALF_PI+(this.isSelfLoop()?-FOURTH_PI:0),n=NODE_RADIUS*Math.sin(r),h=NODE_RADIUS*Math.cos(r),a=t;return a[0]=this.to.x-n,a[1]=this.to.y-h,a}}getMidPoint(){return[this.from.x+(this.to.x-this.from.x)/2,this.from.y+(this.to.y-this.from.y)/2]}get centerX(){return this.from.x+(this.to.x-this.from.x)/2}get centerY(){return this.from.y+(this.to.y-this.from.y)/2}get x(){const t=this.centerX;return null!=this.quad?this.quad.x+t:t}get y(){const t=this.centerY;return null!=this.quad?this.quad.y+t:t}set x(t){null==this.quad&&(this.quad={x:0,y:0}),this.quad.x=t-this.centerX,Math.abs(this.quad.x)<8&&(this.quad.x=0),0==this.quad.x&&0==this.quad.y&&(this.quad=null)}set y(t){null==this.quad&&(this.quad={x:0,y:0}),this.quad.y=t-this.centerY,Math.abs(this.quad.y)<8&&(this.quad.y=0),0==this.quad.x&&0==this.quad.y&&(this.quad=null)}makePlaceholder(){const t=this.from.x-this.to.x,e=this.from.y-this.to.y,s=-Math.atan2(t,e)-HALF_PI;this.to={from:this.from,dx:Math.cos(s),dy:Math.sin(s),get x(){return this.from.x+PLACEHOLDER_LENGTH*this.dx},get y(){return this.from.y+PLACEHOLDER_LENGTH*this.dy}}}isSelfLoop(){return this.from==this.to}isPlaceholder(){return!(this.to instanceof a)}}function u(t,e,s){return t*(1-s)+e*s}function c(t,e){const s=e.x,i=e.y,o=e.label,r=e.accept;t.fillStyle=NODE_FILL_STYLE,t.beginPath(),t.arc(s,i,NODE_RADIUS,0,PI2),t.fill(),t.stroke(),r&&(t.beginPath(),t.arc(s,i,NODE_RADIUS_INNER,0,PI2),t.stroke()),t.fillStyle=NODE_TEXT_FILL_STYLE,t.fillText(o,s,i+4)}function g(t,e){e.from,e.to;const s=e.x,i=e.y,o=e.getMidPoint(),r=o[0],n=o[1],h=e.quad,l=e.label;let u=0,c=0,g=0;const d=e.getStartPoint(),m=e.to instanceof a?e.getEndPoint():[e.to.x,e.to.y];if(u=m[0],c=m[1],t.beginPath(),t.moveTo(d[0],d[1]),null==h)g=Math.atan2(d[0]-m[0],d[1]-m[1])+Math.PI,t.lineTo(m[0],m[1]);else{const s=e.getCenterPoint();s[0]+=e.quad.x,s[1]+=e.quad.y,g=Math.atan2(s[0]-m[0],s[1]-m[1])+Math.PI,t.quadraticCurveTo(s[0],s[1],m[0],m[1])}if(t.moveTo(u-ARROW_WIDTH*Math.sin(g-SIXTH_PI),c-ARROW_WIDTH*Math.cos(g-SIXTH_PI)),t.lineTo(u,c),t.lineTo(u-ARROW_WIDTH*Math.sin(g+SIXTH_PI),c-ARROW_WIDTH*Math.cos(g+SIXTH_PI)),t.stroke(),t.closePath(),l.length>0){const e=l.split(" ");let o=0;for(let a of e){let e=0,l=0,u=3*a.length,c=0;null==h?(e=r,l=n):(c=Math.sign(h.y),e=s,l=i+8*c),l+=o*(-c||1),t.clearRect(e-u-2,l-5,2*u+4,10),t.fillText(a,e,l+4),o-=12}}}var d=new class{constructor(){this.hoverAngle=0}render(t,e,s){if(t.save(),this.drawNodes(t,s.nodes),s.nodes.length>0){const e=s.getInitialState();t.save(),function(t,e){const s=e.x,i=e.y;t.strokeStyle=EDGE_STROKE_STYLE,t.beginPath(),t.moveTo(s-NODE_RADIUS,i),t.lineTo(s-NODE_DIAMETER,i-NODE_RADIUS),t.lineTo(s-NODE_DIAMETER,i+NODE_RADIUS),t.closePath(),t.stroke()}(t,e),t.restore()}this.drawEdges(t,s.edges),this.hoverAngle=(this.hoverAngle+HOVER_ANGLE_SPEED)%PI2,t.restore()}drawNodes(t,e){if(t.save(),t.font=NODE_FONT,t.textAlign=NODE_TEXT_ALIGN,t.strokeStyle=NODE_STROKE_STYLE,t.fillStyle=NODE_FILL_STYLE,Array.isArray(e))for(let s of e)c(t,s);else c(t,e);t.restore()}drawEdges(t,e){if(t.save(),t.font=EDGE_FONT,t.textAlign=EDGE_TEXT_ALIGN,t.strokeStyle=EDGE_STROKE_STYLE,Array.isArray(e))for(let s of e)g(t,s);else g(t,e);t.restore()}drawHoverCircle(t,e,s,i){t.save();{const o=this.hoverAngle;t.strokeStyle=HOVER_STROKE_STYLE,t.lineWidth=HOVER_LINE_WIDTH,t.beginPath(),t.setLineDash(HOVER_LINE_DASH),t.arc(e,s,i,0+o,PI2+o),t.stroke()}t.restore()}};var m=class{constructor(){this.element=document.getElementById("label-editor"),this.inputElement=document.getElementById("label-editor-input"),this.inputElement.addEventListener("keyup",t=>{t.keyCode==SUBMIT_KEY?this.close(!0):t.keyCode==CLEAR_KEY&&this.close(!1)}),this.inputElement.addEventListener("blur",t=>{this.close(!1)}),this.target=null}open(t,e=null){return this.target!=t&&(this.target=t,this.element.style.left=this.target.x-this.element.offsetWidth/2+"px",this.element.style.top=this.target.y-this.element.offsetHeight/2+"px",this.inputElement.value=e||this.target.label,this.element.style.visibility="visible",this.inputElement.focus(),this.inputElement.select(),!0)}close(t=!1){return null!=this.target&&(t&&(this.target.label=this.inputElement.value),this.target=null,this.element.style.visibility="hidden",!0)}isOpen(){return null!=this.target}isEditting(t){return this.target==t}};var _=class{constructor(t,e){this.graph=t,this.mouse=e}getNodesWithin(t,e,s,i,o){for(const r of this.graph.nodes)r.x>=t&&r.x<s&&r.y>=e&&r.y<i&&o.push(r)}getNodeAt(t,e){for(const s of this.graph.nodes){const i=t-s.x,o=e-s.y;if(i*i+o*o<NODE_RADIUS_SQU)return s}return null}getEdgeAt(t,e){for(const s of this.graph.edges){const i=t-s.x,o=e-s.y;if(i*i+o*o<EDGE_RADIUS_SQU)return s}return null}getEdgeByEndPointAt(t,e){for(const s of this.graph.edges){const i=s.getEndPoint(),o=t-i[0],r=e-i[1];if(o*o+r*r<ENDPOINT_RADIUS_SQU)return s}return null}};var p=class{constructor(t){this.graph=t}onSingleTap(t,e,s,i,o){return!1}onDoubleTap(t,e,s,i,o){return!1}onStartDragging(t,e,s,i,o){return!1}onDragging(t,e,s,i,o){return!1}onStopDragging(t,e,s,i,o){return!1}};var E=class extends p{constructor(t,e){super(e),this.mainController=t}onSingleTap(t,e,s,i,o){return"node"==o?(this.graph.toggleAcceptState(i),!0):"edge"==o&&(this.mainController.openLabelEditor(i),!0)}onDoubleTap(t,e,s,i,o){return null==i&&(this.mainController.createNewState(e-this.graph.centerX,s-this.graph.centerY),!0)}onStartDragging(t,e,s,i,o){if("node"==o){const t=this.mainController.createNewTransition(i,null,STR_TRANSITION_PROXY_LABEL);return this.mainController.startMove(t,"endpoint"),!0}return!1}};var f=class extends p{constructor(t,e){super(e),this.mainController=t,this.prevTarget={x:0,y:0},this.graphTarget={x:0,y:0},this.quadTarget={x:0,y:0}}onStartDragging(t,e,s,i,o){return null!=i?(this.prevTarget.x=e,this.prevTarget.y=s,this.mainController.startMove(i,o)):(this.graphTarget.x=e,this.graphTarget.y=s,this.mainController.startMove(this.graphTarget,"graph")),!0}onDragging(t,e,s,i,o){return null!=i&&(this.moveTarget(t,i,o,e,s),!0)}onStopDragging(t,e,s,i,o){let r=!1;if(null!=i){if(r=this.moveTarget(t,i,o,e,s),"endpoint"==o)return r?i.label==STR_TRANSITION_PROXY_LABEL&&(i.label=STR_TRANSITION_DEFAULT_LABEL,this.mainController.openLabelEditor(i)):this.mainController.shouldDestroyPointlessEdges?this.graph.destroyEdge(i):(i.makePlaceholder(),i.label==STR_TRANSITION_PROXY_LABEL&&(i.label=STR_TRANSITION_DEFAULT_LABEL,this.mainController.openLabelEditor(i))),!0;if("node"==o&&this.mainController.isWithinTrash(e,s)){if(this.mainController.selectCursor.hasSelection()){for(const t of this.mainController.selectCursor.getSelection())this.graph.destroyNode(t);this.mainController.selectCursor.clearSelection()}else this.graph.destroyNode(i);return!0}}else r=this.moveTarget(t,this.graphTarget,"graph",e,s);return r}moveTarget(t,e,s,i,o){if(null==e)throw new Error("Trying to resolve target mode '"+s+"' with missing target source");if("node"==s){if(this.mainController.selectCursor.hasSelection()){const t=i-this.prevTarget.x,e=o-this.prevTarget.y;for(const s of this.mainController.selectCursor.getSelection())s.nextX+=t,s.nextY+=e;this.prevTarget.x=i,this.prevTarget.y=o}else e.x=i-this.graph.centerX,e.y=o-this.graph.centerY;return!0}if("edge"==s)return e.x=i,e.y=o,!0;if("endpoint"==s){let s=!0;const r=t.getNodeAt(i,o);if(r?(e.to=r,s=!0):(e.to=t.mouse,s=!1),e.isSelfLoop()){const t=e.from.x-i,s=e.from.y-o,r=Math.atan2(s,t);e.x=e.from.x-Math.cos(r)*SELF_LOOP_HEIGHT,e.y=e.from.y-Math.sin(r)*SELF_LOOP_HEIGHT}else 0!=this.quadTarget.x||0!=this.quadTarget.y?(e.x=e.y=1,e.quad.x=this.quadTarget.x,e.quad.y=this.quadTarget.y):e.quad=null;return s}return"graph"==s&&(this.graph.offsetX=i-e.x,this.graph.offsetY=o-e.y,!0)}};var y=class extends p{constructor(t,e){super(e),this.mainController=t,this.selectBox={x:0,y:0,mx:0,my:0,targets:[]},this.isSelecting=!1}onStartDragging(t,e,s,i,o){return null==i&&(this.isSelecting=!0,this.selectBox.x=e,this.selectBox.y=s,this.selectBox.mx=e,this.selectBox.my=s,this.clearSelection(),!0)}onDragging(t,e,s,i,o){return!!this.isSelecting&&(this.selectBox.mx=e,this.selectBox.my=s,this.getSelection(t),!0)}onStopDragging(t,e,s,i,o){return!!this.isSelecting&&(this.selectBox.mx=e,this.selectBox.my=s,this.getSelection(t),this.isSelecting=!1,!0)}draw(t){if(this.isSelecting){const e=this.selectBox.mx-this.selectBox.x,s=this.selectBox.my-this.selectBox.y;t.save(),t.shadowColor=SELECTION_BOX_SHADOW_COLOR,t.shadowBlur=SELECTION_BOX_SHADOW_SIZE,t.shadowOffsetX=SELECTION_BOX_SHADOW_OFFSETX,t.shadowOffsetY=SELECTION_BOX_SHADOW_OFFSETY,t.fillStyle=SELECTION_BOX_FILL_STYLE,t.strokeStyle=SELECTION_BOX_STROKE_STYLE,t.fillRect(this.selectBox.x,this.selectBox.y,e,s),t.strokeRect(this.selectBox.x,this.selectBox.y,e,s),t.restore()}if(this.hasSelection())for(const e of this.selectBox.targets)d.drawHoverCircle(t,e.x,e.y,NODE_RADIUS+HOVER_RADIUS_OFFSET)}getSelection(t){if(this.isSelecting){const e=Math.max(this.selectBox.mx,this.selectBox.x),s=Math.max(this.selectBox.my,this.selectBox.y),i=Math.min(this.selectBox.mx,this.selectBox.x),o=Math.min(this.selectBox.my,this.selectBox.y);this.clearSelection(),t.getNodesWithin(i,o,e,s,this.selectBox.targets)}return this.selectBox.targets}hasSelection(){return this.selectBox.targets.length>0}clearSelection(){this.selectBox.targets.length=0}};var x=class{constructor(t,e){this.graph=t,this.mouse=e,this.cursor=new _(t,e),this.labelEditor=new m,this.editCursor=new E(this,this.graph),this.moveCursor=new f(this,this.graph),this.selectCursor=new y(this,this.graph),this.moveMode=!1,this.tap={x:0,y:0},this.doubleTapTicks=0,this.isDown=!1,this.isDragging=!1,this.target=null,this.targetType=null,this.shouldDestroyPointlessEdges=!1}load(){this.mouse.on("mousedown",this.onMouseDown.bind(this)),this.mouse.on("mouseup",this.onMouseUp.bind(this)),this.mouse.on("mouseexit",this.onMouseExit.bind(this)),this.mouse.on("mousemove",this.onMouseMove.bind(this))}update(t){this.doubleTapTicks>0&&--this.doubleTapTicks}draw(t){const e=this.mouse.x,s=this.mouse.y;this.selectCursor.draw(t),this.drawHoverInformation(t,e,s)}drawHoverInformation(t,e,s){let i=null,o=null;if((i=this.target)?(i=this.target,o=this.targetType):(i=this.cursor.getNodeAt(e,s))?o="node":(i=this.cursor.getEdgeAt(e,s))?o="edge":(i=this.cursor.getEdgeByEndPointAt(e,s))&&(o="endpoint"),null!=i){if(this.selectCursor.selectBox.targets.includes(i))return;let e=0,s=0,r=CURSOR_RADIUS;switch(o){case"node":e=i.x,s=i.y,r=NODE_RADIUS;break;case"edge":e=i.x,s=i.y,r=EDGE_RADIUS;break;case"endpoint":const t=i.getEndPoint();e=t[0],s=t[1],r=ENDPOINT_RADIUS;break;default:e=e,s=s}d.drawHoverCircle(t,e,s,r+HOVER_RADIUS_OFFSET)}}onMouseDown(t,e){this.moveMode=3==e;const s=this.tap.x=t.x,i=this.tap.y=t.y;this.isDown=!0,this.isDragging=!1,(this.target=this.cursor.getNodeAt(s,i))?this.targetType="node":(this.target=this.cursor.getEdgeAt(s,i))?this.targetType="edge":(this.target=this.cursor.getEdgeByEndPointAt(s,i))?this.targetType="endpoint":(this.target=null,this.targetType=null),this.selectCursor.hasSelection()&&("node"==this.targetType&&this.selectCursor.selectBox.targets.includes(this.target)||this.selectCursor.clearSelection())}onMouseUp(t,e){const s=t.x,i=t.y;this.isDown=!1,this.isDragging?(this.doStopDragging(s,i),this.isDragging=!1):this.doubleTapTicks>0?this.doDoubleTap(s,i)||this.doSingleTap(s,i):(this.doSingleTap(s,i),this.doubleTapTicks=DOUBLE_TAP_TICKS),this.target=null,this.targetType=null}onMouseMove(t,e,s){if(this.isDragging)return void this.doDragging(e,s);if(!this.isDown)return;let i=this.tap.x,o=this.tap.y,r=CURSOR_RADIUS_SQU;if(null!=this.target)if("node"==this.targetType)i=this.target.x,o=this.target.y,r=NODE_RADIUS_SQU;else if("edge"==this.targetType)i=this.target.x,o=this.target.y,r=EDGE_RADIUS_SQU;else if("endpoint"==this.targetType){const t=this.target.getEndPoint();i=t[0],o=t[1],r=ENDPOINT_RADIUS_SQU}(i-=e)*i+(o-=s)*o>=r&&(this.isDragging=!0,this.doStartDragging(e,s))}onMouseExit(t){const e=t.x,s=t.y;this.isDragging&&(this.doStopDragging(e,s),this.isDragging=!1),this.isDown&&(this.onMouseUp(t,0),this.isDown=!1)}doSingleTap(t,e){return this.moveMode?this.moveCursor.onSingleTap(this.cursor,t,e,this.target,this.targetType):this.editCursor.onSingleTap(this.cursor,t,e,this.target,this.targetType)||this.selectCursor.onSingleTap(this.cursor,t,e,this.target,this.targetType)}doDoubleTap(t,e){return this.moveMode?this.moveCursor.onDoubleTap(this.cursor,t,e,this.target,this.targetType):this.editCursor.onDoubleTap(this.cursor,t,e,this.target,this.targetType)||this.selectCursor.onDoubleTap(this.cursor,t,e,this.target,this.targetType)}doStartDragging(t,e){return this.moveMode?this.moveCursor.onStartDragging(this.cursor,t,e,this.target,this.targetType):this.editCursor.onStartDragging(this.cursor,t,e,this.target,this.targetType)||this.selectCursor.onStartDragging(this.cursor,t,e,this.target,this.targetType)}doDragging(t,e){return this.moveMode?this.moveCursor.onDragging(this.cursor,t,e,this.target,this.targetType):this.editCursor.onDragging(this.cursor,t,e,this.target,this.targetType)||this.selectCursor.onDragging(this.cursor,t,e,this.target,this.targetType)}doStopDragging(t,e){return this.moveMode?this.moveCursor.onStopDragging(this.cursor,t,e,this.target,this.targetType):this.editCursor.onStopDragging(this.cursor,t,e,this.target,this.targetType)||this.selectCursor.onStopDragging(this.cursor,t,e,this.target,this.targetType)}createNewState(t,e){const s=this.graph.createNewNode();return s.label=STR_STATE_LABEL+(this.graph.nodes.length-1),s.x=t||Math.random()*SPAWN_RADIUS*2-SPAWN_RADIUS,s.y=e||Math.random()*SPAWN_RADIUS*2-SPAWN_RADIUS,s}createNewTransition(t,e,s=STR_TRANSITION_DEFAULT_LABEL){const i=this.graph.createNewEdge(t,e);return i.label=s,i}openLabelEditor(t,e=null){this.labelEditor.open(t,e)}startMove(t,e){if(this.moveMode=!0,this.target=t,this.targetType=e,"endpoint"==this.targetType){const t=this.target.quad;null!=t?(this.moveCursor.quadTarget.x=t.x,this.moveCursor.quadTarget.y=t.y):(this.moveCursor.quadTarget.x=0,this.moveCursor.quadTarget.y=0)}this.moveCursor.moveTarget(this.cursor,this.target,this.targetType,this.mouse.x,this.mouse.y)}isWithinTrash(t,e){return!1}};var T=new class{constructor(){this._simulatePhysics=!1}sort(){this._simulatePhysics=!0}update(t,e){if(this._simulatePhysics){let t=!1;for(const s of e.nodes)for(const i of e.nodes){if(s==i)continue;const e=s.nextX-i.nextX,o=s.nextY-i.nextY;e*e+o*o<PADDING_RADIUS_SQU&&(s.nextX+=.5*e,s.nextY+=.5*o,t=!0)}this._simulatePhysics=t}}};var S=class{constructor(t,e,s){this.canvas=t,this.graph=e,this.cursorController=s}load(){document.getElementById("new_state").addEventListener("click",t=>{this.cursorController.createNewState()}),document.getElementById("clear_graph").addEventListener("click",t=>{this.graph.clear()}),document.getElementById("simulate_physics").addEventListener("click",t=>{T.sort()}),document.getElementById("export_image").addEventListener("click",t=>{const e=this.canvas.toDataURL("image/png");download(e,EXPORT_FILE_NAME,"image/png")})}update(t){T.update(t,this.graph)}};const v=document.getElementById("canvas"),D=v.getContext("2d"),L=new n(v,v);function I(t){v.width=window.innerWidth,v.height=window.innerHeight}window.addEventListener("load",I),window.addEventListener("resize",I),window.onload=function(){let t=null,e=null,s=null;(t=O.createNewNode()).x=-64,t.y=0,t.label="q0",(e=O.createNewNode()).x=64,e.y=0,e.label="q1",(s=O.createNewEdge(t,e)).label="abc 0",A.load(),M.load()},window.requestAnimationFrame(function t(e){D.clearRect(0,0,v.width,v.height);!function(t,e){const s=(e-N)/w;O.update(s),A.update(s),M.update(s),d.render(t,s,O),A.draw(t),N=e}(D,e);window.requestAnimationFrame(t)});const O=new h(v),A=new x(O,L),M=new S(v,O,A);let w=60,N=0}]);