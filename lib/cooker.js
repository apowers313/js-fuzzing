var _ = require("./lodash-wrapper.js");
var traverse = require("traverse");
var pd = require("probability-distributions");
var {
    MandGTypeManager
} = require("./mandg.js");

/**
 * takes a `thing` object and a bunch of random numbers and
 * spits out a Recipe
 */
class Cooker {
    /**
     * Cooker constructor
     * @param {object} opts - options for the new cooker
     * @param {string} opts.numPathsDistribution - when selecting the number of paths from `thing` to mangle, this is the distribution. Options are "low", "uniform" or "split". Low is more likely to pick a low number of paths (e.g. - 1 or 2), uniform is likely to pick any number of paths, and split is likely to pick a low number or the max number.
     */
    constructor(opts) {
        opts = opts || {};
        var defaults = {
            numPathsDistribution: "low",
            weightMap: new Map([
                ["generate", 3],
                ["mutate", 3],
                ["generateAll", 0], /** XXX TODO @todo */
                ["mutateParent", 0] /** XXX TODO @todo */
            ])
        };
        _.defaultsDeep(opts, defaults);

        this.numPathsDistribution = opts.numPathsDistribution;
        this.weightMap = opts.weightMap;

        // calculated in init
        this.weightedOpList = [];
    }

    /**
     * initializes the Cooker with a `thing` object and does any configuration necessary
     * @param {any} thing - the object, string, array, null, or whatever that will be mangled by the fuzzer
     */
    init(thing) {
        // save thing for later
        this.thing = _.cloneDeep(thing);

        // adds one entry of a function for every weight count
        for (let weightType of this.weightMap) {
            var weight = weightType[1];
            var functionName = weightType[0];
            for (let i = 0; i < weight; i++) {
                this.weightedOpList.push(functionName);
            }
        }

        // create the path list
        this.pathList = _.invokeMap(traverse(thing).paths(), Array.prototype.join, ".");

        // mark initialization as complete
        this.initialized = true;

        return this;
    }

    getRandomPathCount(max) {
        pd.prng = Math.random;

        // three options:
        switch (this.numPathsDistribution) {
            case "uniform": // 1. uniform distribution
                return _.random(1, max);
            case "low": // 2. low-number heavy distribution
                return pd.rbinom(1, max - 1, 0.1)[0] + 1;
            case "split": // 3. split between min and max, with an even sprinkling inbetween
                return (Math.ceil(pd.rbeta(1, 0.5, 0.6)[0] * max - 1)) + 1;
        }
    }

    selectPaths() {
        var list = this.pathList;

        if (list.length === 1) return list;
        var count = this.getRandomPathCount(list.length);
        console.log ("PATH COUNT:", count);
        return _.sampleSize(list, count);
    }

    selectOp(mandg) {
        var op;
        var opGenerator;
        do {
            opGenerator = _.sample(this.weightedOpList);
            console.log("op gen:", opGenerator);
            op = this[opGenerator](mandg);
        } while (!op);

        return op.fn;
    }

    generate(mandg) {
        return _.sample(mandg.generator);
    }

    mutate(mandg) {
        return _.sample(mandg.mutator);
    }

    generateAll() {
        throw new Error("generateAll not implemented");
        return _.sample(this.generateAllList);
    }

    mutateParent(mandg) {
        throw new Error("mutateParent not implemented");
        var mutateList = [];
        while (mandg) {
            mutateList.push(...mandg.mutators);
            mandg = mandg.parent;
        }
        return _.sample(mutateList);
    }

    createRecipe() {
        var mgr = new MandGTypeManager();
        if (!this.initialized) {
            throw new Error ("Initialize cooker before calling createRecipe");
        }

        // console.log ("path list:", this.pathList);
        var selectedPaths = this.selectPaths();
        // console.log ("selected paths:", selectedPaths);

        var recipe = new Recipe();
        for (let path of selectedPaths) {
            // extract the specific item from the path in the thing object
            var item = (path === "")?this.thing:_.get(this.thing, path);
            // find the matching mandg for the thing
            var mandg = mgr.resolveType(item);
            // find the operation we want to perform
            var op = this.selectOp(mandg);
            recipe.addStep(path, op);
        }
        return recipe;
    }
}

/**
 * The recipe instructs the Fuzzer what steps to take to mutate a `thing`
 */
class Recipe {
    constructor() {
        // this.length
        this.steps = new Set();
        // this.steps = [{path: "", operation: ""}]
    }

    get length() {
        return this.steps.size;
    }

    addStep(path, op) {
        console.log (`adding step :: path: "${path}" ; op: ${op.name}`);
        var step = {
            path: path,
            operation: op
        };
        this.steps.add(step);
    }

    // toString
}

module.exports = {
    Cooker: Cooker,
    Recipe: Recipe
};