var assert = require("chai").assert;
var _ = require("../lib/lodash-wrapper");
var {
    MandG,
    MandGTypeManager
} = require("../index.js");

describe("type tests", function() {
    testModule("array", ["a", "b", "c", 1, 2, 3]);
    testModule("boolean", true);
    testModule("date", new Date());
    testModule("function", function() {});
    testModule("null", null);
    testModule("number", 3);
    testModule("object", {
        foo: "bar"
    });
    testModule("regexp", /abc/);
    testModule("string", "this is a test string");
    testModule("undef", undefined);
});

function testModule(name, thing) {
    describe(name, function() {

        before(function() {
            var mgr = new MandGTypeManager({
                mandgReplacementModules: []
            });
            // console.log ("context getter", mgr.__proto__.getContext);
            mgr.__proto__.getContext = function() {
                return createTestContext(thing);
            };
        });

        after(function() {
            new MandGTypeManager().forceReset();
        });

        it(`can load module ${name}`, function() {
            var mandg = require(`../lib/types/${name}.js`);
            assert.instanceOf(mandg, MandG);
        });

        it("can identify 'thing' correctly", function() {
            var mandg = require(`../lib/types/${name}.js`);
            assert.isTrue(mandg.check(thing));
        });

        testGenerators(name);
        testMutators(name, thing);
    });
}

function testMutators(name, thing) {
    var mandg = require(`../lib/types/${name}.js`);
    for (let mutatorName of Object.keys(mandg.mutator)) {
        it(mutatorName, function() { // jshint ignore:line
            mandg.mutator[mutatorName].call(createTestContext(), _.cloneDeep(thing));
        });
    }
}

function testGenerators(name) {
    var mandg = require(`../lib/types/${name}.js`);
    for (let generatorName of Object.keys(mandg.generator)) {
        it(generatorName, function() { // jshint ignore:line
            mandg.generator[generatorName].call(createTestContext());
        });
    }
}

function createTestContext(thing) {
    var ctx = {
        generateAny: function() {
            return thing;
        }
    };

    // create a Proxy for mgr.typeIndex
    // basically this.utils.*.(mutator|generator).* is a function that returns 'thing'
    ctx.utils = new Proxy({}, {
        get: function() {
            // a proxy for MandG objects
            return {
                // mutator.* is a function returning 'thing'
                mutator: new Proxy({}, {
                    get: function() {
                        return function() {
                            return thing;
                        };
                    },
                }),
                // generator.* is a function returning 'thing'
                generator: new Proxy({}, {
                    get: function() {
                        return function() {
                            return thing;
                        };
                    },
                })
            };
        }
    });


    // console.log("test ctx:", ctx);
    return ctx;
}