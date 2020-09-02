/* 
	Constructor function of Preload state
 */
var Preload = function(game){};

Preload.prototype = {

	/* 
	Preload : loads the all required assets at game initialization
	*/
	preload: function(){ 
		this.game.load.image('tile', 'assets/tile.png');
		this.game.load.image('box', 'assets/box.png');
		this.game.load.image('bullet', 'assets/bullet228.png');
		this.game.load.spritesheet('player', 'assets/dude.png', 32, 48);
		this.game.load.image('star', 'assets/star.png');
		

	},

	create: function(){
		this.game.state.start("Main"); // starting the next state 
	}
}