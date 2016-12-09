var {
    MandG
} = require("../mandg.js");

var mandgRegexp = new MandG("regexp", regexpCheck, {
    parent: "object"
});
mandgRegexp.addGenerator(regexpGobble);

function regexpCheck(thing) {
    return thing instanceof RegExp;
}

function regexpGobble() {
    return /.*/;
}

module
.exports = mandgRegexp;