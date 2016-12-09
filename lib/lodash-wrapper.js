/**
 * @module lodash-wrapper
 * @description This is a simple wrapper for lodash that turns it into a singleton and extends
 * it with a Pseudo Random Number Generator (PRNG). The idea is that for any given seed,
 * the same random numbers will be used every time, enabling deterministic debugging for 
 * any given seed.
 */

module.exports = (function() {
    var lodashSingleton; // saved _
    var oldRandom; // saved Math.random

    // if lodash isn't loaded, loadit with our PRNG mixins
    if (lodashSingleton === undefined) {
        var seedrandom = require('seedrandom');
        seedrandom(this.seed, { // XXX: replaces Math.random() with new PRNG, impacts lodash
            global: true,
            entropy: false
        });

        // shim the Math.random object (mostly for debugging)
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
        Math.random = __mathRandomShim;
    }

    // wrapper around seedrandom
    function __mathRandomShim() {
        // console.log ("@#)($& --- RANDOM --- @#(&$@");
        return oldRandom();
    }

    return lodashSingleton;
})();