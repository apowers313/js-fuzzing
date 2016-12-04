var _ = require("./lodash-wrapper");

var traverse = require("traverse");
var dep = require("dependency-graph");

var MandG = require ("./mandg.js").MandG;

module.exports = Fuzz;

function mutateOrGenerate(thing, type) {
    console.log("mutateOrGenerate");
    console.log("thing:", thing);
    console.log("type:", type);

    var typeObj = this.typeIndex[type];
    if (_.random(100) < 50) {
        return this.generate();
    } else {
        if (typeObj.mutate === undefined) {
            console.log("!!! MUTATE UNDEFINED:", typeObj.name);
            console.log(typeObj);
        }
        var fnList = typeObj.mutate.concat(typeObj.generate);
        var fn = _.sample(fnList);
        if (typeObj.mutate.indexOf(fn) !== -1) {
            this.mutate(thing, type);
        } else {
            this.generate(type);
        }
    }
}

function selectItems(list) {
    if (list.length === 1) return list;
    return _.sampleSize(list, _.random(1, list.length - 1));
}

function Fuzz(thing, opts) {
    opts = opts || {};
    var defaults = {
        mutateChance: 80,
        generateSameTypeChance: 50,
        mutateOrGenerate: mutateOrGenerate,
        selectItems: selectItems
    };
    _.defaultsDeep(opts, defaults);
    this.seed = opts.seed || 0;
    _.seedrandom (this.seed, { global: true }); // XXX: replaces Math.random() with new PRNG, impacts lodash
    this.baseThing = thing;
    this.pathList = _.invokeMap(traverse(thing).paths(), Array.prototype.join, ".");
    console.log("path list:", this.pathList);
    if (this.pathList.length === 1) {
        this.singleBaseThing = true;
    } else {
        this.singleBaseThing = false;
    }
    // console.log ("Thing:", thing);
    // console.log ("Paths:", this.pathList);
    this.selectItems = opts.selectItems;
    this.mutateOrGenerate = opts.mutateOrGenerate;
    this.mutateOrGenerate.bind(this);
    this.selectItems.bind(this);

    // this.name = "foo";
    this.types = {};
    this.typeIndex = {};

    // load all the built-in types
    this.mandgList = opts.mandgList ||
        [
            "./types/string.js",
            "./types/object.js"
        ];
    for (let idx in this.mandgList) {
        console.log (`Loading ${this.mandgList[idx]} ...`);
        // TODO: figure out dependencies
        this.registerType (require (this.mandgList[idx]));
    }
}

Fuzz.prototype.fn = function(fn, argArr, cnt) {

};

Fuzz.prototype.fuzz = function() {
    if (this.singleBaseThing) return this.fuzzSingle();

    var thing = _.cloneDeep(this.baseThing);
    console.log(thing);
    var itemList = this.selectItems(this.pathList);
    console.log("full path list:", this.pathList);
    console.log("item list:", itemList);
    var itemPath, itemType, item;

    while (itemList.length) {
        itemPath = itemList.pop();
        if (itemPath === "") return this.fuzzSingle();
        // TODO: itemPath.split(".")
        console.log("path:", itemPath);
        item = _.get(thing, itemPath);
        console.log("item:", item);
        itemType = this.resolveType(item);
        item = this.mutateOrGenerate(item, itemType);
        console.log(item);
        console.log("setting:", itemPath);
        _.set(thing, itemPath, item);
        console.log("new thang:", thing);
        console.log(itemList.length);
    }
};

Fuzz.prototype.fuzzSingle = function() {
    console.log("fuzzSingle");
    var thing = _.cloneDeep(this.baseThing);
    var type = this.resolveType(thing);
    console.log("Thing:", thing);
    console.log("Type:", type);

    return this.mutateOrGenerate(thing, type);
};


// returns a string that is the most specific "type" of "thing" that can be determined
Fuzz.prototype.resolveType = function(thing) {
    var self = this;

    // recursively see if some 'type' in 'typeList' returns true when checking 'obj'
    // if it does, that's our type... check the subtypes to make sure there's not something
    // more specific
    function findType(typeList, obj) {
        var type = _.map(typeList, function(mandg, type) {
            if (mandg === undefined || type === undefined) return;
            console.log ("!! CHECKING TYPE:", type);
            console.log (mandg);
            if (mandg.check(obj)) {
                console.log("found type: " + type + ". checking subtypes")
                return findType(mandg.subtype, obj) || type;
            }
        });

        // type = _.flattenDeep (_.remove(type, _.isUndefined));
        _.remove(type, _.isUndefined);
        if (type.length > 1) {
            throw new Error("found too many matching types types");
        }
        if (type.length === 0) type = undefined;
        if (Array.isArray(type)) {
            type = _.flattenDeep(type)[0];
        }
        // console.log ("returning", type);

        return type;
    }

    return findType(this.types, thing);
};

Fuzz.prototype.mutate = function(thing, type) {
    // resolve type to object
    if (type === undefined) {
        type = this.typeIndex[this.getType(thing)];
    } else if (typeof type === "string") {
        type = this.typeIndex[type];
    } else {
        throw new TypeError("expected 'type' to be string");
    }
    if (type === undefined) {
        throw new TypeError("couldn't find 'type' for mutate: " + type);
    }

    console.log(type.mutate);
    var fn = _.sample(type.mutate);
    if (typeof fn === "function") {
        return fn(thing);
    }
};

Fuzz.prototype.generate = function(type) {
    console.log("generate");
    // resolve type to object
    if (type === undefined) {
        console.log("generate: no type defined, picking a random type");
        type = _.sample(this.typeIndex);
    } else if (typeof type === "string") {
        type = this.typeIndex[type];
        if (type === undefined) {
            throw new TypeError("couldn't find 'type' for generate: " + type);
        }
    } else {
        throw new TypeError("expected 'type' to be string");
    }

    var fn = _.sample(type.generate);
    if (typeof fn === "function") {
        var ret = fn();
        console.log("Generate returning:", ret);
        return ret;
    }
};

Fuzz.prototype.registerType = function(newType) {
    if (!(newType instanceof MandG)) {
        throw new TypeError ("expected 'newType' to be of type MandG, was: " + typeof mandg);
    }
    var name = newType.type;
    var parent = newType.parent;

    if (this.typeIndex[name] !== undefined) {
        throw new TypeError ("can't register type twice: " + name);
    }

    this.typeIndex[name] = newType;
    if (parent === undefined) {
        this.types[name] = newType;
    } else {
        throw new Error ("Parent types not implemented");
        var parentType = this.typeIndex[parent];
        parentType.addSubtype(newType);
    }
};

Fuzz.prototype.registerMutator = function(name, fn) {
    if (typeof this.typeIndex[name] !== "object") {
        throw new TypeError("couldn't find type 'name':" + name);
    }
    if (typeof fn !== "function") {
        throw new TypeError("expected function");
    }

    this.typeIndex[name].addMutator(fn);
};

Fuzz.prototype.registerGenerator = function(name, fn) {
    if (typeof this.typeIndex[name] !== "object") {
        throw new TypeError("couldn't find type 'name':" + name);
    }
    if (typeof fn !== "function") {
        throw new TypeError("expected function");
    }

    this.typeIndex[name].addGenerator(fn);
};