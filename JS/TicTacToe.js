//Since I cannot use a singleton this will have to serve as a board.
var userImage = 'Images/X.jpg';
var AIImage = 'Images/O.jpg';
var blankImage = 'Images/Blank.jpg';
var boardIDs = ['UL','UM','UR','ML','MM','MR','LL','LM','LR'];
var board = [0,0,0,0,0,0,0,0,0];
var playerValue = 1;
var AIValue = -1;
var neutralValue = 0;

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
	if(checkWin(board) != neutralValue){
		return;
	}
	
	if(!isTaken(board, cell)){
		clickedButton.src = userImage;
		board[cell] = playerValue;
	}
	
	var win = checkWin(board);
	
	if(win != neutralValue){
		document.getElementById('out').innerHTML = '<p>WIN!</p>';
	}else{
		var response = AIPick(board.slice(0), AIValue, 7).move;
		
		if(response == null) return;
		board[response] = AIValue;
		document.getElementById(boardIDs[response]).src = AIImage;
	}
	
	//document.getElementById('out').innerHTML = '<p>' + printBoard() + '</p>';
}

function AIPick(tempBoard, player, depth){
	var w = checkWin(tempBoard);
	
	if(w != neutralValue || depth == 0){
		return {move: null, win: w};
	}
	
	var wins = {'-1': [], '0': [], '1': []};
	
	for(var i = 0; i < tempBoard.length; i++){
		if(!isTaken(tempBoard, i)){
			var copy = tempBoard.slice(0);
			copy[i] = player;
			var t = AIPick(copy, -player, depth - 1);
			wins[t.win].push({move: i, win: t.win});
		}
	}
	
	var preference = [player, neutralValue, -player];
	for(var i = 0; i < preference.length; i++){
		if(wins[preference[i]].length){
			return pickRandom(wins[preference[i]]);
		}
	}
	return {move: null, win: neutralValue};
}

function isTaken(tempBoard, cell){
	if(tempBoard[cell] != neutralValue){
		return true;
	}
	return false;
}

function reset(){
	for(x = 0; x < board.length; x++){
		board[x] = neutralValue;
		document.getElementById(boardIDs[x]).src = blankImage;
	}
	
	document.getElementById('out').innerHTML = '';
}

function checkWin(tempBoard){
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
		a = tempBoard[x];
		b = tempBoard[y];
		c = tempBoard[z];
		
		if(areEqual(a, b, c) && a != neutralValue){
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
		a = tempBoard[x];
		b = tempBoard[y];
		c = tempBoard[z];
		
		if(areEqual(a, b, c) && a != neutralValue){
			win = a;
		}
		
		x += 3;
		y = x + 1;
		z = y + 1;
	}
	
	x = 0;
	y = 4;
	z = 8;
	
	a = tempBoard[x];
	b = tempBoard[y];
	c = tempBoard[z];
	
	if(areEqual(a, b, c) && a != neutralValue){
		win = a;
	}
	
	x = 2;
	y = 4;
	z = 6;
	
	a = tempBoard[x];
	b = tempBoard[y];
	c = tempBoard[z];
	
	if(areEqual(a, b, c) && a != neutralValue){
		win = a;
	}
	
	return win;
}

function areEqual(a, b, c){
	return (a == b && a == c);
}

function pickRandom(a){
	return a[Math.floor(Math.random() * a.length)];
}

function printBoard(){
	var s = '';
	
	for(x = 0; x < board.length; x++){
		s += board[x];
	}
	
	return s;
}