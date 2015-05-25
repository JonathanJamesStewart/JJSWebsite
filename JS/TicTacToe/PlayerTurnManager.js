/**
* @author Jonathan Stewart
*/

/**
* The PlayerTurnManager decides which order the players should go in.
* It manages the addition and removal of players and their order.
*
* @class PlayerTurnManager
*/
function PlayerTurnManager(){
	var playerList = [];
	var playerTurn = -1;

	/**
	* Adds a player to the turn queue.
	*
	* @method addPlayer
	* @param {Player} newPlayer The player to add.
	* @return {Boolean} Returns true on successful addition.
	*/
	this.addPlayer = function(newPlayer){

		//If the player lacks either a value or imagePath return false;
		if(!newPlayer.playerValue || !newPlayer.playerImagePath){
			return false
		}

		//Else push the new player and return true.
		playerList.push(newPlayer);

		return true;
	};

	/**
	* Returns the next player in the queue. If this has not been called
	* before it returns the first player. If there are no players it
	* returns null.
	*
	* @method nextPlayer
	* @return {Player} The next player in the queue or null if no players.
	*/
	this.nextPlayer = function(){

		//If there are no players return null.
		if(playerList.length == 0){
			return null;
		}

		//If this has not been called before start at the beginning.
		if(playerTurn < 0){
			playerTurn == -1;
		}

		//Increment playerTurn, mod it by lsit length and return the next
		//player in the queue.
		playerTurn++;
		playerTurn %= playerList.length;
		return playerList[playerTurn];
	};

	/**
	* Gets the current player.
	*
	* @method getCurrentPlayer
	* @return {Player} The player who has the current move.
	*/
	this.getCurrentPlayer = function(){

		//If playerTurn is in an invalid position set it to the first player.
		if(playerTurn < 0){
			playerTurn = 0;
		}
		return playerList[playerTurn];
	};

	/**
	* Sets the current player to the player passed in.
	*
	* @method setCurrentPlayer
	* @param {Player} player The player to give the turn to.
	* @return {Boolean} True if the setting was successful.
	*/
	this.setCurrentPlayer = function(player){
		//Find the index of the player. If we cannot find them return false.
		var index = playerList.indexOf(player);

		if(index < 0){
			return false;
		}

		//Else set the playerTurn to them and return true.
		playerTurn = index;
		return true;
	};

	/**
	* Returns a copy of this object.
	*
	* @method copyPTM
	* @return {PlayerTurnManager} The copy of this object.
	*/
	this.copyPTM = function(){
		var ptm = new PlayerTurnManager();

		//Copy all the objects from the old to the new.
		for(var i = 0; i < playerList.length; i++){
			ptm.addPlayer(playerList[i]);
		}

		ptm.setCurrentPlayer(playerList[playerTurn]);

		return ptm;
	};

	/**
	* Returns the number of players currently playing.
	*
	* @method getPlayerCount
	* @return {int} The number of players.
	*/
	this.getPlayerCount = function(){
		return playerList.length;
	};

	/**
	* Returns a string representation of the state of this object.
	*
	* @method toString
	* @return {String} The string representation of the state of this object. "[PlayerList] playerTurn: x"
	*/
	this.toString = function(){
		return playerList.toString() + " playerTurn: " + playerTurn;
	};
}