var Board = require("firmata").Board;
var FirmataParser = require('firmata-parser');
var SerialSpy = require('serial-spy');

var serialSpy = new SerialSpy({debug:true});
var parser = new FirmataParser({debug:true});

serialSpy.on('write', function(data){
  parser.write(data);
});

var board = new Board(serialSpy, function(){
  console.log("ready to robot!");
});

serialSpy.emit('data', FirmataParser.firmataVersion());
serialSpy.emit('data', FirmataParser.firmwareVersion("spy"));

var pins = [
  {digital: true}, // pin 0
  {digital: true}, // pin 1
  {digital: true}, // pin 2
  {digital: true}, // pin 3
  {digital: true}, // pin 4
  {digital: true}, // pin 5
  {digital: true}, // pin 6
  {digital: true}  // pin 7
];
serialSpy.emit('data', FirmataParser.capabilityResponse(pins));
serialSpy.emit('data', FirmataParser.analogMappingResponse(pins));

board.pinMode(4,1);
board.digitalWrite(4, 1);
board.digitalWrite(4, 0);
board.digitalWrite(4, 1);
board.digitalWrite(4, 0);
