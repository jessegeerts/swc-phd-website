//window.addEventListener("load",onWindowLoad,false);

var data = [];
//var jsonString = JSON.stringify(data);

//document.getElementById("userNameButton").addEventListener("click", getUserName);

document.getElementById("startButton").addEventListener("click", startGame);

function startGame(){
	canvasApp();
}

//function getUserName() { 
//	var nameElement = document.getElementById("userNameInput")
//	var userName = nameElement.value;
//    //document.getElementById("someDiv").innerHTML += userName;
//	return userName
//	console.log(userName);
//}

//

function canvasApp(){
	
	// get username
	var nameElement = document.getElementById("userNameInput")
	var userName = nameElement.value;
	
	// get canvas object:
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	
	// game number tracker
	var gameCounter = 0;
	var blockCounter = 0;
	
	// gravity settings
	var inverseGravitymode = false;
	
	var gravity = 0.8;
	
	var friction = 0.01;

	
	// define the ball or brain variable:
	var brain = new Image();
	brain.scr = "brainplayer.png";
	var ballColor = "rgba(200,0,0,0)";
	var ball = {radius:30, x:c.width/6, y:c.height/2, color:ballColor, angle:0, speed:0, vx:0, vy:0, elasticity:0.5};

	var gameOn = false;
	var firstTry = true;

	menuForm = document.getElementById("pauseButton");
	menuForm.addEventListener("click", onPause, false);
	
	// jump function:
	c.addEventListener("mousedown", jump);
	
	function jump(){
		if(!inverseGravitymode){
			ball.vy -= 10;
		}
		if(inverseGravitymode){
			ball.vy += 10;
		}
	}
	
	// define and initialise obstacle variable: 
	var obstaclesA = {}; 
	var obstaclesB = {}; 
	var nObstacles = 6;
	var minObstacleDistance = 200;
	var minGapSize = 5*ball.radius;
	var obstacleColor = "rgba(0,0,200,0.9)";
	
	for (var i = 0; i < nObstacles; i++){
		var xoff = Math.random()*100;
		var xvalue = c.width/2 + 400 *i + Math.random()*100;
		var ob1height = Math.random()*400;
		var gapsz = minGapSize + Math.random()*400;
		obstaclesA[i] = {x:xvalue + xoff, y: 0, width: 100, height: ob1height, color:obstacleColor};
		var ob2height = c.height - ob1height - gapsz;
		obstaclesB[i] = {x:xvalue + xoff, y: c.height-ob2height, width: 100, height:ob2height, color:obstacleColor};		
	}
		
	// initialise point count:
	var points = 0;
	
	gameLoop();
	
	function drawStartScreen(){
		ctx.clearRect(0,0, c.width, c.height);

		ctx.font = "30px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "Black";
		ctx.fillText("Welcome to Flappy Brain!",c.width/2,c.height/3);
		ctx.font = "20px Arial";
		//ctx.textAlign = "left";
		ctx.fillText("Your goal is to find a way out of this maze. You can dodge the ",c.width/2,c.height/2);
		ctx.fillText("incoming obstacles by pressing the left mouse button.   ",c.width/2,c.height/2+30);
		ctx.textAlign = "center";

		ctx.fillText("Press left mouse button to start.",c.width/2,c.height/2+100);

		ctx.closePath();

	}
	
	function drawScreen(){
		
		if (blockCounter % 2 ==0){inverseGravitymode= false} else if (blockCounter % 2 != 0) {inverseGravitymode = true}
		
		if (inverseGravitymode){
			gravity = -0.8;
		}
		if (!inverseGravitymode){
			gravity = 0.8
		}
		// draw white background:
		ctx.fillStyle = "rgba(255,255,255, 1)";
		ctx.fillRect(0,0, c.width, c.height);
		
		// update ball BUG COULD BE HERE
		ball.vy += gravity;
		//ball.vx = ball.vx - (ball.vx*friction);
		
		//ball.x += ball.vx;
		ball.y += ball.vy;
		
		checkBoundary(ball);
		for (var i = 0; i<nObstacles; i++){
			checkCollision(ball,obstaclesA[i]);
			checkCollision(ball,obstaclesB[i]);
		}
		
		//draw ball:
		ctx.fillStyle = ball.color;
		ctx.beginPath();
		ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();

		var img = document.getElementById("brainplayer");
		ctx.drawImage(img,ball.x-ball.radius,ball.y-ball.radius,ball.radius*2,ball.radius*2);
		
		// draw obstacles
		for (var i = 0; i<nObstacles; i++){
			drawObstacle(obstaclesA[i]);
			drawObstacle(obstaclesB[i]);
		}
	
		updateObstacles();
		points +=1
		
	}

	function checkBoundary(object){
		if(object.x>=c.width-object.radius){
			object.x = c.width - object.radius;
			object.vx = -object.vx;
			object.vx *= object.elasticity;
		}else if(object.x<=object.radius){
			object.x = object.radius;
			object.vx = -object.vx;
			object.vx *= object.elasticity;
		}else if(object.y>= c.height - object.radius){
			object.y = c.height-object.radius;
			object.vy = -object.vy;
			object.vy *= object.elasticity;
		}else if(object.y<=0+object.radius){
			object.y = object.radius;
			object.vy = -object.vy;
			object.vy *= object.elasticity;
			// also check for objects:
		}
	}
	
	function checkCollision(ball,obstacle){
		var collided = false;
		var distX = Math.abs(ball.x - obstacle.x - obstacle.width/2);
		var distY = Math.abs(ball.y - obstacle.y - obstacle.height/2);
		
		if (distX > (obstacle.width/2 + ball.radius)) { return false; }
		if (distY > (obstacle.height/2 + ball.radius)) { return false; }

		if (distX <= (obstacle.width/2)) { 
			//onPause();
			//gameOver();
			collided = true;
		} 
		if (distY <= (obstacle.height/2)) { 
			//onPause(); 
			//gameOver();
			collided = true;
		}
		
		var dx=distX-obstacle.width/2;
		var dy=distY-obstacle.height/2;
		if (dx*dx+dy*dy<=(ball.radius*ball.radius)) {
			//onPause()
			//gameOver();
			collided = true;
		}
		if (collided){
			onPause();
			gameOver();
		}
	}
		
	function startGame(){
		gameOn = true;
		firstTry = false;
	}
	
	function restartGame(){
		//document.location.reload();
		resetGlobalVariables()
		c.removeEventListener("mousedown", restartGame);
		gameOn = true;
		c.addEventListener("mousedown",jump)
		gameLoop();
	}
	
	function resetGlobalVariables(){
		// reset global variables:
		
		obstaclesA = {};
		obstaclesB = {};
		ball = {};
		
		ball = {radius:30, x:c.width/6, y:c.height/2, color:ballColor, angle:0, speed:0, vx:0, vy:0, elasticity:0.7};
		
		for (var i = 0; i < nObstacles; i++){
			var xoff = Math.random()*100;
			var xvalue = c.width/2 + 400 *i + Math.random()*100;
			var ob1height = Math.random()*400;
			var gapsz = minGapSize + Math.random()*400;
			obstaclesA[i] = {x:xvalue + xoff, y: 0, width: 100, height: ob1height, color:obstacleColor};
			var ob2height = c.height - ob1height - gapsz;
			obstaclesB[i] = {x:xvalue + xoff, y: c.height-ob2height, width: 100, height:ob2height, color:obstacleColor};		
		}
		
		points = 0;
		data =[];
			
	}
	
	function gameLoop(){
		if(gameOn){
			window.setTimeout(gameLoop,20);
			drawScreen();
		}
		else if(!gameOn && firstTry){
			window.setTimeout(gameLoop,20);
			c.addEventListener("mousedown", startGame);
			drawStartScreen()
		}
	}

	function onPause(e){
		gameOn = !gameOn;
		gameLoop();
	}

	function gameOver(){
		//added:
		c.removeEventListener("mousedown",jump)
		
		data.push('user= ' + userName)
		data.push('gameNo= ' + gameCounter)
		data.push('blockNo= ' + blockCounter)
		data.push('score= ' + points)
		data.push('inverseGrav= ' + inverseGravitymode)
		
		console.log(data);
		
		gameOverMessage();		
		
		resetGlobalVariables();
		c.addEventListener("mousedown", restartGame);
		gameCounter += 1;
		if (gameCounter % 10 == 0){ blockCounter += 1;}
		return gameCounter
	}
	
	function gameOverMessage(){
		ctx.fillStyle = "rgba(255,255,255, 0)";
		ctx.fillRect(0,0, c.width, c.height);

		ctx.font = "30px Arial";
		ctx.fillStyle = "Red";
		ctx.textAlign = "center";
		ctx.fillText("Game over " + userName+ "!",c.width/2,c.height/2);
		ctx.fillText("Your score was " + points,c.width/2,c.height/2+50);
		ctx.fillStyle = "Black";
		ctx.fillText("Click here to restart",c.width/2,c.height/2+100);
	}
	
		// random obstacle generator functions:
	function drawObstacle(object){
		// draws an obstacle part with properties defined in "object" argument
		ctx.fillStyle = object.color;
		ctx.fillRect(object.x,object.y,object.width,object.height);
	}
	
	
	function updateObstacles(){
		for (var i = 0; i<nObstacles; i++){
			if(obstaclesA[i].x<-100){//when the obstacle gets out of bounds
				// reset x position to back of the line:
				// first, find back of the line: 
				maxXval = obstaclesA[0].x;
				for (var j = 0; j<nObstacles; j++){
					if (maxXval < obstaclesA[j].x){
						maxXval = obstaclesA[j].x;
					}
				}
				xOffset = obstaclesA[i].width + minObstacleDistance + Math.random()*500;
				obstaclesA[i].x += maxXval + xOffset;
				obstaclesB[i].x += maxXval + xOffset;

				// reset its relative sizes to a random value:
				gapSize = minGapSize + Math.random()*200;
				obstaclesA[i].height = Math.random() * 400;
				obstaclesB[i].height = c.height - obstaclesA[i].height - gapSize;
				obstaclesB[i].y = c.height - obstaclesB[i].height;
			}else if(obstaclesA[i].x >=-100){
				obstaclesA[i].x -= 5;
				obstaclesB[i].x -= 5;
			}
		}
	}
	
	
	
	
	
}