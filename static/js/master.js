var canvas = document.querySelector("canvas");
var canvasWidth = 800, canvasHeight = 600;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var ctx = canvas.getContext("2d");
var pic = new Image();

var spX = $('#spX');
var spY = $('#spY');
var spO = $('#spO');

var load = true, door = true, offset = 0;
var height, width, id;
const oldId = new Array();
let data;
var reWidth, reCWidth, reOffset;

let div = document.createElement('div'); //div с элементами управления сдвига и кнопкой "домой"
div.innerHTML = '<div style="margin-top:5px;">\
  <button id="butL" style="background: transparent;border: 0;"><img src="/static/image/btn/left.png" alt="" width=80px></button>\
  <button onclick="back()" style="background: transparent;border: 0;"><img src="/static/image/btn/return.png" alt="" width=80px></button>\
  <button onclick="init(data)" style="background: transparent;border: 0;"><img src="/static/image/btn/home.png" alt="" width=80px></button>\
  <button id="butR" style="background: transparent;border: 0;"><img src="/static/image/btn/right.png" alt="" width=80px></button>\
</div>'
$('.entry-content').append(div);


if(navigator.userAgent.match(/Android|iPhone/i)){ // Настройка для мобильных устройств
  if(window.matchMedia("(orientation: portrait)").matches) {
    alert("Расположите устройсво горизонтально");
  };
  $('#butR').click(function () {move(20);});
  $('#butL').click(function () {move(-20);});
} else {
  $('#butR').clickAndHold({
    timeout: 5,
    onHold: function (e, n) {
      move(10);
    }
  });
  $('#butL').clickAndHold({
    timeout: 5,
    onHold: function (e, n) {
      move(-10);
    }
  });
};


function paintImage(r) {
  var pic = new Image();
  if (r.type == 1){pic.src = up} else {pic.src = down};
  if (load) {pic.onload = function() {
      load = false;
      ctx.drawImage(pic, r.cords.x - reOffset + 2, r.cords.y, 46, 50);
    };
  } else {ctx.drawImage(pic, r.cords.x - reOffset + 2, r.cords.y, 46, 50)};
};

function drawObjects(objects, offset, x, y, rtn) {
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
        if (ctx.isPointInPath(x, y)) {
          ctx.strokeStyle = "yellow";
          ctx.stroke();
          return [true, r];
        } else {
          ctx.strokeStyle = "white";
        }
        ctx.stroke();
        break;
      case 1:
        if (x == 0) {
          paintImage(r);
        };
        ctx.beginPath();
        ctx.moveTo(r.cords.x - reOffset, r.cords.y);
        ctx.lineTo(r.cords.x - reOffset, r.cords.y + 50);
        ctx.lineTo(r.cords.x + 50 - reOffset, r.cords.y + 50);
        ctx.lineTo(r.cords.x + 50 - reOffset, r.cords.y);
        ctx.closePath();
        if (ctx.isPointInPath(x, y)) {
          ctx.strokeStyle = "yellow";
          ctx.stroke();
          return [true, r];
        } else {ctx.strokeStyle = "white"};
        ctx.stroke();
        break;
      case 2:
        if (x == 0) {
          paintImage(r);
        }
        ctx.beginPath();
        ctx.moveTo(r.cords.x - reOffset, r.cords.y);
        ctx.lineTo(r.cords.x - reOffset, r.cords.y + 50);
        ctx.lineTo(r.cords.x + 50 - reOffset, r.cords.y + 50);
        ctx.lineTo(r.cords.x + 50 - reOffset, r.cords.y);
        ctx.closePath();
        if (ctx.isPointInPath(x, y)) {
          ctx.strokeStyle = "yellow";
          ctx.stroke();
          return [true, r];
        } else {ctx.strokeStyle = "white"}
        ctx.stroke();
        break;
    };
  };
};

function init(datas) {
  data = datas;
  id = "id0";
  offset = data[id].offset;
  pic.src = data[id].img;
};

function back() {
  door = false;
  id = oldId[oldId.length-1];
  pic.src = data[oldId[oldId.length-1]].img;
  offset = data[oldId[oldId.length-1]].offset;
  if (oldId.length > 1){
    oldId.splice(oldId.length-1, 1);
  }
};

function move(side) {
  ctx.lineWidth = 2;
  offset = offset + side;
  if (offset > width-reCWidth){
    offset = width-reCWidth;
  }
  if (offset < 0) {
      offset = 0;
  }
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
  spX.html("x: " + x);
  spY.html("y: " + y);
  spO.html("offset: " + offset);
  if (door) {
    drawObjects(data[id].buttons, offset, x, y);
  }
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


$.getJSON('/static/json/data.json', init);
// document.addEventListener("DOMContentLoaded", init, false);
