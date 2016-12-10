var {
    MandG
} = require("../mandg.js");

var mandgNumber = new MandG("number", numberCheck);
mandgNumber.addMutator(numFlipSign);
mandgNumber.addMutator(numToFloat);
mandgNumber.addGenerator(numNegInf);
mandgNumber.addGenerator(numPosInf);
mandgNumber.addGenerator(numNan);
mandgNumber.addGenerator(numMax);
mandgNumber.addGenerator(numMin);
mandgNumber.addGenerator(numOne);
mandgNumber.addGenerator(numZero);
mandgNumber.addGenerator(numNegOne);
mandgNumber.addGenerator(numFloat);
mandgNumber.addUtil(numZero);

function numberCheck(thing) {
    return typeof thing === "number";
}

function numFlipSign(thing) {
    return thing * -1;
}

function numToFloat(thing) {
    return thing + 0.1;
}

function numNegInf() {
    return Number.NEGATIVE_INFINITY;
}

function numPosInf() {
    return Number.POSITIVE_INFINITY;
}

function numNan() {
    return NaN;
}

function numMax() {
    return Number.MAX_VALUE;
}

function numMin() {
    return Number.MIN_VALUE;
}

function numOne() {
    return 1;
}

function numZero() {
    return 0;
}

function numNegOne() {
    return -1;
}

function numFloat() {
    return 3.14159;
}

module.exports = mandgNumber;