var assert = require("chai").assert;
var {
    Cooker,
    Recipe,
    MandG
} = require("../index.js");

describe("cooker tests", function() {
    it("can create a cooker", function() {
        new Cooker();
    });

    it("gets a random path count", function() {
        var c = new Cooker().init();
        var cnt = c.getRandomPathCount(10);
        // console.log (cnt);
        assert.isNumber(cnt);
    });

    it("throws an error if not initalized", function() {
        var c = new Cooker();
        assert.throws(
            function() {
                c.createRecipe([], "bad");
            },
            Error);
    });

    it("gets an operation", function() {
        var c = new Cooker().init();
        var mandg = new MandG("test", function() {
            return true;
        });
        mandg.addGenerator(function foo() {});
        var fn = c.selectOp(mandg);
        assert.isFunction (fn);
    });

    it("gets a mutator");
    it("gets a generator");
    it("gets all generators");
    it("gets parent mutators");

    it("creates a recipe", function() {
        var c = new Cooker().init({
            foo: "bar"
        });
        var recipe = c.createRecipe();
        assert.instanceOf (recipe, Recipe);
    });
});