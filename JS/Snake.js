$(document).ready(function(){
	//Control vars
	var canvas = $("#canvas")[0];
	var ctxt = canvas.getContext("2d");
	var cWidth = $("#canvas").width();
	var cHeight = $("#canvas").height();
	var backColor = '#FDFDF7';
	var frontColor = '#387181';
	var snake;
	var initSnakeLength = 3;
	var snakeLength;
	var cellWidth = 10;
	var lastKeyDown = 'null';
	var hasFood;
	var food;
	
	initCanvas();
	initSnake();
	
	//Init functions
	function initCanvas(){
		ctxt.fillStyle = backColor;
		ctxt.fillRect(0,0,cWidth,cHeight);
		ctxt.strokeStyle = frontColor;
		ctxt.strokeRect(0,0, cWidth, cHeight);
	}
	
	function initSnake(){
		snake = [];
		snakeLength = initSnakeLength;
		
		for(i = initSnakeLength-1; i >= 0; i--){
			snake.push({x:i, y:0});
		}
		
		lastKeyDown = 'right';
		
		makeFood();
	}
	
	function drawSnake(){
		if(!isInBoundary()) initSnake();
		
		if(isOverlapping()) initSnake();
		
		if(snake[0].x == food.x && snake[0].y == food.y){
			hasFood = false;
			snakeLength++;
			var tail = nextCell();
		}else{
			var tail = snake.pop();
		}
		
		var move = nextCell();
		
		tail.x = move.x;
		tail.y = move.y;
		
		snake.unshift(tail);
		
		initCanvas();
		
		for(i = 0; i < snakeLength; i++){
			var c = snake[i];
			
			colorCell(c.x, c.y);
		}
		
		if(!hasFood){
			makeFood();
		}
		
		colorCell(food.x, food.y);
		
		
	}
	
	function isInBoundary(){
		var head = snake[0];
		var inBoundary = true;
		
		if(head.x*10 > cWidth || head.x < 0) inBoundary = false;
		if(head.y*10 > cHeight || head.y < 0) inBoundary = false;
		
		return inBoundary;
	}
	
	function isOverlapping(){
		var overlapping = false;
		
		var a = snake[0];
		
		for(i = 1; i < snake.length-1; i++){
			var b = snake[i];
			
			if(a.x == b.x && a.y == b.y) overlapping = true;
		}
		
		return overlapping;
	}
	
	function colorCell(x, y){
		ctxt.fillStyle = frontColor;
		ctxt.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
		ctxt.strokeStyle = backColor;
		ctxt.strokeRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
	}
	
	function nextCell(){
		var nextX = snake[0].x;
		var nextY = snake[0].y;
		//console.log(lastKeyDown);
		switch(lastKeyDown){
			case 'left': //Left
				//console.log('Left');
				nextX--;
				break;
			case 'up': //Up
				//console.log('Up');
				nextY--;
				break;
			case 'right': //Right
				//console.log('Right');
				nextX++;
				break;
			case 'down': //Down
				//console.log('Down');
				nextY++;
				break;
			default:
				//console.log('Default');
				nextX++;
				break;
		}
		
		return {x: nextX, y: nextY};
	}
	
	function makeFood(){
		food = randomCell();
		
		while(occupied(food.x, food.y)){
			food = randomCell();
		}
		
		hasFood = true;
	}
	
	function occupied(x, y){
		var occupied = false;
		
		for(i = 0; i < snake.length; i++){
			var c = snake[i];
			
			if(c.x == x && x.y == y) occupied = true;
		}
	}
	
	function randomCell(){
		var x = Math.floor(Math.random() * (cWidth / 10));
		var y = Math.floor(Math.random() * (cHeight / 10));
		return {x: x, y: y};
	}
	
	$(document).keydown(function(e){
		var direction = e.which;
		
		if(direction == "37" && lastKeyDown != "right") lastKeyDown = "left";
		else if(direction == "38" && lastKeyDown != "down") lastKeyDown = "up";
		else if(direction == "39" && lastKeyDown != "left") lastKeyDown = "right";
		else if(direction == "40" && lastKeyDown != "up") lastKeyDown = "down";
	})
	
	game_loop = setInterval(drawSnake, 100);
})