(function(exports){

    // Seeded values
    var seedz = Date.now(),
        seedw = (Date.now() / 29);

    /**
     * @class A singleton function used to generate a pseudo-random number.
     * The function can be seeded with one of the supporting methods, with the
     * default seed based on the date.
     *
     * The number returned is between 0 and 1.
     *
     * @description Generate a pseudo-random number.
     * @static
     * @name srandom
     * @return {number} Floating point number between 0 and 1.
     */
    var srandom = function () {
        // Note: Supposedly bit shifting in JavaScript forces the 64-bit number
        // data type into 32-bit space.
        seedz = 36969 * (seedz & 65535) + (seedz >> 16);
        seedw = 18000 * (seedw & 65535) + (seedw >> 16);
        return ( Math.abs((seedz << 16) + seedw) % 65535 ) / 65535;
        // Afternote: I don't have any formal training with pseudo random
        // numbers.
        // Number types in JavaScript (according to ECMA-262):
        //   primitive value corresponding to a double-precision 64-bit binary
        //   format IEEE 754 value.
        // Starting with the wikipedia Random Number generator, described as
        //
        // m_w = <choose-initializer>;    /* must not be zero */
        // m_z = <choose-initializer>;    /* must not be zero */
        //
        // uint get_random()
        // {
        //    m_z = 36969 * (m_z & 65535) + (m_z >> 16);
        //    m_w = 18000 * (m_w & 65535) + (m_w >> 16);
        //    return (m_z << 16) + m_w;  /* 32-bit result */
        // }
        // and is better described at:
        // http://www.bobwheeler.com/statistics/Password/MarsagliaPost.txt.
        //
        // My thought follows:
        // The result of this is supposed to be a 32-bit unsigned integer,
        // but i'm not sure given some results I was seeing as I messed around
        // with this in JavaScript, so I changed it.
        //
        // I'm going to mod the result with an unsigned 16bit max value
        // and then divide by that. Even the funky ECMAScript-262 Number type
        // shouldn't have any problems with this.
        //
        // If this code gets out into the public and someone reading this
        // comment can take a moment to explain to me if I thoroughly borked
        // the period by moding seedz and seedw, even though they're stored
        // statically, I look forward to feedback.
        //
        // It doesn't have to be perfect for the simple games I'll be using
        // this for... until the players start yelling ;)
    };

    /**
     * Seed the pseudo-random number generator.
     * @static
     * @param seed0 {number} A non-zero integer used as seed #1. Corresponds
     * to index 0 of the array returned by getSeed.
     * @param seed1 {number} A non-zero integer used as seed #2. Corresponds
     * to index 1 of the array returned by getSeed.
     * @see getSeed
     */
    srandom.setSeed = function (seed0, seed1) {
        seedz = seed0;
        seedw = seed1;
    };

    /**
     * Return the current seed values..
     * @static
     * @return {number[]} The current seed values as an array.
     * @see setSeed
     */
    srandom.getSeed = function () {
        return [seedz, seedw];
    };




    exports.srandom = srandom;

})(this);
