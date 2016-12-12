var assert = require("chai").assert;
var mockery = require("mockery");
var sinon = require("sinon");
var {
    Cooker,
    Recipe,
    MandG,
    Mutator,
    Generator,
    MandGTypeManager,
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
        assert.isFunction(fn);
    });

    it("creates a recipe", function() {
        var c = new Cooker().init({
            foo: "bar"
        });
        var recipe = c.createRecipe();
        assert.instanceOf(recipe, Recipe);
    });
});

describe.skip("cooker generates and mutates", function() {
    var mgr;

    before(function() {
        new MandGTypeManager().forceReset();
    });

    after(function() {
        new MandGTypeManager().forceReset();
    });

    beforeEach(function() {
        mockery.enable({
            useCleanCache: true
        });
        mockery.warnOnUnregistered(false);
        mockery.warnOnReplace(false);
    });

    afterEach(function() {
        mockery.deregisterAll();
        mockery.disable();
        new MandGTypeManager().forceReset();
    });

    function retTrue(arg) {
        return true || arg;
    }

    it("gets a mutator", function() {
        var c = new Cooker();
        var mandg = new MandG("foo", retTrue);
        assert.isUndefined(c.mutate(mandg));
        mandg.addMutator(function fooMutate(thing) {
            return thing;
        });
        assert.isFunction(mandg.mutator.fooMutate);
        var mutator = c.mutate(mandg);
        assert.instanceOf(mutator, Mutator);
    });

    it("gets a generator", function() {
        var c = new Cooker();
        var mandg = new MandG("foo", retTrue);
        assert.isUndefined(c.generate(mandg));
        mandg.addGenerator(function fooGenerate() {
            return {};
        });
        assert.isFunction(mandg.generator.fooGenerate);
        var generator = c.generate(mandg);
        assert.instanceOf(generator, Generator);
    });

    it("gets any generators", function() {
        // make sure we are starting with a blank slate
        var mandg = new MandG("testType", retTrue);

        function adamsTestFunction() {}
        mandg.addGenerator(adamsTestFunction);
        mockery.registerMock("mod", mandg);
        var modList = ["mod"];
        mgr = new MandGTypeManager({
            mandgReplacementModules: modList
        });

        // see if the cooker returns our generator
        var c = new Cooker().init();
        assert.isUndefined(c.generateAnyCache);
        var generator = c.generateAny();
        assert.isArray(c.generateAnyCache);
        assert.instanceOf(generator, Generator);
        assert.strictEqual(generator, mandg.generator.adamsTestFunction);
    });

    it("creates a generateAnyCache of the right length", function() {
        // make sure we are starting with a blank slate
        function testFn1() {}

        function testFn2() {}

        function testFn3() {}

        function testFn4() {}

        function testFn5() {}

        function testFn6() {}

        function testFn7() {}
        var mandg1 = new MandG("type1", retTrue);
        mandg1.addGenerator(testFn1);
        mandg1.addGenerator(testFn2);
        var mandg2 = new MandG("type2", retTrue, {
            parent: "type1"
        });
        var mandg3 = new MandG("type3", retTrue, {
            parent: "type2"
        });
        mandg3.addGenerator(testFn3);
        mandg3.addGenerator(testFn4);
        mandg3.addGenerator(testFn5);
        mandg3.addGenerator(testFn6);
        mandg3.addGenerator(testFn7);
        mockery.registerMock("mod1", mandg1);
        mockery.registerMock("mod2", mandg2);
        mockery.registerMock("mod3", mandg3);
        var modList = ["mod1", "mod2", "mod3"];
        mgr = new MandGTypeManager({
            mandgReplacementModules: modList
        });

        // see if the cooker returns our generator
        var c = new Cooker().init();
        assert.isUndefined(c.generateAnyCache);
        c.generateAny();
        assert.isArray(c.generateAnyCache);
        assert.equal(c.generateAnyCache.length, 7);
    });

    it("gets parent mutators", function() {
        // make sure we are starting with a blank slate
        var mandg = new MandG("testType", retTrue);

        function adamsTestFunction(ret) {
            return ret;
        }
        mandg.addMutator(adamsTestFunction);
        mockery.registerMock("mod", mandg);
        var modList = ["mod"];
        mgr = new MandGTypeManager({
            mandgReplacementModules: modList
        });

        // see if the cooker returns our generator
        var c = new Cooker().init();
        var mutator = c.mutateByParent(mandg);
        assert.instanceOf(mutator, Mutator);
        assert.strictEqual(mutator, mandg.mutator.adamsTestFunction);
    });

    it("gets parent mutators from up an ancestor", function() {
        // make sure we are starting with a blank slate
        function sampleTestFn(ret) {
            return ret;
        }
        var mandg1 = new MandG("type1", retTrue);
        mandg1.addMutator (sampleTestFn);
        var mandg2 = new MandG("type2", retTrue, {
            parent: "type1"
        });
        var mandg3 = new MandG("type3", retTrue, {
            parent: "type2"
        });
        mockery.registerMock("mod1", mandg1);
        mockery.registerMock("mod2", mandg2);
        mockery.registerMock("mod3", mandg3);
        var modList = ["mod1", "mod2", "mod3"];
        mgr = new MandGTypeManager({
            mandgReplacementModules: modList
        });

        // see if the cooker returns our generator
        var c = new Cooker().init();
        var mutator = c.mutateByParent(mandg3);
        assert.instanceOf(mutator, Mutator);
        assert.strictEqual(mutator, mandg1.mutator.sampleTestFn);
    });
});

/* JSHINT */
/* globals before, after, beforeEach, afterEach  */