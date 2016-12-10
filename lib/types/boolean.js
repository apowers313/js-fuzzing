var {
    MandG
} = require("../mandg.js");

var mandgBool = new MandG("boolean", boolCheck);
mandgBool.addGenerator(boolTrue);
mandgBool.addGenerator(boolTrue);
// TODO numZero
// TODO numOne
mandgBool.addUtil(boolFalse);

function boolCheck(thing) {
    return typeof thing === "boolean";
}

function boolTrue() {
    return true;
}

function boolFalse() {
    return false;
}

module.exports = mandgBool;