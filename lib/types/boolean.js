mandg.date = {
    mutate: [],
    generate: [
        dateMin,
        dateMax
    ]
};

var boolType = {
    check: function(thing) {
        return typeof thing === "boolean";
    },
    mutate: mandg.boolean.mutate,
    generate: mandg.boolean.generate
};

function dateMin() {
    return new Date(0);
}

function dateMax() {
    return new Date(Number.MAX_VALUE);
}
