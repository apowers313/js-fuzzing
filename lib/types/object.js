var _ = require("../lodash-wrapper.js");
var MandG = require("../mandg.js").MandG;
var typeUtil = require ("../typeUtil.js");

var mandgObj = new MandG("object", objCheck);
mandgObj.addMutator(objAddKeys);
mandgObj.addGenerator(objEmpty);
var stringJunk = typeUtil.get("stringJunk");

// TODO: objDelKeys -- delete random object keys

function objCheck(thing) {
    // console.log ("checking object...");
    // console.log (this.name);
    return typeof thing === "object";
}

function objAddKeys(thing) {
    var i, num = _.random(100),
        key;

    for (i = 0; i < num; i++) {
        key = stringJunk();
        thing[key] = this.generate();
    }
}

function objEmpty() {
    return Object.create(null);
}

module.exports = mandgObj;