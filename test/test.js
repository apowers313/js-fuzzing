var assert = require("chai").assert;
var _ = require("../lib/lodash-wrapper");
var traverse = require("traverse");
var FuzzGen = require("../index.js");
var mandglib = require("../lib/mandg.js");
var MandG = mandglib.MandG;
var Generator = mandglib.Generator;
var Mutator = mandglib.Mutator;

describe("basic tests", function() {
    it("can create a new fuzz object", function () {
        new FuzzGen("this is a test");
    });

    it("fuzzes a string", function() {
    	var fg = new FuzzGen("this is a test");
    	console.log (fg.fuzz());
    });

    it("fuzzes an object", function() {
    	var fg = new FuzzGen({foo: "bar", blah: "test"});
    	console.log (fg.fuzz());
    });

    it("creates predictable random sequences", function() {
        var fg = new FuzzGen("this is a test", {seed: 0});
        assert.equal (fg.seed, 0);

        assert.equal (0.038085370776470735, Math.random(), "first random test");
        assert.equal (_.random(0, 100, false), 8, "first random test");
        console.log ("Random:", Math.random());

        fg = new FuzzGen("this is a test", {seed: 0});
        assert.equal (fg.seed, 0);
        assert.equal (0.038085370776470735, Math.random(), "second random test");
        assert.equal (_.random(0, 100, false), 8, "second random test");
        console.log ("Random:", Math.random());

        fg = new FuzzGen("this is a test");
        assert.notEqual (fg.seed, 0);
        assert.notEqual (0.038085370776470735, Math.random());
    });

    it("can't register two of the same type", function() {
        var fg = new FuzzGen({foo: "bar", blah: "test"});
        var mandgObj = new MandG("foo", function(){});
        fg.registerType (mandgObj);
        assert.throws(
            function() {
                fg.registerType (mandgObj);
            },
            TypeError);
    })

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
