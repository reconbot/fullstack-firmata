var five = require("johnny-five");
var FirmataSpy = require("firmata-spy");

var board = new five.Board({
  // lets spy!
  io: new FirmataSpy({debug: true}),
  debug: true,
  repl: false
});

var led = new five.Led(4);
led.blink();

// board.repl.inject({
//   led: led
// });
