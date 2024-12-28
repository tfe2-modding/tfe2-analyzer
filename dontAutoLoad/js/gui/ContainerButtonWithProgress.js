var gui_ContainerButtonWithProgress = $hxClasses["gui.ContainerButtonWithProgress"] = function(gui,stage,parent,action,isActive,onHover,buttonSpriteName,backColor,frontColor,autoSetProgress) {
	if(frontColor == null) {
		frontColor = 16777215;
	}
	if(backColor == null) {
		backColor = 10526880;
	}
	if(buttonSpriteName == null) {
		buttonSpriteName = "spr_button";
	}
	this.progressAmount = 0;
	gui_ContainerButton.call(this,gui,stage,parent,action,isActive,onHover,buttonSpriteName);
	this.graphics = new PIXI.Graphics(false);
	stage.addChild(this.graphics);
	this.backColor = backColor;
	this.frontColor = frontColor;
	this.autoSetProgress = autoSetProgress;
};
gui_ContainerButtonWithProgress.__name__ = "gui.ContainerButtonWithProgress";
gui_ContainerButtonWithProgress.__super__ = gui_ContainerButton;
gui_ContainerButtonWithProgress.prototype = $extend(gui_ContainerButton.prototype,{
	update: function() {
		gui_ContainerButton.prototype.update.call(this);
		if(this.autoSetProgress != null) {
			this.setProgress(this.autoSetProgress());
		}
	}
	,updateProgressDisplay: function() {
		if(this.progressAmount < 0) {
			this.graphics.clear();
			return;
		}
		var _this = this.rect;
		var inlPoint_x = _this.x;
		var inlPoint_y = _this.y;
		this.graphics.position.x = inlPoint_x;
		var _this = this.rect;
		var inlPoint_x = _this.x;
		var inlPoint_y = _this.y;
		this.graphics.position.y = inlPoint_y;
		this.graphics.clear().beginFill(this.backColor,1).drawRect(1,1,this.rect.width - 2,this.rect.height - 2).endFill().beginFill(this.frontColor,1).drawRect(1,1,Math.round((this.rect.width - 2) * this.progressAmount),this.rect.height - 2).endFill();
	}
	,updatePosition: function(newPosition) {
		gui_ContainerButton.prototype.updatePosition.call(this,newPosition);
		this.updateProgressDisplay();
	}
	,updateSizeDisplay: function() {
		gui_ContainerButton.prototype.updateSizeDisplay.call(this);
		this.updateProgressDisplay();
	}
	,setProgress: function(progressAmount) {
		this.progressAmount = progressAmount;
		this.updateProgressDisplay();
	}
	,destroy: function() {
		gui_ContainerButton.prototype.destroy.call(this);
		this.graphics.destroy();
	}
	,__class__: gui_ContainerButtonWithProgress
});
