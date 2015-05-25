$(document).ready(function(){
	testTicTacToe.testRuleSet();
	testTicTacToe.testPlayer();
	testTicTacToe.testGameBoard();
	testTicTacToe.testPersonPlayer();
	testTicTacToe.testPlayerTurnManager();
	testTicTacToe.testAIPlayer();
	testTicTacToe.testPlayerFactory();
	testTicTacToe.testModelController();
	testTicTacToe.testDisplayAdapter();
});

var testTicTacToe = {
	testRuleSet : function(){
		QUnit.test("Test RuleSet.", function(assert){
			//Create a ruleset.
			var rule = [1,2,3];
			var ruleSet = new RuleSet();

			//Add a rule.
			assert.ok(ruleSet.addRule(rule), "addRule() is working.");
			//Get the rule we just added.
			assert.equal(ruleSet.getRules()[0], rule, "getRule() is working.");
		});
	},

	testPlayer : function(){
		QUnit.test("Test Player.", function(assert){
			//Create a new player.
			var player = new Player(1, "Images/X.jpg", .5);

			//Set the player value.
			assert.equal(player.getPlayerValue(), 1, "playerValue is set.");
			//Ensure the playerPath is set correctly.
			assert.equal(player.getPlayerImagePath(), "Images/X.jpg", "getPlayerImagePath is set.");
			//Check that we can set the difficulty.
			assert.ok(player.setDifficulty(.2), "setDifficulty() returns true.");
			//We cannot set difficulties outside 0-1.
			assert.notOk(player.setDifficulty(1.5), "setDifficulty() returns false.");
			//Get the difficulty. Ensure that it did not change.
			assert.equal(player.getDifficulty(), .2, "getDifficulty() works.");
		});
	},

	testGameBoard : function(){
		QUnit.test("Test gameBoard.", function(assert){
			//Create a new board and ruleset.
			var board = [0,0,0,0,0,0,0,0,0];
			var neutralValue = 0;
			var ruleSet = new RuleSet();
			ruleSet.addRule([0,1,2]);
			var gameBoard = new GameBoard(board, neutralValue, ruleSet);
			var player = new Player(1, "Images/X.jpg");

			gameBoard.makeMove(player, 1);

			//Check that we can make a valid move.
			assert.ok(gameBoard.makeMove(player, 0), "Make a valid move.");
			//Check that invalid moves are rejected.
			assert.notOk(gameBoard.makeMove(player, 0), "Make an invalid move.");
			//Ensure that the valid move is actually executed.
			assert.ok(gameBoard.isTaken(0), "Index of 0 is taken.");
			//Check that open moves are still available.
			assert.notOk(gameBoard.isTaken(5), "Index of 5 is not taken.");
			//Check empty count.
			assert.equal(gameBoard.emptyCount(), 7, "Board should have 7 empty spaces.");
			//There is no winner currently. Check it.
			assert.equal(gameBoard.checkWin(), 0, "checkWin() returns neutralValue.");
			//Make another move on index 2.
			gameBoard.makeMove(player, 2);
			//There is now a winner. Check that it is so.
			assert.equal(gameBoard.checkWin(), player.getPlayerValue(), "checkWin() returns playerValue.");
			//Make a copy of the current board.
			var copy = gameBoard.copyBoard(gameBoard);
			//Ensure the copies are equal.
			assert.equal(copy.toString(), gameBoard.toString(), "copyBoard() returns a copy.");
			//Make a move on the new board.
			copy.makeMove(player, 5);
			//Make sure changes to the copy do not affect the original.
			assert.notEqual(copy.toString(), gameBoard.toString(), "Changes to copy do not affect original.");
			//Make sure getSpaceValue is working.
			assert.equal(gameBoard.getSpaceValue(0), 1, "getSpaceValue() is working.");
			//Make sure getBoardSize is working.
			assert.equal(gameBoard.getBoardSize(), 9, "getBoardSize() is working.");
			//Make sure getNeutralValue is working.
			assert.equal(gameBoard.getNeutralValue(), 0, "getNeutralValue() is working.");
		});
	},

	testPersonPlayer : function(){
		QUnit.test("Test PersonPlayer.", function(assert){
			//create a personplayer, ruleset, gameboard, and playerturnmanager.
			PersonPlayer.prototype = new Player(-1, "Images/X.jpg");
			var person = new PersonPlayer();
			var ruleSet = new RuleSet();
			ruleSet.addRule([0,1,2]);
			var board = new GameBoard([-1,0,0,0,0,0,0,0,0], 0, ruleSet);
			board.makeMove(person, 0);
			var ptm = new PlayerTurnManager();
			ptm.addPlayer(person);

			//Ensure the prototype chain is correct.
			assert.equal(person.getPlayerValue(), -1, "Prototype chain is set up correctly.");
			assert.equal(person.getPlayerImagePath(), "Images/X.jpg", "Prototype chain is still set up correctly.");
			//Test that personplayer detects the difference correctly.
			assert.equal(person.makeMove(board, ptm).move, 0, "PersonPlayer.makeMove() should return 0.");
			board.makeMove(person, 1);
			assert.equal(person.makeMove(board, ptm).move, 1, "PersonPlayer.makeMove() should return 1.");
		});
	},

	testPlayerTurnManager : function(){
		QUnit.test("Test PlayerTurnManager.", function(assert){
			//Set up a player, and playerTurnManager.
			var ptm = new PlayerTurnManager();
			var p1 = new Player(1, "Images/X.jpg");
			var p2 = new Player(-1, "Images/O.jpg");
			var playerList = [];
			playerList.push(p1);
			playerList.push(p2);
			assert.ok(ptm.addPlayer(p1), "Insert p1.");
			ptm.addPlayer(p2);

			//Ensure the playerTurnManager is processing the queue correctly.
			assert.equal(ptm.nextPlayer().toString(), p1.toString(), "nextPlayer() should return p1.");
			assert.equal(ptm.nextPlayer().toString(), p2.toString(), "nextPlayer() should return p2.");
			assert.equal(ptm.nextPlayer().toString(), p1.toString(), "nextPlayer() should return p1.");
			//Make sure getCurrentPlayer is working.
			assert.equal(ptm.getCurrentPlayer().toString(), p1.toString(), "getCurrentPlayer() should reutrn p1.");
			var copy = ptm.copyPTM();
			//Make sure we get a valid copy.
			assert.equal(ptm.toString(), copy.toString(), "copyPTM() is working.");
			//Progress the copy to the next player.
			assert.equal(copy.nextPlayer().toString(), p2.toString(), "copy.nextPlayer() should return p2.");
			//Make sure changes to the copy do not effect the original.
			assert.notEqual(ptm.toString(), copy.toString(), "Changes to copy do not affect the original.");
			//Check that getPlayerCount is working.
			assert.equal(ptm.getPlayerCount(), 2, "getPlayerCount() should return 2.");
		});
	},

	testAIPlayer : function(){
		QUnit.test("Test AIPlayer.", function(assert){
			//Set up an AIPlayer, ruleset, boards, and PTM.
			AIPlayer.prototype = new Player(1, "Images/O.jpg", DIFFICULTY.HARD);
			var ai = new AIPlayer();
			var p = new Player(-1, "Images/X.jpg", DIFFICULTY.HARD);
			var ruleSet = new RuleSet();
			var mc = ModelController;
			ruleSet = mc.makeRules();
			var board = new GameBoard([1,-1,1,1,-1,-1,-1,1,0], 0, ruleSet);
			var board2 = new GameBoard([1,-1,1,-1,0,-1,1,-1,1], 0, ruleSet);
			var board3 = new GameBoard([-1,0,0,0,0,0,0,0,0], 0, ruleSet);
			var ptm = new PlayerTurnManager();
			ptm.addPlayer(ai);
			ptm.addPlayer(p);

			//Check the prototype chain.
			assert.equal(ai.getPlayerValue(), 1, "Prototype chain is correct.");
			assert.equal(ai.getPlayerImagePath(), "Images/O.jpg", "Prototype chain is correct.");
			//Make sure the ai is picking the correct moves.
			assert.equal(ai.makeMove(board, ptm).move, 8, "AI should pick 8.");
			assert.equal(ai.makeMove(board2, ptm).move, 4, "AI should pick 4.");
			assert.equal(ai.makeMove(board3, ptm).move, 4, "AI should pick 4.");
		});
	},

	testPlayerFactory : function(){
		QUnit.test("Test PlayerFactory.", function(assert){
			//Set up a human and computer player.
			var human = MakePlayer(PLAYER_TYPE.HUMAN);
			var computer = MakePlayer(PLAYER_TYPE.COMPUTER);

			//Check the prototype chain of each.
			assert.equal(human.getPlayerValue(), -1, "Human is created correctly");
			assert.equal(computer.getPlayerValue(), 1, "Computer is created correctly.");
		});
	},

	testModelController : function(){
		QUnit.test("Test ModelController.", function(assert){
			//Set up a ModelController and board.
			var mc = ModelController;
			var b = [0,0,0,0,0,0,0,0,0];
			var board = new GameBoard(b, 0, mc.makeRules());

			//Make sure init is working.
			assert.equal(mc.init().toString(), b.toString(), "init() returns the new board.");

			//Make a move on the board and then check that the ai retuns a value from accepted values.
			var move = mc.makeMove(4);
			var moves = [0,2,6,8];
			var m;
			if(moves.indexOf(move) != -1){
				m = move;
			}

			assert.equal(move, m, "makeMove() will return 0,2,6, or 8.");
			//There should be no winner.
			assert.notOk(mc.checkWin(board), "checkWin() of empty board is no winner.");

			//Set up a new board.
			b = [1,1,1,0,0,0,0,0,0];
			board = new GameBoard(b, 0, mc.makeRules());

			//Check that checkWin is working.
			assert.ok(mc.checkWin(board), "checkWin() returns true.");
			//Cannot test incrementScore because the elements are not there. Requires live test.
			assert.equal(mc.incrementScore(1), null, "incrementScore() will return null b/c no corresponding elements.");
			//Change the difficulty.
			assert.equal(mc.changeDifficulty(DIFFICULTY.HARD), DIFFICULTY.HARD, "changeDifficulty() returns new value.");
			//Change the number of players.
			assert.equal(mc.changeNumPlayers(2), 2, "changeNumPlayers() returns new player number.");

			//Set up a blank board. Make sure that a new board is returned.
			b = [0,0,0,0,0,0,0,0,0];

			assert.equal(mc.reset().toString(), b.toString(), "reset() returns empty board as confirmation.");
			assert.equal(mc.newGame().toString(), b.toString(), "newGame() returns empty board as confirmation.");

			//Create a new ruleset and compare it against the return value of makeRules.
			var r = new RuleSet();
			r.addRule([0,1,2]);
			r.addRule([3,4,5]);
			r.addRule([6,7,8]);
			r.addRule([0,3,6]);
			r.addRule([1,4,7]);
			r.addRule([2,5,8]);
			r.addRule([0,4,8]);
			r.addRule([2,4,6]);
			assert.equal(mc.makeRules().toString(), r.toString(), "makeRules() returns the correct rule set.");
		});
	},

	testDisplayAdapter : function(){
		QUnit.test("Test DisplayAdapter.", function(assert){
			//Set up a modelcontroler and displayadapter.
			var mc = ModelController;
			var da = DisplayAdapter;
			var b = [0,0,0,0,0,0,0,0,0];
			var board = new GameBoard(b, 0, mc.makeRules());
			mc.init();

			//Bust a move. Check that the return value is in the list of accepted values.
			var move = mc.makeMove(4);
			var moves = [0,2,6,8];
			var m;
			if(moves.indexOf(move) != -1){
				m = move;
			}
			assert.equal(da.makeMove(4), m, "makeMove() should return the move mc decided to make.");

			//Check changeDifficulty.
			assert.equal(da.changeDifficulty("Easy"), "Easy", "changeDifficulty() returns new difficulty.");
			//changeNumPlayers should echo on success.
			assert.equal(da.changeNumPlayers(2), 2, "changeNumPlayers() returns new player count.");
			//Check that reset works.
			assert.ok(da.reset(), "reset() returns true on success.");
			//Check that newGame works.
			assert.ok(da.newGame(), "newGame() returns true on success.");
			//Make sure we can get elements sucessfully.
			assert.equal(da.getElement('qunit').id, 'qunit', "getElement() returns element.");
			//element with ID of out does not exist.
			assert.equal(da.getElement('out'), null, "getElement() returns null on failure.");
		});
	}
};