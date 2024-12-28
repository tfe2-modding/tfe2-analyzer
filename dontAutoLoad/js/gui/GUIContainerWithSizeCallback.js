var gui_GUIContainerWithSizeCallback = $hxClasses["gui.GUIContainerWithSizeCallback"] = function(gui,stage,parent,position,origin,children,background,padding) {
	this.sizeCallback = null;
	gui_GUIContainer.call(this,gui,stage,parent,position,origin,children,background,padding);
};
gui_GUIContainerWithSizeCallback.__name__ = "gui.GUIContainerWithSizeCallback";
gui_GUIContainerWithSizeCallback.__super__ = gui_GUIContainer;
gui_GUIContainerWithSizeCallback.prototype = $extend(gui_GUIContainer.prototype,{
	setSizeCallback: function(newSizeCallback) {
		this.sizeCallback = newSizeCallback;
	}
	,updateSize: function() {
		gui_GUIContainer.prototype.updateSize.call(this);
		if(this.sizeCallback != null) {
			this.sizeCallback();
		}
	}
	,__class__: gui_GUIContainerWithSizeCallback
});
