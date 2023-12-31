//how do you tell a joke in jjs... say you don't support classes but support function prototypes
//now tell the same joke in english
function Model() {
	//constructor pretty much useless now
	this.operatorList = ['+', '-', '*', '/'];
	this.expressionDelimiters = ["(", "sqrt(", "sq("];
}
Model.prototype.parseExpression  = function(string, tokenList = []) {
	while(string.length > 0) { //while we got tokens
		var/*bad practice.. Heard var doesn't have principled block scoping*/ currToken = (string.indexOf(" ") != -1)? string.substring(0, string.indexOf(" ")) : string; //just incase we got only one shit left
		string = string.substring(currToken.length + 1).trim(); //remove current token from string and space after it
		if(this.expressionDelimiters.some(el => el == currToken)) { //this token denotes start of subexpression
			//boutta do the open and closing brace algorihtm again
			let openBraces = 1, closeBraces = 0, currIndex = 0;
			for(let char of string) {
				switch(char) {
					case "(":
						openBraces++;
						break;
					case ")":
						closeBraces++;
						break;
					case "sq(":
						openBraces++;
						break;
					case "sqrt(":
						openBraces++;
						break;
				}
				currIndex++; //we gon need this one to cut out the expression
				if(openBraces == closeBraces)
					break;
			}
			//got here means we either broke out of the loop or we at the end of the string
			var subExpression = string.substring(0, currIndex).trim(); //don't worry, we gon remove that end bracket
			//removing subExpression from string
			string = string.substring(subExpression.length).trim();
			//gon parse the subExpression before applying the sq/sqrt to it(if any)
			let interVal = this.parseExpression(subExpression.substring(0, subExpression.lastIndexOf(")") - 1).trim());
			switch(currToken) {
				case "sq(":
					currToken = Math.pow(interVal, 2);
					break;
				case "sqrt(":
					currToken = Math.sqrt(interVal);
					break;
				default:
					currToken = interVal;
			}
		}
		tokenList.push(currToken);

	}
	try {
		//doing bodmas on the bitch
		let div = combineEm(tokenList, "/");
		let mul = combineEm(div, "x");
		let add = combineEm(mul, "+");
		let sub = combineEm(add, "-");
		return sub.join("");
	} catch(error) {
		print(`Error oo!... I catch am.\nError Message:\n` + error);
		return;
	}
}

//Next is a function to combine all operands with a specified operator btw em
let combineEm = (list, operator) => {
	//gon be using a java arraylist then I'm gon map em back to the original list
	//cus of java's remove method
	let ArrayList = Java.type("java.util.ArrayList");
	let myList = new ArrayList();
	list.forEach(el => myList.add(el));
	while(myList.indexOf(operator) !== -1) {
		//going thru all the el till I get the oerator
		for(let i = 0; i < myList.size(); i++) {
			if(myList.get(i) == operator){
				let prev = parseFloat(myList.get(i - 1)), next = parseFloat(myList.get(i + 1));
				if(isNaN(prev) || isNaN(next)) //just learned something I apparently already knew... weird!
					throw new SyntaxError("Abeg check wetin you dey type for parser..\nAbeg.. E fit be whitespace matter or wrong spelling\nor wrong character used for operator");
				let res = 0;
				switch(operator) {
					case '+':
						//adding next and prev val
						res = prev + next;
						break;
					case '-':
						//subbing next and prev els
						res = prev - next;
						break;
					case 'x':
						//mulling next and prev els
						res = prev * next;
						break;
					case '/':
						//diving next and prev els
						res = prev / next;
						break;
				}
				myList.set(i - 1, res);
				myList.remove(i + 1); //turns out order of removal actually matters bruh lmao.. got outOfBounds before
				myList.remove(i);
				break; //e geh y... omor, nur touch anything for this function as e dey work so...
				//yoke oo!
			}
		}
	}
	//got here, so we out of specified operator
	//setting list to new obtained array
	list = [];
	myList.forEach(el => list.push(el));
	return list;
};