var assert = require("chai").assert;
var {Cooker} = require("../lib/cooker.js");
var {MandG} = require("../lib/mandg.js");

describe("cooker tests", function() {
    it("can create a cooker", function() {
        new Cooker();
    });

    it("fails when createRecipe first arg isn't pathList", function() {
        var c = new Cooker();
        assert.throws(
            function() {
                c.createRecipe("bad", []);
            },
            TypeError);
    });

    it("fails when createRecipe second arg isn't typeList", function() {
        var c = new Cooker();
        assert.throws(
            function() {
                c.createRecipe([], "bad");
            },
            TypeError);
    });

    it("gets a random path count", function() {
        var c = new Cooker();
        var cnt = c.getRandomPathCount(10);
        // console.log (cnt);
        assert.isNumber(cnt);
    });

    it("gets an operation", function() {
        var c = new Cooker();
        c.selectOp();
    });
});