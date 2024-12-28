var gui_Button = $hxClasses["gui.Button"] = function(gui,stage,parent,action,isActive,onHover) {
	this.keyboardButton = null;
	this.canBeHeld = false;
	this.mouseOut = false;
	this.onUpdate = null;
	this.stage = stage;
	this.gui = gui;
	this.parent = parent;
	this.action = action;
	this.onHover = onHover;
	if(isActive == null) {
		isActive = function() {
			return false;
		};
	}
	this.isActive = isActive;
	this.buttonSound = Audio.get().buttonSound;
};
gui_Button.__name__ = "gui.Button";
gui_Button.__interfaces__ = [gui_IGUIElement];
gui_Button.prototype = {
	updateSize: function() {
		if(this.parent != null) {
			this.parent.updateSize();
		}
	}
	,updatePosition: function(newPosition) {
		this.rect.x = newPosition.x;
		this.rect.y = newPosition.y;
	}
	,handleMouse: function(mouse) {
		return this.doHandleMouse(mouse,function() {
		},function() {
		});
	}
	,doHandleMouse: function(mouse,onMouseIn,onMouseActive) {
		if(this.rect.contains(mouse.position)) {
			this.mouseOut = false;
			var claim = mouse.claimMouse(this,null,true,this.canBeHeld);
			if(claim == MouseState.Confirmed) {
				this.action();
				if(this.buttonSound != null) {
					Audio.get().playSound(this.buttonSound);
				}
			} else if(claim == MouseState.Active) {
				onMouseActive();
			} else {
				onMouseIn();
			}
			if(this.onHover != null) {
				this.onHover();
			}
			return true;
		}
		return false;
	}
	,update: function() {
		if(this.onUpdate != null) {
			this.onUpdate();
		}
		if(this.keyboardButton != null) {
			if(this.gui.get_keyboard().pressed[this.keyboardButton]) {
				this.action();
			}
		}
		this.mouseOut = true;
	}
	,destroy: function() {
	}
	,__class__: gui_Button
};
