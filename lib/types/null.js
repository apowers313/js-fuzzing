var {
    MandG
} = require("../mandg.js");


var mandgNull = new MandG("null", nullCheck, {
    depends: ["number", "boolean", "undefined"]
});
mandgNull.addGenerator(nullGen);
mandgNull.borrowGenerator("number", "numZero");
mandgNull.borrowGenerator("boolean", "boolFalse");
mandgNull.borrowGenerator("undef", "undefUndef");
mandgNull.borrowGenerator("string", "stringEmpty");

function nullCheck(thing) {
    return thing === null;
}

function nullGen() {
    return null;
}

module.exports = mandgNull;