var canvas = document.querySelector("canvas");
canvas.width  = 800;
canvas.height = 600;
var spX = $('#spX');
var spY = $('#spY');
var spO = $('#spO');
var ctx = canvas.getContext("2d");
var pic = new Image();
var offset = 0;
var i = 0;
let data;
var cords = {};
var width;
var height;
var id;
var mode = 0;

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
      move(1);
    }
  });
  $('#butL').clickAndHold({
    timeout: 5,
    onHold: function (e, n) {
      move(-1);
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
    ctx.drawImage(pic, r.cords.x - offset + 2, r.cords.y, 46, 50);  // Рисуем изображение от точки с координатами 0, 0
  };
};


function drawObjects(objects, offset, x, y, rtn) {
  var r, i = 0;
  for(r of objects) {
    switch (r.type) {
      case 0:
        ctx.beginPath();
        ctx.moveTo(r.cords.tr[0] - offset, r.cords.tr[1]);
        ctx.lineTo(r.cords.br[0] - offset, r.cords.br[1]);
        ctx.lineTo(r.cords.bl[0] - offset, r.cords.bl[1]);
        ctx.lineTo(r.cords.tl[0] - offset, r.cords.tl[1]);
        ctx.closePath();
        if (ctx.isPointInPath(x, y)) {
          ctx.strokeStyle = "yellow";
          ctx.stroke();
          return [true, r, i];
        } else {
          ctx.strokeStyle = "white";
        }
        ctx.stroke();
        break;
        case 1:
          paintImage(r);
          ctx.beginPath();
          ctx.moveTo(r.cords.x - offset, r.cords.y);
          ctx.lineTo(r.cords.x - offset, r.cords.y + 50);
          ctx.lineTo(r.cords.x + 50 - offset, r.cords.y + 50);
          ctx.lineTo(r.cords.x + 50 - offset, r.cords.y);
          ctx.closePath();
          if (ctx.isPointInPath(x, y)) {
            ctx.strokeStyle = "yellow";
            ctx.stroke();
            return [true, r, i];
          } else {
            ctx.strokeStyle = "white";
          }
          ctx.stroke();
          break;
        case 2:
          paintImage(r);
          ctx.beginPath();
          ctx.moveTo(r.cords.x - offset, r.cords.y);
          ctx.lineTo(r.cords.x - offset, r.cords.y + 50);
          ctx.lineTo(r.cords.x + 50 - offset, r.cords.y + 50);
          ctx.lineTo(r.cords.x + 50 - offset, r.cords.y);
          ctx.closePath();
          if (ctx.isPointInPath(x, y)) {
            ctx.strokeStyle = "yellow";
            ctx.stroke();
            return [true, r, i];
          } else {
            ctx.strokeStyle = "white";
          }
          ctx.stroke();
          break;
    }
    i = i + 1;

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
  if (offset > width - 800){
    offset = width - 800;
  }
  if (offset < 0){
    offset = 0;
  }
  ctx.drawImage(pic, offset, 0, 800, height, 0, 0, 800, 600);
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
      console.log(data[id].buttons);
      data[id].buttons.splice([draw[2]], 1);
      console.log(data[id].buttons);
      drawObjects(data[id].buttons, offset, 0, 0);
      drawObjects(data[id].buttons, offset, 0, 0);
      drawObjects(data[id].buttons, offset, 0, 0);
      drawObjects(data[id].buttons, offset, 0, 0);
      drawObjects(data[id].buttons, offset, 0, 0);
      drawObjects(data[id].buttons, offset, 0, 0);
      break;
    case 0:
      switch (i) {
        case 0:
          cords["tl"] = [x + offset, y];
          break;
        case 1:
          cords["bl"] = [x + offset, y];
          break;
        case 2:
          cords["br"] = [x + offset, y];
          break;
        case 3:
          cords["tr"] = [x + offset, y];
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
      ccr["cords"] = {x:x + offset, y:y};
      data[id]["buttons"].push(ccr);
      drawObjects(data[id].buttons, offset, x, y);
      break;
    case 2:
      ccr["type"] = 2;
      ccr["idTo"] = "id"+prompt("idTo");
      ccr["cords"] = {x:x + offset, y:y};
      data[id]["buttons"].push(ccr);
      drawObjects(data[id].buttons, offset, x, y);
      break;

  }
};

pic.onload = function () {
  width = pic.width;
  height = pic.height;
  offset = (width - 800)/2;
  ctx.drawImage(pic, offset, 0, 800, height, 0, 0, 800, 600);
  drawObjects(data[id].buttons, offset, 0, 0);
};


$.getJSON('/static/json/data.json', init);
// document.addEventListener("DOMContentLoaded", init, false);
