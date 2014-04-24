# [fit]Full Stack Firmata

### JSConf BR 2014

---

# [fit] Francis Gulotta
# @reconbot
# wizarddevelopment.com

---

# [fit] ❤ NodeBots

![right original](media/nodebot.png)


^ I ❤ nodebots

---

# What are NodeBots?

## NodeBots are robots that are controlled by node.js.


---

# What are NodeBots?

## Robots are inherently asynchronous. NodeJS & JavaScript makes async easy.
## Single threaded, turn based, non-blocking execution.

---

![fit](media/chris.png)

---

![fit](media/nodebot-team.png)

---

# What's firmata anyway?

---

> Firmata is a generic protocol for communicating with microcontrollers from software on a host computer.
-- firmata.org (probably Jeff)

---

![fit](media/jeff-hoefs.png)

---
# Works in a lot of cool places
- Arduino
- Beagal Bone
- Raspberry Pi
- JS
- Ruby
- Python
- Go

---

# [fit] ❤ Johnny-Five

![right original](media/johny-five.png)

---

> Johnny-Five is a library of device drivers for the physical world. It's also jQuery for robots.
-- Francis

---

#Johnny-Five is...

- Johnny-Five is an Open Source, JavaScript Arduino programming framework, developed at Bocoup
- A library of modules for devices as small as buttons to as large as walking robots.
- Lots and lots of modules

![right fit](media/j5-sensors.gif)

---

![fit](media/rick.png)

---

> A blinking light is the hello world of robotics
-- Sara Chipps

---


```js







var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

  var led = new five.Led(4);
  led.strobe();

});




//Video Stolen from Rick Waldren
//github.com/rwaldron/johnny-five

```

![right](media/led-strobe.gif)


---

> Isso é Foda
-- Francis

---

# What's happening here?

---

![original](media/j5-stack.png)

---

# Johnny-Five's Default Stack

```js
var five = require("johnny-five");
var Firmata = require("firmata");

var board = new five.Board({
  // default and auto
  io: new Firmata.Board()
});

```

---

![original](media/j5-stack-spy.png)

---

# Johnny-Five's Spying Stack

```js
var five = require("johnny-five");
var FirmataSpy = require("firmata-spy");

var board = new five.Board({
  // lets spy!
  io: new FirmataSpy({debug: true})
});

board.on("ready", function() {
  var led = new five.Led(4);
  led.strobe();
});

```

---

1. Johnny-Five looks for USB serial ports
1. Opens the first obvious one & listen for Arduino
1. Arduino starts up and says "Hello"
1. J5 sets pin 4 to output
1. J5 sets pin 4 to high
1. J5 sets pin 4 to low
1. J5 sets pin 4 to high
1. J5 sets pin 4 to low
... forever

![right](media/firmata-spy-strobe.gif)

---

# Lets go deeper

---

![original](media/j5-stack-serial.png)

---

# Firmata

### Composed of MIDI Messages

---
^ yes that midi

![](media/midi.jpg)

---

# Firmata

### Composed of MIDI Messages
### Passes data in 7bit encoding

---

# Firmata

### Composed of MIDI Messages
### Not very complex
### Passes data in 7bit encoding
### Mostly MIDI complient

---
![fit](media/midi-flowchart.png)

---

![150%](media/midi-flowchart.png)

---

# Spying Tools

```js
// Knows how to parse and generate midi messages
var MidiParser = require('midi-parser');

// Knows how to use midi-parser to parse and
// generate firmata messages
var FirmataParser = require('firmata-parser');

// Pretends to be a serial port
var SerialSpy = require('serial-spy');


```

---

# First Step: The Startup
# Second Step: Call the functions and see what happen.

---

# The Startup


---

# Startup

```js

var Board = require("firmata").Board;
var SerialSpy = require('serial-spy');

var serialSpy = new SerialSpy({debug:true});
var parser = new FirmataParser();
var board = new Board(serialSpy, function(){
  console.log("ready to robot!");
});

```

---

# Startup

```js

var Board = require("firmata").Board;
var SerialSpy = require('serial-spy');

var serialSpy = new SerialSpy({debug:true});
var parser = new FirmataParser();
var board = new Board(serialSpy, function(){
  console.log("ready to robot!");
});

```
![right](media/startup.png)

---

# That didn't work
# Raw midi data isn't that useful

---

# Startup take 2

```js
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

```

---
# Startup take 2

```js
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

```

![fit right](media/serial-spy-parsed.png)

---

# Node Firmata is asking for:

## Protocol Version

## Firmware Information

---

# Startup Take 3

```js

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

```

---

# Startup Take 3

```js

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

```

![right](media/capability-query.png)

---

# Digital Reporting
When enabled on a pin firmata will report the digital value (0,1) of this pin when it changes.

# Analog Reporting
When enabled on a pin firmata will report the analog value (0-65535) every 200ms (configurable).

---

# Capability Query

These queries are intended to allow GUI-based programs to discover the capabilities and current state of any board running Firmata. The idea is to facilitate displaying highly accurate on-screen representation of the board

The capabilities response provides a list of all modes supported by all pins, and the resolution used by each mode.

---

# Startup Take 4

```js
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

var pins = [{digital: true}];
serialSpy.emit('data', FirmataParser.capabilityResponse(pins));
```

---

# Startup Take 4

```js
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

var pins = [{digital: true}];
serialSpy.emit('data', FirmataParser.capabilityResponse(pins));
```

![right](media/analog-mapping.png)

---

#Analog Mapping Query

The analog mapping query provides the information about which pins (as used with Firmata's pin mode message) correspond to the analog channels

---

# Startup take 5

```js
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

var pins = [{digital: true, analog: true}];
serialSpy.emit('data', FirmataParser.capabilityResponse(pins));
serialSpy.emit('data', FirmataParser.analogMappingResponse(pins));

```


---

# Startup take 5

```js
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

var pins = [{digital: true, analog: true}];
serialSpy.emit('data', FirmataParser.capabilityResponse(pins));
serialSpy.emit('data', FirmataParser.analogMappingResponse(pins));

```

![right](media/ready-to-robot.png)

---

# Want to learn more?

---

# nodebots.io
#[fit] github.com/rwaldron/johnny-five
#[fit] github.com/firmata/arduino
---

# Find a meetup or start your own!

- NodeBots Guatemala - Guatemala
- NodeBots Medellín - Colombia
- NodeBots Villavicencio - Colombia
- NodeBots of London - UK
- NodeBots NYC - USA
- NodeBots SF - USA

---

# NodeBots Fortaleza?
# NodeBots Rio de Janeiro?
# NodeBots São Paulo?

---

# NodeBots Fortaleza?
# NodeBots Rio de Janeiro?
# NodeBots São Paulo?

#[fit] github.com/nodebots/www/pulls

---

#[fit] THANK YOU

