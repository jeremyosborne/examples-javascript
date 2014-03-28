console.log("fiber rubber duck coding");

// Class factory pattern.
var Particle = Fiber.extend(function() {
    return {
        // Called during instantiation (constructor method).
        init: function(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        },
        // Public prototype methods.
        location: function() {
            return {
                x: this.x,
                y: this.y
            };
        }
    };
});

console.log("Particle stats.");
// prototype methods live on the prototype
console.log("reference to Particle.prototype.location", Particle.prototype.location);

var particle1 = new Particle();
console.log("particle1 location:", particle1.location());
console.log("particle1 x:", particle1.x);

var particle2 = new Particle(1, 1);
console.log("particle2 location:", particle2.location());
console.log("particle2 x:", particle2.x);



var HeavyParticle = Particle.extend(function(base) {
    return {
        init: function(x, y, mass) {
            // Super, via object reference in class factory callback.
            base.init.apply(this, arguments);
            // Extended property tacked on.
            this.mass = mass || 1;
        }
    };
});

var heavyParticle1 = new HeavyParticle(2, 2, 100);
console.log("heavyParticle1 location", heavyParticle1.location());
console.log("heavyParticle1 mass", heavyParticle1.mass);


// Mixin/decorator.
var forceOfGravityMixin = function(base) {
    return {
        fall: function() {
            this.y -= 9.8;
        }
    };
};



// Apply as mixin (per class).
Fiber.mixin(HeavyParticle, forceOfGravityMixin);
console.log("HeavyParticle.prototype.fall", HeavyParticle.prototype.fall);
console.log("heavyParticle1 location before fall", heavyParticle1.location());
heavyParticle1.fall();
console.log("heavyParticle1 location after fall", heavyParticle1.location());



// Apply as decorator (per instance).
var particle3 = new Particle();
Fiber.decorate(particle3, forceOfGravityMixin);
console.log("particle3 location before fall", particle3.location());
particle3.fall();
console.log("particle3 location after fall", particle3.location());
