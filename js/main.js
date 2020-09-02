/* 
	Constructor function of Main state
 */
var Main = function(game){

};

var score = 0; // initialy the the score will be 0

Main.prototype = {

	create: function() {

		this.groundVelocity = -450; // for creating the endless screen or parallax effect 
		this.rate = 1500;
		score = 0;

		/* 
		assets are stored in cache to extract them we use getImage property
		*/
		this.groundWidth = this.game.cache.getImage('tile').width;
		this.groundHeight = this.game.cache.getImage('tile').height;
		this.obstacleHeight = this.game.cache.getImage('box').height;

		this.game.stage.backgroundColor = '88bfea';


		/* 
		Phaser Physics : Arcade
		Arcade : Game Physics related to collision, overlap and motion methods.
		*/
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		/* 
		Creating a group of tiles to make the ground
		Public Method : createMultiple - to create multiple object and add them to the group
		*/
		this.ground = this.game.add.group();
		this.ground.enableBody = true;
		this.ground.createMultiple(Math.ceil(this.game.world.width / this.groundWidth), 'tile');

		/* 
		Creating a group of tiles to make the ground
		Public Method : createMultiple - to create multiple object and add them to the group
		*/
		this.boxes = this.game.add.group();
		this.boxes.enableBody = true;
		this.boxes.createMultiple(5, 'box');
		this.game.world.bringToTop(this.ground);

		this.addBase();
		this.createScore();
		this.createPlayer();

		this.createWeapon();
		

		/* 
		enabling the keybord input
		*/
		this.keySroke = this.game.input.keyboard.createCursorKeys();
		this.fireButton = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

		/* 
		Creating time loop for obstacles and incrementing the score
		*/
		this.timer = game.time.events.loop(this.rate, this.addObstacles, this);
		this.Scoretimer = game.time.events.loop(100, this.incrementScore, this);
	

		/* 
		creating stars to activate weapon
		*/
		this.stars = this.game.add.group();

		//  We will enable physics for any star that is created in this group
		this.stars.enableBody = true;
	
		for (var i = 1; i < 5; i++)
		{
			
			var star = this.stars.create(i * 3700, ((this.game.world.height - this.groundHeight) - 50) , 'star');
	
			star.body.velocity.x = this.groundVelocity;
		}


	},
	

	update: function() {

		/* 
		Physics Arcade
		Public Method : Collide -  to detect collision of two objects 
		parameter1 : object 1
		parameter2 : object 2
		parameter3 : collision callback (optional)
		parameter4 : process CollisionCallback- to perform additional checks on collision (optional)
		parameter5 : callback context (optional)
		*/
		this.game.physics.arcade.collide(this.player, this.ground);
		this.game.physics.arcade.collide(this.stars, this.ground);
		this.game.physics.arcade.collide(this.stars, this.player , this.weaponReady,null ,this);

		
		this.game.physics.arcade.collide(this.boxes.children[0], this.weapon.bullets, this.collisionHandler,null,this);
		this.game.physics.arcade.collide(this.boxes.children[1], this.weapon.bullets, this.collisionHandler1,null,this);
		
		this.game.physics.arcade.collide(this.player, this.boxes, this.gameOver, null, this);


		if (this.fireButton.isDown && this.go === true)
		{
			this.weapon.fire();
		}

		if (this.keySroke.up.isDown && this.player.body.touching.down)
		{
			this.player.body.velocity.y = -800;
		}
			
	},

	weaponReady : function() {
		this.stars.kill();
		this.go =true;
		//this.collisionHandler();
		//this.collisionHandler1();

	},

	/* 
	Collision handler : kill the bullets and box after collision
	*/
	collisionHandler : function (bullets,box){
		this.weapon.bullets.children[0].kill();
		this.boxes.children[0].kill();
	   },
	collisionHandler1 : function (bullets,box){
		this.weapon.bullets.children[0].kill();
		this.boxes.children[1].kill();
	   },

	addBox: function (x, y) {

		var newBox = this.boxes.getFirstDead();

		newBox.reset(x, y);
		newBox.body.velocity.x = this.groundVelocity;
		newBox.body.immovable = true;
		newBox.checkWorldBounds = true;
		newBox.outOfBoundsKill = true;
	},


	/* 
	Create Weapon 
	*/
	createWeapon: function (){
		this.weapon = this.game.add.weapon(1, 'bullet');
		this.game.physics.arcade.enable(this.weapon);
	
		this.weapon.bulletKillDistance = 200;
		this.weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
		this.weapon.fireAngle = 0;
		this.weapon.bulletSpeed = 400;
		this.weapon.trackSprite(this.player, 0, -30);
		this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		
	},

	/* 
	adding obstacles in the game
	*/
	addObstacles: function () {
		var tilesNeeded = 1 ;

		for (var i = 0; i < tilesNeeded; i++) {

			this.addBox(this.game.world.width , this.game.world.height -
				this.groundHeight - ((i + 1) * this.obstacleHeight ));

		}
	},

	addTile: function (x, y) {

		var tile = this.ground.getFirstDead();

		tile.reset(x, y);
		tile.body.immovable = true;
		tile.checkWorldBounds = true;
		tile.outOfBoundsKill = true;
	},

	addBase: function () {
		var tilesNeeded = Math.ceil(this.game.world.width / this.groundWidth);
		var y = (this.game.world.height - this.groundHeight);
		for (var i = 0; i < tilesNeeded; i++) {
			this.addTile(i * this.groundWidth, y);
		}
	},

	/* 
	create player add physics to the player for jumping and enabling gravity
	*/
	createPlayer: function () {

		this.player = this.game.add.sprite(this.game.world.width/5, this.game.world.height -
			(this.groundHeight*2), 'player');
		this.player.scale.setTo(4, 4);
		this.player.anchor.setTo(0.5, 1.0);
		this.game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = 2000;
		this.player.body.collideWorldBounds = true;
		this.player.body.bounce.y = 0.1;
		this.player.body.drag.x = 150;
		var walk = this.player.animations.add('walk', [5, 6, 7, 8]);
		this.player.animations.play('walk', 10, true);

	},

	/* 
	create score text objects and Keystroke instructions on the screen
	fetching the highscore from local storage by getIten mehtod
	*/
	createScore: function () {

		var scoreFont = "70px Comic Sans MS";
		var modalHeader = "20px Comic Sans MS";

		this.jumpText = this.game.add.text(this.game.world.centerX - 100, 200, "Press Up Key To Jump", { font: modalHeader, fill: "#EC33FF" });
		this.shootText = this.game.add.text(this.game.world.centerX -100, 250, "Press Spacebar To Shoot Bullets", { font: modalHeader, fill: "#EC33FF" });

		this.jumpText.alpha =0;
		this.shootText.alpha =0;

		/* 
		adding text on the middle of the screen to maintain the player's focus on the game screen
		*/
		this.game.add.tween(this.jumpText).to({alpha: 1},2000,Phaser.Easing.Linear.None,true,0,2000,true);
		this.game.add.tween(this.shootText).to({alpha: 1},2000,Phaser.Easing.Linear.None,true,0,2000,true);

		this.scoreLabel = this.game.add.text(this.game.world.centerX, 70, "0", { font: scoreFont, fill: "#fff" });
		this.scoreLabel.anchor.setTo(0.5, 0.5);
		this.scoreLabel.align = 'center';
		this.game.world.bringToTop(this.scoreLabel);

		this.highScore = this.game.add.text(this.game.world.centerX * 1.6, 70, "0", { font: scoreFont, fill: "#fff" });
		this.highScore.anchor.setTo(0.5, 0.5);
		this.highScore.align = 'right';
		this.game.world.bringToTop(this.highScore);

		if (window.localStorage.getItem('HighScore') == null) {
			this.highScore.setText(0);
			window.localStorage.setItem('HighScore', 0);
		}
		else {
			this.highScore.setText(window.localStorage.getItem('HighScore'));
		}

	},

	incrementScore: function () {
		score += 1;
		this.scoreLabel.setText(score);
		this.game.world.bringToTop(this.scoreLabel);
		this.highScore.setText("HS: " + window.localStorage.getItem('HighScore'));
		this.game.world.bringToTop(this.highScore);


	},

	gameOver: function(){
		this.game.state.start('GameOver');
	}

};
