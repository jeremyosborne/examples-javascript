// Exercising the underscore library.

// Shorthand
var log = function() {
    console.log.apply(console, arguments);
};

// Functional operations on homogeneous data.
// Generate an array of random number from 1-10.
var data = _.times(10, function() {
    return _.random(1, 10);
});

log(data, "<- underscore functional operations against data");

// Diagnostics.
log(_.map(data, function(item) {
    return 2 * item;
}), "<- multiplying data by 2");

// Wrapping data in underscore wrapper.
data = _(data);

log(data, "<- data is now wrapped and has underscore functions mixed in.");

log(data.reduce(function(state, nextItem) {
    return state + nextItem;
}, 0), "<- sum of values determined with reduce");

log(data.find(function(item) {
    // Test.
    return item % 2 === 1;
}), "<- first value from left that matches test");

log(data.filter(function(item) {
    return item % 2 === 1;
}), "<- all items that pass the test");

log(data.reject(function(item) {
    return item % 2 === 1;
}), "<- all items that fail the test");

log(data.every(function(item) {
    return item % 2 === 1;
}), "<- does every value pass the test?");

log(data.some(function(item) {
    return item % 2 === 1;
}), "<- does at least one value pass the test?");

log(data.max(), "<- largest number in the list.");

log(data.min(), "<- smallest number in the list.");

log(data.groupBy(function(item) {
    var group = item % 2 == 0 ? "even" : "odd";
    return group;
}), "<- grouped evens and odds.");

log(data.countBy(function(item) {
    var group = item % 2 == 0 ? "even" : "odd";
    return group;
}), "<- counted evens and odds.");

log(data.shuffle(), "<- rerandomized with shuffle.");

log(data.sample(2), "<- 2 random items from the list");

log(data.last(), "<- last value in the array");

log(data.uniq(), "<- distinct values in the array");

log(data.uniq().sort(), "<- distinct, sorted in the array");

log(_.chain(data).uniq().sortBy(function(item) {
    return item.valueOf();
}).value(), "<- distinct, sorted by (numeric) value in the array");

log(_.zip(_.range(data.value().length-1), data.value()), "<- data zipped with index value");



log("Functions...");
var dog = { name: "fido"};
var dogName = function() { return this.name; };
var boundName = _.bind(dogName, dog);
log(boundName(), "<- name will not be undefined.");

var loggedName = _.wrap(boundName, function(f) {
    console.log(boundName());
});
log("Next line is from a wrapped function...");
loggedName();

var throttledName = _.throttle(loggedName, 100, {trailing: false});
log("will see fido only once below in the throttled function.");
_.each(_.range(10), function() {
    throttledName();
});

var warningLog = _.partial(log, "WARNING:");
warningLog("this should display with a 'warning' prefix");


// For lists of objects.
// sortBy
var scores = [
    {"name": "lucy", "type": "chicken", "score": 1000},
    {"name": "xena", "type": "chicken", "score": 100},
    {"name": "pookie", "type": "cat", "score": 500},
];
log("Working with objects...");



// shallow wrapping.
scores = _(scores);
log(scores.pluck("name"), "<- Names of all the animals.");

log(scores.where({"type": "chicken"}), "<- all the chickens");

log(scores.findWhere(function(item) {
    return item.name === "chicken";
}), "<- the first chicken");

log(scores.groupBy("type"), "<- grouped by animals");

log(_(scores.last()).size(), "<- the last animal has this many properties");

log(scores.sortBy(function(obj) {
    return obj.score.valueOf();
}), "<- sorted by scores");
