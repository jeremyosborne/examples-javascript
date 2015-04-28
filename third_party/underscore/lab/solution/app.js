var contacts = [
    {"id" : 1, "first":"Joe", "last":"Smith", "email":"joe@nowhere.com"},
    {"id" : 2, "first":"Jane", "last":"Smith", "email":"jane@nowhere.com"},
    {"id" : 3, "first":"Julia", "last":"Markz", "email":"julia@nowhere.com"},
    {"id" : 4, "first":"Alice", "last":"Gee", "email":"agee@nowhere.com"},
];



// Using the ES5 .filter(), remove the "Smiths" from the result list.
console.log("filter results:", contacts.filter(function(c) {
    return c.last !== "Smith";
}));

// Using the ES5 .map(), transform each object into an array of values.
console.log("map results:", contacts.map(function(c) {
    var vals = [];
    for (var p in c) {
        if (c.hasOwnProperty(p)) {
            vals.push(c[p]);
        }
    }
    return vals;
}));


// Using the ES5 .reduce(), return the sum of the first names that begin with J.
// Remember that .reduce() can take a second argument, that being the first "prev" value.
console.log("reduce results:", contacts.reduce(function(prev, next) {
    prev += next.first[0] === "J" ? 1 : 0;
    return prev;
}, 0));



// Using underscore, find all the Smiths.
console.log("_ all the smiths", _(contacts).where({"last": "Smith"}));

// Using chained underscore methods, find a unique list of all the last names.
console.log("_ unique list of last names", _.chain(contacts).pluck("last").uniq().value());
