/* 
	Constructor function of Boot state
 */
var Boot = function(game){

};
  
Boot.prototype = {

	preload: function(){

	},
	
  	create: function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // SHOW_ALL - scaling mode to show all contents of the game while resizing
		this.game.state.start("Preload"); // starting the next state
	}
}