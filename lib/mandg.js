var _ = require("./lodash-wrapper.js");
var DepGraph = require("dependency-graph").DepGraph;

/** @todo Mutator and Generator should be derived from a common class... too much cut-and-paste code right now */

/**
 * Generic Mutator class
 */
class Mutator {
    constructor(name, fn, opts) {
        // check args
        if (typeof name !== "string") {
            throw new TypeError("Mutator constructor expected 'name' to be string, got:" + name);
        }
        if (typeof fn !== "function") {
            throw new TypeError("Mutator constructor expected 'fn' to be function, got:" + typeof fn);
        }
        if (fn.length !== 1) {
            throw new TypeError("Mutator constructor expected 'fn' to have zero args, has:" + fn.length);
        }
        opts = opts || {};

        this.tags = [];
        this.name = name;
        this.fn = fn.bind(this.createContext());
    }

    /**
     * add MandGTypeManager's utils to 'this' object of function
     */
    createContext() {
        return {
            get utils() {
                return new MandGTypeManager().utils;
            }
        };
    }

    fn(thing) {
        throw new Error(`Mutating ${thing} in ${this.name}: mutator not implemented`);
    }
}

/**
 * Generic Generator class
 */
class Generator {
    constructor(name, fn, opts) {
        // check args
        if (typeof name !== "string") {
            throw new TypeError("Generator constructor expected 'name' to be string, got:" + name);
        }
        if (typeof fn !== "function") {
            throw new TypeError("Generator constructor expected 'fn' to be function, got:" + typeof fn);
        }
        if (fn.length !== 0) {
            throw new TypeError("Generator constructor expected 'fn' to have zero args, has:" + fn.length);
        }
        opts = opts || {};

        this.tags = [];
        this.name = name;
        this.fn = fn.bind(this.createContext());
    }

    /**
     * add MandGTypeManager's utils to 'this' object of function
     */
    createContext() {
        return {
            get utils() {
                return new MandGTypeManager().utils;
            }
        };
    }

    fn() {
        throw new Error(`Generator in ${this.name} not implemented`);
    }
}

/**
 * Mutators and Generators (MandG) container class
 * has all the logic around the specific mutators and generators for a specific type
 */
class MandG {
    constructor(type, check, opts) {
        if (typeof type !== "string") {
            throw new TypeError("MandG constructor expected type, got: " + type);
        }

        if (typeof check !== "function") {
            throw new TypeError("MandG constructor expected 'check' to be a function, got: " + typeof check);
        }

        // set default options
        opts = opts || {};
        var defaults = {};
        _.defaultsDeep(opts, defaults);

        if (!Array.isArray(opts.depends) && opts.depends !== undefined) {
            throw new TypeError("Expected dependencies to be array, got: " + typeof opts.depends);
        }
        if (typeof opts.parent !== "string" && opts.parent !== undefined) {
            throw new TypeError("Expected parent to be string, got: " + typeof opts.parent);
        }

        this.depends = opts.depends || []
        this.parent = opts.parent || undefined;

        // configure options
        this.type = type;
        this.name = type;
        this.check = check;

        // for future use
        // TODO: use Maps? using _.sample() later may not be map friendly
        this.mutator = {};
        this.generator = {};
        this.subtype = {};
        this.utils = {};
    }

    check(thing) {
        throw new Error(`Adding ${thing}: check not implemented`);
    }

    addMutator(m) {
        // if mutator is a function, convert it to the mutator class
        if (typeof m === "function") {
            m = new Mutator(m.name, m);
        }

        // check typeof Mutator
        if (!(m instanceof Mutator)) {
            throw new TypeError("addMutator expected type Mutator, got: " + typeof m);
        }

        // TODO: check to make sure mutator doesn't already exist?
        var name = m.name;
        this.mutator[name] = m;
    }

    addGenerator(g) {
        // if generator is a function, convert it to the generator class
        if (typeof g === "function") {
            g = new Generator(g.name, g);
        }

        // check typeof Generator
        if (!(g instanceof Generator)) {
            throw new TypeError("addGenerator expected type Generator, got: " + typeof g);
        }

        // TODO: check to make sure generator doesn't already exist?
        var name = g.name;
        this.generator[name] = g;
    }

    addSubtype(s) {
        // check typeof Subtype
        if (!(s instanceof MandG)) {
            throw new TypeError("addSubtype expected type MandG, got: " + typeof s);
        }

        if (s === this) {
            throw new TypeError("attempting to add MandG to itself: recursion not allowed");
        }

        // TODO: check to make sure type doesn't already exist
        var name = s.name;
        if (this.subtype[name] !== undefined) {
            throw new TypeError("trying to add duplicate subtype: " + name);
        }
        this.subtype[name] = s;
    }

    addUtil(fn) {
        if (typeof fn !== "function") {
            throw new TypeError("Expect 'fn' to be function in addUtil, got: " + typeof fn);
        }

        if (!fn.name) {
            throw new TypeError("addUtil can't use an anonymous function");
        }

        this.utils[fn.name] = fn;
    }

    /**
     * filters mutators and generators based on a specific tag
     */
    filter(tag) {}
}

/**
 * A singleton for managing all MandG types
 */
var mandgTypeManagerSingleton;
class MandGTypeManager {
    constructor(opts) {
        // class is a singleton
        if (mandgTypeManagerSingleton) return mandgTypeManagerSingleton;
        mandgTypeManagerSingleton = this;

        // set default options
        opts = opts || {};
        var defaults = {
            mandgModuleList: ["array", "boolean", "date", "function", /*"null",*/ "number", "object", "regexp", "string", "undef"]
        };
        _.defaultsDeep(opts, defaults);

        // a heirarchy of types
        this.typeIndex = {};
        // a flat list of all types
        this.types = {};
        // utility types
        this.utils = new Proxy({}, {
            get: (target, property) => {
                if (this.types[property] === undefined) return undefined;
                return this.types[property].utils;
            }
        });

        // load all the built-in types
        if (opts.mandgReplacementModules) {
            this.mandgModuleList = opts.mandgReplacementModules;
        } else {
            this.mandgModuleList = opts.mandgModuleList;
        }

        var mandg;
        var dependencyGraph = new DepGraph();
        for (let idx in this.mandgModuleList) {
            mandg = null;

            try {
                mandg = require(this.mandgModuleList[idx]);
            } catch (err) {}

            if (!mandg) try {
                mandg = require(`./types/${this.mandgModuleList[idx]}.js`);
            } catch (err) {}

            // if (!(mandg instanceof MandG)) { // XXX TODO for some reason this is broken
            if (!mandg) {
                throw TypeError("Error loading mandg module: " + this.mandgModuleList[idx]);
            }

            // add the node to the dependency graph
            // note that all nodes have to exist before dependencies can be added
            dependencyGraph.addNode(mandg.type, mandg);
        }

        // map out dependencies
        // TODO: save this order? replace module list?
        var list = dependencyGraph.overallOrder();
        for (let node of list) {
            mandg = dependencyGraph.getNodeData(node);
            // try to add parent as a dependency
            if (mandg.parent) {
                try {
                    dependencyGraph.addDependency(mandg.type, mandg.parent);
                } catch (err) {
                    throw new TypeError(`parent '${mandg.parent}' not found when loading '${mandg.type}'`);
                }
            }
            // try to add all depends as dependencies
            for (let depName of mandg.depends) {
                try {
                    dependencyGraph.addDependency(mandg.type, depName);
                } catch (err) {
                    throw new TypeError(`dependency '${depName}' not found when loading '${mandg.type}'`);
                }
            }
        }

        for (let node of dependencyGraph.overallOrder()) {
            mandg = dependencyGraph.getNodeData(node);
            this.registerType(mandg);
        }
    }

    /**
     * Kills the singleton so that a new one will be created.
     * Mostly useful for testing, but maybe other things too.
     */
    forceReset() {
        mandgTypeManagerSingleton = null;
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
            var parentType = this.typeIndex[parent];
            if (parentType === undefined) {
                throw new TypeError(`registerType couldn't find parent '${parent}' when adding type ${newType.type}`);
            }
            parentType.addSubtype(newType);
            newType.parent = parentType;
        }
    }

    /**
     * Turns a thing (string, object, null, etc.) into a mandg type
     */
    resolveType(thing) {
        // recursively see if some 'type' in 'typeList' returns true when checking 'obj'
        // if it does, that's our type... check the subtypes to make sure there's not something
        // more specific
        function findType(typeList, obj) {
            var mandgList = _.map(typeList, function(m, t) {
                if (m === undefined || t === undefined) return;
                if (m.check(obj)) {
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