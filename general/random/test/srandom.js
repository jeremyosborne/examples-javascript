var srandom = require("../index.js").srandom;
var assert = require("assert");

describe("Sanity test for srandom.", function() {
    it("should be random", function() {
        // Save our starting string
        var seed = srandom.getSeed(),
            // Get our control numbers
            num1 = srandom(),
            num2 = srandom();

        assert(typeof num1 === "number", "srandom should only ever return a number.");

        // Reset the number seed for our tests
        srandom.setSeed(seed[0], seed[1]);

        assert.strictEqual(srandom(), num1, "Reseeded numbers must match.");
        assert.strictEqual(srandom(), num2, "Reseeded numbers must match.");
    });
});
