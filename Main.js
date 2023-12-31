//importing types...
let Scene = Java.type("javafx.scene.Scene");
let layout = Packages.javafx.scene.layout;
let VBox = layout.VBox;
let FXMLLoader = Java.type("javafx.fxml.FXMLLoader");
let URL = Java.type("java.net.URL");

function start(stage) {
	let loader = new FXMLLoader();
	loader.location = new URL(new URL("file:"), "./DaView.fxml");
	let root;
	try {
		root = loader.load();
	} catch(exception) {
		print("\n");
		exception.printStackTrace();
	}

	let theScene = new Scene(root);
	theScene.stylesheets.add(new URL(new URL("file:"), "./Style.css").toExternalForm());
	stage.scene = theScene;
	stage.title= "Prvnce Calc";
	stage.resizable = false;
	stage.show();
}