var winState = {
  create : function(){
    var winLabel = Dotf.game.add.text(80,80,
                                      'YOU WIN',
                                      {font : '50px Arial',fill: '#00FF00' });
    var startLabel = Dotf.game.add.text(80,Dotf.game.height-80,
                                      'press the W key to restart ',
                                      {font : '50px Arial',fill:'#00FF00'});
    var key = Dotf.game.input.keyboard.addKey(phaser.keyboard.W);
    key.onDown.addOnce(this.restart,this);
  },
  restart : function (){
    Dotf.game.state.start('menu');
  }
};
