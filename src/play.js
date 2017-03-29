var playState = {
  create : function(){
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
              Dotf.enemiesGroup, {
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
    // Paused
    button = Dotf.game.add.button(Dotf.game.centerX,Dotf.game.centerY,'Back',actionOnClick,this);
    function actionOnClick(){
      Dotf.game.paused = true;
    }
    Dotf.game.input.onDown.add(unpause, self);
    function unpause(event){
      if(Dotf.game.paused){
        if(event.x > 0 && event.x < Dotf.configs.GAME_WORLD_WIDTH && event.y > 0 && event.y < Dotf.configs.GAME_WORLD_HEIGHT){
          Dotf.game.paused = false;
        }
      }
    }
  },
  // update game state each frame
  update : function () {


    function onEnemyHitBase (enemySprite, BaseSprite)  {
        BaseSprite.damage(enemySprite.setDamage);
        enemySprite.dropCoin = null;
        enemySprite.kill();
    }

    // tint function will create a color filter to the sprite.
    // sprite.tint = 0xffffff will remove all tint effect.
    // TODO: tint a frame when player got damage
    function onBulletHitEnemy (playerBulletSprite, enemySprite) {
        enemySprite.tint = 0xff0000;
        setTimeout(() => {
            enemySprite.tint = 0xffffff;
        }, 100);
        enemySprite.damage(playerBulletSprite.setDamage);
        playerBulletSprite.kill();
    }

    function onPlayerPickCoin (playerSprite, coinSprite)  {
        playerSprite.coin += coinSprite.coinValue;
        coinSprite.destroy();
    }

    function onEnemyHitPlayer(enemySprite, playerSprite) {
        playerSprite.damage(enemySprite.setDamage);
        enemySprite.kill();
    }
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
        Dotf.enemiesGroup,
        Dotf.playerGroup,
        onEnemyHitPlayer
    );
  },
  Win : function (){
    Dotf.game.state.start('win');
  },
  // before camera render (mostly for debug)
   render : function (){}
};
