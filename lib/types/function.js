mandg.fn = {
    mutate: [],
    generate: [
        fnReturnJunk,
        fnPromiseUnresolved,
        fnThrow
    ]
};

var functionType = {
    check: function(thing) {
        return typeof thing === "function";
    },
    mutate: mandg.fn.mutate,
    generate: mandg.fn.generate
};

// TODO: fnSmartCallback -- detects arguments of type function and calls them with junk and / or the (err, val) pattern

function fnReturnJunk() {
    var ret = this.generate();
    return function() { return ret; };
}

function fnPromiseUnresolved() {
    return function() { return new Promise(function (f, r) {}); };
}

function fnThrow() {
    return function() { throw new Error ("fnThrow intentionally failed"); };
}