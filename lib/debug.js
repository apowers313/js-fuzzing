var debugOn = false;
function debug(...args) {
    if (debugOn) console.log(...args);
}

debug.on = function() {
    debugOn = true;
};

debug.off = function() {
    debugOn = false;
};

module.exports = {
    debug: debug
}