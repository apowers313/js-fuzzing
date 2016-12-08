var _ = require("./lodash-wrapper.js");
var pd = require("probability-distributions");
var {
    MandG
} = require("./mandg.js");

class Cooker {
    constructor(opts) {
        opts = opts || {};
        var defaults = {};
        _.defaultsDeep(opts, defaults);

        this.numPathsDistribution = "low";
        this.weightMap = new Map([
            ["generate", 3],
            ["mutate", 3],
            ["generateAll", 1],
            ["mutateParent", 1]
        ]);

        // calculated in init
        this.weightedOpList = [];
    }

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

    selectPaths(list) {
        if (list.length === 1) return list;
        var count = this.getRandomPathCount(list.length - 1);
        return _.sampleSize(list, count);
    }

    selectOp(mandg) {
        var op;
        var opGenerator;
        do {
            opGenerator = _.sample(this.weightedOpList);
            console.log("op gen:", opGenerator);
            this[opGenerator](mandg);
        } while (!op);

        return op;
    }

    generate(mandg) {
        return _.sample (mandg.generator);
    }

    mutate(mandg) {
        return _.sample (mandg.mutator);
    }

    generateAll() {
        throw new Error ("generateAll not implemented");
        return _.sample (this.generateAllList);
    }

    mutateParent(mandg) {
        throw new Error ("mutateParent not implemented");
        var mutateList = [];
        while (mandg) {
            mutateList.push (...mandg.mutators);
            mandg = mandg.parent;
        }
        return _.sample(mutateList);
    }

    createRecipe(thing, pathList, typeList) {
        if (!Array.isArray(pathList)) {
            throw new TypeError("createRecipe expected first arg to be pathList array, got:", pathList);
        }

        if (!Array.isArray(typeList)) {
            throw new TypeError("createRecipe expected second arg to be typeList array, got:", typeList);
        }

        var selectedPaths = this.selectPaths(pathList);

        var recipe = new Recipe();
        for (let path of selectedPaths) {
            console.log("path");
            // extract the specific item from the path in the thing object
            var item = _.get(thing, path);
            // find the matching mandg for the thing
            var mandg = this.resolveType(item);
            // find the operation we want to perform
            var op = this.selectOp(path, mandg);
            recipe.addStep(path, op);
        }
        return recipe;
    }
}

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