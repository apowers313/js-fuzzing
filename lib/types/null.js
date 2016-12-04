mandg.null = {
    mutate: [],
    generate: [
        numZero,
        boolFalse,
        undefUndef
    ]
};

var nullType = {
    check: function(thing) {
        return thing === null;
    },
    mutate: mandg.null.mutate,
    generate: mandg.null.generate
};