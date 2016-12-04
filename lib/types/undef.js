mandg.undef = {
    mutate: [],
    generate: [
        undefUndef
    ]
};

var undefType = {
    check: function(thing) {
        // console.log ("checking undefined...");
        return thing === undefined;
    }
};

function undefUndef() {
    return undefined;
}
