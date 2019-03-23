const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
        },
    },
    scene: {
        //key: 'start',
        preload: preload,
        create: create,
        update: update,
    }
};