var gui_TextElement = $hxClasses["gui.TextElement"] = function(parent,stage,text,textUpdateFunction,font,padding,maxWidth,neverDecreaseSize,fixedSizeForLang) {
	if(fixedSizeForLang == null) {
		fixedSizeForLang = false;
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
	var textContainer = new graphics_BitmapText("",{ font : font, tint : 0},fixedSizeForLang);
	textContainer.set_maxWidth(maxWidth);
	this.container = textContainer;
	this.setTextWithoutSizeUpdate(text);
	this.textUpdateFunction = textUpdateFunction;
	this.neverDecreaseSize = neverDecreaseSize;
	var addToPadding;
	switch(font) {
	case "Arial":
		addToPadding = { left : 0, right : 0, top : -2, bottom : 2};
		break;
	case "Arial10":
		addToPadding = { left : 0, right : 0, top : -3, bottom : 3};
		break;
	case "Arial15":
		addToPadding = { left : 0, right : 0, top : -3, bottom : 2};
		break;
	case "Arial16":
		addToPadding = { left : 0, right : 0, top : -2, bottom : 4};
		break;
	default:
		addToPadding = { left : 0, right : 0, top : -3, bottom : 2};
	}
	if(padding == null) {
		padding = addToPadding;
	} else {
		padding = { left : padding.left + addToPadding.left, right : padding.right + addToPadding.right, top : padding.top + addToPadding.top, bottom : padding.bottom + addToPadding.bottom};
	}
	gui_ContainerHolder.call(this,parent,stage,textContainer,padding);
};
gui_TextElement.__name__ = "gui.TextElement";
gui_TextElement.__super__ = gui_ContainerHolder;
gui_TextElement.prototype = $extend(gui_ContainerHolder.prototype,{
	get_textContainer: function() {
		return this.container;
	}
	,updateSize: function() {
		var newWidth;
		var newHeight;
		var oldWidthNoPadding = this.rect.width - this.padding.left - this.padding.right;
		var oldHeightNoPadding = this.rect.height - this.padding.top - this.padding.bottom;
		if(this.get_textContainer().get_text() == "") {
			newWidth = 0;
			newHeight = 0;
		} else {
			var bitmapContainer = this.container;
			newWidth = Math.round(bitmapContainer.get_textWidth());
			newHeight = Math.round(bitmapContainer.get_textHeight());
		}
		if(this.neverDecreaseSize) {
			this.rect.width = newWidth > oldWidthNoPadding ? newWidth : oldWidthNoPadding;
			this.rect.height = newHeight > oldHeightNoPadding ? newHeight : oldHeightNoPadding;
		} else {
			this.rect.width = newWidth;
			this.rect.height = newHeight;
		}
		if(oldWidthNoPadding != this.rect.width || oldHeightNoPadding != this.rect.height) {
			gui_ContainerHolder.prototype.afterSizeUpdate.call(this);
		}
	}
	,setTextAndTextUpdate: function(text,updateFunc) {
		this.setText(text);
		this.textUpdateFunction = updateFunc;
	}
	,setText: function(text) {
		this.setTextWithoutSizeUpdate(text);
		this.updateSize();
	}
	,setTextWithoutSizeUpdate: function(text) {
		var bitmapContainer = this.get_textContainer();
		if(StringTools.startsWith(text,"[red]")) {
			text = HxOverrides.substr(text,"[red]".length,null);
			bitmapContainer.set_tint(16711680);
		} else if(StringTools.startsWith(text,"[blue]")) {
			text = HxOverrides.substr(text,"[blue]".length,null);
			bitmapContainer.set_tint(16528);
		} else if(StringTools.startsWith(text,"[green]")) {
			text = HxOverrides.substr(text,"[green]".length,null);
			bitmapContainer.set_tint(65280);
		} else if(StringTools.startsWith(text,"[white]")) {
			text = HxOverrides.substr(text,"[white]".length,null);
			bitmapContainer.set_tint(16777215);
		} else {
			bitmapContainer.set_tint(0);
		}
		this.get_textContainer().set_text(text);
	}
	,update: function() {
		if(this.textUpdateFunction != null) {
			var newText = this.textUpdateFunction();
			if(this.get_textContainer().get_text() != newText) {
				this.setText(newText);
			}
		}
	}
	,__class__: gui_TextElement
});
