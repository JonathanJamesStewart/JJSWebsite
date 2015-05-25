/**
* @author Jonathan Stewart
*/

/**
* Display adapter handles Updating the display for the user and
* communication between the two.
*
* @class DisplayAdapter
*/
var DisplayAdapter = {

	/**
	* Communicates to the ModelController where to move.
	*
	* @method makeMove
	* @param {int} index The space to move.
	* @return {int} The space that the model decided to move next.
	*/
	makeMove : function(index){
		var nextMove = ModelController.makeMove(index);
		return nextMove;
	},

	/**
	* Communicates to the ModelController that the user wants to
	* change difficulty. Resets game.
	*
	* @method changeDifficulty
	* @param {String} newDifficulty The string representation of the new difficulty.
	* @return {String} The new difficulty on success.
	*/
	changeDifficulty : function(newDifficulty){
		ModelController.changeDifficulty(newDifficulty);
		this.newGame();
		return newDifficulty;
	},

	/**
	* Communicates to the ModelController that the user wants to
	* change the number of players.
	* 
	* @method changeNumPlayers
	* @param {int} newNumPlayers The new number of players. Typically 1 or 2.
	* @return {int} The number of players set.
	*/
	changeNumPlayers : function(newNumPlayers){
		ModelController.changeNumPlayers(newNumPlayers);
		this.newGame();
		return newNumPlayers;
	},

	/**
	* Resets everything and tells the ModelController to reset.
	*
	* @method reset
	* @return {Boolean} True on success.
	*/
	reset : function(){

		//Get all labels and reset them.
		var label1 = this.getElement('player1Score');
		var label2 = this.getElement('player2Score');
		var label3 = this.getElement('out');
		if(label1){
			label1.innerHTML = "0";
			label2.innerHTML = "0";
			label3.innerHTML = "";
		}

		//Tell the model controller to reset.
		ModelController.reset();
		this.newGame();

		return true;
	},

	/**
	* Sets up a new game without changing the win counts.
	*
	* @method newGame
	* @return {Boolean} True on success.
	*/
	newGame : function(){
		var boardSize = ModelController.getBoardSize();

		//Sets all the spaces to be blank.
		for(var i = 0; i < boardSize; i++){
			this.setSrc(parseInt(i), "Images/Blank.jpg");
		}

		//Sets the winner announcement to be nothing.
		this.setInnerHTML('out', "");
		ModelController.newGame();
		return true;
	},

	/**
	* Gets a specified element by ID. Null if not found.
	*
	* @method getElement
	* @param {String} elementID the string representation of the element ID.
	* @return {Element} The element if found. Null if not.
	*/
	getElement : function(elementID){
		var element;

		//Try to find the element.
		try{
			element = document.getElementById(elementID);
		}catch(e){
			return null;
		}

		return element;
	},

	/**
	* Sets the inner HTML of an element if it can.
	*
	* @method setInnerHTML
	* @param {String} elementID The string representation of the element ID.
	* @param {String} HTML The HTML to be set.
	* @return {Boolean} True on success.
	*/
	setInnerHTML : function(elementID, HTML){
		var element = this.getElement(elementID);

		//If we found the element set the HTML and return true.
		if(element){
			element.innerHTML = HTML;
			return true;
		}
		return false;
	},

	/**
	* Sets the source for an element by element ID if it can.
	*
	* @method setSrc
	* @param {String} elementID The string representation of the element ID.
	* @param {String} src The string representation of the relative path to the source.
	*/
	setSrc : function(elementID, src){
		var element = this.getElement(elementID);

		//If we found the element set the source and return true.
		if(element){
			element.src = src;
			return true;
		}
		return false;
	},

	/**
	* Increments the score of playerNum on the display.
	*
	* @method incrementScore
	* @param {int} playerNum The player number to increment. Typically 1 or 2.
	* @return {int} The new score of that player.
	*/
	incrementScore : function(playerNum){
		var label;
		var winMessage;

		//If player 1 won. Get the label and set the win message.
		if(playerNum == 1){
			label = this.getElement('player1Score');
			winMessage = '<p>PLAYER 1 WINS!</p>';

		//Else player 2 won. Get the labels and set the win message.
		}else{
			label = this.getElement('player2Score');
			winMessage = '<p>PLAYER 2 WINS!</p>';
		}

		this.setInnerHTML('out', winMessage);

		//If we were able to find the label update it.
		if(label){
			var val = label.innerHTML;
			val = parseInt(val) + 1;
			label.innerHTML = val;
			return label.innerHTML;
		}
		return null;
	},
}