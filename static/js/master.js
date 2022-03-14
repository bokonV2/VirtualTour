/*
 * VirtualTour
 * https://github.com/bokonV2/VirtualTour
 *
 * Developed by Bohan Zahar
 * https://t.me/AyToshi
 *
 * Licensed under the GNU General Public License v3.0:
 * https://github.com/bokonV2/VirtualTour/blob/main/LICENSE
 */


var canvasWidth = Number($("canvas").data("cwidth"));
var canvasHeight = Number($("canvas").data("cheight"));

var canvas = document.querySelector("canvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var mql = window.matchMedia("(orientation: portrait)");
var ctx = canvas.getContext("2d");
var pic = new Image();

var height, width, reWidth, reCWidth, reOffset;
var load = true, door = true, offset = 0, iconSize = "80px";
var scale = canvasHeight/600;
const oldId = new Array();
let data;
var id;


if(navigator.userAgent.match(/Android|iPhone/i)){
  if(mql.matches) {
    alert("Расположите устройсво горизонтально, Нестабильная работа на некоторых устройствах!");
    canvasHeight = $('.entry-content').height();
  } else {
    canvasHeight = $('.entry-content').height() / 2;
  };
  canvasWidth = $('.entry-content').width();
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;
  scale = canvasHeight/600;
  iconSize = "40px";
} else {
  };

mql.addListener(function(m) {location.reload()});


let label = document.createElement('div');
let div = document.createElement('div');
div.innerHTML = `
  <img id="butL" style="background: transparent;border: 0;" draggable="false" src="/static/image/btn/left.png" oncontextmenu="return false;" alt="left" width=${iconSize}>
  <button onclick="back()" style="background: transparent;border: 0;"><img src="/static/image/btn/return.png" oncontextmenu="return false;" alt="" width=${iconSize}></button>
  <button onclick="init(data)" style="background: transparent;border: 0;"><img src="/static/image/btn/home.png" oncontextmenu="return false;" alt="" width=${iconSize}></button>
  <img id="butR" style="background: transparent;border: 0;" draggable="false" src="/static/image/btn/right.png" oncontextmenu="return false;" alt="right" width=${iconSize}>
`;
div.style = "margin-top:5px;";
label.innerHTML = "<label>Developed by Bohan Zahar&nbsp</label><a href='https://t.me/AyToshi'>Telegram&nbsp</a><a href='https://www.instagram.com/zakhar.bokhan/'>Instagram</a>"
label.style = `display:flex; flex-direction:row; align-items:center; justify-content: flex-end; width:${canvasWidth}px;`;
$('.entry-content').prepend(label);
$('.entry-content').append(div);


$('#butR').clickAndHold({
  timeout: 5,
  onHold: function (e, n) {move(20)}
});
$('#butL').clickAndHold({
  timeout: 5,
  onHold: function (e, n) {move(-20)}
});


function paintImage(r) {
  var pic = new Image();
  switch (r.type) {
    case 1: pic.src = up; break;
    case 2: pic.src = down; break;
    case 3: pic.src = enterB; break;
    case 4: pic.src = loopB; break;
  };
  if (load) {pic.onload = function() {
      load = false;
      ctx.drawImage(pic, r.cords.x * scale - reOffset + 2, r.cords.y * scale, 46, 50);
  }} else {
    ctx.drawImage(pic, r.cords.x * scale - reOffset + 2, r.cords.y * scale, 46, 50);
  };
};

function ctxDraw(r) {
  ctx.beginPath();
  ctx.moveTo(r.cords.x * scale - reOffset, r.cords.y * scale);
  ctx.lineTo(r.cords.x * scale - reOffset, r.cords.y * scale + 50);
  ctx.lineTo(r.cords.x * scale + 50 - reOffset, r.cords.y * scale + 50);
  ctx.lineTo(r.cords.x * scale + 50 - reOffset, r.cords.y * scale);
  ctx.closePath();
};

function drawObjects(objects, offset, x, y, rtn) {
  reOffset = (offset/(reCWidth/canvasWidth));
  for(var r of objects) {
    switch (r.type) {
      case 0:
        ctx.beginPath();
        ctx.moveTo(r.cords.tr[0] * scale - reOffset, r.cords.tr[1] * scale);
        ctx.lineTo(r.cords.br[0] * scale - reOffset, r.cords.br[1] * scale);
        ctx.lineTo(r.cords.bl[0] * scale - reOffset, r.cords.bl[1] * scale);
        ctx.lineTo(r.cords.tl[0] * scale - reOffset, r.cords.tl[1] * scale);
        ctx.closePath();
        break;
      default:
        if (x == 0) {paintImage(r)};
        ctxDraw(r);
        break;
    };
    if (ctx.isPointInPath(x, y)) {
      ctx.strokeStyle = "yellow";
      ctx.stroke();
      return [true, r];
    } else {ctx.strokeStyle = "white"};
    ctx.stroke();
  };
};

function init(datas) {
  data = datas;
  id = "id0";
  oldId.push(id);
  // offset = data[id].offset; // IDEA: fixed offset on photo
  pic.src = data[id].img;
};

function back() {
  door = false;
  id = oldId[oldId.length-1];
  pic.src = data[oldId[oldId.length-1]].img;
  // offset = data[oldId[oldId.length-1]].offset; // IDEA: fixed offset on photo
  if (oldId.length > 1) {oldId.splice(oldId.length-1, 1)};
};

function move(side) {
  ctx.lineWidth = 2;
  offset = offset + side;
  var maxWidth = width - reCWidth;
  if (offset > maxWidth) {offset = maxWidth};
  if (offset < 0) {offset = 0};
  if (door) {
    ctx.drawImage(pic, offset, 0, width, height, 0, 0, reWidth, canvasHeight);
    drawObjects(data[id].buttons, offset, 0, 0);
  };
};


canvas.onmousemove = function(e) {
  ctx.lineWidth = 1;
  var rect = this.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  if (door) {
    drawObjects(data[id].buttons, offset, x, y);
  };
};

canvas.onmousedown = function (e) {
  var rect = this.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  var draw = drawObjects(data[id].buttons, offset, x, y);
  if (draw[0]){
    door = false;
    oldId.push(id);
    id = draw[1].idTo;
    pic.src = data[draw[1].idTo].img;
    offset = data[draw[1].idTo].offset;
  };
};

pic.onload = function () {
  load = true; door = true;
  ctx.lineWidth = 2;
  width = pic.width;
  height = pic.height;
  reWidth = Math.round(width/(height/canvasHeight));
  reCWidth = Math.round(canvasWidth/(canvasHeight/height));
  offset =  Math.round(width/2 - reCWidth/2);
  ctx.drawImage(pic, offset, 0, width, height, 0, 0, reWidth, canvasHeight);
  drawObjects(data[id].buttons, offset, 0, 0);
};


$.getJSON(`/static/json/data.json`, init);
