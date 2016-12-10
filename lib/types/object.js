var _ = require("../lodash-wrapper.js");
var MandG = require("../mandg.js").MandG;

var mandgObj = new MandG("object", objCheck, {
    depends: ["string"]
});
mandgObj.addMutator(objAddKeys);
mandgObj.addGenerator(objEmpty);

// TODO: objDelKeys -- delete random object keys

function objCheck(thing) {
    // console.log ("checking object...");
    // console.log (this.name);
    return ((typeof thing === "object") && (thing !== null));
}

function objAddKeys(thing) {
    var i, num = _.random(100),
        key;

    for (i = 0; i < num; i++) {
        key = this.utils.string.stringJunk();
        thing[key] = this.generateAll();
    }
}

function objEmpty() {
    return Object.create(null);
}

module.exports = mandgObj;