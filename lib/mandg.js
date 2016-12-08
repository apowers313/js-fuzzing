var _ = require("./lodash-wrapper.js");
var traverse = require("traverse");
var dep = require("dependency-graph");

/**
 * Mutator
 *
 * Generic Mutator class
 */
class Mutator {
    constructor(name, fn, opts) {
        // check args
        if (typeof name !== "string") {
            throw new TypeError ("Mutator constructor expected 'name' to be string, got:" + name);
        }
        if (typeof fn !== "function") {
            throw new TypeError ("Mutator constructor expected 'fn' to be function, got:" + typeof fn);
        }
        if (fn.length !== 1) {
            throw new TypeError ("Mutator constructor expected 'fn' to have zero args, has:" + fn.length);
        }
        opts = opts || {};

        this.tags = [];
        this.name = name;
        this.fn = fn;
    }

    fn(thing) {
        throw new Error (`Mutating ${thing} in ${this.name}: mutator not implemented`);
    }
}

/**
 * Generator
 *
 * Generic Generator class
 */
class Generator {
    constructor(name, fn, opts) {
        // check args
        if (typeof name !== "string") {
            throw new TypeError ("Generator constructor expected 'name' to be string, got:" + name);
        }
        if (typeof fn !== "function") {
            throw new TypeError ("Generator constructor expected 'fn' to be function, got:" + typeof fn);
        }
        if (fn.length !== 0) {
            throw new TypeError ("Generator constructor expected 'fn' to have zero args, has:" + fn.length);
        }
        opts = opts || {};

        this.tags = [];
        this.name = name;
        this.fn = fn;
    }

    fn() {
        throw new Error (`Generator in ${this.name} not implemented`);
    }
}

/**
 * MandG
 *
 * Mutators and Generators (MandG) container class
 * has all the logic around the specific mutators and generators for a specific type
 */
class MandG {
    constructor(type, check) {
        if (typeof type !== "string") {
            throw new TypeError ("MandG constructor expected type, got: " + type);
        }

        if (typeof check !== "function") {
            throw new TypeError ("MandG constructor expected 'check' to be a function, got: " + typeof check);
        }

        this.type = type;
        this.name = type;
        // TODO: use Maps
        this.mutator = {};
        this.generator = {};
        this.subtype = {};
        this.utils = {};
        this.dependencies = [];
        this.check = check;
    }

    check(thing) {
        throw new Error (`Adding ${thing}: check not implemented`);
    }

    addMutator(m) {
        // if mutator is a function, convert it to the mutator class
        if (typeof m === "function") {
            m = new Mutator (m.name, m);
        }

        // check typeof Mutator
        if (!(m instanceof Mutator)) {
            throw new TypeError ("addMutator expected type Mutator, got: " + typeof m);
        }

        // TODO: check to make sure mutator doesn't already exist?
        var name = m.name;
        this.mutator[name] = m;
    }

    addGenerator(g) {
        // if generator is a function, convert it to the generator class
        if (typeof g === "function") {
            g = new Generator (g.name, g);
        }

        // check typeof Generator
        if (!(g instanceof Generator)) {
            throw new TypeError ("addGenerator expected type Generator, got: " + typeof g);
        }

        // TODO: check to make sure generator doesn't already exist?
        var name = g.name;
        this.generator[name] = g;
    }

    addSubtype(s) {
        // check typeof Subtype
        if (!(s instanceof MandG)) {
            throw new TypeError ("addSubtype expected type MandG, got: " + typeof s);
        }

        if (s === this) {
            throw new TypeError ("attempting to add MandG to itself: recursion not allowed");
        }

        // TODO: check to make sure type doesn't already exist
        var name = s.name;
        if (this.subtype[name] !== undefined) {
            throw new TypeError ("trying to add duplicate subtype: " + name);
        }
        this.subtype[name] = s;
    }

    /**
     * filter
     *
     * filters mutators and generators based on a specific tag
     */
    filter(tag) {
    }
}

var mandgTypeManagerSingleton;
class MandGTypeManager {
    constructor(opts) {
        // class is a singleton
        if (mandgTypeManagerSingleton) return mandgTypeManagerSingleton;
        mandgTypeManagerSingleton = this;

        // set default options
        opts = opts || {};
        var defaults = {};
        _.defaultsDeep(opts, defaults);

        // a heirarchy of types
        this.typeIndex = {};
        // a flat list of all types
        this.types = {};

        // load all the built-in types
        this.mandgList =
            [
                "./types/string.js",
                "./types/object.js"
            ];
        for (let idx in this.mandgList) {
            console.log(`Loading ${this.mandgList[idx]} ...`);
            // TODO: figure out dependencies
            this.registerType(require(this.mandgList[idx]));
        }
    }

    /**
     * registers a new mandg type
     */
    registerType(newType) {
        if (!(newType instanceof MandG)) {
            throw new TypeError("expected 'newType' to be of type MandG, was: " + typeof mandg);
        }
        var name = newType.type;
        var parent = newType.parent;

        if (this.typeIndex[name] !== undefined) {
            throw new TypeError("can't register type twice: " + name);
        }

        this.typeIndex[name] = newType;
        if (parent === undefined) {
            this.types[name] = newType;
        } else {
            throw new Error("Parent types not implemented");
            var parentType = this.typeIndex[parent];
            parentType.addSubtype(newType);
        }
    }

    /**
     * Turns a thing (string, object, null, etc.) into a mandg type
     */
    resolveType(thing) {
        console.log("doing resolveType");
        // recursively see if some 'type' in 'typeList' returns true when checking 'obj'
        // if it does, that's our type... check the subtypes to make sure there's not something
        // more specific
        function findType(typeList, obj) {
            console.log("doing findType");
            var mandgList = _.map(typeList, function(m, t) {
                if (m === undefined || t === undefined) return;
                console.log("!! CHECKING TYPE:", t);
                // console.log(mandg);
                if (m.check(obj)) {
                    console.log("found type: " + t + ". checking subtypes")
                    return findType(m.subtype, obj) || m;
                }
            });

            // type = _.flattenDeep (_.remove(type, _.isUndefined));
            var mandg;
            _.remove(mandgList, _.isUndefined);
            if (mandgList.length > 1) {
                throw new Error("found too many matching types");
            }
            if (mandgList.length === 0) mandg = undefined;
            if (Array.isArray(mandgList)) {
                mandg = _.flattenDeep(mandgList)[0];
            }
            // console.log ("returning", type);

            return mandg;
        }

        return findType(this.types, thing);
    }

}

module.exports = {
    // classes
    MandGTypeManager: MandGTypeManager,
    MandG: MandG,
    Mutator: Mutator,
    Generator: Generator
};
