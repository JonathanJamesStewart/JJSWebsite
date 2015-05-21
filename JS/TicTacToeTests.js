$(document).ready(function(){
	testGameBoard.runTest();
});

var testGameBoard = {
	runTest : function(){
		QUnit.test("Test gameBoard.", function(assert){
			var b = new gameBoard();
			assert.ok(b.makeMove(0, -1), "Make valid move.");
			assert.notOk(b.makeMove(0, 1), "Make invalid move.");
			assert.notOk(b.makeMove(-1, 1), "Make move off board.");
		});
	}
};