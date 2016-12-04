# js-fuzzing
Fuzzing for JavaScript objects and functions

Using an existing object or array of function arguments as a schema, and mutates or generates based on that schema. Extensible to add new types, mutators or generators.

## Installation

`npm install js-fuzz`

## Use Fuzzing
TODO

## Fuzzing a Object
TODO

## Fuzzing a Function
TODO
``` js
var FuzzGen = require("js-fuzzing");
var options = {
    count: 1000,
    mutateChance: function() {},
    generateChance: function() {},
    selectChance: function() {},
    allowedErrors: [
        new Error ("argument not allowed")
    ],
    passAllowed: false,
    timeout: false,
    argLimits: [
        undefined,
        ["!LargeNum", "!ZeroNum"]
    ]
}
var fg = new FuzzGen ();
fg.fn (yourFunction, opts);
```

## Fuzzing a Set of Functions
TODO

## Fuzzing a Constructor
TODO

## APIs for Extending Fuzzing

There are three ways to extend the fuzzing functionality:
* `registerType` - Add a new type (Object, String, HexString, Base64EncodedString, etc.)
* `registerMutator` - Add a new mutator to an existing type
* `registerGenerator` - Add a new generator to an existing type

## registerType
`registerType (name, obj, [parent])`
* `name` - A string for the name of the new type, all lower case and appropriate for being used as a key in an object (e.g. - "hexstring", "object", "binaryarray")
* `obj` - An object describing the new type. It must contain a method `check` which takes any type and returns `true` / `false` based on whether the thing passed in is one of your type. Can also have an array of `generate` or `mutate` for the corresponding functions, described in `registerMutator` and `registerGenerator` below. An object of `subtype` will be created empty and added to as subtypes are registered.
* `parent` - An optional string describing the parent type. For example, "array", "date", and "regexp" all have a parent type of "object".

`check` is called by `resolveType`
only one return type from resolveType
called hierarchically -- whichever `check` call matches first and whichever of the subtypes matches under that type (or the parent type if none of the subtypes match)
TODO

## registerMutator
TODO

## registerGenerator
TODO

// TODO: new types:
// - JSON
// - JWT
// - base64
// - hex
// - ByteArray
// - TypedArray
// - arrayofbytes
// - HTML
