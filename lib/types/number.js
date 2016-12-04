mandg.number = {
    mutate: [
        numFlipSign,
        numToFloat
    ],
    generate: [
        numNegInf,
        numPosInf,
        numNan,
        numMax,
        numMin,
        numOne,
        numZero,
        numNegOne,
        numFloat
    ]
};

var numberType = {
    check: function(thing) {
        return typeof thing === "number";
    },
    mutate: mandg.number.mutate,
    generate: mandg.number.generate
};

function numFlipSign(thing) {
    return thing * -1;
}

function numToFloat() {
    return thing + 0.1;
}

function numNegInf() {
    return Number.NEGATIVE_INFINITY;
}

function numPosInf() {
    return Number.POSITIVE_INFINITY;
}

function numNan() {
    return NaN;
}

function numMax() {
    return Number.MAX_VALUE;
}

function numMin() {
    return Number.MIN_VALUE;
}

function numOne() {
    return 1;
}

function numZero() {
    return 0;
}

function numNegOne() {
    return -1;
}

function numFloat() {
    return 3.14159;
}
