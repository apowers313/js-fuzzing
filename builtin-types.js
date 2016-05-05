// const type = {
//     object: {
//         check: function(thing) {return Boolean},
//         generate: [function() {}, function() {}],
//         mutate: [function(thing) {}, function(thing) {}],
//         subtype: [{}, {}]
//     }
// };


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
	}
};

var arrType = {
	check: function(thing) {
		// console.log ("checking array...");
		return Array.isArray (thing);
	}
};

var strType = {
	check: function(thing) {
		return typeof thing === "string";
	}
};

var regexpType = {
	check: function(thing) {
		return thing instanceof RegExp; 
	}
};

var dateType = {
	check: function(thing) {
		return thing instanceof Date;
	}
};

var boolType = {
	check: function(thing) {
		return typeof thing === "boolean";
	}
};

var nullType = {
	check: function(thing) {
		return thing === null;
	}
};

var numberType = {
	check: function(thing) {
		return typeof thing === "number";
	}
};

var functionType = {
	check: function(thing) {
		return typeof thing === "function";
	}
};
