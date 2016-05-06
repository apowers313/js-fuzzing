// const type = {
//     object: {
//         check: function(thing) {return Boolean},
//         generate: [function() {}, function() {}],
//         mutate: [function(thing) {}, function(thing) {}],
//         subtype: [{}, {}]
//     }
// };
var mandg = require ("./mutators-and-generators.js");

module.exports = function() {
    this.registerType("undefined", undefType);
    this.registerType("object", objType);
    this.registerType("array", arrType, "object");
    this.registerType("string", strType);
    this.registerType("regexp", regexpType, "object");
    this.registerType("date", dateType, "object");
    this.registerType("boolean", boolType);
    this.registerType("null", nullType, "object");
    this.registerType("number", numberType);
    this.registerType("function", functionType);
};

// TODO: new types:
// - JSON
// - JWT
// - base64
// - hex
// - ByteArray
// - TypedArray
// - arrayofbytes
// - HTML

var undefType = {
    check: function(thing) {
    	// console.log ("checking undefined...");
        return thing === undefined;
    }
};

var objType = {
	check: function(thing) {
		// console.log ("checking object...");
		// console.log (this.name);
		return typeof thing === "object";
	},
	mutate: mandg.object.mutate,
	generate: mandg.object.generate
};

var arrType = {
	check: function(thing) {
		// console.log ("checking array...");
		return Array.isArray (thing);
	},
	mutate: mandg.array.mutate,
	generate: mandg.array.generate
};

var strType = {
	check: function(thing) {
		return typeof thing === "string";
	},
	mutate: mandg.string.mutate,
	generate: mandg.string.generate
};

var regexpType = {
	check: function(thing) {
		return thing instanceof RegExp; 
	},
	mutate: mandg.regexp.mutate,
	generate: mandg.regexp.generate
};

var dateType = {
	check: function(thing) {
		return thing instanceof Date;
	},
	mutate: mandg.date.mutate,
	generate: mandg.date.generate
};

var boolType = {
	check: function(thing) {
		return typeof thing === "boolean";
	},
	mutate: mandg.boolean.mutate,
	generate: mandg.boolean.generate
};

var nullType = {
	check: function(thing) {
		return thing === null;
	},
	mutate: mandg.null.mutate,
	generate: mandg.null.generate
};

var numberType = {
	check: function(thing) {
		return typeof thing === "number";
	},
	mutate: mandg.number.mutate,
	generate: mandg.number.generate
};

var functionType = {
	check: function(thing) {
		return typeof thing === "function";
	},
	mutate: mandg.fn.mutate,
	generate: mandg.fn.generate
};
