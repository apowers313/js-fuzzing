var {
    MandG
} = require("../mandg.js");
var typeUtil = require("../typeUtil.js");

var mandgBool = new MandG("boolean", boolCheck);
mandgBool.addGenerator(dateMin);
mandgBool.addGenerator(dateMax);
var boolFalse = typeUtil.set("boolFalse", boolFalse);

function boolCheck(thing) {
    return typeof thing === "boolean";
}

// TODO: random date

function dateMin() {
    return new Date(0);
}

function dateMax() {
    return new Date(Number.MAX_VALUE);
}

module.exports = mandgBool;