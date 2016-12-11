var assert = require("chai").assert;
var _ = require("../lib/lodash-wrapper");
var {
    MandG
} = require("../index.js");

function testModule(name, thing) {
    describe(name, function() {
        it(`can load module ${name}`, function() {
            var mandg = require(`../lib/types/${name}.js`);
            assert.instanceOf(mandg, MandG);
        });

        it("can identify 'thing' correctly", function() {
            var mandg = require(`../lib/types/${name}.js`);
            assert.isTrue(mandg.check(thing));
        });

        // it("can run generators", function() {
        //     for (let generatorName in mandg.generator) {
        //         if (mandg.generator.hasOwnProperty(generatorName)) {
        //             console.log ("running:",generatorName);
        //             mandg.generator[generatorName]();
        //         }
        //     }
        // });

        // it("can run mutators", function() {
        //     for (let mutatorName in mandg.mutator) {
        //         if (mandg.mutator.hasOwnProperty(mutatorName)) {
        //             console.log ("running:",mutatorName);
        //             mandg.mutator[mutatorName](thing);
        //         }
        //     }
        // });

        testGenerators(name);
        testMutators(name, thing);
    });
}

function testMutators(name, thing) {
    var mandg = require(`../lib/types/${name}.js`);
    for (let mutatorName in mandg.mutator) {
        if (mandg.mutator.hasOwnProperty(mutatorName)) {
            it(mutatorName, function() {
                mandg.mutator[mutatorName](_.cloneDeep(thing));
            });
        }
    }
}

function testGenerators(name) {
    var mandg = require(`../lib/types/${name}.js`);
    for (let generatorName in mandg.generator) {
        if (mandg.generator.hasOwnProperty(generatorName)) {
            it(generatorName, function() {
                mandg.generator[generatorName]();
            });
        }
    }
}

describe("type tests", function() {
    testModule("array", ["a", "b", "c", 1, 2, 3]);
    testModule("boolean", true);
    testModule("date", new Date());
    testModule("function", function() {});
    // testModule("null", null);
    testModule("number", 3);
    testModule("object", {foo: "bar"});
    testModule("regexp", /abc/);
    testModule("string", "this is a test string");
    testModule("undef", undefined);
});