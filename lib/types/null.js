var {
    MandG
} = require("../mandg.js");
var typeUtil = require("../typeUtil.js");

var numZero = typeUtil.get("numZero");
var boolFalse = typeUtil.get("boolFalse");
var undefUndef = typeUtil.get("undefUndef");
var mandgNull = new MandG("null", nullCheck, {
    depends: ["number", "boolean", "undefined"]
});
mandgNull.addGenerator(numZero);
mandgNull.addGenerator(boolFalse);
mandgNull.addGenerator(undefUndef);


function nullCheck(thing) {
    return thing === null;
}

module.exports = mandgNull;