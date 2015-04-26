/* jshint unused:true, undef:true, browser:true */
/* global Phaser:false */

// TODO:
// Make expanding/contracting explosion. (Graphics plus tween).
// Collide explosion with the pig.
// Make the emitter emit random colored confetti.



var Flak = function(game, position) {
    //  We call the Phaser.Sprite passing in the game reference
    //  We're giving it a random X/Y position here, just for the sake of this demo - you could also pass the x/y in the constructor
    Phaser.Sprite.call(this, game, position.x, position.y, this.spriteImage);
    this.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this);
    game.add.existing(this);
};
Flak.prototype = Object.create(Phaser.Sprite.prototype);
// Expanding outward unless this is true.
Flak.prototype.imploding = false;
// Pixels per frame.
Flak.prototype.sizeChangeVelocity = 20;
// How many pixels big before we implode.
// TODO: Look into how phaser handles scaling. Scaling seems off on my high rez screen.
Flak.prototype.maxSize = 600;
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
// Call before using flak instances.
Flak.init = function(game) {
    var spriteImage = game.add.bitmapData(30, 30, "flak");
    spriteImage.circle(15, 15, 1, "#ff0000");
    spriteImage.fill(0, 0, 0, 0);
    Flak.prototype.spriteImage = spriteImage;
};



var Title = function() {};
Title.prototype = Object.create(Phaser.State);
Title.prototype.preload = function() {
    // Load all items for this game. In other games, might want to load
    // state specific items in respective stages.

    // WebGL doesn't like file:// protocol, need a server.
    this.game.load.image('pig', 'assets/sprites/pig.png');

    // Audio has some decoding helpers. See docs.
    this.game.load.audio('explosion', 'assets/sounds/explosion.wav');
};
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

    // And enable the Sprite to have a physics body:
    this.game.physics.arcade.enable(this.sprite);

    this.emitter = game.add.emitter(0, 0, 100);
    this.emitter.makeParticles(this.confetti);
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

        // Todo need to keep track of Flak.
        new Flak(game, pointer);

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
