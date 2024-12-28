var gui_TextInput = $hxClasses["gui.TextInput"] = function(parent,gui,game,placeholder,defaultText) {
	if(defaultText == null) {
		defaultText = "";
	}
	if(placeholder == null) {
		placeholder = "";
	}
	this.onInput = null;
	var _gthis = this;
	this.parent = parent;
	this.gui = gui;
	this.game = game;
	this.rect = new common_Rectangle(0,0,250,20);
	this.inputElement = window.document.createElement("input");
	this.inputElement.type = "text";
	this.inputElement.style.position = "absolute";
	this.inputElement.style.left = "10px";
	this.inputElement.style.top = "10px";
	this.inputElement.style.fontFamily = "Arial,sans-serif";
	this.inputElement.style.fontSize = "20px";
	this.inputElement.value = defaultText;
	this.inputElement.placeholder = placeholder;
	window.document.body.appendChild(this.inputElement);
	this.inputElement.focus();
	game.keyboard.inputs.push(this.inputElement);
	this.inputElement.addEventListener("input",function() {
		if(_gthis.onInput != null) {
			_gthis.onInput(_gthis.inputElement.value);
		}
	});
};
gui_TextInput.__name__ = "gui.TextInput";
gui_TextInput.__interfaces__ = [gui_IGUIElement];
gui_TextInput.prototype = {
	updateSize: function() {
		var tmp = "" + Math.floor(this.rect.width * this.game.get_preDPIAdjustScaling() - 6);
		this.inputElement.style.width = tmp + "px";
		var tmp = "" + Math.floor(10 * this.game.get_preDPIAdjustScaling());
		this.inputElement.style.fontSize = tmp + "px";
		var tmp = "" + Math.floor(this.rect.height * this.game.get_preDPIAdjustScaling() - 6);
		this.inputElement.style.height = tmp + "px";
	}
	,updatePosition: function(newPosition) {
		var tmp = Math.floor(newPosition.x * this.game.get_preDPIAdjustScaling());
		this.inputElement.style.left = tmp + "px";
		var tmp = Math.floor(newPosition.y * this.game.get_preDPIAdjustScaling());
		this.inputElement.style.top = tmp + "px";
		this.updateSize();
	}
	,destroy: function() {
		this.inputElement.parentNode.removeChild(this.inputElement);
		HxOverrides.remove(this.game.keyboard.inputs,this.inputElement);
	}
	,handleMouse: function(mouse) {
		if(this.rect.contains(mouse.position)) {
			return true;
		}
		return false;
	}
	,update: function() {
	}
	,__class__: gui_TextInput
};
