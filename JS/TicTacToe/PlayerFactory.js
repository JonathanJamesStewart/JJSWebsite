/**
* @author Jonathan Stewart
*/

/**
* This is the PlayerFactory. It creates human and computer players based on input.
*
* @method MakePlayer
* @param {PLAYER_TYPE} TYPE The type of player we want to create. Typically human or computer.
* @param {DIFFICULTY} DIFF The difficulty we want to set for the player if computer.
* @param {String} IMAGE The relative path to the image we want to represent this player.
* @return {Player} Returns a player of the desired type.
*/
var MakePlayer = function(TYPE, DIFF, IMAGE){
	//If we want a human set up the prototype chain and make a human player.
	if(TYPE == PLAYER_TYPE.HUMAN){
		PersonPlayer.prototype = new Player(TYPE.value, IMAGE, DIFF);
		return new PersonPlayer();
	//Else set up the prototype chain and make a computer player.
	}else{
		AIPlayer.prototype = new Player(TYPE.value, PLAYER_TYPE.COMPUTER.imagePath, DIFF);
		return new AIPlayer();
	}
};