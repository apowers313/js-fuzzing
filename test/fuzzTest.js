var assert = require("chai").assert;
var _ = require("../lib/lodash-wrapper");
// var traverse = require("traverse");
var {
    Fuzz,
    MandG
} = require("../index.js");

describe("basic tests", function() {
    it("can create a new fuzz object", function() {
        new Fuzz("this is a test");
    });

    it("fuzzes a string", function() {
        var fg = new Fuzz("this is a test");
        // console.log(fg.fuzz());
    });

    it("fuzzes an object", function() {
        var fg = new Fuzz({
            foo: "bar",
            blah: "test"
        });
        // console.log(fg.fuzz());
    });

    it("creates predictable random sequences", function() {
        var fg = new Fuzz("this is a test", {
            seed: 0
        });
        assert.equal(fg.seed, 0);

        assert.equal(0.038085370776470735, Math.random(), "first random test");
        assert.equal(_.random(0, 100, false), 8, "first random test");
        // console.log("Random:", Math.random());

        fg = new Fuzz("this is a test", {
            seed: 0
        });
        assert.equal(fg.seed, 0);
        assert.equal(0.038085370776470735, Math.random(), "second random test");
        assert.equal(_.random(0, 100, false), 8, "second random test");
        // console.log("Random:", Math.random());

        fg = new Fuzz("this is a test");
        assert.notEqual(fg.seed, 0);
        assert.notEqual(0.038085370776470735, Math.random());
    });

    it.skip("can't register two of the same type", function() {
        var fg = new Fuzz({
            foo: "bar",
            blah: "test"
        });
        var mandgObj = new MandG("foo", function() {});
        fg.registerType(mandgObj);
        assert.throws(
            function() {
                fg.registerType(mandgObj);
            },
            TypeError);
    })

    it("register types");
});