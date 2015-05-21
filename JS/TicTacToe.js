$(document).ready(function(){
});

function player(playerValue, playerImagePath){
	
}

function gameBoard(){
	this.board = [0,0,0,0,0,0,0,0,0];

	this.makeMove = function(space, player){
		if(space < 0 || space > this.board.length){
			return false;
		}
		//TODO: check for player in player list playerList.indexOf(player)
		if((player == -1 || player == 1) && this.board[space] == 0){
			this.board[space] = player;
			return true;
		}
		
		return false;
	};
}