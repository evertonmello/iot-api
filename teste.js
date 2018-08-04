var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var proximity = new five.Proximity({
    controller: "HCSR04",
    pin: 7
  });

  var a = 0
  proximity.on("data", function() {
    console.log("Proximity: ");
    if(this.cm != 0){
        a = this.cm;
    }
    console.log("  cm  : ", a);
    console.log("-----------------");
  });

  proximity.on("change", function() {
    console.log("The obstruction has moved.");
  });
});