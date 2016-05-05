var _ = require ("lodash");
var traverse = require ("traverse");

module.exports = Fuzz;

const FT = { // Fuzz types
    UNKNOWN: -1,
    UNDEFINED: 1,
    NULL: 2,
    STRING: 3,
    OBJECT: 4,
    ARRAY: 5,
    BOOLEAN: 6,
    REGEXP: 7,
    DATE: 8,
    NUMBER: 9,
    FUNCTION: 10
};

const type = {
	object: {
		check: function(){},
		generate: [function(){}, function(){}],
		mutate: [function(){}, function(){}],
		subtype: [{}, {}]
	}
};

const FST = { // Fuzz subtypes
};

function Fuzz(thing) {
    this.type = FT;
}

Fuzz.prototype.fn = function(fn, argArr, cnt) {

};

Fuzz.prototype.fuzz = function(thing) {
    // deep copy
    // index
    this.baseThing = thing;
    this.baseIndex = this.createIndex (thing);
    // _.cloneDeep(this.baseThing);
    // _.cloneDeep(this.baseIndex);
    // for (type in this.type)
};

Fuzz.prototype.mutate = function(thing, type) {

};

Fuzz.prototype.generate = function(type) {

};

Fuzz.prototype.register = function(name, obj, parent) {
	// Object.defineProperty (obj, name, {configurable: true, enumerable: false, writable: true, value: XXX});
};

Fuzz.prototype.getType = function(thing) {
	if (thing === null) return this.type.NULL;

    switch (typeof thing) {
        case "undefined":
            return this.type.UNDEFINED;
        case "string":
            return this.type.STRING;
        case "boolean":
            return this.type.BOOLEAN;
        case "regexp":
            return this.type.REGEXP;
        case "null":
        	return this.type.NULL;
        case "number":
        	return this.type.NUMBER;
       	case "function":
       		return this.type.FUNCTION;
        case "object":
            break;
        default:
        	return this.type.UNKNOWN;
    }

    // should be object at this point
    if (Array.isArray (thing)) return this.type.ARRAY;
    if (thing instanceof RegExp) return this.type.REGEXP;
    if (thing instanceof Date) return this.type.DATE;

    // must just be a generic object
    return this.type.OBJECT;
};

Fuzz.prototype.getSubType = function(thing, type) {
	if (type === undefined) {
		type = this.getType (thing);
	}
};

Fuzz.prototype.createIndex = function(thing, basepath) {
	var ret = [];
	var type;
	// console.log ("Basepath:", basepath);

	if (basepath === undefined) basepath = "";
	function mkPath (thing, basepath, key) {
		if (Array.isArray (thing))
			return basepath + "[" + key + "]";
		else if (basepath !== "")
			return basepath + "." + key;
		else
			return key;
	}

	_.forOwn (thing, function (value, key) {
		// console.log ("key:", mkPath (thing, basepath, key));
		ret.push (mkPath (thing, basepath, key));
		type = this.getType (value);
		if (type === this.type.ARRAY || type === this.type.OBJECT) {
			ret = ret.concat(this.createIndex (value, mkPath (thing, basepath, key)));
		}
	}.bind(this));
	// console.log ("Returning:", ret);
	return ret;
};
