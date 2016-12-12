var {
    MandG
} = require("../mandg.js");

var mandgUndef = new MandG("undefined", undefCheck);
mandgUndef.addGenerator(undefUndef);

function undefCheck(thing) {
    // console.log ("checking undefined...");
    return thing === undefined;
}

function undefUndef() {
    return undefined;
}

module.exports = mandgUndef;