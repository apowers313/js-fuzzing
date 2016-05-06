var _ = require("lodash");
var traverse = require("traverse");

module.exports = Fuzz;

function Fuzz(thing, opts) {
    opts = opts || {};
    var defaults = {
        mutateChance: 80,
        generateSameTypeChance: 50,
        mutateOrGenerate: mutateOrGenerate,
        selectItems: selectItems
    };
    _.defaultsDeep(opts, defaults);
    this.baseThing = thing;
    this.pathList = _.invokeMap(traverse(thing).paths(), Array.prototype.join, ".");
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
    require("./builtin-types.js").bind(this)();
    // console.log(require("util").inspect(this.types, { depth: null }));
    // console.log("init done");

}

function mutateOrGenerate(thing, type) {
    console.log("mutateOrGenerate");
    console.log("thing:", thing);
    console.log("type:", type);
    
    var typeObj = this.typeIndex[type];
    if (_.random(100) < 50) {
        return this.generate();
    } else {
    	if (typeObj.mutate === undefined) {
    		console.log ("!!! MUTATE UNDEFINED:", typeObj.name);
    		console.log (typeObj);
    	}
    	var fnList = typeObj.mutate.concat(typeObj.generate);
    	var fn = _.sample (fnList);
    	if (typeObj.mutate.indexOf(fn) !== -1) {
    		this.mutate (thing, type);
    	} else {
    		this.generate (type);
    	}
    }
}

function selectItems() {
    if (this.pathList.length === 1) return this.pathList;
    return _.sampleSize(this.pathList, _.random(1, this.pathList.length - 1));
}

Fuzz.prototype.fn = function(fn, argArr, cnt) {

}

Fuzz.prototype.fuzz = function() {
    if (this.singleBaseThing) return this.fuzzSingle();

    var thing = _.cloneDeep(this.baseThing);
    console.log(thing);
    var itemList = this.selectItems();
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
}

Fuzz.prototype.fuzzSingle = function() {
    console.log("fuzzSingle");
    var thing = _.cloneDeep(this.baseThing);
    var type = this.resolveType(thing);
    console.log("Thing:", thing);
    console.log("Type:", type);

    return this.mutateOrGenerate(thing, type);
}

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
}

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
}

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

    // console.log ("Registering:", name);
    // console.log ("Mutate:", obj.mutate);
    // console.log ("Generate:", obj.generate);

    var newType = {};
    // TODO: not sure the non-enumeration is necessary anymore since we aren't using traverse
    Object.defineProperty(newType, "name", { configurable: true, enumerable: false, writable: true, value: name }); // convenience type
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
}

Fuzz.prototype.registerMutator = function(name, fn) {
    if (typeof this.typeIndex[name] !== "object") {
        throw new TypeError("couldn't find type 'name':" + name);
    }
    if (typeof fn !== "function") {
        throw new TypeError("expected function");
    }

    this.typeIndex[name].mutate.push(fn);
}

Fuzz.prototype.registerGenerator = function(name, fn) {
    if (typeof this.typeIndex[name] !== "object") {
        throw new TypeError("couldn't find type 'name':" + name);
    }
    if (typeof fn !== "function") {
        throw new TypeError("expected function");
    }

    this.typeIndex[name].generate.push(fn);
}

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

    return findType(this.types, thing);
}
