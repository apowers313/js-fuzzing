var _ = require("./lodash-wrapper");

// var MandG = require("./mandg.js").MandG;
// var {
//     debug,
//     Cooker
// } = require("../index.js");
var {
    debug
} = require("./debug.js");
var {
    Cooker
} = require("./cooker.js");

/**
 * The main class for operating the Fuzzer
 * @param {any} thing - the object, string, array, null, or whatever that will be mangled by the fuzzer
 */
class Fuzz {
    constructor(thing, opts) {
        opts = opts || {};
        var defaults = {
            seed: new Date().getTime(),
            cooker: new Cooker(),
        };
        // resolve default values vs. passed in options
        _.defaultsDeep(opts, defaults);

        // reseed the PRNG
        this.seed = opts.seed;
        _.reseed(this.seed);
        debug ("PRNG Seed:", this.seed);

        // save the 'thing' for later
        this.thing = _.cloneDeep(thing);

        // create the cooker
        this.cooker = opts.cooker;
        this.cooker.init(thing);

        // if (opts.debug) {
        debug.on();
        // }
    }

    run() {
        // set timeout
        // call
        // catch error
        //     -- return, cb, promise
        // see if error is okay
        // if no error, validate results
    }

    fuzz() {
        var thing = _.cloneDeep(this.thing);
        var recipe = this.cooker.createRecipe(thing, this.pathList, this.types);
        for (let step of recipe) {
            var path = step.path;
            var op = step.op;
            var victim = path===""?thing:_.get(thing, path);
            console.log ("victim:", victim);
            let res = op(victim);
            // we may have already mangled the path, so setting my result in a dereferencing erro
            try {
                _.set(thing, path, res);
            } catch (err) {
                debug(`ERROR: ${err.name}: ${err.message} ...`);
                debug(`... while running op "${op.name}" on path "${path}"`);
            }
        }
        return thing;
    }
}

module.exports = {
    Fuzz: Fuzz
};