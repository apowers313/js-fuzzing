var _ = require("../lodash-wrapper.js");
var {
    MandG
} = require("../mandg.js");

var mandgString = new MandG("string", stringCheck);
mandgString.addMutator(stringTruncate);
mandgString.addGenerator(stringLorem);
mandgString.addGenerator(stringJunk);
mandgString.addGenerator(stringUnicodeJunk);
mandgString.addGenerator(stringEmpty);
mandgString.addUtil(stringJunk);

function stringCheck(thing) {
    return typeof thing === "string";
}

function stringTruncate(str) {
    if (typeof str !== "string") {
        console.log("stringTruncate got non-string:", str);
    }
    return str.substring(1, _.random(str.length - 2));
}

function stringLorem() {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lobortis ut augue sed suscipit. Aenean placerat semper felis, sit amet vulputate dolor. Donec non lacus sed nisi convallis aliquam et pharetra ante. Fusce ultricies laoreet augue, sollicitudin dignissim purus condimentum eget. Donec eu metus nec est bibendum consequat sit amet sed ante. Nulla gravida lectus sed fermentum hendrerit. Fusce suscipit magna leo, sed vulputate justo ultricies in. Nulla nisi eros, congue sit amet nibh ac, vehicula hendrerit eros. Quisque cursus pulvinar magna eget convallis. Aenean eget odio id enim mollis sodales eu quis ipsum. Aenean accumsan tincidunt tempor. Donec consequat at nisl eu tincidunt. Proin ornare mauris et orci pulvinar aliquam. Fusce congue euismod pulvinar. Suspendisse potenti.\n" +
        "Donec posuere nisl nec felis tincidunt iaculis. Donec sed turpis ornare, ultrices neque in, malesuada augue. Aliquam vel malesuada enim. Donec accumsan vel magna id consectetur. Praesent viverra fermentum nibh vitae sollicitudin. Donec leo ligula, feugiat nec leo at, dignissim aliquam elit. Donec gravida enim a ante venenatis gravida. Proin porta, elit eu tincidunt facilisis, dolor dolor elementum risus, sed bibendum quam ipsum nec ligula. Proin pulvinar id mauris placerat euismod. Proin id sapien in erat iaculis vulputate in vel risus. Cras at nunc id eros faucibus posuere a quis ante. Integer suscipit massa justo, sit amet dictum ante maximus vel. Nunc lacinia convallis justo, sed lacinia metus aliquet ut. Nullam at imperdiet dui. Nam mattis erat ut scelerisque condimentum.\n" +
        "Phasellus lobortis dui eget dignissim tempus. In condimentum leo neque, sed maximus dui venenatis ac. Cras id condimentum eros. Proin ornare magna blandit ex mattis suscipit. Vestibulum felis lorem, mollis sed ipsum a, ultricies euismod diam. Etiam volutpat in enim eu condimentum. Maecenas hendrerit lorem eget felis fermentum tempus. Praesent ultrices, dui et accumsan pharetra, purus turpis fringilla sem, eget dignissim orci massa vitae tellus. Aenean id venenatis nulla. Proin at vulputate turpis. Aenean mollis, ante at accumsan egestas, turpis massa varius felis, non sagittis leo sapien eu urna.\n" +
        "Etiam viverra egestas velit, sed aliquam elit posuere et. Pellentesque eu lobortis quam. Aenean scelerisque massa ut urna finibus pharetra. In egestas metus ut augue eleifend euismod. Integer sed sem ac arcu sodales consequat vitae quis lorem. Curabitur finibus vehicula diam non ultricies. Donec at mauris auctor, commodo libero ut, lacinia nisl. Praesent sed egestas risus. Etiam ac mi at metus pharetra finibus. Phasellus elit magna, luctus cursus lacinia sed, consectetur non justo. Vivamus semper enim ac elit malesuada, ac rhoncus nulla iaculis.\n" +
        "Ut ut tortor sit amet nisl rhoncus feugiat eu nec nibh. Sed faucibus nulla eget mauris varius, vel dignissim enim volutpat. Quisque sollicitudin tellus massa, consectetur finibus ipsum fringilla sit amet. Aenean lacinia dapibus enim id venenatis. Integer ut mi cursus urna consectetur scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer vel imperdiet nisl. Nullam semper blandit diam, facilisis gravida sem vehicula ornare. Quisque sollicitudin erat diam, at vulputate velit vulputate in. Vivamus metus elit, laoreet id magna sodales, dictum volutpat mi. Nullam et imperdiet justo. Phasellus sed mollis urna, ut scelerisque ligula. Vestibulum non ante id nisi finibus dapibus et eu nisl. Praesent lectus libero, suscipit vitae condimentum eget, rutrum nec dolor.\n";
}

function stringJunk() {
    var i, len = _.random(4096),
        str = "";
    for (i = 0; i < len; i++) {
        str += String.fromCharCode(_.random(255));
    }
    return str;
}

function stringUnicodeJunk() {
    var i, len = _.random(4096),
        str = "";
    for (i = 0; i < len; i++) {
        str += String.fromCharCode(_.random(65535));
    }
    return str;
}

function stringEmpty() {
    return "";
}

module.exports = mandgString;