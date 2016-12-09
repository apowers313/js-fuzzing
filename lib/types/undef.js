var {
    MandG
} = require("../mandg.js");
var typeUtil = require("../typeUtil.js");

var mandgUndef = new MandG("undefined", undefCheck);
mandgUndef.addGenerator(undefUndef);
typeUtil.set("undefUndef", undefUndef);

function undefCheck(thing) {
    // console.log ("checking undefined...");
    return thing === undefined;
}

function undefUndef() {
    return undefined;
}

module.exports = mandgUndef;