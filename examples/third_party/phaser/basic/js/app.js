/* jshint unused:true, undef:true, browser:true */
/* global Phaser:false */

var preload = function() {
    // You can fill the preloader with as many assets as your game requires

    // Here we are loading an image. The first parameter is the unique
    // string by which we'll identify the image later in our code.
    // The second parameter is the URL of the image (relative)
    // WebGL doesn't like file:// protocol, need a server.
    game.load.image('pig', 'assets/sprites/pig.png');
};

var sprite;
var create = function() {
    // To make the sprite move we need to enable Arcade Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'pig');
    sprite.anchor.set(0.5);

    // And enable the Sprite to have a physics body:
    game.physics.arcade.enable(sprite);
};

var update = function() {
    // If the sprite is > 8px away from the pointer then let's move to it
    if (game.physics.arcade.distanceToPointer(sprite, game.input.activePointer) > 8) {
        // Make the object seek to the active pointer (mouse or touch).
        game.physics.arcade.moveToPointer(sprite, 300);
    } else {
        // Otherwise turn off velocity because we're close enough to the pointer
        sprite.body.velocity.set(0);
    }
};

var render = function() {
	game.debug.inputInfo(32, 32);
};


var game = new Phaser.Game(
    // String dimensions are considered percentages of parent container.
    "100", "100",
    // Let Phaser choose the renderer.
    Phaser.AUTO,
    // What element do we want to use as the parent.
    document.querySelector(".game-container"),
    // State callbacks.
    {
        preload: preload,
        create: create,
        update: update,
        render: render,
    }
);
