var {
    MandG
} = require("../mandg.js");

var mandgFunction = new MandG("function", functionCheck);
mandgFunction.addGenerator(fnReturnJunk);
mandgFunction.addGenerator(fnPromiseUnresolved);
mandgFunction.addGenerator(fnThrow);

function functionCheck(thing) {
    return typeof thing === "function";
}

// TODO: fnSmartCallback -- detects arguments of type function and calls them with junk and / or the (err, val) pattern

function fnReturnJunk() {
    var ret = this.generate();
    return function() {
        return ret;
    };
}

function fnPromiseUnresolved() {
    return function() {
        return new Promise(function() {});
    };
}

function fnThrow() {
    return function() {
        throw new Error("fnThrow intentionally failed");
    };
}

module.exports = mandgFunction;