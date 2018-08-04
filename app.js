var createError = require('http-errors');
var express = require('express');
var app = express();
var five = require("johnny-five");
var board = new five.Board();
var distanciaAtual= null;
board.on("ready", function() {
  var proximity = new five.Proximity({
    controller: "HCSR04",
    pin: 7
  });

  proximity.on("data", function() {
    if(this.cm != 0){
      distanciaAtual = this.cm;
    }
  });

  proximity.on("change", function() {
  });
});
app.get('/', function (req, res) {
  res.send(distanciaAtual.toString());
});

module.exports = app;
