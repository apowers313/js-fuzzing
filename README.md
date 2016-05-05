# js-fuzzing
Fuzzing for JavaScript objects and functions

Using an existing object or array of function arguments as a schema, and mutates or generates based on that schema.

## Installation

`npm install js-fuzz`

## Use

``` js
var fuzz = new require("js-fuzz");
var options = {
    count: 1000,
    mutate: function() {},
    generate: function() {},
    select: function() {},
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
fuzz.fn (yourFunction, [arg1, arg2, arg3], 1000);
