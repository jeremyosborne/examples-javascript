/* jshint unused:true, undef:true, browser:true */
/* global Phaser:false */

// TODO:
// Collide explosion with the pig.



var Flak = function(position) {
    Phaser.Sprite.call(this, this.game, position.x, position.y, this.spriteImage);
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
Flak.prototype.maxSize = 100;
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
    var spriteImage = game.add.bitmapData(30, 30, "flak");
    spriteImage.circle(15, 15, 7, "#ff0000");
    // Seems the default babckground is transparent.
    //spriteImage.fill(0, 0, 0, 0);
    Flak.prototype.spriteImage = spriteImage;

    Flak.prototype.game = game;
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

    // WebGL doesn't like file:// protocol, need a server.
    this.game.load.image('pig', 'assets/sprites/pig.png');

    // Audio has some decoding helpers. See docs.
    this.game.load.audio('explosion', 'assets/sounds/explosion.wav');

    // Note: I feel like I'm doing something wrong. I've tried to add the
    // bitmapData to the cache, but can't seem to make the loader obey and
    // there isn't a load.bitmapdata option.
    // ---
    // create a new bitmap data object
    this.confetti = game.add.bitmapData(10, 10, "confetti");
    // Can access canvas context wtih .ctx if needed.
    this.confetti.fill(255, 255, 255, 1);

    // Flak needs to be initialized.
    Flak.init(this.game);
};
Play.prototype.create = function() {
    // To make the sprite move we need to enable Arcade Physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.timerText = this.game.add.text(32, this.game.height - 32, "-", {
        fill: "#ffffff",
		font: "bold 16px Arial",
	});

    // Pig sprite.
    this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'pig');
    this.sprite.anchor.set(0.5);

    // Enable the Sprite to have a physics body:
    this.game.physics.arcade.enable(this.sprite);

    this.emitter = game.add.emitter(0, 0, 100);
    this.emitter.makeParticles(this.confetti);
    // TODO: Need to find a better way to add bitmap data with customer colors
    // to the emitter, or maybe just make the random colors onload... whatever.
    this.emitter.forEach(function(p) {
        // Iterate each particle.
        p.tint = Phaser.Color.getRandomColor();
    });
    this.emitter.gravity = 200;

    this.game.input.onDown.add(function(pointer) {
        // Simple immediate sound play.
        game.sound.play("explosion", true);

        // use the bitmap data as the texture for the sprite
        //var confetti = game.add.sprite(this.game.input.x, this.game.input.y, this.confetti);
        //game.physics.enable(confetti, Phaser.Physics.ARCADE);
        //confetti.tint = "0xFF0000";
        // Tint seems forgiving.
        //confetti.tint = Phaser.Color.getRandomColor();
        //confetti.body.gravity.set(0, 180);

        this.emitter.x = pointer.x;
        this.emitter.y = pointer.y;
        //  The first parameter sets the effect to "explode" which means all particles are emitted at once
        //  The second gives each particle a 2000ms lifespan
        //  The third is ignored when using burst/explode mode
        //  The final parameter (10) is how many particles will be emitted in this single burst
        this.emitter.start(true, 2000, null, 10);
        // Better to do this above.
        //this.emitter.forEachExists(function(p) {
            //console.log("A particle:", p);
            // WARNING: this modifies all confetti in existence.
            //p.tint = Phaser.Color.getRandomColor();
        //});


        // Todo need to keep track of Flak.
        new Flak(pointer);

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
    if (this.game.physics.arcade.distanceToPointer(this.sprite, this.game.input.activePointer) > 8) {
        // Make the object seek to the active pointer (mouse or touch).
        this.game.physics.arcade.moveToPointer(this.sprite, 300);
    } else {
        // Otherwise turn off velocity because we're close enough to the pointer
        this.sprite.body.velocity.set(0);
    }

    this.timerText.text = "Time: " + Date.now();
};
Play.prototype.render = function() {
    // Info about input params are positioning offset.
	this.game.debug.inputInfo(32, 32);
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



// Move to multiple states.
game.state.add("play", Play);
game.state.add("title", Title);
game.state.start("title");
