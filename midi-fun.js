var firmata = require("firmata");
var FirmataParser = require('firmata-parser');

var parser = new FirmataParser();
// hijack the parser's events
parser.emit = console.log;
var board = new firmata.Board(parser, {});
