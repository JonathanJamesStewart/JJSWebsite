//Since I cannot use a singleton this will have to serve as a board.
var userImage = 'Images/X.jpg';
var AIImage = 'Images/Y.jpg';
var blankImage = 'Images/Blank.jpg';
var boardIDs = ['UL','UM','UR','ML','MM','MR','LL','LM','LR'];
var board = [0,0,0,0,0,0,0,0,0];
var playerValue = 1;
var AIValue = -1;

function buttonClick(button){
	var clickedButton = document.getElementById(button);
	
	switch(clickedButton.id){
		case 'UL':
			userPick(0,clickedButton);
			break;
		case 'UM':
			userPick(1,clickedButton);
			break;
		case 'UR':
			userPick(2,clickedButton);
			break;
		case 'ML':
			userPick(3,clickedButton);
			break;
		case 'MM':
			userPick(4,clickedButton);
			break;
		case 'MR':
			userPick(5,clickedButton);
			break;
		case 'LL':
			userPick(6,clickedButton);
			break;
		case 'LM':
			userPick(7,clickedButton);
			break;
		case 'LR':
			userPick(8,clickedButton);
			break;
		default:
			break;
	}
}

function userPick(cell, clickedButton){
	if(!isTaken(cell)){
		clickedButton.src = userImage;
		board[cell] = playerValue;
	}
	
	if(checkWin() != playerValue){
		AIPick():
	}
	
	//document.getElementById('out').innerHTML = '<p>' + printBoard() + '</p>';
}

function AIPick(){
	
}

function isTaken(cell){
	if(board[cell] != 0){
		return true;
	}
	return false;
}

function reset(){
	for(x = 0; x < board.length; x++){
		board[x] = 0;
		document.getElementById(boardIDs[x]).src = blankImage;
	}
}

function checkWin(){
	var a = 0;
	var b = 0;
	var c = 0;
	var x = 0;
	var y = 0;
	var z = 0;
	var win = 0;
	
	//Check rows
	x = 0;
	y = 3;
	z = 6;
	
	while(x < 3){
		a = board[x];
		b = board[y];
		c = board[z];
		
		if(areEqual(a, b, c) && a != 0){
			win = a;
		}
		
		x++;
		y++;
		z++;
	}
	
	x = 0;
	y = 1;
	z = 2;
	
	while(x < 7){
		a = board[x];
		b = board[y];
		c = board[z];
		
		if(areEqual(a, b, c) && a != 0){
			win = a;
		}
		
		x += 3;
		y = x + 1;
		z = y + 1;
	}
	
	x = 0;
	y = 4;
	z = 8;
	
	a = board[x];
	b = board[y];
	c = board[z];
	
	if(areEqual(a, b, c) && a != 0){
		win = a;
	}
	
	x = 2;
	y = 4;
	z = 6;
	
	a = board[x];
	b = board[y];
	c = board[z];
	
	if(areEqual(a, b, c) && a != 0){
		win = a;
	}
	
	return win;
}

function areEqual(a, b, c){
	return (a == b && a == c);
}

function printBoard(){
	var s = '';
	
	for(x = 0; x < board.length; x++){
		s += board[x];
	}
	
	return s;
}