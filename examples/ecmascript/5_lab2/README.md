* Write a `log` function that takes one argument, we'll call it `prefix`.
* `log` returns a function for later use.
* The function returned by `log` will pass arguments to console.log and will pass `prefix` as the first argument without and will then correctly pass the remaining arguments as variable set of additional arguments. (Note: this will essentially screw up how tokenized %s and %j and %d will work, so we assume users of your `log` function won't need that for this example.)
* Test it out with an `info:` prefix and `ERROR:` prefix.
* Pass an array to one of the functions and an object literal to the other and make sure the objects are inspected by console.log.
