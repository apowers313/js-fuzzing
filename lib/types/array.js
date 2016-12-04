var _ = require("lodash");

mandg.array = {
    mutate: [
        arrJunk
    ],
    generate: [
        arrGenJunk,
        arrEmpty
    ]
};

var arrType = {
    check: function(thing) {
        // console.log ("checking array...");
        return Array.isArray (thing);
    },
    mutate: mandg.array.mutate,
    generate: mandg.array.generate
};

// TODO: arrayClone -- duplicate and append existing array members
// TODO: arrayCloneMutant -- duplicate and append mutations of existing array members

function arrJunk(thing) {
    var i, num = _.random(100);

    for (i = 0; i < num; i++) {
        thing.unshift (this.generate());
    }
}

function arrGenJunk() {
    var i, num = _.random(100);
    var thing = [];

    for (i = 0; i < num; i++) {
        thing.unshift (this.generate());
    }
}

function arrEmpty() {
    return [];
}
