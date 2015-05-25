/**
* @author Jonathan Stewart
*/

$(document).ready(function(){
	ModelController.init();
});

/**
* Difficulty defines the allowed variations on difficulty
* that can be set for the Player.
*
* @property EASY
* @property MEDIUM
* @property HARD
* @type DIFFICULTY
*/
var DIFFICULTY = {
	EASY	: {value: 0.9, name: "Easy"},
	MEDIUM	: {value: 0.4, name: "Medium"},
	HARD	: {value: 0.0, name: "Hard"}
};

/**
* PLAYER_TYPE defines the types of players allowed.
*
* @property HUMAN
* @property COMPUTER
* @type PLAYER_TYPE
*/
var PLAYER_TYPE = {
	HUMAN	: {value: -1, imagePath: "Images/X.jpg"},
	COMPUTER: {value:  1, imagePath: "Images/O.jpg"},
	BLANK: {value: 0, imagePath: "Images/Blank.jpg"}
};

/**
* ModelController is responsible for coordinating communication
* between the DisplayAdapter and the model. It then formulates
* a response and sends it back to the DisplayAdapter to show the
* user.
*
* @class ModelController
*/
var ModelController = {
	boardSize : 9,
	numPlayers : 1,
	neutralValue : 0,
	maxPlayers : 2,
	difficulty : DIFFICULTY.HARD,

	/**
	* Initializer function for ModelController. Sets up the board, rules,
	* etc. Can also be used to reset everything.
	*
	* @method init
	* @return {String} Returns string representation of new board on success.
	*/
	init : function(){
		var b = [];

		//Initialize an empty board of size boardSize.
		for(var i = 0; i < this.boardSize; i++){
			b.push(this.neutralValue);
		}

		//Initializes the rules.
		this.boardRules = this.makeRules();

		//Make the gamebord.
		this.board = new GameBoard(b, this.neutralValue, this.boardRules);

		var ptm = new PlayerTurnManager();

		//Add the players to the PlayerTurnManager. This will need to be
		//modified to accommodate more than 2 players.
		for(var i = 0; i < this.maxPlayers; i++){
			if(i < this.numPlayers){
				//If there is just one human player add one otherwise add two.
				if(i == 1){
					ptm.addPlayer(MakePlayer(PLAYER_TYPE.COMPUTER, this.difficulty, PLAYER_TYPE.COMPUTER.imagePath));
				}else{
					ptm.addPlayer(MakePlayer(PLAYER_TYPE.HUMAN, this.difficulty, PLAYER_TYPE.HUMAN.imagePath));
				}
			}else{
				//Add a computer player if applicable.
				ptm.addPlayer(MakePlayer(PLAYER_TYPE.COMPUTER, this.difficulty));
			}
		}

		this.playerTurnManager = ptm;

		return this.board.toString();
	},

	/**
	* Coordinates the moves when a player chooses a space to move. Responds
	* by setting the index the player chose and the index the computer chose
	* if applicable.
	* 
	* @method makeMove
	* @param {int} index The index the player chose.
	* @return {int} The move the computer chose if applicable. Null otherwise.
	*/
	makeMove : function(index){
		//If the board is in a winning state do nothing.
		if(this.board.checkWin() != this.neutralValue || this.board.emptyCount() == 0){
			return;
		}

		//Get the next player. Make a copy of the board, bust a move, and see if they are different.
		var tempPlayer = this.playerTurnManager.nextPlayer();
		var copy = this.board.copyBoard();
		this.board.makeMove(tempPlayer, index);

		//If they're different change the display.
		if(copy.toString() != this.board.toString()){
			DisplayAdapter.setSrc(parseInt(index), tempPlayer.getPlayerImagePath());
		}

		//If a person won tell the DisplayAdapter to increment score.
		if(this.checkWin(this.board)){
			this.incrementScore(this.board.checkWin());
			return;
		}

		var nextMove;

		//If there is a computer player make a move.
		if(this.numPlayers < 2){
			var nextPlayer = this.playerTurnManager.nextPlayer();
			//Get the computer's move.
			var m = nextPlayer.makeMove(this.board, this.playerTurnManager.copyPTM()).move;
			if(m != null){
				//If we have a move make it.
				this.board.makeMove(nextPlayer, m);
				DisplayAdapter.setSrc(parseInt(m), nextPlayer.getPlayerImagePath());
			}
			nextMove = m;
		}
		// Check if we won.
		if(this.checkWin(this.board)){
			this.incrementScore(this.board.checkWin());
		}

		return nextMove;
	},

	/**
	* Checks if the board is in a winning state.
	*
	* @method checkWin
	* @param {Gameboard} board The current GameBoard.
	* @return {Boolean} True if the board is in a winning state. False otherwise.
	*/
	checkWin : function(board){
		//If the board is in a winning state return true else return false;
		var win = board.checkWin();
		if(win != board.getNeutralValue()){
			return true;
		}
		return false;
	},

	/**
	* Tells the DisplayAdapter to increment the score display.
	*
	* @method incrementScore
	* @param {int} win The playerValue of the winner.
	* @return {int} The new score that is displayed.
	*/
	incrementScore : function(win){
		//Tell the DisplayAdapter which label to update.
		var newScore;
		if(win == PLAYER_TYPE.HUMAN.value){
			newScore = DisplayAdapter.incrementScore(1);
		}else{
			newScore = DisplayAdapter.incrementScore(2);
		}
		return newScore;
	},

	/**
	* Changes the difficulty of the AI.
	*
	* @method changeDifficulty
	* @param {String} newDifficulty The difficulty setting. Easy, Medium, or Hard.
	* @return {DIFFICULTY} The difficulty enum that was picked.
	*/
	changeDifficulty : function(newDifficulty){
		var diff;
		//Decide which difficulty the user picked.
		switch(newDifficulty){
			case 'Easy':
				diff = DIFFICULTY.EASY;
				break;
			case 'Medium':
				diff = DIFFICULTY.MEDIUM;
				break;
			case 'Hard':
				diff = DIFFICULTY.HARD;
				break;
			default:
				diff = DIFFICULTY.HARD;
		}
		//Set it and reset the game.
		this.difficulty = diff;
		this.newGame();
		return this.difficulty;
	},

	/**
	* Changes the number of human players. Typically 1 or 2.
	*
	* @method changeNumPlayers
	* @param {int} newNumPlayers The desired number of human players.
	* @return {int} The new humann player count.
	*/
	changeNumPlayers : function(newNumPlayers){
		this.numPlayers = newNumPlayers;
		this.newGame();
		return this.numPlayers;
	},

	/**
	* Resets the gameBoard.
	*
	* @method reset
	* @return {String} String representation of new board on success.
	*/
	reset : function(){
		this.newGame();
		return this.board.toString();
	},

	/**
	* Initializes a new game.
	*
	* @method newGame
	* @return {String} String representation of new board on success.
	*/
	newGame : function(){
		this.init();
		return this.board.toString();
	},

	/**
	* Initializes rules to be used to define win states. Change this
	* method to add or change rules.
	*
	* @method makeRules
	* @return {RuleSet} The rules that define a win state for this game.
	*/
	makeRules : function(){
		var r = new RuleSet();

		var i = 0;
		//Add the horizontal rules [0,1,2],[3,4,5] etc.
		while(i < 7){
			r.addRule([i++,i++,i++]);
		}
		i = 0;
		//Add the vertical rules [0,3,6] etc.
		while(i < 3){
			r.addRule([i,i+3,i+6]);
			i++;
		}
		//Add diagonal rules.
		r.addRule([0,4,8]);
		r.addRule([2,4,6]);

		return r;
	},

	/**
	* Retuns the current board size.
	*
	* @method getBoardSize
	* @return {int} the current board size.
	*/
	getBoardSize : function(){
		return this.boardSize;
	}
};