var bootState ={
  create : function(){
    Dotf.game.physics.startSystem(Phaser.Physics.ARCADE);
    Dotf.game.state.start('load');
  }
};
