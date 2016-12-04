var assert = require("chai").assert;

var mandglib = require("../lib/mandg.js");
var MandG = mandglib.MandG;
var Generator = mandglib.Generator;
var Mutator = mandglib.Mutator;

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
                new MandG({}, function(){});
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

    it("can create a class", function() {
        new MandG("string", function(){});
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
        var mandg = new MandG("string", function(){});
        var g = new Generator("name", function() {});
        mandg.addGenerator(g);
    });

    it("can addGenerator based on function", function() {
        var mandg = new MandG("string", function(){});
        mandg.addGenerator(function foo() {});
    });

    it("fails addGenerator when gets wrong arg", function() {
        var mandg = new MandG("string", function(){});
        assert.throws(
            function() {
                mandg.addGenerator("test");
            }, TypeError);
    });

    it("fails addGenerator when gets no arg", function() {
        var mandg = new MandG("string", function(){});
        assert.throws(
            function() {
                mandg.addGenerator();
            }, TypeError);
    });

    it("can addMutator", function() {
        var mandg = new MandG("string", function(){});
        var g = new Mutator("name", function(arg) {
            return arg;
        });
        mandg.addMutator(g);
    });

    it("can addMutator based on function", function() {
        var mandg = new MandG("string", function(){});
        mandg.addMutator(function(arg) {
            return arg;
        });
    });

    it("fails addMutator when gets wrong arg", function() {
        var mandg = new MandG("string", function(){});
        assert.throws(
            function() {
                mandg.addMutator("test");
            }, TypeError);
    });

    it("fails addMutator when gets no arg", function() {
        var mandg = new MandG("string", function(){});
        assert.throws(
            function() {
                mandg.addMutator();
            }, TypeError);
    });

    it("can addSubtype", function() {
        var mandg = new MandG("string", function(){});
        var mandg2 = new MandG("x", function(){});
        mandg.addSubtype(mandg2);
    });

    it("fails when subtype is recursive", function() {
        var mandg = new MandG("string", function(){});
        assert.throws(
            function() {
                mandg.addSubtype(mandg);
            }, TypeError);
    });

    it("fails addSubtype when gets wrong arg", function() {
        var mandg = new MandG("string", function(){});
        assert.throws(
            function() {
                mandg.addSubtype("test");
            }, TypeError);
    });

    it("fails addSubtype when gets no arg", function() {
        var mandg = new MandG("string", function(){});
        assert.throws(
            function() {
                mandg.addSubtype();
            }, TypeError);
    });

    it("fails when same subtype is added twice", function() {
        var mandg = new MandG("string", function(){});
        var mandg2 = new MandG("x", function(){});
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