var canvas = document.querySelector("canvas");
var canvasWidth = Number($("canvas").data("cwidth"));
var canvasHeight = Number($("canvas").data("cheight"));
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
var scale = canvasHeight/600;

var height;
var width;
var reWidth;
var reCWidth;
var reOffset;
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
  switch (r.type) {
    case 1:
      pic.src = up;
      break;
    case 2:
      pic.src = down;
      break;
    case 3:
      pic.src = enterB;
      break;
    case 4:
      pic.src = loopB;
      break;
  }
  pic.onload = function() {
    ctx.drawImage(pic, r.cords.x * scale - reOffset + 2, r.cords.y * scale, 46, 50);
  };
};


function drawObjects(objects, offset, x, y, rtn) {
  function ctxDraw(r) {
    ctx.beginPath();
    ctx.moveTo(r.cords.x * scale - reOffset, r.cords.y * scale);
    ctx.lineTo(r.cords.x * scale - reOffset, r.cords.y * scale + 50);
    ctx.lineTo(r.cords.x * scale + 50 - reOffset, r.cords.y * scale + 50);
    ctx.lineTo(r.cords.x * scale + 50 - reOffset, r.cords.y * scale);
    ctx.closePath();
  }
  var index = 0;
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
          ctxDraw(r);
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
          // if (x == 0) {
            paintImage(r);
          // }
          ctxDraw(r)
          if (ctx.isPointInPath(x, y)) {
            ctx.strokeStyle = "yellow";
            ctx.stroke();
            return [true, r, index];
          } else {
            ctx.strokeStyle = "white";
          }
          ctx.stroke();
          break;
        case 3:
          // if (x == 0) {
            paintImage(r);
          // }
          ctxDraw(r)
          if (ctx.isPointInPath(x, y)) {
            ctx.strokeStyle = "yellow";
            ctx.stroke();
            return [true, r];
          } else {ctx.strokeStyle = "white"}
          ctx.stroke();
          break;
        case 4:
          // if (x == 0) {
            paintImage(r);
          // }
          ctxDraw(r)
          if (ctx.isPointInPath(x, y)) {
            ctx.strokeStyle = "yellow";
            ctx.stroke();
            return [true, r];
          } else {ctx.strokeStyle = "white"}
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
  spO.html("offset: " + offset + ";" + reOffset);
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
  spO.html("offset: " + offset + ";" + reOffset);
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
          cords["tl"] = [(x + reOffset) / scale, y / scale];
          break;
        case 1:
          cords["bl"] = [(x + reOffset) / scale, y / scale];
          break;
        case 2:
          cords["br"] = [(x + reOffset) / scale, y / scale];
          break;
        case 3:
          cords["tr"] = [(x + reOffset) / scale, y / scale];
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
      ccr["cords"] = {x:x * scale + reOffset, y:y * scale};
      data[id]["buttons"].push(ccr);
      drawObjects(data[id].buttons, offset, x, y);
      break;
    case 2:
      ccr["type"] = 2;
      ccr["idTo"] = "id"+prompt("idTo");
      ccr["cords"] = {x:x * scale + reOffset, y:y * scale};
      data[id]["buttons"].push(ccr);
      drawObjects(data[id].buttons, offset, x, y);
      break;
    case 3:
      ccr["type"] = 3;
      ccr["idTo"] = "id"+prompt("idTo");
      ccr["cords"] = {x:x * scale + reOffset, y:y * scale};
      data[id]["buttons"].push(ccr);
      drawObjects(data[id].buttons, offset, x, y);
      break;
    case 4:
      ccr["type"] = 4;
      ccr["idTo"] = "id"+prompt("idTo");
      ccr["cords"] = {x:x * scale + reOffset, y:y * scale};
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
