# Lab

This lab is a bughunt. Assuming Node.js is installed, run:

    npm install
    npm test

* `src` folder contains example code.
* `test` folder contains test code.
* `src` and `test` match by name.
* Make all the tests pass.
    * For all except `async.js`: The bug is in the `src`.
    * For `async.js`: The bug is in the `test` (incorrect assumption).

Test framework used is [nodeunit](https://github.com/caolan/nodeunit).
