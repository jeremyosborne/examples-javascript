/* jshint unused:true, undef:true, browser:true */
/* global Phaser:false */

// TODO:
// Make a piece of confetti with graphics.
// Collide the expanding and contracing explosion with the pig.
// Make confetti particle and emitters.
// Make expanding/contracting explosion. (Graphics plus tween).


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

        fill: "#ffffff",
		font: "bold 42px Arial",
	});
    // Anchor is how the text is centered over the placement point.
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

    // create a new bitmap data object
    this.confetti = game.add.bitmapData(10, 10, "confetti");
    // Can access canvas context wtih .ctx if needed.
    this.confetti.fill(255, 255, 255, 1);
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

    this.game.input.onDown.add(function() {
        // Simple immediate sound play.
        game.sound.play("explosion", true);

        // use the bitmap data as the texture for the sprite
        var confetti = game.add.sprite(this.game.input.x, this.game.input.y, this.confetti);
        //confetti.tint = "0xFF0000";
        // Docs are simple sounding, but tint seems forgiving.
        confetti.tint = Phaser.Color.getRandomColor();

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
	this.game.debug.inputInfo(32, 32);
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
