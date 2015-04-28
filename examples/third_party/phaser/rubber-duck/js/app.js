/* jshint unused:true, undef:true, browser:true */
/* global Phaser:false */



var Flak = function(position) {
    //Phaser.Sprite.call(this, this.game, position.x, position.y, this.spriteImage);
    // Trying out cache.
    Phaser.Sprite.call(this, this.game, position.x, position.y, game.cache.getBitmapData("flak"));

    // Center flak over pointer.
    this.anchor.setTo(0.5, 0.5);
    // For collisions.
    this.game.physics.arcade.enable(this);
    this.game.add.existing(this);
};
Flak.prototype = Object.create(Phaser.Sprite.prototype);
// Expanding outward unless this is true.
Flak.prototype.imploding = false;
// Pixels per frame.
Flak.prototype.sizeChangeVelocity = 5;
// How many pixels big before we implode.
Flak.prototype.maxSize = 60;
Flak.prototype.update = function() {
    //  Automatically called by World.update
    // Increase the size of the sprite.
    if (!this.imploding) {
        this.width += this.sizeChangeVelocity;
        this.height += this.sizeChangeVelocity;
        if (this.width > this.maxSize) {
            this.imploding = true;
        }
    } else {
        this.width -= this.sizeChangeVelocity;
        this.height -= this.sizeChangeVelocity;
        if (this.width <= 0) {
            // Kill doesn't opt for gc, just rmeoves it from render and update
            // cycle.
            //this.kill();
            // Destroy removes the object from the game.
            this.destroy();
        }
    }
};
// Reference to sprite shared by all Flak instances. Initialized during init.
Flak.prototype.spriteImage = null;
// Reference to game instance using flak. Initialized during init.
Flak.prototype.game = null;
// Call before using flak instances.
Flak.init = function(game) {
    // width, height, key
    var spriteImage = game.add.bitmapData(14, 14);
    spriteImage.circle(7, 7, 7, "#ff0000");
    // Seems the default background is transparent as it should be.
    //spriteImage.fill(0, 0, 0, 0);

    // try out cache for bit map data.
    game.cache.addBitmapData("flak", spriteImage);

    //this.prototype.spriteImage = spriteImage;
    this.prototype.game = game;
};



var Pig = function(position) {
    Phaser.Sprite.call(this, this.game, position.x, position.y, 'pig');
    // Center flak over pointer.
    this.anchor.setTo(0.5, 0.5);
    // For collisions.
    this.game.physics.arcade.enable(this);
    this.game.add.existing(this);
};
Pig.prototype = Object.create(Phaser.Sprite.prototype);
// Set during init, reference to game.
Pig.prototype.game = null;
Pig.init = function(game) {
    // WebGL doesn't like file:// protocol, need a server.
    game.load.image('pig', 'assets/sprites/pig.png');
    this.prototype.game = game;
};



var PigSplosion = function() {
    Phaser.Particles.Arcade.Emitter.call(this, this.game, 0, 0, 100);
    this.makeParticles(game.cache.getBitmapData("confetti"));
    this.forEach(function(p) {
        // Give each piece of confetti a random tint.
        p.tint = Phaser.Color.getRandomColor();
    });
    this.gravity = 200;
};
PigSplosion.prototype = Object.create(Phaser.Particles.Arcade.Emitter.prototype);
PigSplosion.prototype.boom = function(x, y) {
    // Position emitter to distribute particles.
    this.x = x;
    this.y = y;
    // The first parameter sets the effect to "explode" which means all particles are emitted at once
    // The second gives each particle a 2000ms lifespan
    // The third is ignored when using burst/explode mode
    // The final parameter (10) is how many particles will be emitted in this single burst
    this.start(true, 2000, null, 10);
};
// This pattern is okay, I'm sticking with it because I tried it out earlier.
// Set during init, reference to game.
PigSplosion.prototype.game = null;
// This pattern is okay, I'm sticking with it because I tried it out earlier.
PigSplosion.init = function(game) {
    game.load.audio('explosion', 'assets/sounds/explosion.wav');

    var confetti = game.add.bitmapData(10, 10, "confetti", true);
    confetti.fill(255, 255, 255, 1);

    this.prototype.game = game;
};



// Excuse to have more than one screen.
var Title = function() {};
Title.prototype = Object.create(Phaser.State);
Title.prototype.create = function() {
    this.titleText = this.game.add.text(this.game.world.centerX, this.game.world.centerY,
        "Pig In Space", {
        // These seem like canvas stylings, not CSS stylings.
        fill: "#ffffff",
		font: "bold 42px Arial",
	});
    // Anchor is how the text is centered relative to the placement point.
    this.titleText.anchor.set(0.5);

    this.game.input.onDown.add(function() {
        // console.log("click on game world");
        // This event listener gets purged when we transition to "play" state.
        game.state.start("play", true);
    }.bind(this));
};



// Play state.
var Play = function() {};
Play.prototype = Object.create(Phaser.State);
Play.prototype.preload = function() {
    // Happens before other state states. Good place to load things for this
    // state.

    // Audio has some decoding helpers. See docs.
    //this.game.load.audio('explosion', 'assets/sounds/explosion.wav');

    // Note: I feel like I'm doing something wrong. I've tried to add the
    // bitmapData to the cache, but can't seem to make the loader obey and
    // there isn't a load.bitmapdata option.
    // ---
    // create a new bitmap data object
    //this.confetti = game.add.bitmapData(10, 10, "confetti");
    // Can access canvas context wtih .ctx if needed.
    //this.confetti.fill(255, 255, 255, 1);

    // trying out the cache. when naming bitmap data, gotta set the "save in
    // cache" flag to true, otherwise naming is sort of pointless.
    // var confetti = game.add.bitmapData(10, 10, "confetti", true);
    // confetti.fill(255, 255, 255, 1);


    // Groups for watching flak.
    this.flak = this.game.add.group();
    // Some things need initialization. This isn't Phaser's fault.
    Flak.init(this.game);
    Pig.init(this.game);
    PigSplosion.init(this.game);
};
Play.prototype.create = function() {
    // To make the sprite move we need to enable Arcade Physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.timerText = this.game.add.text(32, this.game.height - 32, "-", {
        fill: "#ffffff",
		font: "bold 16px Arial",
	});

    this.hitText = this.game.add.text(this.game.width - 64, this.game.height - 32, "PIG HIT!", {
        fill: "#ffffff",
        font: "bold 16px Arial",
    });

    // Pig sprite.
    //this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'pig');
    //this.sprite.anchor.set(0.5);
    // Enable the Sprite to have a physics body:
    //this.game.physics.arcade.enable(this.sprite);
    // Version 2.
    this.pig = new Pig({
        x: this.game.world.centerX,
        y: this.game.world.centerY,
    });

    //this.emitter = game.add.emitter(0, 0, 100);
    //this.emitter.makeParticles(this.confetti);
    // try out cache.
    //this.emitter.makeParticles(game.cache.getBitmapData("confetti"));
    // A better way to add bitmap data with customer colors
    // to the emitter, or maybe just make the random colors onload... whatever.
    // this.emitter.forEach(function(p) {
    //     // Iterate each particle.
    //     p.tint = Phaser.Color.getRandomColor();
    // });
    // this.emitter.gravity = 200;

    this.pigSplosion = new PigSplosion();

    this.game.input.onDown.add(function(pointer) {
        // Can have multiple flak on the screen, keep track of them
        // for colliding with the pigs.
        this.flak.add(new Flak(pointer));
        // Play a sound along with the flak.
        game.sound.play("explosion", true);

        // use the bitmap data as the texture for the sprite
        //var confetti = game.add.sprite(this.game.input.x, this.game.input.y, this.confetti);
        //game.physics.enable(confetti, Phaser.Physics.ARCADE);
        //confetti.tint = "0xFF0000";
        // Tint seems forgiving.
        //confetti.tint = Phaser.Color.getRandomColor();
        //confetti.body.gravity.set(0, 180);

        // this.emitter.x = pointer.x;
        // this.emitter.y = pointer.y;
        //  The first parameter sets the effect to "explode" which means all particles are emitted at once
        //  The second gives each particle a 2000ms lifespan
        //  The third is ignored when using burst/explode mode
        //  The final parameter (10) is how many particles will be emitted in this single burst
        // this.emitter.start(true, 2000, null, 10);
        // Better to do this above.
        //this.emitter.forEachExists(function(p) {
            //console.log("A particle:", p);
            // WARNING: this modifies all confetti in existence.
            //p.tint = Phaser.Color.getRandomColor();
        //});

        // confetti.checkWorldBounds = true;
        // confetti.outOfBoundsKill = true;
        // Diagnostics. It works :)
        // confetti.events.onOutOfBounds.add(function() {
        //     console.log("out of bounds confetti");
        // });

    }.bind(this));
};
Play.prototype.update = function() {
    // If the sprite is > 8px away from the pointer then let's move to it
    if (this.game.physics.arcade.distanceToPointer(this.pig, this.game.input.activePointer) > 8) {
        // Make the object seek to the active pointer (mouse or touch).
        this.game.physics.arcade.moveToPointer(this.pig, 150);
    } else {
        // Otherwise turn off velocity because we're close enough to the pointer
        this.pig.body.velocity.set(0);
    }

    this.hitText.visible = false;
    // As we don't need to exchange any velocities or motion we can the 'overlap'
    // check instead of 'collide'
    // arguments to callback are swapped from input:
    // first is pig colliding with group, and second is sprite collided with
    // from flak.
    game.physics.arcade.overlap(this.flak, this.pig, function(pig) {
        this.hitText.visible = true;

        // Remove and reset the pig to another location.
        this.pigSplosion.boom(pig.x, pig.y);
        // Put the pig in one of the corners of the game and start again.
        pig.x = Phaser.Utils.chanceRoll() ? 0 : this.game.world.width;
        pig.y = Phaser.Utils.chanceRoll() ? 0 : this.game.world.height;

    }.bind(this));

    this.timerText.text = "Time: " + Date.now();
};
Play.prototype.render = function() {
    // Info about input params are positioning offset.
	//this.game.debug.inputInfo(32, 32);
    //this.game.debug.pointer();
    // Info about sprites.
    //game.debug.bodyInfo(sprite, 32, 32);
    //game.debug.body(sprite);
    // Other debug helpers.
    //-----
    // Num entities registered in the game.
    //console.log(game.world.children.length);
};



var game = new Phaser.Game(
    // String dimensions are considered percentages of parent container.
    "100", "100",
    // Let Phaser choose the renderer.
    Phaser.AUTO,
    // What element do we want to use as the parent.
    document.querySelector(".game-container")
);



game.state.add("title", Title);
game.state.add("play", Play);
game.state.start("title");
