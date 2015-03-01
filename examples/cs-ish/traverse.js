/* jshint unused:true, undef:true, browser:true */
/* global console:false */

//
// Rocks -> Water -> Money
//
// Find a way across a path of rocks.
// Rocks are traversable, water is not.
// Starting in element 0, at speed 0,
// the player can modify their speed +1 or -1,
// and can also choose to not modify their speed at all.
//
// Is a path traversable?
//
// Traverse the path.
//
// What's the fastest path?


// Return a variable length Array with rocks marked as 1 and water
// marked as 0.
var generatePath = function() {
    var MAX_LENGTH = 20;
    var MIN_LENGTH = 10;
    var length = Math.max(MIN_LENGTH, Math.ceil(Math.random() * MAX_LENGTH));
    var path = [];
    // Give success a chance.
    path[0] = 1;
    for (var i = 1; i < length; i++) {
        // Slightly higher density of rocks to water.
        path[i] = Math.random() < 0.4 ? 0 : 1;
    }
    return path;
};



// Recursively find if this path is traversable.
var traverse = function(path, location, speed) {
    location = location || 0;
    speed = speed || 0;
    if (location >= path.length) {
        // We won.
        return true;
    } else if (path[location] === 0) {
        // Nope, can't traverse.
        return false;
    } else if (location < 0) {
        // Can't move before the beginning.
        return false;
    }

    // Positive or negative accleration happens and is applied to the
    // next turn (time) before evaluation.
    // Don't evaluate things that have us wind up on the same location.
    // Don't allow going backwards because I don't think (?) there's a solution
    // made by going backwards, or stopping.
    return traverse(path, location + speed + 1, speed + 1) ||
        ((location + speed != location) ? traverse(path, location + speed, speed) : false) ||
        ((speed - 1 > 0) ? traverse(path, location + speed - 1, speed - 1) : false);
};



// Find a least cost traverse across the path.
var bestTraverse = function(path) {
    // What, if any, is the fastest path.
    var best = null;

    // Rewritten traversal function that tries all paths.
    // currentPath contains an array of elements that have been traversed.
    // The final element can be larger than the original path.
    var traverse = function(currentPath, location, speed) {
        var p;

        if (location >= path.length) {
            // We won, record the path.
            if (!best || (best && best.length < currentPath.length)) {
                best = currentPath;
            }
            return true;
        } else if (path[location] === 0) {
            // Nope, can't traverse.
            return false;
        } else if (location < 0) {
            // Can't move before the beginning.
            return false;
        }

        // Try all paths at each node.
        p = currentPath.slice().concat([location + speed + 1]);
        traverse(p, location + speed + 1, speed + 1);

        if (location + speed != location) {
            p = currentPath.slice().concat([location + speed]);
            traverse(p, location + speed, speed);
        }

        if (speed - 1 > 0) {
            p = currentPath.slice().concat([location + speed - 1]);
            traverse(p, location + speed - 1, speed - 1);
        }
    };

    traverse([0], 0, 0);

    return best;
};



var path = generatePath();
console.log("The path (and length): %j (%s)", path, path.length);
console.log("Can traverse:", traverse(path));
var bestPath = bestTraverse(path);
console.log("best traverse (path, length): (%j, %s)", bestPath, bestPath && bestPath.length || null);
