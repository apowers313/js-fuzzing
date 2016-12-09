var _ = require("./lodash-wrapper");

// var MandG = require("./mandg.js").MandG;
var Cooker = require("./cooker.js");

module.exports = Fuzz;

/**
 * The main class for operating the Fuzzer
 * @param {any} thing - the object, string, array, null, or whatever that will be mangled by the fuzzer
 */
function Fuzz(thing, opts) {
    opts = opts || {};
    var defaults = {
        seed: new Date().getTime(),
        cooker: new Cooker(),
    };
    // resolve default values vs. passed in options
    _.defaultsDeep(opts, defaults);

    // reseed the PRNG
    _.reseed(this.seed);

    // save the 'thing' for later
    this.thing = _.cloneDeep(thing);

    // create the cooker
    this.cooker = opts.cooker;
    this.cooker.init(thing);
}

Fuzz.prototype.fn = function(fn, argArr, cnt) {

};

Fuzz.prototype.fuzz = function() {
    var thing = _.cloneDeep(this.baseThing);
    var recipe = this.cooker.createRecipe(thing, this.pathList, this.types);
    for (let step of recipe) {
        console.log (step);
    }

    // if (this.singleBaseThing) return this.fuzzSingle();

    // var thing = _.cloneDeep(this.baseThing);
    // console.log(thing);
    // var itemList = this.selectItems(this.pathList);
    // console.log("full path list:", this.pathList);
    // console.log("item list:", itemList);
    // var itemPath, itemType, item;

    // while (itemList.length) {
    //     itemPath = itemList.pop();
    //     if (itemPath === "") return this.fuzzSingle();
    //     // TODO: itemPath.split(".")
    //     console.log("path:", itemPath);
    //     item = _.get(thing, itemPath);
    //     console.log("item:", item);
    //     itemType = this.resolveType(item);
    //     item = this.mutateOrGenerate(item, itemType);
    //     console.log(item);
    //     console.log("setting:", itemPath);
    //     _.set(thing, itemPath, item);
    //     console.log("new thang:", thing);
    //     console.log(itemList.length);
    // }
};

// Fuzz.prototype.fuzzSingle = function() {
//     console.log("fuzzSingle");
//     var thing = _.cloneDeep(this.baseThing);
//     var type = this.resolveType(thing);
//     console.log("Thing:", thing);
//     console.log("Type:", type);

//     return this.mutateOrGenerate(thing, type);
// };

