$(document).ready(function(){
	//Control vars
	var canvas = $("#canvas")[0];
	var ctxt = canvas.getContext("2d");
	var cWidth = $("#canvas").width();
	var cHeight = $("#canvas").height();
	var backColor = '#FDFDF7';
	var frontColor = '#387181';
	var snake = [];
	var initSnakeLength = 3;
	var cellWidth = 10;
	
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
		for(i = initSnakeLength-1; i >=0; i--){
			snake.push({x:i, y:0});
		}
	}
	
	function drawSnake(){
		var tail = snake.
		
		for(i = 0; i < snake.length; i++){
			var c = snake[i];
			
			ctxt.fillStyle = frontColor;
			ctxt.fillRect(c.x*cellWidth, c.y*cellWidth, cellWidth, cellWidth);
			ctxt.strokeStyle = backColor;
			ctxt.strokeRect(c.x*cellWidth, c.y*cellWidth, cellWidth, cellWidth);
		}
	}
	
	game_loop = setInterval(drawSnake, 60);
})