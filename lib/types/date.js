var {
    MandG
} = require("../mandg.js");

console.log ("Loading DATE!!!");

var mandgDate = new MandG("date", dateCheck, {
    parent: "object"
});
console.log ("instance test:", mandgDate instanceof MandG);
mandgDate.addGenerator(dateMin);
mandgDate.addGenerator(dateMax);
console.log ("instance test:", mandgDate instanceof MandG);

function dateCheck(thing) {
    return thing instanceof Date;
}

function dateMin() {
    return new Date(0);
}

function dateMax() {
    return new Date(Number.MAX_VALUE);
}

// console.log ("DATE returning:", mandgDate);
console.log ("instance test:", mandgDate instanceof MandG);
module.exports = mandgDate;