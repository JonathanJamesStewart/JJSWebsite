/**
* @author Jonathan Stewart
*/

$(document).ready(function(){
	GameBoard.prototype = areEqual.prototype;
});

/**
* GameBoard maintains the state of the current game. Who has
* gone where. It can determing if it is in a winning state.
*
* @class GameBoard
*/
function GameBoard(board, neutralValue, ruleSet){
	this.board = board;
	this.neutralValue = neutralValue;
	this.ruleSet = ruleSet;

	/**
	* Sets the index of the board to the playerValue if it is not already taken.
	* 
	* @method makeMove
	* @param {Player} player The player that is trying to make the move.
	* @param {int} index The space that the player is trying to move in.
	* @return {Boolean} True if the space has not already been taken.
	*/
	this.makeMove = function(player, index){

		//If the space has been taken return false. Else make the move
		//and return true.
		if(board[index] != neutralValue){
			return false;
		}
		board[index] = player.getPlayerValue();
		return true;
	}

	/**
	* Queries whether a space is taken or not.
	*
	* @method isTaken
	* @param {int} index The space in question.
	* @return {Boolean} True if the space is taken.
	*/
	this.isTaken = function(index){
		if(board[index] != neutralValue){
			return true;
		}
		return false;
	};

	/**
	* Counts the spaces that have not been taken yet.
	*
	* @method emptyCount
	* @return {int} The number of spaces that have not been taken.
	*/
	this.emptyCount = function(){
		var empty = 0;

		for(var i = 0; i < board.length; i++){

			//If the space has not been taken count it.
			if(board[i] == neutralValue){
				empty++;
			}
		}

		return empty;
	};

	/**
	* Returns the winner of the board if there is one.
	*
	* @method checkWin
	* @return {int} The winner. NeutralValue if none.
	*/
	this.checkWin = function(){
		var win = neutralValue;
		var rules = ruleSet.getRules();

		//For each rule.
		for(var i = 0; i < rules.length; i++){

			var vals = [];
			//Get the values of the current board from the positions
			//indicated by the rule.
			for(var j = 0; j < rules[i].length; j++){
				vals.push(board[rules[i][j]]);
			}

			//If all the values are equal and not neutralValue set the winner.
			if(areEqual(vals) && vals[0] != neutralValue){
				win = vals[0];
			}
		}
		return win;
	};

	/**
	* Returns a duplicate of this board.
	*
	* @method copyBoard
	* @return {GameBoard} The copy of this board.
	*/
	this.copyBoard = function(){
		return new GameBoard(board.slice(0), neutralValue, ruleSet);
	};

	/**
	* Returns the value of the requested space.
	*
	* @method getSpaceValue
	* @param {int} index The space to be requested.
	* @return {int} The value of the space.
	*/
	this.getSpaceValue = function(index){
		return board[index];
	};

	/**
	* Returns the number of cells on this board.
	*
	* @method getBoardSize
	* @return {int} The number of cells on this board.
	*/
	this.getBoardSize = function(){
		return board.length;
	};

	/**
	* Returns the neutral value of this board. Not necessarily 0.
	*
	* @method getNeutralValue
	* @return {int} The neutral value.
	*/
	this.getNeutralValue = function(){
		return neutralValue;
	};

	/**
	* Returns a string representation of this board.
	*
	* @method toString
	* @return {String} The string representation.
	*/
	this.toString = function(){
		return board.toString();
	};
}

/**
* Determines if a an array of items are equal or not.
*
* @method areEqual
* @param {int[]} itemList The list of items to compare.
* @return {Boolean} True if they are equal.
*/
var areEqual = function(itemList){
	var isEqual = true;
	var firstItem = itemList[0];

	//Compare all the items to the first. If any are not equal
	//set isEqual to false;
	for(var i = 1; i < itemList.length; i++){
		if(firstItem != itemList[i]){
			isEqual = false;
		}
	}

	return isEqual;
};