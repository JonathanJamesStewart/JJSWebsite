//Since I cannot use a singleton this will have to serve as a board.
var userImage = 'Images/X.jpg';
var AIImage = 'Images/Y.jpg';

var board = [[0,0,0],[0,0,0],[0,0,0]];
var boardIDs = [['UL','UM','UR'],['ML','MM','MR'],['LL','LM','LR']];

function buttonClick(button){
	var clickedButton = document.getElementById(button);
	
	switch(clickedButton.id){
		case 'UL':
			userPick(0,0,clickedButton);
			break;
		case 'UM':
			userPick(1,0,clickedButton);
			break;
		case 'UR':
			userPick(2,0,clickedButton);
			break;
		case 'ML':
			userPick(0,1,clickedButton);
			break;
		case 'MM':
			userPick(1,1,clickedButton);
			break;
		case 'MR':
			userPick(2,1,clickedButton);
			break;
		case 'LL':
			userPick(0,2,clickedButton);
			break;
		case 'LM':
			userPick(1,2,clickedButton);
			break;
		case 'LR':
			userPick(2,2,clickedButton);
			break;
		default:
			break;
	}
}

function userPick(x, y, clickedButton){
	if(!spaceTaken(x,y)){
		clickedButton.src = 'Images/X.jpg';
		board[x][y] = 1;
	}
}

function spaceTaken(x,y){
	if(board[x][y] != 0){
		return true;
	}
	return false;
}

function reset(){
	for (x = 0; x < 3; x++){
		for (y = 0; y < 3; y++){
			board[x][y] = 0;
			document.getElementById(boardIDs[x][y]).src = 'Images/Blank.jpg';
		}
	}
}