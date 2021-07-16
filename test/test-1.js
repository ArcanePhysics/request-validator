// export NODE_PATH="$(npm root -g)"

var data = require("./test-data-1.json");
var mapa = require("./test-mapa-1.json");

var validateRequest = require("../app.js");

var result = validateRequest(data, mapa);

console.log(result);
