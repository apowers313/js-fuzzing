var {
    MandG
} = require("../mandg.js");

var mandgBool = new MandG("boolean", boolCheck);
mandgBool.addGenerator(boolTrue);
mandgBool.addGenerator(boolFalse);
// TODO numZero
// TODO numOne

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