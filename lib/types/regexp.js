mandg.regexp = {
    mutate: [],
    generate: [
        regexpGobble
    ]
};

var regexpType = {
    check: function(thing) {
        return thing instanceof RegExp; 
    },
    mutate: mandg.regexp.mutate,
    generate: mandg.regexp.generate
};

function regexpGobble() {
    return /.*/;
}
