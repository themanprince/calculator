//importing things, no custom... fr
//first off and most importantly, the model
load("Model.js");
let theModel = new Model();
let KeyEvent = Java.type("javafx.scene.input.KeyEvent");
let KeyCode = Java.type("javafx.scene.input.KeyCode");
let ActionEvent = Java.type("javafx.event.ActionEvent");

//consuming all form of input by pasting and all that
theTextField.addEventHandler(KeyEvent.KEY_PRESSED, (event) => {
	//event will not be consumed for arrow keys so that they default actions can take place
	if(!([KeyCode.LEFT, KeyCode.RIGHT].some(key => event.code == key))) {
		if(event.code == KeyCode.ENTER)
			handleEql();
		else if(event.code == KeyCode.BACK_SPACE)
			backspace();
		event.consume();
	}
});
theTextField.addEventHandler(KeyEvent.KEY_TYPED, (event) => {
	if(/[0-9]+|\.|\(|\)|\+|\-|\*|\//.test(event.character)) {
		let textToAdd = null;
		//gon be adding em and they spaces
		switch(event.character) {
			case "(":
				textToAdd = "( ";
				break;
			case ")":
				textToAdd = " )";
				break;
			case "*":
				textToAdd = " x ";
				break;
			default:
				if(/\+|\-|\//.test(event.character))
					textToAdd = ` ${event.character} `;
				else
					textToAdd = event.character;
		}
		theTextField.text = theTextField.text + textToAdd;
	}
	//first repositioning the caret because of my right alignment
	theTextField.positionCaret(theTextField.text.length());
	//consume the event so default handlers don't get it... ha ha ha
	event.consume();
});

//for equals button. pressed or clicked
function handleEql() {
	let result = theModel.parseExpression(theTextField.text);
	theLabel.text = `${theTextField.text}  =  ${result}`;
	theTextField.text = result;
	theTextField.requestFocus();
	//repositioning caret
	theTextField.positionCaret(theTextField.text.length());
}

//handler for the backspace
function backspace() {
	if(theTextField.text[theTextField.text.length - 1] === " ")
		theTextField.text = theTextField.text.substring(0, theTextField.text.length - 1);
	
	//last setOfChars
	let setOfChars = theTextField.text.substring(theTextField.text.lastIndexOf(" ") + 1);
	//removing last set of chars
	theTextField.text = theTextField.text.substring(0, theTextField.text.lastIndexOf(" ") + 1);

	if(/\+|\-|\/|x|\)/.test(setOfChars)) { //gon remove the space preceding any binary operator or closing brace
		theTextField.text = theTextField.text.substring(0, theTextField.text.length - 1);
	}
	//returning focus to the textfield
	theTextField.requestFocus();
	theTextField.positionCaret(theTextField.text.length);
}

//next, the buttons handler
function buttonHandler(event) {
	let btnText = event.target.text; //which is gon be a button
	let textToAdd = null;
	//gon be adding em and they spaces to the textfield
	switch(btnText) {
		case "(":
			textToAdd = "( ";
			break;
		case ")":
			textToAdd = " )";
			break;
		default:
				if(/\+|\-|\x|\//.test(btnText))
					textToAdd = ` ${btnText} `;
				else if(event.target == sqrt)
					textToAdd = "sqrt( ";
				else if(event.target == sq)
					textToAdd = "sq( ";
				else
					textToAdd = btnText;
	}
	if(!(btnText == "CE" || btnText == "=" || event.target == back)) //excluding these buttons from the event shit
		theTextField.text = theTextField.text + textToAdd;

	theTextField.requestFocus();
	theTextField.positionCaret(theTextField.text.length);
}
rootGridPane.lookupAll("Button").forEach(btn => btn.addEventHandler(ActionEvent.ACTION, buttonHandler));