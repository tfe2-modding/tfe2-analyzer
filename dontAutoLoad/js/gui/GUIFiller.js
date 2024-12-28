var gui_GUIFiller = $hxClasses["gui.GUIFiller"] = function(parent,minFill) {
	if(minFill == null) {
		minFill = 0;
	}
	this.parent = parent;
	this.minFill = minFill;
	this.rect = new common_Rectangle(0,0,1,1);
};
gui_GUIFiller.__name__ = "gui.GUIFiller";
gui_GUIFiller.__interfaces__ = [gui_IGUIElement];
gui_GUIFiller.prototype = {
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
	,__class__: gui_GUIFiller
};
