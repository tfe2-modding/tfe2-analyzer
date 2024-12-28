var Keyboard = $hxClasses["Keyboard"] = function(game) {
	this.inputs = [];
	var _gthis = this;
	var _g = [];
	var _g1 = 0;
	while(_g1 < 256) {
		var i = _g1++;
		_g.push(false);
	}
	this.nextPressed = _g;
	var _g = [];
	var _g1 = 0;
	while(_g1 < 256) {
		var i = _g1++;
		_g.push(false);
	}
	this.nextDown = _g;
	var _g = [];
	var _g1 = 0;
	while(_g1 < 256) {
		var i = _g1++;
		_g.push(false);
	}
	this.pressed = _g;
	var _g = [];
	var _g1 = 0;
	while(_g1 < 256) {
		var i = _g1++;
		_g.push(false);
	}
	this.down = _g;
	Keyboard.mobileBackPressed = false;
	window.addEventListener("keydown",function(event) {
		var keyCode = event.keyCode;
		if(game.workshopOverlay != null && game.workshopOverlay.isOpen() && keyCode != 27) {
			return;
		}
		if(common_ArrayExtensions.any(_gthis.inputs,function(ie) {
			return ie == window.document.activeElement;
		}) && keyCode != 27) {
			return;
		}
		if(event.key != null) {
			if(event.key == "Delete") {
				keyCode = 46;
			}
			if(event.key == "Control") {
				keyCode = 17;
			}
		}
		if(keyCode < 256) {
			if(!_gthis.nextDown[keyCode]) {
				_gthis.nextPressed[keyCode] = true;
				_gthis.nextDown[keyCode] = true;
			}
		}
		event.preventDefault();
	},jsFunctions.getPassiveEventListenerVar());
	window.addEventListener("keyup",function(event) {
		var keyCode = event.keyCode;
		if(game.workshopOverlay != null && game.workshopOverlay.isOpen() && keyCode != 27) {
			return;
		}
		if(keyCode < 256) {
			_gthis.nextDown[keyCode] = false;
		}
		if(keyCode == 122) {
			jsFunctions.goFullscreen(true);
		}
		event.preventDefault();
	},jsFunctions.getPassiveEventListenerVar());
	window.document.addEventListener("visibilitychange",function() {
		if(window.document.visibilityState == "hidden") {
			var _g = 0;
			while(_g < 256) {
				var i = _g++;
				_gthis.nextDown[i] = false;
			}
		}
	});
	window.addEventListener("focus",function() {
		var _g = 0;
		while(_g < 256) {
			var i = _g++;
			_gthis.nextDown[i] = false;
		}
		Keyboard.mobileBackPressed = false;
	},false);
	window.addEventListener("blur",function() {
		var _g = 0;
		while(_g < 256) {
			var i = _g++;
			_gthis.nextDown[i] = false;
		}
		Keyboard.mobileBackPressed = false;
	},false);
};
Keyboard.__name__ = "Keyboard";
Keyboard.getLetterCode = function(letter) {
	var code = HxOverrides.cca(letter,0);
	if(code >= 97 && code <= 122) {
		code -= 32;
	}
	return code;
};
Keyboard.prototype = {
	anyKey: function() {
		var _g = 0;
		while(_g < 256) {
			var k = _g++;
			if(this.pressed[k]) {
				return true;
			}
		}
		return false;
	}
	,anyBack: function() {
		if(!this.pressed[27]) {
			return Keyboard.mobileBackPressed;
		} else {
			return true;
		}
	}
	,update: function() {
		var _g = 0;
		while(_g < 256) {
			var i = _g++;
			if(this.nextDown[i]) {
				this.down[i] = true;
			} else {
				this.down[i] = false;
			}
			if(this.nextPressed[i]) {
				this.pressed[i] = true;
				this.nextPressed[i] = false;
			}
		}
	}
	,postUpdate: function() {
		var _g = 0;
		while(_g < 256) {
			var i = _g++;
			this.pressed[i] = false;
		}
		Keyboard.mobileBackPressed = false;
	}
	,__class__: Keyboard
};
