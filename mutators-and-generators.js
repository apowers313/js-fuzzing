var _ = require("lodash");

var mandg = {};

mandg.string = {
	mutate: [
		stringTruncate
	],
	generate: [
		stringLorem,
		stringJunk,
		stringUnicodeJunk,
		stringEmpty
	]
};

function stringTruncate(str) {
	if (typeof str !== "string") {
		console.log ("stringTruncate got non-string:", str);
	}
	return str.substring(1, _.random(str.length - 2));
}

function stringLorem() {
	console.log ("stringLorem");
	return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lobortis ut augue sed suscipit. Aenean placerat semper felis, sit amet vulputate dolor. Donec non lacus sed nisi convallis aliquam et pharetra ante. Fusce ultricies laoreet augue, sollicitudin dignissim purus condimentum eget. Donec eu metus nec est bibendum consequat sit amet sed ante. Nulla gravida lectus sed fermentum hendrerit. Fusce suscipit magna leo, sed vulputate justo ultricies in. Nulla nisi eros, congue sit amet nibh ac, vehicula hendrerit eros. Quisque cursus pulvinar magna eget convallis. Aenean eget odio id enim mollis sodales eu quis ipsum. Aenean accumsan tincidunt tempor. Donec consequat at nisl eu tincidunt. Proin ornare mauris et orci pulvinar aliquam. Fusce congue euismod pulvinar. Suspendisse potenti.\n" +
		"Donec posuere nisl nec felis tincidunt iaculis. Donec sed turpis ornare, ultrices neque in, malesuada augue. Aliquam vel malesuada enim. Donec accumsan vel magna id consectetur. Praesent viverra fermentum nibh vitae sollicitudin. Donec leo ligula, feugiat nec leo at, dignissim aliquam elit. Donec gravida enim a ante venenatis gravida. Proin porta, elit eu tincidunt facilisis, dolor dolor elementum risus, sed bibendum quam ipsum nec ligula. Proin pulvinar id mauris placerat euismod. Proin id sapien in erat iaculis vulputate in vel risus. Cras at nunc id eros faucibus posuere a quis ante. Integer suscipit massa justo, sit amet dictum ante maximus vel. Nunc lacinia convallis justo, sed lacinia metus aliquet ut. Nullam at imperdiet dui. Nam mattis erat ut scelerisque condimentum.\n" +
		"Phasellus lobortis dui eget dignissim tempus. In condimentum leo neque, sed maximus dui venenatis ac. Cras id condimentum eros. Proin ornare magna blandit ex mattis suscipit. Vestibulum felis lorem, mollis sed ipsum a, ultricies euismod diam. Etiam volutpat in enim eu condimentum. Maecenas hendrerit lorem eget felis fermentum tempus. Praesent ultrices, dui et accumsan pharetra, purus turpis fringilla sem, eget dignissim orci massa vitae tellus. Aenean id venenatis nulla. Proin at vulputate turpis. Aenean mollis, ante at accumsan egestas, turpis massa varius felis, non sagittis leo sapien eu urna.\n" +
		"Etiam viverra egestas velit, sed aliquam elit posuere et. Pellentesque eu lobortis quam. Aenean scelerisque massa ut urna finibus pharetra. In egestas metus ut augue eleifend euismod. Integer sed sem ac arcu sodales consequat vitae quis lorem. Curabitur finibus vehicula diam non ultricies. Donec at mauris auctor, commodo libero ut, lacinia nisl. Praesent sed egestas risus. Etiam ac mi at metus pharetra finibus. Phasellus elit magna, luctus cursus lacinia sed, consectetur non justo. Vivamus semper enim ac elit malesuada, ac rhoncus nulla iaculis.\n" +
		"Ut ut tortor sit amet nisl rhoncus feugiat eu nec nibh. Sed faucibus nulla eget mauris varius, vel dignissim enim volutpat. Quisque sollicitudin tellus massa, consectetur finibus ipsum fringilla sit amet. Aenean lacinia dapibus enim id venenatis. Integer ut mi cursus urna consectetur scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer vel imperdiet nisl. Nullam semper blandit diam, facilisis gravida sem vehicula ornare. Quisque sollicitudin erat diam, at vulputate velit vulputate in. Vivamus metus elit, laoreet id magna sodales, dictum volutpat mi. Nullam et imperdiet justo. Phasellus sed mollis urna, ut scelerisque ligula. Vestibulum non ante id nisi finibus dapibus et eu nisl. Praesent lectus libero, suscipit vitae condimentum eget, rutrum nec dolor.\n";
}

function stringJunk() {
	console.log ("stringJunk");
	var i, len = _.random(4096), str = "";
	for (i = 0; i < len; i++) {
		str += String.fromCharCode (_.random(255));
	}
	return str;
}

function stringUnicodeJunk() {
	console.log ("stringUnicodeJunk");
	var i, len = _.random(4096), str = "";
	for (i = 0; i < len; i++) {
		str += String.fromCharCode (_.random(65535));
	}
	return str;	
}

function stringEmpty() {
	console.log ("stringEmpty");
	return "";
}

mandg.object = {
	mutate: [
		objAddKeys
	],
	generate: [
		objEmpty
	]
};

// TODO: objDelKeys -- delete random object keys

function objAddKeys (thing) {
	var i, num = _.random(100), key;

	for (i = 0; i < num; i++) {
		key = stringJunk()
		thing[key] = this.generate();
	}
}

function objEmpty (thing) {
	return Object.create(null);
}

mandg.array = {
	mutate: [
		arrJunk
	],
	generate: [
		arrGenJunk,
		arrEmpty
	]
};

// TODO: arrayClone -- duplicate and append existing array members
// TODO: arrayCloneMutant -- duplicate and append mutations of existing array members

function arrJunk(thing) {
	var i, num = _.random(100);

	for (i = 0; i < num; i++) {
		thing.unshift (this.generate());
	}
}

function arrGenJunk() {
	var i, num = _.random(100);
	var thing = [];

	for (i = 0; i < num; i++) {
		thing.unshift (this.generate());
	}
}

function arrEmpty() {
	return [];
}

mandg.undef = {
	mutate: [],
	generate: [
		undefUndef
	]
};

function undefUndef() {
	return undefined;
}

mandg.regexp = {
	mutate: [],
	generate: [
		regexpGobble
	]
};

function regexpGobble() {
	return /.*/;
}

mandg.date = {
	mutate: [],
	generate: [
		dateMin,
		dateMax
	]
};

function dateMin() {
	return new Date(0);
}

function dateMax() {
	return new Date(Number.MAX_VALUE);
}

mandg.boolean = {
	mutate: [],
	generate: [
		boolTrue,
		boolFalse,
		numZero,
		numOne
	]
};

function boolTrue() {
	return true;
}

function boolFalse() {
	return false;
}

mandg.number = {
	mutate: [
		numFlipSign,
		numToFloat
	],
	generate: [
		numNegInf,
		numPosInf,
		numNan,
		numMax,
		numMin,
		numOne,
		numZero,
		numNegOne,
		numFloat
	]
};

function numFlipSign(thing) {
	return thing * -1;
}

function numToFloat() {
	return thing + 0.1;
}

function numNegInf() {
	return Number.NEGATIVE_INFINITY;
}

function numPosInf() {
	return Number.POSITIVE_INFINITY;
}

function numNan() {
	return NaN;
}

function numMax() {
	return Number.MAX_VALUE;
}

function numMin() {
	return Number.MIN_VALUE;
}

function numOne() {
	return 1;
}

function numZero() {
	return 0;
}

function numNegOne() {
	return -1;
}

function numFloat() {
	return 3.14159;
}

mandg.fn = {
	mutate: [],
	generate: [
		fnReturnJunk,
		fnPromiseUnresolved,
		fnThrow
	]
};

// TODO: fnSmartCallback -- detects arguments of type function and calls them with junk and / or the (err, val) pattern

function fnReturnJunk() {
	var ret = this.generate();
	return function() { return ret; };
}

function fnPromiseUnresolved() {
	return function() { return new Promise(function (f, r) {}); };
}

function fnThrow() {
	return function() { throw new Error ("fnThrow intentionally failed"); };
}

mandg.null = {
	mutate: [],
	generate: [
		numZero,
		boolFalse,
		undefUndef
	]
};

module.exports = mandg;
