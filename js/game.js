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
    key: 'game',
    preload: preload,
    create: create,
    update: update,
  }
};

const game = new Phaser.Game(config);
let player;
let map;
let layer;
let fireballTime= 0;
let fireballs;
let bandits;
let knives;


class Enemy {
  constructor(x, y){
      this.x= x;
      this.y= y;
      this.knifeTime = 0;
      this.strength= Math.floor(Math.random() * (60 - 30)) + 30;
  }
  make(what){
    this.sprite= what.physics.add.sprite(this.x, this.y, 'enemy');
    bandits.add(this.sprite);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.burn= false;
  }
  collide(what){
    // const killPlayer= () => {
    //   if (this.fall !== true && this.sprite.burn !== true){
    //     what.scene.start('main');
    //   }
    // };
    what.physics.add.collider(layer, this.sprite);
    what.physics.add.collider(player, this.sprite);
  }
  move(what) {
    if (this.sprite.burn !== true) {
    if (this.sprite.body.blocked.right) {
      this.sprite.flipX = true;
    }
    if (this.sprite.body.blocked.left) {
      this.sprite.flipX = false;
    }

    if (player.body.touching.down && this.sprite.body.touching.up && this.fall !== true) {
      this.sprite.body.setVelocity(0);
      this.sprite.body.reset(this.sprite.body.x, this.sprite.body.y + 60);
      this.sprite.body.setSize(66, 17);
      this.sprite.body.setOffset(0, 8);
      this.fall = true;
      setTimeout(() => {
        if (this.sprite && this.sprite.body) {
          this.fall = false;
          this.sprite.body.reset(this.sprite.body.x, this.sprite.body.y);
          this.sprite.body.setSize(66, 44);
          this.sprite.body.setOffset(0, 20);
        }
      }, 3000);
    } else if (this.fall === true) {
        this.sprite.anims.play('fall', false);
    } else {
        this.sprite.body.setVelocityX(100 * (this.sprite.flipX ? -1 : 1));
        this.sprite.anims.play('enemyWalk', true);

        if (what.time.now > this.knifeTime) {
          const knife = what.physics.add.sprite(this.sprite.x, this.sprite.y, 'knife');
          knife.setCollideWorldBounds(true);
          knives.add(knife);
          this.sprite.flipX ? knife.flipX = true : knife.flipX = false;
          knife.body.setVelocityX(300 * (this.sprite.flipX ? -1 : 1));
          knife.anims.play('knife', true);
          knife.body.gravity.y = -350 - this.strength;
          this.knifeTime = what.time.now + Math.floor(Math.random() * (3500 - 1500)) + 1500;
    }
    }
  } else{
      this.sprite.body.setVelocity(0);
      this.sprite.anims.play('burn', true);
    }
  }
}
class EnemyOnPlatform extends Enemy{
  constructor(x, y, blockLeft, blockRight){
    super(x, y);
    this.left= blockLeft;
    this.right= blockRight;
  }
  move(what){
      if (this.sprite.body) {
        if (this.sprite.x > this.right) {
          this.sprite.flipX = true;
        }
        if (this.sprite.x < this.left) {
          this.sprite.flipX = false;
        }
        super.move(what)
      }
  }
}

  const bandit= new EnemyOnPlatform(740, 550);
  const villian= new EnemyOnPlatform(210, 260, 173, 442);
  const ziomek= new EnemyOnPlatform (460, 320, 455, 702);
  const badguy= new EnemyOnPlatform(560, 20, 551,728);
  const joker= new EnemyOnPlatform(1320, 260, 1317, 1404);
  const bane= new EnemyOnPlatform(2021, 100,2019, 2333);
  const thanos= new EnemyOnPlatform(2381, 300, 2379, 2932);
  const tracz= new EnemyOnPlatform(3448, 250, 3446, 3672);
  const osama= new EnemyOnPlatform(4142, 300, 4140, 4406);
  const obama= new EnemyOnPlatform(4200, 550);


function preload() {
  this.load.image('tiles', 'assets/tilemap.png');
  this.load.tilemapTiledJSON('map', 'assets/newmap.json');
  this.load.atlas('player', 'assets/firen.png', 'assets/firen_atlas1.json');
  this.load.atlas('enemy', 'assets/bandit.png', 'assets/bandit_atlas.json');
  this.load.atlas('fireball', 'assets/fireball.png', 'assets/fireball_atlas.json');
  this.load.atlas('explosion', 'assets/explosion.png', 'assets/explosion_atlas.json');
  this.load.atlas('shooter', 'assets/shot.png', 'assets/shot_atlas.json');
  this.load.atlas('fall', 'assets/fall.png', 'assets/fall_atlas.json');
  this.load.atlas('burn', 'assets/burn.png', 'assets/burn_atlas.json');
  this.load.atlas('knife', 'assets/knife.png', 'assets/knife_atlas.json');
}

function create() {
    map= this.make.tilemap({key: 'map'});
    const tileset= map.addTilesetImage('tileset', 'tiles');
    layer= map.createDynamicLayer('world', tileset, 0, 0);
    layer.setCollisionByExclusion([-1]);
    this.physics.world.bounds.width = layer.width;
    this.physics.world.bounds.height = layer.height;

    player= this.physics.add.sprite(30, 560, 'player');
    player.setCollideWorldBounds(true);
    fireballs= this.add.group();
    bandits= this.add.group();
    knives= this.add.group();
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('player', { prefix: 'firen', start: 1, end: 7}),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames('player', { prefix: 'firen', start: 0, end: 0}),
      frameRate: 10,
    });
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNames('player', {prefix: 'firen', start: 8, end: 8}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'enemyWalk',
      frames: this.anims.generateFrameNames('enemy', {prefix: 'bandit', start: 1, end: 7}),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key:'fireball',
      frames: this.anims.generateFrameNames('fireball', {prefix: 'fireball', start: 1, end: 5}),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: 'explosion',
      frames: this.anims.generateFrameNames('explosion', {prefix: 'explosion', start: 0, end: 3}),
      frameRate: 10,
    });
    this.anims.create({
      key: 'shot',
      frames: this.anims.generateFrameNames('shooter', {prefix: 'shot', start: 0, end: 1}),
      frameRate: 5,
    });
    this.anims.create({
      key: 'fall',
      frames: this.anims.generateFrameNames('fall', {prefix: 'fall'}),
    });
    this.anims.create({
      key: 'burn',
      frames: this.anims.generateFrameNames('burn', {prefix: 'burn', start: 0, end: 3}),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: 'knife',
      frames: this.anims.generateFrameNames('knife', {prefix: 'knife', start: 0, end: 15}),
      frameRate: 20,
      repeat: -1
    });

     bandit.make(this);
     villian.make(this);
     ziomek.make(this);
     badguy.make(this);
     joker.make(this);
     bane.make(this);
     thanos.make(this);
     tracz.make(this);
     osama.make(this);
     obama.make(this);

    this.physics.add.collider(layer, player);
     bandit.collide(this);
     villian.collide(this);
     ziomek.collide(this);
     badguy.collide(this);
     joker.collide(this);
     bane.collide(this);
     thanos.collide(this);
     tracz.collide(this);
     osama.collide(this);
     obama.collide(this);

  const banditsFireballs=  (bandit, fireball) => {
    bandit.burn = true;
    setTimeout(() => {
      if (bandit) {
        bandit.destroy();
      }
    }, 700);
    fireball.anims.play('explosion', true);
    setTimeout(() => {
      if(fireball) {
        fireball.destroy();
      }
    }, 450);
  };
  const layerFireballs= (fireball) => {

    fireball.anims.play('explosion', true);
    setTimeout(() => {
      if (fireball){
        fireball.destroy();
      }
    },450);
  };
  const knivesFireballs= (knife, fireball) => {
    knife.destroy();
    fireball.anims.play('explosion', true);
    setTimeout(() => {
      if (fireball) {
        fireball.destroy();
      }
    }, 450);
  };
  const layerKnives= (knife) => {
      knife.destroy();
  };
  const knivesPlayer= (knife, player) => {
      knife.destroy();
    this.scene.start('game');
  };

    this.physics.add.collider(bandits, fireballs, banditsFireballs);
    this.physics.add.collider(layer, fireballs, layerFireballs);
    this.physics.add.collider(layer, knives, layerKnives);
    this.physics.add.collider(knives, fireballs, knivesFireballs);
    this.physics.add.collider(knives, player, knivesPlayer);


}

function update() {
  const cursors= this.input.keyboard.createCursorKeys();
  if (cursors.left.isDown) {
    player.body.setVelocityX(-200);
    player.flipX = true;
    if (player.body.onFloor()) {
      player.anims.play('walk', true);
    }
  }
  else if (cursors.right.isDown) {
    player.body.setVelocityX(200);
    player.flipX = false;
    if (player.body.onFloor()) {
    player.anims.play('walk', true);
  }
  }
  else{
    player.body.setVelocityX(0);
    if (player.body.onFloor()){
      player.anims.play('idle', true);
    }
  }
  if (cursors.up.isDown) {
    player.anims.play('jump', true);
    if (player.body.onFloor()) {
      player.body.setVelocityY(-400);
    }
  }

  if(cursors.space.isDown) {
      player.anims.play('shot', true);
      if (this.time.now > fireballTime) {
        const fireball = this.physics.add.sprite(player.x, player.y + 10, 'fireball');

        fireball.setCollideWorldBounds(true);
        fireballs.add(fireball);
        player.flipX ? fireball.flipX= true : fireball.flipX= false;
        fireball.body.setVelocityX(500 * (player.flipX ? -1 : 1));
        fireball.anims.play('fireball', true);
        fireballTime= this.time.now +400;
        fireball.body.gravity.y= -500;
      }
  }
   bandit.move(this);
   villian.move(this);
   ziomek.move(this);
   badguy.move(this);
   joker.move(this);
   bane.move(this);
   thanos.move(this);
   tracz.move(this);
   osama.move(this);
   obama.move(this);
}

