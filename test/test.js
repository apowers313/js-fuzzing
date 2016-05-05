var assert = require("chai").assert;
var _ = require("lodash");
var traverse = require ("traverse");
var FuzzGen = require("../fuzz.js");


var complexObj = {
    a: "test",
    b: [
        1,
        "beer",
        { foo: "bar" }
    ],
    c: {
    	deep: {
    		deeper: {
    			deepest: 1,
    			fun: true,
    			music: ["every", "good", "boy", "does", "fine"]
    		}
    	}
    }
};

var complexPaths = [
	"a",
	"b",
	"b[0]",
	"b[1]",
	"b[2]",
	"b[2].foo",
	"c",
	"c.deep",
	"c.deep.deeper",
	"c.deep.deeper.deepest",
	"c.deep.deeper.fun",
	"c.deep.deeper.music",
	"c.deep.deeper.music[0]",
	"c.deep.deeper.music[1]",
	"c.deep.deeper.music[2]",
	"c.deep.deeper.music[3]",
	"c.deep.deeper.music[4]",
];

describe("basic tests", function() {
    it("fuzzes a string");
    it("right type identification", function() {
        var fg = new FuzzGen();
        assert.equal(fg.getType(undefined), fg.type.UNDEFINED);
        assert.equal(fg.getType("beer"), fg.type.STRING);
        assert.equal(fg.getType({ foo: "bar" }), fg.type.OBJECT);
        assert.equal(fg.getType([1, 2, 3]), fg.type.ARRAY);
        assert.equal(fg.getType(/foo/), fg.type.REGEXP);
        assert.equal(fg.getType(true), fg.type.BOOLEAN);
        // assert.equal (fg.getType (null), fg.type.NULL);
        assert.equal(fg.getType(42), fg.type.NUMBER);
        assert.equal(fg.getType(function() {}), fg.type.FUNCTION);
    });

    it("builds object paths", function() {
        var fg = new FuzzGen();
        assert.deepEqual(fg.createIndex({ a: 1, b: 2 }), ["a", "b"]);
        assert.deepEqual(fg.createIndex(["a", "b", "c"]), ["[0]", "[1]", "[2]"]);
        assert.deepEqual(fg.createIndex({}), []);
        assert.deepEqual(fg.createIndex(null), []);
        var ret = fg.createIndex(complexObj);
        assert.deepEqual (ret, complexPaths);
        assert.equal (_.get(complexObj, ret[0]), "test");
        assert.equal (_.get(complexObj, ret[5]), "bar");
        assert.equal (_.get(complexObj, ret[12]), "every");
        ret = traverse(complexObj).paths()
        console.log (ret);
        console.log (_.find (complexObj, "deeper"));
    });
});
