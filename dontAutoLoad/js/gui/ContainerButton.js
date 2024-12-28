var gui_ContainerButton = $hxClasses["gui.ContainerButton"] = function(gui,stage,parent,action,isActive,onHover,buttonSpriteName) {
	if(buttonSpriteName == null) {
		buttonSpriteName = "spr_button";
	}
	this.needsAttention = false;
	this.highlightPatch = null;
	gui_Button.call(this,gui,stage,parent,action,isActive,onHover);
	this.buttonTextures = Resources.getTextures(buttonSpriteName,3);
	this.buttonPatch = new gui_NinePatch(this.buttonTextures[0],2,2,2);
	this.buttonPatch.texture = this.buttonTextures[1];
	this.buttonPatch.updateTextures(false);
	this.buttonPatch.texture = this.buttonTextures[2];
	this.buttonPatch.updateTextures(false);
	this.buttonPatch.setTextureSet(0);
	stage.addChild(this.buttonPatch);
	this.container = new gui_GUIContainer(gui,stage,this);
	this.rect = new common_Rectangle(0,0,2,2);
};
gui_ContainerButton.__name__ = "gui.ContainerButton";
gui_ContainerButton.__super__ = gui_Button;
gui_ContainerButton.prototype = $extend(gui_Button.prototype,{
	setNeedsAttention: function(needsAttention) {
		if(needsAttention == null) {
			needsAttention = false;
		}
		this.needsAttention = needsAttention;
		this.updateNeedsAttention();
	}
	,updateNeedsAttention: function() {
		if(this.buttonPatch == null) {
			return;
		}
		if(this.needsAttention && this.highlightPatch == null) {
			this.highlightPatch = new gui_NinePatch(Resources.getTexture("spr_greenoutline"),2,this.buttonPatch.npWidth,this.buttonPatch.npHeight);
			this.stage.addChild(this.highlightPatch);
			this.highlightPatch.position.set(this.rect.x,this.rect.y);
			this.highlightPatch.updateSprites();
		}
		if(this.highlightPatch != null) {
			if(this.needsAttention && this.buttonPatch.currentTextureSet == 0) {
				this.highlightPatch.alpha = (Math.sin(this.gui.guiTimer / 10) + 1) / 2;
			} else {
				this.highlightPatch.alpha = 0;
			}
		}
	}
	,updatePosition: function(newPosition) {
		gui_Button.prototype.updatePosition.call(this,newPosition);
		this.buttonPatch.position.set(newPosition.x,newPosition.y);
		this.buttonPatch.updateSprites();
		if(this.highlightPatch != null) {
			this.highlightPatch.position.set(newPosition.x,newPosition.y);
			this.highlightPatch.updateSprites();
		}
		this.container.updatePosition(newPosition);
	}
	,updateSize: function() {
		if(this.container != null) {
			this.rect.width = this.container.rect.width;
			this.rect.height = this.container.rect.height;
			this.updateSizeDisplay();
			if(this.parent != null) {
				this.parent.updateSize();
			}
			this.container.minWidth = this.container.baseWidth;
		}
	}
	,updateSizeDisplay: function() {
		if(this.container != null) {
			this.buttonPatch.npWidth = this.rect.width;
			this.buttonPatch.npHeight = this.rect.height;
			this.buttonPatch.updateSprites();
			if(this.highlightPatch != null) {
				this.highlightPatch.npWidth = this.rect.width;
				this.highlightPatch.npHeight = this.rect.height;
				this.highlightPatch.updateSprites();
			}
		}
	}
	,handleMouse: function(mouse) {
		var _gthis = this;
		return gui_Button.prototype.doHandleMouse.call(this,mouse,function() {
			_gthis.buttonPatch.setTextureSet(1);
		},function() {
			_gthis.buttonPatch.setTextureSet(2);
		});
	}
	,update: function() {
		this.container.update();
		if(this.mouseOut) {
			this.buttonPatch.setTextureSet(0);
		}
		if(this.isActive()) {
			this.buttonPatch.setTextureSet(2);
		}
		this.updateNeedsAttention();
		gui_Button.prototype.update.call(this);
	}
	,destroy: function() {
		gui_Button.prototype.destroy.call(this);
		this.container.destroy();
		this.buttonPatch.destroy();
		if(this.highlightPatch != null) {
			this.highlightPatch.destroy();
		}
	}
	,__class__: gui_ContainerButton
});
