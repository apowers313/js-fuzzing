var seedrandom = require('seedrandom');
seedrandom (0, { global: true }); // XXX: replaces Math.random() with new PRNG, must be done before lodash
var _;
if (_ === undefined) {
    _ = require("lodash");
    _.seedrandom = seedrandom;
}
module.exports = _;