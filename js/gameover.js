var GameOver = function(game){};

GameOver.prototype = {

  	create: function(){

			this.game.stage.backgroundColor = '479cde';

			this.resume = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			this.showScore();
	},

	update: function () {

		if (this.resume.isDown) {
			this.restartGame();
		}

	},

	/* 
	create score text objects and Keystroke instructions on the screen
	fetching the highscore from local storage by getIten mehtod to display on gameover scene
	*/
	showScore: function () {

		var scoreFont = "60px Comic Sans MS";

		this.scoreLabel = this.game.add.text(this.game.world.centerX
			, this.game.world.centerY / 2, "0", { font: scoreFont, fill: "#fff" });
		this.scoreLabel.anchor.setTo(0.5, 0.5);
		this.scoreLabel.align = 'center';
		this.game.world.bringToTop(this.scoreLabel);
		this.scoreLabel.text = "Your score is " + (score);

		this.highScore = this.game.add.text(this.game.world.centerX
			, this.game.world.centerY, "0", { font: scoreFont, fill: "#fff" });
		this.highScore.anchor.setTo(0.5, 0.5);
		this.highScore.align = 'center';
		this.game.world.bringToTop(this.highScore);

		this.hs = window.localStorage.getItem('HighScore');

		if (this.hs == null) {
			this.highScore.setText("High score: " + score);
			window.localStorage.setItem('HighScore', score)
		}
		else if (parseInt(this.hs) < score) {
			this.highScore.setText("High score: " + (score ));
			window.localStorage.setItem('HighScore', score)

		}
		else {
			this.highScore.setText("High score: " + this.hs);
		}

		this.restart = this.game.add.text(this.game.world.centerX
			, this.game.world.centerY * 1.5
			, "Press \n Space to retry ", { font: scoreFont, fill: "#fff" });
		this.restart.anchor.setTo(0.5, 0.5);
		this.restart.align = 'center';
		this.game.world.bringToTop(this.restart);

	},

	restartGame: function(){
		this.game.state.start("Main");
	}
	
}