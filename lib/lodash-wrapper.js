module.exports = (function() {
    var lodashSingleton; // saved _
    var oldRandom; // saved Math.random

    // if lodash isn't loaded, loadit with our PRNG mixins
    if (lodashSingleton === undefined) {
        var seedrandom = require('seedrandom');
        seedrandom(this.seed, {
            global: true,
            entropy: false
        });

        // save our Math object so we can update it later
        oldRandom = Math.random;
        Math.random = __mathRandomShim;

        // load lodash with our new Math.random method
        lodashSingleton = require("lodash").runInContext(); // ensure we pick up a new context with the new nativeRandom

        // add our mixins
        lodashSingleton.mixin({
            seedrandom: seedrandom
        });
        lodashSingleton.mixin({
            reseed: reseed
        });
    }

    // reinitializes the PRNG
    function reseed(seed) {
        // re-seed PRNG
        lodashSingleton.seedrandom(seed, {
            global: true,
            entropy: false
        });

        // update our shim
        oldRandom = Math.random;
    }

    // wrapper around seedrandom
    function __mathRandomShim() {
        return oldRandom();
    }

    return lodashSingleton;
})();