mandg.date = {
    mutate: [],
    generate: [
        dateMin,
        dateMax
    ]
};

var dateType = {
    check: function(thing) {
        return thing instanceof Date;
    },
    mutate: mandg.date.mutate,
    generate: mandg.date.generate
};

function dateMin() {
    return new Date(0);
}

function dateMax() {
    return new Date(Number.MAX_VALUE);
}