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
var path = $("canvas").data("path")

var canvas = document.querySelector("canvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var ctx = canvas.getContext("2d");
var pic = new Image();

var height, width, reWidth, reCWidth, reOffset;
var load = true, door = true, offset = 0;
const oldId = new Array();
let data;
var id;

let label = document.createElement('div');
let div = document.createElement('div');
div.innerHTML = '<div style="margin-top:5px;">\
  <img id="butL" style="background: transparent;border: 0;" draggable="false" src="/static/image/btn/left.png" oncontextmenu="return false;" alt="left" width=80px>\
  <button onclick="back()" style="background: transparent;border: 0;"><img src="/static/image/btn/return.png" oncontextmenu="return false;" alt="" width=80px></button>\
  <button onclick="init(data)" style="background: transparent;border: 0;"><img src="/static/image/btn/home.png" oncontextmenu="return false;" alt="" width=80px></button>\
  <img id="butR" style="background: transparent;border: 0;" draggable="false" src="/static/image/btn/right.png" oncontextmenu="return false;" alt="right" width=80px>\
</div>'
label.innerHTML = "<label>Developed by Bohan Zahar&nbsp</label><a href='https://t.me/AyToshi'>Telegram&nbsp</a><a href='https://www.instagram.com/zakhar.bokhan/'>Instagram</a>"
label.style = `display:flex; flex-direction:row; align-items:center; justify-content: flex-end; width:${canvasWidth}px;`;
$('.entry-content').prepend(label);
$('.entry-content').append(div);


if(navigator.userAgent.match(/Android|iPhone/i)){
  if(window.matchMedia("(orientation: portrait)").matches) {
    alert("Расположите устройсво горизонтально, работает не правильно");
}} else {
  };


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
      ctx.drawImage(pic, r.cords.x - reOffset + 2, r.cords.y, 46, 50);
  }} else {ctx.drawImage(pic, r.cords.x - reOffset + 2, r.cords.y, 46, 50)};
};

function drawObjects(objects, offset, x, y, rtn) {
  function ctxDraw(r) {
    ctx.beginPath();
    ctx.moveTo(r.cords.x - reOffset, r.cords.y);
    ctx.lineTo(r.cords.x - reOffset, r.cords.y + 50);
    ctx.lineTo(r.cords.x + 50 - reOffset, r.cords.y + 50);
    ctx.lineTo(r.cords.x + 50 - reOffset, r.cords.y);
    ctx.closePath();
  };

  reOffset = (offset/(reCWidth/canvasWidth));
  for(var r of objects) {
    switch (r.type) {
      case 0:
        ctx.beginPath();
        ctx.moveTo(r.cords.tr[0] - reOffset, r.cords.tr[1]);
        ctx.lineTo(r.cords.br[0] - reOffset, r.cords.br[1]);
        ctx.lineTo(r.cords.bl[0] - reOffset, r.cords.bl[1]);
        ctx.lineTo(r.cords.tl[0] - reOffset, r.cords.tl[1]);
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
    return [false, NaN]
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
  if (offset > width-reCWidth) {offset = width-reCWidth};
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


$.getJSON(path + '/static/json/data.json', init);
