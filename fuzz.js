var _ = require("lodash");
var traverse = require("traverse");

module.exports = Fuzz;

function Fuzz(thing, opts) {
    var defaults = {
        mutateChance: 80,
        generateSameTypeChance: 50,
        selectItems: function() {
            if (this.baseIndex.length === 1) return this.baseIndex;
            return _.sampleSize(this.baseIndex, _.random(this.baseIndex.length - 1));
        }
    };
    _.defaultsDeep(opts, defaults);
    this.baseThing = thing;
    this.baseIndex = traverse(thing).paths();

    // this.name = "foo";
    this.types = {};
    this.typeIndex = {};

    // load all the built-in types
    require("./builtin-types.js").bind(this)();
    // console.log(require("util").inspect(this.types, { depth: null }));
    // console.log("init done");

}

Fuzz.prototype.fn = function(fn, argArr, cnt) {

};

Fuzz.prototype.fuzz = function() {
    var thing = _.cloneDeep(this.baseThing);
    var itemList = this.selectItems();
    var itemPath, itemType, item;

    while (itemList.length) {
        itemPath = itemList.pop();
        item = _.get(itemPath);
        itemType = this.getType(item);
        item = this.mutateOrGenerate(item, itemType);
    }
};

Fuzz.prototype.mutateOrGenerate = function(thing, type) {
    if (_.random(100) < this.mutateChance) {
        return this.mutate(thing, type);
    } else if (_.random(100) < this.generateSameTypeChance) {
        return this.generate(type);
    } else {
        return this.generate();
    }
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

    var fn =  _.sample (type.mutate);
    if (typeof fn === "function") {
    	return fn();
    }
};

Fuzz.prototype.generate = function(type) {
    // resolve type to object
    if (type === undefined) {
        type = _.sample(this.typeIndex);
    } else if (typeof type === "string") {
        type = this.typeIndex[type];
        if (type === undefined) {
            throw new TypeError("couldn't find 'type' for generate: " + type);
        }
    } else {
        throw new TypeError("expected 'type' to be string");
    }

    var fn =  _.sample (type.generate);
    if (typeof fn === "function") {
    	return fn();
    }
};

Fuzz.prototype.registerType = function(name, obj, parent) {
    // check args
    if (typeof name !== "string") {
        throw new TypeError("expected 'name' to be string");
    }
    if (name === "subtype") {
        throw new TypeError("'name' can't be subtype");
    }
    if (this.typeIndex[name] !== undefined) {
        throw new TypeError("'name' must be unique across all types: " + name + " already exists.");
    }
    if (typeof obj !== "object") {
        throw new TypeError("expected new type object");
    }
    if (typeof obj.check !== "function") {
        throw new TypeError("new type's 'check' must be a function");
    }
    var defaults = {
        mutate: [],
        generate: [],
        subtype: {}
    };
    _.defaultsDeep(obj, defaults);

    var newType = {};
    // Object.defineProperty (newType, "name", {configurable: true, enumerable: false, writable: true, value: name});
    Object.defineProperty(newType, "check", { configurable: true, enumerable: false, writable: true, value: obj.check });
    Object.defineProperty(newType, "mutate", { configurable: true, enumerable: false, writable: true, value: obj.mutate });
    Object.defineProperty(newType, "generate", { configurable: true, enumerable: false, writable: true, value: obj.generate });
    newType.subtype = _.cloneDeep(obj.subtype);

    this.typeIndex[name] = newType;
    if (parent === undefined) {
        this.types[name] = newType;
    } else {
        var parentType = this.typeIndex[parent];
        parentType.subtype[name] = newType;
    }
};

Fuzz.prototype.registerMutator = function(name, fn) {

};

Fuzz.prototype.registerGenerator = function(name, fn) {

};

// returns a string that is the most specific "type" of "thing" that can be determined
Fuzz.prototype.resolveType = function(thing) {
    var self = this;

    // recursively see if some 'type' in 'typeList' returns true when checking 'obj'
    // if it does, that's our type... check the subtypes to make sure there's not something
    // more specific
    function findType(typeList, obj) {
        var type = _.map(typeList, function(value, type) {
            if (value === undefined || type === undefined) return;
            if (value.check.call(self, obj)) {
                // console.log("found type: " + type + ". checking subtypes")
                return findType(value.subtype, obj) || type;
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

    return findType(this.types, thing);;
};
