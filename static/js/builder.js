var canvas = document.querySelector("canvas");
var canvasWidth = 800, canvasHeight = 600;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var spX = $('#spX');
var spY = $('#spY');
var spO = $('#spO');

var ctx = canvas.getContext("2d");
var pic = new Image();

var load = true, door = true, offset = 0;
var cords = {};
var mode = 0;
var i = 0;

var height;
var width;
var reWidth;
var reCWidth;
var reOffset;
let data;
var id;

var temp = 10;

let div = document.createElement('div');
div.innerHTML = '<div style="margin-top:5px;">\
  <button id="butL" style="background: transparent;border: 0;"><img src="/static/image/btn/left.png" alt="" width=80px></button>\
  <button onclick="init(data)" style="background: transparent;border: 0;"><img src="/static/image/btn/home.png" alt="" width=80px></button>\
  <button id="butR" style="background: transparent;border: 0;"><img src="/static/image/btn/right.png" alt="" width=80px></button>\
</div>'
$('.entry-content').append(div);


$(document).ready(function () {
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
});

function paintImage(r) {
  var pic = new Image();
  if (r.type == 1){
    pic.src = up;
  }else{
    pic.src = down;
  }
  pic.onload = function() {
    ctx.drawImage(pic, r.cords.x - reOffset + 2, r.cords.y, 46, 50);  // Рисуем изображение от точки с координатами 0, 0
  };
};


function drawObjects(objects, offset, x, y, rtn) {
  var index = 0;
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
          return [true, r, index];
        } else {
          ctx.strokeStyle = "white";
        }
        ctx.stroke();
        break;
        case 1:
          paintImage(r);
          ctx.beginPath();
          ctx.moveTo(r.cords.x - reOffset, r.cords.y);
          ctx.lineTo(r.cords.x - reOffset, r.cords.y + 50);
          ctx.lineTo(r.cords.x + 50 - reOffset, r.cords.y + 50);
          ctx.lineTo(r.cords.x + 50 - reOffset, r.cords.y);
          ctx.closePath();
          if (ctx.isPointInPath(x, y)) {
            ctx.strokeStyle = "yellow";
            ctx.stroke();
            return [true, r, index];
          } else {
            ctx.strokeStyle = "white";
          }
          ctx.stroke();
          break;
        case 2:
          paintImage(r);
          ctx.beginPath();
          ctx.moveTo(r.cords.x - reOffset, r.cords.y);
          ctx.lineTo(r.cords.x - reOffset, r.cords.y + 50);
          ctx.lineTo(r.cords.x + 50 - reOffset, r.cords.y + 50);
          ctx.lineTo(r.cords.x + 50 - reOffset, r.cords.y);
          ctx.closePath();
          if (ctx.isPointInPath(x, y)) {
            ctx.strokeStyle = "yellow";
            ctx.stroke();
            return [true, r, index];
          } else {
            ctx.strokeStyle = "white";
          }
          ctx.stroke();
          break;
    }
    index = index + 1;

  };
};

function init(datas) {
  console.log(datas);
  data = datas;
  id = "id0";
  offset = data[id].offset;
  pic.src = data[id].img;
};

function move(side) {
  offset = offset + side;

  if (offset > width-reCWidth) {
    offset = width-reCWidth;
  }

  if (offset < 0) {
    offset = 0;
  }

  ctx.drawImage(pic, offset, 0, width, height, 0, 0, reWidth, canvasHeight);
  drawObjects(data[id].buttons, offset, 0, 0);
};

function openImg(ids, src) {
    id = ids;
    if (id in data){
      offset = data[id].offset;
    }else{
      data[id] = {};
      data[id]["buttons"] = [];
      data[id]["offset"] = 0;
      data[id]["img"] = src;
    }
    pic.src = data[id].img
    drawObjects(data[id].buttons, offset, 0, 0)

};


function addButton(id){
  mode = id;
};


function saveData() {
  $.ajax({
    url : "/builder",
    method : "POST",
    data : {data:JSON.stringify(data)}
  });
};

canvas.onmousemove = function(e) {
  var rect = this.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  spX.html("x: " + x);
  spY.html("y: " + y);
  spO.html("offset: " + offset);
  if (mode == -2) {
    drawObjects(data[id].buttons, offset, x, y);
  }
};

canvas.onmousedown = function (e) {
  var rect = this.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  var ccr = {};
  switch (mode) {
    case -2:
      var draw = drawObjects(data[id].buttons, offset, x, y);
      if (draw[0]){
        id = draw[1].idTo;
        pic.src = data[draw[1].idTo].img;
        offset = data[draw[1].idTo].offset;
      };
      break;
    case -1:
      var draw = drawObjects(data[id].buttons, offset, x, y);
      // console.log(data[id].buttons);
      // console.log(draw[2]);
      data[id].buttons.splice(draw[2], 1);
      // console.log(data[id].buttons);
      ctx.drawImage(pic, offset, 0, width, height, 0, 0, reWidth, canvasHeight);
      drawObjects(data[id].buttons, offset, 0, 0);
      break;
    case 0:
      console.log(i)
      switch (i) {
        case 0:
          cords["tl"] = [x + reOffset, y];
          break;
        case 1:
          cords["bl"] = [x + reOffset, y];
          break;
        case 2:
          cords["br"] = [x + reOffset, y];
          break;
        case 3:
          cords["tr"] = [x + reOffset, y];
          i = -1;
          ccr["type"] = 0;
          ccr["idTo"] = "id"+prompt("idTo");
          ccr["cords"] = Object.assign({},cords);
          data[id]["buttons"].push(ccr);
          console.log(data[id]["buttons"]);
          drawObjects(data[id].buttons, offset, x, y);
          break;
      };
      i = i + 1;
      break;
    case 1:
      ccr["type"] = 1;
      ccr["idTo"] = "id"+prompt("idTo");
      ccr["cords"] = {x:x + reOffset, y:y};
      data[id]["buttons"].push(ccr);
      drawObjects(data[id].buttons, offset, x, y);
      break;
    case 2:
      ccr["type"] = 2;
      ccr["idTo"] = "id"+prompt("idTo");
      ccr["cords"] = {x:x + reOffset, y:y};
      data[id]["buttons"].push(ccr);
      drawObjects(data[id].buttons, offset, x, y);
      break;

  }
};

pic.onload = function () {
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
