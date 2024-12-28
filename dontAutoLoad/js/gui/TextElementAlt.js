var gui_TextElementAlt = $hxClasses["gui.TextElementAlt"] = function(parent,stage,text,textUpdateFunction,font,padding,maxWidth,neverDecreaseSize,fontSize,color) {
	if(color == null) {
		color = 0;
	}
	if(fontSize == null) {
		fontSize = 12;
	}
	if(neverDecreaseSize == null) {
		neverDecreaseSize = false;
	}
	if(maxWidth == null) {
		maxWidth = 250;
	}
	if(font == null) {
		font = "Arial";
	}
	if(text == null) {
		text = "";
	}
	var textContainer = new PIXI.Text("",{ fontFamily : font, fill : color, fontSize : fontSize * 2, wordWrap : true, wordWrapWidth : maxWidth * 2});
	textContainer.text = text;
	textContainer.scale.x = 0.5;
	textContainer.scale.y = 0.5;
	textContainer.roundPixels = true;
	this.textUpdateFunction = textUpdateFunction;
	this.neverDecreaseSize = neverDecreaseSize;
	if(padding == null) {
		padding = { left : 0, right : 0, top : -3, bottom : 2};
	}
	gui_ContainerHolder.call(this,parent,stage,textContainer,padding);
};
gui_TextElementAlt.__name__ = "gui.TextElementAlt";
gui_TextElementAlt.__super__ = gui_ContainerHolder;
gui_TextElementAlt.prototype = $extend(gui_ContainerHolder.prototype,{
	get_textContainer: function() {
		return this.container;
	}
	,setText: function(text) {
		var textContainer = this.container;
		textContainer.text = text;
		textContainer.updateText();
		textContainer.updateTexture();
		textContainer.updateTransform();
		this.updateSize();
	}
	,update: function() {
		if(this.textUpdateFunction != null) {
			var newText = this.textUpdateFunction();
			if(this.get_textContainer().text != newText) {
				this.setText(newText);
			}
		}
	}
	,__class__: gui_TextElementAlt
});
