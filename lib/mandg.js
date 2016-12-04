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

module.exports = {
    // classes
    MandG: MandG,
    Mutator: Mutator,
    Generator: Generator
};
