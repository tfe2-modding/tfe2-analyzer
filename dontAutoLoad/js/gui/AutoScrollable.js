var gui_AutoScrollable = $hxClasses["gui.AutoScrollable"] = function(game,outerStage,parent,position,width,height,origin) {
	this.maxWidth = width;
	this.maxHeight = height;
	gui_Scrollable.call(this,game,outerStage,parent,position,width,height,origin);
};
gui_AutoScrollable.__name__ = "gui.AutoScrollable";
gui_AutoScrollable.__super__ = gui_Scrollable;
gui_AutoScrollable.prototype = $extend(gui_Scrollable.prototype,{
	updateSize: function() {
		if(this.child != null) {
			var val1 = this.maxWidth;
			var val2 = this.child.rect.width;
			this.rect.width = val2 < val1 ? val2 : val1;
			var val1 = this.maxHeight;
			var val2 = this.child.rect.height;
			this.rect.height = val2 < val1 ? val2 : val1;
		}
		gui_Scrollable.prototype.updateSize.call(this);
	}
	,updatePosition: function(newPosition) {
		gui_Scrollable.prototype.updatePosition.call(this,newPosition);
	}
	,__class__: gui_AutoScrollable
});
