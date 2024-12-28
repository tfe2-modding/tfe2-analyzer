var gui_ContainerHolder = $hxClasses["gui.ContainerHolder"] = function(parent,stage,container,padding,update,handleMouse) {
	this.container = container;
	this.stage = stage;
	this.updateFunction = update;
	this.handleMouseFunction = handleMouse;
	stage.addChild(container);
	this.rect = new common_Rectangle(0,0,0,0);
	if(padding == null) {
		padding = { left : 0, top : 0, right : 0, bottom : 0};
	}
	this.padding = padding;
	this.updateSize();
	this.parent = parent;
};
gui_ContainerHolder.__name__ = "gui.ContainerHolder";
gui_ContainerHolder.__interfaces__ = [gui_IGUIElement];
gui_ContainerHolder.prototype = {
	updateSize: function() {
		var m = this.container;
		if(((this.container) instanceof gui_MaterialsCostDisplay) || ((this.container) instanceof gui_MaterialsDisplay)) {
			this.rect.width = Math.round(m.displayWidth);
		} else {
			this.rect.width = Math.round(this.container.width);
		}
		this.rect.height = Math.round(this.container.height);
		this.afterSizeUpdate();
	}
	,afterSizeUpdate: function() {
		this.rect.width += this.padding.left + this.padding.right;
		this.rect.height += this.padding.top + this.padding.bottom;
		if(this.parent != null) {
			this.parent.updateSize();
		}
	}
	,updatePosition: function(newPosition) {
		this.rect.x = newPosition.x;
		this.rect.y = newPosition.y;
		this.container.position.x = newPosition.x + this.padding.left;
		this.container.position.y = newPosition.y + this.padding.top;
	}
	,handleMouse: function(mouse) {
		if(this.handleMouseFunction != null) {
			return this.handleMouseFunction(mouse);
		}
		return false;
	}
	,update: function() {
		if(this.updateFunction != null) {
			this.updateFunction();
		}
	}
	,destroy: function() {
		this.container.destroy({ children : true});
	}
	,__class__: gui_ContainerHolder
};
