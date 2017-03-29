var Dotf = Dotf || {};

Dotf.configs = {
    GAME_WIDTH_MAX: 1366,
    GAME_HEIGHT_MAX: 768,
    GAME_WIDTH_MIN: 320,
    GAME_HEIGHT_MIN: 480,
    GAME_WORLD_WIDTH: 2960,
    GAME_WORLD_HEIGHT: 2160,
    gun: {
        bulletSpeed: 1000
        // TODO add types of gun
    },
    player: {
        speed: 200
    },
    enemy: {
        position: {
            x: Math.floor(Math.random() * 2960) + 1,
            y: Math.floor(Math.random() * 2160) + 1
            // reference GAME_WIDTH_MAX, GAME_HEIGHT_MAX
        }
    }
};

window.onload = function() {
    Dotf.game = new Phaser.Game(Dotf.configs.GAME_WIDTH_MAX, Dotf.configs.GAME_HEIGHT_MAX, Phaser.CANVAS, '');
    //State
    Dotf.game.state.add('boot',bootState);
    Dotf.game.state.add('load',loadState);
    Dotf.game.state.add('menu',menuState);
    Dotf.game.state.add('play',playState);
    Dotf.game.state.add('win',winState);
    Dotf.game.state.start('boot');
};

// preparations before game starts
const preload = () => {
    Dotf.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    Dotf.game.scale.pageAlignHorizontally = true;
    Dotf.game.scale.pageAlignVertically = true;
    Dotf.game.scale.setScreenSize = true;
    // TODO fix responsive
    Dotf.game.time.advancedTiming = true;
    // Dotf.game.load.atlasJSONHash('assets', 'Assets/assets.png', 'Assets/assets.json');
    Dotf.game.load.image('background', 'Assets/maps/map1.png');
    // <CURSOR>
    Dotf.game.load.image('bulleta_cursor1', 'Assets/cursors/1crosshair.png');
    Dotf.game.load.image('bulleta_cursor2', 'Assets/cursors/1crosshair2.png');
    Dotf.game.load.image('default', 'Assets/cursors/mouse_pointer.png');
    //TODO create a spritesheet including all animations of an object.
    // <GUN TYPE>
    Dotf.game.load.image('gun', 'Assets/guns/flamthrower/flamethrower_down.png');
    // <CONTRUCTIONS>
    Dotf.game.load.image('fountain', 'Assets/other/base.png');
    Dotf.game.load.image('healthBar', 'Assets/other/healthBar.png');
    Dotf.game.load.image('healthBarBG', 'Assets/other/healthbarBG.png');
    // <BULLET TYPE>
    Dotf.game.load.image('bulleta', 'Assets/other/bulleta.png', 32, 32);
    Dotf.game.load.image('bulletc', 'Assets/other/bulletc.png', 11, 8);
    Dotf.game.load.image('cannonball', 'Assets/other/cannonball.png', 16, 16);
    // <ANIMATION>
    Dotf.game.load.spritesheet('character1_animation', 'Assets/spritesheet/character1.png', 16, 21);
    Dotf.game.load.spritesheet('flaming_gun_animation', 'Assets/guns/flamthrower/flaming_gun.png', 21, 16);
    // <ENEMY>
    Dotf.game.load.spritesheet('enemy', 'Assets/monster/slime1_front.png', 16, 16);
    Dotf.game.load.spritesheet('catscratch', 'Assets/other/catscratch.png', 18, 18);
    Dotf.game.load.spritesheet('enemyshoot', 'Assets/monster/slime_explode.png', 34, 34);
    // Others
    Dotf.game.load.spritesheet('coin', 'Assets/other/coin2.png', 16, 16);
    Dotf.game.load.spritesheet('shockwave', 'Assets/other/shockwave.png', 80, 80);

};

// initialize the game
const create = () => {

    Dotf.game.physics.startSystem(Phaser.Physics.ARCADE);
    Dotf.keyboard = Dotf.game.input.keyboard;
    Dotf.game.input.mouse.capture = true;
    Dotf.game.world.setBounds(0, 0, Dotf.configs.GAME_WORLD_WIDTH, Dotf.configs.GAME_WORLD_HEIGHT);

    Dotf.background1 = Dotf.game.add.tileSprite(0, 0, Dotf.configs.GAME_WORLD_WIDTH, Dotf.configs.GAME_WORLD_HEIGHT, 'background');
    Dotf.background1.scale.setTo(2);

    // physic Groups
    Dotf.constructionsGroup = Dotf.game.add.physicsGroup();
    Dotf.healthBarGroup = Dotf.game.add.physicsGroup();
    Dotf.playerBulletGroup = Dotf.game.add.physicsGroup();
    Dotf.playerGroup = Dotf.game.add.physicsGroup();
    Dotf.gunGroup = Dotf.game.add.physicsGroup();
    Dotf.enemiesGroup = Dotf.game.add.physicsGroup();
    Dotf.chasingEnemyGroup = Dotf.game.add.physicsGroup();
    Dotf.coinGroup = Dotf.game.add.physicsGroup();

    Dotf.playerBulletGroup.setAll('outOfBoundsKill', true);
    Dotf.playerBulletGroup.setAll('checkWorldBounds', true);

    Dotf.greenEnemies = [];
    Dotf.coins = [];
    Dotf.explosions = [];
    Dotf.constructions = [];
    // TODO Just the gun is actived can change the cursor
    Dotf.gunIsEquiped = [];
    Dotf.base = new BaseController(1880, 500, {});

    Dotf.player = new PlayerController(Dotf.playerGroup, 'character1_animation', {
        up: Phaser.Keyboard.W,
        down: Phaser.Keyboard.S,
        left: Phaser.Keyboard.A,
        right: Phaser.Keyboard.D,
        speed: Dotf.configs.player.speed
    });

    Dotf.playerHealth = Dotf.game.add.text(50, 20, `Health: ${ Dotf.player.sprite.health }`, { font: '24px Arial', fill: '#fff' });
    Dotf.playerHealth.fixedToCamera = true;
    Dotf.playerCoin = Dotf.game.add.text(200, 20, `Coin: ${ Dotf.player.sprite.coin }`, { font: '24px Arial', fill: '#fff' });
    Dotf.playerCoin.fixedToCamera = true;
    Dotf.baseHealth = Dotf.game.add.text(320, 20, `Base Health: ${ Dotf.base.sprite.heath }`, { font: '24px Arial', fill: '#fff' });
    Dotf.baseHealth.fixedToCamera = true;

    setInterval(function() {
        if (Math.random() > 0.5) {
          new EnemyChasePlayerController({
                  x: Math.floor(Math.random() * 2960) + 1,
                  y: Math.floor(Math.random() * 2160) + 1
                  // reference GAME_WIDTH_MAX, GAME_HEIGHT_MAX
              },
              Dotf.chasingEnemyGroup, {
                  speed: 200,
                  coinDroppingRate: 0.7
              });
        } else {
          new EnemyController({
                  x: Math.floor(Math.random() * 2960) + 1,
                  y: Math.floor(Math.random() * 2160) + 1
                  // reference GAME_WIDTH_MAX, GAME_HEIGHT_MAX
              },
              'enemy',
              Dotf.enemiesGroup, {
                  speed: 200,
                  coinDroppingRate: 0.7
              });
        }
    }, 2000);

}

var onEnemyHitBase = (enemySprite, BaseSprite) => {
    BaseSprite.damage(enemySprite.setDamage);
    enemySprite.dropCoin = null;
    enemySprite.kill();
}

// tint function will create a color filter to the sprite.
// sprite.tint = 0xffffff will remove all tint effect.
// TODO: tint a frame when player got damage
var onBulletHitEnemy = (playerBulletSprite, enemySprite) => {
    enemySprite.tint = 0xff0000;
    setTimeout(() => {
        enemySprite.tint = 0xffffff;
    }, 100);
    enemySprite.damage(playerBulletSprite.setDamage);
    playerBulletSprite.kill();
}

var onPlayerPickCoin = (playerSprite, coinSprite) => {
    playerSprite.coin += coinSprite.coinValue;
    coinSprite.destroy();
}

var onEnemyHitPlayer = (enemySprite, playerSprite) => {
    playerSprite.damage(enemySprite.setDamage);
    enemySprite.kill();
}

// update game state each frame
const update = () => {
    Dotf.playerHealth.setText(`Health: ${ Dotf.player.sprite.health }`);
    Dotf.baseHealth.setText(`Base Health: ${ Dotf.base.sprite.health }`);
    Dotf.playerCoin.setText(`Coin: ${ Dotf.player.sprite.coin }`);
    Dotf.player.update();
    Dotf.base.update();

    Dotf.constructions.forEach(construction => construction.update());
    Dotf.coins.forEach(coin => coin.update());
    Dotf.greenEnemies.forEach(enemy => enemy.update());
    Dotf.explosions.forEach(explosion => explosion.update());

    Dotf.game.physics.arcade.overlap(
        Dotf.enemiesGroup,
        Dotf.constructionsGroup,
        onEnemyHitBase
    );

    Dotf.game.physics.arcade.overlap(
        Dotf.playerBulletGroup,
        Dotf.enemiesGroup,
        onBulletHitEnemy
    );

    Dotf.game.physics.arcade.overlap(
        Dotf.playerGroup,
        Dotf.coinGroup,
        onPlayerPickCoin
    );

    Dotf.game.physics.arcade.overlap(
        Dotf.chasingEnemyGroup,
        Dotf.playerGroup,
        onEnemyHitPlayer
    );

    Dotf.game.physics.arcade.overlap(
        Dotf.playerBulletGroup,
        Dotf.chasingEnemyGroup,
        onBulletHitEnemy
    );

};

// before camera render (mostly for debug)
const render = () => {};
