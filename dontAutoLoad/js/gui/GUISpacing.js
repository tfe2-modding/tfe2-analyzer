var gui_GUISpacing = $hxClasses["gui.GUISpacing"] = function(parent,extraSpace) {
	this.parent = parent;
	this.rect = new common_Rectangle(0,0,1,1);
	this.rect.width = extraSpace.x;
	this.rect.height = extraSpace.y;
};
gui_GUISpacing.__name__ = "gui.GUISpacing";
gui_GUISpacing.__interfaces__ = [gui_IGUIElement];
gui_GUISpacing.prototype = {
	updateSize: function() {
		this.parent.updateSize();
	}
	,updatePosition: function(newPosition) {
		var _this = this.rect;
		new common_Point(_this.x = newPosition.x,_this.y = newPosition.y);
	}
	,destroy: function() {
	}
	,handleMouse: function(mouse) {
		return false;
	}
	,update: function() {
	}
	,__class__: gui_GUISpacing
};
