/**
* @author Jonathan Stewart
*/

/**
* Holds and stores a set of rules that define win states
* for this game.
*
* @class RuleSet
*/
function RuleSet(){
	var rules = [];

	/**
	* Adds a rule to the rule collection.
	*
	* @method addRule
	* @param {int[]} rule An array of integers representing cells that must match to define a win.
	* @return {Boolean} True if the rule has been added.
	*/
	this.addRule = function(rule){

		//If the rule is not in the collection add it and return true.
		if(rules.indexOf(rule) == -1){
			rules.push(rule);
			return true;
		}
		return false;
	};

	/**
	* Returns the set of rules represented by an array of arrays. The external array
	* is the collection of rules and each internal array is an individual rule.
	* 
	* @method getRules
	* @return {int[int[]..int[]]} The representation of a collection of rules.
	*/
	this.getRules = function(){
		return rules;
	};

	/**
	* Returns the string representation of all rules. Could be better formatted.
	* 
	* @method toString
	* @return {String} The representation of all rules.
	*/
	this.toString = function(){
		var s = "";

		for(var i = 0; i < rules.length; i++){
			s += rules[i].toString() + ",";
		}

		return s;
	};
}