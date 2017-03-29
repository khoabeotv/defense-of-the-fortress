var menuState =  {
  create : function (){
    var button1 = Dotf.game.add.button(Dotf.game.world.CenterX,400,'StartGame',actionOnClick,this,2,1,0);
    function actionOnClick() {
      Dotf.game.state.start('play');
    }
  }
};
