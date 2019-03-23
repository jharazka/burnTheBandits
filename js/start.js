class Start extends Phaser.Scene{
    constructor(){
        super({key: 'start'});
    }
    create(){
        this.text= this.add.text(0, 0, 'Kill all bandits!', {font: '40px impact'});
        this.text= this.add.text(0, 50, 'move left - arrow left', {font: '40px impact'});
        this.text= this.add.text(0, 100, 'move right - arrow right', {font: '40px impact'});
        this.text= this.add.text(0, 150, 'jump - arrow up', {font: '40px impact'});
        this.text= this.add.text(0, 200, 'shoot fireball - spacebar', {font: '40px impact'});
        const button= this.add.text(400, 350, 'Play', {font: '40px impact', fill: 'blue'});
        button.setInteractive();
        button.on('pointerdown', () => {this.scene.start('game');});
    }
}