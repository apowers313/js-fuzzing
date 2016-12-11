var _ = require("../lodash-wrapper.js");
var {
    MandG
} = require("../mandg.js");

var mandgArray = new MandG("array", arrayCheck, {
    parent: "object"
});
mandgArray.addMutator(arrJunk);
mandgArray.addGenerator(arrGenJunk);
mandgArray.addGenerator(arrEmpty);

function arrayCheck(thing) {
    // console.log ("checking array...");
    return Array.isArray(thing);
}

// TODO: arrayClone -- duplicate and append existing array members
// TODO: arrayCloneMutant -- duplicate and append mutations of existing array members

function arrJunk(thing) {
    var i, num = _.random(1, 100);

    for (i = 0; i < num; i++) {
        thing.unshift(this.generate());
    }
}

function arrGenJunk() {
    var i, num = _.random(1, 100);
    var thing = [];

    for (i = 0; i < num; i++) {
        thing.unshift(this.generate());
    }
}

function arrEmpty() {
    return [];
}

module.exports = mandgArray;