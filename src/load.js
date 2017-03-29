var loadState = {
  preload : function () {
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
    // <ANIMATION>
    Dotf.game.load.spritesheet('character1_animation', 'Assets/spritesheet/character1.png', 16, 21);
    Dotf.game.load.spritesheet('flaming_gun_animation', 'Assets/guns/flamthrower/flaming_gun.png', 21, 16);
    // <ENEMY>
    Dotf.game.load.spritesheet('enemy', 'Assets/monster/slime1_front.png', 16, 16);
    Dotf.game.load.spritesheet('catscratch', 'Assets/other/catscratch.png', 18, 18);
    // Others
    Dotf.game.load.spritesheet('coin', 'Assets/other/coin2.png', 16, 16);
    Dotf.game.load.spritesheet('shockwave', 'Assets/other/shockwave.png', 80, 80);
    //State image
    Dotf.game.load.image('StartGame','Assets/State/StartGame.png',16,16);
    Dotf.game.load.image('Back','Assets/State/Back.png',16,16);
    Dotf.game.load.image('pause','Assets/State/challenger.png',16,16);

  },
  create : function (){
    Dotf.game.state.start('menu');
  }
  };
