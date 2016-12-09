var assert = require("chai").assert;
var mockery = require("mockery");
var sinon = require("sinon");
var {
    MandG,
    Generator,
    Mutator,
    MandGTypeManager
} = require("../lib/mandg.js");

describe("mutator and generator (MandG) class tests", function() {
    it("throws if no args", function() {
        assert.throws(
            function() {
                new MandG();
            },
            TypeError);
    });

    it("throws if type isn't a string", function() {
        assert.throws(
            function() {
                new MandG({}, function() {});
            },
            TypeError);
    });

    it("throws if check isn't a function", function() {
        assert.throws(
            function() {
                new MandG("test", {});
            },
            TypeError);
    });

    it("throws if parent isn't a string", function() {
        assert.throws(
            function() {
                new MandG("test", {parent: ["foo"]});
            },
            TypeError);
    });

    it("throws if depends isn't an array", function() {
        assert.throws(
            function() {
                new MandG("test", {depends: "foo"});
            },
            TypeError);
    });

    it("can create a class", function() {
        new MandG("string", function() {});
    });

    it("can be extended", function() {
        class foo extends MandG {
            constructor(type, check) {
                super(type, check);
            }
        }
        new foo("foo", function() {});
    });

    it.skip("can't create same type twice", function() {
        new MandG("string");
        assert.throws(
            function() {
                new MandG("string");
            },
            TypeError);
    });

    it("can addGenerator", function() {
        var mandg = new MandG("string", function() {});
        var g = new Generator("name", function() {});
        mandg.addGenerator(g);
    });

    it("can addGenerator based on function", function() {
        var mandg = new MandG("string", function() {});
        mandg.addGenerator(function foo() {});
    });

    it("fails addGenerator when gets wrong arg", function() {
        var mandg = new MandG("string", function() {});
        assert.throws(
            function() {
                mandg.addGenerator("test");
            }, TypeError);
    });

    it("fails addGenerator when gets no arg", function() {
        var mandg = new MandG("string", function() {});
        assert.throws(
            function() {
                mandg.addGenerator();
            }, TypeError);
    });

    it("can addMutator", function() {
        var mandg = new MandG("string", function() {});
        var g = new Mutator("name", function(arg) {
            return arg;
        });
        mandg.addMutator(g);
    });

    it("can addMutator based on function", function() {
        var mandg = new MandG("string", function() {});
        mandg.addMutator(function(arg) {
            return arg;
        });
    });

    it("fails addMutator when gets wrong arg", function() {
        var mandg = new MandG("string", function() {});
        assert.throws(
            function() {
                mandg.addMutator("test");
            }, TypeError);
    });

    it("fails addMutator when gets no arg", function() {
        var mandg = new MandG("string", function() {});
        assert.throws(
            function() {
                mandg.addMutator();
            }, TypeError);
    });

    it("can addSubtype", function() {
        var mandg = new MandG("string", function() {});
        var mandg2 = new MandG("x", function() {});
        mandg.addSubtype(mandg2);
    });

    it("fails when subtype is recursive", function() {
        var mandg = new MandG("string", function() {});
        assert.throws(
            function() {
                mandg.addSubtype(mandg);
            }, TypeError);
    });

    it("fails addSubtype when gets wrong arg", function() {
        var mandg = new MandG("string", function() {});
        assert.throws(
            function() {
                mandg.addSubtype("test");
            }, TypeError);
    });

    it("fails addSubtype when gets no arg", function() {
        var mandg = new MandG("string", function() {});
        assert.throws(
            function() {
                mandg.addSubtype();
            }, TypeError);
    });

    it("fails when same subtype is added twice", function() {
        var mandg = new MandG("string", function() {});
        var mandg2 = new MandG("x", function() {});
        assert.throws(
            function() {
                mandg.addSubtype(mandg2);
                mandg.addSubtype(mandg2);
            }, TypeError);
    });
});

describe("generator class tests", function() {
    it("throws if no args are provided", function() {
        assert.throws(
            function() {
                new Generator();
            },
            TypeError);
    });

    it("throws if no function is provided", function() {
        assert.throws(
            function() {
                new Generator("name");
            },
            TypeError);
    });

    it("can create a new generator", function() {
        new Generator("name", function() {});
    });

    it("throws if function has args", function() {
        assert.throws(
            function() {
                new Generator("name", function(arg) {
                    return arg;
                });
            },
            TypeError);
    });

    it("can call the function", function() {
        var g = new Generator("name", function() {});
        g.fn();
    });
});

describe("mutator class tests", function() {
    it("throws if no args are provided", function() {
        assert.throws(
            function() {
                new Mutator();
            },
            TypeError);
    });

    it("throws if no function is provided", function() {
        assert.throws(
            function() {
                new Mutator("name");
            },
            TypeError);
    });

    it("can create a new mutator", function() {
        new Mutator("name", function(arg) {
            return arg;
        });
    });

    it("throws if function has no args", function() {
        assert.throws(
            function() {
                new Mutator("name", function() {});
            },
            TypeError);
    });

    it("throws if function has two args", function() {
        assert.throws(
            function() {
                new Mutator("name", function(arg1, arg2) {
                    return arg1 + arg2;
                });
            },
            TypeError);
    });

    it("can create a new mutator", function() {
        var m = new Mutator("name", function(arg) {
            return arg;
        });
        m.fn(1);
    });
});

describe("MandG Manager tests", function() {
    it("right type identification", function() {
        var mgr = new MandGTypeManager();
        var mandg;

        // mandg = c.resolveType(undefined);
        // assert.instanceOf (mandg, MandG);
        // assert.equal(mandg.type, "undefined");

        // check string type
        mandg = mgr.resolveType("beer");
        assert.instanceOf(mandg, MandG);
        assert.equal(mandg.type, "string");

        // check object type
        mandg = mgr.resolveType({
            foo: "bar"
        });
        assert.instanceOf(mandg, MandG);
        assert.equal(mandg.type, "object");

        // assert.equal(c.resolveType([1, 2, 3]), "array");
        // assert.equal(c.resolveType(/foo/), "regexp");
        // assert.equal(c.resolveType(new Date()), "date");
        // assert.equal(c.resolveType(true), "boolean");
        // assert.equal(c.resolveType(null), "null");
        // assert.equal(c.resolveType(42), "number");
        // assert.equal(c.resolveType(function() {}), "function");
    });
});

describe("mandg manager module loading tests", function() {
    var mgr;

    before(function() {
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
        if (mgr instanceof MandGTypeManager) {
            mgr.forceReset();
        }
    });

    function retTrue() {
        return true;
    }

    it("loads the specified modules", function() {
        var mandg1 = new MandG("type1", retTrue);
        var mandg2 = new MandG("type2", retTrue);
        mockery.registerMock("mod1", mandg1);
        mockery.registerMock("mod2", mandg2);
        var modList = ["mod1", "mod2"];
        mgr = new MandGTypeManager({
            mandgReplacementModules: modList
        });
        console.log ("mgr types:", mgr.types);
        assert.deepEqual(mgr.types, {
            type1: mandg1,
            type2: mandg2
        });
    });

    it.skip("loads a mix of internal and external modules", function() {
        var mandg1 = new MandG("type1", retTrue);
        var mandg2 = new MandG("type2", retTrue);
        mockery.registerMock("mod1", mandg1);
        mockery.registerMock("mod2", mandg2);
        var modList = ["mod1", "mod2"];
        mgr = new MandGTypeManager({
            mandgModuleList: modList
        });
        assert.deepEqual(mgr.types, {
            type1: mandg1,
            type2: mandg2
        });
    });

    it("registers types in the right order based on depends", function() {
        var mandg1 = new MandG("type1", retTrue, {
            depends: ["type2"]
        });
        var mandg2 = new MandG("type2", retTrue);
        mockery.registerMock("mod1", mandg1);
        mockery.registerMock("mod2", mandg2);
        var modList = ["mod1", "mod2"];
        mgr = new MandGTypeManager({
            mandgReplacementModules: modList
        });
        assert.deepEqual(mgr.types, {
            type1: mandg1,
            type2: mandg2
        });
    });

    it("registers types in the right order based on parents", function() {
        var mandg1 = new MandG("type1", retTrue, {
            parent: "type2"
        });
        var mandg2 = new MandG("type2", retTrue, {
            parent: "type3"
        });
        var mandg3 = new MandG("type3", retTrue);
        mockery.registerMock("mod1", mandg1);
        mockery.registerMock("mod2", mandg2);
        mockery.registerMock("mod3", mandg3);
        var modList = ["mod1", "mod2", "mod3"];
        var spy = sinon.spy(MandGTypeManager.prototype, "registerType");
        mgr = new MandGTypeManager({
            mandgReplacementModules: modList
        });
        assert(spy.calledThrice, "spy should have been called three times");
        assert(spy.firstCall.calledWithExactly(mandg3));
        assert(spy.secondCall.calledWithExactly(mandg2));
        assert(spy.thirdCall.calledWithExactly(mandg1));
        assert.equal(mandg1.parent, mandg2);
        assert.equal(mandg2.parent, mandg3);
        assert.isUndefined(mandg3.parent);
    });

    it("fails when parent not found", function() {
        var mandg1 = new MandG("type1", retTrue, {
            parent: "noparent"
        });
        mockery.registerMock("mod1", mandg1);
        var modList = ["mod1"];
        assert.throws(function() {
            mgr = new MandGTypeManager({
                mandgReplacementModules: modList
            });
        }, TypeError, /^parent 'noparent' not found/);
    });

    it("fails when depends not found", function() {
        var mandg1 = new MandG("type1", retTrue, {
            depends: ["nosuchthing"]
        });
        mockery.registerMock("mod1", mandg1);
        var modList = ["mod1"];
        assert.throws(function() {
            mgr = new MandGTypeManager({
                mandgReplacementModules: modList
            });
        }, TypeError, /^dependency 'nosuchthing' not found/);
    });

    it("throws when there's a dependency loop", function() {
        var mandg1 = new MandG("type1", retTrue, {
            parent: "type2"
        });
        var mandg2 = new MandG("type2", retTrue, {
            parent: "type3"
        });
        var mandg3 = new MandG("type3", retTrue, {
            parent: "type1"
        });
        mockery.registerMock("mod1", mandg1);
        mockery.registerMock("mod2", mandg2);
        mockery.registerMock("mod3", mandg3);
        var modList = ["mod1", "mod2", "mod3"];
        assert.throws(function() {

            mgr = new MandGTypeManager({
                mandgReplacementModules: modList
            });
        }, Error, /^Dependency Cycle Found:/);
    });

    it("fails when module is not found");
});

/* JSHINT */
/* globals beforeEach, afterEach  */