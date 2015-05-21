//Since I cannot use a singleton this will have to serve as a board.
var player1Image = 'Images/X.jpg';
var player2Image = 'Images/O.jpg';
var blankImage = 'Images/Blank.jpg';
var boardIDs = ['UL','UM','UR','ML','MM','MR','LL','LM','LR'];
var board = [0,0,0,0,0,0,0,0,0];
var player1Value = 1;
var player2Value = -1;
var neutralValue = 0;
var numPlayers = '1';
var player1Wins = 0;
var player2Wins = 0;
var medMistakeChance = .4;
var easyMistakeChance = .9;
var hardMistakeChance = 0;
var mistakeChance = medMistakeChance;
var playerTurn = 1;

//Function called when an image button is clicked.
function buttonClick(button){
	var clickedButton = document.getElementById(button);
	
	//Decide which image button is clicked.
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

//Changes the user's choice to their image if there has
//not been a winner and the cell is available.
//Starts the recursive function to decide which cell to
//pick.
function userPick(cell, clickedButton){
	//If there is already a winner disable any more moves.
	if(checkWin(board) != neutralValue){
		return;
	}
	
	//If the space is not taken set their image.
	if(!isTaken(board, cell)){
		if(playerTurn > 0){
			clickedButton.src = player1Image;
			board[cell] = player1Value;
		}else{
			clickedButton.src = player2Image;
			board[cell] = player2Value;
		}
		if(numPlayers == '2'){
			playerTurn = -playerTurn;
		}
	}else{
		return;
	}
	
	if(numPlayers == '1'){
		var win = checkWin(board);
	
		//If the user wins tell them so.
		if(win > neutralValue){
			incrementWinCount(win);
		}else{
			//Else tell the computer to make a move.
			
			if(Math.random() < mistakeChance){
				var response = makeMistake();
			}else{
				var response = AIPick(board.slice(0), player2Value, 7).move;
			}
			
			if(response == null) return;
			
			board[response] = player2Value;
			document.getElementById(boardIDs[response]).src = player2Image;
			win = checkWin(board);
		
			if(win < neutralValue){
				incrementWinCount(win);
			}
		}
	}else{
		var win = checkWin(board);
		
		if(win != neutralValue){
			incrementWinCount(win);
		}
	}
	
	//document.getElementById('out').innerHTML = '<p>' + printBoard() + '</p>';
}

function makeMistake(){
	var move = Math.floor(Math.random() * board.length);
	
	while(isTaken(board, move)){
		move = Math.floor(Math.random() * board.length);
	}
	
	//console.log('Mistake');
	return move;
}

function incrementWinCount(win){
	var label;
	
	if(win > neutralValue){
		label = document.getElementById('player1Score');
		document.getElementById('out').innerHTML = '<p>PLAYER 1 WINS!</p>';
	}else{
		label = document.getElementById('player2Score');
		document.getElementById('out').innerHTML = '<p>PLAYER 2 WINS!</p>';
	}
	
	var val = label.innerHTML;
	var val = parseInt(val) + 1;
	label.innerHTML = val;
}

//Recursive function to decide where to go.
function AIPick(tempBoard, player, depth){
	var w = checkWin(tempBoard);
	
	//If there is already a winner make no move.
	if(w != neutralValue || depth == 0){
		return {move: null, win: w};
	}
	
	var wins = {'-1': [], '0': [], '1': []};
	
	//For each cell test to see if we can move there.
	for(var i = 0; i < tempBoard.length; i++){
		if(!isTaken(tempBoard, i)){
			//If we can move there make a copy of the board and do so.
			var copy = tempBoard.slice(0);
			copy[i] = player;
			
			//Make recursive call. Switch player. Reduce depth.
			var t = AIPick(copy, -player, depth - 1);
			
			//Catalog the list of wins.
			wins[t.win].push({move: i, win: t.win});
		}
	}
	
	var preference = [player, neutralValue, -player];
	
	//Pick our preference. If there is none pick a random.
	for(var i = 0; i < preference.length; i++){
		if(wins[preference[i]].length){
			return pickRandom(wins[preference[i]]);
		}
	}
	
	//If there is no valid move return nothing.
	return {move: null, win: neutralValue};
}

//Simple function to determine if a cell on a given board is available.
function isTaken(tempBoard, cell){
	if(tempBoard[cell] != neutralValue){
		return true;
	}
	return false;
}

//Resets the original board to be able to play again.
function reset(){
	newGame();
	
	document.getElementById('player1Score').innerHTML = '0';
	document.getElementById('player2Score').innerHTML = '0';
}

function newGame(){
	for(x = 0; x < board.length; x++){
		board[x] = neutralValue;
		document.getElementById(boardIDs[x]).src = blankImage;
	}
	
	document.getElementById('out').innerHTML = '';
	playerTurn = 1;
}

//Checks for a winner on the given board and returns the winner's value.
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

//Determines if 3 values are equal.
function areEqual(a, b, c){
	return (a == b && a == c);
}

//Picks a random move from a list of values.
function pickRandom(a){
	return a[Math.floor(Math.random() * a.length)];
}

//Returns the board in straight line format.
function printBoard(){
	var s = '';
	
	for(x = 0; x < board.length; x++){
		s += board[x];
	}
	
	return s;
}

function setDifficulty(radio){
	var difficulty = radio.value;
	
	switch(difficulty){
		case 'easy':
			mistakeChance = easyMistakeChance;
			break;
		case 'medium':
			mistakeChance = medMistakeChance;
			break;
		case 'hard':
			mistakeChance = hardMistakeChance;
			break;
		default:
			mistakeChance = medMistakeChance;
			break;
	}
	
	newGame();
	//document.getElementById('out').innerHTML = '<p>Difficulty Changed</p>' + difficulty;
}

function setPlayers(radio){
	numPlayers = radio.value;
	
	newGame();
	//document.getElementById('out').innerHTML = '<p>numPlayers Changed</p>' + numPlayers;
}