# MorseCoder
Encode string to Morse Code, decode Morse Code to a string.

Code assumes ECMAScript 5 compliance.


## Usage

```javascript
var m = MorseCoder();
var testString = "Hello, world!";
var encoded = m.encode(testString);
console.log("Encoded: ", encoded);
// Encoded: '. . . .   .   . - . .   . - . .   - - -   ,       . - -   - - -   . - .   . - . .   - . .   !' 
// Note: Things not in my version of the Morse Code 
// alphabet just pass through
var decoded = m.decode(encoded);
console.log("Decoded: ", decoded);
// Decoded: 'hello, world!'
// Note: can't retain caps in traditional Morse code.



// Or have a bit of fun.
var m = MorseCoder({
    encodingOverrides: {
        "-": "YEP",
        ".": "NOPE",
        // Leaving out the element gap.
    },
    gapOverrides: {
        // Spaces help (me) see things more visually.
        "letter": " YEEEPPP ",
        "word": " BRRRING ",
    },
});
var testString = "Hello, world!";
var encoded = m.encode(testString);
console.log("Encoded: ", encoded);
// Encoded: 'NOPE NOPE NOPE NOPE YEEEPPP nope YEEEPPP nope yep nope nope YEEEPPP nope yep nope nope YEEEPPP yep yep yep YEEEPPP , BRRRING nope yep yep YEEEPPP yep yep yep YEEEPPP nope yep nope YEEEPPP nope yep nope nope YEEEPPP yep nope nope YEEEPPP !' 
var decoded = m.decode(encoded);
console.log("Decoded: ", decoded);
// Decoded: 'Hello, world!'
// Note: caps retained when using words vs. symbols for dits and dahs.
```


## Stability

    Stability: 2 Unstable

I'm adopting the [Node.js Stability Index](http://nodejs.org/api/documentation.html#documentation_stability_index) in most of my code.

I don't have plans on changing this code. I've used this idea a couple of times (originally written in Python) and I'm pretty happy with it. But I haven't used it enough to consider it stable, because it has marginal use in real life.



## For developers

Assuming you have npm and Node.js installed:

    npm install

will get you everything you need. 

To rebuild stuff:

    npm install grunt-cli -g

To rebuild the docs (does not require Grunt):

    npm run-script gendoc
