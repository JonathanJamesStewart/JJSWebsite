/**
* @author Jonathan Stewart
*/

/**
* Player. Essentially an abstract class that holds values for its
* subclasses.
* 
* @class Player
* @param {int} playerValue The value the player has. Typicall -1 or 1.
* @param {String} playerImagePath The relative path to the image this player has.
* @param {DIFFICULTY} difficulty The difficulty of the player if it is a computer player.
*/
function Player(playerValue, playerImagePath, difficulty){
	this.playerValue = playerValue;
	this.playerImagePath = playerImagePath;
	this.difficulty = difficulty;

	/**
	* Returns the difficulty of the player.
	*
	* @method getDifficulty
	* @return {DIFFICULTY} The difficulty of the player.
	*/
	this.getDifficulty = function(){
		return this.difficulty;
	};

	/**
	* Returns the player value.
	*
	* @method getPlayerValue
	* @return {int} The value of this player.
	*/
	this.getPlayerValue = function(){
		return this.playerValue;
	};

	/**
	* Returns the string representing the relative path to the image of this player.
	*
	* @method getPlayerImagePath
	* @return {String} The string representing the relative path to the image.
	*/
	this.getPlayerImagePath = function(){
		return this.playerImagePath;
	};

	/**
	* Sets the difficulty of the player to a new value.
	*
	* @method setDifficulty
	* @param {DIFFICULTY} newDifficulty The new difficulty to be set.
	* @return {Boolean} True on success.
	*/
	this.setDifficulty = function(newDifficulty){
		//If newDifficulty is within 0-1 set it and return true.
		if(newDifficulty >= 0 && newDifficulty <=1){
			this.difficulty = newDifficulty;
			return true;
		}
		return false;
	};

	/**
	* Returns the string representation of this player.
	*
	* @method toString
	* @return {String} The string representation of this player. "PlayerValue: x PlayerImagePath: y".
	*/
	this.toString = function(){
		return "playerValue: " + playerValue + " playerImagePath: " + playerImagePath;
	};
}

/**
* AIPlayer represents the computer player. It uses a recursive algorithm to decide where to move
* based on inputs.
*
* @class AIPlayer
*/
function AIPlayer(){

	/**
	* Basic makeMove that is called from the outside. Standard for Player subclasses.
	*
	* @method makeMove
	* @param {GameBoard} board The current board state.
	* @param {PlayerTurnManager} playerTurnManager Needed so the AI can maintain proper order of player movement.
	* @return {{move: m, win: w}} A tuple that represents the move we make and the win state we expect.
	*/
	this.makeMove = function(board, playerTurnManager){

		//Decide if we are going to make a mistake. If we are going to make one.
		if(Math.random() < this.difficulty.value){
			return this.makeMistake(board);
		}
		//Else return an intelligent pick.
		return this.computerPick(board.copyBoard(), playerTurnManager.copyPTM(), board.emptyCount());
	};

	/**
	* Called when the computer decides to make a mistake.
	*
	* @method makeMistake
	* @param {GameBoard} board The board state so we don't try to make a move on a invalid space.
	* @return {{move: m, win: w}} A tuple that represents the move we make and the win state we expect.
	*/
	this.makeMistake = function(board){
		var m = Math.floor(Math.random() * board.getBoardSize());
	
		//While the space we have chosen is taken choose a different one.
		while(board.isTaken(m)){
			m = Math.floor(Math.random() * board.getBoardSize());
		}
		return {move: m, win: board.getNeutralValue()};
	}

	/**
	* Recursive function that actually decides wher to move.
	*
	* @method computerPick
	* @param {GameBoard} board The current copy of the board we are using.
	* @param {PlayerTurnManager} playerTurnManager So we can keep proper order when making moves.
	* @param {int} depth Used as one stop case for recursion when it is 0.
	*/
	this.computerPick = function(board, playerTurnManager, depth){

		//Check for a winner. If there is one do nothing.
		var w = board.checkWin();

		if(w != board.getNeutralValue() || depth < 1){
			return {move: null, win: w};
		}

		//Object to calog wins.
		//TODO: Change to accommodate more than two players.
		var wins = {'-1': [], '0': [], '1': []};

		//For each cell test to see if we can move there.
		for(var i = 0; i < board.getBoardSize(); i++){

			if(!board.isTaken(i)){
				//If we can move there make a copy of the board and PTM and do so.
				var copy = board.copyBoard();
				var ptmCopy = playerTurnManager.copyPTM();
				copy.makeMove(ptmCopy.getCurrentPlayer(), i);
				ptmCopy.nextPlayer();
				
				//Make recursive call. Switch player. Reduce depth.
				var t = this.computerPick(copy, ptmCopy, depth - 1);
				
				//Catalog the list of wins.
				wins[t.win].push({move: i, win: t.win});
			}
		}

		//Assemble a list of preferences. This player > tie > all other players.
		var ptm = playerTurnManager.copyPTM();
		var preference = [];
		var currPlayer = ptm.getCurrentPlayer();
		var count = 0;

		do{
			//Insert a tie at the first iteration.
			if(count == 1){
				preference.push(board.neutralValue);
			}

			//Append next player.
			preference.push(currPlayer.getPlayerValue());

			currPlayer = ptm.nextPlayer();
			count++;
		}while(currPlayer.toString() != this.toString());
		
		//Pick our preference. If there is none pick a random.
		for(var i = 0; i < preference.length; i++){
			if(wins[preference[i]].length){
				return this.pickRandom(wins[preference[i]]);
			}
		}

		//If there is no valid move return nothing.
		return {move: null, win: board.neutralValue};
	};

	/**
	* Picks a random move from a list of preferences.
	*
	* @method pickRandom
	* @param {int[]} a A list of acceptable moves.
	* @return {int} The chosen space to move.
	*/
	this.pickRandom = function(a){
		return a[Math.floor(Math.random() * a.length)];
	};
}

/**
* PersonPlayer represents the user. It simply finds the difference between the old and
* new board and returns the value. Only if the difference is made by this player.
*
* @class PersonPlayer
*/
function PersonPlayer(){
	var oldBoard;

	/**
	* Determines which move was made by this user.
	*
	* @method makeMove
	* @param {GameBoard} The new board.
	* @return {{move: m, win: w}} The tuple representing the move this user made.
	*/
	this.makeMove = function(board){

		//If the old board has not been initialized do so and return the first move made.
		//Assumes each player has moved at most once.
		if(!oldBoard){
			oldBoard = board.copyBoard();

			//Find the value that represents this player and return it.
			for(var i = 0; i < oldBoard.getBoardSize(); i++){
				if(oldBoard.getSpaceValue(i) == this.getPlayerValue()){
					return {move: i, win: board.getNeutralValue()};
				}
			}
		}

		var m = null;

		//Else find the difference between this board and the old board that is equal to this player value.
		for(var i = 0; i < board.getBoardSize(); i++){
			if(oldBoard.getSpaceValue(i) != board.getSpaceValue(i) && board.getSpaceValue(i) == this.getPlayerValue()){
				m = i;
			}
		}

		//Copy the new board and return the found difference.
		oldBoard = board.copyBoard();
		return {move: m, win: board.getNeutralValue()};
	};
}