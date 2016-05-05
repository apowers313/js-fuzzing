var assert = require("chai").assert;
var _ = require("lodash");
var traverse = require("traverse");
var FuzzGen = require("../fuzz.js");

describe("basic tests", function() {
    it.only("fuzzes a string", function() {
    	var fg = new FuzzGen("this is a test");
    	console.log (fg.fuzz());
    });
    it("fuzzes an object", function() {
    	var fg = new FuzzGen({foo: "bar"});
    	console.log (fg.fuzz());
    });
    it("register types");
    it("right type identification", function() {
        var fg = new FuzzGen();
        assert.equal(fg.resolveType(undefined), "undefined");
        assert.equal(fg.resolveType("beer"), "string");
        assert.equal(fg.resolveType({ foo: "bar" }), "object");
        assert.equal(fg.resolveType([1, 2, 3]), "array");
        assert.equal(fg.resolveType(/foo/), "regexp");
        assert.equal(fg.resolveType(new Date()), "date");
        assert.equal(fg.resolveType(true), "boolean");
        assert.equal(fg.resolveType(null), "null");
        assert.equal(fg.resolveType(42), "number");
        assert.equal(fg.resolveType(function() {}), "function");
    });
});
